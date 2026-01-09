import { LOCALE_TO_INTL } from '@i18n/config';
import type { Locale } from '@type/locale';

export function formatDate(date: Date, locale: Locale): string {
    return new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}
