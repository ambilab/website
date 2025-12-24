import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import tailwindcss from '@tailwindcss/vite';

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
    svelte({
      compilerOptions: {
        hydratable: true,
      },
    }),

    // Expressive Code MUST come before mdx()
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      themeCssSelector: (theme) =>
        theme.name === 'github-dark' ? '.dark' : ':root:not(.dark)',
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

    icon({
      include: {
        solar: ['*'],
      },
    }),
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

