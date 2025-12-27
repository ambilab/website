import type { Locale, LocaleConfig } from '@type/locale';

export const locales = ['en', 'cs'] as const;

export const defaultLocale: Locale = 'en';

export const domainLocaleMap: Record<string, Locale> = {
    'ambilab.com': 'en',
    'ambilab.cz': 'cs',
    localhost: 'en',
    '127.0.0.1': 'en',
};

export const localeConfigs: Record<Locale, LocaleConfig> = {
    en: {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
    },
    cs: {
        code: 'cs',
        name: 'Čeština',
        flag: '🇨🇿',
    },
};

/**
 * Maps locale codes to Intl locale strings for date/time formatting.
 * Used by Intl.DateTimeFormat and other Intl APIs.
 */
export const localeToIntl: Record<Locale, string> = {
    en: 'en-US',
    cs: 'cs-CZ',
};

export const isValidLocale = (locale: string): locale is Locale => {
    return locales.includes(locale as Locale);
};
