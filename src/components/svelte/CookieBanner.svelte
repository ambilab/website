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
        class="border-border-default bg-surface dark:border-border-default-dark dark:bg-surface-dark fixed bottom-0 left-0 right-0 z-50 border-t p-4 shadow-lg"
    >
        <div class="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p class="text-text-secondary dark:text-text-secondary-dark text-sm">
                {t.cookie.message}
            </p>
            <button
                onclick={handleDismiss}
                class="bg-button-primary text-button-primary-text hover:bg-button-primary-hover rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
                {t.cookie.button}
            </button>
        </div>
    </div>
{/if}
