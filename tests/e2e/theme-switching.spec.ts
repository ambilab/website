/**
 * E2E tests for theme switching (Light <-> Dark mode).
 *
 * Tests the ThemeSwitcher component and localStorage persistence.
 * These tests are skipped when the themeSwitcher feature flag is disabled
 * (PUBLIC_THEME_SWITCHER = "false").
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * Checks whether the theme switcher button is rendered on the page.
 * The component is gated by the themeSwitcher feature flag in src/config/features.ts.
 */
async function isThemeSwitcherEnabled(page: Page): Promise<boolean> {
    await page.goto('/');
    const button = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });
    return (await button.count()) > 0;
}

test.describe('Theme switching', () => {
    test('should display theme toggle button', async ({ page }) => {
        const enabled = await isThemeSwitcherEnabled(page);
        test.skip(!enabled, 'Theme switcher feature flag is disabled');

        await expect(page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i })).toBeVisible();
    });

    test('should toggle dark class on document when clicking theme button', async ({ page }) => {
        const enabled = await isThemeSwitcherEnabled(page);
        test.skip(!enabled, 'Theme switcher feature flag is disabled');

        const themeButton = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });

        const hadDarkBefore = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        await themeButton.click();

        const hasDarkAfter = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        expect(hasDarkAfter).not.toBe(hadDarkBefore);
    });

    test('should persist theme preference in localStorage', async ({ page }) => {
        const enabled = await isThemeSwitcherEnabled(page);
        test.skip(!enabled, 'Theme switcher feature flag is disabled');

        const themeButton = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });
        await themeButton.click();

        const theme = await page.evaluate(() => localStorage.getItem('theme'));

        expect(theme === 'light' || theme === 'dark').toBeTruthy();
    });

    test('should toggle theme twice and return to original state', async ({ page }) => {
        const enabled = await isThemeSwitcherEnabled(page);
        test.skip(!enabled, 'Theme switcher feature flag is disabled');

        const themeButton = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });

        const initialDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        await themeButton.click();
        await themeButton.click();

        const finalDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        expect(finalDark).toBe(initialDark);
    });
});
