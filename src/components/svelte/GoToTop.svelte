<script lang="ts">
    import { COMPONENT_CONFIG } from '@config/components';
    import { debounce } from '@utils/debounce';
    import { scrollToTop } from '@utils/scroll';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    interface Props {
        forceVisible?: boolean;
    }

    let { forceVisible = false }: Props = $props();

    let isVisible = $state(false);

    const handleScroll = debounce(() => {
        if (!forceVisible) {
            isVisible = window.scrollY > COMPONENT_CONFIG.goToTop.showAfterScroll;
        }
    }, 100);

    const handleClick = () => {
        scrollToTop(true);
    };

    onMount(() => {
        if (forceVisible) {
            isVisible = true;

            return () => {
                // No cleanup needed when forceVisible is true.
            };
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
        transition:fade={{ duration: COMPONENT_CONFIG.goToTop.animationDuration }}
        onclick={handleClick}
        class="go-to-top-button z-(--z-go-to-top) [&:hover,&:focus]:bg-button-primary-hover [&:hover,&:focus]:shadow-xl dark:[&:hover,&:focus]:bg-button-primary-hover-dark bg-button-primary dark:bg-button-primary-dark fixed rounded-full p-3 text-button-primary-text shadow-lg dark:text-button-primary-text-dark"
        aria-label="Go to top"
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
