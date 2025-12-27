<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import CookieBanner from './CookieBanner.svelte';
</script>

<Hst.Story title="Components/CookieBanner">
  <Hst.Variant title="English">
    <CookieBanner locale="en" />
  </Hst.Variant>

  <Hst.Variant title="Czech">
    <CookieBanner locale="cs" />
  </Hst.Variant>
</Hst.Story>

