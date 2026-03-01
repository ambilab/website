/**
 * E2E tests for news listing and detail pages.
 *
 * Tests that news posts render correctly on listing pages, detail pages
 * load with proper content, dates are formatted, and navigation between
 * listing and detail works.
 */

import { expect, test } from '@playwright/test';

test.describe('News listing page', () => {
    /** Ensures at least one post card (anchor wrapping article.card) renders on /news. */
    test('should display news posts on the news page', async ({ page }) => {
        await page.goto('/news');

        // Posts are rendered as <a> wrapping <article class="card">
        const postCards = page.locator('a > article.card');
        const count = await postCards.count();
        expect(count).toBeGreaterThan(0);
    });

    /** Verifies the seed "Hello World" post title is visible on the listing page. */
    test('should display post titles on the news page', async ({ page }) => {
        await page.goto('/news');

        // The "Hello World" post should be visible
        await expect(page.getByText('Hello World: Introducing Ambilab')).toBeVisible();
    });

    /** Checks that <time datetime="..."> elements exist and contain parseable ISO date strings. */
    test('should display formatted publication dates', async ({ page }) => {
        await page.goto('/news');

        // There should be at least one <time> element with a datetime attribute
        const timeElements = page.locator('time[datetime]');
        const count = await timeElements.count();
        expect(count).toBeGreaterThan(0);

        // The datetime value should be a valid date string
        const datetime = await timeElements.first().getAttribute('datetime');
        expect(datetime).toBeTruthy();
        expect(datetime).toBeDefined();
        expect(new Date(datetime as string).toString()).not.toBe('Invalid Date');
    });

    /** Confirms the post card links to the correct detail URL (/news/hello-world). */
    test('should link news post to its detail page', async ({ page }) => {
        await page.goto('/news');

        // Find a link that leads to a news detail page
        const postLink = page.locator('a[href*="/news/hello-world"]');
        await expect(postLink.first()).toBeVisible();
    });
});

test.describe('News detail page', () => {
    /** The h1 on the detail page must match the post's frontmatter title exactly. */
    test('should display the post title as heading', async ({ page }) => {
        await page.goto('/news/hello-world');

        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
        await expect(heading).toHaveText('Hello World: Introducing Ambilab');
    });

    /** A visible <time> element with a datetime attribute must be present on the detail page. */
    test('should display publication date on detail page', async ({ page }) => {
        await page.goto('/news/hello-world');

        const timeElement = page.locator('time[datetime]').first();
        await expect(timeElement).toBeVisible();
    });

    /** The .mdx-content area must be visible and contain rendered text from the MDX source. */
    test('should display post content', async ({ page }) => {
        await page.goto('/news/hello-world');

        // The MDX content area should have rendered content
        const contentArea = page.locator('.mdx-content');
        await expect(contentArea).toBeVisible();

        const textContent = await contentArea.textContent();
        expect(textContent?.trim().length).toBeGreaterThan(0);
    });

    /** The hello-world post has the "announcement" tag in frontmatter; it should render as #announcement. */
    test('should display tags when present', async ({ page }) => {
        await page.goto('/news/hello-world');

        // The hello-world post has the "announcement" tag
        await expect(page.getByText('#announcement')).toBeVisible();
    });

    /** A breadcrumb-style link back to /news must be visible for navigating to the listing. */
    test('should have a back link to the news listing', async ({ page }) => {
        await page.goto('/news/hello-world');

        // There should be a link back to the news page
        const backLink = page.locator('a[href="/news"]');
        await expect(backLink.first()).toBeVisible();
    });

    /** Clicking the back link actually navigates to /news and away from the detail slug. */
    test('should navigate back to news listing from detail page', async ({ page }) => {
        await page.goto('/news/hello-world');

        const backLink = page.locator('a[href="/news"]').first();
        await backLink.click();

        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/news');
        // Should not be on the detail page anymore
        expect(page.url()).not.toContain('/hello-world');
    });

    /** The <html lang> attribute must reflect the post's frontmatter locale ("en"). */
    test('should set correct HTML lang attribute', async ({ page }) => {
        await page.goto('/news/hello-world');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');
    });
});

test.describe('News on homepage', () => {
    /** The homepage must surface at least the "Hello World" post title in its news section. */
    test('should display a news section on the homepage', async ({ page }) => {
        await page.goto('/');

        // The homepage should show at least one news post title
        await expect(page.getByText('Hello World: Introducing Ambilab')).toBeVisible();
    });

    /** The "All posts" / "News" link on the homepage navigates to the /news listing. */
    test('should navigate from homepage news to full news page', async ({ page }) => {
        await page.goto('/');

        // Find the "All posts" or similar link on the homepage
        const viewAllLink = page.locator('a[href="/news"]', { hasText: /posts|News/i });
        const count = await viewAllLink.count();
        expect(count).toBeGreaterThan(0);

        await viewAllLink.first().click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/news');
    });
});

test.describe('404 error page', () => {
    /** Requests to an unknown URL must return HTTP 404 status. */
    test('should display 404 page for non-existent routes', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist');

        // Should return 404 status
        expect(response?.status()).toBe(404);
    });
});
