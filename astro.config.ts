import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

// https://astro.build/config
export default defineConfig({
    site: 'https://ambilab.com',
    output: 'server',
    prefetch: true,

    adapter: cloudflare({
        platformProxy: {
            enabled: true,
        },
    }),

    integrations: [
        svelte(),

        // Expressive Code MUST come before mdx()
        expressiveCode({
            themes: ['github-dark', 'github-light'],
            themeCssSelector: (theme) => (theme.name === 'github-dark' ? '.dark' : ':root:not(.dark)'),
            defaultProps: {
                showLineNumbers: false,
                wrap: true,
            },
            styleOverrides: {
                borderRadius: '0.5rem',
                codePaddingInline: '1rem',
            },
        }),

        mdx({
            remarkPlugins: [remarkGfm, remarkSmartypants],
        }),

        sitemap(),
    ],

    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp',
        },
    },

    vite: {
        plugins: [tailwindcss()],
        ssr: {
            external: ['svgo'],
        },
    },
});
