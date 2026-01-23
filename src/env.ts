import { z } from 'zod';

import { ConfigurationError } from './utils/errors';

/**
 * Environment variable schema definition.
 * Add all required and optional environment variables here.
 */
const envSchema = z.object({
    // Optional: Buttondown API key for newsletter functionality
    BUTTONDOWN_API_KEY: z.string().optional(),

    // Public environment variables (exposed to client)
    PUBLIC_SITE_URL: z.string().url().default('https://ambilab.com'),

    // Runtime environment
    DEV: z.boolean().default(false),
    PROD: z.boolean().default(false),
    MODE: z.enum(['development', 'production', 'test']).default('production'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables.
 * Use this instead of import.meta.env for type-safe access.
 */
let validatedEnv: Env | null = null;

/**
 * Get validated environment variables.
 * Throws ConfigurationError if validation fails.
 */
export function getEnv(): Env {
    if (validatedEnv) {
        return validatedEnv;
    }

    try {
        validatedEnv = envSchema.parse({
            BUTTONDOWN_API_KEY: import.meta.env.BUTTONDOWN_API_KEY,
            PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE,
            DEV: import.meta.env.DEV,
            PROD: import.meta.env.PROD,
            MODE: import.meta.env.MODE,
        });

        return validatedEnv;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');

            throw new ConfigurationError(`Environment validation failed: ${issues}`);
        }

        throw error;
    }
}

/**
 * Check if a specific environment variable is set.
 * Useful for optional features.
 */
export function hasEnvVar(key: keyof Env): boolean {
    const env = getEnv();

    return env[key] !== undefined && env[key] !== '';
}

/**
 * Validate environment variables at build time.
 * Call this in astro.config.ts to fail fast.
 */
export function validateEnv(): void {
    try {
        getEnv();
    } catch (error) {
        console.error('Environment validation failed:');

        if (error instanceof ConfigurationError) {
            console.error(error.message);
        }

        throw error;
    }
}
