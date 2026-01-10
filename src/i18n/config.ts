/**
 * Internationalization Configuration
 *
 * Configuration for locale detection, mapping, and formatting.
 *
 * Supports domain-based locale detection
 * (ambilab.com for English, ambilab.cz for Czech) and provides utilities
 * for locale validation and Intl API integration.
 */
import type { Locale, LocaleConfig } from '@type/locale';

/**
 * Array of supported locale codes.
 *
 * Used for type safety and runtime validation of locale values.
 */
export const LOCALES = ['en', 'cs'] as const;

/**
 * Default locale used as fallback when locale detection fails.
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Maps hostnames to their corresponding locales.
 *
 * Used for domain-based locale detection.
 *
 * Localhost and 127.0.0.1 default to English for development convenience.
 */
export const DOMAIN_LOCALE_MAP: Record<string, Locale> = {
    /**
     * Production English domain.
     */
    'ambilab.com': 'en',

    /**
     * Production Czech domain.
     */
    'ambilab.cz': 'cs',

    /**
     * Localhost development domain (defaults to English).
     */
    localhost: 'en',

    /**
     * Localhost IP address (defaults to English).
     */
    '127.0.0.1': 'en',
};

/**
 * Locale configuration objects containing display names and codes.
 *
 * Used for generating locale switchers and
 * displaying locale information in the UI.
 */
export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
    /**
     * English locale configuration.
     */
    en: {
        /**
         * Locale code identifier.
         */
        code: 'en',

        /**
         * Display name of the locale.
         */
        name: 'English',
    },

    /**
     * Czech locale configuration.
     */
    cs: {
        /**
         * Locale code identifier.
         */
        code: 'cs',

        /**
         * Display name of the locale.
         */
        name: 'Čeština',
    },
};

/**
 * Maps locale codes to Intl locale strings for date/time formatting.
 *
 * Used by Intl.DateTimeFormat and other Intl APIs.
 */
export const LOCALE_TO_INTL: Record<Locale, string> = {
    /**
     * Intl locale string for English (US).
     */
    en: 'en-US',

    /**
     * Intl locale string for Czech (Czech Republic).
     */
    cs: 'cs-CZ',
};

/**
 * Type guard to check if a string is a valid locale code.
 *
 * @param locale - The string to validate
 * @returns True if the string is a valid locale, false otherwise
 */
export const isValidLocale = (locale: string): locale is Locale => {
    return LOCALES.includes(locale as Locale);
};
