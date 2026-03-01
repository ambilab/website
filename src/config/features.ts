/**
 * Feature Flags
 *
 * Central configuration for enabling/disabling site-wide features.
 * Each flag can be overridden via a corresponding PUBLIC_* environment variable.
 * Set the env var to "true" or "false" to override the default value.
 */

/**
 * Parses a resolved environment variable value as a boolean feature flag.
 * Returns true/false when the value is explicitly "true"/"false",
 * otherwise falls back to the provided default.
 *
 * @param envValue - The resolved env var value (must be passed as a static import.meta.env.PUBLIC_* access)
 * @param defaultValue - Default value when the env var is unset or invalid
 */
function featureFlag(envValue: string | undefined, defaultValue: boolean): boolean {
    const value = envValue?.toLowerCase();

    if (value === 'true') return true;
    if (value === 'false') return false;
    return defaultValue;
}

export const FEATURES = {
    /** Whether the locale switcher (language toggle) is shown in the menu. */
    localeSwitcher: featureFlag(import.meta.env.PUBLIC_LOCALE_SWITCHER, false),

    /** Whether the newsletter signup form is displayed on pages. */
    newsletter: featureFlag(import.meta.env.PUBLIC_NEWSLETTER, true),

    /** Whether the cookie consent banner is shown. */
    cookieBanner: featureFlag(import.meta.env.PUBLIC_COOKIE_BANNER, true),

    /** Whether Plausible analytics scripts are injected (production only). */
    analytics: featureFlag(import.meta.env.PUBLIC_ANALYTICS, true),

    /** Whether the floating scroll-to-top button is shown. */
    goToTop: featureFlag(import.meta.env.PUBLIC_GO_TO_TOP, true),

    /** Whether interactive demo embeds are rendered. */
    demoEmbeds: featureFlag(import.meta.env.PUBLIC_DEMO_EMBEDS, true),

    /** Whether RSS feed links are generated and discoverable. */
    rssFeed: featureFlag(import.meta.env.PUBLIC_RSS_FEED, true),

    /** Whether JSON-LD structured data is included in page heads. */
    structuredData: featureFlag(import.meta.env.PUBLIC_STRUCTURED_DATA, true),
} as const;
