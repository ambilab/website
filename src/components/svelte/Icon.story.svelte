<script lang="ts">
  import { Hst } from '@histoire/plugin-svelte';

  import Icon from './Icon.svelte';
</script>

<Hst.Story title="Components/Icon">
  <Hst.Variant title="Solar Icons">
    <div class="flex flex-wrap gap-4">
      <Icon name="solar:home-bold" class="h-8 w-8" />
      <Icon name="solar:user-bold" class="h-8 w-8" />
      <Icon name="solar:calendar-bold" class="h-8 w-8" />
      <Icon name="solar:play-circle-bold" class="h-8 w-8" />
      <Icon name="solar:code-bold" class="h-8 w-8" />
      <Icon name="solar:heart-bold" class="h-8 w-8" />
    </div>
  </Hst.Variant>

  <Hst.Variant title="Different Sizes">
    <div class="flex items-center gap-4">
      <Icon name="solar:star-bold" class="h-4 w-4" />
      <Icon name="solar:star-bold" class="h-6 w-6" />
      <Icon name="solar:star-bold" class="h-8 w-8" />
      <Icon name="solar:star-bold" class="h-12 w-12" />
    </div>
  </Hst.Variant>

  <Hst.Variant title="With Colors">
    <div class="flex gap-4">
      <Icon name="solar:sun-bold" class="h-8 w-8 text-yellow-500" />
      <Icon name="solar:moon-bold" class="h-8 w-8 text-blue-500" />
      <Icon name="solar:heart-bold" class="h-8 w-8 text-red-500" />
    </div>
  </Hst.Variant>
</Hst.Story>

