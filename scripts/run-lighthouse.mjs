#!/usr/bin/env node

/**
 * Lighthouse CI Test Runner for SSR Applications
 *
 * This script orchestrates the complete Lighthouse CI workflow for server-side
 * rendered (SSR) Astro applications using the Cloudflare adapter. Unlike static
 * sites, SSR apps require a running server for Lighthouse to test against.
 *
 * Workflow:
 * 1. Build the project (creates dist/ with SSR output)
 * 2. Start Wrangler preview server (Cloudflare Pages local dev server)
 * 3. Wait for server to be ready and responding
 * 4. Run Lighthouse tests (collect performance metrics)
 * 5. Assert against performance budgets (fail if thresholds not met)
 * 6. Upload results to temporary storage (7-day retention)
 * 7. Clean up server process on exit
 *
 * Usage:
 *   pnpm run perf              - Run complete workflow
 *   node scripts/run-lighthouse.mjs  - Direct execution
 *
 * Environment:
 *   SERVER_URL: Target URL for testing (default: http://localhost:4321)
 *   WAIT_TIMEOUT: Max time to wait for server startup in ms (default: 30000)
 *
 * Exit Codes:
 *   0: Success - all tests passed
 *   1: Failure - build, server, or performance tests failed
 *   130: SIGINT (Ctrl+C) - graceful shutdown
 *   143: SIGTERM - graceful shutdown
 *
 * @see {@link file://./lighthouserc.cjs} for performance budget configuration
 */

import { spawn } from 'node:child_process';
import process from 'node:process';

/**
 * Configuration constants
 * These can be overridden via environment variables if needed
 */
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4321';
const WAIT_TIMEOUT = Number.parseInt(process.env.WAIT_TIMEOUT || '30000', 10);

/**
 * Global reference to the preview server process
 * Used for cleanup in finally block and signal handlers
 * @type {import('node:child_process').ChildProcess | null}
 */
let serverProcess = null;

/**
 * Waits for the preview server to become ready by polling with HEAD requests
 *
 * This function repeatedly attempts to connect to the server until it responds
 * successfully or the timeout is reached. Uses HEAD requests to minimize overhead.
 *
 * @param {string} url - The URL to poll for server readiness
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} Resolves to true when server is ready
 * @throws {Error} If server doesn't start within the timeout period
 *
 * @example
 * await waitForServer('http://localhost:4321', 30000);
 * // Server is now ready for testing
 */
async function waitForServer(url, timeout) {
    const startTime = Date.now();
    const checkInterval = 500; // Check every 500ms

    while (Date.now() - startTime < timeout) {
        try {
            // Use HEAD request to check server availability without downloading content
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                console.log(`Server is ready at ${url}`);
                return true;
            }
        } catch {
            // Server not ready yet, continue polling
            // Common errors: ECONNREFUSED, ENOTFOUND
        }

        // Wait before next check to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    // Timeout reached without successful connection
    throw new Error(`Server did not start within ${timeout}ms`);
}

/**
 * Executes a shell command and returns a promise that resolves when it completes
 *
 * This wrapper around child_process.spawn provides a promise-based interface
 * and inherits stdio streams for real-time output visibility.
 *
 * @param {string} command - The command to execute (e.g., 'pnpm')
 * @param {string[]} args - Array of command arguments
 * @param {import('node:child_process').SpawnOptions} [options] - Spawn options
 * @returns {Promise<void>} Resolves when command exits with code 0
 * @throws {Error} If command exits with non-zero code or fails to spawn
 *
 * @example
 * await runCommand('pnpm', ['build']);
 * // Build completed successfully
 */
function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, {
            stdio: 'inherit', // Show output in real-time
            shell: true, // Allow shell features like pipes
            ...options,
        });

        proc.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command failed with exit code ${code}`));
            } else {
                resolve();
            }
        });

        proc.on('error', (error) => {
            reject(new Error(`Failed to spawn command: ${error.message}`));
        });
    });
}

/**
 * Main workflow orchestration
 *
 * Executes the complete Lighthouse CI testing workflow with proper error handling
 * and cleanup. The finally block ensures the server process is always terminated,
 * even if tests fail or the process is interrupted.
 *
 * @async
 * @returns {Promise<void>}
 */
async function main() {
    try {
        // Step 1: Build the Astro project for production
        console.log('Building project...');
        await runCommand('pnpm', ['build']);

        // Step 2: Start the Wrangler preview server in the background
        console.log('Starting preview server...');
        serverProcess = spawn('pnpm', ['preview'], {
            stdio: ['ignore', 'pipe', 'pipe'], // Ignore stdin, pipe stdout/stderr
            shell: true,
        });

        // Pipe server output to console with prefix for clarity
        // Helpful for debugging server startup issues
        serverProcess.stdout.on('data', (data) => {
            console.log(`[preview] ${data.toString().trim()}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`[preview] ${data.toString().trim()}`);
        });

        // Step 3: Wait for server to be ready
        console.log(`Waiting for server at ${SERVER_URL}...`);
        await waitForServer(SERVER_URL, WAIT_TIMEOUT);

        // Step 4: Collect Lighthouse performance data
        console.log('Running Lighthouse CI collect...');
        await runCommand('pnpm', ['perf:collect', `--url=${SERVER_URL}`]);

        // Step 5: Assert against performance budgets
        console.log('Running Lighthouse CI assert...');
        await runCommand('pnpm', ['perf:assert']);

        // Step 6: Upload results to temporary storage
        console.log('Uploading Lighthouse CI results...');
        await runCommand('pnpm', ['perf:upload']);

        console.log('Lighthouse CI completed successfully!');
        process.exit(0);
    } catch (error) {
        // Log error details and exit with failure code
        console.error('Lighthouse CI failed:', error.message);
        process.exit(1);
    } finally {
        // Always clean up the server process, even on error or interrupt
        if (serverProcess) {
            console.log('Stopping preview server...');
            serverProcess.kill();
        }
    }
}

/**
 * Signal handler for graceful shutdown on Ctrl+C (SIGINT)
 *
 * Ensures the preview server is properly terminated when the user
 * interrupts the script with Ctrl+C.
 */
process.on('SIGINT', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
    // Exit with standard SIGINT code (128 + signal number)
    process.exit(130);
});

/**
 * Signal handler for graceful shutdown on SIGTERM
 *
 * Handles termination requests from process managers or CI systems.
 * Ensures proper cleanup before exit.
 */
process.on('SIGTERM', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
    // Exit with standard SIGTERM code (128 + signal number)
    process.exit(143);
});

// Execute the main workflow
main();
