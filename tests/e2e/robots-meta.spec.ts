/**
 * E2E tests for robots meta tag on different page types.
 *
 * Verifies that error pages render `noindex, nofollow` and regular
 * published pages render `index, follow`.
 */

import { expect, test } from '@playwright/test';

test.describe('Robots meta tag - error pages', () => {
    /** 404 error pages should have noindex to prevent search engine indexing. */
    test('should render noindex on 404 page', async ({ page }) => {
        await page.goto('/this-page-does-not-exist');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
    });

    /** Deeply nested non-existent paths should also have noindex. */
    test('should render noindex on 404 for nested paths', async ({ page }) => {
        await page.goto('/some/deeply/nested/nonexistent/path');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
    });

    /** The preview-500 route renders the 500 error page and should have noindex. */
    test('should render noindex on 500 page', async ({ page }) => {
        await page.goto('/preview-500');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
    });

    /** The preview-503 route renders the 503 error page and should have noindex. */
    test('should render noindex on 503 page', async ({ page }) => {
        await page.goto('/preview-503');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
    });
});

test.describe('Robots meta tag - published pages', () => {
    /** The homepage should allow indexing. */
    test('should render index, follow on the homepage', async ({ page }) => {
        await page.goto('/');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'index, follow');
    });

    /** The news listing page should allow indexing. */
    test('should render index, follow on the news listing', async ({ page }) => {
        await page.goto('/news');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'index, follow');
    });

    /**
     * A published news post should allow indexing.
     * Depends on src/content/news/en/hello-world.mdx being present and published.
     */
    test('should render index, follow on a news post', async ({ page }) => {
        await page.goto('/news/hello-world');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'index, follow');
    });
});

test.describe('Robots meta tag - draft pages', () => {
    /**
     * A draft news post should have noindex to prevent search engine indexing.
     * Depends on src/content/news/en/draft-post.mdx being present with draft: true.
     */
    test('should render noindex on a draft news post', async ({ page }) => {
        await page.goto('/news/draft-post');

        const robotsMeta = page.locator('meta[name="robots"]');
        await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
    });
});
