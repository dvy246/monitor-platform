## 2026-07-23T19:13:46Z
<USER_REQUEST>
You are Worker 4 (Phase 3B Group 3 Utility, Arcade & Database Implementer) for the DisplayTestOnline.com Redesign Project.

Your working directory for coordination: `/Users/divyyadav/newws/.agents/worker_phase3b_group3/`.
The project codebase is located at `/Users/divyyadav/newws/monitor_test_hub/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK REQUIREMENTS:
1. Refer to the Phase 2 Technical Specifications artifact at `/Users/divyyadav/newws/.agents/explorer_phase2/handoff.md` (Section 4.5).
2. Upgrade all 11 Utility Calculators, Micro-Arcade, and Device Database tool pages in `src/pages/`:
   - Utility Calculators (5): `benchmarks/pc-bottleneck.astro`, `benchmarks/wire-gauge-calculator.astro`, `benchmarks/3d-print-cost.astro`, `display-tests/electricity-cost.astro`, `display-tests/tv-viewing-distance.astro`
   - Diagnostic Micro-Arcade (4): `arcade/ghosting-invaders.astro`, `arcade/lag-reflex-sniper.astro`, `arcade/color-match-alchemist.astro`, `arcade/touch-matrix-defusal.astro`
   - Device Database & Comparison (2+): `models/index.astro`, `compare/index.astro`, `compare/screentester-alternative.astro`

3. Layout & Refactoring Directives:
   - Standardize container widths to `max-w-7xl mx-auto px-4 py-6 sm:py-8 font-sans`.
   - Convert every page to 2-column layout (`grid grid-cols-1 lg:grid-cols-12 gap-8`: Left Canvas `lg:col-span-8` + Right Sidebar `lg:col-span-4 sticky top-24`).
   - Import and instantiate the Right Sidebar Astro components from `src/components/ui/sidebar/` as specified in Section 4.5 of the Phase 2 architecture.
   - For `arcade/touch-matrix-defusal.astro`, add `max-w-7xl` wrapper, `<StepWorkflowSection />`, `<PanelTypeBreakdownSection />`, and `<FAQSection />`.
   - In `ApplianceEnergyInspector.astro` and `screentester-alternative.astro`, remove inline emoji options (`{app.icon}`) and Unicode checkmarks; replace with SVG icons.
   - In `models/index.astro` and `ColorMatchAlchemist.astro`, remove hover scale/translate transforms (`hover:-translate-y-0.5`, `hover:scale-105`).

4. UI/UX Pro Max 5 Strict Rules Enforcement:
   - SVG icons ONLY (Heroicons/Lucide). Zero text emojis.
   - Add `cursor-pointer` and `transition-colors duration-200` to interactive buttons, cards, and select elements.
   - NO hover scale transforms (`scale-105`) or layout shifts.
   - Min 44x44px touch target sizing on controls; visible focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
   - Dark glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl`).

5. Verification Commands (run inside `/Users/divyyadav/newws/monitor_test_hub`):
   - `npx tsc --noEmit` (0 errors expected)
   - `TMPDIR=$PWD/.tmp npm test` (317+ unit tests PASS expected)

6. Save handoff report in `/Users/divyyadav/newws/.agents/worker_phase3b_group3/handoff.md` and send a summary message back to parent orchestrator.
</USER_REQUEST>
