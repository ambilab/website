/**
 * E2E tests for the cookie consent banner.
 *
 * Tests display, dismissal, localStorage persistence, keyboard interaction,
 * and accessibility attributes.
 * These tests are skipped when the cookieBanner feature flag is disabled
 * (PUBLIC_COOKIE_BANNER = "false").
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

const DISMISSED_KEY = 'cookie-banner-dismissed';

/**
 * Checks whether the cookie banner is rendered on the page.
 * The component is gated by the cookieBanner feature flag in src/config/features.ts.
 */
async function isCookieBannerEnabled(page: Page): Promise<boolean> {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const banner = page.locator('[role="alertdialog"]');
    return (await banner.count()) > 0;
}

/**
 * Waits for the cookie banner to be fully interactive (hydrated).
 * The banner uses client:idle hydration, so we must wait for the Svelte
 * component to hydrate and attach event handlers before interacting.
 */
async function waitForBannerReady(page: Page) {
    const banner = page.locator('[role="alertdialog"]');
    await expect(banner).toBeVisible();

    // Wait for Svelte hydration: the component sets --cookie-banner-height
    // CSS custom property after onMount completes (hydrated = true).
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--cookie-banner-height') !== '', {
        timeout: 5000,
    });
}

test.describe('Cookie banner', () => {
    /** On a fresh visit (no localStorage), the banner must appear as an accessible alert dialog. */
    test('should display cookie banner on first visit', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        const banner = page.locator('[role="alertdialog"]');
        await expect(banner).toBeVisible();
        await expect(banner).toHaveAttribute('aria-modal', 'true');
    });

    /** Validates aria-label, aria-describedby, and the associated description element for screen readers. */
    test('should have correct accessibility attributes', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        const banner = page.locator('[role="alertdialog"]');
        await expect(banner).toHaveAttribute('aria-label', /cookie/i);
        await expect(banner).toHaveAttribute('aria-describedby', 'cookie-banner-message');

        const message = page.locator('#cookie-banner-message');
        await expect(message).toBeVisible();
    });

    /** Clicking the dismiss button hides the banner from the viewport. Waits for hydration first. */
    test('should dismiss banner when clicking the dismiss button', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        await waitForBannerReady(page);

        const banner = page.locator('[role="alertdialog"]');
        const dismissButton = banner.locator('button');
        await dismissButton.click();

        await expect(banner).not.toBeVisible();
    });

    /** Keyboard accessibility: focusing the banner and pressing Escape dismisses it. */
    test('should dismiss banner when pressing Escape', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        await waitForBannerReady(page);

        const banner = page.locator('[role="alertdialog"]');

        // Focus the banner so it receives keyboard events
        await banner.focus();
        await page.keyboard.press('Escape');

        await expect(banner).not.toBeVisible();
    });

    /** After dismissal, localStorage key "cookie-banner-dismissed" must be set to "true". */
    test('should persist dismissal in localStorage', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        await waitForBannerReady(page);

        const banner = page.locator('[role="alertdialog"]');
        const dismissButton = banner.locator('button');
        await dismissButton.click();

        await expect(banner).not.toBeVisible();

        const dismissed = await page.evaluate((key) => localStorage.getItem(key), DISMISSED_KEY);
        expect(dismissed).toBe('true');
    });

    /** Persistence across navigation: once dismissed, the banner stays hidden after a full page reload. */
    test('should not display banner after dismissal on page reload', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        await waitForBannerReady(page);

        // Dismiss the banner
        const banner = page.locator('[role="alertdialog"]');
        const dismissButton = banner.locator('button');
        await dismissButton.click();
        await expect(banner).not.toBeVisible();

        // Reload the page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Banner should remain hidden
        await expect(page.locator('[role="alertdialog"]')).not.toBeVisible();
    });

    /** Removing the localStorage key and reloading brings the banner back, proving the guard works correctly. */
    test('should reappear after clearing localStorage', async ({ page }) => {
        const enabled = await isCookieBannerEnabled(page);
        test.skip(!enabled, 'Cookie banner feature flag is disabled');

        await waitForBannerReady(page);

        // Dismiss the banner
        const banner = page.locator('[role="alertdialog"]');
        const dismissButton = banner.locator('button');
        await dismissButton.click();
        await expect(banner).not.toBeVisible();

        // Clear localStorage and reload
        await page.evaluate((key) => localStorage.removeItem(key), DISMISSED_KEY);
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Banner should be visible again
        await expect(page.locator('[role="alertdialog"]')).toBeVisible();
    });
});
