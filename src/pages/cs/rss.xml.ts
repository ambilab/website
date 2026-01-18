import { generateRssFeed } from '@utils/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    return generateRssFeed(context, 'cs', 'Čeština', 'cs-CZ');
}
