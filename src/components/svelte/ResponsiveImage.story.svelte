<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import ResponsiveImage from './ResponsiveImage.svelte';
</script>

<Hst.Story title="Components/ResponsiveImage">
  <Hst.Variant title="Usage Example">
    <div class="prose">
      <p>
        ResponsiveImage component provides responsive image rendering with sizes configuration.
        It uses standard HTML img tag with responsive sizes for optimal loading.
      </p>
      <div class="my-4">
        <ResponsiveImage
          src="/logo-placeholder.png"
          alt="Sample image"
          width={400}
          height={400}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <pre><code>{`<ResponsiveImage 
  src={import('../assets/images/hero.png')} 
  alt="Ambilab Editor"
  sizes="(max-width: 768px) 100vw, 50vw"
/>`}</code></pre>
      <p class="mt-4">
        <strong>Note:</strong> When using remote URLs (string), width and height are required:
      </p>
      <pre><code>{`<ResponsiveImage 
  src="https://example.com/image.jpg" 
  alt="Remote image"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
/>`}</code></pre>
      <p class="mt-4">
        <strong>Loading behavior:</strong> Use <code>loading="eager"</code> for above-the-fold images (defaults to <code>"lazy"</code>):
      </p>
      <pre><code>{`<ResponsiveImage 
  src={import('../assets/images/hero.png')} 
  alt="Hero image"
  loading="eager"
  sizes="(max-width: 768px) 100vw, 50vw"
/>`}</code></pre>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <strong>Note:</strong> This component uses a standard HTML img element with responsive sizes. It does not perform automatic format optimization (AVIF/WebP conversion). For advanced image optimization with automatic format conversion, consider using Astro's Image or Picture components in Astro files instead.
      </p>
    </div>
  </Hst.Variant>
</Hst.Story>

