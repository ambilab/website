/**
 * E2E tests for error page HTTP status codes.
 *
 * Verifies that 404 and 500 error pages return proper HTTP status codes
 * directly without redirecting, so search engines see the correct status.
 */

import { expect, test } from '@playwright/test';

test.describe('Error pages', () => {
    /** A non-existent URL should return HTTP 404 without a redirect. */
    test('should return 404 status for non-existent pages', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist');

        expect(response).not.toBeNull();
        expect(response?.status()).toBe(404);
    });

    /** The 404 response should render the error page content inline. */
    test('should render 404 error page content at the original URL', async ({ page }) => {
        await page.goto('/this-page-does-not-exist');

        // The error page renders the status code in an <em> with class "code"
        const codeElement = page.locator('.error-page h1 em.code');
        await expect(codeElement).toHaveText('404');

        // URL should remain the same (no redirect)
        expect(page.url()).toContain('/this-page-does-not-exist');
    });

    /** The 404 response should not be a 3xx redirect. */
    test('should not redirect on 404', async ({ page }) => {
        const response = await page.goto('/another-nonexistent-page');

        expect(response).not.toBeNull();
        expect(response?.status()).toBe(404);

        // The navigation request itself should not have been redirected
        expect(response?.request().redirectedFrom()).toBeNull();
    });

    /** Deeply nested non-existent paths should also return 404. */
    test('should return 404 for deeply nested non-existent paths', async ({ page }) => {
        const response = await page.goto('/some/deeply/nested/nonexistent/path');

        expect(response).not.toBeNull();
        expect(response?.status()).toBe(404);

        const codeElement = page.locator('.error-page h1 em.code');
        await expect(codeElement).toHaveText('404');
    });
});
