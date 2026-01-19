const IMAGE_BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

const DEFAULT_RESPONSIVE_SIZES = `(max-width: ${IMAGE_BREAKPOINTS.sm}px) 100vw, (max-width: ${IMAGE_BREAKPOINTS.md}px) 90vw, (max-width: ${IMAGE_BREAKPOINTS.lg}px) 80vw, 1200px`;

export const getResponsiveSizes = (sizes?: string): string => {
    const normalized = sizes?.trim();

    return normalized ? normalized : DEFAULT_RESPONSIVE_SIZES;
};
