import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toggleDarkMode } from './dom';

describe('dom', () => {
    let mockDocumentElement: HTMLElement;
    let mockLocalStorage: Map<string, string>;

    beforeEach(() => {
        mockDocumentElement = document.documentElement;
        mockLocalStorage = new Map<string, string>();
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => mockLocalStorage.get(key) ?? null,
            setItem: (key: string, value: string) => {
                mockLocalStorage.set(key, value);
            },
            removeItem: (key: string) => {
                mockLocalStorage.delete(key);
            },
            clear: () => mockLocalStorage.clear(),
            length: 0,
            key: () => null,
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('toggleDarkMode', () => {
        it('should add dark class when not present', () => {
            mockDocumentElement.classList.remove('dark');

            toggleDarkMode();

            expect(mockDocumentElement.classList.contains('dark')).toBe(true);
            expect(mockLocalStorage.get('theme')).toBe('dark');
        });

        it('should remove dark class when present', () => {
            mockDocumentElement.classList.add('dark');

            toggleDarkMode();

            expect(mockDocumentElement.classList.contains('dark')).toBe(false);
            expect(mockLocalStorage.get('theme')).toBe('light');
        });

        it('should persist theme preference to localStorage', () => {
            mockDocumentElement.classList.remove('dark');

            toggleDarkMode();

            expect(mockLocalStorage.get('theme')).toBe('dark');
        });

        it('should handle localStorage.setItem failure gracefully', () => {
            const failingStorage = {
                setItem: vi.fn(() => {
                    throw new Error('QuotaExceeded');
                }),
                getItem: () => null,
                removeItem: () => {},
                clear: () => {},
                length: 0,
                key: () => null,
            };
            vi.stubGlobal('localStorage', failingStorage);

            expect(() => toggleDarkMode()).not.toThrow();
        });
    });
});
