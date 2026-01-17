<!--
 * MobileMenu Component
 *
 * Mobile navigation menu with hamburger button and animated slide-down panel.
 *
 * Features:
 * - Animated hamburger/close icon toggle (pixel art style)
 * - Slide-down menu with clip-path animation
 * - Background dimmer overlay when open
 * - Auto-closes when navigation links are clicked
 * - Auto-closes on window resize to prevent layout issues
 * - Disables page scrolling when open to prevent background interaction
 * - Accepts menu content as children (Svelte Snippet)
 * - Respects prefers-reduced-motion setting
 *
 * Icons:
 * - This component uses inline SVG markup for hamburger and close icons in pixel art style.
 * - Unlike Astro components which use the centralized icon system (Icon.astro),
 *   Svelte components in this project inline their SVG markup directly.
 * - Icons are rendered with currentColor for automatic theme color support.
 *
 * Scroll Locking:
 * - When opened, document body scrolling is automatically disabled by setting
 *   `overflow: hidden` on the body element. This prevents users from scrolling
 *   the background content while the menu is active.
 * - The original overflow style is preserved and restored when the menu closes
 *   or the component unmounts.
 *
 * Accessibility Features:
 * - Menu button uses proper ARIA attributes:
 *   - `aria-label` describes purpose contextually ("Open menu" or "Close menu")
 *   - `aria-expanded` indicates menu state to assistive technology
 *   - `aria-controls` references the controlled menu panel by ID
 * - Focus management:
 *   - When menu opens, focus moves to the first focusable element
 *   - When menu closes, focus returns to the button
 * - Focus trap: keyboard navigation (Tab/Shift+Tab) cycles through focusable elements
 * - Menu auto-closes when navigation links are clicked, avoiding focus loss
 * - Escape key closes the menu (standard overlay/modal pattern)
 * - Icons are decorative and not announced (inside button with descriptive aria-label)
 * - Background scroll locking prevents unintended scroll interactions
 * - Respects prefers-reduced-motion: animations disabled when requested
 *
 * Animation Strategy:
 * - Uses clip-path for smooth slide-down effect
 * - Background dimmer fades in/out with opacity transition
 * - All animations respect motion-safe: prefix for accessibility
 * - Easing: ease-out when opening, ease-in when closing
 *
 * Styling:
 * - Uses semantic color tokens (text-secondary, text-primary)
 * - Includes hover states for button
 * - Has negative margin (-mx-[6px]) for optical alignment
 * - Background dimmer uses custom menu-dimmer-bg color tokens
 *
 * @component
 * @example
 * ```astro
 * <MobileMenu client:load>
 *   <div class="flex flex-col px-4">
 *     <div class="py-4">
 *       <HeaderNav locale="en" currentPath="/blog" mobile={true} />
 *     </div>
 *     <div class="flex items-center justify-end gap-2 pb-4 pr-2">
 *       <LocaleSwitcher currentLocale="en" translationPath="/cs" />
 *       <ThemeSwitcher />
 *     </div>
 *   </div>
 * </MobileMenu>
 * ```
-->
<script lang="ts">
    import { debounce } from '@utils/debounce';
    import type { Snippet } from 'svelte';

    /**
     * Props for the MobileMenu component.
     */
    interface Props {
        /**
         * Menu content rendered as children using Svelte 5 Snippet.
         *
         * Typically contains HeaderNav and control buttons (LocaleSwitcher, ThemeSwitcher).
         */
        children?: Snippet;
    }

    let { children }: Props = $props();

    /**
     * Common SVG attributes for both menu icons.
     * Extracted to reduce duplication and ensure consistency.
     */
    const svgProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        xmlns: 'http://www.w3.org/2000/svg',
    } as const;

    /**
     * CSS selector for focusable elements.
     * Extracted to reduce duplication and ensure consistency across focus management effects.
     */
    const focusableSelector =
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    /** Whether the mobile menu is currently open. */
    let isOpen = $state(false);

    /**
     * Base CSS classes for the menu panel that remain constant.
     * Includes positioning, background, border, and animation setup.
     */
    const baseMenuPanelClasses = [
        'z-mobile-menu fixed left-1/2 top-0 w-screen -translate-x-1/2 md:hidden pt-12',
        'bg-page-bg border-t border-border-default dark:bg-page-bg-dark dark:border-border-default-dark',
        'motion-safe:duration-333 motion-safe:transition-[clip-path]',
    ].join(' ');

    /**
     * Dynamic CSS classes for the menu panel based on open/closed state.
     * Applies clip-path animation and pointer events.
     */
    let menuPanelClass = $derived(
        isOpen
            ? baseMenuPanelClasses +
                  ' translate-y-0 pointer-events-auto [clip-path:inset(49px_0_0_0)] motion-safe:ease-out'
            : baseMenuPanelClasses + ' pointer-events-none [clip-path:inset(49px_0_100%_0)] motion-safe:ease-in',
    );

    /** Reference to the menu button element for focus management. */
    let menuButtonElement: HTMLButtonElement | undefined = $state();

    /** Reference to the menu panel element for focus trap implementation. */
    let menuPanelElement: HTMLDivElement | undefined = $state();

    /**
     * Toggles the mobile menu between open and closed states.
     * Called when the hamburger/close button is clicked.
     */
    function toggleMenu(): void {
        isOpen = !isOpen;
    }

    /**
     * Closes the mobile menu.
     * Used by various event handlers (link clicks, Escape key, resize, dimmer click).
     */
    function closeMenu(): void {
        isOpen = false;
    }

    /**
     * Handles click events within the menu panel.
     * Auto-closes the menu when any link is clicked for better UX.
     *
     * @param event - The mouse click event
     */
    function handleMenuClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        // Check if the click target is within a link element
        if (target.closest('a')) {
            closeMenu();
        }
    }

    /**
     * Effect to manage body scroll locking based on menu state.
     *
     * When the menu opens:
     * - Stores the original overflow style
     * - Sets overflow: hidden on body to prevent background scrolling
     *
     * When the menu closes or component unmounts:
     * - Restores the original overflow style
     *
     * This improves UX by preventing users from accidentally scrolling
     * the background content while the menu overlay is active.
     */
    $effect(() => {
        if (isOpen) {
            // Store the original overflow value to restore later
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Cleanup: restore the original overflow when the menu closes or component unmounts
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }

        // Return no-op cleanup when the menu is closed
        return () => {};
    });

    /**
     * Effect to handle Escape key press for closing the menu.
     *
     * When the menu is open:
     * - Adds a global keydown listener
     * - Closes the menu when Escape key is pressed
     *
     * When the menu closes or component unmounts:
     * - Removes the event listener
     *
     * This follows standard modal/overlay interaction patterns and
     * improves accessibility for keyboard users.
     */
    $effect(() => {
        if (isOpen) {
            const handleEscape = (event: KeyboardEvent): void => {
                if (event.key === 'Escape') {
                    closeMenu();
                }
            };

            document.addEventListener('keydown', handleEscape);

            // Cleanup: remove event listener when menu closes or component unmounts
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }

        // Return no-op cleanup when the menu is closed
        return () => {};
    });

    /**
     * Effect to manage focus for accessibility.
     *
     * When the menu opens:
     * - Moves focus to the first focusable element within the menu
     * - Helps keyboard users immediately interact with menu content
     *
     * When the menu closes:
     * - Returns focus to the menu button (if focus isn't already there)
     * - Prevents focus loss and maintains keyboard navigation context
     *
     * This is a critical accessibility feature for keyboard and screen reader users.
     */
    $effect(() => {
        if (isOpen && menuPanelElement) {
            // Find the first focusable element in the menu
            const focusableElements = menuPanelElement.querySelectorAll<HTMLElement>(focusableSelector);

            if (focusableElements && focusableElements.length > 0 && focusableElements[0]) {
                focusableElements[0].focus();
            }
        } else if (
            !isOpen &&
            menuButtonElement &&
            typeof menuButtonElement.focus === 'function' &&
            document.activeElement !== menuButtonElement
        ) {
            // Return focus to the menu button when closing, but only if focus isn't already there
            menuButtonElement.focus();
        }
    });

    /**
     * Effect to implement a focus trap for accessibility.
     *
     * When the menu is open:
     * - Traps keyboard navigation (Tab/Shift+Tab) within the menu
     * - Cycles focus through focusable elements (button + menu items)
     * - Prevents focus from escaping to background content
     *
     * How it works:
     * - Tab at last element: cycles to first element
     * - Shift+Tab at first element: cycles to last element
     * - Only traps Tab key, other keys work normally
     *
     * When the menu closes or component unmounts:
     * - Removes the event listener
     *
     * This is a critical accessibility feature that prevents keyboard users
     * from accidentally navigating to background content while the menu is open.
     */
    $effect(() => {
        if (isOpen && menuPanelElement) {
            const handleFocusTrap = (event: KeyboardEvent): void => {
                // Only trap the Tab key
                if (event.key !== 'Tab') {
                    return;
                }

                // Get all focusable elements within the menu and the button
                const focusableElements = [
                    ...(menuButtonElement ? [menuButtonElement] : []),
                    ...(menuPanelElement
                        ? Array.from(menuPanelElement.querySelectorAll<HTMLElement>(focusableSelector))
                        : []),
                ].filter((el): el is HTMLElement => el !== undefined);

                if (focusableElements.length === 0) {
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                const activeElement = document.activeElement as HTMLElement;

                // Shift+Tab: if on the first element, cycle to the last
                if (event.shiftKey && activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }

                // Tab: if on the last element, cycle to the first
                else if (!event.shiftKey && activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            };

            document.addEventListener('keydown', handleFocusTrap);

            // Cleanup: remove event listener when menu closes or component unmounts
            return () => {
                document.removeEventListener('keydown', handleFocusTrap);
            };
        }

        // Return no-op cleanup when the menu is closed
        return () => {};
    });

    /**
     * Effect to handle window resize events.
     *
     * When the window is resized:
     * - Automatically closes the menu if it's open
     * - Prevents layout issues when switching between mobile and desktop views
     * - Uses debouncing (150ms) to avoid excessive calls during continuous resizing
     *
     * When the component unmounts:
     * - Removes the event listener
     * - Cancels any pending debounced calls to prevent memory leaks
     *
     * This ensures the mobile menu doesn't remain open when the viewport
     * transitions to desktop size where the menu shouldn't be visible.
     */
    $effect(() => {
        const handleResize = debounce(() => {
            if (isOpen) {
                closeMenu();
            }
        }, 150);

        window.addEventListener('resize', handleResize);

        // Cleanup: remove event listener and cancel any pending debounced calls
        return () => {
            window.removeEventListener('resize', handleResize);
            handleResize.cancel();
        };
    });
</script>

<div class="-mx-[6px] h-6 w-6">
    <!-- Mobile Menu Button -->
    <button
        bind:this={menuButtonElement}
        type="button"
        class="cursor-pointer text-text-secondary hover:text-text-primary md:hidden dark:text-text-secondary-dark dark:hover:text-text-primary-dark"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onclick={toggleMenu}
    >
        {#if isOpen}
            <!-- Close Icon (pixel art X) -->
            <svg {...svgProps}>
                <rect x="6" y="6" width="3" height="3" />
                <rect x="10.5" y="10.5" width="3" height="3" />
                <rect x="15" y="6" width="3" height="3" />
                <rect x="15" y="15" width="3" height="3" />
                <rect x="6" y="15" width="3" height="3" />
            </svg>
        {:else}
            <!-- Hamburger Menu Icon (pixel art three lines) -->
            <svg {...svgProps}>
                <rect x="6" y="6" width="12" height="3" />
                <rect x="6" y="15" width="12" height="3" />
                <rect x="6" y="10.5" width="12" height="3" />
            </svg>
        {/if}
    </button>

    <!-- Background dimmer -->
    <div
        class="bg-menu-dimmer-bg dark:bg-menu-dimmer-bg-dark motion-safe:duration-333 fixed inset-x-0 bottom-0 top-12 opacity-0 motion-safe:transition-opacity md:hidden"
        class:opacity-100={isOpen}
        class:motion-safe:ease-out={isOpen}
        class:motion-safe:ease-in={!isOpen}
        class:pointer-events-auto={isOpen}
        class:pointer-events-none={!isOpen}
        onclick={closeMenu}
        aria-hidden={!isOpen}
    ></div>

    <!-- Mobile Menu Dropdown -->
    <div
        bind:this={menuPanelElement}
        id="mobile-menu"
        class={menuPanelClass}
        onclick={handleMenuClick}
        aria-hidden={!isOpen}
    >
        <nav class="">
            {#if children}
                {@render children()}
            {/if}
        </nav>
    </div>
</div>
