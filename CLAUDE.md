# Project Rules

Bilingual (English/Czech) marketing website and news for Ambilab.

## Tech Stack

- **Node**: >= 20.0.0
- **Framework**: Astro 5 with SSR (Cloudflare adapter)
- **UI Components**: Svelte 5 (hydratable)
- **Styling**: Tailwind CSS 4 with custom theme and semantic design tokens
- **Language**: TypeScript (strict mode)
- **Content**: MDX via Astro Content Collections
- **Code Highlighting**: Expressive Code (Shiki-based)
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages
- **Linting**: Biome + ESLint + Prettier

## Critical Rules

- **No emoji** -- no emoji in code, commits, docs, or UI strings (no exceptions)
- **TypeScript strict mode** -- additionally enables `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `verbatimModuleSyntax`

## Project Structure

```text
website/
  public/                 # Static assets (favicons, OG images)
  scripts/                # Build/validation scripts (clean, lighthouse, content validation)
  src/
    components/
      astro/             # Astro-only components (server-rendered)
      svelte/            # Interactive Svelte components (hydratable)
    config/              # Site, security, component config
    content/
      news/              # News posts by locale (en/, cs/)
      pages/             # Static pages by locale
    i18n/                # Locale config, translations, utils
    lib/                 # Reusable libraries (images)
    pages/               # Astro pages and API routes
    scripts/             # Runtime utility scripts (validators)
    styles/              # Global and MDX styles
    types/               # TypeScript type definitions
    utils/               # Utility functions
    test/                # Test setup (Vitest)
    middleware.ts        # Locale detection, security headers
    env.d.ts             # Environment types
  tests/
    e2e/                 # Playwright E2E tests
```

## Development Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build (wrangler pages dev, port 4321)
pnpm lint             # Lint (Biome + ESLint)
pnpm lint:fix         # Auto-fix lint issues
pnpm format           # Format (Biome + Prettier)
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript + Astro type checking
pnpm test:run         # Unit tests (Vitest, single run)
pnpm test:coverage    # Unit tests with coverage report
pnpm test:e2e         # E2E tests (Playwright, requires prior build)
pnpm spellcheck       # Check spelling
pnpm knip             # Find unused exports
pnpm preflight        # ALL quality checks before committing
pnpm review:full      # Preflight + build + security audit
pnpm validate:content # Validate MDX content files
pnpm validate         # Run all validators (security, env, content, translations)
pnpm fix:all          # Auto-fix everything (format + lint + knip)
pnpm clean            # Clean build artifacts
pnpm security:audit   # Run security audit on dependencies

# Shortcuts and extras
pnpm check:quick      # Quick check (format + lint only)
pnpm knip:fix         # Auto-fix unused exports
pnpm test:ui          # Vitest interactive UI
pnpm perf             # Run Lighthouse performance audit
pnpm validate:all     # Full validation (preflight + validate + security)
```

## Environment Variables

Required env vars (see `.env.example`):

- `BUTTONDOWN_API_KEY` -- Buttondown newsletter API key
- `PUBLIC_PLAUSIBLE_SCRIPT_COM` -- Plausible analytics script URL for ambilab.com
- `PUBLIC_PLAUSIBLE_SCRIPT_CZ` -- Plausible analytics script URL for ambilab.cz

Set in Cloudflare Pages dashboard for production. Copy `.env.example` to `.env` for local development.

## Bilingual Content

Domain-based locale detection:

- `ambilab.com` -> English
- `ambilab.cz` -> Czech
- Localhost -> English (default)

Detection priority: cookie override -> domain/hostname -> default fallback (en).

Each MDX file links to its translation via frontmatter `translationSlug` field.

## Astro Components

Located in `src/components/astro/`. Server-rendered by default.

- Use `class:list` for composing classes (not template literals)
- Access locale from middleware: `const locale = Astro.locals.locale;`
- Svelte components imported into Astro need `client:*` directives for hydration

## Svelte 5 Components

Located in `src/components/svelte/`. Use Svelte 5 runes:

- `$props()` with `interface Props` for component props
- `$state()` for reactive state
- `$derived()` for simple reactive values, `$derived.by(() => ...)` for complex logic
- `$effect()` for side effects (but `onMount()` is still used in existing components)
- `Snippet` type from `svelte` for children slots, rendered with `{@render children?.()}`
- `transition:fade` etc. from `svelte/transition` for animations

### Canonical Examples

| Pattern                   | Reference File                                |
| ------------------------- | --------------------------------------------- |
| Astro layout component    | `src/components/astro/PageLayout.astro`       |
| Astro UI component        | `src/components/astro/Card.astro`             |
| Svelte 5 interactive      | `src/components/svelte/Button.svelte`         |
| Svelte form component     | `src/components/svelte/NewsletterForm.svelte` |
| API route                 | `src/pages/api/newsletter.ts`                 |
| Content collection config | `src/content/config.ts`                       |
| Middleware                | `src/middleware.ts`                           |
| i18n translations         | `src/i18n/translations.ts`                    |

## Content Collections

Schemas for `news` and `pages` collections defined in `src/content/config.ts`.

Adding content: create MDX files in both `src/content/news/en/` and `src/content/news/cs/`.

**News frontmatter:** `title`, `description`, `locale` (en|cs), `pubDate` (required); `translationSlug`, `updatedDate`,
`tags` (string[]), `draft` (boolean) (optional).

**Pages frontmatter:** `title`, `description`, `locale` (en|cs) (required); `translationSlug`, `menuTitle` (optional).

## Styling

### Semantic Design Tokens

Defined in `src/styles/global.css` using `@theme` and `.dark` selector, mapped in `tailwind.config.ts`.

Use single semantic classes (e.g., `text-primary`, `surface`, `border-default`) -- no `dark:` variants needed (CSS
variables auto-switch). See `src/styles/global.css` for the full token list.

### Responsive Strategy

Mobile-first. Standard Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:`
(1536px).

### Formatting Rules

Enforced by Biome (TS/JS/JSON/CSS) and Prettier (Astro/Svelte/Markdown):

- Four spaces indent (two for JSON/YAML/Markdown)
- 120 char line width, single quotes, always semicolons, always trailing commas

## TypeScript Conventions

### Path Aliases

| Alias           | Path                 |
| --------------- | -------------------- |
| `@/*`           | `./src/*`            |
| `@components/*` | `./src/components/*` |
| `@config/*`     | `./src/config/*`     |
| `@lib/*`        | `./src/lib/*`        |
| `@utils/*`      | `./src/utils/*`      |
| `@type/*`       | `./src/types/*`      |
| `@i18n/*`       | `./src/i18n/*`       |

### Import Order (ESLint simple-import-sort)

1. External packages (`zod`, etc.)
2. Astro imports (`astro:content`)
3. Path aliases (`@type/*`, `@utils/*`)
4. Relative imports (`./context`)

## Image Optimization

1. Use `<Picture />` with `formats={['avif', 'webp']}` and `fallbackFormat="jpeg"` (not `<Image />` for AVIF)
2. LCP images: `priority={true}` on ResponsiveImage (sets `decoding="sync"`, `loading="eager"`)
3. Below-fold: `loading="lazy"` and `decoding="async"` (default)
4. Use `getResponsiveSizes()` for mobile-first breakpoints

## Demo Embeds

Use `DemoEmbed` Svelte component (`src/components/svelte/DemoEmbed.svelte`) for sandboxed iframes. Only
`blit-tech-demos.ambilab.com` (HTTPS) is allowlisted.

## Code Blocks in MDX

Expressive Code (Shiki-based) with syntax highlighting. Supports `title`, line highlighting (`{2-3}`).

## Accessibility

- CSS `@media (prefers-reduced-motion: reduce)` for animations
- JS: `prefersReducedMotion()` from `@utils/dom` (SSR-safe)
- All images need alt text
- ARIA attributes on interactive elements

## Configuration

Key config files in `src/config/`:

- **`routes.ts`** -- Centralized route definitions. Use `getRoute(route, locale)` for paths, `isRouteActive()` for nav
  state. Never hardcode route paths.
- **`security.ts`** -- CSP and security headers (unsafe-inline for Astro hydration), applied via middleware.
  Environment-aware (relaxed in dev).
- **`components.ts`** -- Component-level config (scroll thresholds, animation timing).
- **`env.ts`** -- Environment variable validation via Zod.
- **`site.ts`** -- Site metadata (name, URLs, social links, default OG image).

## Testing

- **Unit tests**: Vitest + Testing Library, co-located in `src/`
- **E2E tests**: Playwright, in `tests/e2e/`, file naming: `tests/e2e/<feature-name>.spec.ts`
- **E2E preview**: `pnpm preview` on port 4321, requires `pnpm build` first

### When to Write Tests

- New interactive component: E2E test for key interactions
- Changed behavior: update existing tests
- New API route: E2E for success, validation, and error responses
- Bug fix: add a test that catches it

### E2E Conventions

- Feature flags: use `test.skip()` with runtime detection
- Use `import type { Page }` (not inline `import()`)
- Each test gets fresh browser context (localStorage/cookies not shared)
- Server-side state (rate limiters, caches) persists across tests in same run
- Components with `client:idle`/`client:visible` may need explicit waits

## Git Commits

Project-specific scopes: `news`, `i18n`, `components`, `seo`, `security`, `api`, `ci`, `docs`, `tests`

AI-assisted commits: include `Co-Authored-By: Claude <noreply@anthropic.com>`

## Git Hooks

Managed by Husky (auto-installed via `prepare` script on `pnpm install`).

**Pre-commit** (via lint-staged): auto-formats and lints staged files.

**Commit-msg** (via commitlint): enforces conventional commit format.

**Pre-push** -- runs automatically on `git push`:

1. Type check
2. Lint check

Blocked push = fix issues and retry. Full suite (format, spellcheck, knip, build, security audit) runs in CI.

## Common Mistakes

1. Forgetting `client:*` directives on Svelte components in Astro
2. Missing translations -- always create both en/cs versions
3. Skipping required frontmatter fields
4. Hardcoding strings -- use `src/i18n/translations.ts`
5. Hardcoding colors -- use semantic design tokens (no `dark:` variants)
6. Missing alt text on images
7. Ignoring `prefers-reduced-motion`
8. Forgetting to update/run tests after behavior changes
9. Adding Astro integrations in wrong order -- Expressive Code must come before MDX in `astro.config.ts`

## Pre-Completion Checklist

- [ ] Code passes typecheck
- [ ] Translations added for both en/cs (if applicable)
- [ ] Semantic design tokens used for colors
- [ ] Svelte components have `client:*` directives in Astro
- [ ] Images have alt text
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Tests pass (`pnpm test:run` and `pnpm test:e2e`)
- [ ] New behavior has test coverage
