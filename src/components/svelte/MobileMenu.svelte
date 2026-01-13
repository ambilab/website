<!--
 * MobileMenu Component
 *
 * Renders a mobile navigation menu with hamburger button and slide-down panel.
 *
 * Features:
 * - Animated hamburger/close icon toggle
 * - Slide-down menu with opacity transition
 * - Auto-closes when navigation links are clicked
 * - Disables page scrolling when open to prevent background interaction
 * - Accessible with proper ARIA attributes
 * - Accepts menu content as children
 *
 * Icons:
 * - This component uses inline SVG markup for the hamburger menu and close icons.
 * - Unlike Astro components which use the centralized icon system (Icon.astro),
 *   Svelte components in this project inline their SVG markup directly with
 *   Tailwind classes applied to the <svg> element. This pattern allows proper
 *   sizing and theming through currentColor, and keeps the component self-contained.
 *
 * Scroll Locking:
 * - When the menu is opened, document body scrolling is automatically disabled by setting
 *   `overflow: hidden` on the body element. This prevents users from scrolling the background
 *   content while the menu is active. The original overflow style is preserved and restored
 *   when the menu closes or the component unmounts.
 *
 * Accessibility (A11y) Features:
 * - All interactive elements (menu button, links) use proper ARIA attributes for screen reader compatibility:
 *   - The menu button uses `aria-label` to describe its purpose contextually ("Open menu" or "Close menu").
 *   - The menu button uses `aria-expanded` to indicate menu state to assistive tech.
 *   - The menu button uses `aria-controls` to reference the controlled menu panel by ID.
 * - Focus management: when the menu opens, focus moves to the first focusable element; when closed, focus returns to the button.
 * - Menu content is structured for keyboard navigation and focus is retained when toggled.
 * - Menu automatically closes when any contained navigation link is clicked, avoiding focus loss for users.
 * - Escape key closes the menu, following standard overlay/modal interaction patterns.
 * - The hamburger and close icons are accessible by being strictly decorative and not announced (SVGs are inside a button with descriptive aria-label).
 * - Background scroll locking improves focus management by preventing unintended scroll interactions.
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

    let menuButtonElement: HTMLButtonElement | undefined = $state();
    let menuPanelElement: HTMLDivElement | undefined = $state();

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

    /**
     * Effect to disable/enable body scrolling based on menu state.
     * Adds overflow-hidden to body when menu is open to prevent background scrolling.
     */
    $effect(() => {
        if (isOpen) {
            // Store the original overflow value to restore later.
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Cleanup: restore original overflow when the menu closes or component unmounts.
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }

        // Return no-op cleanup when menu is closed.
        return () => {};
    });

    /**
     * Effect to handle Escape key press to close the menu.
     * Adds a global keydown listener when the menu is open.
     */
    $effect(() => {
        if (isOpen) {
            const handleEscape = (event: KeyboardEvent): void => {
                if (event.key === 'Escape') {
                    closeMenu();
                }
            };

            document.addEventListener('keydown', handleEscape);

            // Cleanup: remove event listener when menu closes or component unmounts.
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }

        // Return no-op cleanup when menu is closed.
        return () => {};
    });

    /**
     * Effect to manage focus when the menu opens and closes.
     * When opening: moves focus to the first focusable element in the menu.
     * When closing: returns focus to the menu button.
     */
    $effect(() => {
        if (isOpen && menuPanelElement) {
            // Find the first focusable element in the menu
            const focusableElements = menuPanelElement.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        } else if (!isOpen && menuButtonElement && document.activeElement !== menuButtonElement) {
            // Return focus to the menu button when closing, but only if focus isn't already there
            menuButtonElement.focus();
        }
    });
</script>

<div>
    <!-- Mobile Menu Button -->
    <button
        bind:this={menuButtonElement}
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
        bind:this={menuPanelElement}
        id="mobile-menu"
        class="fixed left-0 right-0 top-16 z-40 border-t border-border-default bg-page-bg transition-all duration-300 ease-in-out sm:top-20 md:hidden dark:border-border-default-dark dark:bg-page-bg-dark"
        class:translate-y-0={isOpen}
        class:opacity-100={isOpen}
        class:pointer-events-auto={isOpen}
        class:-translate-y-full={!isOpen}
        class:opacity-0={!isOpen}
        class:pointer-events-none={!isOpen}
        onclick={handleMenuClick}
        aria-hidden={!isOpen}
    >
        <nav class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            {#if children}
                {@render children()}
            {/if}
        </nav>
    </div>
</div>
