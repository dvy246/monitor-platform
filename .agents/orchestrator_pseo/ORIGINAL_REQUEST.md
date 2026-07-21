# Original User Request

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

## 2026-07-22T00:20:12Z

Resume work as Project Orchestrator successor (teamwork_preview_orchestrator, Generation 2).
Execute Milestone 4 (Input Lag Test), Milestone 5 (HDR Test), and Milestone 6 (E2E Integration & Hardening).
