import { buildCSP, generateNonce, STATIC_SECURITY_HEADERS } from '../config/security';

interface ValidationResult {
    success: boolean;
    message: string;
}

function createResult(success: boolean, message: string): ValidationResult {
    return { success, message };
}

function validateNonceGeneration(): ValidationResult[] {
    const results: ValidationResult[] = [];

    try {
        const nonce1 = generateNonce();
        const nonce2 = generateNonce();

        const isUnique = nonce1 !== nonce2;

        results.push(
            createResult(
                isUnique,
                isUnique
                    ? '[PASS] Nonce generation: Produces unique nonces'
                    : '[FAIL] Nonce generation: Multiple calls returned the same nonce',
            ),
        );

        try {
            atob(nonce1);
            results.push(createResult(true, '[PASS] Nonce format: Valid base64 encoding'));
        } catch {
            results.push(createResult(false, '[FAIL] Nonce format: Invalid base64 encoding'));
        }
    } catch (error) {
        results.push(createResult(false, `[FAIL] Nonce generation: ${error}`));
    }

    return results;
}

function validateProductionCSP(): ValidationResult[] {
    const results: ValidationResult[] = [];

    try {
        const prodCSP = buildCSP({ isDev: false });

        // NOTE: We intentionally use 'unsafe-inline' instead of nonces because
        // Astro's hydration system doesn't support CSP nonces for dynamically
        // injected scripts. This is a known limitation.
        const hasUnsafeInline = prodCSP.includes("'unsafe-inline'");

        results.push(
            createResult(
                hasUnsafeInline,
                hasUnsafeInline
                    ? '[PASS] Production CSP: Contains unsafe-inline (required for Astro hydration)'
                    : '[FAIL] Production CSP: Missing unsafe-inline (required for Astro hydration)',
            ),
        );

        const hasUpgrade = prodCSP.includes('upgrade-insecure-requests');

        results.push(
            createResult(
                hasUpgrade,
                hasUpgrade
                    ? '[PASS] Production CSP: Contains upgrade-insecure-requests'
                    : '[FAIL] Production CSP: Missing upgrade-insecure-requests',
            ),
        );
    } catch (error) {
        results.push(createResult(false, `[FAIL] Production CSP validation: ${error}`));
    }

    return results;
}

function validateDevelopmentCSP(): ValidationResult[] {
    const results: ValidationResult[] = [];

    try {
        const devCSP = buildCSP({ isDev: true });

        const hasUnsafeInline = devCSP.includes("'unsafe-inline'");

        results.push(
            createResult(
                hasUnsafeInline,
                hasUnsafeInline
                    ? '[PASS] Development CSP: Contains unsafe-inline'
                    : '[FAIL] Development CSP: Should contain unsafe-inline',
            ),
        );

        const hasUpgrade = devCSP.includes('upgrade-insecure-requests');

        results.push(
            createResult(
                !hasUpgrade,
                hasUpgrade
                    ? '[FAIL] Development CSP: Should not contain upgrade-insecure-requests'
                    : "[PASS] Development CSP: Doesn't contain upgrade-insecure-requests",
            ),
        );

        const hasWebSocketEndpoints = devCSP.includes('ws://localhost:*') && devCSP.includes('ws://127.0.0.1:*');

        results.push(
            createResult(
                hasWebSocketEndpoints,
                hasWebSocketEndpoints
                    ? '[PASS] Development CSP: Contains WebSocket endpoints for HMR'
                    : '[FAIL] Development CSP: Missing WebSocket endpoints for HMR',
            ),
        );
    } catch (error) {
        results.push(createResult(false, `[FAIL] Development CSP validation: ${error}`));
    }

    return results;
}

function validateStaticHeaders(): ValidationResult[] {
    const results: ValidationResult[] = [];

    try {
        const expectedHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy'];
        const missingHeaders = expectedHeaders.filter((header) => !(header in STATIC_SECURITY_HEADERS));

        const hasAllHeaders = missingHeaders.length === 0;

        results.push(
            createResult(
                hasAllHeaders,
                hasAllHeaders
                    ? '[PASS] Static headers: All required headers present'
                    : `[FAIL] Static headers: Missing ${missingHeaders.join(', ')}`,
            ),
        );

        const contentTypeCorrect = STATIC_SECURITY_HEADERS['X-Content-Type-Options'] === 'nosniff';

        results.push(
            createResult(
                contentTypeCorrect,
                contentTypeCorrect
                    ? '[PASS] X-Content-Type-Options: Correctly set to “nosniff”'
                    : '[FAIL] X-Content-Type-Options: Should be “nosniff”',
            ),
        );

        const frameOptionsCorrect = STATIC_SECURITY_HEADERS['X-Frame-Options'] === 'SAMEORIGIN';

        results.push(
            createResult(
                frameOptionsCorrect,
                frameOptionsCorrect
                    ? '[PASS] X-Frame-Options: Correctly set to “SAMEORIGIN”'
                    : '[FAIL] X-Frame-Options: Should be “SAMEORIGIN”',
            ),
        );
    } catch (error) {
        results.push(createResult(false, `[FAIL] Static headers validation: ${error}`));
    }

    return results;
}

function validateSecurityHeaders(): ValidationResult[] {
    return [
        ...validateNonceGeneration(),
        ...validateProductionCSP(),
        ...validateDevelopmentCSP(),
        ...validateStaticHeaders(),
    ];
}

console.log('Validating Security Headers Configuration\n');
console.log('='.repeat(60));

const results = validateSecurityHeaders();
const failures = results.filter((r) => !r.success);

results.forEach((result) => {
    console.log(result.message);
});

console.log('='.repeat(60));

if (failures.length === 0) {
    console.log('\n[SUCCESS] All security header validations passed');

    process.exit(0);
} else {
    console.log(`\n[ERROR] ${failures.length} validation(s) failed`);

    process.exit(1);
}
