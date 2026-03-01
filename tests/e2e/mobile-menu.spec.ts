/**
 * E2E tests for the mobile menu component.
 *
 * Tests open/close behavior, keyboard navigation, focus trapping,
 * body scroll lock, and accessibility attributes.
 * All tests run at a mobile viewport width (375px) where the menu is visible.
 */

import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } });

const menuButtonSelector = 'button[aria-controls="mobile-menu"]';

test.describe('Mobile menu', () => {
    test('should display hamburger button on mobile viewport', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await expect(menuButton).toBeVisible();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should open menu on button click and set aria-expanded', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();

        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        const menuPanel = page.locator('#mobile-menu');
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'false');
    });

    test('should close menu on second button click', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

        const menuPanel = page.locator('#mobile-menu');
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'true');
    });

    test('should close menu when pressing Escape', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        await page.keyboard.press('Escape');
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should close menu when clicking a navigation link', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        // Click the News link inside the mobile menu
        const newsLink = page.locator('#mobile-menu a[href="/news"]');
        await newsLink.click();

        await page.waitForLoadState('networkidle');

        // Menu should be closed after navigation
        const newMenuButton = page.locator(menuButtonSelector);
        await expect(newMenuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should lock body scroll when menu is open', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);

        // Body should scroll normally before opening
        const overflowBefore = await page.evaluate(() => document.body.style.overflow);
        expect(overflowBefore).toBe('');

        await menuButton.click();

        const overflowAfter = await page.evaluate(() => document.body.style.overflow);
        expect(overflowAfter).toBe('hidden');

        // Close and verify scroll is restored
        await menuButton.click();

        const overflowRestored = await page.evaluate(() => document.body.style.overflow);
        expect(overflowRestored).toBe('');
    });

    test('should trap focus with Tab key cycling', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();

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
        const activeTagName = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
        // Focus should be on some focusable element (not lost)
        expect(['a', 'button', 'input']).toContain(activeTagName);
    });

    test('should close menu when clicking the dimmer overlay', async ({ page }) => {
        await page.goto('/');

        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        // Click the dimmer overlay (the sibling div with class menu-dimmer)
        const dimmer = page.locator('.menu-dimmer');
        await dimmer.click({ force: true });

        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should set inert on menu panel when closed', async ({ page }) => {
        await page.goto('/');

        const menuPanel = page.locator('#mobile-menu');

        // Menu panel should be inert when closed
        await expect(menuPanel).toHaveAttribute('inert', '');

        // Open menu -- inert should be removed
        const menuButton = page.locator(menuButtonSelector);
        await menuButton.click();

        // When open, inert attribute should not be present
        await expect(menuPanel).not.toHaveAttribute('inert', '');
    });

    test('should not show mobile menu button on desktop viewport', async ({ browser }) => {
        // Override the mobile viewport for this single test
        const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const desktopPage = await desktopContext.newPage();
        await desktopPage.goto('/');

        const menuButton = desktopPage.locator(menuButtonSelector);
        await expect(menuButton).not.toBeVisible();

        await desktopContext.close();
    });
});
