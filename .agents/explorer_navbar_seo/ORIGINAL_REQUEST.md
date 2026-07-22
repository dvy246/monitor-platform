## 2026-07-22T08:42:44Z
You are an Explorer agent for Navbar Mega-Menu & Full SEO Audit (Tasks 2 & 3).
Your working directory is: /Users/divyyadav/newws/.agents/explorer_navbar_seo
Target web application: /Users/divyyadav/newws/monitor_test_hub

Your mission:
Perform a comprehensive audit of the Navbar Mega-menu (Task 2), pSEO Route Families & Hub pages (Task 2), FAQ implementation & refactoring (Task 3), and Schema/Metadata compliance (Task 3).

Instructions:
1. Examine `src/layouts/Layout.astro` and `src/components/` in /Users/divyyadav/newws/monitor_test_hub:
   - Audit the mega-menu navigation structure, categories, links, and mobile menu.
   - Check all 6 pSEO route families:
     1. PC Bottleneck & FPS Estimator (`/benchmarks/pc-bottleneck`, `/benchmarks/pc-bottleneck/[slug]`)
     2. Appliance Electricity Cost Calculator (`/display-tests/electricity-cost`, `/display-tests/electricity-cost/[slug]`)
     3. Wire Gauge & Voltage Drop Calculator (`/benchmarks/wire-gauge-calculator`, `/benchmarks/wire-gauge-calculator/[slug]`)
     4. 3D Printer Filament Cost Estimator (`/benchmarks/3d-print-cost`, `/benchmarks/3d-print-cost/[slug]`)
     5. TV Viewing Distance Calculator (`/display-tests/tv-viewing-distance`, `/display-tests/tv-viewing-distance/[slug]`)
     6. Keyboard Tester & Switch Chatter (`/keyboard-tester`, `/keyboard-tester/[slug]`)
     7. Per-Model Verified Telemetry DB (`/models`, `/models/[slug]`)
     8. Dead Pixel Test per-device (`/display-tests/dead-pixel-test/[slug]`)
   - Confirm whether EACH route family has a browsable category hub/index page reachable from the navbar. Flag any missing category hub pages as critical internal-linking gaps.

2. Audit FAQ implementation:
   - Read `src/pages/faq.astro` (12 items + JSON-LD).
   - Search the codebase for all tool-specific FAQ components or inline FAQ accordions (e.g., `src/components/diagnostics/FaqAccordion.astro`, `FaqSchema.astro`, or in pages).
   - Find all duplicate or verbatim duplicate FAQ questions across pages.
   - Design a single parameterized Astro component (`src/components/seo/FaqSchema.astro` or `FaqAccordion.astro`) that accepts a `faqs` prop array of `{ question: string; answer: string }`, renders clean accessible HTML UI (accordion), and generates valid `FAQPage` JSON-LD schema per page instance.

3. Audit Schema.org JSON-LD & Metadata:
   - Audit all page types (`src/pages/**/*.astro`):
     - Tools: `SoftwareApplication` / `WebApplication`
     - FAQ pages: `FAQPage`
     - pSEO routes & models: `BreadcrumbList` + `WebApplication` / `ItemPage`
     - Knowledge base articles: `Article` / `TechArticle`
   - Check for schema declared but not matching visible page content.
   - Audit Canonical tags & URLs in `Layout.astro` / `SEOHead.astro`: check domain hostname (`https://monitortesthub.com`), www vs non-www, trailing slash behavior, and locale prefix consistency (`/es/`, `/de/`, `/fr/`).

4. Produce a comprehensive audit report saved to /Users/divyyadav/newws/.agents/explorer_navbar_seo/analysis.md:
   - Navbar Audit & Missing Category Hubs List
   - Proposed Mega-Menu Rebuild Structure & Diff Plan
   - FAQ Audit Findings (duplicate questions list, central vs tool-specific)
   - Refactored `FaqSchema.astro` component specification
   - Schema JSON-LD Audit Findings & Fixes Needed
   - Canonical & URL Metadata Audit Findings
   - Actionable Implementation Tasks for Task 2 & Task 3.

5. Update your progress.md heartbeat file upon completion.
6. Send a concise message to parent (ID: dae2dd47-7820-4286-9cda-a35c42de48fd) referencing your analysis.md file path.

## 2026-07-22T08:43:45Z
**Context**: Critical Addendum from User
**Content**: 
1. YMYL Safe: All candidate features MUST be YMYL-safe (No medical/health/clinical diagnosis claims, no financial/legal liability risk). Frame all visual/contrast/audio tools as display/peripheral calibration standards (ISO 9241-307, VESA, IEC). Include clear disclaimers where appropriate.
2. US Audience Specific: All copy, units, standards, and examples MUST be specifically tailored for a US-based, English-speaking audience (US English spelling: "color", "center", "optimize"; US units: inches/feet; US standards: NEC 2026, EIA rates, THX/SMPTE, USD $).
**Action**: Please incorporate these strict constraints into your analysis and candidate proposals. Ensure all US English spelling and US standards are enforced.
