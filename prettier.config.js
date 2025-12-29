/**
 * Prettier setup for Ambilab Website
 *
 * Please note: Prettier is used for Astro, Svelte, SVG, Markdown, and YAML files.
 * Biome handles the formatting for TypeScript, JavaScript, JSON, and CSS.
 *
 * @type {import('prettier').Config}
 */

export default {
    // Base settings (applied to Markdown/YAML)
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    trailingComma: 'all',
    printWidth: 120,
    endOfLine: 'lf',
    proseWrap: 'always',
    htmlWhitespaceSensitivity: 'css',

    // IMPORTANT: Tailwind plugin must be loaded last to wrap other plugins
    plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    tailwindConfig: './tailwind.config.ts',
    tailwindFunctions: [],

    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
        {
            files: '*.svelte',
            options: {
                parser: 'svelte',
            },
        },
        {
            files: '*.svg',
            options: {
                parser: 'html',
            },
        },
        {
            files: ['*.md', '*.mdx'],
            options: {
                parser: 'markdown',
                proseWrap: 'always',
                tabWidth: 2,
            },
        },
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
