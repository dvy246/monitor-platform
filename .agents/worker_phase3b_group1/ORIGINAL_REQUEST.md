## 2026-07-23T13:36:20Z
<USER_REQUEST>
You are Worker 2 (Phase 3B Group 1 Component & Visual Display Implementer) for the DisplayTestOnline.com Redesign Project.

Your working directory for coordination: `/Users/divyyadav/newws/.agents/worker_phase3b_group1/`.
The project codebase is located at `/Users/divyyadav/newws/monitor_test_hub/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK REQUIREMENTS:
1. Refer to the Phase 2 Technical Specifications artifact at `/Users/divyyadav/newws/.agents/explorer_phase2/handoff.md`.
2. Build and implement the 9 reusable Right Sidebar Astro components under `src/components/ui/sidebar/` (or `src/components/diagnostics/sidebar/`):
   - `InfoCard.astro`
   - `MetricCard.astro`
   - `ShortcutCard.astro`
   - `ConfigurationCard.astro`
   - `StatusCard.astro`
   - `PaletteCard.astro`
   - `TelemetryCard.astro`
   - `InspectorCard.astro`
   - `PassportCard.astro`

3. Upgrade all 12 Visual Display & Color diagnostic pages in `src/pages/`:
   - `refresh-rate-test.astro`
   - `monitor-color-calibration.astro`
   - `white-screen/index.astro`, `white-screen/[color].astro`
   - `display-tests/dead-pixel.astro`
   - `display-tests/sub-pixel.astro`
   - `display-tests/uniformity.astro`
   - `display-tests/vrr.astro`
   - `display-tests/oled-burn-in.astro`
   - `display-tests/hdr-test.astro`
   - `display-tests/ppi-calculator.astro`
   - `display-tests/color-gamut.astro`
   - `display-tests/return-window-checker/[slug].astro`

4. Layout & UI/UX Pro Max Requirements:
   - Convert pages to 2-column layout (`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8`: Left Canvas `lg:col-span-8` + Right Sidebar `lg:col-span-4 sticky top-24`).
   - SVG icons ONLY (Heroicons/Lucide). Zero raw text emojis (`🔬`, `📖`, `🎧`, `📥`).
   - All interactive controls have `cursor-pointer` and `transition-colors duration-200`.
   - Zero scale transforms (`scale-105`) or layout shifts on hover.
   - Touch targets min 44x44px; visible focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
   - Dark glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl`).

5. Verification Commands (run inside `/Users/divyyadav/newws/monitor_test_hub`):
   - `npx tsc --noEmit` (0 errors expected)
   - `TMPDIR=$PWD/.tmp npm test` (317+ unit tests PASS expected)

6. Save handoff report in `/Users/divyyadav/newws/.agents/worker_phase3b_group1/handoff.md` and send a summary message back to parent orchestrator.
</USER_REQUEST>
