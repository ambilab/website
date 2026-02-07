<script lang="ts">
    import Button from '@components/svelte/Button.svelte';

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

<figure class={`demo-embed  ${className}`}>
    {#if shouldShowLink}
        <div
            class="flex min-h-[200px] select-none flex-col items-center justify-center bg-black p-8 text-center"
            style={aspectRatioStyle}
        >
            <p class="text-[11px]! mb-4 text-balance font-mono uppercase text-white antialiased md:w-1/2">
                {#if isValidSrc}
                    Demo preview is not available in development due to CSP restrictions.
                {:else}
                    Invalid demo source URL
                {/if}
            </p>

            {#if isValidSrc}
                <Button href={validatedSrc} size="sm" variant="outline">Open Demo in New Tab</Button>
            {/if}
        </div>
    {:else if !isValidSrc}
        <div
            class="flex min-h-[200px] flex-col items-center justify-center bg-error-text p-8 text-center"
            style={aspectRatioStyle}
        >
            <p class="text-[11px]! mb-4 text-balance font-mono uppercase text-white antialiased md:w-1/2">
                Invalid or untrusted demo source. Only allowlisted sources are allowed for security reasons.
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
            class="border border-border-default"
        ></iframe>
    {/if}

    {#if title}
        <figcaption>
            {title}
        </figcaption>
    {/if}
</figure>

<style lang="postcss">
    .demo-embed {
        margin: 2rem 0;

        div {
            box-shadow:
                0 2px 0 0 var(--color-page-bg),
                0 4px 0 0 var(--color-black);
        }
    }

    iframe {
        border: 0;
    }
</style>
