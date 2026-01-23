import { LOCALES } from '@i18n/config';
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        locale: z.enum(LOCALES),
        translationSlug: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('Ambilab'),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
    }),
});

const pagesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        menuTitle: z.string().optional(),
        description: z.string(),
        locale: z.enum(LOCALES),
        translationSlug: z.string().optional(),
    }),
});

export const collections = {
    blog: blogCollection,
    pages: pagesCollection,
};
