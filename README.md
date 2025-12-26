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
- **Animation**: GSAP for typewriter effects (reduced-motion aware)
- **Icons**: Solar icons via Iconify + custom SVGs
- **Fonts**: Innovator Grotesk from fonts.vancura.dev
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages with edge functions
- **Component Development**: Histoire for Svelte component documentation
- **Linting & Formatting**: Biome (TS/JS/JSON/CSS), Prettier (Astro/Svelte/Markdown), ESLint (TS/Astro/Svelte)
- **Version Control**: Git LFS for images

## Features

### Core Features

- **Bilingual Support**: English and Czech with the domain/cookie-based locale detection
- **GSAP Typewriter Transitions**: Smooth locale switching with character-by-character animation
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

All components are written in Svelte with TypeScript and include Histoire stories.

### UI Primitives

- **Button** — Styled button with variants
- **Card** — Content card container
- **Icon** — Solar icons via Iconify with validation/fallback

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
│   │   │   └── HeadingLinks.astro
│   │   └── svelte/             # Interactive Svelte components + stories
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
│   │   ├── typewriter.ts       # GSAP animation logic
│   │   └── typewriter-init.ts  # Animation trigger setup
│   ├── pages/
│   │   ├── [...slug].astro     # Dynamic routing (pages + blog)
│   │   ├── 404.astro           # Localized 404 page
│   │   ├── en/rss.xml.ts       # English RSS feed
│   │   ├── cs/rss.xml.ts       # Czech RSS feed
│   │   └── api/
│   │       └── newsletter.ts   # Buttondown proxy endpoint
│   ├── scripts/
│   │   └── validate-security-headers.ts
│   ├── stores/
│   │   └── locale.ts           # Nanostores for locale state
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
├── histoire.config.ts
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

# Open Histoire (component library)
pnpm story:dev
```

The dev server will be available at `http://localhost:4321`

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm check            # Run Astro check
pnpm story:dev        # Start Histoire
pnpm story:build      # Build Histoire
pnpm story:preview    # Preview Histoire build
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
- `404` — Not found page

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

The site is deployed automatically when you push to GitHub:

1. Push changes to the `main` branch
2. Cloudflare detects the push and builds
3. Cloudflare deploys to its edge network

### Environment Variables

**Important**: ALL environment variables must be set in **Cloudflare Pages dashboard** under Settings > Environment
Variables.

Required variables:

- `BUTTONDOWN_API_KEY` — Buttondown newsletter API key
- `NODE_VERSION` — Set to `20`

See `.env.example` for the template.

**Don’t** use GitHub Secrets for this project.

### Build Settings (Cloudflare)

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

## Component Development

### Histoire

Histoire is used for developing and documenting Svelte components:

```bash
pnpm story:dev
```

Each component has a `.story.svelte` file alongside it:

```text
Button.svelte
Button.story.svelte
```

### Creating a New Component

1. Create the component in `src/components/svelte/`
2. Create a story file: `ComponentName.story.svelte`
3. Import and use in Astro pages with `client:` directive

## Fonts

Fonts are loaded from `https://fonts.vancura.dev`:

- **Innovator Grotesk** Medium (500) — UI font
- Preconnect, prefetch, and non-blocking load
- `font-display: swap` for FOUT mitigation

To update font files, change the URLs in `src/components/astro/BaseHead.astro`.

## Icons

### Solar Icons

Primary icon system via Iconify fetch:

```astro
<Icon name="solar:game-controller-bold" class="h-6 w-6" />
```

The Icon component includes:

- Name parsing and validation
- SVG fetch with caching
- SSR-safe fallback behavior

Browse: <https://www.figma.com/community/file/1166831539721848736>

### Custom Icons

Place custom SVG icons in `src/assets/icons/`. See README.md in that directory for guidelines.

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
- **Developer Experience**: Component stories, path aliases, consistent formatting

## License

Copyright © 2024 Ambilab. All rights reserved.

## Links

- **Main site**: <https://ambilab.com> (EN) / <https://ambilab.cz> (CS)
- **Demos**: <https://blit-tech-demos.ambilab.com>
- **Fonts**: <https://fonts.vancura.dev>
- **GitHub**: <https://github.com/ambilab>
