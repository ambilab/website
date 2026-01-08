import { localeToIntl } from '@i18n/config';
import type { Locale } from '@type/locale';

export function formatDate(date: Date, locale: Locale): string {
    return new Intl.DateTimeFormat(localeToIntl[locale], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}
