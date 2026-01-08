export type Locale = 'en' | 'cs';

export interface LocaleConfig {
    code: Locale;
    name: string;
}

export interface TranslationLink {
    locale: Locale;
    slug: string;
    url: string;
}
