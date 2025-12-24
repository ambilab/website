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

  return next();
});

