<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        variant?: 'primary' | 'secondary' | 'outline';
        size?: 'md' | 'sm';
        href?: string;
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        class?: string;
        onclick?: (ev: MouseEvent) => void;
        children?: Snippet;
    }

    let {
        variant = 'primary',
        size = 'md',
        href,
        type = 'button',
        disabled = false,
        class: className = '',
        onclick,
        children,
    }: Props = $props();

    const baseClasses =
        'inline-flex items-center justify-center ' +
        'disabled:opacity-50 disabled:pointer-events-none ' +
        'focus:outline-none focus:ring-4 focus:ring-offset-2 ' +
        'focus:ring-offset-page-bg dark:focus:ring-offset-page-bg-dark ' +
        'focus:ring-focus-ring dark:focus:ring-focus-ring-dark';

    // Helper to build variant classes with consistent pattern
    function buildVariantClasses(name: string): string {
        return [
            `bg-button-${name}-bg dark:bg-button-${name}-bg-dark`,
            `[&:hover,&:focus]:bg-button-${name}-bg-hover dark:[&:hover,&:focus]:bg-button-${name}-bg-hover-dark`,
            `text-button-${name}-text dark:text-button-${name}-text-dark`,
            `[&:hover,&:focus]:text-button-${name}-text-hover dark:[&:hover,&:focus]:text-button-${name}-text-hover-dark`,
        ].join(' ');
    }

    // Outline border thickness: 1px for sm, 2px for md
    const outlineBorder = $derived(
        size === 'sm'
            ? [
                  'shadow-[inset_0_0_0_1px_var(--color-button-outline-border)]',
                  'dark:shadow-[inset_0_0_0_1px_var(--color-button-outline-border-dark)]',
                  '[&:hover,&:focus]:shadow-[inset_0_0_0_1px_var(--color-button-outline-border-hover)]',
                  'dark:[&:hover,&:focus]:shadow-[inset_0_0_0_1px_var(--color-button-outline-border-hover-dark)]',
              ].join(' ')
            : [
                  'shadow-[inset_0_0_0_2px_var(--color-button-outline-border)]',
                  'dark:shadow-[inset_0_0_0_2px_var(--color-button-outline-border-dark)]',
                  '[&:hover,&:focus]:shadow-[inset_0_0_0_2px_var(--color-button-outline-border-hover)]',
                  'dark:[&:hover,&:focus]:shadow-[inset_0_0_0_2px_var(--color-button-outline-border-hover-dark)]',
              ].join(' '),
    );

    const variantClasses = $derived({
        primary: buildVariantClasses('primary'),
        secondary: buildVariantClasses('secondary'),
        outline: `${buildVariantClasses('outline')} ${outlineBorder}`,
    });

    const sizeClasses = {
        md: 'px-4 pt-2 pb-[9px] font-medium uppercase text-sm',
        sm: 'px-2 pb-[4px] pt-[3.5px] font-mono text-[11px] uppercase antialiased',
    };

    const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`);

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === ' ' || event.key === 'Spacebar' || event.code === 'Space') {
            event.preventDefault();
            (event.currentTarget as HTMLAnchorElement).click();
        }
    }
</script>

{#if href}
    <a {href} class={classes} role="button" onkeydown={handleKeydown} {onclick}>
        {@render children?.()}
    </a>
{:else}
    <button {type} {disabled} class={classes} {onclick}>
        {@render children?.()}
    </button>
{/if}
