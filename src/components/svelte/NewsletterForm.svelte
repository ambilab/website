<script lang="ts">
  import { getTranslation } from '@i18n/translations';
  import type { Locale } from '@type/locale';

  interface Props {
    locale?: Locale;
  }

  let { locale = 'en' }: Props = $props();

  const t = getTranslation(locale);

  let email = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let message = $state('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!email || status === 'loading') return;

    status = 'loading';
    message = '';

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        status = 'success';
        message = t.newsletter.success;
        email = '';
      } else {
        const data = await response.json();
        status = 'error';
        message = data.error || t.newsletter.error;
      }
    } catch (error) {
      status = 'error';
      message = t.newsletter.error;
    }
  };
</script>

<div class="rounded-lg bg-blue-50 p-6 dark:bg-blue-950">
  <h3 class="mb-2 text-xl font-semibold">{t.newsletter.title}</h3>
  <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
    {t.newsletter.description}
  </p>

  <form onsubmit={handleSubmit} class="flex gap-2">
    <input
      type="email"
      bind:value={email}
      placeholder={t.newsletter.emailPlaceholder}
      required
      disabled={status === 'loading'}
      class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900"
    />
    <button
      type="submit"
      disabled={status === 'loading'}
      class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
    >
      {#if status === 'loading'}
        <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {t.newsletter.subscribing}
      {:else}
        {t.buttons.subscribe}
      {/if}
    </button>
  </form>

  {#if message}
    <p
      class="mt-2 text-sm"
      class:text-green-600={status === 'success'}
      class:text-red-600={status === 'error'}
    >
      {message}
    </p>
  {/if}
</div>

