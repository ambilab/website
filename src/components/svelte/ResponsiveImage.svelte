<script lang="ts">
    /**
     * ResponsiveImage Component
     *
     * Wrapper component for responsive images that supports
     * both string URLs and Astro ImageMetadata objects.
     *
     * Automatically generates responsive sizes attribute
     * and handles width/height extraction from metadata.
     *
     * Features:
     * - Supports string URLs or Astro ImageMetadata
     * - Automatic responsive sizes generation
     * - Lazy loading by default
     * - Proper width/height attributes for layout stability
     * - Rounded corners styling
     * - Dark mode support
     *
     * @component
     * @example
     * ```svelte
     * <!-- With string URL -->
     * <ResponsiveImage
     *   src="/images/hero.jpg"
     *   alt="Hero image"
     *   width={1200}
     *   height={600}
     * />
     *
     * <!-- With Astro ImageMetadata -->
     * <ResponsiveImage src={importedImage} alt="Description" />
     * ```
     */
    import { getResponsiveSizes } from '@lib/images';
    import type { ImageMetadata } from 'astro';

    /**
     * Props for the ResponsiveImage component.
     *
     * Supports two variants:
     * 1. String URL with explicit width/height
     * 2. Astro ImageMetadata with optional width/height override
     */
    type Props =
        | {
              /**
               * Image source as a string URL.
               *
               * When using a string URL, width and height are required.
               */
              src: string;

              /**
               * Alt text for the image.
               *
               * Required for accessibility.
               */
              alt: string;

              /**
               * Image width in pixels.
               *
               * Required when src is a string URL.
               */
              width: number;

              /**
               * Image height in pixels.
               *
               * Required when src is a string URL.
               */
              height: number;

              /**
               * Responsive sizes attribute for the image.
               *
               * If not provided, uses default responsive sizes.
               */
              sizes?: string;

              /**
               * Additional CSS classes to apply to the image element.
               */
              class?: string;

              /**
               * Loading strategy for the image.
               *
               * @default 'lazy'
               */
              loading?: 'lazy' | 'eager';
          }
        | {
              /**
               * Image source as an Astro ImageMetadata object.
               *
               * When using ImageMetadata, width and height are optional
               * and will be extracted from the metadata if not provided.
               */
              src: ImageMetadata;

              /**
               * Alt text for the image.
               * Required for accessibility.
               */
              alt: string;

              /**
               * Image width in pixels.
               *
               * Optional when src is ImageMetadata
               * (will use metadata width if not provided).
               */
              width?: number;

              /**
               * Image height in pixels.
               *
               * Optional when src is ImageMetadata
               * (will use metadata height if not provided).
               */
              height?: number;

              /**
               * Responsive sizes attribute for the image.
               *
               * If not provided, uses default responsive sizes.
               */
              sizes?: string;

              /**
               * Additional CSS classes to apply to the image element.
               */

              class?: string;
              /**
               * Loading strategy for the image.
               *
               * @default 'lazy'
               */
              loading?: 'lazy' | 'eager';
          };
    let { src, alt, sizes, class: className = '', width, height, loading = 'lazy' }: Props = $props();

    /**
     * Responsive sizes attribute for the image.
     *
     * Uses default responsive sizes if not provided,
     * optimized for common viewport widths.
     */
    const responsiveSizes = $derived(getResponsiveSizes(sizes));

    /**
     * Resolved image source URL.
     *
     * Extracts the URL from ImageMetadata or uses the string directly.
     */
    const imageSrc = $derived(typeof src === 'string' ? src : src.src);

    /**
     * Resolved image width.
     *
     * Uses provided width or extracts from ImageMetadata,
     * undefined for string URLs without width.
     */
    const imageWidth = $derived(width ?? (typeof src === 'string' ? undefined : src.width));

    /**
     * Resolved image height.
     *
     * Uses provided height or extracts from ImageMetadata,
     * undefined for string URLs without height.
     */
    const imageHeight = $derived(height ?? (typeof src === 'string' ? undefined : src.height));
</script>

<img
    src={imageSrc}
    {alt}
    width={imageWidth}
    height={imageHeight}
    sizes={responsiveSizes}
    class="rounded-lg {className}"
    {loading}
/>
