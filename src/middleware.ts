import { applySecurityHeaders } from '@config/security';
import { DEFAULT_LOCALE } from '@i18n/config';
import { detectLocaleFromHostname, getLocaleFromCookie } from '@i18n/utils';
import type { Locale } from '@type/locale';
import { defineMiddleware } from 'astro:middleware';
import { nanoid } from 'nanoid';

const ERROR_STATUS_MAP: Record<string, number> = {
    '/404': 404,
    '/500': 500,
    '/503': 503,
};

function resolveLocale(request: Request): Locale {
    const cookieHeader = request.headers.get('Cookie') || '';
    const locale = getLocaleFromCookie(cookieHeader);

    if (locale) {
        return locale;
    }

    const url = new URL(request.url);

    return detectLocaleFromHostname(url.hostname) || DEFAULT_LOCALE;
}

function createErrorResponse(pathname: string): Response {
    const status = ERROR_STATUS_MAP[pathname] ?? 500;
    const response = new Response('Error', { status });

    applySecurityHeaders(response.headers, {
        isDev: import.meta.env.DEV,
    });

    return response;
}

function isErrorPage(pathname: string): boolean {
    return pathname in ERROR_STATUS_MAP;
}

export const onRequest = defineMiddleware(async (context, next) => {
    // Redirect ambilab.cz to ambilab.com, preserving path and query (AL-318)
    const url = new URL(context.request.url);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'ambilab.cz') {
        const target = new URL(context.request.url);
        target.hostname = 'ambilab.com';
        const response = context.redirect(target.toString(), 302);
        response.headers.set('Set-Cookie', 'locale=cs; Path=/; SameSite=Lax');
        return response;
    }

    try {
        context.locals.locale = resolveLocale(context.request);
        context.locals.requestId = nanoid();

        const response = await next();

        applySecurityHeaders(response.headers, {
            isDev: import.meta.env.DEV,
        });

        // Add Cache-Control for HTML responses to improve TTFB on Cloudflare's CDN edge.
        // Static assets are cached by Cloudflare Pages automatically.
        const contentType = response.headers.get('Content-Type') || '';

        if (contentType.includes('text/html') && response.status < 500) {
            response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
        }

        return response;
    } catch (error) {
        console.error('Middleware error', error);

        const url = new URL(context.request.url);
        const pathname = url.pathname.replace(/\/$/, '') || '/';

        if (isErrorPage(pathname)) {
            return createErrorResponse(pathname);
        }

        return context.redirect('/500');
    }
});
