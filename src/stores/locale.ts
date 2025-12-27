import { defaultLocale } from '@i18n/config';
import type { Locale } from '@type/locale';
import { atom } from 'nanostores';

export const $currentLocale = atom<Locale>(defaultLocale);

export const setLocale = (locale: Locale): void => {
    $currentLocale.set(locale);
};

export const getLocale = (): Locale => {
    return $currentLocale.get();
};
