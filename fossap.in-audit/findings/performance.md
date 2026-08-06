# Performance Findings — fossap.in

**Category Score: 55/100** *(estimated — PageSpeed API rate-limited; lab data not available)*

---

## Framework Baseline
Next.js 14 App Router with Tailwind CSS provides a strong performance foundation:
- Server-side rendering available (though not fully utilized for dynamic pages)
- Automatic code splitting per route
- Built-in image optimization via `next/image`
- Tailwind's PurgeCSS removes unused styles

---

## Estimated Core Web Vitals

| Metric | Estimated Value | Target | Status |
|--------|-----------------|--------|--------|
| **LCP** (Largest Contentful Paint) | ~2.5–3.5s mobile | < 2.5s | ⚠️ Needs Improvement |
| **INP** (Interaction to Next Paint) | ~150–250ms | < 200ms | ⚠️ Borderline |
| **CLS** (Cumulative Layout Shift) | ~0.05–0.15 | < 0.1 | ⚠️ Borderline |
| **FCP** (First Contentful Paint) | ~1.5–2.5s mobile | < 1.8s | ⚠️ Needs Improvement |

*Note: Estimates based on typical Next.js 14 SPA behavior with client-side data fetching. Actual values may differ — run PageSpeed Insights at https://pagespeed.web.dev/?url=https%3A%2F%2Ffossap.in for real field data.*

---

## Known Performance Issues

### 1. Client-Side Data Fetching on Blog/Events — HIGH
Blog and Events pages fetch data after hydration (client-side). This means:
- Users see blank "Loading..." for 1–3 seconds
- LCP is delayed until JavaScript runs and data is fetched
- On slow mobile connections (3G), content may never appear

### 2. Razorpay Script Loading — MEDIUM
Razorpay checkout script (`https://checkout.razorpay.com/v1/checkout.js`) is a third-party script loaded on payment pages. This adds ~100–200ms to payment page load time.

### 3. No Explicit `<link rel="preload">` — MEDIUM
Hero section fonts and critical CSS are not preloaded, which can delay LCP.

---

## Quick Performance Wins

1. Add `priority` prop to the hero image in `ClientPage.tsx`
2. Add `loading="lazy"` to below-fold images
3. Move blog/events to SSR/ISR to eliminate the "Loading..." state
4. Add `rel="preconnect"` for Google Fonts and third-party domains

---

## Monitoring

Run PageSpeed Insights monthly: https://pagespeed.web.dev/?url=https%3A%2F%2Ffossap.in

Check CrUX field data in Google Search Console once more pages are indexed.
