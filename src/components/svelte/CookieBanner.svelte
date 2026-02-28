<script lang="ts">
    import { COMPONENT_CONFIG } from '@config/components';
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
    import { trackCookieBannerDismissed } from '@utils/analytics';
    import { onMount } from 'svelte';

    interface Props {
        locale?: Locale;
    }

    let { locale = 'en' }: Props = $props();

    const t = $derived(getTranslation(locale));

    let isVisible = $state(true); // Start visible for SSR
    let hydrated = $state(false);
    let bannerEl: HTMLDivElement | undefined = $state();
    let previouslyFocusedEl: Element | null = null;

    const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusableElements(): HTMLElement[] {
        if (!bannerEl) return [];
        return Array.from(bannerEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            handleDismiss();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (first === undefined || last === undefined) return;

        if (event.shiftKey) {
            if (document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    function resetCookieBannerProperties() {
        document.documentElement.style.removeProperty('--cookie-banner-height');
        document.documentElement.style.removeProperty('--cookie-banner-height-sm');
        document.documentElement.style.removeProperty('--cookie-banner-height-md');
    }

    onMount(() => {
        try {
            const dismissed = localStorage.getItem(COMPONENT_CONFIG.cookieBanner.dismissedKey);

            if (dismissed) {
                isVisible = false;
            }
        } catch {
            // If localStorage fails, keep it visible
        }

        hydrated = true;

        return () => {
            resetCookieBannerProperties();
        };
    });

    $effect(() => {
        if (typeof document !== 'undefined' && hydrated) {
            if (isVisible) {
                document.documentElement.style.setProperty('--cookie-banner-height', '76px');
                document.documentElement.style.setProperty('--cookie-banner-height-sm', '50px');
                document.documentElement.style.setProperty('--cookie-banner-height-md', '82px');
            } else {
                resetCookieBannerProperties();
            }
        }
    });

    // Focus management: move focus into banner when it becomes visible after hydration
    $effect(() => {
        if (!hydrated || !isVisible || !bannerEl) return;

        previouslyFocusedEl = document.activeElement;

        // Defer focus to after the DOM update
        const rafId = requestAnimationFrame(() => {
            const focusable = getFocusableElements();
            const firstFocusable = focusable[0];

            if (firstFocusable) {
                firstFocusable.focus();
            } else {
                bannerEl?.focus();
            }
        });

        return () => {
            cancelAnimationFrame(rafId);
        };
    });

    const handleDismiss = () => {
        try {
            localStorage.setItem(COMPONENT_CONFIG.cookieBanner.dismissedKey, 'true');
        } catch {
            // Silent fail: banner hides regardless of storage success.
        }
        trackCookieBannerDismissed(locale);
        isVisible = false;

        // Restore focus to the previously focused element
        if (previouslyFocusedEl instanceof HTMLElement) {
            previouslyFocusedEl.focus();
        }
        previouslyFocusedEl = null;
    };
</script>

{#if isVisible}
    <div
        bind:this={bannerEl}
        role="alertdialog"
        aria-label={t.cookie.bannerLabel}
        aria-describedby="cookie-banner-message"
        aria-modal="true"
        tabindex="-1"
        onkeydown={handleKeydown}
        class="cookie-banner fixed bottom-0 left-0 right-0 z-cookie-banner select-none border-t-2 border-page-bg px-4 pb-3 pt-2.5 antialiased sm:pt-3 md:py-7"
    >
        <div
            class="container mx-auto flex flex-col items-start justify-between gap-1 sm:max-w-[608px] sm:flex-row sm:items-center md:max-w-[736px] lg:max-w-[896px]"
        >
            <p id="cookie-banner-message" class="meta -ml-px max-w-[200px] text-balance sm:max-w-none">
                {t.cookie.message}
            </p>

            <button
                onclick={handleDismiss}
                class="meta cookie-banner-button flex cursor-pointer items-center px-2 py-[6px] disabled:opacity-50"
                aria-label={t.cookie.dismissLabel}
            >
                {t.cookie.button}
            </button>
        </div>
    </div>
{/if}

<style lang="postcss">
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
