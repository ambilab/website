<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        variant?: 'primary'; // | 'secondary' | 'outline';
        size?: 'md'; // | 'sm' | 'lg';
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
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-page-bg dark:focus:ring-offset-page-bg-dark ' +
        'font-medium';

    const variantClasses = {
        primary:
            'bg-button-primary dark:bg-button-primary-dark hover:bg-button-primary-hover dark:hover:bg-button-primary-hover-dark ' +
            'focus:ring-focus-ring dark:focus:ring-focus-ring-dark ' +
            'text-button-primary-text dark:text-button-primary-text-dark',
        // TODO: secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-link dark:focus:ring-link-dark',
        // TODO: outline: 'border-2 border-link text-link hover:bg-surface-hover focus:ring-link dark:text-link-dark dark:hover:bg-surface-hover-dark dark:focus:ring-link-dark',
    };

    const sizeClasses = {
        md: 'px-4 py-2 text-base',
        // TODO: sm: 'px-3 py-1.5 text-sm',
        // TODO: lg: 'px-6 py-3 text-lg',
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
