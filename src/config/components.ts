export const COMPONENT_CONFIG = {
    goToTop: {
        // Reserved for future use: make fade transition duration configurable
        // Currently GoToTop.svelte uses hardcoded duration: 200ms
        showAfterScroll: 300,
        animationDuration: 300, // ms
    },
    cookieBanner: {
        dismissedKey: 'cookie-banner-dismissed',
        autoHideDelay: 0,
    },
} as const;
