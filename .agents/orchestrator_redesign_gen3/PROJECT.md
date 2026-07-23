# Project: DisplayTestOnline Diagnostic Test Page Redesign

## Architecture
- Target Project: `/Users/divyyadav/newws/monitor_test_hub`
- Astro v7 static site generator (`output: 'static'`)
- Shared Diagnostic Components:
  - `MasterBentoDiagnosticSuite.astro` (`ScreenInfoCard`, `QuickColorPalette`, `KeyboardShortcutsCard`, `CustomColorPicker`)
  - `StepWorkflowSection.astro` (`01`, `02`, `03` step circles, `rounded-3xl border border-white/10 bg-[#121215]`)
  - `PanelTypeBreakdownSection.astro` (*Professional IPS*, *Consumer IPS*, *VA Panel*, *OLED* in `rounded-3xl` with inner `rounded-2xl bg-[#08080a]`)
  - `FAQSection.astro` (10 structured FAQs rendered visually and passed to `<Layout faqs={faqs}>` for JSON-LD schema)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Baseline Audit & Component Inventory | Shared UI components audit & standardized spec definition | none | DONE |
| 2 | Display & Standalone Visual Test Pages | Standalone visual, display-tests, and white-screen pages | M1 | DONE |
| 3 | Touch, Touch Matrix & Sound Diagnostic Pages | Touch-tests, touch-matrix, sound-test, and audio-tests pages | M1 | DONE |
| 4 | Peripherals, Arcade & Benchmark Pages | Mouse, controller, keyboard, benchmarks, arcade pages | M1 | DONE |
| 5 | Full Quality Assurance & Build Verification | `npx tsc --noEmit` (0 errors), `npm test` (329/329 passing), `npm run build` (2,814 pages) | M2, M3, M4 | DONE |
| 6 | Forensic Integrity Audit & Final Victory | Forensic audit verification (Verdict: CLEAN) & victory handoff report | M5 | DONE |

## Interface Contracts
- Standard layout: `<Layout title="..." description="..." faqs={faqs}>`
- FAQ requirement: Exactly 10 Q&A items in `const faqs = [...]` per tool page.
- Container styling: `rounded-3xl` outer card with specular `border-white/10` or `border-border-hairline`, inner `rounded-2xl bg-[#08080a]` or dark glass panels.
