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

export const ICON_MAP = {
    user: userIcon,
    calendar: calendarIcon,
    refresh: refreshIcon,
    clock: clockIcon,
    tag: tagIcon,
    pixelHeart: pixelHeartIcon,
    x: xIcon,
    threads: threadsIcon,
    instagram: instagramIcon,
    linkedin: linkedinIcon,
    mastodon: mastodonIcon,
    bluesky: blueskyIcon,
    github: githubIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;
