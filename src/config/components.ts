/**
 * Component configuration constants.
 *
 * Centralized configuration for reusable
 * components used throughout the application.
 *
 * This provides a single source of truth
 * for component behavior settings.
 */
export const COMPONENT_CONFIG = {
    /**
     * Configuration for the GoToTop component.
     */
    goToTop: {
        /**
         * Number of pixels the user must scroll
         * before the "go to top" button appears.
         */
        showAfterScroll: 300,

        /**
         * Animation duration for the fade transition in milliseconds.
         *
         * Reserved for future use: make fade transition duration configurable.
         *
         * Currently, GoToTop.svelte uses hardcoded duration: 200ms.
         */
        animationDuration: 300, // ms
    },

    /**
     * Configuration for the CookieBanner component.
     */
    cookieBanner: {
        /**
         * LocalStorage key used to track whether
         * the cookie banner has been dismissed.
         */
        dismissedKey: 'cookie-banner-dismissed',

        /**
         * Delay in milliseconds before automatically
         * hiding the cookie banner.
         *
         * Set to 0 to disable auto-hide (banner must
         * be manually dismissed).
         */
        autoHideDelay: 0,
    },
} as const;
