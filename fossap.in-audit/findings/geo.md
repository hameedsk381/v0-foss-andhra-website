# AI Search Readiness (GEO) Findings — fossap.in

**Category Score: 25/100**

---

## AI Crawler Access

| Bot | robots.txt Status | Access |
|-----|-------------------|--------|
| GPTBot (OpenAI) | `Allow: /` | Accessible |
| ClaudeBot (Anthropic) | `Allow: /` | Accessible |
| PerplexityBot | `Allow: /` | Accessible |
| Google-Extended | `Allow: /` | Accessible |
| CCBot (Common Crawl) | `Allow: /` | Accessible |

All AI crawlers can access the site — good baseline.

---

## Critical Gaps

### 1. No `llms.txt` File — HIGH
AI crawlers lack a structured entry point. Recommended `/public/llms.txt`:

```
# FOSS Andhra

> Promoting free and open source software across Andhra Pradesh through education, governance, and community programs.

## Organization
- Type: Non-Governmental Organization (NGO)
- Location: Vijayawada, Andhra Pradesh, India
- Contact: office@fossap.in | +91 94944 63840

## Programs
- FOSStar: Membership program — https://fossap.in/programs/fosstar
- FOSServe: Open source in education/governance — https://fossap.in/programs/fosserve
- FOSSynC: Student FOSS clubs — https://fossap.in/programs/fossync
- FOSStorm: Community projects — https://fossap.in/programs/fosstorm
- FOSStart: Open source startup incubation — https://fossap.in/programs/fosstart
- FOSSterage: Knowledge repository — https://fossap.in/programs/fossterage
- FOSSpeaks: FOSS advocacy — https://fossap.in/programs/fosspeaks
```

### 2. No Organization Schema — HIGH
AI systems build entity knowledge from JSON-LD. Without `NGO`/`Organization` schema, FOSS Andhra cannot be confidently attributed in AI Overviews.

### 3. Dynamic Content Not Citable — HIGH
Blog posts and events render client-side. Zero content available for AI citation from these sections.

---

## Citability Score: 3/10

**AI can cite:** org name, mission, location, 7 program names, contact info.
**AI cannot cite:** founding year, leadership names, partner institutions, event outcomes, blog articles.

---

## Recommendations

1. Create `/public/llms.txt` (1 hour of effort)
2. Add Organization/NGO JSON-LD to `app/layout.tsx`
3. Publish 3–5 blog posts on FOSS topics in AP context
4. Create a Wikidata entity for FOSS Andhra
5. Build press citations (Deccan Chronicle, NDTV Tech, The Hindu Tech)
