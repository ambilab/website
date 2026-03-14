<script lang="ts">
    import Button from '@components/svelte/Button.svelte';
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';

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

                console.warn(`Newsletter subscription failed: ${data.error ?? 'Unknown error'}`);
            }
        } catch (error) {
            status = 'error';
            message = t.newsletter.error;
            hasValidationError = false;

            console.error('Failed to submit the newsletter form', error);
        }
    };
</script>

<div class="newsletter-form">
    <h3 data-testid="newsletter-heading">{t.newsletter.title}</h3>

    <form onsubmit={handleSubmit} aria-busy={status === 'loading'}>
        <label for="newsletter-email">{t.newsletter.emailPlaceholder}</label>

        <input type="text" name="website" bind:value={honeypot} tabindex="-1" autocomplete="off" aria-hidden="true" />

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

<style>
    @reference "../../styles/global.css";

    .newsletter-form {
        @apply px-4 py-5;
        @apply border-t-2 border-page-bg;
        @apply bg-stickie-bg text-stickie-text;
        @apply select-none;
        @apply sm:py-[30px] md:py-[35px];

        /* Scope primary button colors to the stickie palette without class overrides */
        --color-button-primary-bg: var(--color-stickie-text);
        --color-button-primary-bg-hover: var(--color-stickie-text);
        --color-button-primary-text: white;
        --color-button-primary-text-hover: white;

        & form {
            @apply flex flex-col gap-2 sm:flex-row;
            @apply sm:mx-auto sm:max-w-[608px];
            @apply md:max-w-[736px];
            @apply lg:max-w-[896px];
        }

        & label {
            @apply sr-only;
        }

        & input[type='text'] {
            @apply absolute -left-[9999px] size-px opacity-0;
        }

        & input[type='email'] {
            @apply flex-1 border-2 px-3 py-2 disabled:opacity-50;
            @apply focus:border-stickie-text focus:bg-stickie-text focus:text-white focus:outline-none;
        }

        & p {
            @apply my-1;
            @apply leading-0 text-balance;
            @apply text-[14px] leading-5;
            @apply sm:mx-auto sm:max-w-[608px];
            @apply md:max-w-[736px] md:text-base md:leading-6;
            @apply lg:max-w-[896px];
        }

        & h3 {
            @apply compact-heading;
            @apply -ml-px mb-[7px];
            @apply font-light;
            @apply sm:mx-auto sm:max-w-[608px];
            @apply md:max-w-[736px];
            @apply lg:max-w-[896px];
        }
    }
</style>
