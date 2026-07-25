## 2026-07-23T16:52:48Z
You are Worker Phase 3B Group 3 (Implementer & QA Specialist) for DisplayTestOnline.com Redesign (`monitor_test_hub`).

Working directory: `/Users/divyyadav/newws/.agents/worker_phase3b_group3_v3`
Codebase: `/Users/divyyadav/newws/monitor_test_hub`

YOUR ASSIGNMENT:
Upgrade all Phase 3B Group 3 pages (5 Utility Calculators, 4 Micro-Arcade, 3 Device Database/Comparison pages) to the Left Canvas + Right Sidebar 2-column architecture using reusable Right Sidebar components from `src/components/ui/sidebar/`.

TARGET PAGES & COMPONENTS TO UPGRADE:
1. Utility Calculators (5 pages):
   - `src/pages/benchmarks/pc-bottleneck.astro` -> Right Sidebar stack: `StatusCard`, `ConfigurationCard`, `MetricCard`, `PassportCard`
   - `src/pages/benchmarks/wire-gauge-calculator.astro` -> Right Sidebar stack: `StatusCard`, `ConfigurationCard`, `MetricCard`, `InfoCard`
   - `src/pages/benchmarks/3d-print-cost.astro` -> Right Sidebar stack: `StatusCard`, `ConfigurationCard`, `MetricCard`, `InfoCard`
   - `src/pages/display-tests/electricity-cost.astro` (and clean inline text emojis in `src/components/diagnostics/ApplianceEnergyInspector.astro`) -> Right Sidebar stack: `StatusCard`, `ConfigurationCard`, `MetricCard`, `InfoCard`
   - `src/pages/display-tests/tv-viewing-distance.astro` -> Right Sidebar stack: `StatusCard`, `ConfigurationCard`, `MetricCard`, `InfoCard`

2. Micro-Arcade Pages (4 pages):
   - `src/pages/arcade/ghosting-invaders.astro` -> Right Sidebar stack: `StatusCard`, `TelemetryCard`, `ConfigurationCard`, `MetricCard`, `ShortcutCard`
   - `src/pages/arcade/lag-reflex-sniper.astro` -> Right Sidebar stack: `StatusCard`, `TelemetryCard`, `MetricCard`, `ShortcutCard`
   - `src/pages/arcade/color-match-alchemist.astro` -> Right Sidebar stack: `StatusCard`, `MetricCard`, `ConfigurationCard`, `ShortcutCard`
   - `src/pages/arcade/touch-matrix-defusal.astro` -> Right Sidebar stack: `StatusCard`, `TelemetryCard`, `MetricCard`, `ShortcutCard`

3. Device Database & Comparison Pages (3 pages):
   - `src/pages/models/index.astro` -> Right Sidebar stack: `ConfigurationCard`, `StatusCard`, `InfoCard` (remove hover scale/translate transforms)
   - `src/pages/compare/index.astro` -> Right Sidebar stack: `StatusCard`, `ConfigurationCard`, `PassportCard`, `InfoCard`
   - `src/pages/compare/screentester-alternative.astro` -> Right Sidebar stack: `StatusCard`, `PassportCard`, `InfoCard` (replace text emojis `{app.icon}` or unicode checkmarks with clean SVG icons)

ARCHITECTURE & DESIGN CONSTRAINTS:
- Container: `max-w-7xl mx-auto px-4 py-6 sm:py-8 font-sans`
- Layout: 2-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-8`: Left Canvas `lg:col-span-8` + Right Sidebar `lg:col-span-4 sticky top-24`)
- Import reusable Right Sidebar components from `src/components/ui/sidebar/` (`InfoCard`, `MetricCard`, `ShortcutCard`, `ConfigurationCard`, `StatusCard`, `PaletteCard`, `TelemetryCard`, `InspectorCard`, `PassportCard`).
- Retain existing engine math/logic imports from `src/engine/`.
- Maintain standard 4-part structure: Left Canvas / Right Sidebar deck, `<StepWorkflowSection />`, `<PanelTypeBreakdownSection />`, and `<FAQSection faqs={faqs} />` with 10 structured Q&A items passed to `<Layout faqs={faqs}>`.
- UI/UX Pro Max 5 Strict Rules:
  1. SVG icons ONLY (NO text/emoji characters in UI controls, badges, indicators, or cards). Use Lucide/Heroicons SVG paths with fixed `viewBox="0 0 24 24"` and `w-5 h-5` / `w-6 h-6`.
  2. `cursor-pointer` on all interactive cards, controls, and swatches with `transition-colors duration-200`.
  3. NO hover scale (`scale-105`) or layout shifting transforms (`-translate-y-0.5`). Use border/background/glow highlight on hover.
  4. Minimum 44x44px touch targets (`min-h-[44px] min-w-[44px]`) and visible high-contrast focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
  5. Dark glassmorphism container styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6`).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

VERIFICATION COMMANDS (Run with Cwd="/Users/divyyadav/newws/monitor_test_hub"):
1. `npx tsc --noEmit`
2. `TMPDIR=$PWD/.tmp npm test`

When verified clean with 0 errors and passing tests, write `handoff.md` in `/Users/divyyadav/newws/.agents/worker_phase3b_group3_v3/` and send a message back to parent.
