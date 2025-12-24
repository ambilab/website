<script lang="ts">
  interface Props {
    src: string;
    title: string;
    aspectRatio?: string;
    class?: string;
  }

  let { src, title, aspectRatio = '16/9', class: className = '' }: Props = $props();
</script>

<figure class={`demo-embed ${className}`}>
  <iframe
    {src}
    {title}
    style="aspect-ratio: {aspectRatio}; width: 100%;"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
    allowfullscreen
    sandbox="allow-scripts allow-same-origin allow-presentation"
    class="rounded-lg border border-gray-200 dark:border-gray-800"
  ></iframe>
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

