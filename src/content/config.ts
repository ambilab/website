/**
 * Content Collections Configuration
 *
 * Defines Zod schemas for content collections (blog posts and pages).
 *
 * These schemas validate frontmatter and provide type safety
 * for content entries throughout the application.
 */
import { LOCALES } from '@i18n/config';
import { defineCollection, z } from 'astro:content';

/**
 * Blog post collection schema.
 *
 * Validates frontmatter for blog posts including title,
 * description, dates, author, tags, and draft status.
 *
 * Uses z.coerce.date() to automatically convert date
 * strings to Date objects.
 */
const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        /**
         * Blog post title.
         */
        title: z.string(),

        /**
         * Blog post description used for meta tags and previews.
         */
        description: z.string(),

        /**
         * Locale of the blog post content.
         */
        locale: z.enum(LOCALES),

        /**
         * Slug of the translated version of this post.
         *
         * Used to link between translations.
         */
        translationSlug: z.string().optional(),

        /**
         * Publication date of the blog post.
         *
         * Automatically converted from string to a Date object.
         */
        pubDate: z.coerce.date(),

        /**
         * Last modification date of the blog post.
         *
         * Automatically converted from string to a Date object.
         */
        updatedDate: z.coerce.date().optional(),

        /**
         * Author name of the blog post.
         *
         * @default 'Ambilab'
         */
        author: z.string().default('Ambilab'),

        /**
         * Array of tag strings for categorizing the blog post.
         *
         * @default []
         */
        tags: z.array(z.string()).default([]),

        /**
         * Whether the blog post is a draft and should not be published.
         *
         * @default false
         */
        draft: z.boolean().default(false),
    }),
});

/**
 * Static pages collection schema.
 *
 * Validates frontmatter for static pages with title,
 * description, locale, and optional translation linking.
 */
const pagesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        /**
         * Page title.
         */
        title: z.string(),

        /**
         * Page description used for meta tags and previews.
         */
        description: z.string(),

        /**
         * Locale of the page content.
         */
        locale: z.enum(LOCALES),

        /**
         * Slug of the translated version of this page.
         *
         * Used to link between translations.
         */
        translationSlug: z.string().optional(),
    }),
});

/**
 * Exported collections configuration for Astro Content Collections.
 *
 * This object is used by Astro to register and validate content collections.
 */
export const collections = {
    blog: blogCollection,
    pages: pagesCollection,
};
