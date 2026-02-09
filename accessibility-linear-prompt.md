I need you to create a set of Linear issues for an accessibility improvement project for the Ambilab website (an Astro + Svelte + Tailwind site). Create a parent issue first, then create all child issues linked to it. Use the labels "accessibility" and "a11y" if they exist, or create them. Assign priority levels as specified.

## Parent Issue

**Title:** Comprehensive Accessibility Improvements for Ambilab Website
**Priority:** High
**Description:**

```
## Overview
Audit-driven accessibility improvements for ambilab.com / ambilab.cz — a bilingual (EN/CS) Astro website with Svelte interactive components and Tailwind CSS.

The site already has a solid a11y foundation (skip nav, landmarks, focus trap, prefers-reduced-motion, aria-current, inert, etc). These tickets address the remaining gaps to reach full WCAG 2.2 AA compliance.

## Scope
- ARIA label localization (Czech screen reader users currently hear English)
- Form accessibility (labels, live regions, autocomplete)
- Landmark and semantic HTML improvements
- Color contrast and text readability
- SEO/i18n crossover (`hreflang` alternate links)
- Content structure and heading hierarchy

## Key Files
- `src/i18n/translations.ts` — all UI strings
- `src/components/astro/` — layout and structural components
- `src/components/svelte/` — interactive components
- `src/styles/global.css` — global styles and theme variables
- `src/components/astro/BaseHead.astro` — `<head>` metadata

## Acceptance Criteria
All child issues resolved and verified with axe DevTools + VoiceOver/NVDA manual testing.
```

---

Now create the following child issues, all linked to the parent. Group them by priority.

---

## High Priority Issues (Priority: Urgent)

### Issue 1

**Title:** Localize all hardcoded English aria-labels for Czech screen reader users
**Priority:** Urgent
**Description:**

```
## Problem
Several interactive components have `aria-label` values hardcoded in English. Czech users with screen readers hear English labels on an otherwise Czech page.

## Affected Components
| Component | File | Current Value |
|---|---|---|
| ThemeSwitcher | `src/components/svelte/ThemeSwitcher.svelte:68-69` | `aria-label="Toggle theme"`, `title` in English |
| GoToTop | `src/components/svelte/GoToTop.svelte:52` | `aria-label="Go to top"` |
| MobileMenu | `src/components/svelte/MobileMenu.svelte:312` | `aria-label="Close menu"` / `"Open menu"` |
| LocaleSwitcher | `src/components/svelte/LocaleSwitcher.svelte:48` | `aria-label="Switch language"` |
| Menu (logo) | `src/components/astro/Menu.astro:37` | `aria-label="Ambilab Home"` |
| DemoEmbed | `src/components/svelte/DemoEmbed.svelte:160` | `title="Demo embed"` fallback |

## Solution
1. Add new keys to `translations.ts` under the `a11y` section:
   - `openMenu`, `closeMenu`, `toggleTheme`, `switchToLightMode`, `switchToDarkMode`
   - `goToTop`, `switchLanguage`, `homeLinkLabel`, `demoEmbedTitle`
2. Pass `locale` prop to ThemeSwitcher and GoToTop (they currently don't receive it)
3. Replace all hardcoded strings with `t.a11y.*` lookups

## Acceptance Criteria
- All `aria-label` and `title` attributes are localized in both EN and CS
- Screen reader testing confirms Czech labels on Czech pages
```

### Issue 2

**Title:** Add proper `<label>` element to newsletter email input
**Priority:** Urgent
**Description:**

```
## Problem
`src/components/svelte/NewsletterForm.svelte:68-75` — The email input relies solely on `placeholder` text for its label. Placeholder text disappears on focus and is not reliably announced by all screen readers (notably older NVDA/JAWS versions).

## Solution
Add a visually hidden `<label>` associated with the input:

```html
<label for="newsletter-email" class="sr-only">{t.newsletter.emailPlaceholder}</label>
<input id="newsletter-email" type="email" ... />
```

Also add `autocomplete="email"` to the input for better autofill support.

## Acceptance Criteria
- `<label>` element present and visually hidden
- `for`/`id` association is correct
- `autocomplete="email"` attribute present
- Screen reader announces the label on focus
```

### Issue 3

**Title:** Add `aria-live` region for newsletter form status messages
**Priority:** Urgent
**Description:**

```
## Problem
`src/components/svelte/NewsletterForm.svelte:90-94` — Success and error messages appear dynamically after form submission but are not in an ARIA live region. Screen readers will not announce these state changes.

## Solution
Wrap the message area in a live region that is always in the DOM:

```html
<div aria-live="polite" role="status">
  {#if message}<p>{message}</p>{/if}
</div>
```

The container must exist in the DOM before the message appears — don't conditionally render the live region itself.

## Acceptance Criteria
- Live region container is always present in the DOM
- `aria-live="polite"` and `role="status"` on the container
- Screen reader announces success/error messages when they appear
```

### Issue 4

**Title:** Add `hreflang` alternate links between language versions
**Priority:** Urgent
**Description:**

```
## Problem
`src/components/astro/BaseHead.astro` has no `<link rel="alternate" hreflang="...">` tags linking the EN and CS versions of each page. This is critical for:
- Screen readers and assistive tech discovering alternate language versions
- SEO (Google uses hreflang for serving correct language)
- Browser language preference matching

## Solution
Add to `BaseHead.astro`:

```html
<link rel="alternate" hreflang="en" href="https://ambilab.com{currentPath}" />
<link rel="alternate" hreflang="cs" href="https://ambilab.cz{currentPath}" />
<link rel="alternate" hreflang="x-default" href="https://ambilab.com{currentPath}" />
```

Use `translationPath` if available for pages with different slugs (e.g., `/projects` vs `/projekty`).

Also add `hreflang` to the existing RSS `<link rel="alternate">` tags (lines 169-180).

## Acceptance Criteria
- Every page has 3 hreflang links (en, cs, x-default)
- Pages with different slugs across locales use the correct translated path
- RSS alternate links include hreflang attribute
```

---

## Medium Priority Issues (Priority: High)

### Issue 5

**Title:** Wrap footer navigation links in `<nav>` landmark
**Priority:** High
**Description:**

```
## Problem
`src/components/astro/Footer.astro:30-48` — Footer contains a navigation link list (Home, News, Projects) but it's not wrapped in a `<nav>` element. Screen reader users navigating by landmarks will miss these links.

## Solution
Wrap the `<ul>` in `<nav aria-label={t.footer.navigation}>`. The translation key `footer.navigation` already exists in both languages.

## Acceptance Criteria
- Footer links wrapped in `<nav>` with localized `aria-label`
- Landmark is discoverable via screen reader landmark navigation
```

### Issue 6

**Title:** Add "opens in new tab" indication to external links
**Priority:** High
**Description:**

```
## Problem
`src/components/astro/SocialLinks.astro:15-23` — External links with `target="_blank"` don't indicate to screen reader users that they will open in a new tab/window.

## Solution
Add a localized aria-label:

```html
<a href={link.url} target="_blank" rel="noopener noreferrer"
   aria-label={`${link.name} (${t.a11y.opensInNewTab})`}>
```

Add `opensInNewTab` translation key: EN "opens in new tab" / CS "otevře se v novém panelu".

## Acceptance Criteria
- All `target="_blank"` links have accessible indication
- Translation exists for both languages
```

### Issue 7

**Title:** Refactor news card link structure to reduce screen reader verbosity
**Priority:** High
**Description:**

```
## Problem
`src/components/astro/NewsList.astro:31-45` — Each card is wrapped entirely in an `<a>` tag, meaning screen readers announce the entire card content (title + date + description) as one giant link. This is verbose and confusing.

## Solution
Move the link to just the heading and use a CSS pseudo-element to make the whole card clickable:

```html
<article class="relative ...">
  <h2><a href={postUrl} class="after:absolute after:inset-0">{post.data.title}</a></h2>
  <time ...>{date}</time>
  <p>{description}</p>
</article>
```

## Acceptance Criteria
- Screen reader announces the link as just the title text
- Entire card is still visually clickable
- Hover/focus styles still work on the card
```

### Issue 8

**Title:** Add `role="alertdialog"` to cookie consent banner
**Priority:** High
**Description:**

```
## Problem
`src/components/svelte/CookieBanner.svelte:65-83` — The cookie banner is a fixed-position overlay that requires user action, but has no ARIA role identifying it as a notification.

## Solution

```html
<div role="alertdialog" aria-label={t.cookie.bannerLabel} ...>
```

Add `cookie.bannerLabel` translation: EN "Cookie notice" / CS "Oznámení o cookies".

## Acceptance Criteria
- Banner announced as an alert dialog by screen readers
- Has a localized `aria-label`
```

### Issue 9

**Title:** Audit and fix color contrast for WCAG 2.2 AA compliance
**Priority:** High
**Description:**

```
## Problem
Several color combinations may fail WCAG AA contrast requirements, especially at the small 11px text size used throughout:

| Combination | Context | Concern |
|---|---|---|
| `zinc.600` on `zinc.200` | `text-text-secondary` on `bg-page-bg` (light) | ~4.1:1, fails for small text |
| `lime.600` on `zinc.200` | Link color on page background (light) | Lime green often has poor contrast |
| `lime.400` on `zinc.900` | Link color in dark mode | Needs verification |
| `#7aa740` on `zinc.200` | Focus ring on light background | May not meet 3:1 for UI components |
| `#668e20` on `zinc.900` | Focus ring on dark background | Needs verification |

## Solution
1. Run axe DevTools and WAVE evaluator on the deployed site
2. Test every text color / background combination at the actual rendered size
3. Adjust CSS variables in `src/styles/global.css` to meet minimum ratios:
   - 4.5:1 for normal text (WCAG AA)
   - 3:1 for large text and UI components
   - 7:1 for enhanced contrast (WCAG AAA, stretch goal)

## Acceptance Criteria
- Zero contrast-related violations in axe DevTools
- All text meets 4.5:1 AA ratio at rendered size
- Focus indicators meet 3:1 ratio against adjacent colors
```

### Issue 10

**Title:** Improve text readability — review 11px text and all-uppercase usage
**Priority:** High
**Description:**

```
## Problem
- `text-[11px]` monospace text is used pervasively (nav, footer, dates, cookie banner, metadata). This is well below the 16px WCAG-recommended base.
- `text-transform: uppercase` is applied to all headings (h1-h3) and most UI text. Research shows uppercase text reduces reading speed by 13-20%.

## Solution
1. Increase minimum text size to at least 12-13px (ideally 14px) for all mono UI text
2. Review whether `text-transform: uppercase` is necessary on all headings, or if it can be limited to h1 only
3. Consider `font-variant-caps: all-small-caps` as an alternative that preserves readability

## Acceptance Criteria
- No text on the site rendered below 12px
- Uppercase usage reviewed and reduced where it harms readability
- Visual design approval from team before shipping
```

---

## Low Priority Issues (Priority: Medium)

### Issue 11

**Title:** Fix heading hierarchy in footer (orphaned h3/h4)
**Priority:** Medium
**Description:**

```
## Problem
`src/components/astro/Footer.astro:22,52` — The footer uses `<h3>` and `<h4>` elements that appear outside any `<h1>`/`<h2>` context. Screen reader users navigating by heading encounter orphaned headings.

## Solution
Replace with visually-styled `<p>` or `<span>` elements using the same classes, or use `role="heading" aria-level="2"` if heading semantics are desired.

## Acceptance Criteria
- No orphaned headings in the document outline
- Visual appearance unchanged
```

### Issue 12

**Title:** Remove `select-none` from content text areas
**Priority:** Medium
**Description:**

```
## Problem
`user-select: none` is applied to content-bearing areas:
- `NewsList.astro:25` (news cards)
- `CookieBanner.svelte:66` (cookie message)
- `Footer.astro:18` (entire footer)

This prevents users from selecting/copying text, harming users who need text-to-speech tools, translation, or simply want to copy information.

## Solution
Only apply `select-none` to purely decorative or UI-control elements (icon buttons, decorative separators). Remove it from all content text.

## Acceptance Criteria
- Footer text, news card text, and cookie message text are selectable
- UI buttons and icons remain non-selectable
```

### Issue 13

**Title:** Add `aria-label` to mobile menu `<nav>` element
**Priority:** Medium
**Description:**

```
## Problem
`src/components/svelte/MobileMenu.svelte:369` — The mobile `<nav>` has no `aria-label`, making it indistinguishable from the desktop `<nav aria-label="Main navigation">` in the landmark list.

## Solution
Add a matching localized label. Since only one nav is visible at a time (desktop hidden on mobile, vice versa), using the same "Main navigation" label is acceptable. Alternatively, add a distinct label like "Mobile navigation".

## Acceptance Criteria
- Mobile `<nav>` has an `aria-label` attribute
- Label is localized in both EN and CS
```

### Issue 14

**Title:** Add SVG `aria-hidden` and `role="img"` where appropriate
**Priority:** Medium
**Description:**

```
## Problem
- `Menu.astro:38-45` — Logo SVG lacks `aria-hidden="true"` (the parent `<a>` has `aria-label`, so the SVG should be hidden to prevent double announcement)
- `ThemeSwitcher.svelte:71-73`, `GoToTop.svelte:54-56`, `MobileMenu.svelte:317-345` — Icon SVGs lack `aria-hidden="true"`

## Solution
Add `aria-hidden="true"` to all decorative/icon SVGs that are already labeled by their parent element.

## Acceptance Criteria
- All icon SVGs have `aria-hidden="true"`
- No double announcements by screen readers
```

---

After creating all issues, please give me a summary table with the issue IDs and titles so I can reference them.
