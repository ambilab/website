import type { PagesFunction } from '@cloudflare/workers-types';

interface Env {
  // Add any environment bindings here if needed
}

const domainLocaleMap: Record<string, string> = {
  'ambilab.com': 'en',
  'ambilab.cz': 'cs',
  'localhost': 'en',
  '127.0.0.1': 'en',
};

const defaultLocale = 'en';

const getLocaleFromCookie = (cookieString: string): string | null => {
  const cookies = cookieString.split(';').map((c) => c.trim());
  const localeCookie = cookies.find((c) => c.startsWith('locale='));

  if (localeCookie) {
    const locale = localeCookie.split('=')[1];
    return locale === 'en' || locale === 'cs' ? locale : null;
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

