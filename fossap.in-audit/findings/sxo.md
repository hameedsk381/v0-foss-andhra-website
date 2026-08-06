# Search Experience Optimization (SXO) — fossap.in

**Analysis: Page-type alignment, user intent, persona scoring**

---

## Business Type Detection
**Non-profit community organization / Open source advocacy — Publisher + Local Service hybrid**

Signals:
- Physical address (Vijayawada, AP)
- Community membership program
- Blog + events (publisher signals)
- No products/pricing e-commerce
- Educational mission

---

## SERP Page-Type Analysis

### Homepage (`/`)
- **Detected intent:** Navigational + informational
- **Page type:** Organization homepage ✓
- **SERP alignment:** Good for brand queries; weak for non-branded discovery
- **Gap:** No geo-targeted content for "FOSS community Andhra Pradesh" queries

### Program Pages (`/programs/*`)
- **Detected intent:** Informational (what is this program?)
- **Current page type:** Feature/service page ✓
- **Gap:** Thin content (280–350 words on several pages) vs. competitor depth
- **User story not served:** "I'm a student — how do I join a FOSS club at my college?" → FOSSynC page doesn't answer this clearly

### Blog (`/blog`)
- **Detected intent:** Informational (how-to, news, updates)
- **Current page type:** Empty shell ✗
- **SERP alignment:** Zero — no indexable content
- **Missed intent:** "FOSS tutorials Andhra Pradesh", "open source workshops AP 2026"

### Events (`/events`)
- **Detected intent:** Transactional (I want to attend an event)
- **Current page type:** Empty shell ✗
- **Missed intent:** "upcoming FOSS events Vijayawada", "open source meetup Andhra Pradesh"

### FAQ (`/faq`)
- **Detected intent:** Informational (answer a specific question)
- **Current page type:** Q&A page ✓ (good structure)
- **Gap:** No FAQPage schema; questions not citable by AI

---

## User Persona Analysis

### Persona 1: CS Student (Andhra Pradesh college)
- **Goal:** Find a FOSS club or internship opportunity
- **Entry query:** "FOSS club college Andhra Pradesh" / "open source internship AP"
- **Current experience:** FOSSynC page is thin; no call-to-action for club registration; no testimonials
- **Score: 3/10**

### Persona 2: Government Official / Educator
- **Goal:** Understand how FOSS can be implemented in institutions
- **Entry query:** "open source for government Andhra Pradesh" / "FOSS education solutions AP"
- **Current experience:** FOSServe page is most detailed (1,200+ words) but has no case studies, no testimonials, no institution names
- **Score: 5/10**

### Persona 3: Tech Professional (FOSS contributor)
- **Goal:** Join the community, attend events, contribute to projects
- **Entry query:** "FOSS community Vijayawada" / "open source community AP"
- **Current experience:** Homepage is visually strong; events page is empty; blog is empty; FOSStorm has thin content
- **Score: 4/10**

### Persona 4: Donor / Sponsor
- **Goal:** Understand the organization, trust it, donate
- **Entry query:** "donate FOSS Andhra" / "sponsor open source community India"
- **Current experience:** Contribute page explains options; Razorpay integration present; missing: annual reports, impact stats, testimonials
- **Score: 5/10**

---

## Top SXO Recommendations

1. **FOSSynC page:** Add a "Start a Club at Your College" step-by-step section
2. **FOSServe page:** Add 2–3 institution case studies (even anonymized)
3. **Events page:** Fix JS rendering — upcoming events are the #1 reason new visitors return
4. **Blog:** Start with 5 posts on: "What is FOSS?", "FOSS in AP schools", "How to contribute to open source (Telugu)"
5. **Homepage:** Add a "Latest Events" and "Recent Blog Posts" section with server-rendered content
