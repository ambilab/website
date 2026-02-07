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

    const handleLocaleSwitch = async (): Promise<void> => {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        try {
            document.cookie = setLocaleCookie(otherLocale);

            const targetPath = translationPath || window.location.pathname;

            await navigate(targetPath);
        } catch (error) {
            logger.error('Failed to switch locale', error);
        } finally {
            isAnimating = false;
        }
    };
</script>

<button
    onclick={handleLocaleSwitch}
    disabled={isAnimating}
    class="[&:hover,&:focus]:text-text-primary [&:hover,&:focus]:bg-active flex cursor-pointer items-center px-2 pb-[4px] pt-[3.5px] uppercase text-text-secondary disabled:opacity-50"
    aria-label="Switch language"
>
    <span>&rarr; {otherConfig.name}</span>
</button>
