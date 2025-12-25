import { atom } from 'nanostores';
import type { Locale } from '@type/locale';
import { defaultLocale } from '@i18n/config';

export const $currentLocale = atom<Locale>(defaultLocale);

export const setLocale = (locale: Locale): void => {
  $currentLocale.set(locale);
};

export const getLocale = (): Locale => {
  return $currentLocale.get();
};
