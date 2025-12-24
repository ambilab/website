import type { PagesFunction } from '@cloudflare/workers-types';

type Env = {
  // Add any environment bindings here if needed
};

/**
 * Generate a cryptographically secure nonce for CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

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
 * - generateNonce (for CSP)
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
  localhost: 'en',
  '127.0.0.1': 'en',
};

// IMPORTANT: Keep in sync with src/i18n/config.ts
const defaultLocale = 'en';

// IMPORTANT: Keep in sync with locales array in src/i18n/config.ts
// This validation logic mirrors isValidLocale() from src/i18n/config.ts
const validLocales = ['en', 'cs'] as const;

const isValidLocale = (locale: string): boolean => {
  return validLocales.includes(locale as (typeof validLocales)[number]);
};

const getLocaleFromCookie = (cookieString: string): string | null => {
  if (!cookieString) {
    return null;
  }

  const cookies = cookieString.split(';').map((c) => c.trim());
  const localeCookie = cookies.find((c) => c.startsWith('locale='));

  if (localeCookie) {
    const locale = localeCookie.split('=')[1]?.trim();
    // Use isValidLocale() instead of hard-coded check to align with src/i18n/utils.ts
    return locale && isValidLocale(locale) ? locale : null;
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

  // Generate a cryptographically secure nonce for this request
  const nonce = generateNonce();

  // Check cookie first
  const cookieHeader = request.headers.get('Cookie') || '';
  let locale = getLocaleFromCookie(cookieHeader);

  // Fallback to hostname detection
  if (!locale) {
    locale = detectLocaleFromHostname(hostname);
  }

  // Ensure locale is always defined (fallback to defaultLocale)
  // This guarantees consistency with src/middleware.ts
  locale = locale || defaultLocale;

  // Create a new request with the x-locale and x-nonce headers
  // x-nonce will be used by Astro middleware to set context.locals.nonce
  const newHeaders = new Headers(request.headers);
  newHeaders.set('x-locale', locale);
  newHeaders.set('x-nonce', nonce);

  const newRequest = new Request(request, {
    headers: newHeaders,
  });

  // Get the response
  const response = await context.next(newRequest);

  // Add security headers to the response
  const responseHeaders = new Headers(response.headers);

  // Content Security Policy
  // Using nonce-based CSP for inline scripts and styles
  // 'unsafe-hashes' allows inline style attributes (e.g., style="...")
  // Cloudflare Pages middleware only runs in production, so we use strict CSP
  responseHeaders.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' https://plausible.io 'nonce-${nonce}'; style-src 'self' https://fonts.vancura.dev 'nonce-${nonce}' 'unsafe-hashes'; img-src 'self' data: blob: https://blit-tech-demos.ambilab.com; font-src 'self' https://fonts.vancura.dev data:; connect-src 'self' https://plausible.io https://api.buttondown.email; frame-src https://blit-tech-demos.ambilab.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`
  );

  // X-Content-Type-Options
  responseHeaders.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options (defense-in-depth, complements CSP frame-ancestors)
  responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');

  // Referrer-Policy
  responseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy
  responseHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Return response with security headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};
