/**
 * Icon Map Configuration
 *
 * Centralized mapping of icon names to their SVG content.
 *
 * Icons are imported as raw SVG strings using Vite's ?raw suffix,
 * allowing them to be injected directly into the DOM via set:html.
 *
 * All icons are located in src/assets/icons/ and should be added
 * to this map to be available via the Icon component.
 */
import blueskyIcon from '@assets/icons/bluesky.svg?raw';
import calendarIcon from '@assets/icons/calendar.svg?raw';
import clockIcon from '@assets/icons/clock.svg?raw';
import githubIcon from '@assets/icons/github.svg?raw';
import instagramIcon from '@assets/icons/instagram.svg?raw';
import linkedinIcon from '@assets/icons/linkedin.svg?raw';
import mastodonIcon from '@assets/icons/mastodon.svg?raw';
import pixelHeartIcon from '@assets/icons/pixel-heart.svg?raw';
import refreshIcon from '@assets/icons/refresh.svg?raw';
import tagIcon from '@assets/icons/tag.svg?raw';
import threadsIcon from '@assets/icons/threads.svg?raw';
import userIcon from '@assets/icons/user.svg?raw';
import xIcon from '@assets/icons/x.svg?raw';

/**
 * Map of icon names to their SVG content.
 *
 * Keys are icon identifiers used by the Icon
 * component; values are raw SVG strings.
 */
export const ICON_MAP = {
    /**
     * User/profile icon.
     */
    user: userIcon,

    /**
     * Calendar icon.
     */
    calendar: calendarIcon,

    /**
     * Refresh/reload icon.
     */
    refresh: refreshIcon,

    /**
     * Clock/time icon.
     */
    clock: clockIcon,

    /**
     * Tag/label icon.
     */
    tag: tagIcon,

    /**
     * Pixel art heart icon.
     */
    pixelHeart: pixelHeartIcon,

    /**
     * X social media icon.
     */
    x: xIcon,

    /**
     * Threads social media icon.
     */
    threads: threadsIcon,

    /**
     * Instagram social media icon.
     */
    instagram: instagramIcon,

    /**
     * LinkedIn social media icon.
     */
    linkedin: linkedinIcon,

    /**
     * Mastodon social media icon.
     */
    mastodon: mastodonIcon,

    /**
     * Bluesky social media icon.
     */
    bluesky: blueskyIcon,

    /**
     * GitHub social media icon.
     */
    github: githubIcon,
} as const;

/**
 * Type representing valid icon names.
 *
 * Automatically inferred from the keys of ICON_MAP,
 * ensuring type safety when using icons throughout the application.
 */
export type IconName = keyof typeof ICON_MAP;
