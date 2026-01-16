<script lang="ts">
    /**
     * Button Component
     *
     * A versatile button component that can render as
     * either a button or anchor element.
     *
     * Supports multiple variants, sizes, and accessibility
     * features, including keyboard navigation and focus management.
     *
     * Features:
     * - Multiple variants (primary, secondary, outline)
     * - Three size options (sm, md, lg)
     * - Can render as button or anchor link
     * - Keyboard accessibility (spacebar activation for links)
     * - Focus ring styling
     * - Disabled state support
     * - Dark mode support
     *
     * @component
     * @example
     * ```svelte
     * <Button variant="primary" size="md" onclick={handleClick}>
     *   Click me
     * </Button>
     *
     * <Button variant="outline" href="/about">About</Button>
     * ```
     */
    import type { Snippet } from 'svelte';

    /**
     * Props for the Button component.
     */
    interface Props {
        /**
         * Visual variant of the button.
         *
         * @default 'primary'
         */
        variant?: 'primary' | 'secondary' | 'outline';

        /**
         * Size of the button.
         *
         * @default 'md'
         */
        size?: 'sm' | 'md' | 'lg';

        /**
         * URL to navigate to when clicked.
         *
         * If provided, renders as an anchor element instead of a button.
         */
        href?: string;

        /**
         * Button type attribute.
         *
         * Only applies when rendered as a button element
         * (when href is not provided).
         *
         * @default 'button'
         */
        type?: 'button' | 'submit' | 'reset';

        /**
         * Whether the button is disabled.
         *
         * Only applies when rendered as a button element.
         *
         * @default false
         */
        disabled?: boolean;

        /**
         * Additional CSS classes to apply to the button element.
         */
        class?: string;

        /**
         * Click event handler function. Called when the button is clicked.
         */
        onclick?: (ev: MouseEvent) => void;

        /**
         * Button content rendered as a Svelte snippet.
         */
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
        'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-page-bg dark:focus:ring-offset-page-bg-dark disabled:opacity-50 disabled:cursor-not-allowed';

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
    <a {href} class={classes} role="button" onkeydown={handleKeydown} {onclick}>
        {@render children?.()}
    </a>
{:else}
    <button {type} {disabled} class={classes} {onclick}>
        {@render children?.()}
    </button>
{/if}
