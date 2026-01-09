/**
 * Safe Execute Utility
 *
 * Executes a function safely, catching any errors and returning a fallback
 * value or undefined.
 *
 * Logs errors for debugging while preventing application crashes.
 */
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'SafeExecute' });

/**
 * Executes a function safely with a fallback value.
 *
 * If the function throws an error, logs it and returns the provided fallback.
 *
 * This overload ensures the return type matches the fallback type.
 *
 * @template T - The return type of the function
 * @param fn - The function to execute
 * @param fallback - The value to return if execution fails
 * @param errorMessage - Optional custom error message for logging
 * @returns The function result or the fallback value
 */
export function safeExecute<T>(fn: () => T, fallback: T, errorMessage?: string): T;

/**
 * Executes a function safely without a fallback value.
 *
 * If the function throws an error, logs it and returns undefined.
 *
 * This overload is used when no fallback is provided.
 *
 * @template T - The return type of the function
 * @param fn - The function to execute
 * @param fallback - Optional fallback (undefined)
 * @param errorMessage - Optional custom error message for logging
 * @returns The function result or undefined
 */
export function safeExecute<T>(fn: () => T, fallback?: undefined, errorMessage?: string): T | undefined;

/**
 * Implementation of safeExecute with overloaded signatures.
 *
 * Executes the provided function, catching any errors and returning either
 * the fallback value (if provided) or undefined.
 *
 * All errors are logged for debugging purposes.
 *
 * @template T - The return type of the function
 * @param fn - The function to execute
 * @param fallback - Optional fallback value to return on error
 * @param errorMessage - Optional custom error message for logging
 * @returns The function result, fallback value, or undefined
 */
export function safeExecute<T>(fn: () => T, fallback?: T, errorMessage?: string): T | undefined {
    try {
        return fn();
    } catch (error) {
        logger.error(errorMessage || 'Execution failed', error);
        return fallback;
    }
}
