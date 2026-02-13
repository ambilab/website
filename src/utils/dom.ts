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

export const toggleDarkMode = (): void => {
    const isBrowser =
        typeof window === 'object' &&
        typeof document === 'object' &&
        typeof window.localStorage !== 'undefined' &&
        document.documentElement !== null;

    if (isBrowser) {
        const isDarkNow = document.documentElement.classList.toggle('dark');

        try {
            localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
        } catch {
            // Silent fail: localStorage is not available.
        }
    }
};
