# Content Management

Content is managed using Astro Content Collections with MDX files. The site supports blog posts and static pages in both
English and Czech.

## Content Structure

```text
src/content/
  config.ts           # Content Collections schema
  blog/
    en/               # English blog posts
      hello-world.mdx
    cs/               # Czech blog posts
      ahoj-svete.mdx
  pages/
    en/               # English pages
      index.mdx
      about.mdx
    cs/               # Czech pages
      index.mdx
      o-projektu.mdx
```

## Blog Posts

### Creating a Blog Post

1. Create an MDX file in `src/content/blog/en/` or `src/content/blog/cs/`
2. Add required frontmatter
3. Write content in MDX
4. Link translation via `translationSlug` (optional)

### Frontmatter Schema

```yaml
---
title: 'My Blog Post' # Required: Post title
description: 'Post summary' # Required: Meta description (SEO)
locale: 'en' # Required: 'en' or 'cs'
translationSlug: 'muj-clanek' # Optional: Filename of translation
pubDate: 2024-01-15 # Required: Publication date
updatedDate: 2024-01-20 # Optional: Last update date
author: 'Ambilab' # Optional: Author name (default: 'Ambilab')
tags: ['tutorial', 'news'] # Optional: Tag array (default: [])
draft: false # Optional: Draft status (default: false)
---
```

### Example Blog Post

```mdx
---
title: 'Getting Started with Ambilab'
description: 'Learn how to create your first pixel art game with Ambilab'
locale: 'en'
translationSlug: 'zacatek-s-ambilab'
pubDate: 2024-01-15
author: 'Ambilab Team'
tags: ['tutorial', 'beginner']
---

Welcome to Ambilab! In this tutorial, we'll create a simple game.

## Prerequisites

Before you begin, make sure you have...

## Creating Your First Project

1. Open the Ambilab editor
2. Click "New Project"
3. Choose a template
```

### Draft Posts

Posts with `draft: true` are excluded from production builds but visible in development:

```yaml
---
title: 'Work in Progress'
draft: true
---
```

## Static Pages

### Creating a Page

1. Create an MDX file in `src/content/pages/en/` or `src/content/pages/cs/`
2. Add required frontmatter
3. Write content

### Page Frontmatter

```yaml
---
title: 'About Ambilab' # Required: Page title
description: 'Learn about us' # Required: Meta description
locale: 'en' # Required: 'en' or 'cs'
translationSlug: 'o-projektu' # Optional: Filename of translation
---
```

## Content Collections Schema

The schema is defined in [`src/content/config.ts`](../src/content/config.ts):

```typescript
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'cs']),
    translationSlug: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Ambilab'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'cs']),
    translationSlug: z.string().optional(),
  }),
});
```

## Using Components in MDX

### Available Components

Import and use components directly in MDX files:

```mdx
---
title: 'Demo Showcase'
---

import DemoEmbed from '@components/svelte/DemoEmbed.svelte';

# Interactive Demo

Try this game directly in your browser:

<DemoEmbed src="https://blit-tech-demos.ambilab.com/pong" title="Play Pong" aspectRatio="16/9" client:load />
```

### DemoEmbed Component

Embeds sandboxed demos from the allowlisted hostname:

```mdx
<DemoEmbed
  src="https://blit-tech-demos.ambilab.com/demo-name"
  title="Demo Title"
  aspectRatio="16/9"    # Optional: aspect ratio (default: "16/9")
  desktopOnly={false}   # Optional: hide on mobile (default: false)
  client:load           # Required: hydration directive
/>
```

**Security:**

- Only URLs from `blit-tech-demos.ambilab.com` are allowed
- HTTPS required
- Sandboxed iframe with restricted permissions

### ResponsiveImage Component

Optimized images with srcset:

```mdx
import ResponsiveImage from '@components/svelte/ResponsiveImage.svelte';

<ResponsiveImage src="/images/screenshot.png" alt="Screenshot description" width={800} height={600} client:visible />
```

## Translation Linking

Link content to its translation using `translationSlug`:

**English** (`src/content/blog/en/hello-world.mdx`):

```yaml
---
title: 'Hello World'
locale: 'en'
translationSlug: 'ahoj-svete'
---
```

**Czech** (`src/content/blog/cs/ahoj-svete.mdx`):

```yaml
---
title: 'Ahoj svete'
locale: 'cs'
translationSlug: 'hello-world'
---
```

The locale switcher uses this to navigate between translations.

See [Internationalization](i18n.md) for more details on bilingual content.

## Code Blocks

Code blocks use Expressive Code (Shiki-based) with syntax highlighting:

````mdx
```typescript
const greeting = 'Hello, Ambilab!';
console.log(greeting);
```
````

### Supported Languages

All languages supported by Shiki are available. Common ones:

- `typescript`, `javascript`, `jsx`, `tsx`
- `html`, `css`, `scss`
- `json`, `yaml`, `markdown`
- `bash`, `shell`
- `python`, `rust`, `go`

### Code Block Features

```typescript title="example.ts" {2-3}
const config = {
  name: 'Ambilab', // Highlighted line
  version: '1.0', // Highlighted line
};
```

## Best Practices

### Writing Content

1. **Use descriptive titles** - Clear, concise, SEO-friendly
2. **Write good descriptions** - 150-160 characters for meta description
3. **Use proper headings** – Start with `##` (h2), avoid skipping levels
4. **Add alt text** - All images need descriptive alt attributes
5. **Link translations** – Always link to the translated version

### Organization

1. **Consistent naming** – Use the kebab-case for filenames
2. **Date-based slugs** – Consider prefixing with date for chronological posts
3. **Tag consistency** – Use lowercase tags, reuse existing ones

### Performance

1. **Optimize images** – Use responsive images with proper sizes
2. **Lazy load embeds** - Use `client:visible` for below-fold content
3. **Minimize imports** – Only import components you need

## Error Pages

Custom error pages are located in `src/pages/`:

| Page | File        | Purpose             |
| ---- | ----------- | ------------------- |
| 404  | `404.astro` | Page not found      |
| 500  | `500.astro` | Server error        |
| 503  | `503.astro` | Service unavailable |

All error pages use the shared `ErrorPage` component and are localized.

## Related Documentation

- [Internationalization](i18n.md) – Bilingual content and translations
- [Components](components.md) - Available components for MDX
- [Deployment](deployment.md) – Publishing content to production
