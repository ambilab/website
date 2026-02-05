/**
 * Content Collection Loader
 *
 * Optimized content loading utilities for blog posts and pages.
 *
 * This module provides O(1) lookup performance via indexed Maps and eliminates
 * duplicate collection fetching by loading all content once in parallel.
 */

import type { Locale } from '@type/locale';
import { ContentError } from '@utils/errors';
import { createLogger } from '@utils/logger';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

const logger = createLogger({ prefix: 'ContentLoader' });

/**
 * Normalized slug extracted from a content entry ID.
 * Format: 'hello-world' (without locale prefix or file extension)
 */
export type NormalizedSlug = string;

/**
 * Parallel-fetched content collections for a specific locale.
 */
export interface LocaleContent {
    /** All blog posts (excluding drafts) for the locale */
    blogPosts: CollectionEntry<'blog'>[];

    /** All pages for the locale */
    pages: CollectionEntry<'pages'>[];

    /** Blog post lookup map (slug -> entry) for O(1) access */
    blogPostMap: Map<NormalizedSlug, CollectionEntry<'blog'>>;

    /** Page lookup map (slug -> entry) for O(1) access */
    pageMap: Map<NormalizedSlug, CollectionEntry<'pages'>>;
}

/**
 * Extracts normalized slug from a content entry ID.
 *
 * Removes locale prefix (e.g., 'en/', 'cs/') and file extensions (.mdx, .md)
 * to create a clean slug for URL matching and Map indexing.
 *
 * @param entryId - The raw entry ID from Astro Content Collections
 * @returns Normalized slug without locale prefix or extension
 *
 * @example
 * normalizeSlug('en/hello-world.mdx') // 'hello-world'
 * normalizeSlug('cs/about.md') // 'about'
 */
export function normalizeSlug(entryId: string): NormalizedSlug {
    return entryId.replace(/\.(mdx|md)$/, '').replace(/^[^/]+\//, '');
}

/**
 * Creates an indexed Map from content entries for O(1) lookups.
 *
 * @param entries - Array of content entries to index
 * @returns Map with normalized slugs as keys and entries as values
 */
function createEntryMap<T extends 'blog' | 'pages'>(
    entries: CollectionEntry<T>[],
): Map<NormalizedSlug, CollectionEntry<T>> {
    return new Map(entries.map((entry) => [normalizeSlug(entry.id), entry]));
}

/**
 * Fetches all content collections for a locale in parallel.
 *
 * This is the primary optimization: instead of fetching collections
 * multiple times per request, we fetch both blog posts and pages once
 * in parallel and create indexed Maps for fast lookups.
 *
 * @param locale - The locale to fetch content for
 * @returns Object containing all content and indexed lookup Maps
 *
 * @example
 * const content = await loadLocaleContent('en');
 * const post = content.blogPostMap.get('hello-world'); // O(1) lookup
 */
export async function loadLocaleContent(locale: Locale): Promise<LocaleContent> {
    logger.info(`Loading content collections for locale: ${locale}`);

    const startTime = performance.now();

    try {
        // Fetch both collections in parallel (major optimization)
        const [blogPosts, pages] = await Promise.all([
            getCollection(
                'blog',
                (entry: CollectionEntry<'blog'>) => !entry.data.draft && entry.data.locale === locale,
            ),
            getCollection('pages', (entry: CollectionEntry<'pages'>) => entry.data.locale === locale),
        ]);

        // Create indexed Maps for O(1) lookups
        const blogPostMap = createEntryMap(blogPosts);
        const pageMap = createEntryMap(pages);

        const duration = performance.now() - startTime;

        logger.info(`Loaded ${blogPosts.length} blog posts and ${pages.length} pages in ${duration.toFixed(2)}ms`, {
            locale,
            blogPostCount: blogPosts.length,
            pageCount: pages.length,
        });

        return {
            blogPosts,
            pages,
            blogPostMap,
            pageMap,
        };
    } catch (error) {
        logger.error(`Failed to load content for locale: ${locale}`, error);
        throw new ContentError(`Failed to load content collections for locale: ${locale}`);
    }
}

/**
 * Finds a blog post by slug using O(1) Map lookup.
 *
 * @param slug - The normalized slug to search for
 * @param content - Pre-loaded locale content with indexed maps
 * @returns The blog post entry or undefined if not found
 */
export function findBlogPost(slug: NormalizedSlug, content: LocaleContent): CollectionEntry<'blog'> | undefined {
    return content.blogPostMap.get(slug);
}

/**
 * Finds a page by slug using O(1) Map lookup.
 *
 * @param slug - The normalized slug to search for
 * @param content - Pre-loaded locale content with indexed maps
 * @returns The page entry or undefined if not found
 */
export function findPage(slug: NormalizedSlug, content: LocaleContent): CollectionEntry<'pages'> | undefined {
    return content.pageMap.get(slug);
}

/**
 * Sorts blog posts by publication date (newest first).
 *
 * @param posts - Array of blog post entries to sort
 * @returns New array sorted by pubDate descending
 */
export function sortBlogPostsByDate(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
    return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
