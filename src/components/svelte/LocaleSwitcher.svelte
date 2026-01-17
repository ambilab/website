<script lang="ts">
    /**
     * LocaleSwitcher Component
     *
     * Toggle button for switching between English and Czech locales.
     *
     * Updates the locale cookie and navigates to the translated version
     * of the current page using Astro's View Transitions for smooth navigation.
     *
     * Features:
     * - Toggles between English (en) and Czech (cs) locales
     * - Sets locale cookie for persistence across page loads
     * - Uses translation path if available, otherwise navigates to current path
     * - Smooth View Transitions navigation for seamless UX
     * - Prevents multiple simultaneous switches with loading state
     * - Displays target locale name with arrow indicator
     * - Accessible button with ARIA label
     * - Consistent styling with other header controls (uppercase, hover states)
     *
     * Navigation Strategy:
     * - If `translationPath` is provided, navigates to that specific page
     * - If not provided, stays on the current path in the new locale
     * - Uses Astro's View Transitions API for animated page transitions
     * - Cookie override ensures the selected locale persists
     *
     * Styling:
     * - Uses semantic color tokens (text-secondary, text-primary)
     * - Includes hover and focus states for accessibility
     * - Displays arrow indicator (&rarr;) pointing to target locale
     * - Disabled state with reduced opacity during transition
     *
     * @component
     * @example
     * ```astro
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
         * Current locale of the page (either 'en' or 'cs').
         *
         * Used to determine which locale to switch to (the opposite locale).
         */
        currentLocale: Locale;

        /**
         * Optional path to the translated version of the current page.
         *
         * If provided, navigation will go to this path when switching locales.
         * If not provided, the component will navigate to the same path in the target locale.
         *
         * Example: If on `/blog/hello-world` (en) with translationPath `/blog/ahoj-svete`,
         * clicking the switcher navigates to `/blog/ahoj-svete` (cs).
         */
        translationPath?: string | undefined;
    }

    let { currentLocale, translationPath }: Props = $props();

    /** Whether a locale switch is currently in progress. Prevents multiple simultaneous switches. */
    let isAnimating = $state(false);

    /** The target locale to switch to (opposite of current locale). */
    const otherLocale = $derived<Locale>(currentLocale === 'en' ? 'cs' : 'en');

    /** Configuration for the target locale (includes code and display name). */
    const otherConfig = $derived(LOCALE_CONFIGS[otherLocale]);

    /**
     * Handles locale switch button click.
     *
     * Sets the locale cookie to persist the user's choice,
     * then navigates to the translated page using Astro's View Transitions.
     *
     * Prevents multiple simultaneous switches with an isAnimating flag.
     * Always resets isAnimating in finally block to ensure proper state
     * regardless of navigation success, failure, or same-path resolution.
     */
    const handleLocaleSwitch = async (): Promise<void> => {
        // Prevent multiple simultaneous switches
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        try {
            // Set locale cookie to persist user's choice across page loads
            document.cookie = setLocaleCookie(otherLocale);

            // Use translation path if available, otherwise stay on current path
            const targetPath = translationPath || window.location.pathname;

            // Use Astro's navigate function to trigger View Transitions for smooth navigation
            await navigate(targetPath);
        } catch (error) {
            logger.error('Failed to switch locale', error);
        } finally {
            // Reset animating state to allow retry if navigation fails or completes without navigating
            isAnimating = false;
        }
    };
</script>

<button
    onclick={handleLocaleSwitch}
    disabled={isAnimating}
    class="[&:hover,&:focus]:text-text-primary dark:[&:hover,&:focus]:text-text-primary-dark flex cursor-pointer items-center px-2 py-1 uppercase text-text-secondary disabled:opacity-50 dark:text-text-secondary-dark"
    aria-label="Switch language"
>
    <span>&rarr; {otherConfig.name}</span>
</button>
