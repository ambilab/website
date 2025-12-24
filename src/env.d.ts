/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BUTTONDOWN_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

