---
description: Quickly format all code files without verification steps
---

# Quick Format

Rapidly format all code files using the project's formatters. This is a streamlined version of `/format` that skips
verification steps for maximum speed.

## Usage

```cursor
/quick-format
```

## Steps

1. **Run formatters**
   - Execute `pnpm format` which runs:
     - Biome for TypeScript/JavaScript/JSON
     - ESLint auto-fix for fixable lint issues
     - Prettier for Astro/Svelte/Markdown/YAML with Tailwind class reordering

2. **Brief confirmation**
   - Report completion
   - Note any files that couldn't be formatted (usually indicates syntax errors)

## When to Use

- Quick cleanup after manual edits
- Before running other checks
- When you know you just need formatting (not verification)
- To fix formatting issues reported by CI or hooks

## Comparison to /format

| Aspect   | /quick-format | /format                                      |
| -------- | ------------- | -------------------------------------------- |
| Speed    | Fastest       | Fast (adds verification)                     |
| Steps    | Format only   | Format + diff summary + verification         |
| Output   | Minimal       | Detailed (what changed, verification pass)   |
| Use Case | Quick cleanup | When you need to verify what was reformatted |

## Related Commands

- `/format` - Format with verification and detailed output
- `/preflight` - Format + lint + typecheck + tests + spellcheck + knip

## Formatting Rules

- Indent: 4 spaces (2 for JSON/YAML/Markdown)
- Line width: 120 characters
- Quotes: Single quotes
- Semicolons: Always
- Trailing commas: Always
- Tailwind classes: Automatically reordered to standard order
