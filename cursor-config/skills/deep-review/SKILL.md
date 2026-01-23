---
description: Comprehensive code review with AI analysis, security audit, and PR-ready summary
---

# Deep Review

Comprehensive code review that combines automated checks, AI-powered analysis, and security auditing. Use this before
pushing significant changes or creating pull requests.

## Usage

```cursor
/deep-review
```

## Steps

1. **Run preflight checks**
   - Execute `pnpm preflight` (format, lint, typecheck, spellcheck, knip)
   - If any check fails, report issues and stop
   - All automated checks must pass before AI review

2. **Run security audit**
   - Execute `pnpm security:audit` (pnpm audit)
   - Report any vulnerabilities found (moderate and above)
   - Note: Pre-push hook blocks on high/critical; `/deep-review` reports all for awareness

3. **Gather change context**
   - Run `git diff origin/main...HEAD` to see all changes vs main
   - Run `git log origin/main..HEAD --oneline` to see commit history
   - Identify which files changed and their purpose

4. **Launch code-reviewer subagent**
   - Use the Task tool with `subagent_type: "code-reviewer"`
   - Provide the diff and ask for analysis of:
     - Bugs and logic errors
     - Security vulnerabilities
     - Code quality issues
     - Adherence to project conventions
   - Request confidence-based filtering (only high-priority issues)

5. **Check project-specific rules**
   - **RULE #1**: No emoji anywhere (code, comments, docs, commits)
   - Svelte components have `client:*` directives when imported in Astro
   - TypeScript uses strict types (no `any` - use `unknown` or proper types)
   - Translations exist for both `en` and `cs` if adding content
   - Semantic design tokens used (not hardcoded colors)
   - Images have `alt` attributes
   - Animations respect `prefers-reduced-motion`
   - Type imports use `import type` syntax
   - JSDoc comments for exported functions

6. **Generate PR-ready summary**
   - Create a summary suitable for PR description
   - Include sections below

## Output Format

```md
## Pre-Push Review Summary

### Changes Overview

- [Brief description of what changed]
- Files modified: X
- Lines added: +Y, removed: -Z

### Automated Checks

- [PASS/FAIL] Format check
- [PASS/FAIL] Lint check
- [PASS/FAIL] Type check
- [PASS/FAIL] Spell check
- [PASS/FAIL] Unused exports (knip)
- [PASS/FAIL] Security audit

### Code Review Findings

#### Critical Issues

- [File:Line] Description (must fix before merge)

#### Warnings

- [File:Line] Description (should address)

#### Suggestions

- Description (nice to have)

### Security Assessment

- Dependency vulnerabilities: [None/List]
- Code security concerns: [None/List]

### Impact Analysis

- What this change affects
- Potential risks or side effects
- Areas that may need additional testing

### Test Plan

- [ ] Manual testing steps
- [ ] Edge cases to verify
- [ ] Browser/device testing if applicable

### Verdict

[READY TO PUSH / NEEDS FIXES / NEEDS DISCUSSION]

Recommendation: [Brief recommendation]
```

## When to Use

- Before pushing to remote (replaces CodeRabbit review)
- Before creating a pull request
- After completing a feature branch
- When making security-sensitive changes
- For changes touching multiple areas of the codebase

## Comparison to /review

| Aspect      | /review                     | /deep-review                    |
| ----------- | --------------------------- | ------------------------------- |
| Speed       | Fast (seconds)              | Thorough (1-2 minutes)          |
| Checks      | lint, typecheck, spellcheck | Full preflight + security audit |
| AI Analysis | Rule-based only             | code-reviewer subagent          |
| Output      | Issue list                  | PR-ready summary                |
| Use Case    | Quick iteration             | Pre-push/PR                     |

## Tips

- Run `/review` during development for quick feedback
- Run `/deep-review` once before pushing
- Address all Critical Issues before pushing
- Warnings can be addressed in follow-up commits
- Copy the PR-ready summary to your pull request description
