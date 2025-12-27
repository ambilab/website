import rss from '@astrojs/rss';
import { SITE } from '@config/site';
import { getTranslation } from '@i18n/translations';
import type { Locale } from '@type/locale';
import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

/**
 * Converts a content collection post ID to a blog post URL.
 * Expected format: "locale/slug.mdx" or "locale/slug.md"
 * Example: "en/hello-world.mdx" -> "/blog/hello-world"
 */
export function getBlogPostLink(postId: string): string {
    if (!postId.includes('/')) {
        throw new Error(`Invalid post ID format: ${postId}. Expected format: "locale/slug.mdx"`);
    }

    return `/blog/${postId.replace(/\.(mdx|md)$/, '').replace(/^[^/]+\//, '')}`;
}

/**
 * Generates an RSS feed for a given locale.
 * Shared helper to reduce duplication between locale-specific RSS handlers.
 */
export async function generateRssFeed(
    context: APIContext,
    locale: Locale,
    localeLabel: string,
    languageCode: string,
): Promise<Response> {
    const posts = await getCollection(
        'blog',
        (entry: CollectionEntry<'blog'>) => !entry.data.draft && entry.data.locale === locale,
    );
    const sortedPosts = [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    const recentPosts = sortedPosts.slice(0, 20); // Limit to 20 most recent posts

    const t = getTranslation(locale);
    // Use localized description from translations instead of hardcoded SITE.DESCRIPTION
    const description = t.footer.description;

    return rss({
        title: `${SITE.NAME} - ${localeLabel}`,
        description,
        site: context.site?.toString() || SITE.URL,
        items: recentPosts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate,
            link: getBlogPostLink(post.id),
            categories: post.data.tags,
        })),
        customData: `<language>${languageCode}</language>`,
    });
}
