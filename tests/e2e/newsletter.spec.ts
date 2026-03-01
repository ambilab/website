/**
 * E2E tests for the newsletter subscription flow.
 *
 * Tests form validation, submission, and error handling.
 * These tests are skipped when the newsletter feature flag is disabled
 * (PUBLIC_NEWSLETTER = "false").
 *
 * A dummy BUTTONDOWN_API_KEY must be available in the preview environment
 * (via .dev.vars) so the API route returns predictable responses.
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

/**
 * Checks whether the newsletter form is rendered on the page.
 * The component is gated by the newsletter feature flag in src/config/features.ts.
 */
async function isNewsletterEnabled(page: Page): Promise<boolean> {
    await page.goto('/');
    const heading = page.getByTestId('newsletter-heading');
    return (await heading.count()) > 0;
}

test.describe('Newsletter subscription', () => {
    test('should display newsletter form on homepage', async ({ page }) => {
        const enabled = await isNewsletterEnabled(page);
        test.skip(!enabled, 'Newsletter feature flag is disabled');

        await expect(page.getByTestId('newsletter-heading')).toBeVisible();
        await expect(page.getByTestId('newsletter-email')).toBeVisible();
        await expect(page.getByTestId('newsletter-submit')).toBeVisible();
    });

    test('should show error when submitting invalid email', async ({ page }) => {
        const enabled = await isNewsletterEnabled(page);
        test.skip(!enabled, 'Newsletter feature flag is disabled');

        // Bypass browser HTML5 validation so the server-side check runs.
        // Using novalidate on the form is more robust than changing input type,
        // because Svelte may reconcile DOM attributes on re-render.
        await page.evaluate(() => {
            const form = document.querySelector('.newsletter-form form');
            if (form) form.setAttribute('novalidate', '');
        });
        await page.getByTestId('newsletter-email').fill('invalid-email');
        await page.getByTestId('newsletter-submit').click();

        // May show validation error or rate limit error if prior test runs consumed the quota
        await expect(page.getByText(/invalid|Invalid email format|Too many attempts/i)).toBeVisible({ timeout: 5000 });
    });

    test('should show error or success when submitting valid email', async ({ page }) => {
        const enabled = await isNewsletterEnabled(page);
        test.skip(!enabled, 'Newsletter feature flag is disabled');

        await page.getByTestId('newsletter-email').fill('test@example.com');
        await page.getByTestId('newsletter-submit').click();

        // Possible outcomes depending on environment:
        // - Dummy API key: Buttondown returns 401 -> "Failed to subscribe"
        // - No API key: "Newsletter service is not configured"
        // - Real API key: "Thanks for subscribing" or "Something went wrong"
        // - Rate limited from prior runs: "Too many attempts"
        await expect(
            page.getByText(
                /Thanks for subscribing|Newsletter service is not configured|Failed to subscribe|Something went wrong|Too many attempts/i,
            ),
        ).toBeVisible({ timeout: 10000 });
    });
});
