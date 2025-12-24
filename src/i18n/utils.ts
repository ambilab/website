import type { Locale } from '@type/locale';
import { defaultLocale, domainLocaleMap, isValidLocale } from './config';

export const detectLocaleFromHostname = (hostname: string): Locale => {
  const locale = domainLocaleMap[hostname];
  return locale || defaultLocale;
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
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  const secure = import.meta.env.PROD ? '; Secure' : '';
  return `locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const getLocalizedPath = (slug: string, locale: Locale): string => {
  const cleanSlug = slug.replace(/^\/+/, ''); // Remove leading slashes
  if (locale === defaultLocale) {
    return `/${cleanSlug}`;
  }
  return `/${locale}/${cleanSlug}`;
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const trimmed = content.trim();
  if (!trimmed) {
    return 0;
  }
  const words = trimmed.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
