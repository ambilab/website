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
        } else {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                window.removeEventListener('scroll', handleScroll, { passive: true });
                handleScroll.cancel();
            };
        }
    });
</script>

{#if isVisible || forceVisible}
    <button
        transition:fade={{ duration: 200 }}
        onclick={handleClick}
        class="fixed bottom-8 right-8 z-40 rounded-full bg-button-primary p-3 text-button-primary-text shadow-lg transition-all hover:bg-button-primary-hover hover:shadow-xl dark:bg-button-primary-dark dark:text-button-primary-text-dark dark:hover:bg-button-primary-hover-dark"
        aria-label="Go to top"
    >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4Z" />
        </svg>
    </button>
{/if}
