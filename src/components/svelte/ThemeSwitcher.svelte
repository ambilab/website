<script lang="ts">
    /**
     * ThemeSwitcher Component
     *
     * Toggle button for switching between light and dark themes.
     *
     * Syncs with system preferences when no user preference is set
     * and persists user choices in localStorage.
     *
     * Features:
     * - Toggles between light and dark themes with pixel art icons
     * - Syncs with system preference when no user preference exists
     * - Persists theme choice in localStorage
     * - Listens for system theme changes and updates accordingly
     * - Smooth opacity transition on mount to prevent flash
     * - Accessible with ARIA labels and dynamic title
     * - Icon changes based on current theme (sun for light, moon for dark)
     * - Consistent styling with other header controls (uppercase, hover states)
     *
     * Icons:
     * - This component uses inline SVG markup for theme icons in pixel art style.
     * - Unlike Astro components which use the centralized icon system (Icon.astro),
     *   Svelte components in this project inline their SVG markup directly.
     * - Icons are rendered with currentColor for automatic theme color support.
     *
     * Theme Application:
     * - Light mode: No 'dark' class on <html>
     * - Dark mode: 'dark' class added to <html>
     * - System preference: Used when localStorage has no 'theme' value
     *
     * Styling:
     * - Uses semantic color tokens (text-secondary, text-primary)
     * - Includes hover and focus states for accessibility
     * - Has negative right margin (-mr-[6px]) for optical alignment
     *
     * @component
     * @example
     * ```astro
     * <ThemeSwitcher client:load />
     * ```
     */
    import { toggleDarkMode } from '@utils/dom';
    import { createLogger } from '@utils/logger';

    const logger = createLogger({ prefix: 'ThemeSwitcher' });

    /**
     * Common SVG attributes for both theme icons.
     * Extracted to reduce duplication and ensure consistency.
     */
    const svgProps = {
        width: 24,
        height: 24,
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
    } as const;

    /** Current theme state ('light' or 'dark'). */
    let currentTheme = $state<'light' | 'dark'>('light');

    /** Whether the component has mounted and synced with DOM. */
    let mounted = $state(false);

    /**
     * Updates the currentTheme state from the DOM.
     *
     * Checks if the 'dark' class is present on document.documentElement
     * to determine the current theme.
     *
     * This ensures the component state matches the actual DOM state.
     */
    const updateTheme = () => {
        // Check the actual class on the element, not system preference
        if (typeof document !== 'undefined' && document.documentElement) {
            currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
    };

    /**
     * Handles theme toggle button click.
     *
     * Toggles the dark mode class on the document element,
     * updates the component state, and logs the action.
     *
     * Handles errors gracefully.
     */
    const handleThemeToggle = () => {
        try {
            toggleDarkMode();
            updateTheme();
            logger.info(`Theme toggled to ${currentTheme}`);
        } catch (error) {
            logger.error('Failed to toggle theme', error);
        }
    };

    /**
     * Effect to initialize theme and listen for system preference changes.
     *
     * Runs only in the browser environment.
     *
     * Syncs theme state from DOM on mount,
     * then listens for system theme changes.
     *
     * Only updates from system preference
     * if no user preference exists in localStorage.
     */
    $effect(() => {
        // Run only in a browser environment
        if (typeof window === 'undefined') {
            return;
        }

        // Immediately sync theme state from DOM
        updateTheme();
        mounted = true;

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        /**
         * Handles system theme preference changes.
         *
         * Only updates if user hasn't set a manual preference (no theme in localStorage).
         * When system preference changes, directly updates the DOM and component state
         * to reflect the new theme without requiring a page reload.
         */
        const handleChange = () => {
            // Only update if user hasn't set a preference (no theme in localStorage)
            if (!localStorage.getItem('theme')) {
                const prefersDark = mediaQuery.matches;

                if (document?.documentElement) {
                    document.documentElement.classList.toggle('dark', prefersDark);
                }

                currentTheme = prefersDark ? 'dark' : 'light';
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        // Cleanup listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    });
</script>

<button
    onclick={handleThemeToggle}
    class="[&:hover,&:focus]:text-text-primary dark:[&:hover,&:focus]:text-text-primary-dark -mr-[6px] flex cursor-pointer items-center text-text-secondary dark:text-text-secondary-dark"
    class:opacity-0={!mounted}
    class:opacity-100={mounted}
    aria-label="Toggle theme"
    title={currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
    {#if currentTheme === 'dark'}
        <!-- Moon icon for dark mode (pixel art style) -->
        <svg {...svgProps}>
            <path
                d="M13.5,9 L13.5,10.5 L15,10.5 L15,13.5 L13.5,13.5 L13.5,15 L10.5,15 L10.5,13.5 L9,13.5 L9,10.5 L10.5,10.5 L10.5,9 L13.5,9 Z M6,6 L8,6 L8,8 L6,8 Z M11,4 L13,4 L13,6 L11,6 Z M11,18 L13,18 L13,20 L11,20 Z M4,11 L6,11 L6,13 L4,13 Z M18,11 L20,11 L20,13 L18,13 Z M16,6 L18,6 L18,8 L16,8 Z M16,16 L18,16 L18,18 L16,18 Z M6,16 L8,16 L8,18 L6,18 Z"
                fill="currentColor"
            ></path>
        </svg>
    {:else}
        <!-- Sun icon for light mode (pixel art style) -->
        <svg {...svgProps}>
            <polygon
                points="17 11 17 13 16 13 16 15 15 15 15 16 13 16 13 17 11 17 11 16 9 16 9 15 8 15 8 13 7 13 7 11 8 11 8 9 9 9 9 8 11 8 11 7 13 7 13 8 12 8 12 10 13 10 13 11 14 11 14 12 16 12 16 11"
                fill="currentColor"
            ></polygon>
        </svg>
    {/if}
</button>
