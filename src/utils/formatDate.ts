import { LOCALE_TO_INTL } from '@i18n/config';
import type { Locale } from '@type/locale';

/**
 * Cache of DateTimeFormat instances per locale.
 *
 * Reusing formatters improves performance, especially on blog listing pages
 * where formatDate is called multiple times with the same locale.
 */
const formatters = new Map<Locale, Intl.DateTimeFormat>();

/**
 * Gets or creates a cached DateTimeFormat instance for the given locale.
 *
 * @param locale - The locale code ('en' or 'cs')
 * @returns Cached DateTimeFormat instance
 */
function getFormatter(locale: Locale): Intl.DateTimeFormat {
    let formatter = formatters.get(locale);

    if (!formatter) {
        formatter = new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        formatters.set(locale, formatter);
    }

    return formatter;
}

/**
 * Formats a date object into a human-readable
 * string based on the specified locale.
 *
 * @param date - The date object to format
 * @param locale - The locale code ('en' or 'cs')
 * @returns A formatted date string (e.g., "January 15, 2024" or "15. ledna 2024")
 */
export function formatDate(date: Date, locale: Locale): string {
    return getFormatter(locale).format(date);
}
