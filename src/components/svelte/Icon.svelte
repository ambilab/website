<script lang="ts">
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
  
  $effect(() => {
    if (!iconMeta.isValid) {
      console.error(`Invalid icon name format: "${name}". Expected format: "set:name"`);
    }
  });
  
  // Use Iconify's CDN API to fetch SVG - must be $derived to react to name changes
  const iconifyUrl = $derived(iconMeta.isValid 
    ? `https://api.iconify.design/${iconMeta.iconSet}/${iconMeta.iconName}.svg`
    : '');
  
  // Store SVG content - starts empty for SSR
  let svgContent = $state<string>('');
  let isLoading = $state(true);
  
  // Reactive effect that fetches SVG whenever iconifyUrl or name changes
  $effect(() => {
    // Track iconifyUrl, name, and isValid to trigger effect when they change
    const isValid = iconMeta.isValid;
    iconifyUrl;
    name;
    
    // Create new AbortController for this fetch
    const controller = new AbortController();
    
    // Set loading state at start
    isLoading = true;
    
    // Skip fetching if invalid format or no URL
    if (!isValid || !iconifyUrl) {
      isLoading = false;
      return;
    }
    
    // Perform fetch with abort signal
    fetch(iconifyUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((svg) => {
        // Only update if this controller is still active
        if (controller.signal.aborted) return;
        svgContent = svg;
        isLoading = false;
      })
      .catch((err) => {
        // Ignore AbortError when effect reruns or component unmounts
        if (err.name === 'AbortError') return;
        
        // Only update if this controller is still active
        if (controller.signal.aborted) return;
        
        console.error(`Failed to load icon ${name}:`, err);
        isLoading = false;
        // Set fallback SVG to show an indicator when icon fails to load
        svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>Icon failed to load</title><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      });
    
    // Cleanup function: abort controller when effect reruns or component unmounts
    return () => {
      controller.abort();
    };
  });
</script>

{#if isLoading}
  <span class={className} style={sizeStyle} aria-hidden="true"></span>
{:else if svgContent}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <span class={className} style={sizeStyle} aria-hidden={!ariaLabel} aria-label={ariaLabel} role={ariaLabel ? 'img' : undefined}>{@html svgContent}</span>
{/if}

