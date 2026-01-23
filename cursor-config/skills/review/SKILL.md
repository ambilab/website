---
description: Review current changes against project rules, conventions, and quality standards
---

# Review Changes

Review current changes against project rules and quality standards.

## Usage

```cursor
/review
```

## Steps

1. **Gather changes**
   - Run `git diff` to see all unstaged modifications
   - Run `git diff --cached` to see staged changes
   - List which files were modified and what changed

2. **Run automated checks**
   - `pnpm lint` - Report any lint issues
   - `pnpm typecheck` - Report any type errors
   - `pnpm spellcheck` - Check for spelling issues

3. **Check against project rules**
   - **RULE #1**: No emoji anywhere (code, comments, docs, commits)
   - Svelte components have `client:*` directives when imported in Astro
   - TypeScript uses strict types (no `any` - use `unknown` or proper types)
   - Translations exist for both `en` and `cs` if adding content
   - Semantic design tokens used (not hardcoded colors like `gray-900`)
   - Images have `alt` attributes
   - Animations respect `prefers-reduced-motion`
   - Type imports use `import type` syntax

4. **Review code quality**
   - Proper error handling (guard clauses, null checks)
   - Consistent naming conventions
   - JSDoc comments for exported functions
   - Path aliases used (`@components/*`, `@utils/*`, etc.)
   - Proper imports (external, internal, relative order)

5. **Summarize findings**
   - List critical issues that must be fixed
   - List warnings and suggestions for improvement
   - Highlight any security concerns
   - Note missing tests or documentation

## Output Format

```md
## Critical Issues

- [File:Line] Description of issue

## Warnings

- [File:Line] Description of warning

## Suggestions

- Consider doing X for better Y

## Summary

Overall assessment of the changes and readiness for commit.
```

## When to Use

- Before committing changes
- After making significant modifications
- When unsure if changes follow project conventions
- Before requesting code review from team
