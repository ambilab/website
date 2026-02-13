import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import { safeExecute } from './safe-execute';

describe('safeExecute', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('should return the result when fn succeeds', () => {
        const result = safeExecute(() => 42, 0);

        expect(result).toBe(42);
    });

    it('should return fallback when fn throws', () => {
        const result = safeExecute(() => {
            throw new Error('Test error');
        }, 'fallback');

        expect(result).toBe('fallback');
    });

    it('should return undefined when fn throws and no fallback provided', () => {
        const result = safeExecute(() => {
            throw new Error('Test error');
        });

        expect(result).toBeUndefined();
    });

    it('should pass custom error message to logger when provided', () => {
        const throwFn = () => {
            throw new Error('Original error');
        };
        const result = safeExecute(throwFn, null, 'Custom error message');

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Custom error message'),
            expect.any(Error),
            {},
        );
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error throws', () => {
        const result = safeExecute(() => {
            throw 'string error';
        }, 'recovered');

        expect(result).toBe('recovered');
    });

    it('should propagate async-like synchronous return values', () => {
        const obj = { key: 'value' };
        const result = safeExecute(() => obj, {});

        expect(result).toBe(obj);
    });
});
