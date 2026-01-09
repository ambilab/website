/**
 * Czech RSS Feed Route
 *
 * Generates and serves the RSS feed for Czech blog posts.
 *
 * Uses the shared generateRssFeed utility to reduce code duplication.
 */
import { generateRssFeed } from '@utils/rss';
import type { APIContext } from 'astro';

/**
 * GET handler for Czech RSS feed.
 *
 * @param context - Astro API context containing request and site information
 * @param context.site - The site URL from Astro config
 * @param context.url - The request URL
 * @returns RSS XML response with Czech blog posts
 */
export async function GET(context: APIContext) {
    return generateRssFeed(context, 'cs', 'Čeština', 'cs-cz');
}
