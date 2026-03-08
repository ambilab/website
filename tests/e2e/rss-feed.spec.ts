/**
 * E2E tests for RSS feed link tags in the document head.
 *
 * Verifies that only the English RSS feed is discoverable via <link> tags
 * while the Czech site is not yet live (AL-320).
 */

import type { BrowserContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

async function setLocaleCookie(context: BrowserContext, baseURL: string | undefined, locale = 'cs'): Promise<void> {
    const { origin } = new URL(baseURL ?? 'http://localhost:4321');
    await context.addCookies([{ name: 'locale', value: locale, url: origin }]);
}

test.describe('RSS Feed Links', () => {
    /** English RSS link should be present in <head> on the homepage. */
    test('should include English RSS link on English homepage', async ({ page }) => {
        await page.goto('/');

        const rssLink = page.locator('head link[type="application/rss+xml"][hreflang="en"]');
        await expect(rssLink).toHaveCount(1);
        await expect(rssLink).toHaveAttribute('rel', 'alternate');
        await expect(rssLink).toHaveAttribute('href', /\/en\/news\.xml$/);
    });

    /** Czech RSS link must NOT be present in <head> on the English homepage. */
    test('should not include Czech RSS link on English homepage', async ({ page }) => {
        await page.goto('/');

        const rssLink = page.locator('head link[type="application/rss+xml"][hreflang="cs"]');
        await expect(rssLink).toHaveCount(0);
    });

    /** Only one RSS link total should appear in <head>. */
    test('should have exactly one RSS link in head', async ({ page }) => {
        await page.goto('/');

        const rssLinks = page.locator('head link[type="application/rss+xml"]');
        await expect(rssLinks).toHaveCount(1);
    });

    /** English RSS link should be present and Czech RSS link absent on the Czech homepage. */
    test('should include English RSS link on Czech homepage', async ({ page, context }, testInfo) => {
        await setLocaleCookie(context, testInfo.project.use.baseURL);
        await page.goto('/');
        await expect(page.locator('html[lang="cs"]')).toHaveCount(1);

        const englishRssLink = page.locator('head link[type="application/rss+xml"][hreflang="en"]');
        await expect(englishRssLink).toHaveCount(1);
        await expect(englishRssLink).toHaveAttribute('rel', 'alternate');

        const czechRssLink = page.locator('head link[type="application/rss+xml"][hreflang="cs"]');
        await expect(czechRssLink).toHaveCount(0);
    });

    /** The RSS link title should reference English. */
    test('should have correct title on RSS link', async ({ page }) => {
        await page.goto('/');

        const rssLink = page.locator('head link[type="application/rss+xml"]');
        await expect(rssLink).toHaveAttribute('title', /English/);
    });
});
