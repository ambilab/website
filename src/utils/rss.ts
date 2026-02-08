import rss from '@astrojs/rss';
import { SITE } from '@config/site';
import { getTranslation } from '@i18n/translations';
import type { Locale } from '@type/locale';
import type { APIContext } from 'astro';

import { loadLocaleContent, normalizeSlug, sortNewsPostsByDate } from './content-loader';
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'RSS' });

export function getNewsPostLink(postId: string): string {
    if (!postId.includes('/')) {
        throw new Error(`Invalid post ID format: ${postId}. Expected format: "locale/slug.mdx"`);
    }

    return `/news/${normalizeSlug(postId)}`;
}

export async function generateRssFeed(
    context: APIContext,
    locale: Locale,
    localeLabel: string,
    languageCode: string,
): Promise<Response> {
    try {
        const content = await loadLocaleContent(locale);
        const sortedPosts = sortNewsPostsByDate(content.newsPosts);

        // Filter out draft posts and limit to 20 most recent
        const publishedPosts = sortedPosts.filter((post) => !post.data.draft);
        const recentPosts = publishedPosts.slice(0, 20);

        const t = getTranslation(locale);
        const description = t.footer.description;

        // Ensure we have a valid site URL
        const rawSiteUrl = context.site?.toString() || SITE.URL;
        let siteUrl: URL;
        try {
            siteUrl = new URL(rawSiteUrl);
            if (siteUrl.protocol !== 'http:' && siteUrl.protocol !== 'https:') {
                throw new Error(`Invalid protocol: ${siteUrl.protocol}`);
            }
        } catch {
            throw new Error(`Invalid site URL: ${rawSiteUrl}`);
        }

        return rss({
            title: `${SITE.NAME} - ${localeLabel}`,
            description,
            site: siteUrl.toString(),
            items: recentPosts.map((post) => ({
                title: post.data.title,
                description: post.data.description,
                pubDate: post.data.pubDate,
                link: getNewsPostLink(post.id),
                categories: post.data.tags,
                author: post.data.author.trim() || SITE.AUTHOR,
            })),
            customData: `<language>${languageCode}</language>`,
            xmlns: {
                atom: 'http://www.w3.org/2005/Atom',
            },
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
