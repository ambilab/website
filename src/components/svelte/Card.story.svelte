<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import Card from './Card.svelte';
</script>

<Hst.Story title="Components/Card">
  <Hst.Variant title="Basic">
    <Card title="Card Title">
      <p>This is some content inside the card.</p>
    </Card>
  </Hst.Variant>

  <Hst.Variant title="Without Title">
    <Card>
      <p>Card content without a title.</p>
    </Card>
  </Hst.Variant>

  <Hst.Variant title="Multiple Cards">
    <div class="grid gap-4 md:grid-cols-2">
      <Card title="First Card">
        <p>Content for the first card.</p>
      </Card>
      <Card title="Second Card">
        <p>Content for the second card.</p>
      </Card>
    </div>
  </Hst.Variant>
</Hst.Story>

