export const COMPONENT_CONFIG = {
  goToTop: {
    showAfterScroll: 300, // pixels
    animationDuration: 300, // ms
  },
  cookieBanner: {
    dismissedKey: 'cookie-banner-dismissed',
    autoHideDelay: 0, // 0 = no auto-hide
  },
  typewriter: {
    duration: 0.5, // seconds per character block
    stagger: 0.1, // delay between elements
    ease: 'none',
  },
} as const;

