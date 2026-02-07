export type RouteType = 'blog-index' | 'blog-post' | 'page';

export interface ParsedRoute {
    type: RouteType;
    slug: string;
    requestPath: string;
}

export function parseRoute(slug: string | undefined): ParsedRoute {
    const requestPath = slug || 'index';

    if (requestPath === 'blog') {
        return {
            type: 'blog-index',
            slug: 'index',
            requestPath,
        };
    }

    if (requestPath.startsWith('blog/')) {
        const postSlug = requestPath.replace('blog/', '');

        if (!postSlug) {
            return {
                type: 'blog-index',
                slug: 'index',
                requestPath,
            };
        }

        return {
            type: 'blog-post',
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
