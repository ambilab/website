<script lang="ts">
    import { LOCALE_CONFIGS } from '@i18n/config';
    import { setLocaleCookie } from '@i18n/utils';
    import type { Locale } from '@type/locale';
    import { createLogger } from '@utils/logger';
    import { navigate } from 'astro:transitions/client';

    const logger = createLogger({ prefix: 'LocaleSwitcher' });

    interface Props {
        currentLocale: Locale;
        translationPath?: string | undefined;
    }

    let { currentLocale, translationPath }: Props = $props();

    let isAnimating = $state(false);

    const otherLocale = $derived<Locale>(currentLocale === 'en' ? 'cs' : 'en');
    const otherConfig = $derived(LOCALE_CONFIGS[otherLocale]);

    const handleLocaleSwitch = async () => {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        try {
            // Set locale cookie
            document.cookie = setLocaleCookie(otherLocale);

            // Use translation path if available, otherwise stay on current path
            const targetPath = translationPath || window.location.pathname;

            // Use Astro's navigate function to trigger View Transitions
            await navigate(targetPath);
        } catch (error) {
            logger.error('Failed to switch locale', error);
            isAnimating = false;
        }
    };
</script>

<button
    onclick={handleLocaleSwitch}
    disabled={isAnimating}
    class="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-surface-hover disabled:opacity-50 dark:hover:bg-surface-hover-dark"
    aria-label="Switch language"
>
    <span>&rarr; {otherConfig.name}</span>
</button>
