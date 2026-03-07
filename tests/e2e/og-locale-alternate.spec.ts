/**
 * E2E tests for og:locale and og:locale:alternate meta tags.
 *
 * Verifies that each page declares its own locale via og:locale
 * and the alternate translation locale via og:locale:alternate,
 * enabling Facebook and other platforms to discover available translations.
 */

import { expect, test } from '@playwright/test';

test.describe('og:locale:alternate on English pages', () => {
    /** EN homepage must declare en_US as locale and cs_CZ as alternate. */
    test('should have correct og:locale tags on homepage', async ({ page }) => {
        await page.goto('/');

        const ogLocale = page.locator('meta[property="og:locale"]');
        await expect(ogLocale).toHaveAttribute('content', 'en_US');

        const ogLocaleAlt = page.locator('meta[property="og:locale:alternate"]');
        await expect(ogLocaleAlt).toHaveAttribute('content', 'cs_CZ');
    });

    /** EN news listing must declare en_US as locale and cs_CZ as alternate. */
    test('should have correct og:locale tags on /news', async ({ page }) => {
        await page.goto('/news');

        const ogLocale = page.locator('meta[property="og:locale"]');
        await expect(ogLocale).toHaveAttribute('content', 'en_US');

        const ogLocaleAlt = page.locator('meta[property="og:locale:alternate"]');
        await expect(ogLocaleAlt).toHaveAttribute('content', 'cs_CZ');
    });
});

test.describe('og:locale:alternate on Czech pages', () => {
    /** CS homepage must declare cs_CZ as locale and en_US as alternate. */
    test('should have correct og:locale tags on homepage', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', url: 'http://localhost:4321' }]);

        await page.goto('/');

        const ogLocale = page.locator('meta[property="og:locale"]');
        await expect(ogLocale).toHaveAttribute('content', 'cs_CZ');

        const ogLocaleAlt = page.locator('meta[property="og:locale:alternate"]');
        await expect(ogLocaleAlt).toHaveAttribute('content', 'en_US');
    });

    /** CS news listing must declare cs_CZ as locale and en_US as alternate. */
    test('should have correct og:locale tags on /novinky', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', url: 'http://localhost:4321' }]);

        await page.goto('/novinky');

        const ogLocale = page.locator('meta[property="og:locale"]');
        await expect(ogLocale).toHaveAttribute('content', 'cs_CZ');

        const ogLocaleAlt = page.locator('meta[property="og:locale:alternate"]');
        await expect(ogLocaleAlt).toHaveAttribute('content', 'en_US');
    });
});
