<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        variant?: 'primary' | 'secondary' | 'outline';
        size?: 'md' | 'sm';
        href?: string;
        target?: string;
        rel?: string;
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        class?: string;
        onclick?: (ev: MouseEvent) => void;
        children?: Snippet;
        'data-testid'?: string;
    }

    let {
        variant = 'primary',
        size = 'md',
        href,
        target,
        rel,
        type = 'button',
        disabled = false,
        class: className = '',
        onclick,
        children,
        'data-testid': dataTestId,
    }: Props = $props();

    function handleClick(ev: MouseEvent): void {
        onclick?.(ev);
    }

    // Compute safe rel value to protect against reverse-tabnabbing when target="_blank"
    const safeRel = $derived.by(() => {
        // If no target or target is not _blank, use rel as-is
        if (!target || target !== '_blank') {
            return rel;
        }

        // Parse existing rel tokens
        const relTokens = rel ? rel.trim().split(/\s+/) : [];

        // Check if security tokens are already present
        const hasNoopener = relTokens.includes('noopener');
        const hasNoreferrer = relTokens.includes('noreferrer');

        // Add missing security tokens
        if (!hasNoopener) {
            relTokens.push('noopener');
        }
        if (!hasNoreferrer) {
            relTokens.push('noreferrer');
        }

        return relTokens.join(' ');
    });

    const baseClasses =
        'button select-none inline-flex items-center justify-center ' +
        'disabled:opacity-50 disabled:pointer-events-none ' +
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ' +
        'focus-visible:ring-offset-page-bg focus-visible:ring-focus-ring';

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
            'bg-(--color-button-primary-bg)',
            '[&:hover,&:focus]:bg-(--color-button-primary-bg-hover)',
            'text-(--color-button-primary-text)',
            '[&:hover,&:focus]:text-(--color-button-primary-text-hover)',
        ].join(' '),
        secondary: [
            'bg-(--color-button-secondary-bg)',
            '[&:hover,&:focus]:bg-(--color-button-secondary-bg-hover)',
            'text-(--color-button-secondary-text)',
            '[&:hover,&:focus]:text-(--color-button-secondary-text-hover)',
        ].join(' '),
        outline: [
            'bg-(--color-button-outline-bg)',
            '[&:hover,&:focus]:bg-(--color-button-outline-bg-hover)',
            'text-(--color-button-outline-text)',
            '[&:hover,&:focus]:text-(--color-button-outline-text-hover)',
            outlineBorder,
        ].join(' '),
    });

    const sizeClasses = {
        md: 'px-4 pt-2 pb-[9px] font-medium uppercase text-sm',
        sm: 'meta px-2 py-[6px]',
    };

    const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`);
</script>

{#if href}
    <a {href} {target} rel={safeRel} class={classes} onclick={handleClick} data-testid={dataTestId}>
        {@render children?.()}
    </a>
{:else}
    <button {type} {disabled} class={classes} onclick={handleClick} data-testid={dataTestId}>
        {@render children?.()}
    </button>
{/if}
