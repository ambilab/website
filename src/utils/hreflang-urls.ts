/**
 * Hreflang URL Builder
 *
 * Utilities for constructing locale-specific URLs with correct domains
 * for hreflang tags in bilingual SEO.
 */
import { DOMAIN_LOCALE_MAP } from '@i18n/config';
import type { Locale } from '@type/locale';

/**
 * Gets the canonical domain for a given locale.
 *
 * @param locale - The locale code ('en' or 'cs')
 * @returns The domain for that locale (e.g., 'ambilab.com' or 'ambilab.cz')
 */
function getDomainForLocale(locale: Locale): string {
    const entries = Object.entries(DOMAIN_LOCALE_MAP);
    const found = entries.find(([_domain, mappedLocale]) => mappedLocale === locale);

    if (!found) {
        return 'ambilab.com'; // Fallback to default
    }

    return found[0];
}

/**
 * Builds a full URL for a given locale and path.
 *
 * @param locale - The locale code ('en' or 'cs')
 * @param path - The relative path (e.g., '/news/hello-world' or '/novinky/ahoj-svete')
 * @returns Full URL with correct domain (e.g., 'https://ambilab.com/news/hello-world')
 */
export function buildLocaleUrl(locale: Locale, path: string): string {
    const domain = getDomainForLocale(locale);
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `https://${domain}${cleanPath}`;
}

/**
 * Extracts the path portion from a full URL.
 *
 * @param url - Full URL (e.g., 'https://ambilab.com/news/hello-world')
 * @returns Path portion (e.g., '/news/hello-world')
 */
export function extractPathFromUrl(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.pathname;
    } catch {
        // If URL parsing fails, assume it's already a path
        return url.startsWith('/') ? url : `/${url}`;
    }
}
