/**
 * E2E tests for system theme detection.
 *
 * Tests that the site follows the OS color scheme preference
 * via CSS prefers-color-scheme media query.
 */

import { expect, test } from '@playwright/test';

const PAGE_BG_VAR = '--color-page-bg';

const getCssVarValue = (varName: string) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

test.describe('System theme detection', () => {
    test('should apply different styles for dark and light system preferences', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const lightBg = await page.evaluate(getCssVarValue, PAGE_BG_VAR);

        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto('/');

        const darkBg = await page.evaluate(getCssVarValue, PAGE_BG_VAR);

        expect(lightBg.length, 'light mode should resolve a CSS value').toBeGreaterThan(0);
        expect(darkBg.length, 'dark mode should resolve a CSS value').toBeGreaterThan(0);
        expect(lightBg).not.toEqual(darkBg);
    });

    test('should update styles when system preference changes', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const lightBg = await page.evaluate(getCssVarValue, PAGE_BG_VAR);

        await page.emulateMedia({ colorScheme: 'dark' });

        await page.waitForFunction(
            ([expectedToChange, cssVar]: [string, string]) => {
                const current = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
                return current !== expectedToChange;
            },
            [lightBg, PAGE_BG_VAR] as [string, string],
            { timeout: 2000 },
        );

        const darkBg = await page.evaluate(getCssVarValue, PAGE_BG_VAR);

        expect(darkBg).not.toEqual(lightBg);
    });
});
