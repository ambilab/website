/**
 * E2E tests for Cache-Control and Last-Modified HTTP headers.
 *
 * Verifies that HTML pages return appropriate caching headers for CDN edge
 * caching and that news posts include Last-Modified for crawler freshness.
 */

import { expect, test } from '@playwright/test';

test.describe('Cache-Control headers', () => {
    /** HTML pages should return Cache-Control with s-maxage and stale-while-revalidate. */
    test('should set Cache-Control on the homepage', async ({ page }) => {
        const response = await page.goto('/');

        expect(response).not.toBeNull();
        expect(response?.headers()['cache-control']).toBe('public, s-maxage=60, stale-while-revalidate=300');
    });

    /** News listing page should also have Cache-Control. */
    test('should set Cache-Control on the news listing page', async ({ page }) => {
        const response = await page.goto('/news');

        expect(response).not.toBeNull();
        expect(response?.headers()['cache-control']).toBe('public, s-maxage=60, stale-while-revalidate=300');
    });

    /** News detail pages should have Cache-Control. */
    test('should set Cache-Control on news detail pages', async ({ page }) => {
        const response = await page.goto('/news/hello-world');

        expect(response).not.toBeNull();
        expect(response?.headers()['cache-control']).toBe('public, s-maxage=60, stale-while-revalidate=300');
    });

    /** Error pages should still get Cache-Control since they are HTML. */
    test('should set Cache-Control on 404 error pages', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist');

        expect(response).not.toBeNull();
        expect(response?.headers()['cache-control']).toBe('public, s-maxage=60, stale-while-revalidate=300');
    });

    /** Static assets should not have their Cache-Control overridden by the middleware. */
    test('should not override Cache-Control for static assets', async ({ page }) => {
        const response = await page.goto('/favicon.png');

        expect(response).not.toBeNull();
        expect(response?.headers()['cache-control']).not.toBe('public, s-maxage=60, stale-while-revalidate=300');
    });
});

test.describe('Last-Modified header', () => {
    /** News posts should include a Last-Modified header with a valid HTTP date. */
    test('should set Last-Modified on news detail pages', async ({ page }) => {
        const response = await page.goto('/news/hello-world');

        expect(response).not.toBeNull();

        const lastModified = response?.headers()['last-modified'];
        expect(lastModified).toBeTruthy();

        // Verify the value is a valid HTTP date
        const parsed = new Date(lastModified);
        expect(parsed.toString()).not.toBe('Invalid Date');
    });

    /** The Last-Modified value should match the post pubDate when no updatedDate exists. */
    test('should use pubDate as Last-Modified when no updatedDate', async ({ page }) => {
        const response = await page.goto('/news/hello-world');

        expect(response).not.toBeNull();

        const lastModified = response?.headers()['last-modified'];
        const parsed = new Date(lastModified);

        // hello-world post has pubDate: 2026-02-08
        expect(parsed.getUTCFullYear()).toBe(2026);
        expect(parsed.getUTCMonth()).toBe(1); // February is month 1 (zero-indexed)
        expect(parsed.getUTCDate()).toBe(8);
    });

    /** The Last-Modified value should match updatedDate when it is present. */
    test('should use updatedDate as Last-Modified when present', async ({ page }) => {
        const response = await page.goto('/news/hello-world-updated');

        expect(response).not.toBeNull();

        const lastModified = response?.headers()['last-modified'];
        const parsed = new Date(lastModified);

        // hello-world-updated post has updatedDate: 2026-03-01
        expect(parsed.getUTCFullYear()).toBe(2026);
        expect(parsed.getUTCMonth()).toBe(2); // March is month 2 (zero-indexed)
        expect(parsed.getUTCDate()).toBe(1);
    });

    /** The homepage should not have a Last-Modified header (it is not a news post). */
    test('should not set Last-Modified on the homepage', async ({ page }) => {
        const response = await page.goto('/');

        expect(response).not.toBeNull();
        expect(response?.headers()['last-modified']).toBeUndefined();
    });

    /** The news listing page should not have a Last-Modified header. */
    test('should not set Last-Modified on the news listing page', async ({ page }) => {
        const response = await page.goto('/news');

        expect(response).not.toBeNull();
        expect(response?.headers()['last-modified']).toBeUndefined();
    });
});
