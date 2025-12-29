import { applySecurityHeaders, generateNonce } from '@config/security';
import { defaultLocale } from '@i18n/config';
import { detectLocaleFromHostname, getLocaleFromCookie } from '@i18n/utils';
import { createLogger } from '@utils/logger';
import { defineMiddleware } from 'astro:middleware';

const logger = createLogger({ prefix: 'Middleware' });

/**
 * Astro middleware for locale detection and security headers.
 *
 * This middleware uses shared utilities from @i18n/utils and @i18n/config,
 * ensuring consistency across the application.
 *
 * With Cloudflare adapter in advanced mode, this is the single source of truth
 * for locale detection and security headers - no code duplication needed!
 */
export const onRequest = defineMiddleware(async (context, next) => {
    try {
        const { request } = context;
        const url = new URL(request.url);
        const hostname = url.hostname;

        // Generate nonce for CSP
        // In development, we still generate it for consistency but don't enforce it in CSP
        // (Astro dev toolbar and Vite inject inline scripts/styles without nonces)
        const nonce = generateNonce();
        context.locals.nonce = nonce;

        // Check cookie first
        const cookieHeader = request.headers.get('Cookie') || '';
        let locale = getLocaleFromCookie(cookieHeader);

        // Fallback to hostname detection
        if (!locale) {
            locale = detectLocaleFromHostname(hostname);
        }

        // Ensure locale is always defined (fallback to defaultLocale)
        // This guarantees Locals.locale is always Locale, never undefined
        context.locals.locale = locale || defaultLocale;

        const response = await next();

        // Add security headers to the response
        // IMPORTANT: When nonces are present in CSP, 'unsafe-inline' is IGNORED by browsers.
        // Therefore, in development (where Astro dev toolbar and Vite inject scripts/styles
        // without our nonce), we use 'unsafe-inline' WITHOUT nonces.
        // In production, we use strict nonce-based CSP.
        applySecurityHeaders(response.headers, {
            nonce,
            isDev: import.meta.env.DEV,
        });

        return response;
    } catch (error) {
        // Log the error but don't expose sensitive details
        logger.error('Middleware error', error);

        // Prevent infinite redirect loop if already on error page
        const url = new URL(context.request.url);

        if (url.pathname === '/404' || url.pathname === '/500' || url.pathname === '/503') {
            // Return a basic error response instead of redirecting
            const errorResponse = new Response('Internal Server Error', { status: 500 });

            // Apply security headers even to error responses
            applySecurityHeaders(errorResponse.headers, {
                nonce: generateNonce(),
                isDev: import.meta.env.DEV,
            });

            return errorResponse;
        }

        // Redirect to 500 page to maintain consistency
        return context.redirect('/500');
    }
});
