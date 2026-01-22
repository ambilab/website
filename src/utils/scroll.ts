export interface ScrollOptions {
    targetId: string;
    offset?: number;
    onComplete?: () => void;
    stabilityThreshold?: number;
    nearTargetThreshold?: number;
}

export interface ScrollResult {
    success: boolean;
    element: HTMLElement | null;
}

interface ScrollMonitor {
    pollInterval: ReturnType<typeof setInterval>;
    timeoutId: ReturnType<typeof setTimeout>;
}

const createScrollMonitor = (
    onStable: () => void,
    stabilityThreshold: number,
    pollInterval: number,
): { monitor: ReturnType<typeof setInterval> } => {
    let lastScrollY = window.scrollY;
    let stableCount = 0;

    const stableCountRequired = 3;

    const monitor = setInterval(() => {
        const currentScrollY = window.scrollY;
        const diff = Math.abs(currentScrollY - lastScrollY);

        if (diff < stabilityThreshold) {
            stableCount++;

            if (stableCount >= stableCountRequired) {
                onStable();
            }
        } else {
            stableCount = 0;

            lastScrollY = currentScrollY;
        }
    }, pollInterval);

    return { monitor };
};

const isNearTarget = (target: number, threshold: number): boolean => {
    return Math.abs(window.scrollY - target) < threshold;
};

const cleanupScrollMonitor = (monitor: ScrollMonitor, scrollEndHandler: () => void): void => {
    clearTimeout(monitor.timeoutId);
    clearInterval(monitor.pollInterval);

    window.removeEventListener('scrollend', scrollEndHandler);
};

const validateScrollEnvironment = (targetId: string): ScrollResult => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return { success: false, element: null };
    }

    const element = document.getElementById(targetId);

    if (!element) {
        return { success: false, element: null };
    }

    return { success: true, element };
};

export const smoothScrollTo = async ({
    targetId,
    offset = 0,
    onComplete,
    stabilityThreshold,
    nearTargetThreshold,
}: ScrollOptions): Promise<ScrollResult> => {
    const validation = validateScrollEnvironment(targetId);

    if (!validation.success || !validation.element) {
        return validation;
    }

    const element = validation.element;
    const rect = element.getBoundingClientRect();
    const target = rect.top + window.scrollY + offset;

    window.scrollTo({ top: target, behavior: 'smooth' });

    return new Promise<ScrollResult>((resolve) => {
        let resolved = false;

        const FALLBACK_TIMEOUT = 2_000;
        const POLL_INTERVAL = 50;
        const STABILITY_THRESHOLD = stabilityThreshold ?? 1;
        const NEAR_TARGET_THRESHOLD = nearTargetThreshold ?? 5;

        const resolveOnce = (success: boolean) => {
            if (resolved) return;
            resolved = true;

            cleanupScrollMonitor(monitor, handleScrollEnd);
            resolve({ success, element });

            try {
                onComplete?.();
            } catch {
                // Swallow to avoid leaving the Promise unresolved.
            }
        };

        const handleScrollEnd = () => resolveOnce(isNearTarget(target, NEAR_TARGET_THRESHOLD));

        const { monitor: pollInterval } = createScrollMonitor(
            () => resolveOnce(isNearTarget(target, NEAR_TARGET_THRESHOLD)),
            STABILITY_THRESHOLD,
            POLL_INTERVAL,
        );

        const timeoutId = setTimeout(() => {
            resolveOnce(isNearTarget(target, NEAR_TARGET_THRESHOLD));
        }, FALLBACK_TIMEOUT);

        const monitor: ScrollMonitor = { pollInterval, timeoutId };

        if ('onscrollend' in window) {
            window.addEventListener('scrollend', handleScrollEnd, { once: true });
        }
    });
};

export const scrollToTop = (smooth = true): void => {
    if (typeof window === 'undefined') {
        return;
    }

    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
    });
};
