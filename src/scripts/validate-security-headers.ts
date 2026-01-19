import { buildCSP, generateNonce, STATIC_SECURITY_HEADERS } from '../config/security';

interface ValidationResult {
    success: boolean;
    message: string;
}

function validateSecurityHeaders(): ValidationResult[] {
    const results: ValidationResult[] = [];

    try {
        const nonce1 = generateNonce();
        const nonce2 = generateNonce();

        if (nonce1 === nonce2) {
            results.push({
                success: false,
                message: '[FAIL] Nonce generation: Multiple calls returned the same nonce',
            });
        } else {
            results.push({
                success: true,
                message: '[PASS] Nonce generation: Produces unique nonces',
            });
        }

        try {
            atob(nonce1);
            results.push({
                success: true,
                message: '[PASS] Nonce format: Valid base64 encoding',
            });
        } catch {
            results.push({
                success: false,
                message: '[FAIL] Nonce format: Invalid base64 encoding',
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `[FAIL] Nonce generation: ${error}`,
        });
    }

    try {
        const testNonce = 'test-nonce-123';
        const prodCSP = buildCSP({ nonce: testNonce, isDev: false });

        if (prodCSP.includes(`'nonce-${testNonce}'`)) {
            results.push({
                success: true,
                message: '[PASS] Production CSP: Nonce properly embedded',
            });
        } else {
            results.push({
                success: false,
                message: '[FAIL] Production CSP: Nonce not properly embedded',
            });
        }

        if (prodCSP.includes('upgrade-insecure-requests')) {
            results.push({
                success: true,
                message: '[PASS] Production CSP: Contains upgrade-insecure-requests',
            });
        } else {
            results.push({
                success: false,
                message: '[FAIL] Production CSP: Missing upgrade-insecure-requests',
            });
        }

        if (prodCSP.includes("'unsafe-inline'")) {
            results.push({
                success: false,
                message: '[FAIL] Production CSP: Should not contain unsafe-inline',
            });
        } else {
            results.push({
                success: true,
                message: "[PASS] Production CSP: Doesn't contain unsafe-inline",
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `[FAIL] Production CSP validation: ${error}`,
        });
    }

    try {
        const testNonce = 'test-nonce-123';
        const devCSP = buildCSP({ nonce: testNonce, isDev: true });

        if (devCSP.includes("'unsafe-inline'")) {
            results.push({
                success: true,
                message: '[PASS] Development CSP: Contains unsafe-inline',
            });
        } else {
            results.push({
                success: false,
                message: '[FAIL] Development CSP: Should contain unsafe-inline',
            });
        }

        if (devCSP.includes('upgrade-insecure-requests')) {
            results.push({
                success: false,
                message: '[FAIL] Development CSP: Should not contain upgrade-insecure-requests',
            });
        } else {
            results.push({
                success: true,
                message: "[PASS] Development CSP: Doesn't contain upgrade-insecure-requests",
            });
        }

        if (!devCSP.includes('ws://localhost:*') || !devCSP.includes('ws://127.0.0.1:*')) {
            results.push({
                success: false,
                message: '[FAIL] Development CSP: Missing WebSocket endpoints for HMR',
            });
        } else {
            results.push({
                success: true,
                message: '[PASS] Development CSP: Contains WebSocket endpoints for HMR',
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `[FAIL] Development CSP validation: ${error}`,
        });
    }

    try {
        const expectedHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy'];

        const missingHeaders = expectedHeaders.filter((header) => !(header in STATIC_SECURITY_HEADERS));

        if (missingHeaders.length > 0) {
            results.push({
                success: false,
                message: `[FAIL] Static headers: Missing ${missingHeaders.join(', ')}`,
            });
        } else {
            results.push({
                success: true,
                message: '[PASS] Static headers: All required headers present',
            });
        }

        if (STATIC_SECURITY_HEADERS['X-Content-Type-Options'] === 'nosniff') {
            results.push({
                success: true,
                message: '[PASS] X-Content-Type-Options: Correctly set to "nosniff"',
            });
        } else {
            results.push({
                success: false,
                message: '[FAIL] X-Content-Type-Options: Should be "nosniff"',
            });
        }

        if (STATIC_SECURITY_HEADERS['X-Frame-Options'] === 'SAMEORIGIN') {
            results.push({
                success: true,
                message: '[PASS] X-Frame-Options: Correctly set to "SAMEORIGIN"',
            });
        } else {
            results.push({
                success: false,
                message: '[FAIL] X-Frame-Options: Should be "SAMEORIGIN"',
            });
        }
    } catch (error) {
        results.push({
            success: false,
            message: `[FAIL] Static headers validation: ${error}`,
        });
    }

    return results;
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
    console.log('\n[SUCCESS] All security header validations passed!');
    process.exit(0);
} else {
    console.log(`\n[ERROR] ${failures.length} validation(s) failed`);
    process.exit(1);
}
