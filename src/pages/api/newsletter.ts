import { createLogger } from '@utils/logger';
import type { APIRoute } from 'astro';

const logger = createLogger({ prefix: 'Newsletter API' });

const jsonResponse = (data: unknown, status: number) =>
    Response.json(data, {
        status,
        headers: { 'Cache-Control': 'no-store' },
    });

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return jsonResponse({ error: 'Email is required' }, 400);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return jsonResponse({ error: 'Invalid email format' }, 400);
        }

        const buttondownApiKey = import.meta.env.BUTTONDOWN_API_KEY;

        if (!buttondownApiKey) {
            logger.error('BUTTONDOWN_API_KEY is not set');
            return jsonResponse({ error: 'Newsletter service is not configured' }, 500);
        }

        const response = await fetch('https://api.buttondown.email/v1/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${buttondownApiKey}`,
            },
            body: JSON.stringify({
                email,
            }),
        });

        if (!response.ok) {
            // Log only the status code to avoid exposing sensitive information
            logger.error(`Buttondown API error: Status ${response.status}`);

            try {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText) as { message?: string; error?: string };
                    // Only log sanitized error identifiers, not the full response
                    if (errorData.message || errorData.error) {
                        logger.error(`Buttondown API error message: ${errorData.message || errorData.error}`);
                    }
                } catch {
                    // JSON parsing failed, don't log raw text to avoid exposing sensitive data
                }
            } catch {
                // Failed to read response body, status code already logged above
            }

            return jsonResponse({ error: 'Failed to subscribe. Please try again later.' }, response.status);
        }

        return jsonResponse({ success: true, message: 'Successfully subscribed!' }, 200);
    } catch (error) {
        logger.error('Newsletter API error', error);

        return jsonResponse({ error: 'An unexpected error occurred' }, 500);
    }
};
