<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    src: string;
    title?: string;
    aspectRatio?: string;
    class?: string;
    desktopOnly?: boolean;
  }

  let { src, title, aspectRatio = '16/9', class: className = '', desktopOnly = true }: Props = $props();

  // In development, the demo site blocks localhost due to CSP frame-ancestors
  // Show a link instead of iframe to avoid CSP violations
  const isDev = import.meta.env.DEV;
  let isLocalhost = $state(false);

  onMount(() => {
    const hostname = window.location.hostname;
    isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  });

  const shouldShowLink = isDev && isLocalhost;

  // Build minimal allow attribute: always autoplay, sensors only if not desktop-only
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
      <a
        href={src}
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
    </div>
  {:else}
    <iframe
      {src}
      {title}
      style="aspect-ratio: {aspectRatio}; width: 100%;"
      loading="lazy"
      allow={allowPermissions}
      allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-presentation"
      class="rounded-lg border border-gray-200 dark:border-gray-800"
    ></iframe>
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

