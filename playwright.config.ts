/**
 * Playwright E2E Test Configuration
 *
 * Runs tests against the production build (preview server).
 * Use `pnpm build` before `pnpm test:e2e` for full flow.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:4321/',
        trace: 'on-first-retry',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: 'pnpm preview',
        url: 'http://localhost:4321/',
        timeout: 180 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
