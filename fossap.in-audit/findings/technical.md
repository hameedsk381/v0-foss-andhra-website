# Technical SEO Findings — fossap.in

**Category Score: 28/100**

---

## What Works
- HTTPS enforced on all pages
- robots.txt present and accessible
- Clean, logical URL structure (`/programs/fosstar`, `/contribute/donate`)
- Next.js 14 App Router (modern framework, SSR-capable)
- 404 handling appears functional
- No redirect loops detected

---

## Critical Issues

### 1. Sitemap Domain Mismatch — CRITICAL
**robots.txt at `fossap.in/robots.txt` contains:**
```
Sitemap: https://fossandhra.org/sitemap.xml
```
`fossandhra.org` does NOT resolve (DNS NXDOMAIN). This means:
- Google cannot find the sitemap via robots.txt
- Google has likely indexed only the homepage (confirmed: `site:fossap.in` returns 1 result)
- All 17 pages listed in the sitemap reference `fossandhra.org` URLs, not `fossap.in`

**Fix:**
1. Update `public/robots.txt` to point to `https://fossap.in/sitemap.xml`
2. Regenerate sitemap so all URLs use `fossap.in` domain
3. Submit updated sitemap to Google Search Console

---

### 2. JavaScript-Rendered Content Not Crawlable — CRITICAL
The Blog (`/blog`) and Events (`/events`) pages render "Loading..." in static HTML. Content is loaded via client-side JavaScript after hydration.

**Impact:** Google may not execute JavaScript during indexing for these pages, leaving them as empty shells. All blog posts and event listings are invisible to search engines.

**Evidence:**
- `/blog` page HTML contains: "Loading..." where posts should appear
- `/events` page HTML contains: "Loading events..." 
- No article/event content present in the fetched static HTML

**Fix:** Convert blog and events to use Next.js Server Components or `generateStaticParams` with `fetch()` at build time, OR use ISR (Incremental Static Regeneration) to pre-render content.

---

### 3. No Canonical URLs — CRITICAL
No `<link rel="canonical">` tag found on any page across the entire site. This creates risk of:
- Duplicate content penalties (e.g., trailing slash variants)
- Parameter-based duplication (`/payment?donationId=xxx` being indexed)
- Crawler confusion between `fossap.in` and any mirrors

**Fix:** Add canonical tags to all pages. In Next.js 14, use `generateMetadata()` with `alternates.canonical`.

---

### 4. No Security Headers — HIGH
No `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, or `Permissions-Policy` headers detected in page responses.

**Fix:** Add security headers in `next.config.js` headers configuration.

---

## Medium Issues

### 5. Missing `sitemap.xml` at Correct Domain — MEDIUM
While `fossap.in/sitemap.xml` returns content, all URLs inside it reference `fossandhra.org`. Googlebot sees these as external URLs pointing to a dead domain — not as pages of `fossap.in`.

**Fix:** Regenerate sitemap using `fossap.in` as the base URL. Use `next-sitemap` or a custom sitemap generator.

---

### 6. No `llms.txt` File — MEDIUM
AI crawlers (GPTBot, ClaudeBot, PerplexityBot) lack a structured entry point to understand the site's content.

**Fix:** Create `/public/llms.txt` with mission, programs, and contact info.

---

## Crawl Summary
| Page | HTTP Status | Indexed |
|------|-------------|---------|
| / | 200 | Yes (1 result in Google) |
| /about | 200 | Unknown |
| /programs/fosstar | 200 | Unknown |
| /blog | 200 | Empty (JS-rendered) |
| /events | 200 | Empty (JS-rendered) |
| /faq | 200 | Unknown |
| /contact | 200 | Unknown |
| /membership | 200 | Unknown |
| All program pages | 200 | Unknown |
