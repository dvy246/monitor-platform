# Project: Monitor Test Hub Next 5 SEO Capabilities & Optimization Sprint

## Architecture & Overview
Monitor Test Hub (`nasty-neptune`) is an Astro v7 static web application (`output: 'static'`) styled with Tailwind CSS v4 and featuring pure TypeScript math engines in `src/engine/`.

This sprint covers:
1. **R1: 5 Validated SEO Candidate Research**: Spawning 5 parallel research explorers for candidates in:
   - Candidate 1: Gaming Peripherals (e.g., Mouse Polling Jitter / Controller Drift / Audio Latency)
   - Candidate 2: Vision & Contrast Accessibility (e.g., Colorblindness / Dyslexia / Low Vision Contrast Matrix)
   - Candidate 3: Webcam & Room Ambient Lighting / Daylight Fill Light Inspector
   - Candidate 4: Display Calibration / Gamma & Color Space Converter (e.g. DCI-P3 to sRGB / Delta E)
   - Candidate 5: Touch Digitizer EMI Noise & Ripple Inspector
2. **R2: Navbar Mega-Menu Rebuild**: Auditing and updating `Layout.astro` mega-menu, creating category hub pages for pSEO route families lacking hubs.
3. **R3: Full SEO Pass**: Refactoring central FAQ into parameterized `FaqSchema.astro` component, auditing JSON-LD schemas across all page types, checking canonical tags and URL consistency.
4. **R4: Verification Loop**: Iteratively verifying with `npm test`, `npx playwright test`, `npx tsc --noEmit`, `npm run build`, `python3 verify_docs.py`.
5. **R5: Final Deliverable**: Detailed handoff report.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Setup & Decomposition | Initialize orchestrator state & project plan | none | DONE |
| 2 | Parallel Research (Candidates 1-5) | 5 parallel explorers researching candidates | M1 | IN_PROGRESS |
| 3 | Parallel Navbar & SEO Audit | Explorer auditing Navbar, category hubs, FAQ & schemas | M1 | IN_PROGRESS |
| 4 | Candidate Critique & Selection | Evaluate research findings, select 5 greenlit candidates | M2, M3 | PLANNED |
| 5 | Implementation Phase | Implement candidates, navbar rebuild, FAQ refactoring | M4 | PLANNED |
| 6 | Verification Loop & Final QA | Vitest, Playwright, tsc, build, verify_docs.py | M5 | PLANNED |
| 7 | Handoff & Report Synthesis | Final handoff report generation | M6 | PLANNED |

## Interface & Code Layout
- Target application path: `/Users/divyyadav/newws/monitor_test_hub`
- Decoupled engines in `src/engine/`
- Pages in `src/pages/`
- Components in `src/components/`
- Layouts in `src/layouts/`
