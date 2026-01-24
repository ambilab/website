<script lang="ts">
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
    import { createLogger } from '@utils/logger';

    const logger = createLogger({ prefix: 'NewsletterForm' });

    interface Props {
        locale?: Locale;
    }

    let { locale = 'en' }: Props = $props();

    const t = $derived(getTranslation(locale));

    let email = $state('');
    let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
    let message = $state('');

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (!email || status === 'loading') {
            return;
        }

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

                logger.warn(`Newsletter subscription failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            status = 'error';
            message = t.newsletter.error;

            logger.error('Failed to submit the newsletter form', error);
        }
    };
</script>

<div class="rounded-lg bg-info-bg p-6 dark:bg-info-bg-dark">
    <h3 class="mb-2 text-xl font-semibold">{t.newsletter.title}</h3>

    <p class="mb-4 text-sm text-text-muted dark:text-text-muted-dark">
        {t.newsletter.description}
    </p>

    <form onsubmit={handleSubmit} class="flex gap-2">
        <input
            type="email"
            bind:value={email}
            placeholder={t.newsletter.emailPlaceholder}
            required
            disabled={status === 'loading'}
            class="flex-1 rounded-lg border border-border-medium px-4 py-2 focus:border-link focus:outline-none focus:ring-2 focus:ring-link disabled:opacity-50 dark:border-border-medium-dark dark:bg-surface-dark dark:focus:border-link-dark dark:focus:ring-link-dark"
        />

        <button
            type="submit"
            disabled={status === 'loading'}
            class="inline-flex items-center gap-2 rounded-lg bg-button-primary px-4 py-2 font-medium text-button-primary-text hover:bg-button-primary-hover disabled:opacity-50 dark:bg-button-primary-dark dark:text-button-primary-text-dark dark:hover:bg-button-primary-hover-dark"
        >
            {#if status === 'loading'}
                <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
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
            class:text-success-text={status === 'success'}
            class:dark:text-success-text-dark={status === 'success'}
            class:text-error-text={status === 'error'}
            class:dark:text-error-text-dark={status === 'error'}
        >
            {message}
        </p>
    {/if}
</div>
