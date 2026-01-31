import { applySecurityHeaders, generateNonce } from '@config/security';
import { DEFAULT_LOCALE } from '@i18n/config';
import { detectLocaleFromHostname, getLocaleFromCookie } from '@i18n/utils';
import type { Locale } from '@type/locale';
import { createLogger } from '@utils/logger';
import { defineMiddleware } from 'astro:middleware';

const logger = createLogger({ prefix: 'Middleware' });

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
    try {
        const nonce = generateNonce();

        context.locals.nonce = nonce;
        context.locals.locale = resolveLocale(context.request);

        const response = await next();

        // CSP uses unsafe-inline for scripts since Astro hydration doesn't support nonces.
        // Nonce is still available in context.locals for inline scripts in templates.
        applySecurityHeaders(response.headers, {
            isDev: import.meta.env.DEV,
        });

        return response;
    } catch (error) {
        logger.error('Middleware error', error);

        const url = new URL(context.request.url);
        const pathname = url.pathname.replace(/\/$/, '') || '/';

        if (isErrorPage(pathname)) {
            return createErrorResponse(pathname);
        }

        return context.redirect('/500');
    }
});
