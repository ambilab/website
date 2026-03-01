/**
 * Sitemap Generation Utilities
 *
 * Generates sitemap entries for all pages, news posts, and special routes
 * across both English and Czech locales, including xhtml alternate links
 * for cross-locale hreflang discovery.
 */

import { getRoute } from '@config/routes';
import { getTranslationLocale } from '@i18n/utils';
import type { Locale } from '@type/locale';
import type { CollectionEntry } from 'astro:content';

import type { LocaleContent } from './content-loader';
import { loadLocaleContent, normalizeSlug } from './content-loader';
import { buildLocaleUrl } from './hreflang-urls';
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'Sitemap' });

// #region XML Helpers

/**
 * Escapes special XML characters in a string to produce valid XML output.
 *
 * @param str - The string to escape
 * @returns The escaped string safe for XML interpolation
 */
export function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// #endregion

// #region Type Definitions

/** A single hreflang alternate link for sitemap xhtml:link output. */
export interface SitemapAlternate {
    /** Supported hreflang values for this project. */
    hreflang: Locale | 'x-default';

    /** Fully-qualified URL for this language variant. */
    href: string;
}

export interface SitemapEntry {
    url: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    lastmod?: Date;

    /** Alternate language links to include as xhtml:link elements. */
    alternates?: SitemapAlternate[];
}

// #endregion

// #region Translation Lookup Utilities

/**
 * Finds the translated page entry in the opposite locale's content collection.
 *
 * Uses the `translationSlug` frontmatter field as the lookup key against
 * the opposite locale's pageMap for O(1) performance.
 *
 * @param entry - The source page entry whose translation we want to find
 * @param oppositeContent - Pre-loaded content for the opposite locale
 * @returns The matching translated page entry, or undefined if none exists
 */
function findPageTranslation(
    entry: CollectionEntry<'pages'>,
    oppositeContent: LocaleContent,
): CollectionEntry<'pages'> | undefined {
    const translationSlug = entry.data.translationSlug;

    if (!translationSlug) {
        return undefined;
    }

    return oppositeContent.pageMap.get(normalizeSlug(translationSlug));
}

/**
 * Finds the translated news post entry in the opposite locale's content collection.
 *
 * Uses the `translationSlug` frontmatter field as the lookup key against
 * the opposite locale's newsPostMap for O(1) performance.
 *
 * @param entry - The source news post entry whose translation we want to find
 * @param oppositeContent - Pre-loaded content for the opposite locale
 * @returns The matching translated news post entry, or undefined if none exists
 */
function findNewsTranslation(
    entry: CollectionEntry<'news'>,
    oppositeContent: LocaleContent,
): CollectionEntry<'news'> | undefined {
    const translationSlug = entry.data.translationSlug;

    if (!translationSlug) {
        return undefined;
    }

    return oppositeContent.newsPostMap.get(normalizeSlug(translationSlug));
}

// #endregion

// #region Entry Generators

/**
 * Generates sitemap entries for all pages in a locale, including alternate links.
 *
 * @param pages - Array of page entries for the primary locale
 * @param locale - The primary locale of the pages
 * @param oppositeContent - Pre-loaded content for the opposite locale (for translation lookup)
 * @param oppositeLocale - The locale code for the opposite locale
 * @param oppositeContentAvailable - Whether the opposite locale content loaded successfully
 * @returns Array of sitemap entries with alternate links populated
 */
function generatePageEntries(
    pages: CollectionEntry<'pages'>[],
    locale: Locale,
    oppositeContent: LocaleContent,
    oppositeLocale: Locale,
    oppositeContentAvailable: boolean,
): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    for (const page of pages) {
        const slug = normalizeSlug(page.id);
        const url = slug === 'index' ? buildLocaleUrl(locale, '/') : buildLocaleUrl(locale, `/${slug}`);

        const alternates: SitemapAlternate[] = [{ hreflang: locale, href: url }];

        if (slug === 'index') {
            if (oppositeContentAvailable) {
                alternates.push({ hreflang: oppositeLocale, href: buildLocaleUrl(oppositeLocale, '/') });
            }
        } else {
            const translation = findPageTranslation(page, oppositeContent);

            if (translation) {
                const transSlug = normalizeSlug(translation.id);
                alternates.push({
                    hreflang: oppositeLocale,
                    href: buildLocaleUrl(oppositeLocale, `/${transSlug}`),
                });
            }
        }

        entries.push({
            url,
            changefreq: 'weekly',
            priority: slug === 'index' ? 1.0 : 0.8,
            alternates,
        });
    }

    return entries;
}

/**
 * Generates sitemap entries for all news posts in a locale, including alternate links.
 *
 * @param posts - Array of news post entries for the primary locale
 * @param locale - The primary locale of the posts
 * @param oppositeContent - Pre-loaded content for the opposite locale (for translation lookup)
 * @param oppositeLocale - The locale code for the opposite locale
 * @returns Array of sitemap entries with alternate links populated
 */
function generateNewsEntries(
    posts: CollectionEntry<'news'>[],
    locale: Locale,
    oppositeContent: LocaleContent,
    oppositeLocale: Locale,
): SitemapEntry[] {
    const entries: SitemapEntry[] = [];
    const newsRoute = getRoute('news', locale);
    const oppositeNewsRoute = getRoute('news', oppositeLocale);

    for (const post of posts) {
        const slug = normalizeSlug(post.id);
        const url = buildLocaleUrl(locale, `${newsRoute}/${slug}`);

        const alternates: SitemapAlternate[] = [{ hreflang: locale, href: url }];

        const translation = findNewsTranslation(post, oppositeContent);

        if (translation) {
            const transSlug = normalizeSlug(translation.id);
            alternates.push({
                hreflang: oppositeLocale,
                href: buildLocaleUrl(oppositeLocale, `${oppositeNewsRoute}/${transSlug}`),
            });
        }

        entries.push({
            url,
            changefreq: 'monthly',
            priority: 0.6,
            lastmod: post.data.updatedDate ?? post.data.pubDate,
            alternates,
        });
    }

    return entries;
}

/**
 * Generates sitemap entry for the news index page.
 *
 * @param locale - The locale of the news index
 * @param oppositeLocale - The opposite locale for the alternate link
 * @param oppositeContentAvailable - Whether the opposite locale content loaded successfully
 * @returns Sitemap entry for the news index with alternate links
 */
function generateNewsIndexEntry(
    locale: Locale,
    oppositeLocale: Locale,
    oppositeContentAvailable: boolean,
): SitemapEntry {
    const newsRoute = getRoute('news', locale);
    const alternates: SitemapAlternate[] = [{ hreflang: locale, href: buildLocaleUrl(locale, newsRoute) }];

    if (oppositeContentAvailable) {
        const oppositeNewsRoute = getRoute('news', oppositeLocale);
        alternates.push({ hreflang: oppositeLocale, href: buildLocaleUrl(oppositeLocale, oppositeNewsRoute) });
    }

    return {
        url: buildLocaleUrl(locale, newsRoute),
        changefreq: 'daily',
        priority: 0.7,
        alternates,
    };
}

// #endregion

/**
 * Generates all sitemap entries for a specific locale, including xhtml alternate links.
 *
 * Loads content for both locales in parallel to enable translation lookup
 * without redundant fetches.
 *
 * @param locale - The locale to generate entries for
 * @returns Array of all sitemap entries for the locale
 */
export async function generateLocaleSitemapEntries(locale: Locale): Promise<SitemapEntry[]> {
    logger.info(`Generating sitemap entries for locale: ${locale}`);

    const oppositeLocale = getTranslationLocale(locale);

    const emptyContent: LocaleContent = {
        newsPosts: [],
        pages: [],
        newsPostMap: new Map(),
        pageMap: new Map(),
    };

    // Load both locale contents in parallel.
    // The primary locale must succeed; opposite-locale failures are non-fatal.
    const [primaryResult, oppositeResult] = await Promise.allSettled([
        loadLocaleContent(locale),
        loadLocaleContent(oppositeLocale),
    ]);

    if (primaryResult.status === 'rejected') {
        logger.error(`Failed to load primary content for locale: ${locale}`, primaryResult.reason);
        throw primaryResult.reason as Error;
    }

    const content = primaryResult.value;
    let oppositeContent: LocaleContent;
    let oppositeContentAvailable: boolean;

    if (oppositeResult.status === 'rejected') {
        logger.warn(
            `Failed to load opposite locale (${oppositeLocale}) content; alternates will be omitted`,
            oppositeResult.reason,
        );
        oppositeContent = emptyContent;
        oppositeContentAvailable = false;
    } else {
        oppositeContent = oppositeResult.value;
        oppositeContentAvailable = true;
    }

    const entries: SitemapEntry[] = [];

    entries.push(
        ...generatePageEntries(content.pages, locale, oppositeContent, oppositeLocale, oppositeContentAvailable),
    );

    if (content.newsPosts.length > 0) {
        entries.push(generateNewsIndexEntry(locale, oppositeLocale, oppositeContentAvailable));
    }

    entries.push(...generateNewsEntries(content.newsPosts, locale, oppositeContent, oppositeLocale));

    logger.info(`Generated ${entries.length} sitemap entries for locale: ${locale}`);

    return entries;
}
