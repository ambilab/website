<script lang="ts">
    import { LOCALE_CONFIGS } from '@i18n/config';
    import { getTranslation } from '@i18n/translations';
    import { getTranslationLocale, setLocaleCookie } from '@i18n/utils';
    import type { Locale } from '@type/locale';
    import { trackLanguageSwitch } from '@utils/analytics';
    import { createLogger } from '@utils/logger';
    import { navigate } from 'astro:transitions/client';

    const logger = createLogger({ prefix: 'LocaleSwitcher' });

    interface Props {
        currentLocale: Locale;
        translationPath?: string | undefined;
    }

    let { currentLocale, translationPath }: Props = $props();

    const t = $derived(getTranslation(currentLocale));

    let isAnimating = $state(false);

    const otherLocale = $derived<Locale>(getTranslationLocale(currentLocale));

    const otherConfig = $derived(LOCALE_CONFIGS[otherLocale]);

    const handleLocaleSwitch = async (): Promise<void> => {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        try {
            document.cookie = setLocaleCookie(otherLocale);
            trackLanguageSwitch(currentLocale, otherLocale, !!translationPath);

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
    class="meta locale-switcher"
    aria-label={t.a11y.switchLanguage}
>
    <span>&rarr; {otherConfig.name}</span>
</button>

<style>
    @reference "../../styles/global.css";

    .locale-switcher {
        @apply flex cursor-pointer items-center;
        @apply px-2 py-[6px];
        @apply text-text-secondary;
        @apply hover:bg-active hover:text-text-primary;
        @apply focus:bg-active focus:text-text-primary;
        @apply disabled:opacity-50;
    }
</style>
