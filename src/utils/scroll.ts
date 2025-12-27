export interface ScrollOptions {
    targetId: string;
    offset?: number;
    onComplete?: () => void;
}

export interface ScrollResult {
    success: boolean;
    element: HTMLElement | null;
}

export const smoothScrollTo = async ({ targetId, offset = 0, onComplete }: ScrollOptions): Promise<ScrollResult> => {
    // SSR guard: return failure if window or document is undefined
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return { success: false, element: null };
    }

    const element = document.getElementById(targetId);

    if (!element) {
        return { success: false, element: null };
    }

    // Compute the final scroll target upfront to avoid race conditions
    const rect = element.getBoundingClientRect();
    const target = rect.top + window.scrollY + offset;

    // Start smooth scroll
    window.scrollTo({ top: target, behavior: 'smooth' });

    // Wait for scroll completion with 'scrollend' event and fallback timeout
    return new Promise<ScrollResult>((resolve) => {
        let scrollEndResolved = false;
        const FALLBACK_TIMEOUT = 2000; // 2 seconds fallback timeout
        const POLL_INTERVAL = 50; // Check scroll position every 50ms
        const STABILITY_THRESHOLD = 1; // Consider stable if within 1px

        const resolveOnce = (success: boolean) => {
            if (scrollEndResolved) return;
            scrollEndResolved = true;
            clearTimeout(timeoutId);
            clearInterval(pollInterval);
            window.removeEventListener('scrollend', handleScrollEnd);
            onComplete?.();
            resolve({ success, element });
        };

        // Listen for 'scrollend' event (modern browsers)
        const handleScrollEnd = () => {
            resolveOnce(true);
        };

        // Fallback: poll scroll position for stability
        let lastScrollY = window.scrollY;
        let stableCount = 0;
        const STABLE_COUNT_REQUIRED = 3; // Require 3 consecutive stable checks

        const pollInterval = setInterval(() => {
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

        // Fallback timeout
        const timeoutId = setTimeout(() => {
            resolveOnce(true); // Resolve anyway after timeout
        }, FALLBACK_TIMEOUT);

        // Check if 'scrollend' is supported
        if ('onscrollend' in window) {
            window.addEventListener('scrollend', handleScrollEnd, { once: true });
        }
    });
};

export const scrollToTop = (smooth = true): void => {
    // SSR guard: return early if window is undefined
    if (typeof window === 'undefined') {
        return;
    }

    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
    });
};
