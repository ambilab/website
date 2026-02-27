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
    let honeypot = $state('');
    let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
    let message = $state('');
    let hasValidationError = $state(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (!email || status === 'loading') {
            return;
        }

        status = 'loading';
        message = '';
        hasValidationError = false;

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, website: honeypot, locale }),
            });

            if (response.ok) {
                status = 'success';
                message = t.newsletter.success;
                email = '';
            } else {
                const data = (await response.json()) as { error?: string };
                status = 'error';
                message =
                    data.error === 'rate_limit' ? t.newsletter.rateLimitError : (data.error ?? t.newsletter.error);

                // Set hasValidationError to true only for field validation errors (400 status)
                hasValidationError = response.status === 400;

                logger.warn(`Newsletter subscription failed: ${data.error ?? 'Unknown error'}`);
            }
        } catch (error) {
            status = 'error';
            message = t.newsletter.error;
            hasValidationError = false;

            logger.error('Failed to submit the newsletter form', error);
        }
    };
</script>

<div class="newsletter-form">
    <h3 data-testid="newsletter-heading">{t.newsletter.title}</h3>

    <form onsubmit={handleSubmit} aria-busy={status === 'loading'}>
        <label for="newsletter-email" class="sr-only">{t.newsletter.emailPlaceholder}</label>

        <input
            type="text"
            name="website"
            bind:value={honeypot}
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            class="absolute -left-[9999px] size-px opacity-0"
        />

        <input
            type="email"
            id="newsletter-email"
            autocomplete="email"
            bind:value={email}
            placeholder={t.newsletter.emailPlaceholder}
            required
            disabled={status === 'loading'}
            aria-invalid={hasValidationError}
            aria-describedby={hasValidationError && message ? 'newsletter-status' : undefined}
            data-testid="newsletter-email"
            class="newsletter-form__email-input"
        />

        <Button type="submit" disabled={status === 'loading'} data-testid="newsletter-submit">
            {#if status === 'loading'}
                {t.newsletter.subscribing}
            {:else}
                {t.buttons.subscribe}
            {/if}
        </Button>
    </form>

    <div id="newsletter-status" role="status" aria-live="polite" aria-atomic="true">
        {#if message}
            <p>
                {message}
            </p>
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference "../../styles/global.css";

    .newsletter-form {
        @apply -mx-4 select-none;
        @apply bg-stickie-bg text-stickie-text;
        @apply px-4 pb-[17px] pt-4;

        /* Scope primary button colors to the stickie palette without class overrides */
        --color-button-primary-bg: var(--color-stickie-text);
        --color-button-primary-bg-hover: var(--color-stickie-text);
        --color-button-primary-text: white;
        --color-button-primary-text-hover: white;

        @media (min-width: 640px) {
            box-shadow:
                0 2px 0 0 var(--color-page-bg),
                0 4px 0 0 var(--color-stickie-bg);
        }

        & form {
            @apply flex flex-col gap-2 sm:flex-row;
        }

        & p {
            @apply mb-1;
            @apply text-[14px] leading-5;
            @apply md:text-base md:leading-6;
            @apply text-balance;
        }

        & h3 {
            @apply mb-1;
            @apply text-[24px] leading-6;
            @apply sm:w-2/3;
            @apply md:text-[32px] md:leading-8;
            @apply text-balance;
        }

        & [role='status'] p {
            @apply mb-0 mt-1;
        }
    }

    .newsletter-form__email-input {
        @apply flex-1 border-2 border-stickie-text px-4 py-2 disabled:opacity-50;

        &:focus {
            @apply border-stickie-text bg-stickie-text text-white outline-none ring-focus-ring;
        }
    }
</style>
