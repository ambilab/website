/**
 * E2E tests for locale-specific content rendering.
 *
 * Tests that content renders in the correct language based on locale,
 * Czech routes serve Czech content, and locale cookie overrides work.
 * Since localhost defaults to English, Czech content is tested by setting
 * the locale cookie before navigation.
 */

import { expect, test } from '@playwright/test';

test.describe('English content (default locale)', () => {
    test('should render English content on homepage', async ({ page }) => {
        await page.goto('/');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');
    });

    test('should display English news on /news', async ({ page }) => {
        await page.goto('/news');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');

        // English post title should be visible
        await expect(page.getByText('Hello World: Introducing Ambilab')).toBeVisible();
    });

    test('should render English news detail page', async ({ page }) => {
        await page.goto('/news/hello-world');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');

        await expect(page.locator('h1')).toHaveText('Hello World: Introducing Ambilab');
    });
});

test.describe('Czech content (via locale cookie)', () => {
    test('should render Czech content on homepage when locale cookie is set', async ({ page, context }) => {
        // Set locale cookie before navigation
        await context.addCookies([{ name: 'locale', value: 'cs', domain: 'localhost', path: '/' }]);

        await page.goto('/');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('cs');
    });

    test('should display Czech news on /novinky', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', domain: 'localhost', path: '/' }]);

        await page.goto('/novinky');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('cs');

        // Czech post title should be visible
        await expect(page.getByText('Ahoj Světe: Představujeme Ambilab')).toBeVisible();
    });

    test('should render Czech news detail page', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', domain: 'localhost', path: '/' }]);

        await page.goto('/novinky/ahoj-svete');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('cs');

        await expect(page.locator('h1')).toHaveText('Ahoj Světe: Představujeme Ambilab');
    });

    test('should show Czech navigation labels', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', domain: 'localhost', path: '/' }]);

        await page.goto('/');

        const nav = page.locator('nav[aria-label="Main navigation"]');

        // Czech nav labels: Novinky (News), Projekty (Projects)
        await expect(nav.locator('a', { hasText: /Novinky/i })).toBeVisible();
        await expect(nav.locator('a', { hasText: /Projekty/i })).toBeVisible();
    });

    test('should format dates in Czech locale', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', domain: 'localhost', path: '/' }]);

        await page.goto('/novinky');

        // Czech date format uses Czech month names (e.g., "8. února 2026" or similar)
        const timeElement = page.locator('time[datetime]').first();
        await expect(timeElement).toBeVisible();

        const dateText = await timeElement.textContent();
        expect(dateText).toBeTruthy();

        // Should NOT contain English month names
        const englishMonths = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const containsEnglish = englishMonths.some((m) => dateText?.includes(m));
        expect(containsEnglish).toBe(false);
    });
});

test.describe('Locale cookie persistence', () => {
    test('should persist locale across page navigation', async ({ page, context }) => {
        await context.addCookies([{ name: 'locale', value: 'cs', domain: 'localhost', path: '/' }]);

        // Navigate to homepage
        await page.goto('/');
        expect(await page.locator('html').getAttribute('lang')).toBe('cs');

        // Navigate to projects
        await page.goto('/projekty');
        expect(await page.locator('html').getAttribute('lang')).toBe('cs');
    });
});
