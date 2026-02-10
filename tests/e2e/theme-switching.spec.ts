/**
 * E2E tests for theme switching (Light <-> Dark mode).
 *
 * Tests the ThemeSwitcher component and localStorage persistence.
 */

import { expect, test } from '@playwright/test';

test.describe('Theme switching', () => {
    test('should display theme toggle button', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i })).toBeVisible();
    });

    test('should toggle dark class on document when clicking theme button', async ({ page }) => {
        await page.goto('/');

        const themeButton = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });

        const hadDarkBefore = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        await themeButton.click();

        const hasDarkAfter = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        expect(hasDarkAfter).not.toBe(hadDarkBefore);
    });

    test('should persist theme preference in localStorage', async ({ page }) => {
        await page.goto('/');

        const themeButton = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });
        await themeButton.click();

        const theme = await page.evaluate(() => localStorage.getItem('theme'));

        expect(theme === 'light' || theme === 'dark').toBeTruthy();
    });

    test('should toggle theme twice and return to original state', async ({ page }) => {
        await page.goto('/');

        const themeButton = page.getByRole('button', { name: /Toggle theme|Přepnout motiv/i });

        const initialDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        await themeButton.click();
        await themeButton.click();

        const finalDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));

        expect(finalDark).toBe(initialDark);
    });
});
