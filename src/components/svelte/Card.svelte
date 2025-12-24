<script lang="ts">
  interface Props {
    title?: string;
    class?: string;
    children?: any;
  }

  let { title, class: className = '', children }: Props = $props();
</script>

<div
  class={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${className}`}
>
  {#if title}
    <h3 class="mb-4 text-xl font-semibold">{title}</h3>
  {/if}
  <div>
    {@render children?.()}
  </div>
</div>

