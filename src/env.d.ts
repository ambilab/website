/// <reference types="astro/client" />

import type { Locale } from '@type/locale';

declare module '*?raw' {
    const content: string;
    export default content;
}

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
            // Set by middleware; always present for server-rendered routes.
            locale: Locale;

            // CSP nonce from middleware; always present for security headers.
            nonce: string;
        }
    }
}
