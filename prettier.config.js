/**
 * Prettier setup for Ambilab Website
 *
 * Please note: Prettier is used for Astro, Markdown, and YAML files.
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
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],

    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
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
