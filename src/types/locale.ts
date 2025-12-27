export type Locale = 'en' | 'cs';

export interface LocaleConfig {
    code: Locale;
    name: string;
    flag: string;
}

export interface TranslationLink {
    locale: Locale;
    slug: string;
    url: string;
}
