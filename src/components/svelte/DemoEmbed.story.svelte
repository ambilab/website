<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import DemoEmbed from './DemoEmbed.svelte';
</script>

<Hst.Story title="Components/DemoEmbed">
  <Hst.Variant title="Default (16:9)">
    <DemoEmbed src="https://blit-tech-demos.ambilab.com/pong" title="Pong Demo Game" />
  </Hst.Variant>

  <Hst.Variant title="Square (1:1)">
    <DemoEmbed
      src="https://blit-tech-demos.ambilab.com/tetris"
      title="Tetris Demo Game"
      aspectRatio="1/1"
    />
  </Hst.Variant>

  <Hst.Variant title="Wide (21:9)">
    <DemoEmbed
      src="https://blit-tech-demos.ambilab.com/flappy"
      title="Flappy Bird Demo"
      aspectRatio="21/9"
    />
  </Hst.Variant>
</Hst.Story>

