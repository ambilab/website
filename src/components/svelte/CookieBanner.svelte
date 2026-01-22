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
        class="z-(--z-cookie-banner) fixed bottom-0 left-0 right-0 border-t border-border-default bg-surface p-4 shadow-lg dark:border-border-default-dark dark:bg-surface-dark"
    >
        <div class="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p class="text-sm text-text-secondary dark:text-text-secondary-dark">
                {t.cookie.message}
            </p>

            <button
                onclick={handleDismiss}
                class="rounded-lg bg-button-primary px-4 py-2 text-sm font-medium text-button-primary-text hover:bg-button-primary-hover dark:bg-button-primary-dark dark:text-button-primary-text-dark dark:hover:bg-button-primary-hover-dark"
            >
                {t.cookie.button}
            </button>
        </div>
    </div>
{/if}
