import type { APIRoute } from 'astro';

/**
 * Sitemap Index Endpoint
 *
 * Generates a sitemap index file that references locale-specific sitemaps.
 * This is the recommended approach for multi-locale sites as it allows
 * search engines to discover all content across different locales.
 *
 * Referenced in BaseHead.astro via <link rel="sitemap" href="/sitemap-index.xml" />
 */
export const GET: APIRoute = async () => {
    try {
        // Define locale-specific sitemaps
        const sitemaps = [
            {
                loc: 'https://ambilab.com/en/sitemap.xml',
                lastmod: new Date().toISOString(),
            },
            {
                loc: 'https://ambilab.cz/cs/sitemap.xml',
                lastmod: new Date().toISOString(),
            },
        ];

        // Generate sitemap index XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
    .map(
        (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`,
    )
    .join('\n')}
</sitemapindex>`;

        return new Response(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('Failed to generate sitemap index:', error);

        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
<error>Failed to generate sitemap index</error>`,
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                },
            },
        );
    }
};
