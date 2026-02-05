import { createLogger } from '@utils/logger';
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';

const logger = createLogger({ prefix: 'Newsletter API' });

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

async function logButtondownError(response: Response): Promise<void> {
    logger.error(`Buttondown API error: Status ${response.status} ${response.statusText}`);

    try {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText) as { message?: string; error?: string; [key: string]: unknown };
        const errorMessage = errorData.message || errorData.error;

        logger.error(`Buttondown API error message: ${errorMessage ?? 'Unknown error'}`);
    } catch {
        logger.error('Failed to parse Buttondown error response as JSON');
    }
}

async function subscribeToButtondown(email: string, apiKey: string): Promise<SubscriptionResult> {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ email_address: email }),
    });

    if (!response.ok) {
        await logButtondownError(response);

        return {
            success: false,
            error: 'Failed to subscribe. Please try again later.',
            status: response.status,
        };
    }

    return { success: true, status: 200 };
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email } = body;

        const emailValidation = validateEmail(email);

        if (!emailValidation.valid) {
            return jsonResponse({ error: emailValidation.error }, 400);
        }

        const apiKey = getSecret('BUTTONDOWN_API_KEY');

        if (!apiKey) {
            logger.error('BUTTONDOWN_API_KEY is not configured');
            return jsonResponse({ error: 'Newsletter service is not configured' }, 500);
        }

        const result = await subscribeToButtondown(email, apiKey);

        if (!result.success) {
            return jsonResponse({ error: result.error }, result.status);
        }

        return jsonResponse({ success: true, message: 'Successfully subscribed!' }, 200);
    } catch (error) {
        logger.error('Newsletter API error', error);

        return jsonResponse({ error: 'An unexpected error occurred' }, 500);
    }
};
