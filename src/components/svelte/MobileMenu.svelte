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

    const baseMenuPanelClasses = [
        'z-(--z-mobile-menu) fixed left-1/2 top-0 w-screen -translate-x-1/2 md:hidden pt-12',
        'bg-page-bg border-t border-border-default dark:bg-page-bg-dark dark:border-border-default-dark',
        'motion-safe:duration-333 motion-safe:transition-[clip-path]',
    ].join(' ');

    let menuPanelClass = $derived(
        isOpen
            ? baseMenuPanelClasses +
                  ' translate-y-0 pointer-events-auto [clip-path:inset(49px_0_0_0)] motion-safe:ease-out'
            : baseMenuPanelClasses + ' pointer-events-none [clip-path:inset(49px_0_100%_0)] motion-safe:ease-in',
    );

    let menuButtonElement: HTMLButtonElement | undefined = $state();
    let menuPanelElement: HTMLDivElement | undefined = $state();

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

    $effect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;

            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }

        return () => {};
    });

    $effect(() => {
        if (isOpen) {
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

        return () => {};
    });

    $effect(() => {
        if (isOpen && menuPanelElement) {
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
            menuButtonElement.focus();
        }
    });

    $effect(() => {
        if (isOpen && menuPanelElement) {
            const handleFocusTrap = (event: KeyboardEvent): void => {
                if (event.key !== 'Tab') {
                    return;
                }

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

                if (event.shiftKey && activeElement === firstElement) {
                    event.preventDefault();

                    lastElement?.focus();
                } else if (!event.shiftKey && activeElement === lastElement) {
                    event.preventDefault();

                    firstElement?.focus();
                }
            };

            document.addEventListener('keydown', handleFocusTrap);

            return () => {
                document.removeEventListener('keydown', handleFocusTrap);
            };
        }

        return () => {};
    });

    $effect(() => {
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

<div class="-mx-[6px] h-6 w-6">
    <button
        bind:this={menuButtonElement}
        type="button"
        class="[&:hover,&:focus]:bg-surface-hover dark:[&:hover,&:focus]:bg-surface-hover-dark cursor-pointer text-text-secondary hover:text-text-primary md:hidden dark:text-text-secondary-dark dark:hover:text-text-primary-dark"
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
        --color-menu-dimmer-bg-dark: color-mix(in srgb, #3f3f46 80%, transparent); /* zinc.700 */
        background-color: var(--color-menu-dimmer-bg-dark);
    }
</style>
