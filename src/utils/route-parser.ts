export type RouteType = 'news-index' | 'news-post' | 'page';

export interface ParsedRoute {
    type: RouteType;
    slug: string;
    requestPath: string;
}

export function parseRoute(slug: string | undefined): ParsedRoute {
    const requestPath = slug || 'index';

    if (requestPath === 'news') {
        return {
            type: 'news-index',
            slug: 'index',
            requestPath,
        };
    }

    if (requestPath.startsWith('news/')) {
        const postSlug = requestPath.replace('news/', '');

        if (!postSlug) {
            return {
                type: 'news-index',
                slug: 'index',
                requestPath,
            };
        }

        return {
            type: 'news-post',
            slug: postSlug,
            requestPath,
        };
    }

    return {
        type: 'page',
        slug: requestPath,
        requestPath,
    };
}
