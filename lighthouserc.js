/**
 * Lighthouse CI Configuration
 *
 * This configuration file defines performance budgets and settings for automated
 * performance testing. It measures Core Web Vitals and other performance metrics
 * to ensure the website maintains high performance standards.
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

export default {
	ci: {
		collect: {
			// Number of times to run Lighthouse on each URL (median is used)
			numberOfRuns: 3,

			// URLs to test - can be overridden via CLI
			// url: ['http://localhost:4321/'],

			// Lighthouse settings
			settings: {
				// Use Lighthouse's recommended preset
				preset: 'desktop',

				// Throttling settings (simulated fast 4G)
				throttling: {
					rttMs: 40,
					throughputKbps: 10240,
					cpuSlowdownMultiplier: 1,
				},

				// Screen emulation for desktop
				screenEmulation: {
					mobile: false,
					width: 1350,
					height: 940,
					deviceScaleFactor: 1,
				},
			},
		},

		upload: {
			// Target for uploading results
			// Options: 'temporary-public-storage' (free, 7 days) or your own LHCI server
			target: 'temporary-public-storage',
		},

		assert: {
			// Performance budgets - fail the build if these are not met
			assertions: {
				// Core Web Vitals thresholds (strict mode)
				'categories:performance': ['error', { minScore: 0.9 }],
				'categories:accessibility': ['warn', { minScore: 0.9 }],
				'categories:best-practices': ['warn', { minScore: 0.9 }],
				'categories:seo': ['warn', { minScore: 0.9 }],

				// First Contentful Paint - should be under 1.8s
				'first-contentful-paint': ['error', { maxNumericValue: 1800 }],

				// Largest Contentful Paint - should be under 2.5s (good Core Web Vital)
				'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],

				// Cumulative Layout Shift - should be under 0.1 (good Core Web Vital)
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

				// Total Blocking Time - should be under 200ms (good Core Web Vital proxy)
				'total-blocking-time': ['error', { maxNumericValue: 200 }],

				// Speed Index - should be under 3.4s
				'speed-index': ['error', { maxNumericValue: 3400 }],

				// Interactive - should be under 3.8s
				interactive: ['error', { maxNumericValue: 3800 }],

				// Resource budgets
				'resource-summary:script:size': ['warn', { maxNumericValue: 350000 }], // 350KB JS
				'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }], // 50KB CSS
				'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }], // 500KB images
				'resource-summary:font:size': ['warn', { maxNumericValue: 150000 }], // 150KB fonts
				'resource-summary:total:size': ['warn', { maxNumericValue: 1500000 }], // 1.5MB total

				// No console errors in production
				'errors-in-console': ['warn', { maxLength: 0 }],
			},
		},
	},
};
