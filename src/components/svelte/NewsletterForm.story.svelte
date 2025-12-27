<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import NewsletterForm from './NewsletterForm.svelte';
</script>

<Hst.Story title="Components/NewsletterForm">
  <Hst.Variant title="English">
    <NewsletterForm locale="en" />
  </Hst.Variant>

  <Hst.Variant title="Czech">
    <NewsletterForm locale="cs" />
  </Hst.Variant>
</Hst.Story>

