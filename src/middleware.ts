import { defineMiddleware } from 'astro:middleware';
import { defaultLocale } from '@i18n/config';
import { getLocaleFromCookie, detectLocaleFromHostname } from '@i18n/utils';

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

