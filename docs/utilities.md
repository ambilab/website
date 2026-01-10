# Utilities

The project provides utility functions organized by purpose. All utilities are TypeScript with strict typing and are
safe for server-side rendering (SSR) where applicable.

## Scroll Utilities

**Location**: [`src/utils/scroll.ts`](../src/utils/scroll.ts)

### smoothScrollTo

Smooth scroll to an element with offset support and completion callbacks.

```typescript
import { smoothScrollTo } from '@utils/scroll';

smoothScrollTo({
  target: '#section-id', // Element selector or HTMLElement
  offset: 80, // Offset from top (e.g., for sticky header)
  behavior: 'smooth', // 'smooth' | 'instant' | 'auto'
  onComplete: () => {
    // Optional callback when scroll completes
    console.log('Scroll finished');
  },
});
```

### scrollToTop

Scroll to the top of the page.

```typescript
import { scrollToTop } from '@utils/scroll';

scrollToTop(true); // Smooth scroll
scrollToTop(false); // Instant scroll
```

## DOM Utilities

**Location**: [`src/utils/dom.ts`](../src/utils/dom.ts)

### prefersReducedMotion

Check if the user prefers reduced motion. SSR-safe (returns `false` on the server).

```typescript
import { prefersReducedMotion } from '@utils/dom';

if (prefersReducedMotion()) {
  // Skip animations
}
```

### toggleDarkMode

Toggle the dark mode with localStorage persistence. Adds/removes `dark` class on `<html>`.

```typescript
import { toggleDarkMode } from '@utils/dom';

toggleDarkMode(); // Toggles between light and dark mode
```

**Behavior:**

- Adds or removes the `dark` class on `<html>`
- Persists preference in `localStorage` under key `theme`
- SSR-safe (does nothing on the server)

## Image Utilities

**Location**: [`src/lib/images.ts`](../src/lib/images.ts)

### getResponsiveSizes

Generate responsive `sizes` attribute for images.

```typescript
import { getResponsiveSizes } from '@lib/images';

// Use default sizes (full width on mobile, max 1200px on large screens)
const sizes = getResponsiveSizes();
// Returns: "(max-width: 640px) 100vw, (max-width: 768px) 100vw, ..."

// Or provide custom sizes
const customSizes = getResponsiveSizes('(max-width: 768px) 100vw, 50vw');
```

### IMAGE_BREAKPOINTS

Standard responsive breakpoints matching Tailwind CSS.

```typescript
const IMAGE_BREAKPOINTS = {
  sm: 640, // Mobile
  md: 768, // Tablet
  lg: 1024, // Desktop
  xl: 1280, // Large desktop
  '2xl': 1536, // Extra large desktop
} as const;
```

## i18n Utilities

**Location**: [`src/i18n/utils.ts`](../src/i18n/utils.ts)

For detailed internationalization documentation, see [Internationalization](i18n.md).

### detectLocaleFromUrl

Detect the locale from the URL hostname.

```typescript
import { detectLocaleFromUrl } from '@i18n/utils';

const locale = detectLocaleFromUrl(new URL('https://ambilab.cz/about'));
// Returns: 'cs'
```

### getLocaleFromCookie

Get locale from request cookie.

```typescript
import { getLocaleFromCookie } from '@i18n/utils';

const locale = getLocaleFromCookie(request);
// Returns: 'en' | 'cs' | null
```

### setLocaleCookie

Set the locale preference cookie (client-side).

```typescript
import { setLocaleCookie } from '@i18n/utils';

setLocaleCookie('cs'); // Sets locale cookie to Czech
```

### getLocalizedPath

Generate localized URL paths.

```typescript
import { getLocalizedPath } from '@i18n/utils';

const path = getLocalizedPath('/about', 'cs');
// Returns: '/cs/about' or similar based on routing config
```

### calculateReadingTime

Estimate reading time for content (200 words per minute).

```typescript
import { calculateReadingTime } from '@i18n/utils';

const minutes = calculateReadingTime('Long article content...');
// Returns: number (e.g., 5 for a 1000-word article)
```

## General Utilities

### debounce

**Location**: [`src/utils/debounce.ts`](../src/utils/debounce.ts)

Debounce function calls with cancel support.

```typescript
import { debounce } from '@utils/debounce';

const debouncedSearch = debounce((query: string) => {
  // Perform search
}, 300);

// Use in event handler
input.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Cancel pending calls if needed
debouncedSearch.cancel();
```

### safeExecute

**Location**: [`src/utils/safe-execute.ts`](../src/utils/safe-execute.ts)

Safe function execution with error handling and fallback.

```typescript
import { safeExecute } from '@utils/safe-execute';

const result = safeExecute(() => riskyOperation(), 'fallback value', 'Custom error message');
```

### formatDate

**Location**: [`src/utils/formatDate.ts`](../src/utils/formatDate.ts)

Locale-aware date formatting.

```typescript
import { formatDate } from '@utils/formatDate';

const formatted = formatDate(new Date(), 'en');
// Returns: "January 9, 2026" (or localized equivalent)

const czechDate = formatDate(new Date(), 'cs');
// Returns: "9. ledna 2026"
```

### createLogger

**Location**: [`src/utils/logger.ts`](../src/utils/logger.ts)

Create a scoped logger with the prefix.

```typescript
import { createLogger } from '@utils/logger';

const logger = createLogger({ prefix: 'MyComponent' });

logger.info('Component initialized'); // [MyComponent] Component initialized
logger.warn('Something unusual'); // [MyComponent] Something unusual
logger.error('Something failed', err); // [MyComponent] Something failed
```

## Usage in Components

### Svelte Components

```svelte
<script lang="ts">
  import { debounce } from '@utils/debounce';
  import { scrollToTop } from '@utils/scroll';
  import { onMount } from 'svelte';

  const handleScroll = debounce(() => {
    // Handle scroll event
  }, 100);

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>
```

### Astro Components

```astro
---
import { formatDate } from '@utils/formatDate';
import { calculateReadingTime } from '@i18n/utils';

const { locale, content, pubDate } = Astro.props;

const readingTime = calculateReadingTime(content);
const formattedDate = formatDate(pubDate, locale);
---

<time datetime={pubDate.toISOString()}>{formattedDate}</time>
<span>{readingTime} min read</span>
```

## Related Documentation

- [Components](components.md) – Components using these utilities
- [Internationalization](i18n.md) - Detailed i18n utility documentation
- [Semantic Colors](semantic-colors.md) – Color system with `toggleDarkMode()`
