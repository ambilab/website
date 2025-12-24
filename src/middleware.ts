import { defineMiddleware } from 'astro:middleware';
import { defaultLocale } from '@i18n/config';
import { getLocaleFromCookie, detectLocaleFromHostname } from '@i18n/utils';

/**
 * Generate a cryptographically secure nonce for CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Astro middleware for locale detection and security headers.
 *
 * This middleware uses shared utilities from @i18n/utils and @i18n/config,
 * ensuring consistency with the rest of the application.
 *
 * NOTE: When modifying locale detection logic, also check:
 * - functions/_middleware.ts (Cloudflare Pages middleware - has duplicated code)
 * - src/i18n/config.ts (source of truth for locale configuration)
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Generate nonce for production CSP
  // In development, we still generate it for consistency but don't enforce it in CSP
  // (Astro dev toolbar and Vite inject inline scripts/styles without nonces)
  const nonce = request.headers.get('x-nonce') || generateNonce();
  context.locals.nonce = nonce;

  // Check cookie first
  const cookieHeader = request.headers.get('Cookie') || '';
  let locale = getLocaleFromCookie(cookieHeader);

  // Fallback to hostname detection
  if (!locale) {
    locale = detectLocaleFromHostname(hostname);
  }

  // Ensure locale is always defined (fallback to defaultLocale)
  // This guarantees Locals.locale is always Locale, never undefined
  context.locals.locale = locale || defaultLocale;

  const response = await next();

  // Add security headers to the response
  // IMPORTANT: When nonces are present in CSP, 'unsafe-inline' is IGNORED by browsers.
  // Therefore, in development (where Astro dev toolbar and Vite inject scripts/styles
  // without our nonce), we use 'unsafe-inline' WITHOUT nonces.
  // In production, we use strict nonce-based CSP.
  const isDev = import.meta.env.DEV;
  const scriptSrc = isDev
    ? `'self' https://plausible.io 'unsafe-inline'`
    : `'self' https://plausible.io 'nonce-${nonce}'`;
  const styleSrc = isDev
    ? `'self' https://fonts.vancura.dev 'unsafe-inline' 'unsafe-hashes'`
    : `'self' https://fonts.vancura.dev 'nonce-${nonce}' 'unsafe-hashes'`;

  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src ${scriptSrc}; style-src ${styleSrc}; img-src 'self' data: blob: https://blit-tech-demos.ambilab.com; font-src 'self' https://fonts.vancura.dev data:; connect-src 'self' https://plausible.io https://api.buttondown.email ws://localhost:* ws://127.0.0.1:*; frame-src https://blit-tech-demos.ambilab.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; ${isDev ? '' : 'upgrade-insecure-requests;'}`
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
});
