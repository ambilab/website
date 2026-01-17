<script lang="ts">
    /**
     * GoToTop Component
     *
     * Floating button that appears when the user scrolls down,
     * allowing them to quickly return to the top of the page.
     *
     * Uses smooth scrolling and fade transitions for a polished user experience.
     *
     * Features:
     * - Appears after scrolling past configured threshold
     * - Smooth scroll-to-top animation
     * - Fade in/out transition
     * - Fixed positioning in bottom-right corner
     * - Debounced scroll event handling for performance
     * - Optional force visible mode for testing
     * - Accessible with aria-label
     * - Dark mode support
     *
     * @component
     * @example
     * ```svelte
     * <GoToTop client:idle />
     * ```
     */
    import { COMPONENT_CONFIG } from '@config/components';
    import { debounce } from '@utils/debounce';
    import { scrollToTop } from '@utils/scroll';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    /**
     * Props for the GoToTop component.
     */
    interface Props {
        /**
         * Force the button to be visible regardless of scroll position.
         *
         * Useful for testing or when you want the button always visible.
         *
         * @default false
         */
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
        transition:fade={{ duration: COMPONENT_CONFIG.goToTop.animationDuration }}
        onclick={handleClick}
        class="fixed bottom-8 right-8 z-go-to-top rounded-full bg-button-primary p-3 text-button-primary-text shadow-lg hover:bg-button-primary-hover hover:shadow-xl dark:bg-button-primary-dark dark:text-button-primary-text-dark dark:hover:bg-button-primary-hover-dark"
        aria-label="Go to top"
    >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4Z" />
        </svg>
    </button>
{/if}
