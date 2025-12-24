import { defineMiddleware } from 'astro:middleware';
import type { Locale } from '@type/locale';
import { defaultLocale } from '@i18n/config';

const domainLocaleMap: Record<string, Locale> = {
  'ambilab.com': 'en',
  'ambilab.cz': 'cs',
  'localhost': 'en',
  '127.0.0.1': 'en',
};

const getLocaleFromCookie = (cookieString: string): Locale | null => {
  const cookies = cookieString.split(';').map((c) => c.trim());
  const localeCookie = cookies.find((c) => c.startsWith('locale='));

  if (localeCookie) {
    const locale = localeCookie.split('=')[1];
    return locale === 'en' || locale === 'cs' ? (locale as Locale) : null;
  }

  return null;
};

const detectLocaleFromHostname = (hostname: string): Locale => {
  const locale = domainLocaleMap[hostname];
  return locale || defaultLocale;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Check cookie first
  const cookieHeader = request.headers.get('Cookie') || '';
  let locale = getLocaleFromCookie(cookieHeader);

  // Fallback to hostname detection
  if (!locale) {
    locale = detectLocaleFromHostname(hostname);
  }

  // Set the locale in the request headers so pages can access it
  request.headers.set('x-locale', locale);

  return next();
});

