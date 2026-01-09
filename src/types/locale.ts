/**
 * Locale Type Definitions.
 *
 * TypeScript types and interfaces for locale handling, including
 * locale codes, configuration objects, and translation linking.
 */

/**
 * Supported locale codes.
 */
export type Locale = 'en' | 'cs';

/**
 * Configuration object for a locale.
 */
export interface LocaleConfig {
    /**
     * The locale code identifier (e.g., 'en', 'cs').
     */
    code: Locale;

    /**
     * The display name of the locale (e.g., 'English', 'Čeština').
     */
    name: string;
}

/**
 * Link information for translated content.
 */
// Currently unused - uncomment when needed for translation features
// export interface TranslationLink {
//     /**
//      * The locale of the translation.
//      */
//     locale: Locale;
//
//     /**
//      * The slug of the translated content.
//      */
//     slug: string;
//
//     /**
//      * The full URL to the translated content.
//      */
//     url: string;
// }
