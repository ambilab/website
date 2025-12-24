import { defineConfig } from 'histoire';
import { HstSvelte } from '@histoire/plugin-svelte';

export default defineConfig({
  plugins: [HstSvelte()],

  setupFile: './src/histoire.setup.ts',

  theme: {
    title: 'ambilab Components',
    favicon: '/favicon.png',
  },

  tree: {
    groups: [
      {
        title: 'Components',
        include: (file) => file.path.includes('components/svelte'),
      },
    ],
  },
});
