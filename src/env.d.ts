/// <reference types="astro/client" />

import type { Locale } from '@type/locale';

interface ImportMetaEnv {
    readonly BUTTONDOWN_API_KEY?: string;
}

// biome-ignore lint/correctness/noUnusedVariables: Required by Astro for type augmentation
interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    namespace App {
        interface Locals {
            locale: Locale;
            nonce: string;
        }
    }
}
