import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import promise from 'eslint-plugin-promise';
import security from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginSvelte from 'eslint-plugin-svelte';

// Shared rule overrides for security and promise plugins.
const sharedSecurityPromiseRules = {
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-regexp': 'warn',

    'promise/always-return': 'warn',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'warn',
    'promise/no-nesting': 'warn',
};

export default [
    // Ignore patterns (placed first for clarity).
    {
        ignores: [
            'dist/',
            '.astro/',
            'node_modules/',
            '.wrangler/',
            '*.min.js',
            '*.min.css',
            '.env',
            '.env.*',
            'CLAUDE.md',
            '.rules',
        ],
    },

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
            ...sharedSecurityPromiseRules,
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        plugins: {
            'simple-import-sort': simpleImportSort,
            security: security,
            promise: promise,
        },
        rules: {
            ...security.configs.recommended.rules,
            ...promise.configs.recommended.rules,
            ...sharedSecurityPromiseRules,

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

    ...eslintPluginAstro.configs.recommended,
    {
        files: ['**/*.astro'],
        plugins: {
            'simple-import-sort': simpleImportSort,
            security: security,
            promise: promise,
        },
        rules: {
            ...security.configs.recommended.rules,
            ...promise.configs.recommended.rules,
            ...sharedSecurityPromiseRules,
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

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
            security: security,
            promise: promise,
        },
        rules: {
            ...security.configs.recommended.rules,
            ...promise.configs.recommended.rules,
            ...sharedSecurityPromiseRules,

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            'svelte/valid-compile': 'warn',
            'svelte/no-at-html-tags': 'warn',
        },
    },

    // Prettier config (must be last).
    eslintConfigPrettier,
];
