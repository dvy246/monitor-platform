## 2026-07-22T18:46:14Z
You are Worker 1 implementing R1 (Viewport Overflow Elimination & Layout Wrapping) and R2 (Touch Canvas Frame Fitting & FAB Mobile Visibility).
Working directory: /Users/divyyadav/newws/.agents/worker_1
Project directory: /Users/divyyadav/newws/monitor_test_hub

Detailed Tasks:

1. R1 Viewport Overflow Elimination & Layout Wrapping:
   - `src/styles/global.css`: Ensure `html, body` enforce `max-width: 100% !important; max-width: 100vw !important; box-sizing: border-box !important; overflow-x: hidden !important; width: 100% !important;`.
   - Update `@media (max-width: 640px)` text wrapping rule in `global.css` to cover `h1, h2, h3, h4, h5, h6, p, span, kbd, code, a, li, td, th, div, label` with `overflow-wrap: anywhere !important; word-break: break-word !important; hyphens: auto;`.
   - `src/layouts/Layout.astro`: Ensure `#ymyl-routing-banner`, `<header>`, `<main>`, `<footer>`, and outer layout containers enforce `w-full max-w-full overflow-x-hidden box-border`.
   - `src/components/diagnostics/ModelTelemetryTable.astro`: Truncate or apply `break-all` / `break-words` for `entry.signatureHash` (line 136) so it doesn't force a >400px wide card on mobile viewports.
   - `src/components/diagnostics/GamepadDriftInspector.astro`: Add `max-w-full h-auto` to fixed `width="280"` canvases (lines 26 & 45).
   - `src/pages/passport/[hash].astro`: Add `max-w-full` / `w-full max-w-[380px]` to `<iframe>` (line 140).
   - `src/pages/index.astro`: Change outer `div` around telemetry table (line 110) from `overflow-hidden` to `overflow-x-auto`.
   - `src/components/seo/MedicalBounceBanner.astro`: Change `overflow-hidden` to `max-w-full overflow-x-hidden` and add `min-w-0` to inner flex elements.
   - Fix unwrapped `<code>` and inline elements across `about.astro`, `color-gamut.astro`, `privacy.astro`, `input-lag.astro`, and `compare/[slug].astro`.

2. R2 Touch Canvas Frame Fitting & FAB Mobile Visibility:
   - Update canvas frame fitting in `UniversalScreenTestDeck.astro`, `DeviceDeadPixelInspector.astro`, `TouchMatrixTester.astro`, `WhiteScreenCanvas.astro`, `KeyboardTesterCanvas.astro`, `OledBurnInAnalyzer.astro`, and `VrrStutterGenerator.astro`: enforce dynamic responsive height `h-60 sm:h-[460px] min-h-[320px] max-w-full`.
   - Update `FloatingActionMenu.astro` (FAB):
     - Ensure the container uses `hidden sm:flex` for baseline mobile hiding.
     - Fix `handleFullscreenChange()` JS function so it toggles `!hidden` or preserves the mobile `hidden` behavior when exiting fullscreen, so FAB NEVER shows on mobile viewports (< 640px) or obstructs test cards / swatches.

3. R3 Quality & Verification Checks:
   - Run `npx tsc --noEmit` in `monitor_test_hub/` and verify 0 errors.
   - Run `TMPDIR=$PWD/.tmp npm test` in `monitor_test_hub/` and verify 292/292 unit tests pass.
   - Run `python3 verify_docs.py` in `monitor_test_hub/` and verify 20/20 PASS.
   - Run `TMPDIR=$PWD/.tmp npm run build` in `monitor_test_hub/` and verify static HTML pages build cleanly.
