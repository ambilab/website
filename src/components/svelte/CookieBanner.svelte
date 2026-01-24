<script lang="ts">
    import { COMPONENT_CONFIG } from '@config/components';
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
    import { onMount } from 'svelte';

    interface Props {
        locale?: Locale;
    }

    let { locale = 'en' }: Props = $props();

    const t = $derived(getTranslation(locale));

    let isVisible = $state(false);

    onMount(() => {
        try {
            const dismissed = localStorage.getItem(COMPONENT_CONFIG.cookieBanner.dismissedKey);

            if (!dismissed) {
                isVisible = true;
            }
        } catch {
            isVisible = true;
        }

        return () => {
            document.documentElement.style.removeProperty('--cookie-banner-height');
        };
    });

    $effect(() => {
        if (isVisible) {
            document.documentElement.style.setProperty('--cookie-banner-height', '80px');
        } else {
            document.documentElement.style.removeProperty('--cookie-banner-height');
        }
    });

    const handleDismiss = () => {
        try {
            localStorage.setItem(COMPONENT_CONFIG.cookieBanner.dismissedKey, 'true');
        } catch {
            // Silent fail: banner hides regardless of storage success.
        }
        isVisible = false;
    };
</script>

{#if isVisible}
    <div
        class="cookie-banner z-(--z-cookie-banner) fixed bottom-0 left-0 right-0 select-none px-4 pb-3 pt-2 antialiased sm:pt-3 md:py-7"
    >
        <div
            class="container mx-auto flex flex-col items-start justify-between gap-1 sm:max-w-[608px] sm:flex-row sm:items-center md:max-w-[736px] lg:max-w-[896px]"
        >
            <p class="text-balance font-mono text-[11px] uppercase leading-4">
                {t.cookie.message}
            </p>

            <button
                onclick={handleDismiss}
                class="cookie-banner-button flex cursor-pointer items-center px-2 pb-[4px] pt-[3.5px] font-mono text-[11px] uppercase disabled:opacity-50"
                aria-label={t.cookie.dismissLabel}
            >
                {t.cookie.button}
            </button>
        </div>
    </div>
{/if}

<style>
    .cookie-banner {
        --color-cookie-banner-bg: #2563eb; /* blue.600 */
        --color-cookie-banner-text: #ffffff; /* white */
        --color-cookie-banner-button-bg: #ffffff; /* white */
        --color-cookie-banner-button-text: #1e3a8a; /* blue.900 */

        background-color: var(--color-cookie-banner-bg);
        color: var(--color-cookie-banner-text);
    }

    .cookie-banner-button {
        background-color: var(--color-cookie-banner-button-bg);
        color: var(--color-cookie-banner-button-text);
    }
</style>
