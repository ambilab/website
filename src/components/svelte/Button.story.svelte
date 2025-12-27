<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import Button from './Button.svelte';
</script>

<Hst.Story title="Components/Button">
  <Hst.Variant title="Primary">
    <Button variant="primary">Primary Button</Button>
  </Hst.Variant>

  <Hst.Variant title="Secondary">
    <Button variant="secondary">Secondary Button</Button>
  </Hst.Variant>

  <Hst.Variant title="Outline">
    <Button variant="outline">Outline Button</Button>
  </Hst.Variant>

  <Hst.Variant title="Sizes">
    <div class="flex flex-col gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  </Hst.Variant>

  <Hst.Variant title="Disabled">
    <Button disabled>Disabled Button</Button>
  </Hst.Variant>

  <Hst.Variant title="As Link">
    <Button href="https://ambilab.com">Link Button</Button>
  </Hst.Variant>
</Hst.Story>

