/**
 * Sitemap Generation Utilities
 *
 * Generates sitemap entries for all pages, news posts, and special routes
 * across both English and Czech locales.
 */

import { LOCALES } from '@i18n/config';
import type { Locale } from '@type/locale';
import type { CollectionEntry } from 'astro:content';

import { loadLocaleContent, normalizeSlug } from './content-loader';
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'Sitemap' });

export interface SitemapEntry {
    url: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    lastmod?: Date;
}

/**
 * Gets the domain for a given locale.
 *
 * @param locale - The locale to get the domain for
 * @returns The domain URL
 */
export function getLocaleDomain(locale: Locale): string {
    return locale === 'cs' ? 'https://ambilab.cz' : 'https://ambilab.com';
}

/**
 * Generates sitemap entries for all pages in a locale.
 *
 * @param pages - Array of page entries
 * @param locale - The locale of the pages
 * @returns Array of sitemap entries
 */
function generatePageEntries(pages: CollectionEntry<'pages'>[], locale: Locale): SitemapEntry[] {
    const domain = getLocaleDomain(locale);
    const entries: SitemapEntry[] = [];

    for (const page of pages) {
        const slug = normalizeSlug(page.id);
        const url = slug === 'index' ? `${domain}/` : `${domain}/${slug}`;

        entries.push({
            url,
            changefreq: 'weekly',
            priority: slug === 'index' ? 1.0 : 0.8,
        });
    }

    return entries;
}

/**
 * Generates sitemap entries for all news posts in a locale.
 *
 * @param posts - Array of news post entries
 * @param locale - The locale of the posts
 * @returns Array of sitemap entries
 */
function generateNewsPostEntries(posts: CollectionEntry<'news'>[], locale: Locale): SitemapEntry[] {
    const domain = getLocaleDomain(locale);
    const entries: SitemapEntry[] = [];

    for (const post of posts) {
        const slug = normalizeSlug(post.id);
        const url = `${domain}/news/${slug}`;

        entries.push({
            url,
            changefreq: 'monthly',
            priority: 0.6,
            lastmod: post.data.updatedDate || post.data.pubDate,
        });
    }

    return entries;
}

/**
 * Generates sitemap entry for the news index page.
 *
 * @param locale - The locale of the news index
 * @returns Sitemap entry for the news index
 */
function generateNewsIndexEntry(locale: Locale): SitemapEntry {
    const domain = getLocaleDomain(locale);

    return {
        url: `${domain}/news`,
        changefreq: 'daily',
        priority: 0.7,
    };
}

/**
 * Generates all sitemap entries for a specific locale.
 *
 * @param locale - The locale to generate entries for
 * @returns Array of all sitemap entries for the locale
 */
export async function generateLocaleSitemapEntries(locale: Locale): Promise<SitemapEntry[]> {
    logger.info(`Generating sitemap entries for locale: ${locale}`);

    try {
        const content = await loadLocaleContent(locale);
        const entries: SitemapEntry[] = [];

        // Add page entries
        entries.push(...generatePageEntries(content.pages, locale));

        // Add news index entry (only if there are news posts)
        if (content.newsPosts.length > 0) {
            entries.push(generateNewsIndexEntry(locale));
        }

        // Add news post entries
        entries.push(...generateNewsPostEntries(content.newsPosts, locale));

        logger.info(`Generated ${entries.length} sitemap entries for locale: ${locale}`);

        return entries;
    } catch (error) {
        logger.error(`Failed to generate sitemap entries for locale: ${locale}`, error);
        throw error;
    }
}

/**
 * Generates all sitemap entries for all supported locales.
 *
 * @returns Array of all sitemap entries
 */
export async function generateAllSitemapEntries(): Promise<SitemapEntry[]> {
    logger.info('Generating sitemap entries for all locales');

    const startTime = performance.now();

    try {
        // Generate entries for all locales in parallel
        const localeEntriesArrays = await Promise.all(LOCALES.map((locale) => generateLocaleSitemapEntries(locale)));

        const allEntries = localeEntriesArrays.flat();

        const duration = performance.now() - startTime;

        logger.info(
            `Generated ${allEntries.length} total sitemap entries for ${LOCALES.length} locales in ${duration.toFixed(2)}ms`,
        );

        return allEntries;
    } catch (error) {
        logger.error('Failed to generate sitemap entries', error);
        throw error;
    }
}
