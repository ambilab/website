import { createLogger } from '@utils/logger';
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';

const logger = createLogger({ prefix: 'Newsletter API' });

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // Run cleanup every 15 minutes

const submissionTimestamps = new Map<string, number[]>();

function cleanupOldTimestamps(): void {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    let removed = 0;
    let updated = 0;

    for (const [ip, timestamps] of submissionTimestamps.entries()) {
        const recentTimestamps = timestamps.filter((t) => t > cutoff);

        if (recentTimestamps.length === 0) {
            submissionTimestamps.delete(ip);
            removed++;
        } else if (recentTimestamps.length < timestamps.length) {
            submissionTimestamps.set(ip, recentTimestamps);
            updated++;
        }
    }

    if (removed > 0 || updated > 0) {
        logger.info(`Cleaned up rate limit map: removed ${removed} IPs, updated ${updated} IPs`);
    }
}

const cleanupIntervalId = setInterval(cleanupOldTimestamps, CLEANUP_INTERVAL_MS);

if (typeof process !== 'undefined' && process.on) {
    const cleanup = () => {
        clearInterval(cleanupIntervalId);
        logger.info('Cleared rate limit cleanup interval on shutdown');
    };
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
}

function getClientIp(request: Request, clientAddress?: string): string {
    const cfIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    return clientAddress ?? cfIp ?? forwarded?.split(',')[0]?.trim() ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    const timestamps = submissionTimestamps.get(ip) ?? [];
    const recent = timestamps.filter((t) => t > cutoff);

    if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
        return true;
    }

    recent.push(now);
    submissionTimestamps.set(ip, recent);
    return false;
}

interface ValidationResult {
    valid: boolean;
    error?: string;
}

interface SubscriptionResult {
    success: boolean;
    error?: string;
    status: number;
}

const jsonResponse = (data: unknown, status: number) =>
    Response.json(data, {
        status,
        headers: { 'Cache-Control': 'no-store' },
    });

function validateEmail(email: unknown): ValidationResult {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
}

interface ButtondownErrorResponse {
    code?: string;
    detail?: string;
    [key: string]: unknown;
}

async function parseButtondownError(response: Response): Promise<ButtondownErrorResponse | null> {
    try {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText) as ButtondownErrorResponse;

        logger.error(
            `Buttondown API error: Status ${response.status} ${response.statusText} - ${errorData.detail ?? errorData.code ?? 'Unknown error'}`,
        );

        return errorData;
    } catch {
        logger.error(`Buttondown API error: Status ${response.status} ${response.statusText} (unparseable response)`);

        return null;
    }
}

const ALREADY_SUBSCRIBED_CODES = new Set(['email_already_exists', 'subscriber_already_exists']);

async function subscribeToButtondown(email: string, apiKey: string): Promise<SubscriptionResult> {
    const response = await fetch('https://api.buttondown.com/v1/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ email_address: email }),
    });

    if (!response.ok) {
        const errorData = await parseButtondownError(response);

        if (errorData?.code && ALREADY_SUBSCRIBED_CODES.has(errorData.code)) {
            return { success: true, status: 200 };
        }

        return {
            success: false,
            error: 'Failed to subscribe. Please try again later.',
            status: response.status,
        };
    }

    return { success: true, status: 200 };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
        const body = (await request.json()) as { email?: string; website?: string };
        const { email, website: honeypot } = body;

        if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
            return jsonResponse({ ok: false }, 400);
        }

        const ip = getClientIp(request, clientAddress);

        if (isRateLimited(ip)) {
            return jsonResponse({ error: 'rate_limit' }, 429);
        }

        const emailValidation = validateEmail(email);

        if (!emailValidation.valid) {
            return jsonResponse({ error: emailValidation.error }, 400);
        }

        const apiKey = getSecret('BUTTONDOWN_API_KEY');

        if (!apiKey) {
            logger.error('BUTTONDOWN_API_KEY is not configured');
            return jsonResponse({ error: 'Newsletter service is not configured' }, 500);
        }

        const result = await subscribeToButtondown(email as string, apiKey as string);

        if (!result.success) {
            return jsonResponse({ error: result.error }, result.status);
        }

        return jsonResponse({ success: true, message: 'Successfully subscribed!' }, 200);
    } catch (error) {
        logger.error('Newsletter API error', error);

        return jsonResponse({ error: 'An unexpected error occurred' }, 500);
    }
};
