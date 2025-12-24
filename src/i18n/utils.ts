import type { Locale } from '@type/locale';
import { defaultLocale, domainLocaleMap, isValidLocale } from './config';

export const detectLocaleFromHostname = (hostname: string): Locale => {
  const locale = domainLocaleMap[hostname];
  return locale || defaultLocale;
};

export const getLocaleFromCookie = (cookieString: string): Locale | null => {
  const cookies = cookieString.split(';').map((c) => c.trim());
  const localeCookie = cookies.find((c) => c.startsWith('locale='));

  if (localeCookie) {
    const locale = localeCookie.split('=')[1];
    if (locale && isValidLocale(locale)) {
      return locale;
    }
  }

  return null;
};

export const setLocaleCookie = (locale: Locale): string => {
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  return `locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
};

export const getLocalizedPath = (slug: string, locale: Locale): string => {
  if (locale === defaultLocale) {
    return `/${slug}`;
  }
  return `/${locale}/${slug}`;
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

