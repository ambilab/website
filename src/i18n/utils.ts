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

export const getLocalizedPath = (slug: string, _locale: Locale): string => {
  // Since the site uses domain-based locale detection, all paths are the same
  // regardless of locale. The locale is determined by the domain, not the URL path.
  const cleanSlug = slug.replace(/^\/+/, ''); // Remove leading slashes
  return `/${cleanSlug}`;
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const trimmed = content.trim();
  if (!trimmed) {
    return 0;
  }

  // Remove code blocks (content between triple backticks)
  let cleaned = trimmed.replace(/```[\s\S]*?```/g, '');

  // Remove import statements (lines starting with "import")
  cleaned = cleaned.replace(/^import\s+.*?;$/gm, '');

  // Remove JSX/component tags and their attributes (content between < and >)
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Remove frontmatter if present (content between --- at the start)
  cleaned = cleaned.replace(/^---\s*[\s\S]*?---\s*/m, '');

  // Remove inline code (content between single backticks)
  cleaned = cleaned.replace(/`[^`]+`/g, '');

  // Remove markdown links but keep the text: [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // Remove markdown images: ![alt](url)
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');

  // Remove markdown headers (# ## ### etc.)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // Remove markdown list markers (-, *, +, 1., etc.)
  cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove extra whitespace and normalize
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (!cleaned) {
    return 0;
  }

  const words = cleaned.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
