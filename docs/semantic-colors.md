# Semantic Color System

The Ambilab website uses a **semantic color system** integrated with Tailwind CSS 4. Semantic color names are defined in
the `@theme` directive in [`src/styles/global.css`](../src/styles/global.css) and mapped to Tailwind utilities in
[`tailwind.config.ts`](../tailwind.config.ts). This replaces hardcoded color values (like `blue-600`, `gray-200`) with
purpose-based semantic names that clearly communicate intent.

## Why Semantic Colors?

Instead of using specific color values like `blue-600` or `gray-200` throughout the codebase, we use semantic names that
describe the **purpose** of the color. This provides:

- **Single source of truth**: Change colors in one place (`src/styles/global.css` @theme block)
- **Better maintainability**: Understand color purpose at a glance
- **Easier theming**: Swap color schemes without touching components
- **Consistency**: Ensure related elements use the same colors
- **Tailwind-native**: Works seamlessly with Tailwind utilities
- **IDE support**: Auto-complete works for all semantic color names

## Tailwind CSS 4 Architecture

This project uses **Tailwind CSS 4**, which requires custom colors to be defined in the `@theme` directive in CSS files
using CSS custom properties (e.g., `--color-link`), not in `tailwind.config.ts` like Tailwind CSS 3.

**How it works:**

1. Colors are defined as CSS custom properties in `@theme` block in `src/styles/global.css`
2. These are mapped to Tailwind utilities in `tailwind.config.ts` using `var(--color-*)` references
3. Use semantic classes like `text-link`, `bg-surface`, `border-border-default` in components

## Usage in Components

### Tailwind Utility Classes

Use semantic color names directly in Tailwind classes:

```astro
<!-- Borders -->
<div class="border border-border-default dark:border-border-default-dark">
  <!-- Backgrounds -->
  <div class="bg-surface dark:bg-surface-dark">
    <!-- Text -->
    <p class="text-text-muted dark:text-text-muted-dark">
      <!-- Links -->
      <a class="text-link hover:text-link-hover dark:text-link-dark"></a>
    </p>
  </div>
</div>
```

### CSS Files with @apply

In CSS files, use `@apply` with semantic color names:

```css
.my-element {
  @apply border border-border-default bg-surface text-text-primary;
  @apply dark:border-border-default-dark dark:bg-surface-dark dark:text-text-primary-dark;
}
```

Or for single properties:

```css
.my-link {
  @apply text-link hover:text-link-hover;
  @apply dark:text-link-dark dark:hover:text-link-hover-dark;
}
```

## Available Semantic Colors

All **67 semantic colors** are defined in the `@theme` block in [`src/styles/global.css`](../src/styles/global.css) and
can be used with Tailwind utilities. Each color has a corresponding `-dark` variant for the dark mode.

### Page and Surface Backgrounds (10 colors)

| Light Mode         | Dark Mode                    | Purpose                        |
| ------------------ | ---------------------------- | ------------------------------ |
| `bg-page-bg`       | `dark:bg-page-bg-dark`       | Main page background           |
| `bg-page-bg-muted` | `dark:bg-page-bg-muted-dark` | Muted sections (footer, aside) |
| `bg-surface`       | `dark:bg-surface-dark`       | Cards, modals                  |
| `bg-surface-hover` | `dark:bg-surface-hover-dark` | Hover states                   |
| `bg-surface-code`  | `dark:bg-surface-code-dark`  | Code blocks, kbd elements      |

### Borders (6 colors)

| Light Mode              | Dark Mode                         | Purpose                         |
| ----------------------- | --------------------------------- | ------------------------------- |
| `border-border-default` | `dark:border-border-default-dark` | Standard borders                |
| `border-border-medium`  | `dark:border-border-medium-dark`  | Form inputs, emphasized borders |
| `border-border-subtle`  | `dark:border-border-subtle-dark`  | Subtle separators               |

### Text Colors (six colors)

| Light Mode            | Dark Mode                       | Purpose             |
| --------------------- | ------------------------------- | ------------------- |
| `text-text-primary`   | `dark:text-text-primary-dark`   | Main body text      |
| `text-text-secondary` | `dark:text-text-secondary-dark` | Secondary text      |
| `text-text-muted`     | `dark:text-text-muted-dark`     | Captions, meta info |

### Links (six colors)

| Light Mode              | Dark Mode                         | Purpose           |
| ----------------------- | --------------------------------- | ----------------- |
| `text-link`             | `dark:text-link-dark`             | Link color        |
| `hover:text-link-hover` | `dark:hover:text-link-hover-dark` | Link hover color  |
| `text-link-active`      | `dark:text-link-active-dark`      | Active link state |

### Buttons (six colors)

| Light Mode                      | Dark Mode                                 | Purpose              |
| ------------------------------- | ----------------------------------------- | -------------------- |
| `bg-button-primary`             | `dark:bg-button-primary-dark`             | Primary button bg    |
| `hover:bg-button-primary-hover` | `dark:hover:bg-button-primary-hover-dark` | Primary button hover |
| `text-button-primary-text`      | `dark:text-button-primary-text-dark`      | Button text color    |

### Accents (17 colors)

| Light Mode              | Dark Mode                         | Purpose             |
| ----------------------- | --------------------------------- | ------------------- |
| `bg-info-bg`            | `dark:bg-info-bg-dark`            | Info backgrounds    |
| `border-info-border`    | -                                 | Info borders        |
| `bg-warning-bg`         | `dark:bg-warning-bg-dark`         | Warning backgrounds |
| `border-warning-border` | `dark:border-warning-border-dark` | Warning borders     |
| `text-warning-text`     | `dark:text-warning-text-dark`     | Warning text        |
| `text-warning-heading`  | `dark:text-warning-heading-dark`  | Warning headings    |
| `bg-warning-highlight`  | `dark:bg-warning-highlight-dark`  | Highlight/mark      |
| `text-success-text`     | `dark:text-success-text-dark`     | Success messages    |
| `text-error-text`       | `dark:text-error-text-dark`       | Error messages      |

### Tags and Badges (four colors)

| Light Mode      | Dark Mode                 | Purpose        |
| --------------- | ------------------------- | -------------- |
| `bg-tag-bg`     | `dark:bg-tag-bg-dark`     | Tag background |
| `text-tag-text` | `dark:text-tag-text-dark` | Tag text       |

### Tables (six colors)

| Light Mode                   | Dark Mode                              | Purpose        |
| ---------------------------- | -------------------------------------- | -------------- |
| `bg-table-header-bg`         | `dark:bg-table-header-bg-dark`         | Table headers  |
| `border-table-header-border` | `dark:border-table-header-border-dark` | Header borders |
| `border-table-border`        | `dark:border-table-border-dark`        | Cell borders   |

### Selection (four colors)

| Light Mode            | Dark Mode                       | Purpose             |
| --------------------- | ------------------------------- | ------------------- |
| `bg-selection-bg`     | `dark:bg-selection-bg-dark`     | Text selection bg   |
| `text-selection-text` | `dark:text-selection-text-dark` | Selected text color |

### Miscellaneous (two colors)

| Light Mode    | Dark Mode               | Purpose                 |
| ------------- | ----------------------- | ----------------------- |
| `text-anchor` | `dark:text-anchor-dark` | Heading permalink icons |

## Migration Patterns

When refactoring components, replace generic color classes with semantic names:

| Old Pattern                                            | Semantic Replacement                                                                                                  |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `border-gray-200 dark:border-gray-800`                 | `border-border-default dark:border-border-default-dark`                                                               |
| `text-gray-600 dark:text-gray-400`                     | `text-text-muted dark:text-text-muted-dark`                                                                           |
| `text-gray-900 dark:text-gray-100`                     | `text-text-primary dark:text-text-primary-dark`                                                                       |
| `bg-white dark:bg-gray-900`                            | `bg-surface dark:bg-surface-dark`                                                                                     |
| `bg-gray-50 dark:bg-gray-950`                          | `bg-page-bg-muted dark:bg-page-bg-muted-dark`                                                                         |
| `bg-gray-100 dark:bg-gray-800`                         | `bg-surface-code dark:bg-surface-code-dark`                                                                           |
| `text-blue-600 hover:text-blue-700 dark:text-blue-400` | `text-link hover:text-link-hover dark:text-link-dark`                                                                 |
| `bg-blue-600 hover:bg-blue-700`                        | `bg-button-primary hover:bg-button-primary-hover dark:bg-button-primary-dark dark:hover:bg-button-primary-hover-dark` |

## Adding New Semantic Colors

When adding new semantic colors:

1. Edit [`src/styles/global.css`](../src/styles/global.css)
2. Add to the `@theme` block using CSS custom properties
3. Use `theme()` function to reference Tailwind colors: `--color-my-color: theme('colors.blue.600')`
4. Always include `-dark` variant for dark mode support
5. Add mapping to [`tailwind.config.ts`](../tailwind.config.ts) in `theme.extend.colors`
6. Group with related colors
7. Update this documentation

**Example:**

```css
/* src/styles/global.css */
@theme {
  /* ... existing colors ... */

  /* Semantic Colors - Success */
  --color-success-bg: theme('colors.green.50');
  --color-success-bg-dark: theme('colors.green.950');
  --color-success-text: theme('colors.green.600');
  --color-success-text-dark: theme('colors.green.400');
}
```

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // ... existing colors ...
        'success-bg': 'var(--color-success-bg)',
        'success-bg-dark': 'var(--color-success-bg-dark)',
        'success-text': 'var(--color-success-text)',
        'success-text-dark': 'var(--color-success-text-dark)',
      },
    },
  },
} satisfies Config;
```

Then use:

```astro
<div class="bg-success-bg dark:bg-success-bg-dark text-success-text dark:text-success-text-dark">
  Operation successful!
</div>
```

## Components Using Semantic Colors

All components in the project use semantic colors. See the [Components documentation](components.md) for details on
individual components.

### Core Files

- [`src/styles/global.css`](../src/styles/global.css) - 67 semantic colors defined in @theme block
- [`src/styles/mdx-content.css`](../src/styles/mdx-content.css) - All MDX styling uses semantic classes
- [`tailwind.config.ts`](../tailwind.config.ts) - Color mappings to Tailwind utilities

### Layout Components

- `Header.astro` - Header borders and backgrounds
- `Footer.astro` - Footer borders, text, and links
- `PageLayout.astro` - Page background and text
- `ErrorPage.astro` - Error page styling

### Interactive Components

- `Button.svelte` - Button variants (primary, secondary, outline)
- `CookieBanner.svelte` - Banner styling
- `NewsletterForm.svelte` - Form colors and states
- `ThemeSwitcher.svelte` - Theme switcher styling

### Content Components

- `BlogPostLayout.astro` - Blog post metadata and tags
- `SocialLinks.astro` - Social link buttons
- `[...slug].astro` - Blog listing and post cards
- `Card.astro` - Content card container

### Specialized Components

- `DemoEmbed.svelte` - Demo embed states (dev, error, warning)
- `GoToTop.svelte` - Scroll to top button
- `LocaleSwitcher.svelte` - Locale switcher

## Testing

After modifying colors:

1. **Visual Check** – View pages in light mode, toggle to dark mode
2. **Hover States** – Check hover effects on interactive elements
3. **Focus States** – Verify focus indicators with keyboard navigation (Tab key)
4. **Color Contrast** – Check contrast ratios using browser DevTools (WCAG AA)
5. **Browser Testing** – Test on Chrome, Firefox, and Safari

## Related Documentation

- [Components](components.md) – Component library using semantic colors
- [Utilities](utilities.md) – DOM utilities including `toggleDarkMode()`
