/**
 * E2E tests for navigation and active link highlighting.
 *
 * Tests that navigation links render correctly, active page is indicated
 * with aria-current="page", and links navigate to the correct pages.
 */

import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
    /** The main nav bar must be visible and contain exactly 3 links (Home, News, Projects). */
    test('should display navigation links on homepage', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        await expect(nav).toBeVisible();

        // Verify all three nav items are present
        await expect(nav.locator('a')).toHaveCount(3);
    });

    /** Exactly one link should have aria-current="page" on the homepage, and it must point to "/". */
    test('should mark home link as active on homepage', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);

        // The home link text comes from page frontmatter (menuTitle or title),
        // which may differ from the default "Home" translation.
        await expect(activeLink).toHaveAttribute('href', '/');
    });

    /** On /news, the "News" nav link should carry aria-current="page". */
    test('should mark news link as active on news page', async ({ page }) => {
        await page.goto('/news');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(/News/i);
    });

    /** On /projects, the "Projects" nav link should carry aria-current="page". */
    test('should mark projects link as active on projects page', async ({ page }) => {
        await page.goto('/projects');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(/Projects/i);
    });

    /** Only one link at a time may be active; the remaining links must lack aria-current. */
    test('should not set aria-current on inactive links', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const allLinks = nav.locator('a');
        const activeLinks = nav.locator('a[aria-current="page"]');

        const totalCount = await allLinks.count();
        const activeCount = await activeLinks.count();

        // Only one link should be active at a time
        expect(activeCount).toBe(1);
        expect(totalCount).toBeGreaterThan(activeCount);
    });

    /** Clicking the "News" nav link must navigate to a URL containing /news. */
    test('should navigate to news page when clicking news link', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const newsLink = nav.locator('a', { hasText: /News/i });
        await newsLink.click();

        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/news');
    });

    /** Clicking the "Projects" nav link must navigate to a URL containing /projects. */
    test('should navigate to projects page when clicking projects link', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const projectsLink = nav.locator('a', { hasText: /Projects/i });
        await projectsLink.click();

        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/projects');
    });

    /** Clicking the header logo from any page must navigate back to the root "/". */
    test('should navigate home when clicking the logo', async ({ page }) => {
        await page.goto('/news');

        const logoLink = page.locator('header a[aria-label]').first();
        await logoLink.click();

        await page.waitForLoadState('networkidle');

        // Should be at the root
        const url = new URL(page.url());
        expect(url.pathname).toBe('/');
    });

    /** On a news detail page (/news/hello-world), the "News" parent link should remain active. */
    test('should keep news link active on individual news post page', async ({ page }) => {
        await page.goto('/news/hello-world');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(/News/i);
    });
});
