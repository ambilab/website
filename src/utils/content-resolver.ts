import type { Locale } from '@type/locale';
import { findNewsPost, findPage, loadLocaleContent, normalizeSlug, sortNewsPostsByDate } from '@utils/content-loader';
import { createLogger } from '@utils/logger';
import type { ParsedRoute } from '@utils/route-parser';
import type { CollectionEntry } from 'astro:content';

const logger = createLogger({ prefix: 'ContentResolver' });

type RenderedContent<T extends 'news' | 'pages'> = Awaited<ReturnType<CollectionEntry<T>['render']>>['Content'];

export interface NewsIndexContent {
    type: 'news-index';
    locale: Locale;
    permalink: string;
    translationPath: string;
    sortedNewsPosts: CollectionEntry<'news'>[];
    content: Awaited<ReturnType<typeof loadLocaleContent>>;
}

export interface NewsPostContent {
    type: 'news-post';
    locale: Locale;
    permalink: string;
    translationPath: string | undefined;
    entry: CollectionEntry<'news'>;
    Content: RenderedContent<'news'>;
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

export type ResolvedContent = NewsIndexContent | NewsPostContent | PageContent;

function buildPermalink(siteUrl: string, routeType: ParsedRoute['type'], slug: string): string {
    if (routeType === 'news-index') {
        return `${siteUrl}/news`;
    }

    if (routeType === 'news-post') {
        return `${siteUrl}/news/${slug}`;
    }

    return `${siteUrl}/${slug === 'index' ? '' : slug}`;
}

function buildTranslationPath(
    routeType: ParsedRoute['type'],
    slug: string,
    entry?: CollectionEntry<'news'> | CollectionEntry<'pages'>,
): string | undefined {
    if (routeType === 'news-index') {
        return '/news';
    }

    if (routeType === 'page' && entry) {
        if (slug === 'index') {
            return '/';
        }

        if (entry.data.translationSlug) {
            return `/${entry.data.translationSlug}`;
        }
    }

    if (routeType === 'news-post' && entry?.data.translationSlug) {
        return `/news/${entry.data.translationSlug}`;
    }

    return undefined;
}

async function resolveNewsIndex(locale: Locale, siteUrl: string): Promise<NewsIndexContent> {
    const content = await loadLocaleContent(locale);
    const sortedNewsPosts = sortNewsPostsByDate(content.newsPosts);
    const permalink = buildPermalink(siteUrl, 'news-index', 'index');

    return {
        type: 'news-index',
        locale,
        permalink,
        translationPath: '/news',
        sortedNewsPosts,
        content,
    };
}

async function resolveNewsPost(slug: string, locale: Locale, siteUrl: string): Promise<NewsPostContent | null> {
    const content = await loadLocaleContent(locale);
    const entry = findNewsPost(slug, content);

    if (!entry) {
        return null;
    }

    const rendered = await entry.render();
    const entrySlug = normalizeSlug(entry.id);
    const permalink = buildPermalink(siteUrl, 'news-post', entrySlug);
    const translationPath = buildTranslationPath('news-post', entrySlug, entry);

    return {
        type: 'news-post',
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
        if (route.type === 'news-index') {
            return await resolveNewsIndex(locale, siteUrl);
        }

        if (route.type === 'news-post') {
            return await resolveNewsPost(route.slug, locale, siteUrl);
        }

        return await resolvePage(route.slug, locale, siteUrl);
    } catch (error) {
        logger.error(`Failed to resolve content for path: ${route.requestPath}`, error);
        throw error;
    }
}
