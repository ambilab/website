import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@config/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.locale === 'en');

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  return rss({
    title: `${SITE.NAME} - English`,
    description: SITE.DESCRIPTION,
    site: context.site?.toString() || SITE.URL,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id.replace(/\.(mdx|md)$/, '').replace(/^[^/]+\//, '')}`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}

