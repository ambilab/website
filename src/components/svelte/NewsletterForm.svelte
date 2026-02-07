<script lang="ts">
    import Button from '@components/svelte/Button.svelte';
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

<div class="stickie-with-shadows -mx-[16px] select-none bg-stickie-bg px-[16px] py-[16px] text-stickie-text">
    <h3 class="mt-px! md:mt-[2px]! mb-2!">{t.newsletter.title}</h3>

    <p class="text-balance">
        {t.newsletter.description}
    </p>

    <form onsubmit={handleSubmit} class="flex gap-2">
        <input
            type="email"
            bind:value={email}
            placeholder={t.newsletter.emailPlaceholder}
            required
            disabled={status === 'loading'}
            class="flex-1 border-2 border-stickie-text px-4 py-2 focus:border-stickie-text focus:bg-stickie-text focus:text-white focus:outline-none focus:ring-focus-ring disabled:opacity-50"
        />

        <Button type="submit" class="[&:hover,&:focus]:bg-stickie-text bg-stickie-text" disabled={status === 'loading'}>
            {#if status === 'loading'}
                {t.newsletter.subscribing}
            {:else}
                {t.buttons.subscribe}
            {/if}
        </Button>
    </form>

    {#if message}
        <p class="mb-0! mt-4 text-balance">
            {message}
        </p>
    {/if}
</div>
