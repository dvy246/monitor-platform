# Execution Plan — Monitor Test Hub pSEO Features

## Overview
Implement 5 high-impact pSEO display and touch diagnostic tools in Next.js / React under `/Users/divyyadav/newws/monitor_test_hub`.
Ensure 100% compliance with TypeScript, build checks, unit tests, verification script (`python3 verify_docs.py`), CLS=0.000, dark/light contrast, keyboard navigation (`focus:ring-2`), and Schema.org JSON-LD (WebApplication + TechArticle).

## Phases & Tasks

### Phase 1: Codebase Exploration & Project Architecture
- Dispatch `teamwork_preview_explorer` subagent(s) to inspect `/Users/divyyadav/newws/monitor_test_hub`:
  - Identify framework setup (Next.js App Router or Pages Router, Tailwind CSS, TypeScript, Test framework, `verify_docs.py`, common components, layout, metadata helpers, schema helpers).
  - Produce initial `PROJECT.md` documenting architecture, code layout, and interfaces.

### Phase 2: Milestone 1 — Dynamic OLED Burn-In Risk Analyzer
- Route: `/oled-burn-in-risk/` & `/oled-burn-in-risk/[panel-type]/[usage-tier]`
- Dynamic routes covering panel-type (qd-oled, woled, amoled, etc.) & usage-tier (heavy, moderate, light).
- Client-side 5% near-black uniformity canvas inspector with toggleable static UI overlays (Taskbar, HUD).
- Image retention decay calculator (QD-OLED vs WOLED vs AMOLED) and cumulative usage hours.
- JSON-LD WebApplication & TechArticle, contrast compliance, focus rings, unit tests.

### Phase 3: Milestone 2 — Real-Time VRR / G-Sync / FreeSync Stutter & Tear Pattern Generator
- Route: `/vrr-stutter-test/` & `/vrr-stutter-test/[gpu-vendor]/[refresh-rate]`
- Web Worker / rAF offloaded sweep engine modulating frame rates across VRR range (48Hz–540Hz).
- Visual tear-line indicator, LFC transition alert badge, frame drop counter.
- JSON-LD WebApplication & TechArticle, contrast compliance, focus rings, unit tests.

### Phase 4: Milestone 3 — Touchscreen Digitizer Matrix
- Route: `/touch-matrix/` & `/touch-matrix/[device-type]/[grid-density]`
- Multi-touch PointerEvent tracking grid with gesture velocity, jitter variance (ms), dead-zone cell isolation.
- Interactive drawing canvas calculating vector trajectory drift error.
- JSON-LD WebApplication & TechArticle, contrast compliance, focus rings, unit tests.

### Phase 5: Milestone 4 — High-Refresh Input Lag & Reflex Reaction Sniper
- Route: `/input-lag-test/` & `/input-lag-test/[refresh-rate]/[polling-rate]`
- High-resolution `performance.now()` flash-to-click latency measuring tool with sub-millisecond precision.
- Reaction time histogram, polling rate vs refresh rate bottleneck identifier.
- JSON-LD WebApplication & TechArticle, contrast compliance, focus rings, unit tests.

### Phase 6: Milestone 5 — Display HDR Peak Brightness & Tone Mapping Clipping Test
- Route: `/hdr-test/` & `/hdr-test/[peak-nits]/[tone-mapping]`
- 10-bit Canvas step gradient pattern generator (100 to 4000 nits clipping thresholds).
- ABL (Auto Brightness Limiter) window size test (1%, 5%, 10%, 25%, 100% window size).
- JSON-LD WebApplication & TechArticle, contrast compliance, focus rings, unit tests.

### Phase 7: Verification, Forensic Audit & Victory Report
- Run full suite checks (Worker/Reviewer/Challenger/Auditor):
  - `npm run build`
  - `npx tsc --noEmit`
  - `npm test`
  - `python3 verify_docs.py`
- Forensic Audit verification.
- Victory Report to Sentinel / Parent.
