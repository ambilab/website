<script lang="ts">
    import { toggleDarkMode } from '@utils/dom';
    import { createLogger } from '@utils/logger';

    const logger = createLogger({ prefix: 'ThemeSwitcher' });

    const svgProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
    } as const;

    let currentTheme = $state<'light' | 'dark'>('light');
    let mounted = $state(false);

    const updateTheme = () => {
        if (typeof document !== 'undefined' && document.documentElement) {
            currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
    };

    const handleThemeToggle = (event: MouseEvent) => {
        try {
            toggleDarkMode();
            updateTheme();

            logger.info(`Theme toggled to ${currentTheme}`);

            // Remove focus to prevent a persistent hover state.
            if (event.currentTarget instanceof HTMLElement) {
                event.currentTarget.blur();
            }
        } catch (error) {
            logger.error('Failed to toggle theme', error);
        }
    };

    $effect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        updateTheme();

        mounted = true;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (!localStorage.getItem('theme')) {
                const prefersDark = mediaQuery.matches;

                if (document?.documentElement) {
                    document.documentElement.classList.toggle('dark', prefersDark);
                }

                currentTheme = prefersDark ? 'dark' : 'light';
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    });
</script>

<button
    onclick={handleThemeToggle}
    class="[&:hover,&:focus]:text-text-primary dark:[&:hover,&:focus]:text-text-primary-dark [&:hover,&:focus]:bg-surface-hover dark:[&:hover,&:focus]:bg-surface-hover-dark -mr-[6px] flex cursor-pointer items-center text-text-secondary dark:text-text-secondary-dark"
    class:opacity-0={!mounted}
    class:opacity-100={mounted}
    aria-label="Toggle theme"
    title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
    <svg {...svgProps}>
        <path
            d="M13.5,9 L13.5,10.5 L15,10.5 L15,13.5 L13.5,13.5 L13.5,15 L10.5,15 L10.5,13.5 L9,13.5 L9,10.5 L10.5,10.5 L10.5,9 L13.5,9 Z M6,6 L8,6 L8,8 L6,8 Z M11,4 L13,4 L13,6 L11,6 Z M11,18 L13,18 L13,20 L11,20 Z M4,11 L6,11 L6,13 L4,13 Z M18,11 L20,11 L20,13 L18,13 Z M16,6 L18,6 L18,8 L16,8 Z M16,16 L18,16 L18,18 L16,18 Z M6,16 L8,16 L8,18 L6,18 Z"
            fill="currentColor"
        ></path>
    </svg>
</button>
