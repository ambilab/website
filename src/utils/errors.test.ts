import { describe, expect, it } from 'vitest';

import {
    AmbiLabError,
    ConfigurationError,
    ContentError,
    createErrorResponse,
    formatErrorForLogging,
    getErrorMessage,
    isAmbiLabError,
    LocaleError,
    NetworkError,
    ValidationError,
} from './errors';

describe('AmbiLabError', () => {
    it('should create error with default status code', () => {
        const error = new AmbiLabError('Test error');

        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('AmbiLabError');
    });

    it('should create error with custom status code', () => {
        const error = new AmbiLabError('Test error', 'TEST_CODE', 400);

        expect(error.code).toBe('TEST_CODE');
        expect(error.statusCode).toBe(400);
    });
});

describe('LocaleError', () => {
    it('should create locale error with context', () => {
        const error = new LocaleError('Invalid locale', 'invalid');

        expect(error.message).toContain('Locale error');
        expect(error.locale).toBe('invalid');
        expect(error.statusCode).toBe(400);
    });
});

describe('ContentError', () => {
    it('should create content error with optional ID', () => {
        const error = new ContentError('Content not found', 'post-123');

        expect(error.message).toContain('Content error');
        expect(error.contentId).toBe('post-123');
        expect(error.statusCode).toBe(404);
    });
});

describe('ValidationError', () => {
    it('should create validation error with field', () => {
        const error = new ValidationError('Invalid email', 'email');

        expect(error.message).toContain('Validation error');
        expect(error.field).toBe('email');
        expect(error.statusCode).toBe(400);
    });
});

describe('ConfigurationError', () => {
    it('should create configuration error', () => {
        const error = new ConfigurationError('Missing API key', 'API_KEY');

        expect(error.message).toContain('Configuration error');
        expect(error.configKey).toBe('API_KEY');
        expect(error.statusCode).toBe(500);
    });
});

describe('NetworkError', () => {
    it('should create network error with URL', () => {
        const error = new NetworkError('Request failed', 'https://api.example.com');

        expect(error.message).toContain('Network error');
        expect(error.url).toBe('https://api.example.com');
        expect(error.statusCode).toBe(503);
    });
});

describe('isAmbiLabError', () => {
    it('should return true for AmbiLabError instances', () => {
        const error = new AmbiLabError('Test');

        expect(isAmbiLabError(error)).toBe(true);
    });

    it('should return true for custom error classes', () => {
        const error = new LocaleError('Test', 'en');

        expect(isAmbiLabError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
        const error = new Error('Test');

        expect(isAmbiLabError(error)).toBe(false);
    });
});

describe('getErrorMessage', () => {
    it('should extract message from Error', () => {
        const error = new Error('Test error');

        expect(getErrorMessage(error)).toBe('Test error');
    });

    it('should return string errors directly', () => {
        expect(getErrorMessage('String error')).toBe('String error');
    });

    it('should return default message for unknown errors', () => {
        expect(getErrorMessage(null)).toBe('An unknown error occurred');
        expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
        expect(getErrorMessage(123)).toBe('An unknown error occurred');
    });
});

describe('formatErrorForLogging', () => {
    it('should format AmbiLabError with all fields', () => {
        const error = new AmbiLabError('Test', 'TEST_CODE', 400);
        const formatted = formatErrorForLogging(error);

        expect(formatted).toMatchObject({
            name: 'AmbiLabError',
            message: 'Test',
            code: 'TEST_CODE',
            statusCode: 400,
        });
        expect(formatted.stack).toBeDefined();
    });

    it('should format regular Error', () => {
        const error = new Error('Test');
        const formatted = formatErrorForLogging(error);

        expect(formatted).toMatchObject({
            name: 'Error',
            message: 'Test',
        });
        expect(formatted.stack).toBeDefined();
    });

    it('should format unknown errors', () => {
        const formatted = formatErrorForLogging('String error');

        expect(formatted).toEqual({
            error: 'String error',
        });
    });
});

describe('createErrorResponse', () => {
    it('should create response for AmbiLabError', () => {
        const error = new AmbiLabError('Test error', 'TEST_CODE', 404);
        const response = createErrorResponse(error);

        expect(response.status).toBe(404);
        expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should create response for regular Error', () => {
        const error = new Error('Test error');
        const response = createErrorResponse(error);

        expect(response.status).toBe(500);
    });

    it('should create response for unknown errors', () => {
        const response = createErrorResponse('String error');

        expect(response.status).toBe(500);
    });
});
