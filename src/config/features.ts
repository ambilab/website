/**
 * Feature Flags
 * Central configuration for enabling/disabling site-wide features.
 */

export const FEATURES = {
    /** Whether the locale switcher (language toggle) is shown in the menu. */
    localeSwitcher: false,

    /** Whether the newsletter signup form is displayed on pages. */
    newsletter: true,

    /** Whether the cookie consent banner is shown. */
    cookieBanner: true,

    /** Whether Plausible analytics scripts are injected (production only). */
    analytics: true,

    /** Whether the dark/light mode toggle is shown in the menu. */
    themeSwitcher: true,

    /** Whether the floating scroll-to-top button is shown. */
    goToTop: true,

    /** Whether interactive demo embeds are rendered. */
    demoEmbeds: true,

    /** Whether RSS feed links are generated and discoverable. */
    rssFeed: true,

    /** Whether JSON-LD structured data is included in page heads. */
    structuredData: true,
} as const;
