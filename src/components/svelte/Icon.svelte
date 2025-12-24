<script lang="ts">
  import { Icon as AstroIcon } from 'astro-icon/components';

  interface Props {
    name: string;
    class?: string;
    size?: number;
  }

  let { name, class: className = '', size }: Props = $props();

  const sizeStyle = size ? `width: ${size}px; height: ${size}px;` : '';
</script>

<AstroIcon {name} class={className} style={sizeStyle} />

