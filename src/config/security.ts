/**
 * Shared security configuration for both Astro
 * and Cloudflare Pages middleware.
 *
 * IMPORTANT: This is the single source of truth for security headers.
 *
 * Both src/middleware.ts and functions/_middleware.ts import and use these values.
 */

/**
 * Generate cryptographically secure nonce for CSP.
 *
 * @returns Base64-encoded random string (16 bytes)
 */
export function generateNonce(): string {
    const array = new Uint8Array(16);

    crypto.getRandomValues(array);

    return btoa(Array.from(array, (byte) => String.fromCharCode(byte)).join(''));
}

/**
 * Static security headers that don't change between environments.
 */
export const STATIC_SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

/**
 * CSP configuration options.
 */
export interface CSPConfig {
    nonce: string;
    isDev?: boolean;
}

/**
 * Build Content Security Policy header value.
 *
 * @param config - CSP configuration with nonce and environment flag
 * @returns Complete CSP header value
 */
export function buildCSP(config: CSPConfig): string {
    const { nonce, isDev = false } = config;

    // Script sources
    // In dev: Allow unsafe-inline for Vite/Astro dev tools
    // In prod: Use nonce-based CSP for strict security
    const scriptSrc = isDev
        ? `'self' https://plausible.io 'unsafe-inline'`
        : `'self' https://plausible.io 'nonce-${nonce}'`;

    // Style sources
    // unsafe-hashes allows inline style attributes (e.g., style="...")
    const styleSrc = isDev
        ? `'self' https://fonts.vancura.dev 'unsafe-inline' 'unsafe-hashes'`
        : `'self' https://fonts.vancura.dev 'nonce-${nonce}' 'unsafe-hashes'`;

    // Connection sources
    // In dev: Allow WebSocket connections for HMR
    const connectSrc = isDev
        ? `'self' https://plausible.io https://api.buttondown.email ws://localhost:* ws://127.0.0.1:*`
        : `'self' https://plausible.io https://api.buttondown.email https://fonts.vancura.dev`;

    // Build the complete CSP
    const parts = [
        `default-src 'self'`,
        `script-src ${scriptSrc}`,
        `style-src ${styleSrc}`,
        `img-src 'self' data: blob: https://blit-tech-demos.ambilab.com`,
        `font-src 'self' https://fonts.vancura.dev data:`,
        `connect-src ${connectSrc}`,
        `frame-src https://blit-tech-demos.ambilab.com`,
        `frame-ancestors 'self'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `object-src 'none'`,
    ];

    // Add upgrade-insecure-requests only in production
    if (!isDev) {
        parts.push('upgrade-insecure-requests');
    }

    return `${parts.join('; ')};`;
}

/**
 * Apply all security headers to a Headers object.
 *
 * @param headers - Headers object to modify
 * @param config - CSP configuration
 */
export function applySecurityHeaders(headers: Headers, config: CSPConfig): void {
    // Apply Content Security Policy
    headers.set('Content-Security-Policy', buildCSP(config));

    // Apply static security headers
    Object.entries(STATIC_SECURITY_HEADERS).forEach(([key, value]) => {
        headers.set(key, value);
    });
}
