import type { Locale } from '@type/locale';

import { DEFAULT_LOCALE, DOMAIN_LOCALE_MAP, isValidLocale } from './config';

export const detectLocaleFromHostname = (hostname: string): Locale => {
    const key = hostname.toLowerCase().replace(/^www\./, '');
    const locale = DOMAIN_LOCALE_MAP[key];
    return locale || DEFAULT_LOCALE;
};

export const getLocaleFromCookie = (cookieString: string): Locale | null => {
    if (!cookieString) {
        return null;
    }

    const cookies = cookieString.split(';').map((c) => c.trim());
    const localeCookie = cookies.find((c) => c.startsWith('locale='));

    if (localeCookie) {
        const locale = localeCookie.split('=')[1]?.trim();

        if (locale && isValidLocale(locale)) {
            return locale;
        }
    }

    return null;
};

export const setLocaleCookie = (locale: Locale): string => {
    const maxAge = 365 * 24 * 60 * 60;
    const secure = import.meta.env.PROD ? '; Secure' : '';

    return `locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const getLocalizedPath = (slug: string, _locale: Locale): string => {
    // Domain-based locale detection keeps paths identical across locales.
    const cleanSlug = slug.replace(/^\/+/, '');

    return `/${cleanSlug}`;
};

export const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const trimmed = content.trim();
    if (!trimmed) {
        return 0;
    }

    let cleaned = trimmed.replace(/```[\s\S]*?```/g, '');
    cleaned = cleaned.replace(/^import\s+.*?;$/gm, '');
    cleaned = cleaned.replace(/<[^>]+>/g, '');
    cleaned = cleaned.replace(/^---\s*[\s\S]*?---\s*/m, '');
    cleaned = cleaned.replace(/`[^`]+`/g, '');
    cleaned = cleaned.replace(/\[(?<text>[^\]]+)]\([^)]+\)/g, '$<text>');
    cleaned = cleaned.replace(/!\[[^\]]*]\([^)]+\)/g, '');
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
    cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
    cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    if (!cleaned) {
        return 0;
    }

    const words = cleaned.split(/\s+/).length;

    return Math.ceil(words / wordsPerMinute);
};
