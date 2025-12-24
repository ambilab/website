<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    name: string;
    class?: string;
    size?: number;
  }

  let { name, class: className = '', size }: Props = $props();

  const sizeStyle = size ? `width: ${size}px; height: ${size}px;` : '';
  
  // Extract icon set and icon name from format like "solar:home-bold"
  const [iconSet, iconName] = name.split(':');
  
  // Use Iconify's CDN API to fetch SVG
  const iconifyUrl = `https://api.iconify.design/${iconSet}/${iconName}.svg`;
  
  // Store SVG content - starts empty for SSR
  let svgContent = $state<string>('');
  let isLoading = $state(true);
  
  // Fetch SVG on client-side mount only
  onMount(() => {
    fetch(iconifyUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((svg) => {
        svgContent = svg;
        isLoading = false;
      })
      .catch((err) => {
        console.error(`Failed to load icon ${name}:`, err);
        isLoading = false;
        // Set empty content on error to prevent infinite loading state
        svgContent = '';
      });
  });
</script>

{#if isLoading}
  <span class={className} style={sizeStyle} aria-hidden="true"></span>
{:else if svgContent}
  <span class={className} style={sizeStyle} aria-hidden="true">{@html svgContent}</span>
{/if}

