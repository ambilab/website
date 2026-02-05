/// <reference types="astro/client" />

import '@type/astro';

declare module '*?raw' {
    const content: string;
    export default content;
}

interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly PUBLIC_PLAUSIBLE_SCRIPT_COM?: string;
    readonly PUBLIC_PLAUSIBLE_SCRIPT_CZ?: string;
    readonly NODE_ENV?: 'development' | 'production' | 'test';

    // Allow additional env vars at runtime
    [key: string]: string | boolean | undefined;
}

// biome-ignore lint/correctness/noUnusedVariables: Required by Astro for type augmentation
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
