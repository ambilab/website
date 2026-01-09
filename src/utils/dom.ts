/**
 * Determines if the user prefers reduced motion
 * based on the browser's media query.
 *
 * This function is safe for server-side rendering (SSR)
 * as it checks whether the runtime environment supports `window`.
 *
 * It will return false if executed in a non-browser environment.
 *
 * @returns {boolean} True if the user prefers reduced motion, false otherwise.
 */
// Currently unused - uncomment when needed for accessibility features
// export const prefersReducedMotion = (): boolean => {
//     return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// };

/**
 * Toggles the dark mode state of the application by adding or removing the
 * "dark" class on the root HTML element (`<html>`).
 *
 * The updated theme state is persisted in localStorage under the key "theme".
 *
 * This function is safe for server-side rendering (SSR) as it checks whether
 * the runtime environment supports `window`, `document`, and `localStorage`.
 *
 * It will do nothing if executed in a non-browser environment.
 *
 * Behavior:
 * - If the "dark" class is not present on the root element, it will be added.
 * - If the "dark" class is already present, it will be removed.
 * - Updates the value of "theme" in localStorage to either "dark" or "light", matching
 *   the updated state of the "dark" class on the root element.
 */
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
            // Silently fail in privacy mode or when storage is unavailable
        }
    }
};
