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

    try {
        if (typeof window.plausible === 'function') {
            window.plausible(eventName, options);
        }
    } catch {
        // Silently swallow tracking errors so they never break user flows.
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
 * Map a raw error message to a safe, bounded error code.
 * Returns a predefined code for known errors, or 'unknown_error' for anything else.
 * This prevents leaking sensitive error details to third-party analytics.
 *
 * @param error - Raw error message from the newsletter form
 * @returns A safe error code suitable for analytics
 */
function getNewsletterErrorCode(error: string): string {
    const normalized = error.toLowerCase();

    if (normalized.includes('invalid') && normalized.includes('email')) return 'invalid_email';
    if (normalized.includes('already') || normalized.includes('subscribed')) return 'already_subscribed';
    if (normalized.includes('rate') || normalized.includes('limit')) return 'rate_limited';
    if (normalized.includes('network') || normalized.includes('fetch')) return 'network_error';
    if (normalized.includes('server') || normalized.includes('500')) return 'server_error';
    if (normalized.includes('validation')) return 'validation_error';

    return 'unknown_error';
}

/**
 * Track a failed newsletter subscription attempt.
 * The raw error message is mapped to a safe error code to avoid
 * leaking sensitive information to third-party analytics.
 *
 * @param locale - The locale of the page
 * @param error - Raw error message (will be sanitized before sending)
 */
export function trackNewsletterError(locale: string, error: string): void {
    const errorCode = getNewsletterErrorCode(error);
    trackEvent('Newsletter Error', { props: { locale, errorCode } });
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
 * Track language switch between locales.
 *
 * @param from - Source locale
 * @param to - Target locale
 * @param hasTranslation - Whether a translated page exists for the current content
 */
export function trackLanguageSwitch(from: string, to: string, hasTranslation: boolean): void {
    trackEvent('Language Switched', { props: { from, to, hasTranslation } });
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
    const clamped = Math.max(0, Math.min(100, Math.round(scrollDepth)));
    trackEvent('Scroll To Top', { props: { scrollDepth: clamped } });
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
