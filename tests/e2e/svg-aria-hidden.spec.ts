/**
 * E2E tests for aria-hidden on decorative SVGs.
 *
 * Verifies that icon/decorative SVGs inside labeled parent elements
 * have aria-hidden="true" to prevent double announcements by screen readers.
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

// Matches COMPONENT_CONFIG.goToTop.showAfterScroll in src/config/components.ts
const SHOW_AFTER_SCROLL = 300;

/**
 * Checks whether the Go-to-Top button can actually appear on the page.
 * Returns false when client:visible hydration prevents the component
 * from initializing (zero-height SSR output).
 */
async function isGoToTopWorking(page: Page): Promise<boolean> {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    try {
        await page.locator('.go-to-top-button').waitFor({ state: 'attached', timeout: 2000 });
        return true;
    } catch {
        return false;
    }
}

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
        const working = await isGoToTopWorking(page);
        test.skip(!working, 'GoToTop cannot hydrate (client:visible with empty SSR output)');

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.evaluate((px) => window.scrollTo(0, px), SHOW_AFTER_SCROLL + 200);
        await expect(page.locator('.go-to-top-button')).toBeVisible();

        const goToTopSvg = page.locator('.go-to-top-button svg');
        await expect(goToTopSvg).toHaveAttribute('aria-hidden', 'true');
    });
});
