export const prefersReducedMotion = (): boolean => {
    let o: boolean;

    if (typeof window === 'undefined') {
        o = false;
    } else {
        o = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return o;
};

export const toggleDarkMode = (): void => {
    const isBrowser = typeof window === 'object' && typeof document === 'object' && typeof localStorage === 'object';

    if (isBrowser && document.documentElement) {
        const isDarkNow = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
    }
};
