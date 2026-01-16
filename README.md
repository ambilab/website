# Ambilab Marketing Website

A bilingual (English/Czech) marketing website and blog for **Ambilab** – a web-based pixel art game engine and editor
for kids to learn programming.

## Overview

This project establishes a production-ready, type-safe, and performant web presence for Ambilab. Key architecture
decisions include:

- **Hybrid rendering**: Server-side rendering (SSR) via Cloudflare adapter with selective client-side hydration
- **Progressive enhancement**: Core content accessible without JavaScript, enhanced interactivity when available
- **Type safety**: Strict TypeScript everywhere with comprehensive type definitions
- **Content-first**: MDX-based content management with Astro Content Collections
- **Semantic design system**: Token-based theming with consistent dark mode support
- **Security-first**: CSP with nonces, comprehensive security headers, validated on every deployment

## Tech Stack

- **Framework**: Astro 5 with SSR (Cloudflare adapter)
- **UI Components**: Svelte 5 (hydratable)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript (strict mode)
- **Content**: MDX via Astro Content Collections
- **Code Highlighting**: Expressive Code (Shiki-based)
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages
- **Linting**: Biome + ESLint + Prettier

## Fonts

This project uses the following fonts:

- **[Innovator Grotesk](https://www.yeptype.com/fonts/innovator-grotesk)** (served from CDN) – Primary sans-serif
  typeface for body text and headings
- **[Departure Mono](https://github.com/rektdeckard/departure-mono)** (self-hosted) – Monospace typeface for code and UI
  elements

Departure Mono is licensed under the [SIL Open Font License, Version 1.1](public/fonts/DepartureMono-LICENSE.txt)
(Copyright 2022–2024 Helena Zhang). The font files are located in `public/fonts/` and can be freely used, modified, and
redistributed under the terms of the OFL.

## Features

### Core

- Bilingual support (EN/CS) with domain/cookie-based detection
- Responsive images (AVIF/WebP with PNG fallback)
- Demo embeds with sandboxed iframes
- Newsletter integration (Buttondown API)
- RSS feeds per locale
- A dark mode with system preference detection
- Auto heading links with copy-to-clipboard

### SEO and Security

- JSON-LD schema markup, OpenGraph, X Cards
- Auto-generated sitemap
- CSP headers with nonce support
- Comprehensive security headers

### Accessibility

- Semantic HTML, ARIA labels, keyboard navigation
- Focus indicators, color contrast (WCAG AA)
- `prefers-reduced-motion` support

### Performance

- **Font Preloading**: Critical font resources
- **DNS Prefetch**: External resource hints
- **Responsive Images**: AVIF/WebP with responsive breakpoints/sizes
- **Code Splitting**: Automatic chunk optimization
- **CSS Purging**: Unused styles removed
- **Lazy Loading**: Deferred non-critical resources
- **Edge Caching**: Cloudflare CDN distribution

## Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:

- [Component Library](docs/components.md) – Astro and Svelte components, icons, hydration directives
- [Utilities](docs/utilities.md) – Helper functions (scroll, DOM, debounce, formatting)
- [Semantic Colors](docs/semantic-colors.md) – Design token system for consistent theming
- [Internationalization](docs/i18n.md) – Bilingual support, locale detection, translations
- [Content Management](docs/content.md) - Blog posts, pages, MDX components
- [Deployment](docs/deployment.md) – Cloudflare Pages setup, security headers, API endpoints

## Project Structure

```text
ambilab-website/
  ai-rules/                 # AI assistant rules
  docs/                     # Project documentation
    components.md           # Component library docs
    content.md              # Content management docs
    deployment.md           # Deployment and security docs
    i18n.md                 # Internationalization docs
    semantic-colors.md      # Color system docs
    utilities.md            # Utilities docs
  public/                   # Static assets
  src/
    assets/icons/           # SVG icons
    components/
      astro/                # Server-rendered components
      svelte/               # Interactive components
    config/                 # Configuration files
    content/
      blog/                 # Blog posts (en/, cs/)
      pages/                # Static pages (en/, cs/)
    i18n/                   # Internationalization
    lib/                    # Libraries (images)
    pages/                  # Astro pages and API routes
    styles/                 # Global CSS and MDX styles
    types/                  # TypeScript types
    utils/                  # Utility functions
    middleware.ts           # Request middleware
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 10+

### Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Build for production
pnpm build
```

## Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm check            # Run Astro check
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm format:check     # Check formatting
pnpm typecheck        # Run TypeScript checks
pnpm spellcheck       # Check spelling
pnpm preflight        # Run all quality checks
pnpm sync-rules       # Sync AI rules to editor configs
```

## Technical Details

### Browser Support

The site supports modern browsers with the following minimum versions:

- **Chrome/Edge**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari**: Last 2 versions
- **iOS Safari**: Last 2 versions

**Progressive Enhancement**: Core content and functionality work without JavaScript. Interactive features gracefully
degrade or are hidden when JavaScript is unavailable.

## AI Rules

Rules are maintained in `ai-rules/*.mdc` and synced to editor configs:

```bash
pnpm sync-rules  # Generates .cursor/rules/, .aiassistant/rules/, .rules, CLAUDE.md
```

## Why is this public?

This is Ambilab’s website. The code is public for reference and transparency, but we’re not actively seeking
contributions. If you spot a bug or typo, feel free to open an issue. Small fixes might be accepted, but significant
changes probably won’t be.

**Important**: While the source code is publicly available for educational purposes, all website content (text, images,
assets, design, and branding) remains proprietary and copyrighted by Ambilab. The code is published as study material
for anyone interested in learning from a production Astro + Svelte implementation.

## License

Copyright 2024–2026 Ambilab. All rights reserved.

## Links

- **Website**: [ambilab.com](https://ambilab.com) (EN) / [ambilab.cz](https://ambilab.cz) (CS)
- **Demos**: [blit-tech-demos.ambilab.com](https://blit-tech-demos.ambilab.com)
- **GitHub**: [github.com/ambilab](https://github.com/ambilab)
