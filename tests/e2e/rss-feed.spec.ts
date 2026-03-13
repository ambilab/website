/**
 * E2E tests for RSS feed link tags in the document head.
 *
 * Verifies that both English and Czech RSS feeds are discoverable via <link> tags (AL-321).
 */

import type { BrowserContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

async function setLocaleCookie(context: BrowserContext, baseURL: string | undefined, locale = 'cs'): Promise<void> {
    const { origin } = new URL(baseURL ?? 'http://localhost:4321');
    await context.addCookies([{ name: 'locale', value: locale, url: origin }]);
}

test.describe('RSS Feed Links', () => {
    /** English RSS link should be present in <head> on the English homepage. */
    test('should include English RSS link on English homepage', async ({ page }) => {
        await page.goto('/');

        const rssLink = page.locator('head link[type="application/rss+xml"][hreflang="en"]');
        await expect(rssLink).toHaveCount(1);
        await expect(rssLink).toHaveAttribute('rel', 'alternate');
        await expect(rssLink).toHaveAttribute('href', /\/en\/news\.xml$/);
    });

    /** Czech RSS link should be present in <head> on the English homepage. */
    test('should include Czech RSS link on English homepage', async ({ page }) => {
        await page.goto('/');

        const rssLink = page.locator('head link[type="application/rss+xml"][hreflang="cs"]');
        await expect(rssLink).toHaveCount(1);
        await expect(rssLink).toHaveAttribute('rel', 'alternate');
        await expect(rssLink).toHaveAttribute('href', /\/cs\/news\.xml$/);
    });

    /** Both RSS links should appear in <head> on the English homepage. */
    test('should have exactly two RSS links in head on English homepage', async ({ page }) => {
        await page.goto('/');

        const rssLinks = page.locator('head link[type="application/rss+xml"]');
        await expect(rssLinks).toHaveCount(2);
    });

    /** Czech RSS link should be present and English RSS link should also be present on the Czech homepage. */
    test('should include both RSS links on Czech homepage', async ({ page, context }, testInfo) => {
        await setLocaleCookie(context, testInfo.project.use.baseURL);
        await page.goto('/');
        await expect(page.locator('html[lang="cs"]')).toHaveCount(1);

        const czechRssLink = page.locator('head link[type="application/rss+xml"][hreflang="cs"]');
        await expect(czechRssLink).toHaveCount(1);
        await expect(czechRssLink).toHaveAttribute('rel', 'alternate');
        await expect(czechRssLink).toHaveAttribute('href', /\/cs\/news\.xml$/);

        const englishRssLink = page.locator('head link[type="application/rss+xml"][hreflang="en"]');
        await expect(englishRssLink).toHaveCount(1);
        await expect(englishRssLink).toHaveAttribute('rel', 'alternate');
        await expect(englishRssLink).toHaveAttribute('href', /\/en\/news\.xml$/);
    });

    /** The RSS link titles should reference the correct locale names. */
    test('should have correct titles on RSS links on English homepage', async ({ page }) => {
        await page.goto('/');

        const englishRssLink = page.locator('head link[type="application/rss+xml"][hreflang="en"]');
        await expect(englishRssLink).toHaveAttribute('title', /English/);

        const czechRssLink = page.locator('head link[type="application/rss+xml"][hreflang="cs"]');
        await expect(czechRssLink).toHaveAttribute('title', /čeština/);
    });

    /** On the Czech homepage, titles should be swapped. */
    test('should have correct titles on RSS links on Czech homepage', async ({ page, context }, testInfo) => {
        await setLocaleCookie(context, testInfo.project.use.baseURL);
        await page.goto('/');
        await expect(page.locator('html[lang="cs"]')).toHaveCount(1);

        const czechRssLink = page.locator('head link[type="application/rss+xml"][hreflang="cs"]');
        await expect(czechRssLink).toHaveAttribute('title', /čeština/);

        const englishRssLink = page.locator('head link[type="application/rss+xml"][hreflang="en"]');
        await expect(englishRssLink).toHaveAttribute('title', /English/);
    });
});
