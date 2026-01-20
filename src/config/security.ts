export function generateNonce(): string {
    const array = new Uint8Array(16);

    crypto.getRandomValues(array);

    return btoa(Array.from(array, (byte) => String.fromCharCode(byte)).join(''));
}

export const STATIC_SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

export interface CSPConfig {
    nonce: string;
    isDev?: boolean;
}

export function buildCSP(config: CSPConfig): string {
    const { nonce, isDev = false } = config;

    // Dev allows unsafe-inline for HMR tooling.
    const scriptSrc = isDev
        ? `'self' https://plausible.io 'unsafe-inline'`
        : `'self' https://plausible.io 'nonce-${nonce}'`;

    // unsafe-hashes allow inline style attributes.
    const styleSrc = isDev
        ? `'self' https://fonts.vancura.dev 'unsafe-inline' 'unsafe-hashes'`
        : `'self' https://fonts.vancura.dev 'nonce-${nonce}' 'unsafe-hashes'`;

    // Dev allows WebSocket connections for HMR.
    const connectSrc = isDev
        ? `'self' https://plausible.io https://api.buttondown.email ws://localhost:* ws://127.0.0.1:*`
        : `'self' https://plausible.io https://api.buttondown.email https://fonts.vancura.dev`;

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

    if (!isDev) {
        parts.push('upgrade-insecure-requests');
    }

    return `${parts.join('; ')};`;
}

export function applySecurityHeaders(headers: Headers, config: CSPConfig): void {
    headers.set('Content-Security-Policy', buildCSP(config));

    Object.entries(STATIC_SECURITY_HEADERS).forEach(([key, value]) => {
        headers.set(key, value);
    });
}
