import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

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

        // Expressive Code MUST come before mdx().
        expressiveCode({
            themes: ['github-dark-default', 'github-light-default'],
            themeCssSelector: (theme) => (theme.name === 'github-dark-default' ? '.dark' : ':root:not(.dark)'),
            defaultProps: {
                wrap: true,
            },
            styleOverrides: {
                borderRadius: '0',
                borderWidth: '1px',
                codePaddingInline: '22px',
                codeFontFamily: 'var(--font-mono)',
                codeFontSize: '15px',
                codeLineHeight: '22px',
                frames: {
                    frameBoxShadowCssValue: 'none',
                },
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
