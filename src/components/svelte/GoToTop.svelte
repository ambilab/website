<script lang="ts">
    import { COMPONENT_CONFIG } from '@config/components';
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
    import { trackScrollToTop } from '@utils/analytics';
    import { debounce } from '@utils/debounce';
    import { prefersReducedMotion } from '@utils/dom';
    import { scrollToTop } from '@utils/scroll';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    interface Props {
        locale: Locale;
        forceVisible?: boolean;
    }

    let { locale, forceVisible = false }: Props = $props();

    const t = $derived(getTranslation(locale));

    let isVisible = $state(false);
    let reducedMotion = $state(false);

    const transitionConfig = $derived(
        reducedMotion ? { duration: 0 } : { duration: COMPONENT_CONFIG.goToTop.animationDuration },
    );

    const handleScroll = debounce(() => {
        if (!forceVisible) {
            isVisible = window.scrollY > COMPONENT_CONFIG.goToTop.showAfterScroll;
        }
    }, 100);

    const handleClick = () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollDepth = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        trackScrollToTop(scrollDepth);
        scrollToTop(true);
    };

    onMount(() => {
        reducedMotion = prefersReducedMotion();

        if (forceVisible) {
            isVisible = true;
            return;
        }

        const scrollHandler = handleScroll as EventListener;
        const options = { passive: true } as AddEventListenerOptions;

        window.addEventListener('scroll', scrollHandler, options);

        return () => {
            window.removeEventListener('scroll', scrollHandler, options);
            handleScroll.cancel();
        };
    });
</script>

{#if isVisible || forceVisible}
    <button
        transition:fade={transitionConfig}
        onclick={handleClick}
        class="go-to-top-button [&:hover,&:focus]:bg-button-primary-hover [&:hover,&:focus]:shadow-xl bg-button-primary fixed z-go-to-top p-3 text-button-primary-text shadow-lg"
        aria-label={t.a11y.goToTop}
    >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4Z" />
        </svg>
    </button>
{/if}

<style lang="postcss">
    .go-to-top-button {
        bottom: calc(2rem + var(--cookie-banner-height, 0px));
        right: 2rem;

        @media (min-width: 640px) {
            bottom: calc(2rem + var(--cookie-banner-height-sm, 0px));
        }

        @media (min-width: 768px) {
            bottom: calc(2rem + var(--cookie-banner-height-md, 0px));
        }
    }
</style>
