/**
 * Route Configuration
 *
 * Centralized route definitions for localized paths.
 *
 * This is the single source of truth for routes that differ between locales,
 * preventing maintenance issues and ensuring consistency across components.
 */
import type { Locale } from '@type/locale';

/**
 * Route definitions with locale-specific paths.
 */
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

/**
 * Get the localized path for a route.
 *
 * @param route - The route key from ROUTES
 * @param locale - The locale code
 * @returns The localized path
 */
export function getRoute(route: keyof typeof ROUTES, locale: Locale): string {
    return ROUTES[route][locale];
}

/**
 * Normalize a path by removing trailing slashes (preserving "/" for root).
 */
function normalizePath(p: string): string {
    return p.length > 1 ? p.replace(/\/+$/, '') : p;
}

/**
 * Check if a path matches a route in any locale.
 *
 * @param path - The path to check
 * @param route - The route key from ROUTES
 * @returns True if the path matches the route in any locale
 */
export function isRouteActive(path: string, route: keyof typeof ROUTES): boolean {
    const normalizedPath = normalizePath(path);

    return Object.values(ROUTES[route]).some((routePath) => {
        const normalizedRoutePath = normalizePath(routePath);

        // For blog, match exact path or nested routes (boundary-aware)
        if (route === 'blog') {
            return normalizedPath === normalizedRoutePath || normalizedPath.startsWith(`${normalizedRoutePath}/`);
        }

        // For other routes, use exact match
        return normalizedPath === normalizedRoutePath;
    });
}
