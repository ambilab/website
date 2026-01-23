import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@config': path.resolve(__dirname, './src/config'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@type': path.resolve(__dirname, './src/types'),
            '@i18n': path.resolve(__dirname, './src/i18n'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.astro', '.wrangler'],
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '.astro/',
                '.wrangler/',
                '**/*.config.{ts,js}',
                '**/*.d.ts',
                '**/types/',
                'src/env.d.ts',
            ],
        },
        testTimeout: 10000,
    },
});
