<script lang="ts">
    interface Props {
        src: string;
        title?: string;
        aspectRatio?: string;
        class?: string;
        desktopOnly?: boolean;
        allowTopNavigation?: boolean;
        allowAutoplay?: boolean;
        allowMotionSensors?: boolean;
    }

    // Security-sensitive allowlist. Review before changing.
    const allowedHostnames = ['blit-tech-demos.ambilab.com'] as const;
    const safeFallbackURL = 'about:blank';

    function isAllowedHostname(hostname: string): hostname is (typeof allowedHostnames)[number] {
        return allowedHostnames.includes(hostname as (typeof allowedHostnames)[number]);
    }

    function validateSrcUrl(url: string): string | null {
        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.protocol !== 'https:') {
                return null;
            }

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

    const validationResult = $derived(validateSrcUrl(src));
    const validatedSrc = $derived(validationResult ?? safeFallbackURL);
    const isValidSrc = $derived(validationResult !== null);

    // Dev/localhost uses a link to avoid CSP frame-ancestors blocks.
    const isDev = import.meta.env.DEV;

    let isLocalhost = $state(false);

    $effect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;

            isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
        }
    });

    const shouldShowLink = $derived(isDev && isLocalhost);

    // Build minimal allow attribute to reduce surface area.
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

    // Start with safe defaults; opt-in top navigation.
    const sandboxPermissions = $derived(
        `allow-scripts allow-same-origin allow-forms${allowTopNavigation ? ' allow-top-navigation-by-user-activation' : ''}`,
    );

    // Validate the aspect ratio to avoid CSS injection.
    const safeAspectRatio = $derived.by(() => {
        const normalized = aspectRatio?.trim() ?? '16/9';
        const parts = normalized.split('/');

        // Must have exactly two parts separated by '/'.
        if (parts.length !== 2) {
            return '16/9';
        }

        // Each part must be a valid positive number (integer or decimal).
        const isValid = parts.every((part) => {
            if (part.length === 0) {
                return false;
            }

            const num = Number(part);

            if (Number.isNaN(num) || num <= 0) {
                return false;
            }

            // Ensure only digits and at most one decimal point.
            const hasValidChars = [...part].every((char) => (char >= '0' && char <= '9') || char === '.');
            const decimalCount = part.split('.').length - 1;

            return hasValidChars && decimalCount <= 1;
        });

        return isValid ? normalized : '16/9';
    });

    const aspectRatioStyle = $derived(`aspect-ratio: ${safeAspectRatio}; width: 100%;`);
</script>

<figure class={`demo-embed ${className}`}>
    {#if shouldShowLink}
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
