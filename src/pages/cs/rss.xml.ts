import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@config/site';
import type { APIContext } from 'astro';
import { getBlogPostLink } from '@utils/rss';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.locale === 'cs');

  const sortedPosts = posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: `${SITE.NAME} - Čeština`,
    description: SITE.DESCRIPTION,
    site: context.site?.toString() || SITE.URL,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostLink(post.id),
      categories: post.data.tags,
    })),
    customData: `<language>cs-cz</language>`,
  });
}
