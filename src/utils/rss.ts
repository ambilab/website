import rss from '@astrojs/rss';
import { SITE } from '@config/site';
import { getTranslation } from '@i18n/translations';
import type { Locale } from '@type/locale';
import type { APIContext } from 'astro';

import { loadLocaleContent, normalizeSlug, sortBlogPostsByDate } from './content-loader';
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'RSS' });

export function getBlogPostLink(postId: string): string {
    if (!postId.includes('/')) {
        throw new Error(`Invalid post ID format: ${postId}. Expected format: "locale/slug.mdx"`);
    }

    return `/blog/${normalizeSlug(postId)}`;
}

export async function generateRssFeed(
    context: APIContext,
    locale: Locale,
    localeLabel: string,
    languageCode: string,
): Promise<Response> {
    try {
        const content = await loadLocaleContent(locale);
        const sortedPosts = sortBlogPostsByDate(content.blogPosts);
        const recentPosts = sortedPosts.slice(0, 20);
        const t = getTranslation(locale);
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
    } catch (error) {
        logger.error(`Failed to generate RSS feed for locale ${locale}`, error);

        const t = getTranslation(locale);

        return new Response(
            `<?xml version="1.0" encoding="utf-8"?>
<error>
    <message>${t.rss.errorMessage}</message>
</error>`,
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/xml',
                },
            },
        );
    }
}
