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

export const smoothScrollTo = async ({
    targetId,
    offset = 0,
    onComplete,
    stabilityThreshold,
    nearTargetThreshold,
}: ScrollOptions): Promise<ScrollResult> => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return { success: false, element: null };
    }

    const element = document.getElementById(targetId);

    if (!element) {
        return { success: false, element: null };
    }

    const rect = element.getBoundingClientRect();
    const target = rect.top + window.scrollY + offset;

    window.scrollTo({ top: target, behavior: 'smooth' });

    return new Promise<ScrollResult>((resolve) => {
        let scrollEndResolved = false;

        const FALLBACK_TIMEOUT = 2_000;
        const POLL_INTERVAL = 50;
        const STABILITY_THRESHOLD = stabilityThreshold ?? 1;

        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let pollInterval: ReturnType<typeof setInterval> | undefined;

        const handleScrollEnd = () => resolveOnce(true);

        const resolveOnce = (success: boolean) => {
            if (scrollEndResolved) {
                return;
            }
            scrollEndResolved = true;

            if (timeoutId) clearTimeout(timeoutId);
            if (pollInterval) clearInterval(pollInterval);

            window.removeEventListener('scrollend', handleScrollEnd);

            onComplete?.();

            resolve({ success, element });
        };

        let lastScrollY = window.scrollY;
        let stableCount = 0;
        const STABLE_COUNT_REQUIRED = 3;

        pollInterval = setInterval(() => {
            const currentScrollY = window.scrollY;
            const diff = Math.abs(currentScrollY - lastScrollY);

            if (diff < STABILITY_THRESHOLD) {
                stableCount++;
                if (stableCount >= STABLE_COUNT_REQUIRED) {
                    resolveOnce(true);
                }
            } else {
                stableCount = 0;
                lastScrollY = currentScrollY;
            }
        }, POLL_INTERVAL);

        timeoutId = setTimeout(() => {
            const nearTarget = Math.abs(window.scrollY - target) < (nearTargetThreshold ?? 5);
            resolveOnce(nearTarget);
        }, FALLBACK_TIMEOUT);

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
