/**
 * E2E tests for locale switching (EN <-> CS).
 *
 * Tests the LocaleSwitcher component and cookie-based locale persistence.
 * These tests are skipped when the localeSwitcher feature flag is disabled
 * (PUBLIC_LOCALE_SWITCHER != "true").
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * Checks whether the locale switcher button is rendered on the page.
 * The component is gated by the localeSwitcher feature flag in src/config/features.ts.
 */
async function isLocaleSwitcherEnabled(page: Page): Promise<boolean> {
    await page.goto('/');
    const button = page.getByRole('button', { name: /Switch language|Přepnout jazyk/i });
    return (await button.count()) > 0;
}

test.describe('Locale switching', () => {
    test('should display locale switcher on homepage', async ({ page }) => {
        const enabled = await isLocaleSwitcherEnabled(page);
        test.skip(!enabled, 'Locale switcher feature flag is disabled');

        await expect(page.getByRole('button', { name: /Switch language|Přepnout jazyk/i })).toBeVisible();
    });

    test('should switch from English to Czech when clicking locale switcher', async ({ page }) => {
        const enabled = await isLocaleSwitcherEnabled(page);
        test.skip(!enabled, 'Locale switcher feature flag is disabled');

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
        const enabled = await isLocaleSwitcherEnabled(page);
        test.skip(!enabled, 'Locale switcher feature flag is disabled');

        const localeButton = page.getByRole('button', { name: /Switch language|Přepnout jazyk/i });
        await localeButton.click();

        await page.waitForLoadState('networkidle');

        // Determine the expected locale after clicking by checking the html lang attribute
        const expectedLocale = await page.locator('html').getAttribute('lang');

        const cookies = await context.cookies();
        const localeCookie = cookies.find((c) => c.name === 'locale');

        expect(localeCookie?.value).toBe(expectedLocale);
    });
});
