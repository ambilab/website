/**
 * Vitest Test Setup
 *
 * This file runs before all tests to configure the testing environment.
 */

import '@testing-library/jest-dom';

import { cleanup } from '@testing-library/svelte';
import { afterEach, expect, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock console methods in tests to reduce noise
global.console = {
    ...console,
    // Uncomment to silence console.log in tests
    // log: vi.fn(),
    // debug: vi.fn(),
    // info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
};

// Extend Vitest's expect with jest-dom matchers
expect.extend({
    // Add custom matchers here if needed
});
