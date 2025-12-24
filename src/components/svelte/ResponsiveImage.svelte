<script lang="ts">
  import { getResponsiveSizes } from '@lib/images';

  interface Props {
    src: string;
    alt: string;
    sizes?: string;
    class?: string;
    width?: number;
    height?: number;
  }

  let { src, alt, sizes, class: className = '', width, height }: Props = $props();

  const responsiveSizes = getResponsiveSizes(sizes);
</script>

<img
  src={src}
  alt={alt}
  width={width}
  height={height}
  sizes={responsiveSizes}
  class="rounded-lg {className}"
  loading="lazy"
/>

