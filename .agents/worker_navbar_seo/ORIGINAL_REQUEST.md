## 2026-07-22T09:00:12Z

You are an Implementer Worker agent for Navbar Mega-Menu Rebuild, Category Hubs, FAQ Refactoring & Schema/Canonical Audit.
Your working directory is: /Users/divyyadav/newws/.agents/worker_navbar_seo
Target web application: /Users/divyyadav/newws/monitor_test_hub

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission:
Execute Tasks 2 & 3: Navbar mega-menu rebuild, category hub completion, FAQ component refactoring (`FaqSchema.astro`), and Schema/Canonical metadata pass.

Instructions & Specifications:
1. Fix Missing Category Hub Page:
   - Create `src/pages/display-tests/dead-pixel-test/index.astro` and localized variants (`src/pages/[locale]/display-tests/dead-pixel-test/index.astro`) so that `/display-tests/dead-pixel-test` returns 200 OK with a browsable grid of device dead pixel inspectors!

2. Internal Linking for Category Hub Pages:
   - Update parent category index pages (`pc-bottleneck.astro`, `electricity-cost.astro`, `wire-gauge-calculator.astro`, `3d-print-cost.astro`, `tv-viewing-distance.astro`, `keyboard-tester/index.astro`) to include HTML links targeting all generated `[slug]` child routes so search engines can crawl every child route directly.

3. Navbar Mega-Menu Rebuild (`src/layouts/Layout.astro`):
   - Update mega-menu to structure tools into 4 clear category pillars: Visual Display Diagnostics, Touch & Mobile Diagnostics, Peripherals & Benchmarks, Calibration & Hardware DB.
   - Include entry points for greenlit capabilities (`/benchmarks/wireless-latency`, `/display-tests/contrast-accessibility`, `/display-tests/delta-e-calculator`, `/touch-tests/touch-sampling-rate`) and all category hubs.
   - Preserve 4-locale switching (`en`, `es`, `de`, `fr`).
   - Document before/after navbar diff.

4. FAQ Component Refactoring (`FaqSchema.astro`):
   - Refactor FAQ into a single reusable parameterized component: `src/components/seo/FaqSchema.astro` (or `FaqAccordion.astro`).
   - Accepts `faqs: Array<{ question: string; answer: string }>` props, renders WAI-ARIA accessible UI accordions, and emits `FAQPage` JSON-LD schema per page instance.
   - Refactor central `src/pages/faq.astro` and individual tool pages to use `FaqSchema.astro` and eliminate verbatim duplicate FAQ questions.

5. Schema & Metadata Audit:
   - Audit Schema.org JSON-LD (`SoftwareApplication`/`WebApplication`, `FAQPage`, `BreadcrumbList`, `Article`) across all page types.
   - Confirm canonical tags match `https://monitortesthub.com` with non-www, correct locale prefix, and consistent trailing slash rules.
   - Enforce US English spelling ("color", "center", "optimize") and US standards.

6. Verification:
   - Run `npx tsc --noEmit`, `npm run build`, and `python3 verify_docs.py` inside `/Users/divyyadav/newws/monitor_test_hub` (MUST pass 20/20!).

7. Report & Handoff:
   - Save your work summary report to /Users/divyyadav/newws/.agents/worker_navbar_seo/handoff.md.
   - Send a completion message to parent (ID: dae2dd47-7820-4286-9cda-a35c42de48fd).
