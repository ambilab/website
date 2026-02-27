/**
 * Analytics Event Tracking Utilities
 *
 * Wrapper functions for Plausible Analytics custom events.
 * Provides type-safe event tracking with graceful degradation
 * when Plausible is not loaded (e.g., in development or with ad blockers).
 *
 * @see https://plausible.io/docs/custom-event-goals
 * @see https://plausible.io/docs/custom-props/introduction
 */

// #region Type Definitions

/** Scalar property values accepted by Plausible custom properties. */
export type PlausiblePropValue = string | number | boolean;

/** Custom properties object for Plausible events. Max 30 properties per event. */
export interface PlausibleEventProps {
    [key: string]: PlausiblePropValue;
}

/** Options for the Plausible event function. */
export interface PlausibleEventOptions {
    /** Custom properties attached to the event. */
    props?: PlausibleEventProps;
    /** Callback executed after the event is processed. */
    callback?: () => void;
    /** Revenue data for e-commerce tracking. */
    revenue?: { amount: number; currency: string };
    /** When false, the event does not affect bounce rate. Defaults to true. */
    interactive?: boolean;
}

// #endregion

// #region Core Tracking

/**
 * Track a custom event with Plausible Analytics.
 * Gracefully handles missing Plausible script (SSR, dev, ad blockers).
 *
 * @param eventName - Name of the event to track (becomes the goal name in dashboard)
 * @param options - Optional event options (props, callback, revenue, interactive)
 */
export function trackEvent(eventName: string, options?: PlausibleEventOptions): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (typeof window.plausible === 'function') {
        window.plausible(eventName, options);
    }
}

// #endregion

// #region Typed Event Helpers

/**
 * Track a successful newsletter subscription.
 *
 * @param locale - The locale of the page where signup occurred ('en' or 'cs')
 */
export function trackNewsletterSignup(locale: string): void {
    trackEvent('Newsletter Signup', { props: { locale } });
}

/**
 * Track a failed newsletter subscription attempt.
 *
 * @param locale - The locale of the page
 * @param error - Brief description of the failure reason
 */
export function trackNewsletterError(locale: string, error: string): void {
    trackEvent('Newsletter Error', { props: { locale, error } });
}

/**
 * Track cookie banner dismissal.
 *
 * @param locale - The locale of the page
 */
export function trackCookieBannerDismissed(locale: string): void {
    trackEvent('Cookie Banner Dismissed', { props: { locale } });
}

/**
 * Track theme toggle between light and dark mode.
 *
 * @param to - The theme the user switched to
 * @param from - The theme the user switched from
 */
export function trackThemeSwitch(to: 'light' | 'dark', from: 'light' | 'dark'): void {
    trackEvent('Theme Switched', { props: { to, from } });
}

/**
 * Track language switch between locales.
 *
 * @param from - Source locale
 * @param to - Target locale
 * @param hasTranslation - Whether a translated page exists for the current content
 */
export function trackLanguageSwitch(from: string, to: string, hasTranslation: boolean): void {
    trackEvent('Language Switched', { props: { from, to, hasTranslation: hasTranslation ? 'yes' : 'no' } });
}

/**
 * Track a demo embed being loaded and visible to the user.
 *
 * @param demo - The demo source URL
 * @param title - The demo title
 */
export function trackDemoLoaded(demo: string, title: string): void {
    trackEvent('Demo Loaded', { props: { demo, title } });
}

/**
 * Track a social media link click.
 *
 * @param platform - Name of the social platform (e.g., 'GitHub', 'LinkedIn')
 */
export function trackSocialLinkClick(platform: string): void {
    trackEvent('Social Link Click', { props: { platform } });
}

/** Track mobile menu being opened. */
export function trackMobileMenuOpened(): void {
    trackEvent('Mobile Menu Opened');
}

/**
 * Track scroll-to-top button usage.
 *
 * @param scrollDepth - Percentage of page scrolled when button was clicked (0-100)
 */
export function trackScrollToTop(scrollDepth: number): void {
    trackEvent('Scroll To Top', { props: { scrollDepth } });
}

/**
 * Track a call-to-action button click with context.
 *
 * @param from - Source page or section identifier
 * @param to - Destination URL or path
 * @param label - The CTA button label text
 */
export function trackCTAClick(from: string, to: string, label: string): void {
    trackEvent('CTA Click', { props: { from, to, label } });
}

// #endregion
