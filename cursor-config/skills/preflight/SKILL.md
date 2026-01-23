---
description: Run all quality checks (format, lint, typecheck, spellcheck, knip) before committing
---

# Preflight Checks

Run comprehensive quality checks before committing or pushing code.

## Usage

```cursor
/preflight
```

## Steps

1. **Run all checks**
   - Execute `pnpm preflight` which runs:
     - `format:check` - Verify all files are formatted
     - `lint` - Check for lint errors (Biome + ESLint)
     - `typecheck` - Validate TypeScript types (tsc + Astro check)
     - `spellcheck` - Check spelling in code and docs
     - `knip` - Find unused exports and dependencies

2. **Report results**
   - If all checks pass: Confirm code is ready for commit
   - If any check fails: Report specific failures with file locations

3. **Suggest fixes**
   - For formatting issues: Suggest `pnpm format`
   - For lint errors: Suggest `pnpm lint:fix`
   - For type errors: Review the specific TypeScript issues
   - For spelling: Add words to `cspell.json` or fix typos
   - For unused exports: Remove unused code or add to knip ignore

## When to Use

- Before creating a commit
- Before pushing to remote
- Before creating a pull request
- After completing a significant feature
- When you want comprehensive validation

## Quick Checks

For faster feedback during development, use:

- `/format` - Format and verify formatting only
- Hook automatically runs `format` + `typecheck` after agent completion
