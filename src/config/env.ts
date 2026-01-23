/**
 * Environment Variable Validation
 *
 * Validates environment variables at startup using Zod schemas.
 * Provides type-safe access to environment variables.
 */

import { createLogger } from '@utils/logger';
import { z } from 'zod';

const logger = createLogger({ prefix: 'EnvValidation' });

/**
 * Schema for environment variables.
 * Add new environment variables here with proper validation.
 */
const envSchema = z.object({
    /**
     * Buttondown Newsletter API Key
     * Optional in development, required in production for newsletter functionality
     */
    BUTTONDOWN_API_KEY: z.string().optional(),

    /**
     * Node environment
     * Automatically set by Astro/Vite
     */
    NODE_ENV: z.enum(['development', 'production', 'test']).optional(),

    /**
     * Development mode flag
     * Automatically set by Astro/Vite
     */
    DEV: z.string().optional(),

    /**
     * Production mode flag
     * Automatically set by Astro/Vite
     */
    PROD: z.string().optional(),
});

/**
 * Validated environment variables.
 * Access this instead of import.meta.env directly for type safety.
 */
export type ValidatedEnv = z.infer<typeof envSchema>;

let validatedEnv: ValidatedEnv | null = null;

/**
 * Validates environment variables against the schema.
 * Should be called at application startup.
 *
 * @param env - Environment variables to validate (defaults to import.meta.env)
 * @returns Validated environment variables
 * @throws Error if validation fails
 */
export function validateEnv(env: Record<string, unknown> = import.meta.env as Record<string, unknown>): ValidatedEnv {
    if (validatedEnv) {
        return validatedEnv;
    }

    try {
        // Convert Astro's import.meta.env to a plain object for validation
        const envObject: Record<string, unknown> = {
            BUTTONDOWN_API_KEY: env.BUTTONDOWN_API_KEY,
            NODE_ENV: env.NODE_ENV,
            DEV: env.DEV ? 'true' : undefined,
            PROD: env.PROD ? 'true' : undefined,
        };

        validatedEnv = envSchema.parse(envObject);
        logger.info('Environment variables validated successfully');
        return validatedEnv;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('\n');

            logger.error('Environment variable validation failed', {
                errors: error.errors,
            });

            throw new Error(
                `Environment variable validation failed:\n${missingVars}\n\nPlease check your .env file or environment configuration.`,
            );
        }

        throw error;
    }
}

/**
 * Gets validated environment variables.
 * Validates on first access if not already validated.
 *
 * @returns Validated environment variables
 */
export function getEnv(): ValidatedEnv {
    if (!validatedEnv) {
        return validateEnv();
    }

    return validatedEnv;
}

/**
 * Checks if a required environment variable is set.
 *
 * @param key - Environment variable key
 * @returns True if the variable is set and not empty
 */
export function hasEnv(key: keyof ValidatedEnv): boolean {
    const env = getEnv();
    const value = env[key];

    return value !== undefined && value !== null && value !== '';
}
