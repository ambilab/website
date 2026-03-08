/**
 * E2E tests for BreadcrumbList structured data (JSON-LD).
 *
 * Verifies that BreadcrumbList schema is rendered on news posts and subpages,
 * but not on the home page. Validates item structure including name, URL, and
 * sequential position values.
 */

import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

interface ListItem {
    '@type': string;
    position: number;
    name: string;
    item: string;
}

interface BreadcrumbListSchema {
    '@context': string;
    '@type': string;
    itemListElement: ListItem[];
}

/**
 * Extracts BreadcrumbList JSON-LD from the page, if present.
 * Returns null when no BreadcrumbList script exists.
 */
async function getBreadcrumbJsonLd(page: Page): Promise<BreadcrumbListSchema | null> {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();

    for (let i = 0; i < count; i++) {
        const content = await scripts.nth(i).textContent();

        if (!content) continue;

        let parsed: Record<string, unknown>;

        try {
            parsed = JSON.parse(content) as Record<string, unknown>;
        } catch (err) {
            const snippet = content.length > 100 ? `${content.slice(0, 100)}…` : content;
            throw new Error(`Failed to parse JSON-LD script[${i}]: ${(err as Error).message}\nContent: ${snippet}`);
        }

        if (parsed['@type'] === 'BreadcrumbList') {
            return parsed as unknown as BreadcrumbListSchema;
        }
    }

    return null;
}

test.describe('BreadcrumbList structured data', () => {
    /** The home page must not include a BreadcrumbList JSON-LD block. */
    test('should not render BreadcrumbList on the home page', async ({ page }) => {
        await page.goto('/');

        const breadcrumbs = await getBreadcrumbJsonLd(page);
        expect(breadcrumbs).toBeNull();
    });

    /** The news index (/news) should have a 2-item breadcrumb: Home > News. */
    test('should render BreadcrumbList on the news index page', async ({ page }) => {
        await page.goto('/news');

        const breadcrumbs = await getBreadcrumbJsonLd(page);
        expect(breadcrumbs).not.toBeNull();
        expect(breadcrumbs?.['@context']).toBe('https://schema.org');
        expect(breadcrumbs?.['@type']).toBe('BreadcrumbList');

        const items = breadcrumbs?.itemListElement;
        expect(items).toHaveLength(2);

        // First item: Home
        expect(items[0]?.position).toBe(1);
        expect(items[0]?.name).toBe('Home');
        expect(items[0]?.item).toMatch(/\/$/);

        // Second item: News
        expect(items[1]?.position).toBe(2);
        expect(items[1]?.name).toBe('News');
        expect(items[1]?.item).toContain('/news');
    });

    /** A news post should have a 3-item breadcrumb: Home > News > Post Title. */
    test('should render BreadcrumbList on a news post page', async ({ page }) => {
        await page.goto('/news/hello-world');

        const breadcrumbs = await getBreadcrumbJsonLd(page);
        expect(breadcrumbs).not.toBeNull();

        const items = breadcrumbs?.itemListElement;
        expect(items).toHaveLength(3);

        // First item: Home
        expect(items[0]?.position).toBe(1);
        expect(items[0]?.name).toBe('Home');

        // Second item: News
        expect(items[1]?.position).toBe(2);
        expect(items[1]?.name).toBe('News');
        expect(items[1]?.item).toContain('/news');

        // Third item: Post title
        expect(items[2]?.position).toBe(3);
        expect(items[2]?.name).toBe('Hello World: Introducing Ambilab');
        expect(items[2]?.item).toContain('/news/hello-world');
    });

    /** A subpage (/projects) should have a 2-item breadcrumb: Home > Page Title. */
    test('should render BreadcrumbList on a subpage', async ({ page }) => {
        await page.goto('/projects');

        const breadcrumbs = await getBreadcrumbJsonLd(page);
        expect(breadcrumbs).not.toBeNull();

        const items = breadcrumbs?.itemListElement;
        expect(items).toHaveLength(2);

        // First item: Home
        expect(items[0]?.position).toBe(1);
        expect(items[0]?.name).toBe('Home');

        // Second item: Page title (from projects.mdx frontmatter)
        expect(items[1]?.position).toBe(2);
        expect(items[1]?.name).toBe('Ambilab Projects');
        expect(items[1]?.item).toContain('/projects');
    });

    /** All breadcrumb items must use absolute URLs (starting with http). */
    test('should use absolute URLs in breadcrumb items', async ({ page }) => {
        await page.goto('/news/hello-world');

        const breadcrumbs = await getBreadcrumbJsonLd(page);
        expect(breadcrumbs).not.toBeNull();

        for (const item of breadcrumbs?.itemListElement ?? []) {
            expect(item.item).toMatch(/^https?:\/\//);
        }
    });

    /** All list items must have @type "ListItem" and sequential positions. */
    test('should have valid ListItem types and sequential positions', async ({ page }) => {
        await page.goto('/news/hello-world');

        const breadcrumbs = await getBreadcrumbJsonLd(page);
        expect(breadcrumbs).not.toBeNull();

        const items = breadcrumbs?.itemListElement;

        for (let i = 0; i < items.length; i++) {
            expect(items[i]?.['@type']).toBe('ListItem');
            expect(items[i]?.position).toBe(i + 1);
        }
    });
});
