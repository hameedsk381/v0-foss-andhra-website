# SEO Action Plan — fossap.in
**Audit Date:** 2026-07-04 | **Health Score: 31/100**

---

## Phase 1 — Critical Fixes (Week 1)

These issues are actively suppressing indexation. Fix first.

### 1. Fix robots.txt Sitemap URL ⏱ 5 min
**File:** `public/robots.txt`
```
# Before
Sitemap: https://fossandhra.org/sitemap.xml

# After
Sitemap: https://fossap.in/sitemap.xml
```
**Why now:** Google cannot find the sitemap. Only 1 page is indexed. This single fix unlocks indexation of all 17 pages.

### 2. Regenerate Sitemap with Correct Domain ⏱ 15 min
Install and configure `next-sitemap`:
```bash
bun add next-sitemap
```
Create `next-sitemap.config.js`:
```js
module.exports = {
  siteUrl: 'https://fossap.in',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
}
```
Add to `package.json` scripts: `"postbuild": "next-sitemap"`

### 3. Submit Sitemap to Google Search Console ⏱ 10 min
- Go to https://search.google.com/search-console
- Add property: `fossap.in`
- Submit sitemap: `https://fossap.in/sitemap.xml`
- Request indexing for the homepage

### 4. Add Meta Descriptions to All Pages ⏱ 2 hours
Add `generateMetadata()` to every page. Priority order:

| Page | Suggested Meta Description |
|------|---------------------------|
| `/` | "FOSS Andhra promotes free and open source software across Andhra Pradesh. 500+ members, 7 programs, 50+ events. Join our community in Vijayawada." |
| `/about` | "Learn about FOSS Andhra's mission to digitalize education and governance in Andhra Pradesh through open source. Based in Vijayawada since our founding." |
| `/programs/fosstar` | "Join FOSStar — FOSS Andhra's membership program for students, professionals, and institutions. Access resources, events, and the FOSS community in AP." |
| `/programs/fosserve` | "FOSServe promotes open source solutions in Andhra Pradesh's educational institutions and government bodies. Partner with us to transform your organization." |
| `/programs/fossync` | "FOSSynC helps colleges in Andhra Pradesh start student-led FOSS clubs. Get mentorship, resources, and connect with the FOSS community across AP." |
| `/programs/fosstorm` | "FOSStorm develops open source projects addressing local challenges in Andhra Pradesh. Collaborate on impactful solutions for education and governance." |
| `/programs/fosstart` | "FOSStart incubates open source startups in Andhra Pradesh with funding, mentorship, and networking. Build a sustainable business on open source principles." |
| `/events` | "Upcoming FOSS workshops, meetups, and hackathons in Andhra Pradesh. View past events and register for upcoming sessions by FOSS Andhra." |
| `/blog` | "Read the latest news, tutorials, and insights on free and open source software from FOSS Andhra's community in Andhra Pradesh." |
| `/contact` | "Contact FOSS Andhra in Vijayawada. Email us at office@fossap.in or call +91 94944 63840. We're open Mon–Fri, 9 AM–5 PM." |
| `/membership` | "Explore FOSS Andhra membership tiers for students, professionals, and institutions. Access exclusive FOSS resources and join our Andhra Pradesh community." |
| `/faq` | "Frequently asked questions about FOSS Andhra, our membership programs, FOSSynC student clubs, and how to contribute to open source in Andhra Pradesh." |
| `/contribute` | "Contribute to FOSS Andhra through donations, volunteering, or corporate sponsorship. Help advance open source adoption in Andhra Pradesh." |

### 5. Add Organization JSON-LD Schema ⏱ 30 min
Add to `app/layout.tsx` inside a `<Script type="application/ld+json">`:

```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "FOSS Andhra",
  "alternateName": "Free & Open Source Software Community in Andhra Pradesh",
  "url": "https://fossap.in",
  "logo": "https://fossap.in/logo.png",
  "description": "Promoting free and open source software in education, governance, and society across Andhra Pradesh",
  "email": "office@fossap.in",
  "telephone": "+91-94944-63840",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Yesj Centre for Excellence",
    "addressLocality": "Vijayawada",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "520008",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://twitter.com/fossandhra",
    "https://github.com/fossandhra",
    "https://linkedin.com/company/fossandhra",
    "https://youtube.com/@fossandhra"
  ]
}
```

### 6. Add Canonical URLs to All Pages ⏱ 30 min
In each page's `generateMetadata()`:
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Page Title | FOSS Andhra',
    description: 'Page description...',
    alternates: {
      canonical: 'https://fossap.in/page-path',
    },
  }
}
```

---

## Phase 2 — On-Page & Social Optimization (Weeks 2–3)

### 7. Add Unique Title Tags to All Pages ⏱ 1 hour
All program pages, contact, contribute, membership, and blog pages need unique `<title>` tags. Currently falling back to homepage default.

### 8. Add Open Graph + Twitter Card Tags ⏱ 1 hour
Add globally to `app/layout.tsx` `generateMetadata()`:
```typescript
openGraph: {
  type: 'website',
  siteName: 'FOSS Andhra',
  images: [{ url: 'https://fossap.in/og-image.jpg', width: 1200, height: 630, alt: 'FOSS Andhra' }],
},
twitter: { card: 'summary_large_image' },
```
Override per-page where needed.

### 9. Create Branded OG Image ⏱ 2 hours
Design a 1200×630px image with:
- FOSS Andhra logo
- Tagline: "Free & Open Source for All — Andhra Pradesh"
- Blue gradient background matching site theme

### 10. Add FAQPage Schema to /faq ⏱ 45 min
Implement all 12 questions from the FAQ page as FAQPage JSON-LD (see schema.md).

### 11. Create /public/llms.txt ⏱ 15 min
See geo.md for exact content. Helps AI crawlers (GPTBot, ClaudeBot, PerplexityBot) understand the site structure.

### 12. Fix Footer Heading Hierarchy ⏱ 30 min
Change footer column labels from `<h3>` to `<p className="font-semibold">` or `<span>` to prevent footer section names polluting page heading structure.

---

## Phase 3 — Content & Rendering (Month 2)

### 13. Fix Blog/Events JavaScript Rendering ⏱ 4–8 hours
Convert to Next.js Server Components or ISR:
```typescript
// app/blog/page.tsx
export const revalidate = 3600 // ISR: revalidate every hour

export default async function BlogPage() {
  const posts = await getPosts() // server-side fetch
  return <BlogListing posts={posts} />
}
```

### 14. Expand Thin Program Pages ⏱ 4 hours
Pages needing expansion (priority order):
1. FOSSynC: Add "How to Start a Club" step-by-step guide
2. FOSStorm: Add project showcase and contribution guide
3. FOSSterage: Full audit needed (content unknown)
4. FOSSpeaks: Full audit needed

### 15. Expand About Page ⏱ 3 hours
Add: founding story, named team members with bios, organizational timeline, partner institutions, community impact numbers.

### 16. Write 5 Foundational Blog Posts ⏱ 2 days
Suggested topics for organic traffic:
1. "What is Free and Open Source Software? A Guide for Andhra Pradesh Students"
2. "How to Start a FOSS Club at Your College in AP"
3. "Open Source in Andhra Pradesh Government: Opportunities and Progress"
4. "Top 5 Open Source Tools for Telugu Language Computing"
5. "FOSStar Membership: What You Get and How to Join"

### 17. Add Security Headers ⏱ 30 min
In `next.config.js`:
```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }]
}
```

---

## Phase 4 — Authority & Monitoring (Ongoing)

### 18. Google Search Console Setup
- Monitor index coverage weekly
- Track impressions/clicks for target keywords
- Request indexing for new pages after fixes

### 19. Monthly Performance Audit
- Run PageSpeed Insights mobile for homepage and top 5 pages
- Track LCP, INP, CLS trends

### 20. Authority Building
- Create Wikidata entity: https://www.wikidata.org/wiki/Special:NewItem
- Submit to FOSS United community directory: https://fossunited.org
- Reach out to Deccan Chronicle Tech and NDTV Tech for coverage
- Partner with NIT AP Open Source Community (found in search results)

---

## ROI Estimate

| Fix | Effort | Expected Impact |
|-----|--------|-----------------|
| robots.txt + sitemap | 20 min | +16 pages indexed (from 1 to 17) |
| Meta descriptions | 2 hours | +15–25% CTR from SERPs |
| Unique title tags | 1 hour | Pages begin ranking for program-specific queries |
| Organization schema | 30 min | Brand knowledge panel eligibility |
| Blog SSR | 4–8 hours | Organic traffic from informational queries |
| OG tags | 1 hour | Social sharing conversion improvement |
