# Original User Request

## 2026-07-22T11:14:06Z

You are AGENT 2 — Functional, Interactive UI/UX, Mobile & Accessibility Auditor.
This is a READ-ONLY PRE-DEPLOYMENT AUDIT. DO NOT MODIFY ANY CODE OR FILES IN THE PROJECT REPOSITORY (`monitor_test_hub`).

Your working directory for analysis: `/Users/divyyadav/newws/monitor_test_hub`.
Your agent workspace directory: `/Users/divyyadav/newws/.agents/auditor_m2`.

Responsibilities:
1. Audit interactive diagnostic tools, canvas components, calculation engines (`src/engine/`), buttons, dropdowns, modals, tabs, hotkeys (`F`/`F11`), dialogs, tooltips, animations, forms, links, downloads, embedded widgets, and BroadcastChannel sync.
2. Detect broken functionality, JS exceptions, edge cases in event listeners, memory leaks/uncleaned event handlers or rAF loops, state management bugs, and race conditions.
3. Audit WCAG 2.2 AA accessibility: keyboard navigation (`tabindex`, focus rings `focus:ring-2`), focus order, ARIA attributes, labels, color contrast in dark/light themes, screen reader compatibility, skip links, alt text, semantic HTML, reduced motion support (`prefers-reduced-motion`), tab trapping in modals, and focus visibility.
4. Audit responsive design across screen viewports: desktop, laptop, tablet, mobile (iPhone/Android), ultra-wide 4K, touch screen interaction, 200% zoom, text scaling, dynamic viewport heights (`100dvh`), and mobile safe-area geometry (FAB position at `bottom-5 right-5 sm:bottom-6 sm:right-6` with `env(safe-area-inset-bottom)`).
5. Record all identified issues classified by severity (P0 Blocker, P1 Critical, P2 High, P3 Medium, P4 Low) with Location, Evidence, Why it matters, Impact, Likelihood, and Suggested remediation.
6. Write your detailed report to `/Users/divyyadav/newws/.agents/auditor_m2/audit_report.md` and send a comprehensive summary message back to the parent agent using `send_message`.

## 2026-07-22T13:13:10Z

Fix mobile responsiveness, layout overflow, header/banner wrapping, and canvas frame fitting across all devices in Monitor Test Hub.

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Requirements

### R1. Complete Viewport Overflow Elimination
- Ensure html, body, #ymyl-routing-banner, header, and all container elements strictly enforce max-w-full overflow-x-hidden box-border.
- All text elements (h1, h2, h3, p, span, kbd) on mobile viewports (< 640px) must break long words or wrap naturally without forcing any document width beyond 100vw.
- No horizontal scrollbars on body document across any mobile viewport (320px to 430px).

### R2. Touch Canvas & Component Frame Fitting
- Every diagnostic tool canvas (UniversalScreenTestDeck, DeviceDeadPixelInspector, TouchMatrixTester, WhiteScreenCanvas, KeyboardTesterCanvas, OledBurnInAnalyzer) must scale dynamically within the mobile viewport frame (h-60 sm:h-[460px], min-h-[320px]).
- The Floating Action Button (FAB) menu must remain hidden (hidden sm:flex) or auto-minimize on mobile viewports so it NEVER obstructs test cards, swatches, or mobile browser address bars.

### R3. Quality & Verification
- Execute strict TypeScript type checks (npx tsc --noEmit), Vitest unit test suite (npm test), documentation verification (python3 verify_docs.py), and static production build (npm run build).
- Deploy updated static production bundle to Cloudflare Pages.

## Acceptance Criteria

### Mobile Responsiveness & Layout
- [ ] 0px horizontal document scroll on iPhone SE (320px), iPhone 15 Pro (393px), and small Android devices.
- [ ] 100% of headings and top notice banners wrap cleanly inside the visible screen bounds without clipping text.
- [ ] 0 floating buttons overlapping diagnostic cards or color picker swatches on mobile.

### Verification
- [ ] npx tsc --noEmit passes with 0 errors.
- [ ] npm test passes 292/292 unit tests.
- [ ] npm run build generates static HTML pages cleanly.
- [ ] Production build successfully deployed to Cloudflare Pages.

## 2026-07-22T17:08:07Z

# MISSION BRIEF: Monitor Test Hub vs ScreenTester.io
## Pre-Launch Competitive Domination & US Audience Acquisition Protocol

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## 0. ANTI-HALLUCINATION PROTOCOL (apply to every agent, every claim)

1. Live-source-or-silence rule. No agent may state a number (traffic, backlink count, domain age, ranking position, page count, load time, word count) unless it was retrieved in this session from a named, fetchable source (a live URL fetch, a tool output, a repo file, sitemap.xml, robots.txt, PageSpeed Insights, npm test output, etc.). If a number cannot be retrieved live, the agent writes UNVERIFIED — <reason> and stops there. It does not estimate, round, or "reasonably assume."
2. Citation chain required. Every claim in every deliverable carries an inline source tag: [SOURCE: <url or file path or tool + timestamp>]. A claim with no tag is invalid and must be deleted by the Verification Agent, not softened.
3. One-quote-per-source discipline. Paraphrase competitor content freely for analysis but do not reproduce more than a short phrase of screentester.io's copy verbatim anywhere in the output.
4. Confidence score required. Every recommendation carries a 0–100% confidence score plus one sentence explaining what would raise it.
5. Adversarial review is mandatory, not optional. No deliverable ships to the final report until Agent F (Section 2.6) has actively tried to break it.
6. Self-reported project claims get re-verified, not trusted. Before any numbers appear in a competitive claim, re-run the actual command (TMPDIR=$PWD/.tmp npm test, npx tsc --noEmit, count entries in the built sitemap, python3 verify_docs.py) and cite the fresh output.
7. No compare-by-vibes. Every comparative claim must be reducible to something measurable.

## 1. VERIFIED CONTEXT ANCHOR
- Our starting asset inventory: Astro v7 static site, 2,699 static pages across 4 locales (en/es/de/fr), Cloudflare Pages hosting.
- Materially deeper feature surface than screentester.io: hardware passport (SHA-256 signed certificates), multi-display BroadcastChannel sync, keyboard/switch-chatter tester, diagnostic micro-arcade games, crowdsourced per-model device database, and several US-specific utility calculators: 50-state electricity cost calculator (EIA rate data), NEC 2026 wire gauge/voltage-drop calculator, PC bottleneck/FPS estimator, TV/projector viewing-distance calculator, 3D-print filament cost estimator.
- 10-item FAQ + JSON-LD schema architecture on every primary tool page.

## 2. MULTI-AGENT ARCHITECTURE

### 2.1 Agent A — Competitor Forensics Agent
- Fetch live homepage, sitemap.xml, and robots.txt of screentester.io. Count actual indexed/listed URLs.
- Fetch representative tool pages and record: word count, heading structure, FAQ schema, HowTo/SoftwareApplication schema, internal linking pattern, meta title/description length.
- Check WHOIS/Wayback Machine snapshots for domain age.
- Run PageSpeed Insights / Lighthouse against representative pages.
- Output: Competitor Forensics Dossier.

### 2.2 Agent B — Technical SEO Parity+ Audit Agent
- Side-by-side technical SEO matrix on Core Web Vitals, Structured data, Crawl/index hygiene, Mobile UX, E-E-A-T signals, Internal linking architecture, Zero-click SERP feature eligibility.
- Re-verify Monitor Test Hub metrics live via npm test, tsc --noEmit, python3 verify_docs.py, and sitemap page count.
- Output: Scored matrix + ranked gap list.

### 2.3 Agent C — Search Intent & Content Gap Agent (US-focused)
- Pull PAA and related-search data for core queries ("dead pixel test," "screen test online," "monitor test free," "is my monitor 144hz," "backlight bleed normal," "should I return this monitor").
- Compare screentester.io copy language against our copy. Flag jargon vs plain search intent language.
- Identify content gaps and pSEO expansion opportunities for US searchers.
- Output: Gap list mapped 1:1 to existing or new pages.

### 2.4 Agent D — US Audience Acquisition Agent
- Identify real distribution surfaces (r/Monitors, r/OLED, r/buildapc, r/pcmasterrace, YouTube monitor reviewers, US electronics forums).
- Map backlink bait candidates (NEC 2026 wire gauge, 50-state electricity calculator, TV viewing-distance calculator).
- Output: US Audience Playbook.

### 2.5 Agent E — "Why Us, Not Them" Positioning Agent
- Write user-facing answer to "why would I use Monitor Test Hub instead of screentester.io" from visitor's perspective.
- Include honest acknowledgment of competitor strengths.
- Output: Honest comparison page draft.

### 2.6 Agent F — Adversarial Verification / Red-Team Agent
- Re-fetch cited URLs independently and challenge unverified claims.
- Validate self-reported Monitor Test Hub numbers using fresh command outputs.
- Output: Verification Log (claim, status, evidence).

### 2.7 Agent G — Orchestrator / Editor Agent
- Synthesize surviving findings into Launch Readiness Report.
- Produce 0-100 Launch Readiness Scorecard per category with GO / GO-WITH-CONDITIONS / NOT-YET recommendation.

## 3. VERIFICATION LOOP
Round 1: Agents A–E produce first-draft findings with citations.
Round 2: Agent F independently checks claims & produces Challenge List.
Round 3: Originating agents supply evidence or retract.
Round 4: Agent G assembles final Launch Readiness Report.

## Requirements & Acceptance Criteria
- [ ] Every numerical claim carries live citation tag ([SOURCE: ...]).
- [ ] Includes fresh verification outputs from `npm test` (287 PASS), `tsc --noEmit` (0 errors), `verify_docs.py` (20/20 PASS), and static build page count (2,699 pages).
- [ ] Launch Readiness Scorecard provides a clear, actionable decision with category-level breakdowns.

## 2026-07-23T00:29:45Z

# Root Cause Mobile UX & Responsive Layout Engineering Audit

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Objective

Identify and resolve the underlying root cause of every mobile viewport overflow, text clipping, broken CSS grid, static pixel width, oversized canvas/SVG, or horizontal scrolling issue across all device viewports (320px to 430px+).

## Requirements

### R1. Root Cause Mobile Geometry & Layout Audit
- Inspect all Astro pages, layouts, and components for fixed widths (`width: 100vw`, fixed `px` widths, `min-width` exceeding container bounds, `nowrap` flex/grid overflows, oversized SVGs, dynamic scrollbar calculations, and unconstrained padding/margins).
- Do NOT use `overflow-x: hidden` as a band-aid hack; identify and fix the structural CSS/HTML root cause of element overflow.
- Ensure all interactive diagnostic canvases (Touch Matrix, Mouse Canvas, Controller Visualizer, Audio FFT Spectrum Analyzer, Spacebar Counter) scale dynamically with `ResizeObserver` and support `devicePixelRatio` without layout shifts or horizontal scrollbar triggers.

### R2. Viewport & Breakpoint Parity across Routes
- Verify layout integrity at 320px, 360px, 375px, 390px, 414px, 430px, 480px, and 768px viewports.
- Audit ALL primary tool routes (`/screen-test`, `/refresh-rate-test`, `/touch-matrix`, `/mouse-test`, `/keyboard-tester`, `/controller-test`, `/sound-test`, `/benchmarks`, `/white-screen`, `/models`, `/compare`, `/faq`, `/tools`, and localized `/[locale]/` routes).

### R3. Automated Empirical Verification & Build Compliance
- Run automated DOM scroll width checks verifying `document.documentElement.scrollWidth == window.innerWidth` across all routes.
- Execute unit & type checks (`TMPDIR=$PWD/.tmp npm test` and `npx tsc --noEmit`) to ensure zero regressions.

## Acceptance Criteria

### Viewport & Mobile Responsiveness
- [ ] `scrollWidth == window.innerWidth` (zero horizontal scrolling) across all audited mobile breakpoints (320px–430px).
- [ ] Zero clipped text, unpadded code blocks, or broken grid containers.
- [ ] No masking hacks (`overflow-x: hidden`) used to hide underlying layout bugs.
- [ ] All Canvas elements scale 100% responsively within parent bounds.

## 2026-07-23T09:50:04Z

# Teamwork Project Prompt — Finalized

Redesign every diagnostic test page across DisplayTestOnline.com into a state-of-the-art visual suite featuring curved box containers (`rounded-3xl`/`rounded-2xl`), specular highlights (`border-white/10`), 4-part Master Bento Diagnostic Suite (Screen Info, 12-Swatch Color Palette, Shortcuts with TV Remote hint, Custom Color Picker), Numbered Step Circle Workflows (`01`, `02`, `03`), Panel Type Breakdown Cards (*Professional IPS*, *Consumer IPS*, *VA Panel*, *OLED*), and E-E-A-T SEO technical articles with 10 structured FAQs.

Working directory: `/Users/divyyadav/newws/monitor_test_hub`
Integrity mode: development

## Requirements

### R1. Diagnostic Bento Integration
Every diagnostic test page must incorporate the 4-card diagnostic bento (`ScreenInfoCard`, `QuickColorPalette` with 12 swatches & active glow, `KeyboardShortcutsCard` with capsule keys & yellow TV remote hint, `CustomColorPicker` with hex input & preview CTA).

### R2. Numbered Step Workflow Cards (`01`, `02`, `03`)
Every test page must feature a "How To Test / Calibrate" section with numbered step circles (`01`, `02`, `03`) inside dark rounded containers (`rounded-3xl border border-white/10 bg-[#121215]`), title, and description text.

### R3. Panel Type & Device Capability Comparison Grid
Every display/hardware test page must include a 4-card grid (*Professional IPS*, *Consumer IPS*, *VA Panel*, *OLED*) featuring colored monitor SVG icons (Red, Blue, Yellow, Purple), `rounded-3xl` cards with inner `rounded-2xl` dark containers (`bg-[#08080a]`), and detailed accuracy characteristics.

### R4. E-E-A-T Technical SEO Articles & 10-Item Structured FAQs
Every primary tool page must feature a detailed technical engineering article with SVGs, tables, metrics, and exactly 10 real-intent technical FAQs paired with automatic `FAQPage` JSON-LD schema generation.

## Acceptance Criteria

### Visual & Architectural Verification
- [x] Standardized `StepWorkflowSection.astro` (01, 02, 03 step circles) created.
- [x] Standardized `PanelTypeBreakdownSection.astro` (4-card Professional IPS, Consumer IPS, VA Panel, OLED grid) created.
- [ ] 100% of test pages upgraded with curved boxes, bento decks, step workflows, panel grids, and E-E-A-T FAQs.
- [ ] `npx tsc --noEmit` returns 0 errors.
- [ ] `TMPDIR=$PWD/.tmp npm test` passes 100% (329/329 unit tests across 57 test files).
- [ ] `TMPDIR=$PWD/.tmp npm run build` compiles cleanly (2,800+ static HTML pages).


