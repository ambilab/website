/**
 * Translation Validation Script
 *
 * Validates that all locales have complete translation keys.
 * Ensures en and cs have the same structure with no missing keys.
 */

import { LOCALES } from '@i18n/config';
import { translations } from '@i18n/translations';
import type { Locale } from '@type/locale';

type NestedKeys = string[];

function getNestedKeys(obj: unknown, prefix = ''): NestedKeys {
    if (obj === null || typeof obj !== 'object') {
        return [];
    }

    const keys: NestedKeys = [];
    const record = obj as Record<string, unknown>;

    for (const key of Object.keys(record)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        const value = record[key];

        if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            keys.push(...getNestedKeys(value, fullPath));
        } else {
            keys.push(fullPath);
        }
    }

    return keys;
}

function validateTranslations(): void {
    const baseLocale: Locale = 'en';
    const baseKeys = new Set(getNestedKeys(translations[baseLocale]));
    const missingByLocale: Record<string, NestedKeys> = {};
    const extraByLocale: Record<string, NestedKeys> = {};
    let hasErrors = false;

    for (const locale of LOCALES) {
        if (locale === baseLocale) continue;

        const localeKeys = new Set(getNestedKeys(translations[locale]));
        const missing: NestedKeys = [];
        const extra: NestedKeys = [];

        for (const key of baseKeys) {
            if (!localeKeys.has(key)) {
                missing.push(key);
            }
        }

        for (const key of localeKeys) {
            if (!baseKeys.has(key)) {
                extra.push(key);
            }
        }

        if (missing.length > 0) {
            missingByLocale[locale] = missing;
            hasErrors = true;
        }

        if (extra.length > 0) {
            extraByLocale[locale] = extra;
            hasErrors = true;
        }
    }

    if (hasErrors) {
        console.error('[validate-translations] Translation key completeness check failed.\n');

        for (const [locale, keys] of Object.entries(missingByLocale)) {
            console.error(`Missing in ${locale} (${keys.length} keys):`);
            for (const key of keys.sort()) {
                console.error(`  - ${key}`);
            }
            console.error('');
        }

        for (const [locale, keys] of Object.entries(extraByLocale)) {
            console.error(`Extra in ${locale} (not in ${baseLocale}):`);
            for (const key of keys.sort()) {
                console.error(`  - ${key}`);
            }
            console.error('');
        }

        process.exit(1);
    }

    console.log('[validate-translations] All locales have complete translation keys.');
}

validateTranslations();
