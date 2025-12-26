import { HstSvelte } from '@histoire/plugin-svelte';
import { defineConfig } from 'histoire';

export default defineConfig({
  plugins: [HstSvelte()],

  setupFile: './src/histoire.setup.ts',

  theme: {
    title: 'Ambilab Components',
    favicon: '/favicon.png',
  },

  tree: {
    groups: [
      {
        title: 'Components',
        include: (file) => file.path.startsWith('src/components/svelte/'),
      },
    ],
  },
});
