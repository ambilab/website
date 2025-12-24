/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { Locale } from '@type/locale';

interface ImportMetaEnv {
  readonly BUTTONDOWN_API_KEY?: string;
}

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
