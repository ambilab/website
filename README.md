# Ambilab Marketing Website

A bilingual (English/Czech) marketing website and blog for **Ambilab** — a web-based pixel art game engine and editor
for kids to learn programming.

## Overview

This project establishes complete foundational scaffolding for an SSR-first Astro marketing site with:

- Server-side rendering via Cloudflare adapter
- Bilingual support (English and Czech) with domain-based detection
- Component-driven architecture using Svelte
- Type-safe development with comprehensive TypeScript interfaces
- Accessibility-focused design (ARIA labels, focus styles, keyboard navigation)
- Performance-optimized (lazy loading, font preloading, image optimization)

## Tech Stack

- **Framework**: Astro 5 with SSR (Cloudflare adapter with platformProxy)
- **UI Components**: Svelte 5 (hydratable)
- **Styling**: Tailwind CSS 4 with a custom theme
- **Language**: TypeScript (strict mode) everywhere
- **Content**: MDX via Astro Content Collections
- **Code Highlighting**: Expressive Code (Shiki-based)
- **Icons**: Custom SVGs
- **Fonts**: Innovator Grotesk from fonts.vancura.dev
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages with edge functions
- **Linting & Formatting**: Biome (TS/JS/JSON/CSS), Prettier (Astro/Svelte/Markdown), ESLint (TS/Astro/Svelte)
- **Version Control**: Git LFS for images

## Features

### Core Features

- **Bilingual Support**: English and Czech with the domain/cookie-based locale detection
- **Responsive Images**: An automatic AVIF/WebP generation with PNG fallback
- **Demo Embeds**: Sandboxed iframe components with strict URL allowlist
- **Newsletter Integration**: Buttondown API proxy with server-side validation
- **RSS Feeds**: Separate feeds for each locale with language tags
- **Auto Heading Links**: GitHub-style anchor links with copy-to-clipboard
- **Dark Mode**: System preference detection with manual toggle
- **Cookie Banner**: Simple, dismissible privacy notice
- **Go To Top**: Smooth scroll button after 300px
- **Analytics**: Plausible (privacy-friendly)

### SEO & Meta

- **Structured Data**: JSON-LD schema markup
- **Open Graph**: Full OG meta tags for social sharing
- **Twitter Cards**: Optimized Twitter/X card meta
- **Sitemap**: Auto-generated sitemap.xml
- **Canonical URLs**: Proper canonical link handling

### Security

- **CSP Headers**: Content Security Policy with nonce support (env-aware)
- **Permissions Policy**: Restricted browser feature access
- **Security Headers**: Comprehensive static security headers
- **Validation Script**: Header verification tooling
- **Error Handling**: Comprehensive error pages (404, 500, 503) with secure logging

### Accessibility

- **Semantic HTML**: Proper document structure
- **ARIA Labels**: Where needed for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Visible focus-visible outlines
- **Color Contrast**: WCAG AA compliant
- **Reduced Motion**: `prefers-reduced-motion` support
- **Screen Reader Friendly**: Tested with assistive tech
- **Alt Text**: On all images

### Performance

- **Font Preloading**: Critical font resources
- **DNS Prefetch**: External resource hints
- **Responsive Images**: AVIF/WebP with responsive breakpoints/sizes
- **Code Splitting**: Automatic chunk optimization
- **CSS Purging**: Unused styles removed
- **Lazy Loading**: Deferred non-critical resources
- **Edge Caching**: Cloudflare CDN distribution

## Component Library

All components are written in Svelte with TypeScript.

### UI Primitives

- **Button** — Styled button with variants
- **Card** — Content card container

### Layout Components

- **Header** — Site header with navigation
- **Footer** — Site footer with links
- **PageLayout** — Main page wrapper
- **BlogPostLayout** — Blog post template with SEO

### Feature Components

- **LocaleSwitcher** — Language toggle (en/cs)
- **NewsletterForm** — Email subscription form
- **CookieBanner** — Privacy consent banner
- **GoToTop** — Scroll-to-top button
- **HeadingLinks** — Auto-generated anchor links with deduplication

### Media Components

- **ResponsiveImage** — Optimized image with srcset
- **DemoEmbed** — Sandboxed iframe for demos (host allowlist + dev localhost support)

### Social

- **SocialLinks** — Social media link icons

## Project Structure

```text
ambilab-website/
├── ai-rules/
│   ├── ambilab-website.mdc     # Project-specific rules
│   ├── astro-svelte.mdc        # Astro/Svelte conventions
│   ├── file-structure.mdc      # Region organization
│   └── typescript.mdc          # TypeScript conventions
├── public/
│   ├── favicon.png             # Light mode favicon
│   ├── favicon-dark.png        # Dark mode favicon
│   ├── logo-placeholder.png    # Square logo
│   └── og-default.png          # Default OG image
├── src/
│   ├── assets/
│   │   ├── images/             # Source images (Git LFS)
│   │   └── icons/              # Custom SVG icons
│   ├── components/
│   │   ├── astro/              # Astro-only components
│   │   │   ├── BaseHead.astro  # SEO, fonts, CSP nonce scripts
│   │   │   ├── Head.astro      # Document head wrapper
│   │   │   ├── Header.astro    # Site header
│   │   │   ├── Footer.astro    # Site footer
│   │   │   ├── PageLayout.astro
│   │   │   ├── BlogPostLayout.astro
│   │   │   ├── ErrorPage.astro # Shared error page component
│   │   │   └── HeadingLinks.astro
│   │   └── svelte/             # Interactive Svelte components
│   ├── config/
│   │   ├── site.ts             # Site constants (SITE config)
│   │   ├── components.ts       # Component config presets
│   │   └── security.ts         # CSP, nonce generation, security headers
│   ├── content/
│   │   ├── config.ts           # Content Collections schema
│   │   ├── blog/               # Blog posts by locale (en/, cs/)
│   │   └── pages/              # Static pages by locale (en/, cs/)
│   ├── i18n/
│   │   ├── config.ts           # Locale configuration (Locale, LocaleConfig)
│   │   ├── translations.ts     # UI strings (nav, buttons, footer, etc.)
│   │   └── utils.ts            # i18n helpers (detect, cookie, paths)
│   ├── lib/
│   │   ├── images.ts           # Image pipeline (breakpoints, formats, sizes)
│   ├── pages/
│   │   ├── [...slug].astro     # Dynamic routing (pages + blog)
│   │   ├── 404.astro           # Not found error page
│   │   ├── 500.astro           # Server error page
│   │   ├── 503.astro           # Service unavailable page
│   │   ├── en/rss.xml.ts       # English RSS feed
│   │   ├── cs/rss.xml.ts       # Czech RSS feed
│   │   └── api/
│   │       └── newsletter.ts   # Buttondown proxy endpoint
│   ├── scripts/
│   │   └── validate-security-headers.ts
│   ├── styles/
│   │   ├── global.css          # Tailwind + base styles + print styles
│   │   └── mdx-content.css     # MDX content styling
│   ├── types/
│   │   ├── index.ts            # Central barrel export
│   │   ├── content.ts          # BlogPost, Page types
│   │   ├── locale.ts           # Locale types
│   │   └── seo.ts              # ISEOMetadata
│   ├── utils/
│   │   ├── debounce.ts         # Debounce with cancel
│   │   ├── dom.ts              # Dark mode, prefers-reduced-motion
│   │   ├── logger.ts           # Logger factory
│   │   ├── rss.ts              # RSS helpers (getBlogPostLink, generateRssFeed)
│   │   ├── safe-execute.ts     # Safe execution wrapper
│   │   └── scroll.ts           # smoothScrollTo, scrollToTop
│   ├── middleware.ts           # Nonce + locale injection, security headers
│   └── env.d.ts                # Typed env vars and App.Locals
├── .env.example                # Environment variable template
├── .gitattributes              # Git LFS configuration
├── .gitignore
├── .prettierignore
├── astro.config.ts
├── biome.json
├── eslint.config.js
├── prettier.config.js
├── svelte.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 10+

### Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The dev server will be available at `http://localhost:4321`.

### Workspace Setup

This project can work both as a standalone repository and as part of a pnpm workspace:

- **Standalone (CI/CD)**: The repository includes its own `pnpm-lock.yaml` for deterministic builds in GitHub Actions
- **Workspace (Local Dev)**: When part of a parent workspace, the workspace's lock file takes precedence

This hybrid approach allows:

- Independent deployment and CI without requiring the full workspace
- Shared dependencies and tooling when developing locally in the monorepo
- Consistent builds across environments

To regenerate the standalone lock file (when updating dependencies):

```bash
pnpm install --ignore-workspace --lockfile-only
```

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm check            # Run Astro check
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Biome and Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # Run TypeScript and Astro checks
pnpm spellcheck       # Check spelling
pnpm preflight        # Run all quality checks
pnpm sync-rules       # Sync AI rules to editor configs
```

## Internationalization (i18n)

### Domain-Based Detection

The site automatically detects the locale based on the domain:

- `ambilab.com` → English
- `ambilab.cz` → Czech
- Localhost → English (default)

Detection priority:

1. Cookie override (`locale` cookie)
2. Domain/hostname detection
3. Default fallback (en)

### Middleware

The middleware (`src/middleware.ts`) handles:

- Automatic locale resolution from cookies or hostname
- Nonce generation for CSP
- Security header application
- Locale injection into `Astro.locals`

### Testing Locales Locally

Option 1: Add to `/etc/hosts`:

```bash
127.0.0.1 ambilab.cz
```

Option 2: Use query parameter (development only):

```text
http://localhost:4321/?locale=cs
```

### Translation Keys

UI translations are organized in `src/i18n/translations.ts`:

- `nav` — Navigation labels
- `buttons` — Button text
- `footer` — Footer content
- `newsletter` — Newsletter form
- `cookie` — Cookie banner
- `blog` — Blog-related strings
- `notFound` — 404 error page
- `serverError` — 500 error page
- `serviceUnavailable` — 503 error page

### Content Translation Linking

Each MDX file links to its translation via frontmatter:

```yaml
---
title: 'Hello World'
locale: 'en'
translationSlug: 'ahoj-svete' # Links to the Czech version
---
```

## Deployment

### Cloudflare Pages

The site is deployed automatically via GitHub Actions when you push to the `main` branch.

#### Deployment Workflow

1. Push changes to the `main` branch
2. GitHub Actions runs quality checks (formatting, linting, type checking, spell checking)
3. GitHub Actions builds the site
4. GitHub Actions deploys to Cloudflare Pages using Wrangler

#### Required GitHub Secrets

Configure these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Pages permissions
  - Create at: https://dash.cloudflare.com/profile/api-tokens
  - Required permissions: `Cloudflare Pages:Edit`
- `CLOUDFLARE_ACCOUNT_ID` — Your Cloudflare account ID
  - Find at: https://dash.cloudflare.com/ (right sidebar)

#### Environment Variables

**Important**: ALL environment variables must be set in **Cloudflare Pages dashboard** under Settings > Environment
Variables.

Required variables:

- `BUTTONDOWN_API_KEY` — Buttondown newsletter API key
- `NODE_VERSION` — Set to `20`

See `.env.example` for the template.

**Don't** use GitHub Secrets for environment variables.

#### Build Settings (Cloudflare)

- **Build command**: `pnpm build`
- **Build output directory**: `dist`
- **Node version**: 20

## Content Management

### Adding a Blog Post

1. Create a new MDX file in `src/content/blog/en/` or `src/content/blog/cs/`
2. Add frontmatter with required fields
3. Link translations via `translationSlug`
4. Write content in MDX

Example:

```mdx
---
title: 'My Post'
description: 'Post description'
slug: 'my-post'
locale: 'en'
translationSlug: 'muj-prispevek'
pubDate: 2024-01-15T00:00:00.000Z
author: 'Ambilab'
tags: ['tutorial', 'games']
---

# My Post Content

Write your content here...
```

### Adding a Static Page

Same process as blog posts, but place files in `src/content/pages/`.

### Embedding Demos

Use the `DemoEmbed` component in MDX:

```mdx
<DemoEmbed src="https://blit-tech-demos.ambilab.com/pong" title="Play Pong" aspectRatio="16/9" client:load />
```

The component includes:

- Strict URL allowlist for security
- A sandboxed iframe with a permissions model
- Dev localhost support for local testing
- SSR-safe hydration handling

## API Endpoints

### Newsletter (`/api/newsletter`)

POST-endpoint that proxies to Buttondown:

- Server-side email validation
- Consistent JSON responses
- Robust error handling
- Uses `BUTTONDOWN_API_KEY` environment variable

## Error Handling

The site includes comprehensive error handling for all HTTP error codes:

### Error Pages

- **404 Not Found** (`src/pages/404.astro`) - Custom localized page for missing content
- **500 Server Error** (`src/pages/500.astro`) - Handles middleware and rendering failures
- **503 Service Unavailable** (`src/pages/503.astro`) - For maintenance windows

All error pages:

- Use a shared `ErrorPage` component for consistent design
- Are fully localized (EN/CS) with proper translations
- Include a "Go Home" button for easy navigation
- Follow the same styling as the rest of the site
- Are properly configured for SEO with appropriate meta tags

### Error Handling Strategy

**Middleware** (`src/middleware.ts`):

- Wrapped in try-catch to prevent complete site failures
- Logs errors without exposing sensitive information
- Redirects to `/500` on critical failures
- Sets safe defaults (locale, nonce) on error

**RSS Feed Generation** (`src/utils/rss.ts`):

- Try-catch around content collection operations
- Returns XML error response with 500 status
- Logs errors for debugging

**Content Pages** (`src/pages/[...slug].astro`):

- Try-catch around all content collection operations
- Redirects to `/500` on rendering errors
- Redirects to `/404` for missing content

**API Routes** (e.g., `src/pages/api/newsletter.ts`):

- Validates input with 400 errors for invalid data
- Returns 500 errors for server failures
- Sanitizes error messages (no sensitive data exposure)
- Comprehensive error logging

### Testing Error Pages

**Local Development:**

```bash
# Start development server
pnpm dev

# Visit error pages directly
# http://localhost:4321/404
# http://localhost:4321/500
# http://localhost:4321/503
```

**Production Testing:**

After deployment, test these scenarios:

1. **404 Errors**: Visit a non-existent page (e.g., `https://ambilab.com/non-existent-page`)
2. **500 Errors**: Triggered automatically if middleware or content loading fails
3. **503 Errors**: Can be used during maintenance windows

### Cloudflare Configuration

Error handling works automatically when deployed to Cloudflare Pages:

1. **SSR Mode**: All routes are handled dynamically by Cloudflare Functions
2. **Middleware Redirects**: Error redirects work out of the box
3. **Localization**: Error pages respect the user's locale
4. **Logging**: Available in Cloudflare Pages dashboard under Functions > Begin log stream

**Monitoring:**

- Real-time logs: `Pages > Your Project > Functions > Begin log stream`
- Analytics: `Pages > Your Project > Analytics & Logs`
- Set up alerts for high error rates in Cloudflare dashboard

**Configuration Files:**

- `wrangler.jsonc` - Cloudflare Pages configuration
- `public/_routes.json` - Routes configuration (optimizes static asset serving)

## Fonts

Fonts are loaded from `https://fonts.vancura.dev`:

- **Innovator Grotesk** Medium (500) — UI font
- Preconnect, prefetch, and non-blocking load
- `font-display: swap` for FOUT mitigation

To update font files, change the URLs in `src/components/astro/BaseHead.astro`.

## Icons

### Custom Icons

The website uses both inline SVG icons and separate icon files, depending on usage patterns:

- **Separate icon files** (`src/assets/icons/`): Use for frequently reused icons that appear across multiple components.
  These icons are loaded via the `Icon` component (`src/components/astro/Icon.astro`) for better maintainability and
  reduced duplication. Examples include user, calendar, clock, tag, and refresh icons used in blog post layouts.

- **Inline SVG icons**: Use for component-specific icons that are unique to a single component and unlikely to be reused
  elsewhere. Inline SVGs provide maximum flexibility and avoid unnecessary file overhead for one-off icons.

When adding a new icon, consider its reusability: if it will be used in multiple places, add it to `src/assets/icons/`
and use the `Icon` component. If it's specific to one component, keep it inline.

## Utilities

### Scroll Helpers

- `smoothScrollTo(element, offset)` — Smooth scroll with stability polling
- `scrollToTop()` — Scroll to page top

### Image Helpers

- Responsive breakpoints and sizes
- AVIF/WebP primary formats with PNG fallback
- `getResponsiveSizes()` utility

### Other Utilities

- `debounce(fn, delay)` — Debounce with cancel method
- `safeExecute(fn)` — Safe execution wrapper
- `logger(name)` — Logger factory
- `getReadingTime(content)` — Reading time calculation

## Security Configuration

### Content Security Policy

CSP is configured in `src/config/security.ts`:

- **Production**: Full CSP with nonce support
- **Development**: Relaxed allowances for hot reload

### Security Headers

Applied via middleware:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (restricted features)

### Validation

Run the security header validation script:

```bash
pnpm tsx src/scripts/validate-security-headers.ts
```

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (Safari on iOS, Chrome on Android)

## Architecture Highlights

- **SSR-First**: Cloudflare Pages Functions for edge rendering
- **Type-Safe**: Comprehensive TypeScript interfaces throughout
- **Accessibility-Focused**: ARIA labels, focus styles, keyboard navigation
- **Performance-Optimized**: Lazy loading, font preloading, image optimization
- **Developer Experience**: Path aliases, consistent formatting

## Why is this public?

This is Ambilab's website. The code is public for reference and transparency, but we're not actively seeking
contributions. If you spot a bug or typo, feel free to open an issue. Small fixes might be accepted, but significant
changes probably won't be.

## License

Copyright © 2024 Ambilab. All rights reserved.

## Links

- **Main site**: (WIP) <https://ambilab.com> (EN) / <https://ambilab.cz> (CS)
- **Demos**: (WIP) <https://blit-tech-demos.ambilab.com>
- **GitHub**: (WIP) <https://github.com/ambilab>
