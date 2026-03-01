/**
 * E2E tests for system theme detection.
 *
 * Tests that the site follows the OS color scheme preference
 * via CSS prefers-color-scheme media query.
 */

import { expect, test } from '@playwright/test';

const getPageBg = () => getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim();

test.describe('System theme detection', () => {
    test('should apply different styles for dark and light system preferences', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const lightBg = await page.evaluate(getPageBg);

        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto('/');

        const darkBg = await page.evaluate(getPageBg);

        expect(lightBg).toBeTruthy();
        expect(darkBg).toBeTruthy();
        expect(lightBg).not.toBe(darkBg);
    });

    test('should update styles when system preference changes', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const lightBg = await page.evaluate(getPageBg);

        await page.emulateMedia({ colorScheme: 'dark' });

        await page.waitForFunction(
            (expectedToChange: string) => {
                const current = getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim();
                return current !== expectedToChange;
            },
            lightBg,
            { timeout: 2000 },
        );

        const darkBg = await page.evaluate(getPageBg);

        expect(darkBg).not.toBe(lightBg);
    });
});
