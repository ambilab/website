import { createLogger } from './logger';

const logger = createLogger({ prefix: 'SafeExecute' });

// When fallback is provided, return type is T
export function safeExecute<T>(fn: () => T, fallback: T, errorMessage?: string): T;
// When fallback is not provided, return type is T | undefined
export function safeExecute<T>(fn: () => T, fallback?: undefined, errorMessage?: string): T | undefined;
// Implementation
export function safeExecute<T>(fn: () => T, fallback?: T, errorMessage?: string): T | undefined {
    try {
        return fn();
    } catch (error) {
        logger.error(errorMessage || 'Execution failed', error);
        return fallback;
    }
}
