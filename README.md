# Ambilab Website

Bilingual marketing website and news for Ambilab.

## Run

```bash
pnpm install
pnpm dev
```

## Testing

- **Unit tests** (Vitest): `pnpm test` or `pnpm test:run`
- **E2E tests** (Playwright): `pnpm build && pnpm test:e2e`
- **Translation validation**: `pnpm validate:translations`

## Performance monitoring

Lighthouse CI is configured in [`.lighthouserc.json`](.lighthouserc.json) with performance budgets.

```bash
# Run Lighthouse CI locally
pnpm build
pnpm lhci autorun
```

Performance budgets enforce:

- Performance score ≥ 90
- Accessibility score ≥ 95
- SEO score ≥ 95
- FCP ≤ 2 s, LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 300 ms
- Script budget 150 KB, stylesheet 50 KB, images 300 KB, fonts 100 KB, total 600 KB

## HTTP caching strategy

Cloudflare Pages serves all static assets. The caching behavior is:

- **Immutable static assets** (`/_astro/*`, `/fonts/*`): Astro appends a content hash to filenames. Cloudflare sets
  `Cache-Control: public, max-age=31536000, immutable`. Safe to cache forever because any content change produces a new
  hash.
- **HTML pages**: Served with `Cache-Control: public, max-age=0, must-revalidate` so browsers always revalidate with the
  CDN. Cloudflare still caches at the edge and serves from cache when the page has not changed.
- **Service worker / manifest**: Short cache (`max-age=0`) to ensure updates propagate immediately.

No custom `_headers` file is required; Cloudflare Pages applies sensible defaults for the asset types above.

## Security notes

See [`docs/deployment.md`](docs/deployment.md).

## Fonts

Departure Mono is licensed under the [SIL Open Font License, Version 1.1](public/fonts/DepartureMono-LICENSE.txt).

## License

Copyright 2024–2026 Ambilab. All rights reserved.
