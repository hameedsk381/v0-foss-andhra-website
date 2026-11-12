# SEO Implementation Plan — fossap.in

**Based on:** OpenSEO SEO Audit, Nov 12, 2026 (report in the fossap.in OpenSEO project)
**Baseline:** ~10 organic visits/month, 4 ranking keywords (DataForSEO estimate, India). Brand + "open source community andhra pradesh" rank #1. Blog posts: not in the first 10 results for any non-brand target query. Fixes from the audit are committed (`6831f47`, `1560253`) and need one deploy.

**Goal:** grow useful organic traffic that converts — FOSStar memberships, internship applications, sponsor/partner inquiries.

---

## Phase 1 — Ship and measure (Weeks 1–2)

*Everything here is unblocked; most work is already done.*

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1.1 | Deploy `main` on the server (brings in sitemap, canonical, membership, title fixes) | User (deploy.bat) | Pending |
| 1.2 | Verify live: sitemap lists 17 static routes + 7 program pages + all published posts; internship/contribute pages canonical to themselves; `/membership` shows H1 + intro in raw HTML | Agent (free checks) | After 1.1 |
| 1.3 | Re-run the free site audit to confirm issue counts drop (27 title / 17 canonical issues should go to ~0) | Agent (free) | After 1.1 |
| 1.4 | Verify Google Search Console (token file already hosted) and submit `https://fossap.in/sitemap.xml` | **User** | Pending |
| 1.5 | In Search Console: request indexing for the 5 money pages (`/membership`, `/careers`, `/careers/poster`, `/contribute/sponsor`, `/programs/fosstar`) | User | After 1.4 |
| 1.6 | IndexNow re-ping of all URLs (Bing/Yandex fast path) | Agent (free) | After 1.1 |
| 1.7 | Create `@fossap.in` mail aliases (sponsors@, membership@, support@, …) so no page link bounces | **User** | Pending |

**Exit criteria:** Search Console shows impressions data for fossap.in; sitemap accepted; audit issue count ≤ 20 (from 86).

---

## Phase 2 — First links + hygiene (Weeks 2–6)

*The site has almost no inbound links. For a site this small, links beat more posts.*

**Link acquisition (target: 5–10 real links):**

| # | Action | Owner |
|---|--------|-------|
| 2.1 | Add fossap.in to the FOSS United communities/clubs directory (fossunited.org) and any Indian FOSS community lists | User (relationship owner) |
| 2.2 | Ask partner colleges running FOSStar/FOSSynC clubs to link to `/programs/fossync` from their club pages | User |
| 2.3 | Update the GitHub org profile and LinkedIn company page to link fossap.in; share each new post there | User |
| 2.4 | List the org on nonprofit/tech directories where it qualifies (state tech bodies, Devfolio, meetup directories) | User |

**On-site hygiene (agent, in passing):**

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 2.5 | Trim the meta descriptions >160 chars to 70–160 | Agent | ✅ Done — 7 blog posts (live DB, no deploy) + 7 static pages (commit 68335c7); privacy/refund descriptions also lengthened from 65/63 |
| 2.6 | Fix the heading-level skips (H1→H3 without H2) as pages are edited | Agent | ✅ Done (commit 7051ae0) — decorative eyebrows → `<p>`, section H2s added on careers/events/contact/donate/sponsor, step titles promoted |
| 2.7 | E-E-A-T: add a short author bio line under each blog post (name, role, GitHub/LinkedIn link) | Agent | ✅ Done (commit 68335c7) — author bio line on post pages with fallback; set a real bio + avatar for the admin author in the DB/admin panel to personalize |
| 2.8 | Optional: trim homepage title to ≤60 chars | Agent | ✅ Done (commit 68335c7) — plus contact/contribute/fosserve titles and smart ≤60 truncation of blog post `<title>` tags |

**Exit criteria:** 5+ new referring domains; GSC shows first non-brand impressions; hygiene issues ≤ 5.

---

## Phase 3 — Capture existing demand (Weeks 6–12)

*Content the audit's runner-up and query gaps point at. Publish where the demand is measurable (GSC), not where the volume looks biggest.*

| # | Action | Owner |
|---|--------|-------|
| 3.1 | Build the generic-demand internship landing: one page answering "internships for students in Andhra Pradesh / open source internship" honestly (3-month hybrid, unpaid, membership route) — the runner-up opportunity from the report | ✅ Done — `/internships` live (commit f6deb3c): facts grid, 7 track cards, FAQ + FAQPage JSON-LD, linked from /careers and in sitemap |
| 3.2 | Deepen the 3 strongest existing posts (FOSS club guide, GitHub pack guide, beginner projects) toward 1,200–1,500 words with concrete steps and screenshots; update `updatedAt` and re-ping | ✅ Done — club guide 427→1,487 words, pack guide 534→1,199, projects list 563→1,233 (live DB, no deploy); IndexNow re-pinged |
| 3.3 | Content cadence: 2 posts/month from the student question clusters (first PR, GSoC prep, Linux install fest, hackathon prep, git basics) | User (topics) + Agent (drafts) — first drafts available on request |
| 3.4 | Internal links: each program page links to its 2–3 relevant posts; posts link back to programs | ✅ Done — related-guides sections on fosserve/fosspeaks/fosstar/fossterage + inline guides on fossync/fosstorm; all deepened posts link to programs, careers and membership |
| 3.5 | GSC review after 4–6 weeks: sort queries by impressions, pick the ones already seeing impressions with position 10–30 as next content targets | Blocked on Search Console verification (user) |

**Exit criteria:** ≥1 page in the first 10 results for one non-brand cluster; organic visits ≥ 30/month (tool estimate basis).

---

## Phase 4 — Authority (Months 3–12)

| # | Action | Owner |
|---|--------|-------|
| 4.1 | Event markup on `/events` (EventJsonLd exists in the codebase — wire it to live events) | Agent |
| 4.2 | PR: local press and college newsletters for each flagship event; govt open-source-policy angle | User |
| 4.3 | AI search readiness: add `llms.txt` at site root (robots.txt already allows AI crawlers); keep quotable facts in About | Agent |
| 4.4 | Original data: publish annual stats (members, clubs, install-fest counts) — the kind of source others cite | User + Agent |
| 4.5 | Quarterly re-audit (free) + rank tracking decision — **needs an OpenSEO credit top-up** to unlock keyword/backlink research for planning | User decision |

---

## KPI targets

| Metric | Baseline (Nov 2026) | 3 months | 6 months | 12 months |
|--------|--------------------:|---------:|---------:|----------:|
| Organic visits (tool est.) | ~10/mo | 30/mo | 80/mo | 200/mo |
| Non-brand keywords ranking | ~0 of 4 | 15 | 40 | 100 |
| Referring domains | ~0 (unverified) | 5 | 15 | 30 |
| Indexed pages (GSC) | TBD (verify first) | 63 | 70+ | 90+ |
| Membership/internship signups from organic | unknown (add UTM/GSC tracking) | measurable | +25% q/q | +25% q/q |

Baselines marked TBD/unknown get set in Phase 1 from Search Console; targets are directional, not forecasts.

**Credit note:** backlink, ranked-keyword and paid SERP lookups need an OpenSEO credit top-up (current balance is insufficient). Do it once, before Phase 3, when keyword planning begins.
