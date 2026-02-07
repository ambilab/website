import type { Locale } from '@type/locale';
import { findBlogPost, findPage, loadLocaleContent, normalizeSlug, sortBlogPostsByDate } from '@utils/content-loader';
import { createLogger } from '@utils/logger';
import type { ParsedRoute } from '@utils/route-parser';
import type { CollectionEntry } from 'astro:content';

const logger = createLogger({ prefix: 'ContentResolver' });

type RenderedContent<T extends 'blog' | 'pages'> = Awaited<ReturnType<CollectionEntry<T>['render']>>['Content'];

export interface BlogIndexContent {
    type: 'blog-index';
    locale: Locale;
    permalink: string;
    translationPath: string;
    sortedBlogPosts: CollectionEntry<'blog'>[];
    content: Awaited<ReturnType<typeof loadLocaleContent>>;
}

export interface BlogPostContent {
    type: 'blog-post';
    locale: Locale;
    permalink: string;
    translationPath: string | undefined;
    entry: CollectionEntry<'blog'>;
    Content: RenderedContent<'blog'>;
    content: Awaited<ReturnType<typeof loadLocaleContent>>;
}

export interface PageContent {
    type: 'page';
    locale: Locale;
    permalink: string;
    translationPath: string | undefined;
    entry: CollectionEntry<'pages'>;
    Content: RenderedContent<'pages'>;
    content: Awaited<ReturnType<typeof loadLocaleContent>>;
}

export type ResolvedContent = BlogIndexContent | BlogPostContent | PageContent;

function buildPermalink(siteUrl: string, routeType: ParsedRoute['type'], slug: string): string {
    if (routeType === 'blog-index') {
        return `${siteUrl}/blog`;
    }

    if (routeType === 'blog-post') {
        return `${siteUrl}/blog/${slug}`;
    }

    return `${siteUrl}/${slug === 'index' ? '' : slug}`;
}

function buildTranslationPath(
    routeType: ParsedRoute['type'],
    slug: string,
    entry?: CollectionEntry<'blog'> | CollectionEntry<'pages'>,
): string | undefined {
    if (routeType === 'blog-index') {
        return '/blog';
    }

    if (routeType === 'page' && entry) {
        if (slug === 'index') {
            return '/';
        }

        if (entry.data.translationSlug) {
            return `/${entry.data.translationSlug}`;
        }
    }

    if (routeType === 'blog-post' && entry?.data.translationSlug) {
        return `/blog/${entry.data.translationSlug}`;
    }

    return undefined;
}

async function resolveBlogIndex(locale: Locale, siteUrl: string): Promise<BlogIndexContent> {
    const content = await loadLocaleContent(locale);
    const sortedBlogPosts = sortBlogPostsByDate(content.blogPosts);
    const permalink = buildPermalink(siteUrl, 'blog-index', 'index');

    return {
        type: 'blog-index',
        locale,
        permalink,
        translationPath: '/blog',
        sortedBlogPosts,
        content,
    };
}

async function resolveBlogPost(slug: string, locale: Locale, siteUrl: string): Promise<BlogPostContent | null> {
    const content = await loadLocaleContent(locale);
    const entry = findBlogPost(slug, content);

    if (!entry) {
        return null;
    }

    const rendered = await entry.render();
    const entrySlug = normalizeSlug(entry.id);
    const permalink = buildPermalink(siteUrl, 'blog-post', entrySlug);
    const translationPath = buildTranslationPath('blog-post', entrySlug, entry);

    return {
        type: 'blog-post',
        locale: entry.data.locale,
        permalink,
        translationPath,
        entry,
        Content: rendered.Content,
        content,
    };
}

async function resolvePage(slug: string, locale: Locale, siteUrl: string): Promise<PageContent | null> {
    const content = await loadLocaleContent(locale);
    const entry = findPage(slug, content);

    if (!entry) {
        return null;
    }

    const rendered = await entry.render();
    const entrySlug = normalizeSlug(entry.id);
    const permalink = buildPermalink(siteUrl, 'page', entrySlug);
    const translationPath = buildTranslationPath('page', entrySlug, entry);

    return {
        type: 'page',
        locale: entry.data.locale,
        permalink,
        translationPath,
        entry,
        Content: rendered.Content,
        content,
    };
}

export async function resolveContent(
    route: ParsedRoute,
    locale: Locale,
    siteUrl: string,
): Promise<ResolvedContent | null> {
    try {
        if (route.type === 'blog-index') {
            return await resolveBlogIndex(locale, siteUrl);
        }

        if (route.type === 'blog-post') {
            return await resolveBlogPost(route.slug, locale, siteUrl);
        }

        return await resolvePage(route.slug, locale, siteUrl);
    } catch (error) {
        logger.error(`Failed to resolve content for path: ${route.requestPath}`, error);
        throw error;
    }
}
