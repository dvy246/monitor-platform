# Original User Request

## 2026-07-21T19:08:51Z

Perform a comprehensive design, UX, interaction, and engineering review of the Monitor Test Hub project to ensure a premium, intentional, and high-fidelity production quality bar.

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Requirements

### R1. Comprehensive Experience Audit
- Review the current implementation of the Monitor Test Hub project against elite design studio standards.
- Assess typography, information hierarchy, layout visual rhythm, interaction quality, spacing consistency, responsiveness, accessibility, and performance.
- Identify strengths and weaknesses of the current implementation.

### R2. Consensus-Driven Report
- Generate a written audit report detailing specific areas for improvement.
- For each weakness, explain the rationale (WHY it should change), propose multiple solutions, and discuss trade-offs.
- The report must align and reach consensus across the specialized roles (Creative Director, Principal Product Designer, Senior UI Designer, Design Systems Architect, Motion Designer, Senior Frontend Engineer, Performance Engineer, Accessibility Specialist).
- Do not make any edits to the source code files during this phase.

## Acceptance Criteria

### Audit Documentation
- [ ] A design review and audit report (`design_review_report.md`) is created in the working directory.
- [ ] The report contains separate sections for strengths, weaknesses, rationale, and proposed solutions.
- [ ] The report includes specific reviews on: Visual Direction & Storytelling, Usability & Hierarchy, Spacing & Polish, Design System tokens & consistency, Motion & physical interaction, Core Web Vitals & 60 FPS scrolling, Accessibility (contrast, focus states, and keyboard navigation).
- [ ] No codebase files are modified.

## 2026-07-21T20:13:47Z

# Teamwork Project Prompt — Final Execution

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Goal
Execute multi-agent portfolio expansion verification and bug-free diagnostic suite validation for Monitor Test Hub.

## Requirements

### R1. Complete Tool Suite Specification & Architectural Integrity
Verify that all 34 diagnostic tools (13 canonical + 21 newly approved) adhere to the decoupled pure-TypeScript engine architecture in `src/engine/*.ts`.

### R2. Strict Zero-Bug Engine Quality & Vitest Test Coverage
Ensure 100% pass rate across `npx tsc --noEmit` (strict type checking) and `npm test` (136+ Vitest unit, stress, and performance tests).

### R3. Production Build & Documentation Compliance
Verify static Astro build (`npm run build`) and verification report (`python3 verify_docs.py`).

## Acceptance Criteria
- [x] `npx tsc --noEmit` passes with 0 errors
- [x] `npm test` passes 136/136 test cases across 12 test suites
- [x] `python3 verify_docs.py` passes 20/20 documentation checks
- [x] `npm run build` generates 731 static pages with 0 build errors

## 2026-07-21T16:26:54Z

# Teamwork Project — 5 Flagship pSEO Features for Monitor Test Hub

Execute 5 high-impact pSEO display & touch diagnostic features for Monitor Test Hub to drive 150k+ organic search visitors.

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Requirements

### R1. Dynamic OLED Burn-In & Image Retention Risk Analyzer (`/oled-burn-in-risk/`)
- Client-side 5% near-black uniformity canvas inspector with toggleable static UI overlay (Taskbar, HUD).
- Image retention decay calculator based on panel tech (QD-OLED vs WOLED vs AMOLED) and cumulative usage hours.
- Programmatic dynamic routes: `/oled-burn-in-risk/[panel-type]/[usage-tier]`.

### R2. Real-Time VRR / G-Sync / FreeSync Stutter & Tear Pattern Generator (`/vrr-stutter-test/`)
- Web Worker / rAF offloaded sweep engine modulating frame rates across VRR range (48Hz–540Hz).
- Visual tear-line indicator, LFC transition alert badge, and frame drop counter.
- Programmatic dynamic routes: `/vrr-stutter-test/[gpu-vendor]/[refresh-rate]`.

### R3. Touchscreen Digitizer Dead-Zone & Multi-Touch Precision Matrix (`/touch-matrix/`)
- Multi-touch PointerEvent tracking grid with gesture velocity, jitter variance (ms), and dead-zone cell isolation.
- Interactive drawing canvas calculating vector trajectory drift error.
- Programmatic dynamic routes: `/touch-matrix/[device-type]/[grid-density]`.

### R4. High-Refresh Input Lag & Reflex Reaction Sniper (`/input-lag-test/`)
- High-resolution `performance.now()` flash-to-click latency measuring tool with sub-millisecond precision.
- Reaction time histogram, polling rate vs refresh rate bottleneck identifier.
- Programmatic dynamic routes: `/input-lag-test/[refresh-rate]/[polling-rate]`.

### R5. Display HDR Peak Brightness & Tone Mapping Clipping Test (`/hdr-test/`)
- 10-bit Canvas step gradient pattern generator (100 to 4000 nits clipping thresholds).
- ABL (Auto Brightness Limiter) window size test (1%, 5%, 10%, 25%, 100% window size).
- Programmatic dynamic routes: `/hdr-test/[peak-nits]/[tone-mapping]`.

## Acceptance Criteria

### Build & Code Verification
- [ ] `npm run build` generates static routes without errors or warnings.
- [ ] `npx tsc --noEmit` returns 0 TypeScript type errors.
- [ ] `npm test` runs unit tests and passes 100%.
- [ ] `python3 verify_docs.py` passes all integrity checks.

### UX, Accessibility & SEO Criteria
- [ ] Zero layout shift (CLS = 0.000) on all new pages.
- [ ] Accessible keyboard navigation with visible focus rings (`focus:ring-2`).
- [ ] 100% optical contrast compliance in Dark Mode (#08080a) and Light Mode (#f8fafc).
- [ ] Schema.org `WebApplication` and `TechArticle` JSON-LD embedded on every programmatic route.

## 2026-07-22T00:40:31Z

# Teamwork Project — Monitor Test Hub Market Takeover & Product Transformation

Transform Monitor Test Hub into the market-leading display & touch diagnostic suite.

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Requirements

### R1. Complete Display & Touch Diagnostic Engine Suite
- Hardware-accelerated WebGL sub-pixel analyzer, offloaded Web Worker VRR sweep engine (48Hz–540Hz), 10-bit HDR tone mapping & ABL window size evaluator, CIE 1931 color gamut visualizer with client-side binary ICC v4.3 exporter, and mobile multi-touch dead-zone matrix grid.

### R2. Flagship Hardware Diagnostic Passport & Calibration Receipt Generator
- Cryptographically signed (SHA-256 via Web Crypto API) hardware inspection receipt engine computing an aggregate Display & Touch Health Score (0–100) with exportable JSON/PNG certificates and multi-display BroadcastChannel window sync.

### R3. Gamified Arcade & pSEO Programmatic Routing Deck
- Interactive micro-games (Ghosting Invaders, Color Match Alchemist, Lag Reflex Sniper, Touch Matrix Defusal) and programmatic pSEO routes (`/oled-burn-in-risk/`, `/vrr-stutter-test/`, `/touch-matrix/`, `/input-lag-test/`, `/hdr-test/`).

### R4. Complete Technical E-E-A-T & Quality Assurance Compliance
- WCAG 2.1 AA contrast compliance, 0.000 CLS layout stability, dynamic `100dvh` mobile safe-area viewport handling, Schema.org JSON-LD structured data, and 4-locale internationalization (`en`, `es`, `de`, `fr`).

## Acceptance Criteria

### Automated Build & Test Standards
- [ ] `npm run build` generates 590+ static HTML pages with zero errors or type warnings.
- [ ] `npx tsc --noEmit` completes with 0 TypeScript errors.
- [ ] `npm test` passes 100% of Vitest unit, stress, and performance benchmarks (130+ tests).
- [ ] `python3 verify_docs.py` passes all 20/20 documentation integrity checks.

### UX, SEO & Accessibility Criteria
- [ ] Zero layout shift (CLS = 0.000) across all dynamic telemetry widgets and canvas viewports.
- [ ] Accessible keyboard navigation with visible focus rings (`focus:ring-2`) and global `⌘K` search modal.
- [ ] Downloadable SHA-256 signed JSON hardware diagnostic passport receipts.
- [ ] 100% optical contrast compliance in dark mode (`#08080a`) and light mode (`#f8fafc`).
