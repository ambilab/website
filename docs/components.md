# Component Library

The Ambilab website uses a hybrid component architecture with both Astro components (server-rendered) and Svelte
components (interactive, client-side hydratable).

## Architecture Overview

```text
src/components/
  astro/          # Server-rendered components (12 files)
  svelte/         # Interactive components (8 files)
```

**Design Principles:**

- Astro components for static layouts and SEO-critical content
- Svelte components for interactive features requiring client-side JavaScript
- All components use [semantic colors](semantic-colors.md) for consistent theming
- Progressive enhancement: core functionality works without JavaScript

## Astro Components

Server-rendered components located in [`src/components/astro/`](../src/components/astro/).

### Layout Components

| Component      | File               | Purpose                                          |
| -------------- | ------------------ | ------------------------------------------------ |
| **PageLayout** | `PageLayout.astro` | Main page wrapper with header, footer, and slots |
| **Header**     | `Header.astro`     | Site header with navigation and theme switcher   |
| **HeaderNav**  | `HeaderNav.astro`  | Navigation menu with active state highlighting   |
| **Footer**     | `Footer.astro`     | Site footer with links and social media          |

### Head Components

| Component    | File             | Purpose                                     |
| ------------ | ---------------- | ------------------------------------------- |
| **BaseHead** | `BaseHead.astro` | SEO metadata, fonts, and CSP nonce handling |
| **Head**     | `Head.astro`     | Wrapper component for the HTML head element |

### Content Components

| Component          | File                   | Purpose                                        |
| ------------------ | ---------------------- | ---------------------------------------------- |
| **BlogPostLayout** | `BlogPostLayout.astro` | Blog post template with SEO and metadata       |
| **Card**           | `Card.astro`           | Content card container with optional title     |
| **HeadingLinks**   | `HeadingLinks.astro`   | Auto-generated anchor links with deduplication |

### UI Components

| Component       | File                | Purpose                                       |
| --------------- | ------------------- | --------------------------------------------- |
| **Icon**        | `Icon.astro`        | SVG icon renderer with accessibility support  |
| **SocialLinks** | `SocialLinks.astro` | Social media link icons                       |
| **ErrorPage**   | `ErrorPage.astro`   | Shared error page component for 404, 500, 503 |

## Svelte Components

Interactive components with client-side hydration, located in [`src/components/svelte/`](../src/components/svelte/).

### Interactive UI

| Component          | File                    | Purpose                                                   |
| ------------------ | ----------------------- | --------------------------------------------------------- |
| **Button**         | `Button.svelte`         | Styled button with variants (primary, secondary, outline) |
| **LocaleSwitcher** | `LocaleSwitcher.svelte` | Language toggle (English/Czech) with View Transitions     |
| **ThemeSwitcher**  | `ThemeSwitcher.svelte`  | Dark mode toggle with localStorage persistence            |
| **GoToTop**        | `GoToTop.svelte`        | Scroll-to-top button with debounced scroll detection      |

### Forms and Content

| Component           | File                     | Purpose                                                   |
| ------------------- | ------------------------ | --------------------------------------------------------- |
| **NewsletterForm**  | `NewsletterForm.svelte`  | Email subscription form with validation                   |
| **CookieBanner**    | `CookieBanner.svelte`    | Privacy consent banner with localStorage persistence      |
| **ResponsiveImage** | `ResponsiveImage.svelte` | Optimized image with srcset and responsive sizes          |
| **DemoEmbed**       | `DemoEmbed.svelte`       | Sandboxed iframe for demos (host allowlist + dev support) |

## Hydration Directives

Svelte components must be hydrated to enable interactivity. Use Astro’s `client:*` directives:

| Directive              | When to Use                                       | Example                                  |
| ---------------------- | ------------------------------------------------- | ---------------------------------------- |
| `client:load`          | Critical interactive elements (buttons, forms)    | `<Button client:load>Click</Button>`     |
| `client:visible`       | Elements below the fold (lazy load on scroll)     | `<DemoEmbed client:visible />`           |
| `client:idle`          | Non-critical elements (load when browser is idle) | `<CookieBanner client:idle />`           |
| `client:only="svelte"` | Skip SSR entirely (client-only rendering)         | `<ThemeSwitcher client:only="svelte" />` |

**Usage Example:**

```astro
---
import Button from '@components/svelte/Button.svelte';
import NewsletterForm from '@components/svelte/NewsletterForm.svelte';
---

<!-- Critical: load immediately -->
<Button client:load variant="primary">Subscribe</Button>

<!-- Below fold: load when visible -->
<NewsletterForm client:visible locale="en" />
```

## Icon System

The project uses a centralized icon management system.

### File Locations

- **SVG Files**: [`src/assets/icons/`](../src/assets/icons/)
- **Icon Map**: [`src/config/icons.ts`](../src/config/icons.ts)
- **Renderer**: [`src/components/astro/Icon.astro`](../src/components/astro/Icon.astro)

### Available Icons

| Icon Name     | File              | Usage                   |
| ------------- | ----------------- | ----------------------- |
| `bluesky`     | `bluesky.svg`     | Bluesky social link     |
| `calendar`    | `calendar.svg`    | Date/event indicator    |
| `clock`       | `clock.svg`       | Time/duration indicator |
| `github`      | `github.svg`      | GitHub social link      |
| `instagram`   | `instagram.svg`   | Instagram social link   |
| `linkedin`    | `linkedin.svg`    | LinkedIn social link    |
| `mastodon`    | `mastodon.svg`    | Mastodon social link    |
| `pixel-heart` | `pixel-heart.svg` | Decorative pixel art    |
| `refresh`     | `refresh.svg`     | Refresh/reload action   |
| `tag`         | `tag.svg`         | Category/tag indicator  |
| `threads`     | `threads.svg`     | Threads social link     |
| `user`        | `user.svg`        | User/author indicator   |
| `x`           | `x.svg`           | X (Twitter) social link |

### Icon Usage

```astro
---
import Icon from '@components/astro/Icon.astro';
---

<!-- Decorative icon (default) -->
<Icon name="github" class="h-5 w-5" />

<!-- Semantic icon with accessible label -->
<Icon name="github" ariaLabel="GitHub profile" decorative={false} />
```

### When to Use Separate Icon Files

Use files in `src/assets/icons/` for:

- **Reusable icons** used in multiple locations (social media, UI elements)
- **Icons in the icon map** that need centralized management
- **Semantic icons** requiring proper accessibility labels

### When to Use Inline SVG

Use inline SVG directly in components for:

- **One-off illustrations** or graphics specific to a single component
- **Complex SVGs with animations** or dynamic styling
- **SVGs that need component-specific manipulation**

## Component Configuration

Centralized component settings are in [`src/config/components.ts`](../src/config/components.ts):

```typescript
export const COMPONENT_CONFIG = {
  goToTop: {
    showAfterScroll: 300, // Pixels before showing button
    animationDuration: 300, // Fade transition in ms
  },
  cookieBanner: {
    dismissedKey: 'cookie-banner-dismissed',
    autoHideDelay: 0, // 0 = manual dismiss only
  },
} as const;
```

## Styling

All components use [semantic colors](semantic-colors.md) for consistent theming:

```astro
<!-- Use semantic color classes -->
<div class="border-border-default bg-surface dark:border-border-default-dark dark:bg-surface-dark">
  <a class="text-link hover:text-link-hover dark:text-link-dark">Link</a>
</div>
```

See the [Semantic Colors documentation](semantic-colors.md) for available color tokens.

## Related Documentation

- [Semantic Colors](semantic-colors.md) – Color system used by components
- [Utilities](utilities.md) – Utility functions used by components
- [Content Management](content.md) - Using components in MDX content
