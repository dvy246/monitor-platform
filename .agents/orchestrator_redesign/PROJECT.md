# Project: DisplayTestOnline Diagnostic Test Page Redesign

## Architecture
- Framework: Astro v7 (static rendering) in `/Users/divyyadav/newws/monitor_test_hub`
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Components:
  - `StepWorkflowSection.astro` (Standardized numbered step workflow `01`, `02`, `03`)
  - `PanelTypeBreakdownSection.astro` (Standardized panel type comparison grid)
  - Diagnostic Bento Suite (`ScreenInfoCard.astro`, `QuickColorPalette.astro`, `KeyboardShortcutsCard.astro`, `CustomColorPicker.astro`)
  - `FAQSection.astro` & `<Layout faqs={faqs}>` for 10-item structured FAQs and JSON-LD schema
- Page categories to audit and upgrade:
  1. Main Display Test pages (`refresh-rate-test.astro`, `monitor-color-calibration.astro`, `sound-test.astro`, `/display-tests/*`, `/white-screen/*`)
  2. Touch Test pages (`/touch-tests/*`, `/touch-matrix/*`)
  3. Peripherals & Gaming Tools (`/mouse-test/*`, `/controller-test/*`, `/keyboard-tester/*`, `/benchmarks/*`, `/arcade/*`)

## Milestones

| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | Baseline Audit & Component Inventory | Audit all existing test pages and identify gaps across 149 routes | None | DONE | 76be5da9-6928-4678-901e-f8ed16c8289b |
| 2 | Display Tests & Visual Test Pages Redesign | Upgrade 39 display-tests and standalone visual pages to 10 FAQs + FAQSection, StepWorkflow, PanelBreakdown, MasterBento | M1 | DONE | 58c186dd-602d-43fb-b8e6-175cc791dacf |
| 3 | Touch, Sound & Touch Matrix Diagnostic Pages Redesign | Upgrade touch-tests, touch-matrix, sound-test sub-tools with Bento, StepWorkflow, PanelBreakdown, 10 FAQs + FAQSection | M1 | DONE | 817e566e-6f1d-4082-9a18-4cd4bf1f4546 |
| 4 | Peripheral, Arcade & Benchmark Pages Redesign | Upgrade mouse-test, controller-test, keyboard-tester, benchmarks, arcade micro-games with curved styling, Bento/Deck, StepWorkflow, PanelBreakdown, 10 FAQs | M1 | DONE | dffa824c-9499-430d-b85d-8b4c6d0145f8 |
| 5 | Quality Assurance & Build Verification | Run full verification (`tsc --noEmit`, `npm test`, `npm run build`) | M2, M3, M4 | DONE | f8b238ef-5bb6-4582-97ee-c0a54b5fd755 |
| 6 | Forensic Integrity Audit & Final Handoff | Conduct forensic audit, verify 0 violations, and deliver handoff to Sentinel | M5 | DONE | d3a47247-4d34-47ba-862f-3d4286703fe1 |

## Interface Contracts
- Components must accept standard props or locale params.
- `faqs` arrays must contain exactly 10 high-intent technical FAQ objects `{ question, answer }`.
- Design tokens & container classes: `rounded-3xl border border-white/10 bg-[#121215]`, inner containers `rounded-2xl bg-[#08080a]`.

## Code Layout
- Astro pages in `src/pages/`
- Astro UI components in `src/components/ui/` and `src/components/diagnostics/`
- Engines in `src/engine/`
