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
        'focus:ring-offset-page-bg focus:ring-focus-ring';

    // Outline border thickness: 1px for sm, 2px for md
    const outlineBorder = $derived(
        size === 'sm'
            ? [
                  'shadow-[inset_0_0_0_1px_var(--color-button-outline-border)]',
                  '[&:hover,&:focus]:shadow-[inset_0_0_0_1px_var(--color-button-outline-border-hover)]',
              ].join(' ')
            : [
                  'shadow-[inset_0_0_0_2px_var(--color-button-outline-border)]',
                  '[&:hover,&:focus]:shadow-[inset_0_0_0_2px_var(--color-button-outline-border-hover)]',
              ].join(' '),
    );

    const variantClasses = $derived({
        primary: [
            'bg-[var(--color-button-primary-bg)]',
            '[&:hover,&:focus]:bg-[var(--color-button-primary-bg-hover)]',
            'text-[var(--color-button-primary-text)]',
            '[&:hover,&:focus]:text-[var(--color-button-primary-text-hover)]',
        ].join(' '),
        secondary: [
            'bg-[var(--color-button-secondary-bg)]',
            '[&:hover,&:focus]:bg-[var(--color-button-secondary-bg-hover)]',
            'text-[var(--color-button-secondary-text)]',
            '[&:hover,&:focus]:text-[var(--color-button-secondary-text-hover)]',
        ].join(' '),
        outline: [
            'bg-[var(--color-button-outline-bg)]',
            '[&:hover,&:focus]:bg-[var(--color-button-outline-bg-hover)]',
            'text-[var(--color-button-outline-text)]',
            '[&:hover,&:focus]:text-[var(--color-button-outline-text-hover)]',
            outlineBorder,
        ].join(' '),
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
