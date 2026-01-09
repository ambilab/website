/**
 * Internationalization Utilities
 *
 * Utility functions for locale detection, cookie management,
 * path localization, and content processing (reading time calculation).
 */
import type { Locale } from '@type/locale';

import { DEFAULT_LOCALE, DOMAIN_LOCALE_MAP, isValidLocale } from './config';

/**
 * Detects the locale based on the hostname.
 *
 * Uses DOMAIN_LOCALE_MAP to determine the locale from the domain.
 * Falls back to DEFAULT_LOCALE if the hostname is not in the map.
 *
 * @param hostname - The hostname to detect locale from (e.g., 'ambilab.com')
 * @returns The detected locale code
 */
export const detectLocaleFromHostname = (hostname: string): Locale => {
    const locale = DOMAIN_LOCALE_MAP[hostname];
    return locale || DEFAULT_LOCALE;
};

/**
 * Extracts the locale from a cookie string.
 *
 * Parses the cookie header to find the 'locale' cookie
 * value and validates it against supported locales.
 *
 * @param cookieString - The raw cookie header string
 * @returns The locale if found and valid, null otherwise
 */
export const getLocaleFromCookie = (cookieString: string): Locale | null => {
    if (!cookieString) {
        return null;
    }

    const cookies = cookieString.split(';').map((c) => c.trim());
    const localeCookie = cookies.find((c) => c.startsWith('locale='));

    if (localeCookie) {
        const locale = localeCookie.split('=')[1]?.trim();

        if (locale && isValidLocale(locale)) {
            return locale;
        }
    }

    return null;
};

/**
 * Generates a Set-Cookie header value for the locale cookie.
 *
 * Creates a cookie that persists for 1 year with appropriate security
 * settings. Uses a Secure flag in production, Lax SameSite policy.
 *
 * @param locale - The locale code to store in the cookie
 * @returns The Set-Cookie header value
 */
export const setLocaleCookie = (locale: Locale): string => {
    const maxAge = 365 * 24 * 60 * 60; // 1 year
    const secure = import.meta.env.PROD ? '; Secure' : '';

    return `locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

/**
 * Generates a localized path for a given slug.
 *
 * Since the site uses domain-based locale detection,
 * paths are the same regardless of locale.
 *
 * The locale parameter is accepted for API consistency
 * but does not affect the returned path.
 *
 * @param slug - The path slug to localize
 * @param _locale - The locale (unused, kept for API consistency)
 * @returns The cleaned path with leading slashes removed
 */
export const getLocalizedPath = (slug: string, _locale: Locale): string => {
    // Since the site uses domain-based locale detection, all paths are the same
    // regardless of locale. The locale is determined by the domain, not the URL path.
    const cleanSlug = slug.replace(/^\/+/, ''); // Remove leading slashes

    return `/${cleanSlug}`;
};

/**
 * Calculates the estimated reading time for content in minutes.
 *
 * Processes Markdown content by removing code blocks, frontmatter,
 * HTML tags, and other non-readable elements before counting words.
 *
 * Assumes an average reading speed of 200 words per minute.
 *
 * @param content - The Markdown content to analyze
 * @returns The estimated reading time in minutes (rounded up)
 */
export const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const trimmed = content.trim();
    if (!trimmed) {
        return 0;
    }

    // Remove code blocks (content between triple backticks)
    let cleaned = trimmed.replace(/```[\s\S]*?```/g, '');

    // Remove import statements (lines starting with "import")
    cleaned = cleaned.replace(/^import\s+.*?;$/gm, '');

    // Remove JSX/component tags and their attributes (content between < and >)
    cleaned = cleaned.replace(/<[^>]+>/g, '');

    // Remove frontmatter if present (content between --- at the start)
    cleaned = cleaned.replace(/^---\s*[\s\S]*?---\s*/m, '');

    // Remove inline code (content between single backticks)
    cleaned = cleaned.replace(/`[^`]+`/g, '');

    // Remove Markdown links but keep the text: [text](url) -> text
    cleaned = cleaned.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');

    // Remove Markdown images: ![alt](url)
    cleaned = cleaned.replace(/!\[([^\]]*)]\([^)]+\)/g, '');

    // Remove Markdown headers (# ## ### etc.)
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

    // Remove Markdown list markers (-, *, +, 1., etc.)
    cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
    cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

    // Remove extra whitespace and normalize
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    if (!cleaned) {
        return 0;
    }

    const words = cleaned.split(/\s+/).length;

    return Math.ceil(words / wordsPerMinute);
};
