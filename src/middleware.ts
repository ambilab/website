import { defineMiddleware } from 'astro:middleware';
import { defaultLocale } from '@i18n/config';
import { getLocaleFromCookie, detectLocaleFromHostname } from '@i18n/utils';

/**
 * Astro middleware for locale detection.
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

  // Check cookie first
  const cookieHeader = request.headers.get('Cookie') || '';
  let locale = getLocaleFromCookie(cookieHeader);

  // Fallback to hostname detection
  if (!locale) {
    locale = detectLocaleFromHostname(hostname);
  }

  // Store locale in context for pages to access
  context.locals.locale = locale;

  const response = await next();

  // Add security headers to the response
  // NOTE: 'unsafe-inline' is currently required for inline JSON-LD structured data script.
  // TODO: Consider implementing nonces (Astro v5 supports this) to remove 'unsafe-inline' for better XSS protection.
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://plausible.io 'unsafe-inline'; style-src 'self' https://fonts.vancura.dev 'unsafe-inline'; img-src 'self' data: blob: https://blit-tech-demos.ambilab.com; font-src 'self' https://fonts.vancura.dev data:; connect-src 'self' https://plausible.io https://api.buttondown.email; frame-src https://blit-tech-demos.ambilab.com; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
});
