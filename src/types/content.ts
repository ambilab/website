/**
 * Content Type Definitions
 *
 * TypeScript interfaces for content collection entries (blog posts and pages).
 * These types represent the structure of content frontmatter and are used
 * throughout the application for type-safe content handling.
 */
import type { Locale } from './locale';

/**
 * Interface representing a blog post entry.
 */
export interface BlogPost {
    /**
     * Title of the blog post.
     */
    title: string;

    /**
     * Description of the blog post used for meta tags and previews.
     */
    description: string;

    /**
     * URL slug for the blog post.
     */
    slug: string;

    /**
     * Locale of the blog post content.
     */
    locale: Locale;

    /**
     * Slug of the translated version of this post.
     *
     * Used to link between translations.
     */
    translationSlug?: string;

    /**
     * Publication date of the blog post.
     */
    pubDate: Date;

    /**
     * Last modification date of the blog post.
     */
    updatedDate?: Date;

    /**
     * Author name of the blog post.
     */
    author: string;

    /**
     * Array of tag strings for categorizing the blog post.
     */
    tags: string[];

    /**
     * Whether the blog post is a draft and should not be published.
     */
    draft: boolean;
}

/**
 * Interface representing a static page entry.
 */
export interface Page {
    /**
     * Title of the page.
     */
    title: string;

    /**
     * Description of the page used for meta tags and previews.
     */
    description: string;

    /**
     * URL slug for the page.
     */
    slug: string;

    /**
     * Locale of the page content.
     */
    locale: Locale;

    /**
     * Slug of the translated version of this page.
     *
     * Used to link between translations.
     */
    translationSlug?: string;
}
