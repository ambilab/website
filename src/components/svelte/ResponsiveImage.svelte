<script lang="ts">
  import { Image } from 'astro:assets';
  import { getResponsiveSizes } from '@lib/images';

  interface Props {
    src: any;
    alt: string;
    sizes?: string;
    class?: string;
    width?: number;
    height?: number;
  }

  let { src, alt, sizes, class: className = '', width, height }: Props = $props();

  const responsiveSizes = getResponsiveSizes(sizes);
</script>

<Image
  {src}
  {alt}
  {width}
  {height}
  sizes={responsiveSizes}
  class={`rounded-lg ${className}`}
  loading="lazy"
  format="avif"
/>

