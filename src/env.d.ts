/// <reference types="astro/client" />

import type { Locale } from '@type/locale';

// Type definition for Vite's ?raw import suffix
declare module '*?raw' {
    const content: string;
    export default content;
}

/**
 * Interface representing environment variables
 * available during development and build time.
 */
interface ImportMetaEnv {
    /**
     * The API key for Buttondown, used for
     * newsletter subscriptions and management.
     */
    readonly BUTTONDOWN_API_KEY?: string;
}

/**
 * Interface representing the metadata environment,
 * including the environment variables.
 */
// biome-ignore lint/correctness/noUnusedVariables: Required by Astro for type augmentation
interface ImportMeta {
    /**
     * The metadata environment containing environment variables.
     */
    readonly env: ImportMetaEnv;
}

/**
 * Global namespace for application-specific types and interfaces.
 */
declare global {
    namespace App {
        interface Locals {
            /**
             * The current locale for the application.
             */
            locale: Locale;

            /**
             * A nonce value for content security policies.
             */
            nonce: string;
        }
    }
}
