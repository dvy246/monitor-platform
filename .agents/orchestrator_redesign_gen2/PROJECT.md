# Project: DisplayTestOnline Diagnostic Test Page Redesign

## Architecture
- Framework: Astro v7 (static rendering) in `/Users/divyyadav/newws/monitor_test_hub`
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Components:
  - `StepWorkflowSection.astro` (Standardized numbered step workflow `01`, `02`, `03`)
  - `PanelTypeBreakdownSection.astro` (Standardized panel type comparison grid)
  - Diagnostic Bento Suite (`ScreenInfoCard.astro`, `QuickColorPalette.astro`, `KeyboardShortcutsCard.astro`, `CustomColorPicker.astro`)
  - `FAQSection.astro` & `<Layout faqs={faqs}>` for 10-item structured FAQs and JSON-LD schema
- Page categories audited & upgraded (100% compliance):
  1. Main Display Test pages (`refresh-rate-test.astro`, `monitor-color-calibration.astro`, `sound-test.astro`, `/display-tests/*`, `/white-screen/*`)
  2. Touch Test pages (`/touch-tests/*`, `/touch-matrix/*`)
  3. Peripherals & Gaming Tools (`/mouse-test/*`, `/controller-test/*`, `/keyboard-tester/*`, `/benchmarks/*`, `/arcade/*`)

## Milestones

| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | Baseline Audit & Component Inventory | Audit all existing test pages and identify gaps across 149 routes | None | DONE | 76be5da9-6928-4678-901e-f8ed16c8289b |
| 2 | Display Tests & Visual Test Pages Redesign | Upgrade 39 display-tests and standalone visual pages to 10 FAQs + FAQSection, StepWorkflow, PanelBreakdown, MasterBento | M1 | DONE | cb2c65e7-9ba1-4c2f-88b5-73e4f1e4a242 |
| 3 | Touch, Sound & Touch Matrix Diagnostic Pages Redesign | Upgrade touch-tests, touch-matrix, sound-test sub-tools with Bento, StepWorkflow, PanelBreakdown, 10 FAQs + FAQSection | M1 | DONE | 5d19c20b-2946-450b-9239-d8155b824045 |
| 4 | Peripheral, Arcade & Benchmark Pages Redesign | Upgrade mouse-test, controller-test, keyboard-tester, benchmarks, arcade micro-games with curved styling, Bento/Deck, StepWorkflow, PanelBreakdown, 10 FAQs | M1 | DONE | 77ac366b-b7ae-4f41-a9d3-dab7d986ef44 |
| 5 | Quality Assurance & Build Verification | Run full verification (`tsc --noEmit`, `npm test`, `npm run build`, `verify_docs.py`) | M2, M3, M4 | DONE | d8955b93-45c4-4cdf-9c32-02fe85733a1e |
| 6 | Forensic Integrity Audit & Final Handoff | Conduct forensic audit, verify 0 violations, and deliver handoff to Sentinel | M5 | DONE | d1e2d6d4-7b72-4bab-81cf-1b0c5800118c |

## Interface Contracts
- Components accept standard props or locale params.
- `faqs` arrays contain exactly 10 high-intent technical FAQ objects `{ question, answer }`.
- Design tokens & container classes: `rounded-3xl border border-white/10 bg-[#121215]`, inner containers `rounded-2xl bg-[#08080a]`.

## Code Layout
- Astro pages in `src/pages/`
- Astro UI components in `src/components/ui/` and `src/components/diagnostics/`
- Engines in `src/engine/`
