<script lang="ts">
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
    import { trackThemeSwitch } from '@utils/analytics';
    import { toggleDarkMode } from '@utils/dom';
    import { createLogger } from '@utils/logger';
    import { onMount } from 'svelte';

    interface Props {
        locale: Locale;
    }

    let { locale }: Props = $props();

    const logger = createLogger({ prefix: 'ThemeSwitcher' });
    const t = $derived(getTranslation(locale));

    const svgProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'var(--color-page-bg)',
        xmlns: 'http://www.w3.org/2000/svg',
    } as const;

    let currentTheme = $state<'light' | 'dark'>('light');

    const updateTheme = () => {
        if (typeof document !== 'undefined' && document.documentElement) {
            currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
    };

    const handleThemeToggle = (event: MouseEvent) => {
        try {
            const fromTheme = currentTheme;
            toggleDarkMode();
            updateTheme();

            trackThemeSwitch(currentTheme, fromTheme);
            logger.info(`Theme toggled to ${currentTheme}`);

            // Remove focus to prevent a persistent hover state.
            if (event.currentTarget instanceof HTMLElement) {
                event.currentTarget.blur();
            }
        } catch (error) {
            logger.error('Failed to toggle theme', error);
        }
    };

    onMount(() => {
        updateTheme();

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
    class="flex cursor-pointer items-center bg-text-primary text-text-secondary"
    aria-label={t.a11y.toggleTheme}
    title={currentTheme === 'dark' ? t.a11y.switchToLightMode : t.a11y.switchToDarkMode}
>
    <svg {...svgProps}>
        <rect x="6" y="6" width="12" height="12" />
    </svg>
</button>
