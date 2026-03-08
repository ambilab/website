/**
 * E2E tests for aria-hidden on decorative SVGs.
 *
 * Verifies that icon/decorative SVGs inside labeled parent elements
 * have aria-hidden="true" to prevent double announcements by screen readers.
 */

import { expect, test } from '@playwright/test';

/** Fixture page that renders GoToTop with forceVisible and client:load. */
const GO_TO_TOP_FIXTURE_PATH = '/e2e/go-to-top';

test.describe('SVG aria-hidden attributes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    /** The logo SVG inside the home link must be hidden from assistive technology. */
    test('logo SVG in header should have aria-hidden', async ({ page }) => {
        const logoSvg = page.locator('a[aria-label] .header-logo svg, .header-logo a[aria-label] svg').first();
        await expect(logoSvg).toHaveAttribute('aria-hidden', 'true');
    });

    /** The hamburger icon SVG inside the menu button must be hidden from assistive technology. */
    test('mobile menu button SVG should have aria-hidden', async ({ page }) => {
        // Use mobile viewport to ensure the menu button is visible
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const menuButton = page.locator('button[aria-controls="mobile-menu"]');
        await expect(menuButton).toBeVisible();

        const menuSvg = menuButton.locator('svg');
        await expect(menuSvg).toHaveAttribute('aria-hidden', 'true');
    });

    /** The arrow icon SVG inside the Go-to-Top button must be hidden from assistive technology. */
    test('Go-to-Top button SVG should have aria-hidden', async ({ page }) => {
        await page.goto(GO_TO_TOP_FIXTURE_PATH);
        await page.waitForLoadState('networkidle');

        const goToTopButton = page.locator('.go-to-top-button');
        await expect(goToTopButton).toBeVisible();

        const goToTopSvg = goToTopButton.locator('svg');
        await expect(goToTopSvg).toHaveAttribute('aria-hidden', 'true');
    });
});
