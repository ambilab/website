import type { Locale, LocaleConfig } from '@type/locale';

export const LOCALES = ['en', 'cs'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

export const DOMAIN_LOCALE_MAP: Record<string, Locale> = {
    'ambilab.com': 'en',
    'ambilab.cz': 'cs',
    localhost: 'en',
    '127.0.0.1': 'en',
};

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
    en: {
        code: 'en',
        name: 'English',
    },
    cs: {
        code: 'cs',
        name: 'Čeština',
    },
};

/**
 * Maps locale codes to Intl locale strings for date/time formatting.
 * Used by Intl.DateTimeFormat and other Intl APIs.
 */
export const LOCALE_TO_INTL: Record<Locale, string> = {
    en: 'en-US',
    cs: 'cs-CZ',
};

export const isValidLocale = (locale: string): locale is Locale => {
    return LOCALES.includes(locale as Locale);
};
