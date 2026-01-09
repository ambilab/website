import { DEFAULT_LOCALE } from '@i18n/config';
import type { Locale } from '@type/locale';
import { atom } from 'nanostores';

export const $currentLocale = atom<Locale>(DEFAULT_LOCALE);

export const setLocale = (locale: Locale): void => {
    $currentLocale.set(locale);
};

export const getLocale = (): Locale => {
    return $currentLocale.get();
};
