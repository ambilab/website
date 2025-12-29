<script lang="ts">
    import { localeConfigs } from '@i18n/config';
    import { setLocaleCookie } from '@i18n/utils';
    import type { Locale } from '@type/locale';
    import { createLogger } from '@utils/logger';
    import { navigate } from 'astro:transitions/client';

    const logger = createLogger({ prefix: 'LocaleSwitcher' });

    interface Props {
        currentLocale: Locale;
    }

    let { currentLocale }: Props = $props();

    let isAnimating = $state(false);

    const otherLocale = $derived<Locale>(currentLocale === 'en' ? 'cs' : 'en');
    const otherConfig = $derived(localeConfigs[otherLocale]);

    const handleLocaleSwitch = async () => {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        try {
            // Set locale cookie
            document.cookie = setLocaleCookie(otherLocale);

            // Use Astro's navigate function to trigger View Transitions
            await navigate(window.location.pathname);
        } catch (error) {
            logger.error('Failed to switch locale', error);
            isAnimating = false;
        }
    };
</script>

<button
    onclick={handleLocaleSwitch}
    disabled={isAnimating}
    class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800"
    aria-label="Switch language"
>
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            stroke-width="1.5"
        />
        <path
            d="M8 3H9.5C9.5 9.5 6.5 15.5 2 18.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M16 3H14.5C14.5 9.5 17.5 15.5 22 18.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3 16V14.5C9.5 14.5 15.5 17.5 18.5 22"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3 9V10.5C9.5 10.5 15.5 7.5 18.5 2.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
    <span>{otherConfig.flag} {otherConfig.name}</span>
</button>
