import { generateLocaleSitemapEntries } from '@utils/sitemap';
import type { APIRoute } from 'astro';

/**
 * Czech locale sitemap endpoint.
 *
 * Generates a sitemap containing only Czech content from ambilab.cz.
 */
export const GET: APIRoute = async () => {
    try {
        const entries = await generateLocaleSitemapEntries('cs');

        // Sort entries by URL for consistent output
        entries.sort((a, b) => a.url.localeCompare(b.url));

        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map((entry) => {
        const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod.toISOString()}</lastmod>` : '';
        const changefreq = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : '';
        const priority = entry.priority !== undefined ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : '';

        return `  <url>
    <loc>${entry.url}</loc>${lastmod}${changefreq}${priority}
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
        console.error('Failed to generate Czech sitemap:', error);

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
