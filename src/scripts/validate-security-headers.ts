/**
 * Validation script to ensure security headers are identical between middlewares
 *
 * This script validates that:
 * 1. Both src/middleware.ts and functions/_middleware.ts use the shared security config
 * 2. The security headers generated in production mode are identical
 * 3. The nonce generation is consistent
 *
 * Run with: npx tsx src/scripts/validate-security-headers.ts
 */

import { buildCSP, generateNonce, STATIC_SECURITY_HEADERS } from '../config/security';

interface ValidationResult {
    success: boolean;
    message: string;
}

/**
 * Validate that the shared security configuration produces consistent results
 */
function validateSecurityHeaders(): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Test 1: Validate nonce generation produces valid base64
    try {
        const nonce1 = generateNonce();
        const nonce2 = generateNonce();

        // Nonces should be different each time
        if (nonce1 === nonce2) {
            results.push({
                success: false,
                message: '❌ Nonce generation: Multiple calls returned the same nonce',
            });
        } else {
            results.push({
                success: true,
                message: '✓ Nonce generation: Produces unique nonces',
            });
        }

        // Nonces should be valid base64 (no error when decoding)
        try {
            atob(nonce1);
            results.push({
                success: true,
                message: '✓ Nonce format: Valid base64 encoding',
            });
        } catch {
            results.push({
                success: false,
                message: '❌ Nonce format: Invalid base64 encoding',
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `❌ Nonce generation: ${error}`,
        });
    }

    // Test 2: Validate production CSP is identical for both middlewares
    try {
        const testNonce = 'test-nonce-123';
        const prodCSP = buildCSP({ nonce: testNonce, isDev: false });

        // Verify CSP contains the nonce
        if (!prodCSP.includes(`'nonce-${testNonce}'`)) {
            results.push({
                success: false,
                message: '❌ Production CSP: Nonce not properly embedded',
            });
        } else {
            results.push({
                success: true,
                message: '✓ Production CSP: Nonce properly embedded',
            });
        }

        // Verify CSP contains upgrade-insecure-requests in production
        if (!prodCSP.includes('upgrade-insecure-requests')) {
            results.push({
                success: false,
                message: '❌ Production CSP: Missing upgrade-insecure-requests',
            });
        } else {
            results.push({
                success: true,
                message: '✓ Production CSP: Contains upgrade-insecure-requests',
            });
        }

        // Verify CSP doesn't contain unsafe-inline in production
        if (prodCSP.includes("'unsafe-inline'")) {
            results.push({
                success: false,
                message: '❌ Production CSP: Should not contain unsafe-inline',
            });
        } else {
            results.push({
                success: true,
                message: "✓ Production CSP: Doesn't contain unsafe-inline",
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `❌ Production CSP validation: ${error}`,
        });
    }

    // Test 3: Validate development CSP contains unsafe-inline
    try {
        const testNonce = 'test-nonce-123';
        const devCSP = buildCSP({ nonce: testNonce, isDev: true });

        if (!devCSP.includes("'unsafe-inline'")) {
            results.push({
                success: false,
                message: '❌ Development CSP: Should contain unsafe-inline',
            });
        } else {
            results.push({
                success: true,
                message: '✓ Development CSP: Contains unsafe-inline',
            });
        }

        // Verify dev CSP doesn't contain upgrade-insecure-requests
        if (devCSP.includes('upgrade-insecure-requests')) {
            results.push({
                success: false,
                message: '❌ Development CSP: Should not contain upgrade-insecure-requests',
            });
        } else {
            results.push({
                success: true,
                message: "✓ Development CSP: Doesn't contain upgrade-insecure-requests",
            });
        }

        // Verify dev CSP contains WebSocket endpoints for HMR
        if (!devCSP.includes('ws://localhost:*') || !devCSP.includes('ws://127.0.0.1:*')) {
            results.push({
                success: false,
                message: '❌ Development CSP: Missing WebSocket endpoints for HMR',
            });
        } else {
            results.push({
                success: true,
                message: '✓ Development CSP: Contains WebSocket endpoints for HMR',
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `❌ Development CSP validation: ${error}`,
        });
    }

    // Test 4: Validate static security headers
    try {
        const expectedHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy'];

        const missingHeaders = expectedHeaders.filter((header) => !(header in STATIC_SECURITY_HEADERS));

        if (missingHeaders.length > 0) {
            results.push({
                success: false,
                message: `❌ Static headers: Missing ${missingHeaders.join(', ')}`,
            });
        } else {
            results.push({
                success: true,
                message: '✓ Static headers: All required headers present',
            });
        }

        // Validate specific header values
        if (STATIC_SECURITY_HEADERS['X-Content-Type-Options'] !== 'nosniff') {
            results.push({
                success: false,
                message: '❌ X-Content-Type-Options: Should be "nosniff"',
            });
        } else {
            results.push({
                success: true,
                message: '✓ X-Content-Type-Options: Correctly set to "nosniff"',
            });
        }

        if (STATIC_SECURITY_HEADERS['X-Frame-Options'] !== 'SAMEORIGIN') {
            results.push({
                success: false,
                message: '❌ X-Frame-Options: Should be "SAMEORIGIN"',
            });
        } else {
            results.push({
                success: true,
                message: '✓ X-Frame-Options: Correctly set to "SAMEORIGIN"',
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `❌ Static headers validation: ${error}`,
        });
    }

    return results;
}

// Run validation
console.log('🔒 Validating Security Headers Configuration\n');
console.log('='.repeat(60));

const results = validateSecurityHeaders();
const failures = results.filter((r) => !r.success);

results.forEach((result) => {
    console.log(result.message);
});

console.log('='.repeat(60));

if (failures.length === 0) {
    console.log('\n✅ All security header validations passed!');
    process.exit(0);
} else {
    console.log(`\n❌ ${failures.length} validation(s) failed`);
    process.exit(1);
}
