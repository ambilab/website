/**
 * SEO Type Definitions.
 *
 * TypeScript interfaces for SEO metadata used in page components and
 * content collections for search engine optimization and social sharing.
 */

/**
 * Interface defining SEO metadata for pages.
 *
 * Used by components like BaseHead and PageLayout to generate proper
 * meta tags, OpenGraph tags, and structured data.
 */
export interface ISEOMetadata {
    /**
     * Page title used in the HTML title tag and meta tags.
     */
    title: string;

    /**
     * Page description used in meta description and OpenGraph tags.
     */
    description: string;

    /**
     * Canonical URL of the page for SEO purposes.
     */
    permalink: string;

    /**
     * OpenGraph image URL for social media sharing.
     *
     * If not provided, a default OG image will be used.
     */
    ogImage?: string;

    /**
     * Publication date of the article/page.
     *
     * Used for structured data and article meta tags.
     */
    articlePublishedTime?: Date;

    /**
     * Last modification date of the article/page.
     *
     * Used for structured data and article meta tags.
     */
    articleModifiedTime?: Date;
}
