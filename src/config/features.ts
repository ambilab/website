/**
 * Feature Flags
 *
 * Central configuration for enabling/disabling site-wide features.
 * Each flag can be overridden via a corresponding PUBLIC_* environment variable.
 * Set the env var to "true" or "false" to override the default value.
 */

/**
 * Reads a boolean feature flag from an environment variable.
 * Returns the env var value when explicitly set to "true" or "false",
 * otherwise falls back to the provided default.
 *
 * @param envVar - The PUBLIC_* environment variable name
 * @param defaultValue - Default value when the env var is unset or invalid
 */
function featureFlag(envVar: string, defaultValue: boolean): boolean {
    const value = (import.meta.env[envVar] as string | undefined)?.toLowerCase();

    if (value === 'true') return true;
    if (value === 'false') return false;
    return defaultValue;
}

export const FEATURES = {
    /** Whether the locale switcher (language toggle) is shown in the menu. */
    localeSwitcher: featureFlag('PUBLIC_LOCALE_SWITCHER', false),

    /** Whether the newsletter signup form is displayed on pages. */
    newsletter: featureFlag('PUBLIC_NEWSLETTER', true),

    /** Whether the cookie consent banner is shown. */
    cookieBanner: featureFlag('PUBLIC_COOKIE_BANNER', true),

    /** Whether Plausible analytics scripts are injected (production only). */
    analytics: featureFlag('PUBLIC_ANALYTICS', true),

    /** Whether the dark/light mode toggle is shown in the menu. */
    themeSwitcher: featureFlag('PUBLIC_THEME_SWITCHER', true),

    /** Whether the floating scroll-to-top button is shown. */
    goToTop: featureFlag('PUBLIC_GO_TO_TOP', true),

    /** Whether interactive demo embeds are rendered. */
    demoEmbeds: featureFlag('PUBLIC_DEMO_EMBEDS', true),

    /** Whether RSS feed links are generated and discoverable. */
    rssFeed: featureFlag('PUBLIC_RSS_FEED', true),

    /** Whether JSON-LD structured data is included in page heads. */
    structuredData: featureFlag('PUBLIC_STRUCTURED_DATA', true),
} as const;
