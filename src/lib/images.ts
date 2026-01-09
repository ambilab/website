/**
 * Responsive image breakpoints in pixels.
 *
 * Internal constant used by getResponsiveSizes to generate responsive sizes strings.
 * Matches the Tailwind CSS breakpoint system.
 */
const IMAGE_BREAKPOINTS = {
    sm: 640, // Mobile
    md: 768, // Tablet
    lg: 1024, // Small desktop
    xl: 1280, // Desktop
    '2xl': 1536, // Large desktop
} as const;

/**
 * Generates a responsive sizes attribute for images.
 *
 * Returns a default sizes string optimized for common
 * viewport widths if no custom sizes are provided.
 *
 * The default assumes images scale from full width
 * on mobile to a maximum of 1200px on large screens.
 *
 * @param sizes - Optional custom sizes attribute string
 * @returns The sizes attribute value for responsive images
 */
export const getResponsiveSizes = (sizes?: string): string => {
    return (
        sizes ||
        `(max-width: ${IMAGE_BREAKPOINTS.sm}px) 100vw, (max-width: ${IMAGE_BREAKPOINTS.md}px) 90vw, (max-width: ${IMAGE_BREAKPOINTS.lg}px) 80vw, 1200px`
    );
};
