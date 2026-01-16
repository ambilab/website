<script lang="ts">
    /**
     * DemoEmbed Component
     *
     * Embeds interactive demos in a secure iframe with strict security controls.
     *
     * Only allowlisted hostnames are permitted, and all URLs must use HTTPS.
     *
     * Security Features:
     * - URL validation against explicit allowlist
     * - HTTPS requirement enforcement
     * - Sandboxed iframe with minimal permissions
     * - Safe fallback for invalid URLs
     * - Development mode link fallback to avoid CSP violations
     *
     * Default Sandbox Permissions:
     * - allow-scripts: Execute JavaScript
     * - allow-same-origin: Access localStorage, cookies, and same-origin APIs
     * - allow-forms: Submit forms within the iframe
     *
     * Optional Permissions:
     * - allow-top-navigation-by-user-activation: Navigate top-level context on user activation (requires allowTopNavigation=true)
     * - autoplay: Media autoplay (controlled via the allow attribute)
     * - accelerometer/gyroscope: Motion sensors (controlled via the allow attribute)
     *
     * Development Mode:
     * - Shows a link instead of an iframe on localhost to avoid CSP frame-ancestors violations
     * - The demo site blocks localhost due to CSP restrictions
     *
     * @component
     * @example
     * ```svelte
     * <DemoEmbed
     *   src="https://blit-tech-demos.ambilab.com/demo/example"
     *   title="Interactive Demo"
     *   aspectRatio="16/9"
     *   client:visible
     * />
     * ```
     */
    interface Props {
        /**
         * URL of the demo to embed.
         *
         * Must be from an allowlisted hostname and use HTTPS protocol.
         *
         * Invalid URLs will display a warning message instead of embedding.
         */
        src: string;

        /**
         * Caption text displayed below the iframe.
         *
         * If not provided, no caption is shown.
         */
        title?: string;

        /**
         * Aspect ratio of the iframe in CSS format (e.g., "16/9", "4/3").
         *
         * @default '16/9'
         */
        aspectRatio?: string;

        /**
         * Additional CSS classes to apply to the demo embed container.
         */
        class?: string;

        /**
         * Whether the demo should only be displayed on desktop screens.
         *
         * On mobile, the embed is hidden.
         *
         * @default true
         */
        desktopOnly?: boolean;

        /**
         * Enable top-level navigation permission on user activation.
         *
         * Only enable if the demo explicitly requires it.
         *
         * When enabled, adds 'allow-top-navigation-by-user-activation'
         * to the iframe sandbox attribute. This requires a transient user
         * activation (e.g., click) and mitigates clickjacking risks.
         *
         * @default false
         */
        allowTopNavigation?: boolean;

        /**
         * Enable autoplay permission for media playback.
         *
         * Controlled via the iframe allow attribute.
         *
         * @default true
         */
        allowAutoplay?: boolean;

        /**
         * Enable motion sensors (accelerometer, gyroscope).
         *
         * Controlled via the iframe allow attribute.
         *
         * Defaults to false when desktopOnly is true,
         * or true when desktopOnly is false.
         */
        allowMotionSensors?: boolean;
    }

    /**
     * Allowlist of trusted hostnames for demo embeds.
     *
     * GOVERNANCE: Adding new hostnames requires security review to ensure:
     * - The domain is owned/controlled by Ambilab
     * - Content served is trusted and safe for iframe embedding
     * - HTTPS is properly configured with valid certificates
     * - CSP and security headers are appropriately set
     *
     * Do not add third-party domains without explicit approval.
     */
    const allowedHostnames = ['blit-tech-demos.ambilab.com'] as const;
    const safeFallbackURL = 'about:blank';

    /**
     * Type guard to check if a hostname is in the allowlist.
     */
    function isAllowedHostname(hostname: string): hostname is (typeof allowedHostnames)[number] {
        return allowedHostnames.includes(hostname as (typeof allowedHostnames)[number]);
    }

    /**
     * Validates that a URL is from an allowed hostname and uses HTTPS.
     *
     * Returns the validated URL or null if validation fails.
     */
    function validateSrcUrl(url: string): string | null {
        try {
            const parsedUrl = new URL(url);

            // Require HTTPS protocol
            if (parsedUrl.protocol !== 'https:') {
                return null;
            }

            // Check if hostname is in allowlist
            if (!isAllowedHostname(parsedUrl.hostname)) {
                return null;
            }

            return url;
        } catch {
            // Invalid URL format
            return null;
        }
    }

    let {
        src,
        title,
        aspectRatio = '16/9',
        class: className = '',
        desktopOnly = true,
        allowTopNavigation = false,
        allowAutoplay = true,
        allowMotionSensors = !desktopOnly,
    }: Props = $props();

    // Validate and sanitize src URL
    const validationResult = $derived(validateSrcUrl(src));
    const validatedSrc = $derived(validationResult ?? safeFallbackURL);
    const isValidSrc = $derived(validationResult !== null);

    // In development, the demo site blocks localhost due to CSP frame-ancestors
    // Show a link instead of iframe to avoid CSP violations
    const isDev = import.meta.env.DEV;

    // Detect localhost in browser, default to false during SSR
    // Initialize false to match SSR, then update client-side after hydration
    let isLocalhost = $state(false);

    $effect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
        }
    });

    const shouldShowLink = $derived(isDev && isLocalhost);

    // Build minimal allow attribute: only include features explicitly requested
    // Each feature needs an allowlist - we use 'src' to allow from the iframe's origin
    // Note: autoplay is controlled by the Permissions-Policy HTTP header (via the allow attribute),
    // not by sandbox tokens. The sandbox attribute has no 'allow-autoplay' token in the HTML spec.
    const allowPermissions = $derived.by(() => {
        const permissions: string[] = [];

        if (allowAutoplay) {
            permissions.push('autoplay');
        }

        if (allowMotionSensors) {
            permissions.push("accelerometer 'src'");
            permissions.push("gyroscope 'src'");
        }

        return permissions.join('; ');
    });

    // Build sandbox permissions: start with safe defaults, add top-navigation-by-user-activation only if explicitly requested
    const sandboxPermissions = $derived(
        `allow-scripts allow-same-origin allow-forms${allowTopNavigation ? ' allow-top-navigation-by-user-activation' : ''}`,
    );

    // Validate and sanitize aspect ratio to prevent CSS injection
    // Only allow numeric ratios in the format "number/number" (e.g., "16/9", "4/3", "21.5/9")
    const safeAspectRatio = $derived.by(() => {
        const normalized = aspectRatio?.trim() ?? '16/9';
        const isValid = /^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(normalized);
        return isValid ? normalized : '16/9';
    });

    // Extract aspect-ratio style to avoid repetition
    const aspectRatioStyle = $derived(`aspect-ratio: ${safeAspectRatio}; width: 100%;`);
</script>

<figure class={`demo-embed ${className}`}>
    {#if shouldShowLink}
        <!-- Show link in development/localhost to avoid CSP frame-ancestors violation -->
        <div
            class="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-border-default bg-page-bg-muted p-8 text-center dark:border-border-default-dark dark:bg-page-bg-muted-dark"
            style={aspectRatioStyle}
        >
            <p class="mb-4 text-sm text-text-muted dark:text-text-muted-dark">
                Demo preview is not available in development due to CSP restrictions.
            </p>
            {#if isValidSrc}
                <a
                    href={validatedSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-lg bg-button-primary px-4 py-2 text-sm font-medium text-button-primary-text hover:bg-button-primary-hover focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-page-bg dark:bg-button-primary-dark dark:text-button-primary-text-dark dark:hover:bg-button-primary-hover-dark dark:focus:ring-link-dark dark:focus:ring-offset-page-bg-dark"
                >
                    Open Demo in New Tab
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            {:else}
                <p class="text-sm text-error-text dark:text-error-text-dark">Invalid demo source URL</p>
            {/if}
        </div>
    {:else if !isValidSrc}
        <!-- Show warning if src URL is invalid/not allowlisted -->
        <div
            class="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-warning-border bg-warning-bg p-8 text-center dark:border-warning-border-dark dark:bg-warning-bg-dark"
            style={aspectRatioStyle}
        >
            <p class="mb-2 text-sm font-medium text-warning-heading dark:text-warning-heading-dark">
                Invalid or untrusted demo source
            </p>
            <p class="text-xs text-warning-text dark:text-warning-text-dark">
                Only allowlisted sources are allowed for security reasons.
            </p>
        </div>
    {:else}
        <iframe
            src={validatedSrc}
            title={title ?? 'Demo embed'}
            style={aspectRatioStyle}
            loading="lazy"
            allow={allowPermissions}
            allowfullscreen
            sandbox={sandboxPermissions}
            class="rounded-lg border border-border-default dark:border-border-default-dark"
        ></iframe>
    {/if}
    {#if title}
        <figcaption class="mt-2 text-center text-sm text-text-muted dark:text-text-muted-dark">
            {title}
        </figcaption>
    {/if}
</figure>

<style>
    .demo-embed {
        margin: 2rem 0;
    }

    iframe {
        border: 0;
    }
</style>
