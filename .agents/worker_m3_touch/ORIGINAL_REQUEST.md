## 2026-07-22T00:15:09Z
You are a Worker subagent (teamwork_preview_worker).
Your working directory for metadata: /Users/divyyadav/newws/.agents/worker_m3_touch/
Project codebase directory: /Users/divyyadav/newws/monitor_test_hub

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Task: Implement Milestone 3: Touchscreen Digitizer Dead-Zone & Multi-Touch Precision Matrix.

Requirements:
1. Base route `/touch-matrix/` and dynamic routes `/touch-matrix/[deviceType]/[gridDensity].astro`.
2. Device types: `tablet`, `smartphone`, `kiosk`, `touch-laptop`.
3. Grid densities: `low`, `medium`, `high`, `ultra-dense`.
4. Engine in `src/engine/TouchMatrixEngine.ts`:
   - Pure math multi-touch PointerEvent tracking calculations.
   - Pointer gesture velocity calculation (px/ms), jitter variance (ms delta), dead-zone matrix cell isolation algorithm.
   - Vector trajectory drift error calculation (Euclidean distance error between recorded touch path and ideal straight/curved vector).
   - Sanitize inputs (`Number.isFinite`, `.toLowerCase()`, fallback safely).
   - Comprehensive Vitest unit tests in `src/engine/TouchMatrixEngine.test.ts`.
5. UI Component in `src/components/diagnostics/TouchMatrixTester.astro`:
   - Interactive drawing canvas grid supporting multi-touch PointerEvents (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`).
   - Live visual grid highlighting touched cells, isolated dead zones, and trajectory drift vector lines.
   - Real-time telemetry HUD: active touch points count, gesture velocity, jitter variance (ms), trajectory drift error (%), dead-zone percentage.
   - Controls for device type preset, grid density selector, test mode (Dead Zone Grid, Multi-Touch Accuracy, Trajectory Drift).
   - Accessibility: `focus:ring-2 focus:ring-status-pass` on all controls, ARIA attributes.
   - Contrast compliance: Dark mode (#08080a) and Light mode (#f8fafc).
   - Zero layout shift (CLS = 0.000) with fixed min-height containers.
6. Create static routes:
   - `src/pages/touch-matrix/index.astro`
   - `src/pages/touch-matrix/[deviceType]/[gridDensity].astro`
   - `src/pages/[locale]/touch-matrix/index.astro`
   - `src/pages/[locale]/touch-matrix/[deviceType]/[gridDensity].astro`
   - Implement `getStaticPaths()` pre-rendering all device type and grid density combinations across all locales (`en`, `es`, `de`, `fr`).
7. Schema.org `WebApplication` and `TechArticle` JSON-LD embedded on every route via `<SEOHead>`.
8. Run build and verification commands:
   - `npm run build`
   - `npx tsc --noEmit`
   - `npm test`
   - `python3 verify_docs.py`

Write changes to `/Users/divyyadav/newws/.agents/worker_m3_touch/changes.md` and deliver handoff report to `/Users/divyyadav/newws/.agents/worker_m3_touch/handoff.md`.
Use message format when notifying completion:
**Context**: Milestone 3 Implementation
**Content**: Implementation complete, report written to /Users/divyyadav/newws/.agents/worker_m3_touch/handoff.md
**Action**: Review and verify Milestone 3.
