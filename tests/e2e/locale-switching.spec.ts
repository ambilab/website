/**
 * E2E tests for locale switching (EN <-> CS).
 *
 * Tests the LocaleSwitcher component and cookie-based locale persistence.
 */

import { expect, test } from '@playwright/test';

test.describe('Locale switching', () => {
    test('should display locale switcher on homepage', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('button', { name: /Switch language|Přepnout jazyk/i })).toBeVisible();
    });

    test('should switch from English to Czech when clicking locale switcher', async ({ page }) => {
        await page.goto('/');

        const localeButton = page.getByRole('button', { name: /Switch language|Přepnout jazyk/i });
        await expect(localeButton).toBeVisible();

        // Assert initial state is English
        const htmlLang = await page.locator('html').getAttribute('lang');
        const bodyText = await page.locator('body').textContent();
        
        expect(htmlLang).toBe('en');
        expect(bodyText?.includes('Home') || bodyText?.includes('Projects')).toBeTruthy();

        // Click to switch locale
        await localeButton.click();

        await page.waitForLoadState('networkidle');

        // Assert locale transitioned to Czech
        const htmlLangAfter = await page.locator('html').getAttribute('lang');
        const bodyTextAfter = await page.locator('body').textContent();

        expect(htmlLangAfter).toBe('cs');
        expect(bodyTextAfter?.includes('Domů') || bodyTextAfter?.includes('Projekty')).toBeTruthy();
    });

    test('should persist locale via cookie after switch', async ({ page, context }) => {
        await page.goto('/');

        const localeButton = page.getByRole('button', { name: /Switch language|Přepnout jazyk/i });
        await localeButton.click();

        await page.waitForLoadState('networkidle');

        const cookies = await context.cookies();
        const localeCookie = cookies.find((c) => c.name === 'locale');

        expect(localeCookie?.value === 'en' || localeCookie?.value === 'cs').toBeTruthy();
    });
});
