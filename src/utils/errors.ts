/**
 * Custom error classes for better error handling and debugging.
 */

export class AmbiLabError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
        public readonly statusCode: number = 500,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class LocaleError extends AmbiLabError {
    constructor(message: string, locale: string) {
        super(`Locale error: ${message}`, 'LOCALE_ERROR', 400);
        this.locale = locale;
    }

    public readonly locale: string;
}

export class ContentError extends AmbiLabError {
    constructor(message: string, contentId?: string) {
        super(`Content error: ${message}`, 'CONTENT_ERROR', 404);
        this.contentId = contentId;
    }

    public readonly contentId?: string;
}

export class ValidationError extends AmbiLabError {
    constructor(message: string, field?: string) {
        super(`Validation error: ${message}`, 'VALIDATION_ERROR', 400);
        this.field = field;
    }

    public readonly field?: string;
}

export class ConfigurationError extends AmbiLabError {
    constructor(message: string, configKey?: string) {
        super(`Configuration error: ${message}`, 'CONFIG_ERROR', 500);
        this.configKey = configKey;
    }

    public readonly configKey?: string;
}

export class NetworkError extends AmbiLabError {
    constructor(message: string, url?: string) {
        super(`Network error: ${message}`, 'NETWORK_ERROR', 503);
        this.url = url;
    }

    public readonly url?: string;
}

/**
 * Type guard to check if an error is an AmbiLabError.
 */
export function isAmbiLabError(error: unknown): error is AmbiLabError {
    return error instanceof AmbiLabError;
}

/**
 * Extract a safe error message from any error type.
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unknown error occurred';
}

/**
 * Format error for logging with relevant context.
 */
export function formatErrorForLogging(error: unknown): Record<string, unknown> {
    if (isAmbiLabError(error)) {
        return {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        };
    }

    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        };
    }

    return {
        error: String(error),
    };
}

/**
 * Create an appropriate error response for API routes.
 */
export function createErrorResponse(error: unknown): Response {
    const message = getErrorMessage(error);
    const statusCode = isAmbiLabError(error) ? error.statusCode : 500;

    return new Response(
        JSON.stringify({
            error: message,
            code: isAmbiLabError(error) ? error.code : 'INTERNAL_ERROR',
        }),
        {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
}
