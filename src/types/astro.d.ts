/**
 * Astro namespace augmentation for project-specific types.
 */

declare namespace App {
    interface Locals {
        locale: 'en' | 'cs';
        nonce: string;
    }
}
