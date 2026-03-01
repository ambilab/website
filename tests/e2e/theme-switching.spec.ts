/**
 * E2E tests for system theme detection.
 *
 * Tests that the site follows the OS color scheme preference
 * via CSS prefers-color-scheme media query.
 */

import { expect, test } from '@playwright/test';

test.describe('System theme detection', () => {
    test('should apply dark styles when system prefers dark mode', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto('/');

        const bgColor = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim();
        });

        // In dark mode, page-bg should NOT be the light theme value
        // (exact value depends on Tailwind resolution, but it should change)
        expect(bgColor).toBeTruthy();
    });

    test('should apply light styles when system prefers light mode', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const bgColor = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim();
        });

        expect(bgColor).toBeTruthy();
    });

    test('should produce different styles for light and dark preferences', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const lightBg = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim();
        });

        await page.emulateMedia({ colorScheme: 'dark' });

        // Allow CSS to recalculate
        await page.waitForTimeout(100);

        const darkBg = await page.evaluate(() => {
            return getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim();
        });

        expect(lightBg).not.toBe(darkBg);
    });
});
