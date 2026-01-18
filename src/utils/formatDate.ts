import { LOCALE_TO_INTL } from '@i18n/config';
import type { Locale } from '@type/locale';

const formatters = new Map<Locale, Intl.DateTimeFormat>();

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

export function formatDate(date: Date, locale: Locale): string {
    if (Number.isNaN(date.getTime())) {
        throw new Error(`formatDate received an invalid Date for locale "${locale}".`);
    }

    return getFormatter(locale).format(date);
}
