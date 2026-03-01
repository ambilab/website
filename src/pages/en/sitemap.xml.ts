import { generateLocaleSitemapEntries } from '@utils/sitemap';
import type { APIRoute } from 'astro';

/**
 * English locale sitemap endpoint.
 *
 * Generates a sitemap containing only English content from ambilab.com.
 */
export const GET: APIRoute = async () => {
    try {
        const entries = await generateLocaleSitemapEntries('en');

        // Sort entries by URL for consistent output
        entries.sort((a, b) => a.url.localeCompare(b.url));

        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
    .map((entry) => {
        const alternates =
            entry.alternates && entry.alternates.length > 0
                ? '\n' +
                  entry.alternates
                      .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`)
                      .join('\n')
                : '';
        const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod.toISOString()}</lastmod>` : '';
        const changefreq = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : '';
        const priority = entry.priority !== undefined ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : '';

        return `  <url>
    <loc>${entry.url}</loc>${alternates}${lastmod}${changefreq}${priority}
  </url>`;
    })
    .join('\n')}
</urlset>`;

        return new Response(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('Failed to generate English sitemap:', error);

        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
<error>Failed to generate sitemap</error>`,
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                },
            },
        );
    }
};
