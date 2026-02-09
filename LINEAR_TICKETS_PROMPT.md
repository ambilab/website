# Prompt for Claude Desktop (with Linear MCP)

Paste everything below the line into Claude Desktop.

---

I need you to create Linear tickets for an SEO & best practices audit of our Astro website (ambilab.com / ambilab.cz). This is a bilingual (English/Czech) Astro 5 site deployed on Cloudflare Pages with server-side rendering.

Please create a parent issue titled **"SEO & Best Practices Audit Implementation"** with the label `audit`, then create all the child issues below linked to it. Use the priority mappings I specify (P0 = Urgent, P1 = High, P2 = Medium, P3 = Low).

---

## Ticket 1 — [P0 / Urgent] Add `hreflang` tags for bilingual SEO

**Labels:** `seo`, `i18n`

**Description:**
The site uses two domains (ambilab.com for EN, ambilab.cz for CS) with linked translations via `translationSlug` in content frontmatter, but there are **zero `hreflang` annotations** anywhere in the HTML.

Without `hreflang`, Google may:
- Treat EN and CS pages as unrelated or duplicate content
- Serve the wrong language version to users
- Penalize both domains in rankings

**Acceptance criteria:**
- Every page includes `<link rel="alternate" hreflang="en" href="https://ambilab.com/..." />`
- Every page includes `<link rel="alternate" hreflang="cs" href="https://ambilab.cz/..." />`
- Every page includes `<link rel="alternate" hreflang="x-default" href="https://ambilab.com/..." />` (pointing to EN)
- `translationSlug` from content frontmatter is used to compute the cross-language URL
- Pages without a translation still declare their own `hreflang`

**Files to modify:** `src/components/astro/BaseHead.astro`, possibly `src/components/astro/PageLayout.astro` to pass translation data down.

**Blocked by:** None
**Blocks:** Ticket 7 (sitemap hreflang cross-references)

---

## Ticket 2 — [P0 / Urgent] Replace all placeholder content with real copy

**Labels:** `content`, `seo`

**Description:**
All body content across the site is lorem ipsum placeholder text. This includes:
- Homepage body content (`src/content/pages/en/index.mdx`, `src/content/pages/cs/index.mdx`)
- News post bodies (`src/content/news/en/hello-world.mdx`, `src/content/news/cs/ahoj-svete.mdx`)
- Page meta descriptions in frontmatter (e.g., `"Justice badly rarely small Wednesday..."`)
- `SITE.DESCRIPTION` in `src/config/site.ts` (`"A bilingual (English/Czech) marketing website..."`)
- EN footer description in `src/i18n/translations.ts` (`"What pink drop port tired new north highway ugly art finished happy."`)

No amount of technical SEO can compensate for pages with no real content. Google needs substantial, original content to index and rank pages.

**Acceptance criteria:**
- Every page has minimum 300+ words of meaningful, keyword-targeted content
- Every `description` frontmatter field is a real, actionable meta description under 160 characters
- `SITE.DESCRIPTION` in `src/config/site.ts` is updated
- Footer descriptions in both locales in `src/i18n/translations.ts` are updated
- All content is properly localized (not machine-translated without review)

**Blocked by:** None (can be done in parallel with all technical tickets)

---

## Ticket 3 — [P0 / Urgent] Fix broken `sitemap-index.xml` reference

**Labels:** `seo`, `bug`

**Description:**
`BaseHead.astro:168` contains `<link rel="sitemap" href="/sitemap-index.xml" />` but the actual sitemap endpoint is `/sitemap.xml` — there is no `/sitemap-index.xml` route. This is a broken reference that search engines will try to fetch and get a 404.

**Acceptance criteria:**
- Either change the `<link>` to point to `/sitemap.xml`, OR
- Create a proper sitemap index at `/sitemap-index.xml` that references `/en/sitemap.xml` and `/cs/sitemap.xml` as child sitemaps (preferred approach for multi-locale sites)

**Files to modify:** `src/components/astro/BaseHead.astro`, potentially add `src/pages/sitemap-index.xml.ts`

**Blocked by:** None

---

## Ticket 4 — [P1 / High] Add `BlogPosting` JSON-LD structured data for news posts

**Labels:** `seo`, `structured-data`

**Description:**
Individual news posts only have the generic `WebSite` + `Organization` schema from `BaseHead.astro`. They lack `BlogPosting` or `NewsArticle` JSON-LD, which means Google won't display rich results (date, author, reading time) in search.

**Acceptance criteria:**
- News posts include a `BlogPosting` JSON-LD block with: `headline`, `datePublished`, `dateModified`, `author` (Organization), `description`, `image`, `mainEntityOfPage`, `wordCount`
- Schema validates cleanly at https://validator.schema.org/
- The structured data is only added for news post pages, not regular pages

**Files to modify:** `src/components/astro/NewsPostLayout.astro` or `src/components/astro/BaseHead.astro` (conditionally)

**Related to:** Ticket 5

---

## Ticket 5 — [P1 / High] Use `og:type = "article"` and article meta tags for news posts

**Labels:** `seo`, `open-graph`

**Description:**
All pages use `og:type = "website"`. News posts should use `og:type = "article"` with additional Open Graph article tags. The `ISEOMetadata` interface already has `articlePublishedTime` and `articleModifiedTime` fields but they are **never passed or used**.

**Acceptance criteria:**
- News posts render `<meta property="og:type" content="article" />`
- News posts include `article:published_time`, `article:modified_time`, `article:tag`, `article:author`
- Regular pages continue to use `og:type = "website"`
- Props flow from `NewsPostLayout` → `PageLayout` → `Head` → `BaseHead`

**Files to modify:** `src/components/astro/BaseHead.astro`, `src/components/astro/NewsPostLayout.astro`

**Related to:** Ticket 4

---

## Ticket 6 — [P1 / High] Fix error pages to return proper HTTP status codes

**Labels:** `seo`, `bug`

**Description:**
In `src/pages/[...slug].astro:25`, when content is not found, the code does `return Astro.redirect('/404')` which returns a **302 redirect** to the `/404` page. Search engines see a 302 + 200 chain instead of a proper 404 status code. Same issue with the 500 redirect on line 22.

This means Google may index error pages or waste crawl budget following redirects.

**Acceptance criteria:**
- 404 errors return HTTP 404 directly without a redirect
- 500 errors return HTTP 500 directly without a redirect
- Use `Astro.rewrite('/404')` or render the error page inline with the correct status code

**Files to modify:** `src/pages/[...slug].astro`

**Blocked by:** None

---

## Ticket 7 — [P1 / High] Add `hreflang` cross-references in sitemaps

**Labels:** `seo`, `i18n`

**Description:**
The sitemaps list EN and CS URLs independently without cross-referencing. Per Google's multilingual sitemap guidelines, each `<url>` entry should include `<xhtml:link rel="alternate" hreflang="en" href="..." />` and `<xhtml:link rel="alternate" hreflang="cs" href="..." />`.

Example:
```xml
<url>
  <loc>https://ambilab.com/news/hello-world</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://ambilab.com/news/hello-world" />
  <xhtml:link rel="alternate" hreflang="cs" href="https://ambilab.cz/novinky/ahoj-svete" />
</url>
```

**Acceptance criteria:**
- Sitemap XML includes `xmlns:xhtml="http://www.w3.org/1999/xhtml"` namespace
- Each URL entry includes `xhtml:link` for all available language variants
- `translationSlug` from content frontmatter is used to find the paired content

**Files to modify:** `src/utils/sitemap.ts`, `src/pages/sitemap.xml.ts`

**Blocked by:** Ticket 1 (same hreflang logic can be shared)

---

## Ticket 8 — [P1 / High] Replace `logo-placeholder.png` with real logo

**Labels:** `seo`, `branding`

**Description:**
The JSON-LD `Organization` schema in `BaseHead.astro` references `logo-placeholder.png`. Google's structured data validator will flag this. The logo should be a real, high-quality image (minimum 112x112px, recommended 1200x1200px for best display).

**Acceptance criteria:**
- `public/logo-placeholder.png` is replaced with the real Ambilab logo
- The file reference in `BaseHead.astro` JSON-LD is updated
- Logo passes Google's Rich Results Test

**Blocked by:** None

---

## Ticket 9 — [P2 / Medium] Add `BreadcrumbList` structured data

**Labels:** `seo`, `structured-data`

**Description:**
No breadcrumb schema exists. Breadcrumbs in search results increase click-through rate and help Google understand site hierarchy (e.g., Home → News → Post Title).

**Acceptance criteria:**
- `BreadcrumbList` JSON-LD is rendered on news posts and subpages
- Breadcrumb items include `name` and `item` (URL)
- Home page does not render breadcrumbs
- Schema validates at https://validator.schema.org/

**Files to modify:** `src/components/astro/BaseHead.astro` or individual layout components

**Related to:** Ticket 4

---

## Ticket 10 — [P2 / Medium] Remove RSS feeds from robots.txt `Sitemap:` entries

**Labels:** `seo`, `bug`

**Description:**
Lines 25-26 of `public/robots.txt` list RSS feed URLs (`/en/rss.xml`, `/cs/rss.xml`) as `Sitemap:` entries. RSS feeds are not sitemaps — search engines may try to parse them as sitemaps and fail silently.

**Acceptance criteria:**
- RSS feed URLs removed from `Sitemap:` lines in `robots.txt`
- Only actual sitemap URLs remain in `Sitemap:` directives

**Files to modify:** `public/robots.txt`

---

## Ticket 11 — [P2 / Medium] Reduce font preloads to critical weights only

**Labels:** `performance`, `web-vitals`

**Description:**
7 font files are preloaded in `BaseHead.astro` (4 Innovator Grotesk weights + 2 Nerissimo + 1 Departure Mono). Each `<link rel="preload">` competes for bandwidth priority during initial page load, potentially delaying LCP.

**Acceptance criteria:**
- Only 2 critical font weights are preloaded (Regular 400 + one heading weight)
- Remaining font weights load normally via `font-display: swap`
- No visible FOUT regression (fonts still swap in quickly)
- Lighthouse font-related warnings reduced

**Files to modify:** `src/components/astro/BaseHead.astro`

---

## Ticket 12 — [P2 / Medium] Add `og:locale:alternate` meta tag

**Labels:** `seo`, `open-graph`, `i18n`

**Description:**
`og:locale` is present but there is no `og:locale:alternate` for the other language variant. Facebook and some platforms use this to determine available translations.

**Acceptance criteria:**
- EN pages include `<meta property="og:locale:alternate" content="cs_CZ" />`
- CS pages include `<meta property="og:locale:alternate" content="en_US" />`

**Files to modify:** `src/components/astro/BaseHead.astro`

**Related to:** Ticket 1

---

## Ticket 13 — [P2 / Medium] Expand Lighthouse CI to test more pages

**Labels:** `ci`, `performance`

**Description:**
Lighthouse CI (`lighthouserc.cjs`) only tests `http://localhost:4321/`. Performance regressions on content-heavy pages (news posts, news index, projects) go undetected.

**Acceptance criteria:**
- Lighthouse CI tests at least: homepage, a news post, the news index page, and the projects page
- `chromePath` is made environment-aware (auto-detect or conditional macOS/Linux paths)
- CI continues to pass with existing performance budgets

**Files to modify:** `lighthouserc.cjs`

---

## Ticket 14 — [P2 / Medium] Add `noindex` to draft and error pages

**Labels:** `seo`

**Description:**
`<meta name="robots" content="index, follow" />` is hardcoded in `BaseHead.astro` for all pages. Draft posts and error pages (404, 500, 503) should use `noindex` to prevent Google from indexing them.

**Acceptance criteria:**
- Error pages render `<meta name="robots" content="noindex, nofollow" />`
- Draft news posts (if ever rendered in preview) render `noindex`
- Regular published pages continue to use `index, follow`
- `BaseHead.astro` accepts an optional `noindex` prop

**Files to modify:** `src/components/astro/BaseHead.astro`, error page templates

---

## Ticket 15 — [P2 / Medium] Make news post tags linkable

**Labels:** `feature`, `seo`, `content`

**Description:**
News post tags display as plain `<span>#{tag}</span>` in `NewsPostLayout.astro`. Making them into links to tag archive pages would create more indexable entry points and improve content discoverability.

**Acceptance criteria:**
- Tags render as links (e.g., `/news/tag/announcement`)
- Tag archive pages list all posts with that tag
- Tag pages have proper meta tags and are included in the sitemap
- Tags work in both EN and CS locales

**Files to modify:** `src/components/astro/NewsPostLayout.astro`, new tag page route needed

**Note:** This is a larger feature. Consider splitting into subtasks if needed.

---

## Ticket 16 — [P3 / Low] Self-host fonts instead of loading from external domain

**Labels:** `performance`

**Description:**
Fonts load from `fonts.vancura.dev`, adding DNS lookup + TLS handshake latency despite `preconnect`. Self-hosting would eliminate this round-trip and improve LCP.

**Acceptance criteria:**
- Font files are served from the same domain (public/fonts/ or via the build)
- `@font-face` declarations updated to use local paths
- `preconnect` to `fonts.vancura.dev` removed
- CSP `font-src` and `style-src` directives updated in `src/config/security.ts`

**Files to modify:** `src/components/astro/BaseHead.astro`, `src/config/security.ts`, `public/fonts/`

---

## Ticket 17 — [P3 / Low] Add `Cache-Control` and `Last-Modified` headers to HTML pages

**Labels:** `performance`, `seo`

**Description:**
The middleware sets security headers but no caching headers. Adding `Cache-Control` would improve TTFB on Cloudflare's CDN edge, and `Last-Modified` would help crawlers know when to re-fetch.

**Acceptance criteria:**
- HTML pages return `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- News posts include `Last-Modified` based on `updatedDate` or `pubDate`
- Static assets retain appropriate long-term caching

**Files to modify:** `src/middleware.ts`

---

## Ticket 18 — [P3 / Low] Add Web App Manifest (`manifest.json`)

**Labels:** `pwa`, `performance`

**Description:**
The site has `<meta name="mobile-web-app-capable" content="yes">` but no actual `manifest.json`. Adding one improves the Lighthouse "installable" audit and provides better mobile add-to-homescreen experience.

**Acceptance criteria:**
- `public/manifest.json` exists with `name`, `short_name`, `icons`, `theme_color`, `background_color`, `display`
- `<link rel="manifest" href="/manifest.json">` added to `BaseHead.astro`
- Both locale domains serve the manifest

**Files to modify:** `public/manifest.json` (new), `src/components/astro/BaseHead.astro`

---

## Ticket 19 — [P3 / Low] Improve news card accessibility pattern

**Labels:** `a11y`

**Description:**
In `NewsList.astro`, each card is an `<a>` wrapping an `<article>` with `<h2>` and `<p>` inside. The entire card text becomes the link's accessible name, making screen reader announcements excessively verbose.

**Acceptance criteria:**
- Only the heading is the actual `<a>` link
- The card is made clickable via CSS (`::after` pseudo-element or relative/absolute positioning)
- Screen readers announce just the heading as the link text
- Visual behavior remains the same (entire card is clickable)

**Files to modify:** `src/components/astro/NewsList.astro`

---

## Cross-link summary

When creating the tickets, please set these relationships:

- **Ticket 1** (hreflang) **blocks** Ticket 7 (sitemap hreflang) — shared logic
- **Ticket 1** (hreflang) **relates to** Ticket 12 (og:locale:alternate)
- **Ticket 4** (BlogPosting JSON-LD) **relates to** Ticket 5 (og:type article)
- **Ticket 4** (BlogPosting JSON-LD) **relates to** Ticket 9 (BreadcrumbList)
- **Ticket 5** (og:type article) **relates to** Ticket 4 (BlogPosting JSON-LD)
- **Ticket 7** (sitemap hreflang) **is blocked by** Ticket 1 (hreflang)

Please create all 19 tickets + the parent issue. Use the project's default team/project if available, or ask me which team to assign them to.
