/**
 * E2E tests for navigation and active link highlighting.
 *
 * Tests that navigation links render correctly, active page is indicated
 * with aria-current="page", and links navigate to the correct pages.
 */

import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
    test('should display navigation links on homepage', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        await expect(nav).toBeVisible();

        // Verify all three nav items are present
        await expect(nav.locator('a')).toHaveCount(3);
    });

    test('should mark home link as active on homepage', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);

        // The home link text comes from page frontmatter (menuTitle or title),
        // which may differ from the default "Home" translation.
        await expect(activeLink).toHaveAttribute('href', '/');
    });

    test('should mark news link as active on news page', async ({ page }) => {
        await page.goto('/news');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(/News/i);
    });

    test('should mark projects link as active on projects page', async ({ page }) => {
        await page.goto('/projects');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(/Projects/i);
    });

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

    test('should navigate to news page when clicking news link', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const newsLink = nav.locator('a', { hasText: /News/i });
        await newsLink.click();

        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/news');
    });

    test('should navigate to projects page when clicking projects link', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const projectsLink = nav.locator('a', { hasText: /Projects/i });
        await projectsLink.click();

        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/projects');
    });

    test('should navigate home when clicking the logo', async ({ page }) => {
        await page.goto('/news');

        const logoLink = page.locator('header a[aria-label]').first();
        await logoLink.click();

        await page.waitForLoadState('networkidle');

        // Should be at the root
        const url = new URL(page.url());
        expect(url.pathname).toBe('/');
    });

    test('should keep news link active on individual news post page', async ({ page }) => {
        await page.goto('/news/hello-world');

        const nav = page.locator('nav[aria-label="Main navigation"]');
        const activeLink = nav.locator('a[aria-current="page"]');

        await expect(activeLink).toHaveCount(1);
        await expect(activeLink).toHaveText(/News/i);
    });
});
