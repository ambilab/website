<script lang="ts">
    import { debounce } from '@utils/debounce';
    import type { Snippet } from 'svelte';

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    const svgProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        xmlns: 'http://www.w3.org/2000/svg',
    } as const;

    const focusableSelector =
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    let isOpen = $state(false);

    // Keyboard mode is enabled when the menu is open and the user is using the keyboard.
    let isKeyboardMode = $state(false);

    const baseMenuPanelClasses = [
        'z-mobile-menu fixed left-1/2 top-0 w-screen -translate-x-1/2 md:hidden pt-12',
        'bg-page-bg',
        'motion-safe:duration-333 motion-safe:transition-[clip-path]',
    ].join(' ');

    let menuPanelClass = $derived(
        isOpen
            ? baseMenuPanelClasses +
                  ' translate-y-0 pointer-events-auto [clip-path:inset(36px_0_0_0)] motion-safe:ease-out'
            : baseMenuPanelClasses + ' pointer-events-none [clip-path:inset(36px_0_100%_0)] motion-safe:ease-in',
    );

    let menuButtonElement: HTMLButtonElement | undefined = $state();
    let menuPanelElement: HTMLDivElement | undefined = $state();
    let menuContainerElement: HTMLDivElement | undefined = $state();

    function getFocusableElements(): HTMLElement[] {
        if (!menuPanelElement || !menuButtonElement) {
            return [];
        }

        return [menuButtonElement, ...Array.from(menuPanelElement.querySelectorAll<HTMLElement>(focusableSelector))];
    }

    function toggleMenu(): void {
        isOpen = !isOpen;
    }

    function closeMenu(): void {
        isOpen = false;
    }

    function handleMenuClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (target.closest('a')) {
            closeMenu();
        }
    }

    function disableKeyboardMode(): void {
        // Disables keyboard focus mode when mouse interaction is detected.
        isKeyboardMode = false;
    }

    function blurActiveIfInside(container: HTMLElement | undefined): void {
        if (container) {
            const activeElement = document.activeElement as HTMLElement;

            if (container.contains(activeElement)) {
                // Blurs the active element if it's within the specified container.
                activeElement.blur();
            }
        }
    }

    $effect(() => {
        // Updates keyboard mode state when menu opens/closes or menu button element changes.
        // Keyboard mode is active when the menu is open and the menu button has focus.
        if (typeof document !== 'undefined' && menuButtonElement) {
            isKeyboardMode = isOpen && document.activeElement === menuButtonElement;
        }
    });

    $effect(() => {
        if (isOpen) {
            // Prevents body scrolling when menu is open.
            // Restores original overflow value on cleanup.
            const originalOverflow = document.body.style.overflow;

            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    });

    $effect(() => {
        if (isOpen) {
            // Closes menu when Escape key is pressed.
            const handleEscape = (event: KeyboardEvent): void => {
                if (event.key === 'Escape') {
                    closeMenu();
                }
            };

            document.addEventListener('keydown', handleEscape);

            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }
    });

    $effect(() => {
        if (isOpen && menuPanelElement) {
            // Implements focus trap within the mobile menu.
            // When Tab is pressed, cycles focus between menu button and panel items.
            const handleFocusTrap = (event: KeyboardEvent): void => {
                if (event.key !== 'Tab') {
                    // If the key pressed is not Tab, do nothing.
                    return;
                }

                isKeyboardMode = true;

                const focusableElements = getFocusableElements();

                if (focusableElements.length === 0) {
                    // If there are no focusable elements, do nothing.
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                const activeElement = document.activeElement as HTMLElement;

                if (event.shiftKey && activeElement === firstElement) {
                    // If the key pressed is Shift + Tab and the active element is the first element,
                    // prevent default behavior and focus the last element.
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && activeElement === lastElement) {
                    // If the key pressed is Tab and the active element is the last element,
                    // prevent default behavior and focus the first element.
                    event.preventDefault();
                    firstElement.focus();
                }
            };

            document.addEventListener('keydown', handleFocusTrap);

            return () => {
                document.removeEventListener('keydown', handleFocusTrap);
            };
        }
    });

    $effect(() => {
        if (isOpen && menuPanelElement) {
            // Manages focus behavior for mouse interactions with menu panel items.
            // - On mouseenter: focuses the element (unless in keyboard mode)
            // - On mousemove: disables keyboard mode to allow hover styles
            const focusableElements = Array.from(menuPanelElement.querySelectorAll<HTMLElement>(focusableSelector));

            const handleMouseEnter = (element: HTMLElement) => (): void => {
                if (!isKeyboardMode) {
                    element.focus();
                }
            };

            const handlers = focusableElements.map((element) => {
                const enterHandler = handleMouseEnter(element);

                element.addEventListener('mouseenter', enterHandler);
                element.addEventListener('mousemove', disableKeyboardMode);

                return { element, enterHandler };
            });

            return () => {
                handlers.forEach(({ element, enterHandler }) => {
                    element.removeEventListener('mouseenter', enterHandler);
                    element.removeEventListener('mousemove', disableKeyboardMode);
                });
            };
        }
    });

    $effect(() => {
        if (isOpen && menuButtonElement && menuPanelElement) {
            // Manages focus behavior when hovering over the menu button while menu is open.
            // - On mouseenter: blurs any focused element inside the panel
            // - On mouseleave: blurs the button itself if focused
            const handleButtonEnter = (): void => {
                disableKeyboardMode();
                blurActiveIfInside(menuPanelElement);
            };

            const handleButtonLeave = (): void => {
                disableKeyboardMode();

                if (document.activeElement === menuButtonElement) {
                    menuButtonElement.blur();
                }
            };

            menuButtonElement.addEventListener('mouseenter', handleButtonEnter);
            menuButtonElement.addEventListener('mouseleave', handleButtonLeave);

            return () => {
                menuButtonElement.removeEventListener('mouseenter', handleButtonEnter);
                menuButtonElement.removeEventListener('mouseleave', handleButtonLeave);
            };
        }
    });

    $effect(() => {
        if (isOpen && menuPanelElement) {
            // Blurs focused elements when mouse leaves the menu panel area.
            const handleMenuLeave = (): void => {
                disableKeyboardMode();

                const activeElement = document.activeElement as HTMLElement;

                if (menuPanelElement.contains(activeElement) || activeElement === menuButtonElement) {
                    activeElement.blur();
                }
            };

            menuPanelElement.addEventListener('mouseleave', handleMenuLeave);

            return () => {
                menuPanelElement.removeEventListener('mouseleave', handleMenuLeave);
            };
        }
    });

    $effect(() => {
        if (!isOpen && menuContainerElement && menuButtonElement) {
            // Blurs the menu button when mouse leaves the container while menu is closed.
            const handleContainerLeave = (): void => {
                if (document.activeElement === menuButtonElement) {
                    menuButtonElement.blur();
                }
            };

            menuContainerElement.addEventListener('mouseleave', handleContainerLeave);

            return () => {
                menuContainerElement.removeEventListener('mouseleave', handleContainerLeave);
            };
        }
    });

    $effect(() => {
        // Closes menu when window is resized.
        // Debounced to avoid excessive calls during resize operations.
        const handleResize = debounce(() => {
            if (isOpen) {
                closeMenu();
            }
        }, 150);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            handleResize.cancel();
        };
    });
</script>

<div bind:this={menuContainerElement} class="-mx-[6px] h-6 w-6">
    <button
        bind:this={menuButtonElement}
        type="button"
        class="[&:hover,&:focus]:bg-active [&:hover,&:focus]:text-text-primary cursor-pointer text-text-secondary md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onclick={toggleMenu}
    >
        {#if isOpen}
            <svg {...svgProps}>
                <rect x="6" y="6" width="3" height="3" />
                <rect x="10.5" y="10.5" width="3" height="3" />
                <rect x="15" y="6" width="3" height="3" />
                <rect x="15" y="15" width="3" height="3" />
                <rect x="6" y="15" width="3" height="3" />
            </svg>
        {:else}
            <svg {...svgProps}>
                <rect x="6" y="6" width="12" height="3" />
                <rect x="6" y="15" width="12" height="3" />
                <rect x="6" y="10.5" width="12" height="3" />
            </svg>
        {/if}
    </button>

    <div
        class="menu-dimmer motion-safe:duration-333 fixed inset-x-0 bottom-0 top-12 opacity-0 motion-safe:transition-opacity md:hidden"
        class:opacity-100={isOpen}
        class:motion-safe:ease-out={isOpen}
        class:motion-safe:ease-in={!isOpen}
        class:pointer-events-auto={isOpen}
        class:pointer-events-none={!isOpen}
        onclick={closeMenu}
        aria-hidden={!isOpen}
        inert={!isOpen}
    ></div>

    <div
        bind:this={menuPanelElement}
        id="mobile-menu"
        class={menuPanelClass}
        class:keyboard-mode={isKeyboardMode}
        onclick={handleMenuClick}
        aria-hidden={!isOpen}
        inert={!isOpen}
    >
        <nav class="">
            {#if children}
                {@render children()}
            {/if}
        </nav>
    </div>
</div>

<style>
    .menu-dimmer {
        --color-menu-dimmer-bg: color-mix(in srgb, #a1a1aa 80%, transparent); /* zinc.400 */
        background-color: var(--color-menu-dimmer-bg);
    }

    :global(.dark) .menu-dimmer {
        --color-menu-dimmer-bg: color-mix(in srgb, #3f3f46 80%, transparent); /* zinc.700 */
    }

    .keyboard-mode :global(a:hover),
    .keyboard-mode :global(button:hover) {
        background-color: transparent !important;
        color: inherit !important;
    }

    :global(.dark) .keyboard-mode :global(a:hover),
    :global(.dark) .keyboard-mode :global(button:hover) {
        background-color: transparent !important;
        color: inherit !important;
    }
</style>
