import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import promise from 'eslint-plugin-promise';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
    // TypeScript files
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'simple-import-sort': simpleImportSort,
            security: security,
            promise: promise,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...security.configs.recommended.rules,
            ...promise.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

            // Import sorting
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            // Security rule overrides
            'security/detect-object-injection': 'off',
            'security/detect-non-literal-regexp': 'warn',

            // Promise rule overrides
            'promise/always-return': 'warn',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/catch-or-return': 'warn',
            'promise/no-nesting': 'warn',
        },
    },

    // JavaScript files
    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

    // Astro files
    ...eslintPluginAstro.configs.recommended,

    // Svelte files
    ...eslintPluginSvelte.configs['flat/recommended'],
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {
                parser: tsparser,
            },
        },
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            // Disabled: Svelte compilation errors are already caught by `astro check` and build process
            // Enabling this can cause duplicate errors and performance issues during development
            'svelte/valid-compile': 'off',
            'svelte/no-at-html-tags': 'warn',
        },
    },

    // Prettier config (must be last)
    eslintConfigPrettier,

    // Ignore patterns
    {
        ignores: [
            'dist/',
            '.astro/',
            'node_modules/',
            '.histoire/',
            'histoire-dist/',
            '.wrangler/',
            '*.min.js',
            '*.min.css',
            '.env',
            '.env.*',
            'CLAUDE.md',
            '.rules',
        ],
    },
];
