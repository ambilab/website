# ambilab Marketing Website

A bilingual (English/Czech) marketing website and blog for **ambilab** - a web-based pixel art game engine and editor for kids to learn programming.

## Tech Stack

- **Framework**: Astro 5 with SSR
- **UI Components**: Svelte 5
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript everywhere
- **Content**: MDX via Astro Content Collections
- **Code Highlighting**: Expressive Code (Shiki-based)
- **Animation**: GSAP for typewriter effects
- **Icons**: Solar icons + custom SVGs
- **Fonts**: Innovator Grotesk from fonts.vancura.dev
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages
- **Component Development**: Histoire

## Features

- ✅ **Bilingual Support**: English and Czech with domain-based locale detection
- ✅ **GSAP Typewriter Transitions**: Smooth locale switching with character-by-character animation
- ✅ **Responsive Images**: Automatic AVIF/WebP generation with Git LFS for source files
- ✅ **Demo Embeds**: iframe components for blit-tech-demos.ambilab.com
- ✅ **Newsletter Integration**: Buttondown API proxy
- ✅ **RSS Feeds**: Separate feeds for each locale
- ✅ **Auto Heading Links**: GitHub-style anchor links for all headings
- ✅ **Dark Mode**: System preference detection with manual toggle
- ✅ **Cookie Banner**: Simple, dismissible privacy notice
- ✅ **Go To Top**: Smooth scroll button after 300px
- ✅ **Analytics**: Plausible (privacy-friendly)
- ✅ **SEO Optimized**: Structured data, Open Graph, Twitter Cards
- ✅ **Accessibility**: WCAG AA compliant, prefers-reduced-motion support

## Project Structure

```
ambilab-website/
├── functions/
│   └── _middleware.ts          # Cloudflare edge locale detection
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
│   │   └── svelte/             # Interactive Svelte components + Histoire stories
│   ├── config/
│   │   ├── site.ts             # Site constants
│   │   └── components.ts       # Component config
│   ├── content/
│   │   ├── config.ts           # Content Collections schema
│   │   ├── blog/               # Blog posts by locale
│   │   └── pages/              # Static pages by locale
│   ├── i18n/
│   │   ├── config.ts           # Locale configuration
│   │   ├── translations.ts     # UI strings
│   │   └── utils.ts            # i18n helpers
│   ├── lib/
│   │   ├── images.ts           # Image pipeline config
│   │   └── typewriter.ts       # GSAP animation logic
│   ├── pages/
│   │   ├── [...slug].astro     # Dynamic routing
│   │   ├── en/rss.xml.ts       # English RSS
│   │   ├── cs/rss.xml.ts       # Czech RSS
│   │   └── api/newsletter.ts   # Buttondown proxy
│   ├── stores/
│   │   └── locale.ts           # Nanostores for locale
│   ├── styles/
│   │   ├── global.css          # Tailwind + base styles
│   │   └── mdx-content.css     # MDX content styling
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Utility functions
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
pnpm format           # Format code with Prettier
pnpm typecheck        # Run TypeScript checks
```

## Locale System

### Domain-Based Detection

The site automatically detects locale based on the domain:

- `ambilab.com` → English
- `ambilab.cz` → Czech
- Localhost → English (default)

Detection priority:

1. Cookie override (`locale` cookie)
2. Domain detection
3. Default fallback (en)

### Testing Locales Locally

Option 1: Add to `/etc/hosts`:

```bash
127.0.0.1 ambilab.cz
```

Option 2: Use query parameter (development only):

```
http://localhost:4321/?locale=cs
```

### Content Translation Linking

Each MDX file links to its translation via frontmatter:

```yaml
---
title: 'Hello World'
locale: 'en'
translationSlug: 'ahoj-svete' # Links to Czech version
---
```

## Deployment

### Cloudflare Pages

The site is deployed automatically when you push to GitHub:

1. Push changes to the `main` branch
2. Cloudflare detects the push and builds
3. Cloudflare deploys to its edge network

### Environment Variables

**Important**: ALL environment variables must be set in **Cloudflare Pages dashboard** under Settings > Environment Variables.

Required variables:

- `BUTTONDOWN_API_KEY` - Buttondown newsletter API key
- `NODE_VERSION` - Set to `20`

**Do NOT** use GitHub Secrets for this project.

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
author: 'ambilab'
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
<DemoEmbed
  src="https://blit-tech-demos.ambilab.com/pong"
  title="Play Pong"
  aspectRatio="16/9"
  client:load
/>
```

## Component Development

### Histoire

Histoire is used for developing and documenting Svelte components:

```bash
pnpm story:dev
```

Each component has a `.story.svelte` file alongside it:

```
Button.svelte
Button.story.svelte
```

### Creating a New Component

1. Create the component in `src/components/svelte/`
2. Create a story file: `ComponentName.story.svelte`
3. Import and use in Astro pages with `client:` directive

## Fonts

Fonts are loaded from `https://fonts.vancura.dev`:

- **Innovator Grotesk** Medium (500) - UI font
- Preconnect, prefetch, and non-blocking load
- `font-display: swap` for FOUT mitigation

To update font files, change the URLs in `src/components/astro/BaseHead.astro`.

## Icons

### Solar Icons

Primary icon system via `astro-icon`:

```astro
<Icon name="solar:game-controller-bold" class="h-6 w-6" />
```

Browse: https://www.figma.com/community/file/1166831539721848736

### Custom Icons

Place custom SVG icons in `src/assets/icons/`. See README.md in that directory for guidelines.

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)
- ✅ `prefers-reduced-motion` support
- ✅ Screen reader friendly
- ✅ Alt text on images

## Performance

- ✅ Font preloading
- ✅ DNS prefetch for external resources
- ✅ Responsive images with AVIF/WebP
- ✅ Code splitting
- ✅ CSS purging
- ✅ Lazy loading
- ✅ Cloudflare edge caching

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Copyright © 2024 ambilab. All rights reserved.

## Links

- **Main site**: https://ambilab.com (EN) / https://ambilab.cz (CS)
- **Demos**: https://blit-tech-demos.ambilab.com
- **Fonts**: https://fonts.vancura.dev
- **GitHub**: https://github.com/ambilab

---

Built with ❤️ using Astro, Svelte, and Tailwind CSS.
