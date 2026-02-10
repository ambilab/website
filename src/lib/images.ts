const IMAGE_BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

/**
 * Default responsive sizes with aggressive mobile/tablet optimization.
 * Mobile (<640px): full viewport; Small tablet (640-768px): 95vw; Tablet (768-1024px): 85vw;
 * Desktop (1024-1280px): 75vw; Large desktop: 1200px max.
 */
const DEFAULT_RESPONSIVE_SIZES = `(max-width: ${IMAGE_BREAKPOINTS.sm}px) 100vw, (max-width: ${IMAGE_BREAKPOINTS.md}px) 95vw, (max-width: ${IMAGE_BREAKPOINTS.lg}px) 85vw, (max-width: ${IMAGE_BREAKPOINTS.xl}px) 75vw, 1200px`;

export const getResponsiveSizes = (sizes?: string): string => {
    const normalized = sizes?.trim();

    return normalized ? normalized : DEFAULT_RESPONSIVE_SIZES;
};
