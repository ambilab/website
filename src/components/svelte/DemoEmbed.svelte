<script lang="ts">

  /**
   * DemoEmbed component for embedding interactive demos.
   * 
   * SECURITY: Only trusted, allowlisted sources are supported. The src URL is
   * validated against an explicit allowlist of hostnames and must use HTTPS.
   * Invalid URLs will fall back to a safe default or be rejected.
   */
  interface Props {
    src: string;
    title?: string;
    aspectRatio?: string;
    class?: string;
    desktopOnly?: boolean;
  }

  // Allowlist of trusted hostnames for demo embeds
  const ALLOWED_HOSTNAMES = ['blit-tech-demos.ambilab.com'] as const;
  const SAFE_FALLBACK_URL = 'about:blank';

  /**
   * Type guard to check if a hostname is in the allowlist.
   */
  function isAllowedHostname(hostname: string): hostname is typeof ALLOWED_HOSTNAMES[number] {
    return ALLOWED_HOSTNAMES.includes(hostname as typeof ALLOWED_HOSTNAMES[number]);
  }

  /**
   * Validates that a URL is from an allowed hostname and uses HTTPS.
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

  let { src, title = 'Demo embed', aspectRatio = '16/9', class: className = '', desktopOnly = true }: Props = $props();

  // Validate and sanitize src URL
  const validationResult = $derived(validateSrcUrl(src));
  const validatedSrc = $derived(validationResult ?? SAFE_FALLBACK_URL);
  const isValidSrc = $derived(validationResult !== null);

  // In development, the demo site blocks localhost due to CSP frame-ancestors
  // Show a link instead of iframe to avoid CSP violations
  const isDev = import.meta.env.DEV;
  
  // Detect localhost in browser, default to false during SSR
  // SSR always renders iframe; client-side check flips to link panel only on actual localhost
  // This prevents hydration mismatches when accessing dev builds from non-localhost hostnames
  let isLocalhost = $state(
    typeof window !== 'undefined'
      ? (() => {
          const hostname = window.location.hostname;
          return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
        })()
      : false // Default to false during SSR
  );

  const shouldShowLink = $derived(isDev && isLocalhost);

  // Build minimal allow attribute: only include features actually needed
  // - autoplay: required for demos that auto-start
  // - accelerometer/gyroscope: only for mobile demos (when not desktop-only)
  const allowPermissions = $derived(
    desktopOnly ? 'autoplay' : 'autoplay; accelerometer; gyroscope'
  );
</script>

<figure class={`demo-embed ${className}`}>
  {#if shouldShowLink}
    <!-- Show link in development/localhost to avoid CSP frame-ancestors violation -->
    <div
      class="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900"
      style="aspect-ratio: {aspectRatio}; width: 100%;"
    >
      <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Demo preview is not available in development due to CSP restrictions.
      </p>
      {#if isValidSrc}
        <a
          href={validatedSrc}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Open Demo in New Tab
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      {:else}
        <p class="text-sm text-red-600 dark:text-red-400">
          Invalid demo source URL
        </p>
      {/if}
    </div>
  {:else}
    {#if !isValidSrc}
      <!-- Show warning if src URL is invalid/not allowlisted -->
      <div
        class="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center dark:border-yellow-900 dark:bg-yellow-950"
        style="aspect-ratio: {aspectRatio}; width: 100%;"
      >
        <p class="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
          Invalid or untrusted demo source
        </p>
        <p class="text-xs text-yellow-600 dark:text-yellow-400">
          Only allowlisted sources are allowed for security reasons.
        </p>
      </div>
    {:else}
      <iframe
        src={validatedSrc}
        {title}
        style="aspect-ratio: {aspectRatio}; width: 100%;"
        loading="lazy"
        allow={allowPermissions}
        allowfullscreen
        sandbox="allow-scripts"
        class="rounded-lg border border-gray-200 dark:border-gray-800"
      ></iframe>
    {/if}
  {/if}
  {#if title}
    <figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
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

