import calendarIcon from '@assets/icons/calendar.svg?raw';
import clockIcon from '@assets/icons/clock.svg?raw';
import pixelHeartIcon from '@assets/icons/pixel-heart.svg?raw';
import refreshIcon from '@assets/icons/refresh.svg?raw';
import tagIcon from '@assets/icons/tag.svg?raw';
import userIcon from '@assets/icons/user.svg?raw';

export const iconMap = {
    user: userIcon,
    calendar: calendarIcon,
    refresh: refreshIcon,
    clock: clockIcon,
    tag: tagIcon,
    'pixel-heart': pixelHeartIcon,
} as const;

export type IconName = keyof typeof iconMap;
