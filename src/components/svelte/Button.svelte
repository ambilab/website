<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        variant?: 'primary' | 'secondary' | 'outline';
        size?: 'sm' | 'md' | 'lg';
        href?: string;
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        class?: string;

        /**
         * Click event handler function. Called when the button is clicked.
         * @param onclick - Click event handler function
         */
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
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-page-bg dark:focus:ring-offset-page-bg-dark disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary:
            'bg-button-primary text-button-primary-text hover:bg-button-primary-hover dark:bg-button-primary-dark dark:text-button-primary-text-dark dark:hover:bg-button-primary-hover-dark focus:ring-link dark:focus:ring-link-dark',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-link dark:focus:ring-link-dark',
        outline:
            'border-2 border-link text-link hover:bg-surface-hover focus:ring-link dark:text-link-dark dark:hover:bg-surface-hover-dark dark:focus:ring-link-dark',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm rounded-md',
        md: 'px-4 py-2 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-lg',
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
    <a {href} class={classes} role="button" onkeydown={handleKeydown}>
        {@render children?.()}
    </a>
{:else}
    <button {type} {disabled} class={classes} {onclick}>
        {@render children?.()}
    </button>
{/if}
