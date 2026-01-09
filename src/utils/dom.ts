export const prefersReducedMotion = (): boolean => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const toggleDarkMode = (): void => {
    const isBrowser = typeof window === 'object' && typeof document === 'object' && typeof localStorage === 'object';

    if (isBrowser) {
        const isDarkNow = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
    }
};
