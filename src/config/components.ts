export const COMPONENT_CONFIG = {
    goToTop: {
        showAfterScroll: 300, // pixels
        // Reserved for future use: make fade transition duration configurable
        // Currently GoToTop.svelte uses hardcoded duration: 200ms
        animationDuration: 300, // ms
    },
    cookieBanner: {
        dismissedKey: 'cookie-banner-dismissed',
        autoHideDelay: 0, // 0 = no auto-hide
    },
} as const;
