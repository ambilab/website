import type { Locale } from '@type/locale';

export const ROUTES = {
    home: {
        en: '/',
        cs: '/',
    },

    about: {
        en: '/about',
        cs: '/o-projektu',
    },

    blog: {
        en: '/blog',
        cs: '/blog',
    },

    rss: {
        en: '/en/rss.xml',
        cs: '/cs/rss.xml',
    },
} as const;

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

        if (route === 'blog') {
            return normalizedPath === normalizedRoutePath || normalizedPath.startsWith(`${normalizedRoutePath}/`);
        }

        return normalizedPath === normalizedRoutePath;
    });
}
