# Custom Icons Guidelines

This directory contains custom SVG icons for brand-specific needs that aren't covered by the Solar icon set.

## Design Guidelines

To ensure consistency with Solar icons, follow these guidelines:

### ViewBox and Dimensions

- Use a **24×24 viewBox**: `<svg viewBox="0 0 24 24">`
- Keep the design centered and balanced

### Colors

- Use **currentColor** for fills and strokes
- This allows icons to inherit text color and work with dark mode

```xml
<path fill="currentColor" ... />
<path stroke="currentColor" ... />
```

### Stroke Weights

- **Linear variants**: 1.5px stroke weight
- **Bold variants**: 2px stroke weight
- Use round line caps and joins for smoother appearance

```xml
stroke-width="1.5"
stroke-linecap="round"
stroke-linejoin="round"
```

### Optimization

- Optimize SVGs using SVGO before committing
- Remove unnecessary attributes (xmlns, width, height if viewBox is set)
- Simplify paths where possible

## Usage in Components

### In Astro files:

```astro
---
import CustomIcon from '../assets/icons/pixel-heart.svg?raw';
---

<Fragment set:html={CustomIcon} />
```

### In Svelte files:

```svelte
<script>
  import CustomIcon from '../assets/icons/pixel-heart.svg?raw';
</script>

{@html CustomIcon}
```

## Solar Icons Reference

We use Solar icons as our primary icon system. Custom icons should only be created when:

- The icon represents ambilab-specific branding
- No suitable Solar icon exists
- The icon needs pixel-art styling to match the brand

[Browse Solar icons](https://www.figma.com/community/file/1166831539721848736)
