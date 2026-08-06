# On-Page SEO Findings — fossap.in

**Category Score: 23/100**

---

## What Works
- Homepage title is well-structured: "FOSS Andhra - Free & Open Source Software Community in Andhra Pradesh"
- Events page has a unique title: "Events - Upcoming FOSS Workshops & Meetups | FOSS Andhra"
- About page has a good title: "About FOSS Andhra - Our Mission and Vision | FOSS Andhra"
- FAQ page title: "Frequently Asked Questions" (basic but functional)
- H1 tags present on all audited pages
- Navigation is clearly structured with logical groupings

---

## Critical Issues

### 1. Multiple Pages Missing Unique Title Tags — CRITICAL
Several pages revert to the homepage's default title instead of having page-specific titles:

| Page | Title Found |
|------|-------------|
| / | "FOSS Andhra - Free & Open Source Software Community in Andhra Pradesh" ✓ |
| /about | "About FOSS Andhra - Our Mission and Vision | FOSS Andhra" ✓ |
| /events | "Events - Upcoming FOSS Workshops & Meetups | FOSS Andhra" ✓ |
| /programs/fosstar | Falls back to homepage title ✗ |
| /programs/fosserve | Missing/default ✗ |
| /programs/fossync | Missing/default ✗ |
| /programs/fosstorm | Missing/default ✗ |
| /programs/fosstart | Missing/default ✗ |
| /contact | Falls back to homepage title ✗ |
| /contribute | Falls back to homepage title ✗ |
| /membership | Missing/default ✗ |

**Fix:** Add `generateMetadata()` to every page component that returns a unique `title` and `description`.

---

### 2. No Open Graph or Twitter Card Tags — CRITICAL
Zero social sharing metadata found on any page. When shared on LinkedIn, Twitter/X, WhatsApp, or Telegram, pages show no title, description, or image preview.

**Fix:** Add to `generateMetadata()` in each page or globally in `app/layout.tsx`:
```typescript
openGraph: {
  title: 'Page Title',
  description: 'Page description',
  url: 'https://fossap.in/page',
  siteName: 'FOSS Andhra',
  images: [{ url: 'https://fossap.in/og-image.jpg', width: 1200, height: 630 }],
  type: 'website',
},
twitter: {
  card: 'summary_large_image',
  title: 'Page Title',
  description: 'Page description',
  images: ['https://fossap.in/og-image.jpg'],
}
```

---

## High Issues

### 3. Missing Meta Descriptions (Repeated from Content) — HIGH
All 17+ pages lack meta descriptions. See content findings for details.

---

### 4. Heading Hierarchy Issues — HIGH
Several pages have heading structure problems:

- **FOSStar page**: H1 is "FOSStar", H2 is "Membership program connecting..." — correct. But then jumps to H3 "About FOSStar" — this H3 should be H2.
- **About page**: H2s include navigation section headers ("Programs", "About", "Contribute", "Legal") — these appear to be footer headings leaking into the page H2 structure, which confuses crawlers.
- **Contact page**: H1 is "Contact Us" — fine, but no H2 subheadings to organize the content.

---

### 5. Internal Linking — Medium Depth Pages Not Linked — MEDIUM
- The homepage links to all 7 programs (good)
- No internal links from blog posts (no blog posts exist)
- No links from program pages to related programs
- `/membership` page not linked from the main navigation
- `/contribute/donate` and `/contribute/volunteer` only accessible from /contribute — not cross-linked

---

### 6. Page Titles Not Keyword-Optimized for Local Search — MEDIUM
Current titles don't include local geo-modifiers. Missed opportunities:

| Page | Current Title Fragment | Suggested Improvement |
|------|----------------------|----------------------|
| FOSStar | (homepage default) | "FOSStar Membership Program — FOSS Andhra \| Vijayawada, AP" |
| FOSSynC | (missing) | "FOSSynC Student FOSS Clubs in Andhra Pradesh \| FOSS Andhra" |
| Contact | (homepage default) | "Contact FOSS Andhra — Vijayawada, Andhra Pradesh" |

---

## Image Alt Text Audit

| Image | Alt Text Status |
|-------|----------------|
| FOSS Andhra Logo (header) | Present (multiple instances) |
| Team photo on /about | Present ("FOSS Andhra Team photo") |
| Program logos | Present (descriptive names) |
| Social media icons (footer) | Unknown — needs verification |
| Hero section images | Unknown — needs verification |

**Action:** Audit all `<img>` elements and SVG icons to ensure non-decorative images have descriptive alt text.
