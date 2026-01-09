/**
 * Site Configuration
 *
 * Centralized configuration for site-wide constants
 * including site metadata, URLs, and social media links.
 *
 * This is the single source of truth for site information
 * used across SEO, OpenGraph, and social sharing features.
 */
export const SITE = {
    NAME: 'Ambilab',
    DESCRIPTION: 'A web-based pixel art game engine and editor for kids to learn programming',
    URL: 'https://ambilab.com',
    AUTHOR: 'Ambilab',
    DEFAULT_OG_IMAGE: 'https://ambilab.com/og-default.png',

    SOCIAL: {
        X: 'https://x.com/ambilab',
        THREADS: 'https://threads.net/@ambilab_games',
        INSTAGRAM: 'https://instagram.com/ambilab_games',
        LINKEDIN: 'https://linkedin.com/company/ambilab',
        MASTODON: 'https://mastodon.gamedev.place/@ambilab',
        BLUESKY: 'https://bsky.app/profile/ambilab',
        GITHUB: 'https://github.com/ambilab',
    },
} as const;
