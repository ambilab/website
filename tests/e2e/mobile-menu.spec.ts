/**
 * E2E tests for the mobile menu component.
 *
 * Tests open/close behavior, keyboard navigation, focus trapping,
 * body scroll lock, and accessibility attributes.
 * All tests run at a mobile viewport width (375px) where the menu is visible.
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } });

const menuButtonSelector = 'button[aria-controls="mobile-menu"]';

/**
 * Navigates to the homepage and waits for the MobileMenu Svelte
 * component to hydrate. The component uses client:load, but we still
 * need to wait for the JS to download and execute before interacting.
 */
async function gotoAndWaitForHydration(page: Page) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the menu button to be interactive by checking that its
    // onclick handler has been attached by Svelte. We can detect this
    // by verifying the Astro island has initialized -- the button's
    // aria-label is set reactively, so we wait for it to be present.
    const menuButton = page.locator(menuButtonSelector);
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-label', /.+/);
}

/**
 * Opens the mobile menu and waits for it to be fully expanded.
 */
async function openMenu(page: Page) {
    const menuButton = page.locator(menuButtonSelector);
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
}

test.describe('Mobile menu', () => {
    test('should display hamburger button on mobile viewport', async ({ page }) => {
        await gotoAndWaitForHydration(page);

        const menuButton = page.locator(menuButtonSelector);
        await expect(menuButton).toBeVisible();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should open menu on button click and set aria-expanded', async ({ page }) => {
        await gotoAndWaitForHydration(page);
        await openMenu(page);

        const menuPanel = page.locator('#mobile-menu');
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'false');
    });

    test('should close menu on second button click', async ({ page }) => {
        await gotoAndWaitForHydration(page);
        await openMenu(page);

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

        const menuPanel = page.locator('#mobile-menu');
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'true');
    });

    test('should close menu when pressing Escape', async ({ page }) => {
        await gotoAndWaitForHydration(page);
        await openMenu(page);

        await page.keyboard.press('Escape');

        const menuButton = page.locator(menuButtonSelector);
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should close menu when clicking a navigation link', async ({ page }) => {
        await gotoAndWaitForHydration(page);
        await openMenu(page);

        // Click the News link inside the mobile menu
        const newsLink = page.locator('#mobile-menu a[href="/news"]');
        await newsLink.click();

        await page.waitForLoadState('networkidle');

        // Menu should be closed after navigation
        const newMenuButton = page.locator(menuButtonSelector);
        await expect(newMenuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should lock body scroll when menu is open', async ({ page }) => {
        await gotoAndWaitForHydration(page);

        const menuButton = page.locator(menuButtonSelector);

        // Body should scroll normally before opening
        const overflowBefore = await page.evaluate(() => document.body.style.overflow);
        expect(overflowBefore).toBe('');

        await openMenu(page);

        const overflowAfter = await page.evaluate(() => document.body.style.overflow);
        expect(overflowAfter).toBe('hidden');

        // Close and verify scroll is restored
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

        const overflowRestored = await page.evaluate(() => document.body.style.overflow);
        expect(overflowRestored).toBe('');
    });

    test('should trap focus with Tab key cycling', async ({ page }) => {
        await gotoAndWaitForHydration(page);
        await openMenu(page);

        // Get all focusable elements inside the menu panel
        const focusableCount = await page.evaluate(() => {
            const panel = document.getElementById('mobile-menu');
            if (!panel) return 0;

            const selector =
                'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
            return panel.querySelectorAll(selector).length;
        });

        expect(focusableCount).toBeGreaterThan(0);

        // Tab through all focusable elements + 1 to verify wrap-around
        for (let i = 0; i < focusableCount + 1; i++) {
            await page.keyboard.press('Tab');
        }

        // After cycling through all elements, focus should wrap back to the menu button
        const activeElement = await page.evaluate((selector) => {
            const el = document.activeElement;
            const menuBtn = document.querySelector(selector);
            return {
                isMenuButton: el === menuBtn,
                ariaControls: el?.getAttribute('aria-controls'),
                tagName: el?.tagName.toLowerCase(),
            };
        }, menuButtonSelector);

        // Focus must wrap back to the menu toggle button specifically
        expect(activeElement.isMenuButton).toBe(true);
    });

    test('should close menu when clicking the dimmer overlay', async ({ page }) => {
        await gotoAndWaitForHydration(page);
        await openMenu(page);

        // Click the dimmer overlay (the sibling div with class menu-dimmer)
        const dimmer = page.locator('.menu-dimmer');
        await dimmer.click({ force: true });

        const menuButton = page.locator(menuButtonSelector);
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should set inert on menu panel when closed', async ({ page }) => {
        await gotoAndWaitForHydration(page);

        const menuPanel = page.locator('#mobile-menu');

        // Menu panel should be inert when closed
        await expect(menuPanel).toHaveAttribute('inert');

        // Open menu -- inert should be removed
        await openMenu(page);

        // When open, inert attribute should not be present
        await expect(menuPanel).not.toHaveAttribute('inert');
    });

    test('should not show mobile menu button on desktop viewport', async ({ browser }) => {
        // Override the mobile viewport for this single test
        const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const desktopPage = await desktopContext.newPage();
        await desktopPage.goto('/');
        await desktopPage.waitForLoadState('networkidle');

        const menuButton = desktopPage.locator(menuButtonSelector);
        await expect(menuButton).not.toBeVisible();

        await desktopContext.close();
    });
});
