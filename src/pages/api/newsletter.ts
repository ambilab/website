import { createLogger } from '@utils/logger';
import type { APIRoute } from 'astro';

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

function validateApiKey(apiKey: string | undefined): ValidationResult {
    if (!apiKey) {
        logger.error("BUTTONDOWN_API_KEY isn't set");

        return { valid: false, error: "Newsletter service isn't configured" };
    }

    return { valid: true };
}

async function logButtondownError(response: Response): Promise<void> {
    logger.error(`Buttondown API error: Status ${response.status}`);

    try {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText) as { message?: string; error?: string };
        const errorMessage = errorData.message || errorData.error;

        if (errorMessage) {
            logger.error(`Buttondown API error message: ${errorMessage}`);
        }
    } catch {
        // Failed to parse error response, status code already logged.
    }
}

async function subscribeToButtondown(email: string, apiKey: string): Promise<SubscriptionResult> {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ email }),
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

        const buttondownApiKey = import.meta.env.BUTTONDOWN_API_KEY;
        const apiKeyValidation = validateApiKey(buttondownApiKey);

        if (!apiKeyValidation.valid) {
            return jsonResponse({ error: apiKeyValidation.error }, 500);
        }

        const result = await subscribeToButtondown(email, buttondownApiKey);

        if (!result.success) {
            return jsonResponse({ error: result.error }, result.status);
        }

        return jsonResponse({ success: true, message: 'Successfully subscribed!' }, 200);
    } catch (error) {
        logger.error('Newsletter API error', error);

        return jsonResponse({ error: 'An unexpected error occurred' }, 500);
    }
};
