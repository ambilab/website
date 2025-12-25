<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    name: string;
    class?: string;
    size?: number;
    ariaLabel?: string; // When provided, icon becomes semantic
  }

  let { name, class: className = '', size, ariaLabel }: Props = $props();

  const sizeStyle = $derived(size ? `width: ${size}px; height: ${size}px;` : '');
  
  // Parse and validate icon name format (must be "set:name")
  const iconMeta = $derived.by(() => {
    const parts = name.split(':');
    const iconSet = parts[0];
    const iconName = parts[1];
    const isValid = parts.length === 2 && iconSet && iconName;
    return { iconSet, iconName, isValid };
  });
  
  if (!iconMeta.isValid) {
    console.error(`Invalid icon name format: "${name}". Expected format: "set:name"`);
  }
  
  // Use Iconify's CDN API to fetch SVG
  const iconifyUrl = iconMeta.isValid 
    ? `https://api.iconify.design/${iconMeta.iconSet}/${iconMeta.iconName}.svg`
    : '';
  
  // Store SVG content - starts empty for SSR
  let svgContent = $state<string>('');
  let isLoading = $state(true);
  
  // Fetch SVG on client-side mount only
  onMount(() => {
    if (!iconMeta.isValid || !iconifyUrl) {
      isLoading = false;
      return;
    }
    
    const controller = new AbortController();
    
    fetch(iconifyUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((svg) => {
        svgContent = svg;
        isLoading = false;
      })
      .catch((err) => {
        // Ignore AbortError when component unmounts
        if (err.name === 'AbortError') return;
        
        console.error(`Failed to load icon ${name}:`, err);
        isLoading = false;
        // Set fallback SVG to show an indicator when icon fails to load
        svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>Icon failed to load</title><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      });
    
    // Cleanup function called on unmount
    return () => controller.abort();
  });
</script>

{#if isLoading}
  <span class={className} style={sizeStyle} aria-hidden="true"></span>
{:else if svgContent}
  <span class={className} style={sizeStyle} aria-hidden={!ariaLabel} aria-label={ariaLabel} role={ariaLabel ? 'img' : undefined}>{@html svgContent}</span>
{/if}

