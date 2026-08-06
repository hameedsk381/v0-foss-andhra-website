# Schema & Structured Data Findings — fossap.in

**Category Score: 10/100**

---

## Current State: Zero Structured Data Implemented

No JSON-LD, Microdata, or RDFa structured data was detected on any page of the site.

---

## Critical Gaps

### 1. No Organization Schema — CRITICAL
The most fundamental schema for any organization's website is missing entirely.

**Recommended implementation for `app/layout.tsx` (site-wide):**
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

---

### 2. No FAQPage Schema on /faq — HIGH
The `/faq` page has 12 well-structured questions across 4 categories (General, Membership, Programs, Contributions) — a perfect candidate for structured data.

**Note on Google's FAQ policy (May 7, 2026):** Google retired FAQ rich results for all sites. However, FAQPage schema still benefits AI citation (ChatGPT, Perplexity, Google AI Overviews) which parse structured Q&A. Recommend implementing FAQPage schema for AI search benefit, not SERP rich results.

**Sample JSON-LD for /faq:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is FOSS Andhra?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "FOSS Andhra is a community organization promoting free and open source software in Andhra Pradesh..."
      }
    }
  ]
}
```

---

### 3. No Event Schema on /events — HIGH
Past and upcoming events should be marked up with `Event` schema for potential Google SERP event carousel eligibility and AI citation.

---

### 4. No BreadcrumbList Schema — MEDIUM
No breadcrumb trail markup on any page. Breadcrumbs appear in SERPs and help users understand site hierarchy.

---

### 5. No WebPage/WebSite Schema — MEDIUM
`WebSite` schema with `SearchAction` (sitelinks search box) and `WebPage` schema on individual pages are missing.

---

## Priority Schema Implementation Order

| Priority | Page | Schema Type | SEO Benefit |
|----------|------|-------------|-------------|
| 1 | All pages (layout.tsx) | Organization/NGO | Brand knowledge panel, AI citations |
| 2 | /faq | FAQPage | AI Overviews, Perplexity citations |
| 3 | /events | Event | Event carousel, local search |
| 4 | All pages | BreadcrumbList | SERP appearance |
| 5 | /blog/* | Article | News/blog indexing signals |
| 6 | /programs/* | Service | Service-type rich results |
| 7 | layout.tsx | WebSite + SearchAction | Sitelinks search box |
