import { applySecurityHeaders, generateNonce } from '@config/security';
import { DEFAULT_LOCALE } from '@i18n/config';
import { detectLocaleFromHostname, getLocaleFromCookie } from '@i18n/utils';
import { createLogger } from '@utils/logger';
import { defineMiddleware } from 'astro:middleware';

const logger = createLogger({ prefix: 'Middleware' });

export const onRequest = defineMiddleware(async (context, next) => {
    try {
        const { request } = context;
        const url = new URL(request.url);
        const hostname = url.hostname;

        const nonce = generateNonce();
        context.locals.nonce = nonce;

        const cookieHeader = request.headers.get('Cookie') || '';
        let locale = getLocaleFromCookie(cookieHeader);

        if (!locale) {
            locale = detectLocaleFromHostname(hostname);
        }

        context.locals.locale = locale || DEFAULT_LOCALE;

        const response = await next();

        // Dev CSP uses unsafe-inline without nonce; prod uses strict nonces.
        applySecurityHeaders(response.headers, {
            nonce,
            isDev: import.meta.env.DEV,
        });

        return response;
    } catch (error) {
        logger.error('Middleware error', error);

        const url = new URL(context.request.url);
        const pathname = url.pathname.replace(/\/$/, '') || '/';

        if (pathname === '/404' || pathname === '/500' || pathname === '/503') {
            const status = pathname === '/404' ? 404 : pathname === '/500' ? 500 : 503;
            const errorResponse = new Response('Error', { status });

            applySecurityHeaders(errorResponse.headers, {
                nonce: generateNonce(),
                isDev: import.meta.env.DEV,
            });

            return errorResponse;
        }

        return context.redirect('/500');
    }
});
