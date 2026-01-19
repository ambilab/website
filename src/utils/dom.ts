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
