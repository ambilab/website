/**
 * E2E tests for the newsletter subscription flow.
 *
 * Tests form validation, submission, and error handling.
 * Without BUTTONDOWN_API_KEY, the API returns 500 with a service-not-configured message.
 */

import { expect, test } from '@playwright/test';

test.describe('Newsletter subscription', () => {
    test('should display newsletter form on homepage', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByTestId('newsletter-heading')).toBeVisible();
        await expect(page.getByTestId('newsletter-email')).toBeVisible();
        await expect(page.getByTestId('newsletter-submit')).toBeVisible();
    });

    test('should show error when submitting invalid email', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(() => {
            const input = document.getElementById('newsletter-email');
            if (input) input.removeAttribute('required');
        });
        await page.getByTestId('newsletter-email').fill('invalid-email');
        await page.getByTestId('newsletter-submit').click();

        await expect(page.getByText(/invalid|Invalid email format/i)).toBeVisible({ timeout: 5000 });
    });

    test('should show error or success when submitting valid email', async ({ page }) => {
        await page.goto('/');

        await page.getByTestId('newsletter-email').fill('test@example.com');
        await page.getByTestId('newsletter-submit').click();

        await expect(
            page.getByText(/Thanks for subscribing|Newsletter service is not configured|Something went wrong/i),
        ).toBeVisible({ timeout: 10000 });
    });
});
