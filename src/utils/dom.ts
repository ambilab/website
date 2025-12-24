export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
};

export const toggleDarkMode = (): void => {
  // SSR guard: return early if not in a browser environment
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    !document.documentElement ||
    typeof localStorage === 'undefined'
  ) {
    return;
  }

  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
};

export const initDarkMode = (): void => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
};

