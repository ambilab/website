import type { Locale } from './locale';

export interface BlogPost {
    title: string;
    description: string;
    slug: string;
    locale: Locale;
    translationSlug?: string;
    pubDate: Date;
    updatedDate?: Date;
    author: string;
    tags: string[];
    draft: boolean;
}

export interface Page {
    title: string;
    description: string;
    slug: string;
    locale: Locale;
    translationSlug?: string;
}
