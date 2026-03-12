---
description: Validate bilingual content structure, translations, and security headers
---

# Content Validation Workflow

Run all content validation checks in parallel:

1. Check MDX frontmatter completeness (title, description, locale, translationSlug)
2. Verify translation links (en ↔ cs)
3. Validate security headers configuration
4. Check image alt text
5. Verify date formats

Commands to run:

```bash
pnpm validate:content
pnpm validate:translations
pnpm validate:security
```

Report violations with file paths and line numbers.
