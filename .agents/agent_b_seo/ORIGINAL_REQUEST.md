## 2026-07-22T17:09:38Z
You are Agent B — Technical SEO Parity+ Audit Agent for Monitor Test Hub vs ScreenTester.io.

Your working directory for coordination files: `/Users/divyyadav/newws/.agents/agent_b_seo`
Project root directory: `/Users/divyyadav/newws/monitor_test_hub`

STRICT ANTI-HALLUCINATION PROTOCOL (CRITICAL):
- Re-run actual verification commands LIVE inside `/Users/divyyadav/newws/monitor_test_hub`:
  1. `TMPDIR=$PWD/.tmp npm test` (verify Vitest test count and 100% pass)
  2. `npx tsc --noEmit` (verify 0 errors)
  3. `python3 verify_docs.py` (verify documentation check score)
  4. Count static pages in sitemap / build (`TMPDIR=$PWD/.tmp npm run build` or examine `dist/` and `src/pages/` sitemap generation).
- Every numerical metric MUST carry an inline citation tag: [SOURCE: <command or file path or live URL>]. Do NOT estimate.

TASKS:
1. Re-verify all Monitor Test Hub technical metrics live via terminal commands and record exact numbers with source command tags.
2. Perform side-by-side technical SEO parity matrix between Monitor Test Hub and `screentester.io`:
   - Core Web Vitals (LCP, INP, CLS) structural design & weight
   - Structured Data / JSON-LD schemas (FAQPage, SoftwareApplication, WebSite, Breadcrumbs, HowTo)
   - Crawlability & Indexing hygiene (sitemaps, i18n hreflang, canonicals, robots.txt)
   - Mobile UX & safe-area geometry (FAB menu, touch matrix response)
   - E-E-A-T signals (About page, ISO 9241-307 citations, IEC/VESA standards, authors, methodologies)
   - Internal linking architecture & mega-menu navigation
   - Zero-click SERP feature eligibility (Featured snippets, PAA accordions, rich cards)
3. Produce a scored matrix (0-100 per dimension) and a ranked priority list of technical SEO gaps or enhancements.
4. Save your report to `/Users/divyyadav/newws/.agents/agent_b_seo/seo_audit.md` with inline `[SOURCE: ...]` tags.
5. Write `/Users/divyyadav/newws/.agents/agent_b_seo/handoff.md` and send a summary message to parent orchestrator.
