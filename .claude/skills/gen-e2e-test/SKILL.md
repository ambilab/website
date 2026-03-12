---
description: Generate Playwright E2E test for new component or feature
---

# E2E Test Generation

When user requests `/gen-e2e-test <feature-name>`:

1. Analyze existing test patterns in `tests/e2e/`
2. Identify similar components (reference: theme-switching.spec.ts for client directives, locale-switching.spec.ts for
   i18n)
3. Generate test file with:
   - Feature flag detection (if applicable)
   - Type imports (`import type { Page } from '@playwright/test'`)
   - Test isolation (fresh context per test)
   - Accessibility checks
4. Create test file in `tests/e2e/<feature-name>.spec.ts`
5. Run `pnpm test:e2e` to verify

Example template structure from existing tests:

- Setup with runtime feature detection
- User interaction scenarios
- Accessibility validation
- Cross-locale testing (if i18n relevant)
