#!/usr/bin/env node

/**
 * Usage:
 *   pnpm run perf
 *   node scripts/run-lighthouse.mjs
 *
 * Environment:
 *   SERVER_URL: Target URL for testing (default: http://localhost:4321)
 *   WAIT_TIMEOUT: Max time to wait for server startup in ms (default: 30000)
 *
 * Exit Codes:
 *   0: Success
 *   1: Failure
 *   130: SIGINT (Ctrl+C)
 *   143: SIGTERM
 */

import { spawn } from 'node:child_process';
import process from 'node:process';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4321';
const WAIT_TIMEOUT = Number.parseInt(process.env.WAIT_TIMEOUT || '30000', 10);

let serverProcess = null;

async function waitForServer(url, timeout) {
    const startTime = Date.now();
    const checkInterval = 500;

    while (Date.now() - startTime < timeout) {
        try {
            const response = await fetch(url, { method: 'HEAD' });

            if (response.ok) {
                console.log(`Server is ready at ${url}`);
                return true;
            }
        } catch {
            // Silent fail: the server is not ready.
        }

        await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    throw new Error(`Server did not start within ${timeout}ms`);
}

function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
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

async function main() {
    try {
        console.log('Building project...');
        await runCommand('pnpm', ['build']);

        console.log('Starting preview server...');
        serverProcess = spawn('pnpm', ['preview'], {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
        });

        serverProcess.stdout.on('data', (data) => {
            console.log(`[preview] ${data.toString().trim()}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`[preview] ${data.toString().trim()}`);
        });

        console.log(`Waiting for server at ${SERVER_URL}...`);
        await waitForServer(SERVER_URL, WAIT_TIMEOUT);

        console.log('Running Lighthouse CI collect...');
        await runCommand('pnpm', ['perf:collect', `--url=${SERVER_URL}`]);

        console.log('Running Lighthouse CI assert...');
        await runCommand('pnpm', ['perf:assert']);

        console.log('Uploading Lighthouse CI results...');
        await runCommand('pnpm', ['perf:upload']);

        console.log('Lighthouse CI completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Lighthouse CI failed:', error.message);
        process.exit(1);
    } finally {
        if (serverProcess) {
            console.log('Stopping preview server...');
            serverProcess.kill();
        }
    }
}

process.on('SIGINT', () => {
    if (serverProcess) {
        serverProcess.kill();
    }

    process.exit(130);
});

process.on('SIGTERM', () => {
    if (serverProcess) {
        serverProcess.kill();
    }

    process.exit(143);
});

main();
