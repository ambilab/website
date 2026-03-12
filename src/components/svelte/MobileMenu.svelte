<script lang="ts">
    import { getTranslation } from '@i18n/translations';
    import type { Locale } from '@type/locale';
    import { trackMobileMenuOpened } from '@utils/analytics';
    import type { Snippet } from 'svelte';

    interface Props {
        locale: Locale;
        children?: Snippet;
    }

    let { locale, children }: Props = $props();

    const t = $derived(getTranslation(locale));

    const svgProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        fill: 'var(--color-page-bg)',
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-hidden': 'true',
    } as const;

    let isOpen = $state(false);
    let menuButtonElement: HTMLButtonElement | undefined = $state();
    let dialogElement: HTMLDialogElement | undefined = $state();

    // Hoisted pending-close state so openMenu() can cancel a stale deferred close.
    let pendingCloseTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let pendingFinish: ((event: TransitionEvent) => void) | undefined;

    function cancelPendingClose(): void {
        if (pendingCloseTimeoutId !== undefined) {
            clearTimeout(pendingCloseTimeoutId);
            pendingCloseTimeoutId = undefined;
        }
        if (pendingFinish) {
            dialogElement?.removeEventListener('transitionend', pendingFinish);
            pendingFinish = undefined;
        }
    }

    function openMenu(): void {
        if (!dialogElement) return;
        cancelPendingClose();
        dialogElement.show();
        // Force synchronous reflow so the browser computes the initial clip-path
        // before isOpen triggers the transition. Removing this breaks the animation.
        void dialogElement.offsetHeight;
        isOpen = true;
        trackMobileMenuOpened();
    }

    function closeMenu(skipFocusRestore = false): void {
        if (!dialogElement) return;
        cancelPendingClose();
        isOpen = false;

        const transitionEndHandler = (event: TransitionEvent): void => {
            if (event.target === dialogElement && event.propertyName === 'clip-path') {
                finish();
            }
        };

        const finish = (): void => {
            if (pendingCloseTimeoutId !== undefined) {
                clearTimeout(pendingCloseTimeoutId);
                pendingCloseTimeoutId = undefined;
            }
            dialogElement?.removeEventListener('transitionend', transitionEndHandler);
            pendingFinish = undefined;
            dialogElement?.close();
            if (!skipFocusRestore) {
                menuButtonElement?.focus({ preventScroll: true });
            }
        };

        pendingFinish = transitionEndHandler;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            finish();
        } else {
            dialogElement.addEventListener('transitionend', transitionEndHandler);
            pendingCloseTimeoutId = setTimeout(finish, 400);
        }
    }

    function toggleMenu(): void {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function handleMenuClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (target.closest('a')) {
            closeMenu(true);
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

        return undefined;
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

        return undefined;
    });

    // Custom focus trap that includes menuButtonElement (outside the dialog) in the
    // tab cycle, so users can keyboard-close via the toggle button. Native showModal()
    // focus trapping would exclude it, which is why we use show() + this manual trap.
    $effect(() => {
        if (isOpen && dialogElement && menuButtonElement) {
            const focusableSelector =
                'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

            const handleFocusTrap = (event: KeyboardEvent): void => {
                if (event.key !== 'Tab') return;

                const focusable = [
                    menuButtonElement!,
                    ...Array.from(dialogElement!.querySelectorAll<HTMLElement>(focusableSelector)),
                ];

                if (focusable.length === 0) return;

                const first = focusable[0]!;
                const last = focusable[focusable.length - 1]!;
                const active = document.activeElement as HTMLElement;

                if (event.shiftKey && active === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && active === last) {
                    event.preventDefault();
                    first.focus();
                }
            };

            document.addEventListener('keydown', handleFocusTrap);

            return () => {
                document.removeEventListener('keydown', handleFocusTrap);
            };
        }

        return undefined;
    });

    $effect(() => {
        const mql = window.matchMedia('(min-width: 768px)');

        const handler = (e: MediaQueryListEvent): void => {
            if (e.matches && isOpen) {
                closeMenu();
            }
        };

        mql.addEventListener('change', handler);

        return () => {
            mql.removeEventListener('change', handler);
        };
    });
</script>

<div class="mobile-menu-container">
    <button
        bind:this={menuButtonElement}
        type="button"
        class="menu-button"
        class:is-open={isOpen}
        aria-label={isOpen ? t.a11y.closeMenu : t.a11y.openMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onclick={toggleMenu}
    >
        <svg {...svgProps}>
            <rect x="6" y="6" width="12" height="3" class="menu-icon-bar" />
            <rect x="6" y={isOpen ? '6' : '10.5'} width="12" height="3" class="menu-icon-bar" />
            <rect x="6" y={isOpen ? '6' : '15'} width="12" height="3" class="menu-icon-bar" />
        </svg>
    </button>

    <div class="menu-dimmer" class:is-open={isOpen} onclick={closeMenu} aria-hidden="true"></div>

    <dialog
        bind:this={dialogElement}
        id="mobile-menu"
        class="menu-panel"
        class:is-open={isOpen}
        onclick={handleMenuClick}
        aria-hidden={!isOpen}
        inert={!isOpen || undefined}
    >
        <nav aria-label={t.a11y.mainNavigation}>
            {#if children}
                {@render children()}
            {/if}
        </nav>
    </dialog>
</div>

<style>
    @reference "../../styles/global.css";

    .mobile-menu-container {
        @apply h-6 w-6;
    }

    .menu-button {
        @apply cursor-pointer;
        @apply bg-text-primary text-text-secondary;
        @apply md:hidden;

        & .menu-icon-bar {
            @apply motion-safe:duration-333 motion-safe:transition-all motion-safe:ease-in;
        }

        &.is-open .menu-icon-bar {
            @apply motion-safe:ease-out;
        }
    }

    .menu-dimmer {
        --color-menu-dimmer-bg: color-mix(in srgb, #a1a1aa 80%, transparent); /* zinc.400 */

        @apply pointer-events-none fixed inset-x-0 bottom-0 top-12 opacity-0;
        @apply motion-safe:duration-333 motion-safe:transition-opacity motion-safe:ease-in md:hidden;
        @apply bg-(--color-menu-dimmer-bg);

        &.is-open {
            @apply pointer-events-auto opacity-100;
            @apply motion-safe:ease-out;
        }
    }

    @media (prefers-color-scheme: dark) {
        .menu-dimmer {
            --color-menu-dimmer-bg: color-mix(in srgb, #3f3f46 80%, transparent); /* zinc.700 */
        }
    }

    .menu-panel {
        @apply m-0 max-h-none max-w-none border-none bg-transparent p-0;
        @apply pointer-events-none fixed left-1/2 top-0 z-mobile-menu w-screen -translate-x-1/2 pt-12;
        @apply bg-page-bg;
        @apply motion-safe:duration-333 motion-safe:transition-[clip-path] motion-safe:ease-in;
        @apply md:hidden;
        @apply [clip-path:inset(36px_0_100%_0)];

        &.is-open {
            @apply pointer-events-auto translate-y-0;
            @apply motion-safe:ease-out;
            @apply [clip-path:inset(36px_0_0_0)];
        }
    }
</style>
