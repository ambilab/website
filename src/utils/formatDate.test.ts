import { describe, expect, it } from 'vitest';

import { formatDate } from './formatDate';

describe('formatDate', () => {
    it('should format date in English locale', () => {
        const date = new Date('2024-01-15T12:00:00Z');
        const formatted = formatDate(date, 'en');

        expect(formatted).toMatch(/January 15, 2024/);
    });

    it('should format date in Czech locale', () => {
        const date = new Date('2024-01-15T12:00:00Z');
        const formatted = formatDate(date, 'cs');

        expect(formatted).toContain('2024');
        expect(formatted).toMatch(/15\./);
    });

    it('should throw error for invalid date', () => {
        const invalidDate = new Date('invalid');

        expect(() => formatDate(invalidDate, 'en')).toThrow('formatDate received an invalid Date for locale "en".');
    });

    it('should cache formatters for performance', () => {
        const date1 = new Date('2024-01-15T12:00:00Z');
        const date2 = new Date('2024-02-20T12:00:00Z');

        const formatted1 = formatDate(date1, 'en');
        const formatted2 = formatDate(date2, 'en');

        expect(formatted1).toBeTruthy();
        expect(formatted2).toBeTruthy();
        expect(formatted1).not.toBe(formatted2);
    });
});
