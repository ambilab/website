#!/usr/bin/env tsx

/**
 * Environment Variable Validation Script
 *
 * Validates environment variables before application startup.
 * Run this script to check if all required environment variables are set.
 *
 * Usage:
 *   pnpm validate:env
 */

import { validateEnv } from '../config/env';

try {
    validateEnv(process.env as Record<string, unknown>);
    console.log('✅ Environment variables are valid');
    process.exit(0);
} catch (error) {
    console.error('❌ Environment variable validation failed:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
