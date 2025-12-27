export const imageBreakpoints = {
    sm: 640, // Mobile
    md: 768, // Tablet
    lg: 1024, // Small desktop
    xl: 1280, // Desktop
    '2xl': 1536, // Large desktop
} as const;

export const imageFormats = ['avif', 'webp'] as const;
export const fallbackFormat = 'png' as const;

export type ImageFormat = (typeof imageFormats)[number] | typeof fallbackFormat;

export const getResponsiveSizes = (sizes?: string): string => {
    return (
        sizes ||
        `(max-width: ${imageBreakpoints.sm}px) 100vw, (max-width: ${imageBreakpoints.md}px) 90vw, (max-width: ${imageBreakpoints.lg}px) 80vw, 1200px`
    );
};
