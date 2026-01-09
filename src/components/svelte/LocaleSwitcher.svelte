<script lang="ts">
    /**
     * LocaleSwitcher Component
     *
     * Allows users to switch between English and Czech locales.
     *
     * Updates the locale cookie and navigates to the translated version
     * of the current page using Astro's View Transitions for smooth navigation.
     *
     * Features:
     * - Toggles between English and Czech
     * - Sets locale cookie for persistence
     * - Uses a translation path if available, otherwise stays on the current path
     * - Smooth View Transitions navigation
     * - Prevents multiple simultaneous switches
     * - Displays target locale name
     * - Accessible button with aria-label
     *
     * @component
     * @example
     * ```svelte
     * <LocaleSwitcher
     *   currentLocale="en"
     *   translationPath="/cs/blog/post"
     *   client:load
     * />
     * ```
     */
    import { LOCALE_CONFIGS } from '@i18n/config';
    import { setLocaleCookie } from '@i18n/utils';
    import type { Locale } from '@type/locale';
    import { createLogger } from '@utils/logger';
    import { navigate } from 'astro:transitions/client';

    const logger = createLogger({ prefix: 'LocaleSwitcher' });

    /**
     * Props for the LocaleSwitcher component.
     */
    interface Props {
        /**
         * Current locale of the page.
         *
         * Used to determine which locale to switch to (the opposite locale).
         */
        currentLocale: Locale;

        /**
         * Path to the translated version of the current page.
         *
         * If provided, navigation will go to this path when switching locales.
         *
         * If not provided, the component will navigate to the same path
         * in the target locale.
         */
        translationPath?: string | undefined;
    }

    let { currentLocale, translationPath }: Props = $props();

    let isAnimating = $state(false);

    const otherLocale = $derived<Locale>(currentLocale === 'en' ? 'cs' : 'en');
    const otherConfig = $derived(LOCALE_CONFIGS[otherLocale]);

    const handleLocaleSwitch = async () => {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        try {
            // Set locale cookie
            document.cookie = setLocaleCookie(otherLocale);

            // Use translation path if available, otherwise stay on current path
            const targetPath = translationPath || window.location.pathname;

            // Use Astro's navigate function to trigger View Transitions
            await navigate(targetPath);
        } catch (error) {
            logger.error('Failed to switch locale', error);
            isAnimating = false;
        }
    };
</script>

<button
    onclick={handleLocaleSwitch}
    disabled={isAnimating}
    class="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-surface-hover disabled:opacity-50 dark:hover:bg-surface-hover-dark"
    aria-label="Switch language"
>
    <span>&rarr; {otherConfig.name}</span>
</button>
