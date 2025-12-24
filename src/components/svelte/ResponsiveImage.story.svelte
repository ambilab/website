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

