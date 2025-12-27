<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import GoToTop from './GoToTop.svelte';
</script>

<Hst.Story title="Components/GoToTop">
  <Hst.Variant title="Always Visible (for demo)">
    <div class="prose">
      <p>
        The GoToTop button appears after scrolling down 300px. In this demo, it's always visible.
      </p>
      <GoToTop forceVisible={true} />
    </div>
  </Hst.Variant>
</Hst.Story>

