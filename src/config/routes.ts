import type { Locale } from '@type/locale';

export const ROUTES = {
    home: {
        en: '/',
        cs: '/',
    },

    projects: {
        en: '/projects',
        cs: '/projekty',
    },

    news: {
        en: '/news',
        cs: '/news',
    },

    rss: {
        en: '/en/news.xml',
        cs: '/cs/news.xml',
    },
} as const;

export const PAGE_SLUGS: Record<keyof typeof ROUTES, Record<Locale, string>> = {
    home: {
        en: 'index',
        cs: 'index',
    },

    projects: {
        en: 'projects',
        cs: 'projekty',
    },

    news: {
        en: 'news',
        cs: 'news',
    },

    rss: {
        en: 'rss',
        cs: 'rss',
    },
};

export function getRoute(route: keyof typeof ROUTES, locale: Locale): string {
    return ROUTES[route][locale];
}

function normalizePath(p: string): string {
    return p.length > 1 ? p.replace(/\/+$/, '') : p;
}

export function isRouteActive(path: string, route: keyof typeof ROUTES): boolean {
    const normalizedPath = normalizePath(path);

    return Object.values(ROUTES[route]).some((routePath) => {
        const normalizedRoutePath = normalizePath(routePath);

        if (route === 'news') {
            return normalizedPath === normalizedRoutePath || normalizedPath.startsWith(`${normalizedRoutePath}/`);
        }

        return normalizedPath === normalizedRoutePath;
    });
}
