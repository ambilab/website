import type { PagesFunction } from '@cloudflare/workers-types';

type Env = {
  // Add any environment bindings here if needed
};

/**
 * NOTE: Code Duplication Required for Cloudflare Pages Runtime
 * 
 * This middleware runs in Cloudflare Pages runtime, which has constraints that prevent
 * importing from the shared i18n utilities in `src/i18n/`. As a result, we must duplicate
 * the following logic here:
 * - domainLocaleMap
 * - defaultLocale
 * - getLocaleFromCookie
 * - detectLocaleFromHostname
 * 
 * SYNCHRONIZATION REQUIREMENT:
 * When adding, removing, or modifying locales, you MUST update THREE locations:
 * 1. src/i18n/config.ts (source of truth)
 * 2. src/middleware.ts (Astro middleware - can import from i18n utils)
 * 3. functions/_middleware.ts (this file - Cloudflare Pages middleware)
 * 
 * The validation logic in getLocaleFromCookie MUST match the locales array in
 * src/i18n/config.ts to prevent synchronization bugs.
 */

// IMPORTANT: Keep in sync with src/i18n/config.ts
const domainLocaleMap: Record<string, string> = {
  'ambilab.com': 'en',
  'ambilab.cz': 'cs',
  'localhost': 'en',
  '127.0.0.1': 'en',
};

// IMPORTANT: Keep in sync with src/i18n/config.ts
const defaultLocale = 'en';

// IMPORTANT: Keep in sync with locales array in src/i18n/config.ts
// This validation logic mirrors isValidLocale() from src/i18n/config.ts
const validLocales = ['en', 'cs'] as const;

const isValidLocale = (locale: string): boolean => {
  return validLocales.includes(locale as typeof validLocales[number]);
};

const getLocaleFromCookie = (cookieString: string): string | null => {
  const cookies = cookieString.split(';').map((c) => c.trim());
  const localeCookie = cookies.find((c) => c.startsWith('locale='));

  if (localeCookie) {
    const locale = localeCookie.split('=')[1];
    // Use isValidLocale() instead of hard-coded check to align with src/i18n/utils.ts
    return isValidLocale(locale) ? locale : null;
  }

  return null;
};

const detectLocaleFromHostname = (hostname: string): string => {
  const locale = domainLocaleMap[hostname];
  return locale || defaultLocale;
};

export const onRequest: PagesFunction<Env> = async (context) => {
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

  // Create a new request with the x-locale header
  const newHeaders = new Headers(request.headers);
  newHeaders.set('x-locale', locale);

  const newRequest = new Request(request, {
    headers: newHeaders,
  });

  // Continue with the modified request
  return context.next(newRequest);
};

