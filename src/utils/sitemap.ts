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
    /** BCP 47 language code (e.g. 'en', 'cs'). */
    hreflang: string;

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

    return oppositeContent.pageMap.get(translationSlug);
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

    return oppositeContent.newsPostMap.get(translationSlug);
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
 * @returns Array of sitemap entries with alternate links populated
 */
function generatePageEntries(
    pages: CollectionEntry<'pages'>[],
    locale: Locale,
    oppositeContent: LocaleContent,
    oppositeLocale: Locale,
): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    for (const page of pages) {
        const slug = normalizeSlug(page.id);
        const url = slug === 'index' ? buildLocaleUrl(locale, '/') : buildLocaleUrl(locale, `/${slug}`);

        const alternates: SitemapAlternate[] = [{ hreflang: locale, href: url }];

        if (slug === 'index') {
            // Index pages always cross-reference the opposite locale's root path.
            alternates.push({ hreflang: oppositeLocale, href: buildLocaleUrl(oppositeLocale, '/') });
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
 * @returns Sitemap entry for the news index with alternate links
 */
function generateNewsIndexEntry(locale: Locale, oppositeLocale: Locale): SitemapEntry {
    const newsRoute = getRoute('news', locale);
    const oppositeNewsRoute = getRoute('news', oppositeLocale);

    return {
        url: buildLocaleUrl(locale, newsRoute),
        changefreq: 'daily',
        priority: 0.7,
        alternates: [
            { hreflang: locale, href: buildLocaleUrl(locale, newsRoute) },
            { hreflang: oppositeLocale, href: buildLocaleUrl(oppositeLocale, oppositeNewsRoute) },
        ],
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

    try {
        const oppositeLocale = getTranslationLocale(locale);

        const [content, oppositeContent] = await Promise.all([
            loadLocaleContent(locale),
            loadLocaleContent(oppositeLocale),
        ]);

        const entries: SitemapEntry[] = [];

        entries.push(...generatePageEntries(content.pages, locale, oppositeContent, oppositeLocale));

        if (content.newsPosts.length > 0) {
            entries.push(generateNewsIndexEntry(locale, oppositeLocale));
        }

        entries.push(...generateNewsEntries(content.newsPosts, locale, oppositeContent, oppositeLocale));

        logger.info(`Generated ${entries.length} sitemap entries for locale: ${locale}`);

        return entries;
    } catch (error) {
        logger.error(`Failed to generate sitemap entries for locale: ${locale}`, error);
        throw error;
    }
}
