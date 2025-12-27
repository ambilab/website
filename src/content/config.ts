import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        locale: z.enum(['en', 'cs']),
        translationSlug: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('ambilab'),
        tags: z.array(z.string()).default([]),
        disableTypewriter: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

const pagesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        locale: z.enum(['en', 'cs']),
        translationSlug: z.string().optional(),
        disableTypewriter: z.boolean().default(false),
    }),
});

export const collections = {
    blog: blogCollection,
    pages: pagesCollection,
};
