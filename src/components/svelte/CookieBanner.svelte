<script lang="ts">
  import { onMount } from 'svelte';
  import type { Locale } from '@type/locale';
  import { getTranslation } from '@i18n/translations';
  import { COMPONENT_CONFIG } from '@config/components';

  interface Props {
    locale?: Locale;
  }

  let { locale = 'en' }: Props = $props();

  const t = getTranslation(locale);

  let isVisible = $state(false);

  onMount(() => {
    try {
      const dismissed = localStorage.getItem(COMPONENT_CONFIG.cookieBanner.dismissedKey);
      if (!dismissed) {
        isVisible = true;
      }
    } catch {
      // Fallback: show banner if localStorage is unavailable
      isVisible = true;
    }
  });

  const handleDismiss = () => {
    try {
      localStorage.setItem(COMPONENT_CONFIG.cookieBanner.dismissedKey, 'true');
    } catch {
      // Silent fail - user can dismiss again on next visit
    }
    isVisible = false;
  };
</script>

{#if isVisible}
  <div
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-gray-700 dark:text-gray-300">
        {t.cookie.message}
      </p>
      <button
        onclick={handleDismiss}
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {t.cookie.button}
      </button>
    </div>
  </div>
{/if}

