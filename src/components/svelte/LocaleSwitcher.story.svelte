<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import LocaleSwitcher from './LocaleSwitcher.svelte';
</script>

<Hst.Story title="Components/LocaleSwitcher">
  <Hst.Variant title="English to Czech">
    <LocaleSwitcher currentLocale="en" currentPath="/" />
  </Hst.Variant>

  <Hst.Variant title="Czech to English">
    <LocaleSwitcher currentLocale="cs" currentPath="/" />
  </Hst.Variant>
</Hst.Story>

