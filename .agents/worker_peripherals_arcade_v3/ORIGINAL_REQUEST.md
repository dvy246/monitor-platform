## 2026-07-23T04:40:06Z
You are worker_peripherals_arcade_v3 (Peripherals, Arcade & Benchmarks Redesign Worker).
Your working directory is: /Users/divyyadav/newws/.agents/worker_peripherals_arcade_v3
Project directory: /Users/divyyadav/newws/monitor_test_hub

## Mission & Objectives
Redesign and upgrade all peripheral, arcade micro-game, and benchmark calculator pages in DisplayTestOnline.com (`monitor_test_hub`).

Target Pages Scope:
1. All sub-pages in `src/pages/mouse-test/*` (`index.astro`, `polling-rate.astro`, `double-click.astro`, `dpi-solver.astro`, `cps-test.astro`, `scroll-wheel.astro`, etc.)
2. All sub-pages in `src/pages/controller-test/*` (`index.astro`, `gamepad-tester.astro`, `stick-drift.astro`, `polling-rate.astro`, etc.)
3. All sub-pages in `src/pages/keyboard-tester/*` (`index.astro`, `switches.astro`, `switches/[slug].astro`, `[slug].astro`)
4. All sub-pages in `src/pages/benchmarks/*` (`index.astro`, `pc-bottleneck.astro`, `pc-bottleneck/[slug].astro`, `wire-gauge-calculator.astro`, `wire-gauge-calculator/[slug].astro`, `3d-print-cost.astro`, `3d-print-cost/[slug].astro`, etc.)
5. All sub-pages in `src/pages/arcade/*` (`index.astro`, `ghosting-invaders.astro`, `lag-reflex.astro`, `color-alchemist.astro`, `touch-defusal.astro`, etc.)

Requirements for 100% of target pages:
- **Diagnostic Bento Suite**: Integrate `MasterBentoDiagnosticSuite.astro` (or the 4-card bento: `ScreenInfoCard`, `QuickColorPalette` with 12 swatches, `KeyboardShortcutsCard` with yellow TV remote hint, `CustomColorPicker` with hex input & preview CTA).
- **Step Workflow Cards**: Integrate `StepWorkflowSection.astro` (numbered step circles `01`, `02`, `03` in `rounded-3xl border border-white/10 bg-[#121215]`).
- **Panel Type / Device Capability Grid**: Integrate `PanelTypeBreakdownSection.astro` (*Professional IPS*, *Consumer IPS*, *VA Panel*, *OLED* or hardware capability breakdown in `rounded-3xl` cards with inner `rounded-2xl bg-[#08080a]`).
- **E-E-A-T Technical SEO Articles with 10 structured FAQs & JSON-LD schema**: Ensure `<Layout faqs={faqs}>` and `<FAQSection faqs={faqs} />` are used with 10 high-intent technical FAQs per primary tool page.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Verification Protocol
Inside `monitor_test_hub`, run:
1. `npx tsc --noEmit` (must pass with 0 errors)
2. `TMPDIR=$PWD/.tmp npm test` (must pass 329/329 unit tests)
3. `TMPDIR=$PWD/.tmp npm run build` (must compile static pages cleanly)

## Reporting
- Update `/Users/divyyadav/newws/.agents/worker_peripherals_arcade_v3/progress.md` with step status.
- Write `/Users/divyyadav/newws/.agents/worker_peripherals_arcade_v3/handoff.md` with: Observation, Logic Chain, Caveats, Conclusion, Verification Method.
- Send a completion message back to parent conversation ID: 0875362c-95f7-48a8-8e1b-b339e3ba70a6.
