<!--
 * MobileMenu Component
 *
 * Renders a mobile navigation menu with hamburger button and slide-down panel.
 *
 * Features:
 * - Animated hamburger/close icon toggle
 * - Slide-down menu with opacity transition
 * - Auto-closes when navigation links are clicked
 * - Accessible with proper ARIA attributes
 * - Accepts menu content as children
 *
 * Icons:
 * This component uses inline SVG markup for the hamburger menu and close icons.
 * Unlike Astro components which use the centralized icon system (Icon.astro),
 * Svelte components in this project inline their SVG markup directly with
 * Tailwind classes applied to the <svg> element. This pattern allows proper
 * sizing and theming through currentColor, and keeps the component self-contained.
 *
 * @component
 * @example
 * ```astro
 * <MobileMenu client:load>
 *   <div class="flex flex-col gap-6">
 *     <HeaderNav locale="en" currentPath="/blog" mobile={true} />
 *     <div class="flex items-center gap-2 border-t border-border-default pt-6">
 *       <ThemeSwitcher />
 *       <LocaleSwitcher currentLocale="en" />
 *     </div>
 *   </div>
 * </MobileMenu>
 * ```
-->
<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        /** Menu content rendered as children. */
        children?: Snippet;
    }

    let { children }: Props = $props();

    let isOpen = $state(false);

    /**
     * Toggles the mobile menu open/closed state.
     */
    function toggleMenu(): void {
        isOpen = !isOpen;
    }

    /**
     * Closes the mobile menu.
     */
    function closeMenu(): void {
        isOpen = false;
    }

    /**
     * Handles click events on menu links to auto-close the menu.
     */
    function handleMenuClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (target.tagName === 'A') {
            closeMenu();
        }
    }
</script>

<div>
    <!-- Mobile Menu Button -->
    <button
        type="button"
        class="p-2 text-text-secondary transition-colors hover:text-text-primary md:hidden dark:text-text-secondary-dark dark:hover:text-text-primary-dark"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onclick={toggleMenu}
    >
        {#if isOpen}
            <!-- Close Icon -->
            <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        {:else}
            <!-- Hamburger Menu Icon -->
            <svg
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
        {/if}
    </button>

    <!-- Mobile Menu Dropdown -->
    <div
        id="mobile-menu"
        class="fixed left-0 right-0 top-16 z-40 border-t border-border-default bg-page-bg transition-all duration-300 ease-in-out sm:top-20 md:hidden dark:border-border-default-dark dark:bg-page-bg-dark"
        class:translate-y-0={isOpen}
        class:opacity-100={isOpen}
        class:pointer-events-auto={isOpen}
        class:-translate-y-full={!isOpen}
        class:opacity-0={!isOpen}
        class:pointer-events-none={!isOpen}
        onclick={handleMenuClick}
    >
        <nav class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            {#if children}
                {@render children()}
            {/if}
        </nav>
    </div>
</div>
