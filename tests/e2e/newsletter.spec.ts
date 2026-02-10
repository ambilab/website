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

        await expect(page.getByRole('heading', { name: 'Subscribe to Our Newsletter' })).toBeVisible();
        await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible();
    });

    test('should show error when submitting invalid email', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(() => {
            const input = document.getElementById('newsletter-email');
            if (input) input.removeAttribute('required');
        });
        await page.getByPlaceholder('Enter your email').fill('invalid-email');
        await page.getByRole('button', { name: 'Subscribe' }).click();

        await expect(page.getByText(/invalid|Invalid email format/i)).toBeVisible({ timeout: 5000 });
    });

    test('should show error or success when submitting valid email', async ({ page }) => {
        await page.goto('/');

        await page.getByPlaceholder('Enter your email').fill('test@example.com');
        await page.getByRole('button', { name: 'Subscribe' }).click();

        await expect(
            page.getByText(/Thanks for subscribing|Newsletter service is not configured|Something went wrong/i),
        ).toBeVisible({ timeout: 10000 });
    });
});
