<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';
  import ResponsiveImage from './ResponsiveImage.svelte';
</script>

<Hst.Story title="Components/ResponsiveImage">
  <Hst.Variant title="Usage Example">
    <div class="prose">
      <p>
        ResponsiveImage component wraps Astro's Image component with responsive sizes
        configuration. It automatically generates AVIF/WebP variants at multiple breakpoints.
      </p>
      <div class="my-4">
        <ResponsiveImage
          src="/logo-placeholder.png"
          alt="Sample image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <pre><code>{`<ResponsiveImage 
  src={import('../assets/images/hero.png')} 
  alt="ambilab editor"
  sizes="(max-width: 768px) 100vw, 50vw"
/>`}</code></pre>
    </div>
  </Hst.Variant>
</Hst.Story>

