<script lang="ts">
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
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

    const SCROLL_THRESHOLD = 300;
    const ANIMATION_DURATION = 200;

    const t = $derived(getTranslation(locale));

    let isVisible = $state(false);
    let reducedMotion = $state(false);

    const transitionConfig = $derived(reducedMotion ? { duration: 0 } : { duration: ANIMATION_DURATION });

    const handleScroll = debounce(() => {
        if (!forceVisible) {
            isVisible = window.scrollY > SCROLL_THRESHOLD;
        }
    }, 100);

    const handleClick = () => {
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
        class="go-to-top-button"
        aria-label={t.a11y.goToTop}
    >
        <svg
            class="go-to-top-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M12 4L4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4Z" />
        </svg>
    </button>
{/if}

<style>
    @reference "../../styles/global.css";

    .go-to-top-button {
        @apply fixed z-go-to-top bg-red-400 p-3 shadow-lg;
        @apply text-button-primary-text;
        @apply hover:bg-red-500 hover:shadow-xl;
        @apply focus:bg-red-500 focus:shadow-xl;

        bottom: calc(2rem + var(--cookie-banner-height, 0px));
        right: 2rem;

        @media (min-width: 640px) {
            bottom: calc(2rem + var(--cookie-banner-height-sm, 0px));
        }

        @media (min-width: 768px) {
            bottom: calc(2rem + var(--cookie-banner-height-md, 0px));
        }

        & .go-to-top-icon {
            @apply h-6 w-6;
        }
    }
</style>
