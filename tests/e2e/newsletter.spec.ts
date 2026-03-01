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

import { expect, test } from '@playwright/test';

test.describe('Newsletter subscription', () => {
    let newsletterEnabled = false;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('/');
        newsletterEnabled = (await page.getByTestId('newsletter-heading').count()) > 0;
        await context.close();
    });

    /** Checks the form's heading, email input, and submit button are all rendered and visible. */
    test('should display newsletter form on homepage', async ({ page }) => {
        test.skip(!newsletterEnabled, 'Newsletter feature flag is disabled');

        await page.goto('/');
        await expect(page.getByTestId('newsletter-heading')).toBeVisible();
        await expect(page.getByTestId('newsletter-email')).toBeVisible();
        await expect(page.getByTestId('newsletter-submit')).toBeVisible();
    });

    /** Bypasses HTML5 validation with novalidate to exercise the server-side email format check. */
    test('should show error when submitting invalid email', async ({ page }) => {
        test.skip(!newsletterEnabled, 'Newsletter feature flag is disabled');

        await page.goto('/');

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

    /**
     * Submits a well-formed email and expects one of several valid outcomes
     * depending on environment (dummy API key, missing key, real key, or rate-limited).
     */
    test('should show error or success when submitting valid email', async ({ page }) => {
        test.skip(!newsletterEnabled, 'Newsletter feature flag is disabled');

        await page.goto('/');
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
