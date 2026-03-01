/**
 * Detects if the user prefers reduced motion.
 * SSR-safe: returns false when window/matchMedia is unavailable.
 *
 * @returns true if prefers-reduced-motion: reduce, false otherwise
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
