/**
 * Scroll Utilities
 *
 * Provides smooth scrolling functionality with support for offset positioning,
 * completion callbacks, and SSR safety.
 *
 * Handles scroll end detection using modern browser APIs with fallbacks for
 * older browsers.
 */

/**
 * Options for smooth scrolling to an element.
 */
export interface ScrollOptions {
    targetId: string;
    offset?: number;
    onComplete?: () => void;
    stabilityThreshold?: number;
    nearTargetThreshold?: number;
}

/**
 * Result of a scroll operation.
 */
export interface ScrollResult {
    success: boolean;
    element: HTMLElement | null;
}

/**
 * Smoothly scrolls to an element by its ID.
 *
 * Uses the native scrollTo API with smooth behavior, then waits for scroll
 * completion using the scrollend event (with polling fallback).
 *
 * Supports offset positioning and completion callbacks.
 *
 * Scroll end detection:
 * - Uses scrollend event in modern browsers
 * - Falls back to polling scroll position for stability
 * - Has a 2-second timeout as final fallback
 *
 * @param options - Scroll configuration options
 * @param options.targetId - The ID of the element to scroll to
 * @param options.offset - Optional vertical offset in pixels (default: 0)
 * @param options.onComplete - Optional callback invoked when scroll completes
 * @returns Promise resolving to scroll result with success status and element
 */
export const smoothScrollTo = async ({
    targetId,
    offset = 0,
    onComplete,
    stabilityThreshold,
    nearTargetThreshold,
}: ScrollOptions): Promise<ScrollResult> => {
    // SSR guard: return failure if the window or document is undefined
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

    // Start the smooth scroll
    window.scrollTo({ top: target, behavior: 'smooth' });

    // Wait for scroll completion with the 'scrollend' event and fallback timeout
    return new Promise<ScrollResult>((resolve) => {
        let scrollEndResolved = false;

        const FALLBACK_TIMEOUT = 2_000; // 2-second fallback timeout
        const POLL_INTERVAL = 50; // Check scroll position every 50ms
        const STABILITY_THRESHOLD = stabilityThreshold ?? 1; // Consider stable if within 1px

        // Declare timeout/interval IDs upfront to avoid TDZ issues in resolveOnce
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let pollInterval: ReturnType<typeof setInterval> | undefined;

        // Define handleScrollEnd before resolveOnce references it
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

        // Fallback: poll scroll position for stability
        let lastScrollY = window.scrollY;
        let stableCount = 0;
        const STABLE_COUNT_REQUIRED = 3; // Require 3 consecutive stable checks

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

        // Fallback timeout: check if we're near the target before resolving
        timeoutId = setTimeout(() => {
            const nearTarget = Math.abs(window.scrollY - target) < (nearTargetThreshold ?? 5);
            resolveOnce(nearTarget);
        }, FALLBACK_TIMEOUT);

        // Check if 'scrollend' is supported
        if ('onscrollend' in window) {
            window.addEventListener('scrollend', handleScrollEnd, { once: true });
        }
    });
};

/**
 * Scrolls the window to the top of the page.
 *
 * @param smooth - Whether to use smooth scrolling (default: true)
 */
export const scrollToTop = (smooth = true): void => {
    // SSR guard: return early if the window is undefined
    if (typeof window === 'undefined') {
        return;
    }

    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
    });
};
