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
      <button
        class="fixed bottom-8 right-8 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg"
      >
        ↑
      </button>
    </div>
  </Hst.Variant>
</Hst.Story>

