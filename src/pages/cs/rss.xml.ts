import type { APIContext } from 'astro';
import { generateRssFeed } from '@utils/rss';

export async function GET(context: APIContext) {
  return generateRssFeed(context, 'cs', 'Čeština', 'cs-cz');
}
