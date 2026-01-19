/**
 * Lighthouse CI Configuration.
 *
 * Note: This file uses CommonJS (.cjs) format because Lighthouse CI requires it,
 * while the project uses ES modules by default (package.json has "type": "module").
 *
 * Usage:
 *   - Run via: pnpm run perf (handles build, server start, and all Lighthouse steps)
 *   - Or manually: pnpm perf:collect, pnpm perf:assert, pnpm perf:upload
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 * @see https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
 */

module.exports = {
    ci: {
        collect: {
            /**
             * Number of times to run Lighthouse on each URL.
             * The median result is used to reduce variance from network fluctuations.
             */
            numberOfRuns: 3,

            /**
             * For SSR applications, the preview server must be running (see run-lighthouse.mjs).
             * Multiple URLs can be tested: ['http://localhost:4321/', 'http://localhost:4321/about']
             */
            url: ['http://localhost:4321/'],

            /**
             * Explicit Chrome binary path for macOS.
             * Required because automatic Chrome detection may fail in CI environments.
             * For Linux CI: '/usr/bin/google-chrome'
             * For Windows: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
             */
            chromePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

            /**
             * Chrome flags to enable localhost testing:
             * - no-sandbox: Required for running in CI environments
             * - disable-gpu: Prevents GPU-related crashes in headless mode
             * - ignore-certificate-errors: Allows testing with self-signed certificates
             */
            chromeFlags: '--no-sandbox --disable-gpu --ignore-certificate-errors',

            settings: {
                /**
                 * Desktop preset provides desktop-optimized throttling and emulation.
                 * Alternative: 'mobile' for mobile-first testing.
                 */
                preset: 'desktop',

                /**
                 * Network throttling simulation.
                 * Simulates a fast 4G connection to ensure consistent results:
                 * - rttMs: Round-trip time in milliseconds
                 * - throughputKbps: Download speed in kilobits per second
                 * - cpuSlowdownMultiplier: CPU throttling (1 = no throttling)
                 */
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                },

                screenEmulation: {
                    mobile: false,
                    width: 1350,
                    height: 940,
                    deviceScaleFactor: 1,
                },
            },
        },

        upload: {
            /**
             * Where to upload Lighthouse results:
             * - 'temporary-public-storage': Free, public storage for 7 days (good for PRs)
             * - Custom LHCI server: Requires additional setup but provides permanent storage
             *
             * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md
             */
            target: 'temporary-public-storage',
        },

        assert: {
            /**
             * Performance budgets and assertions.
             * Tests fail if these thresholds are not met:
             * - 'error': Fails the build (use for critical metrics)
             * - 'warn': Logs a warning but doesn't fail (use for nice-to-have metrics)
             */
            assertions: {
                /**
                 * Category scores (0-1 scale, where 1 = 100%)
                 * Based on weighted averages of individual audits
                 */

                // Critical for user experience.
                'categories:performance': ['error', { minScore: 0.9 }],

                // WCAG compliance and best practices.
                'categories:accessibility': ['warn', { minScore: 0.9 }],

                // Security, browser compatibility, and modern standards.
                'categories:best-practices': ['warn', { minScore: 0.9 }],

                'categories:seo': ['warn', { minScore: 0.9 }],

                /**
                 * Core Web Vitals (Google's user experience metrics).
                 * These directly impact search rankings and user satisfaction.
                 * @see https://web.dev/vitals/
                 */

                // First Contentful Paint: When first content appears (Target: < 1.8s).
                'first-contentful-paint': ['error', { maxNumericValue: 1_800 }],

                // Largest Contentful Paint: When main content is visible (Target: < 2.5s).
                // This is a Core Web Vital used by Google for search ranking.
                'largest-contentful-paint': ['error', { maxNumericValue: 2_500 }],

                // Cumulative Layout Shift: Visual stability score (Target: < 0.1).
                // Measures unexpected layout shifts during page load.
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

                // Total Blocking Time: Main thread blocking time (Target: < 200ms).
                // Proxy for Interaction to Next Paint (INP), another Core Web Vital.
                'total-blocking-time': ['error', { maxNumericValue: 200 }],

                // Speed Index: How quickly content is visually populated (Target: < 3.4s).
                'speed-index': ['error', { maxNumericValue: 3_400 }],

                // Time to Interactive: When page becomes fully interactive (Target: < 3.8s).
                interactive: ['error', { maxNumericValue: 3_800 }],

                /**
                 * Resource size budgets (in bytes).
                 * Helps prevent bundle bloat and keeps page weight under control.
                 */
                'resource-summary:script:size': ['warn', { maxNumericValue: 350_000 }], // 350KB JS
                'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50_000 }], // 50KB CSS
                'resource-summary:image:size': ['warn', { maxNumericValue: 500_000 }], // 500KB images
                'resource-summary:font:size': ['warn', { maxNumericValue: 150_000 }], // 150KB fonts
                'resource-summary:total:size': ['warn', { maxNumericValue: 1_500_000 }], // 1.5MB total

                // Ensures no JavaScript errors are logged during page load.
                'errors-in-console': ['warn', { maxLength: 0 }],
            },
        },
    },
};
