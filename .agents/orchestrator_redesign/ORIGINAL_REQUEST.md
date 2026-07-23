# Original User Request

## Initial Request — 2026-07-23T09:50:18+05:30

You are the Project Orchestrator for the DisplayTestOnline.com Diagnostic Test Page Redesign mission.

Working directory: /Users/divyyadav/newws/.agents/orchestrator_redesign
Project directory: /Users/divyyadav/newws/monitor_test_hub
Original user request file: /Users/divyyadav/newws/.agents/ORIGINAL_REQUEST.md

## Mission & Scope
Redesign every diagnostic test page across DisplayTestOnline.com into a state-of-the-art visual suite featuring curved box containers (`rounded-3xl`/`rounded-2xl`), specular highlights (`border-white/10`), 4-part Master Bento Diagnostic Suite (`ScreenInfoCard`, `QuickColorPalette`, `KeyboardShortcutsCard`, `CustomColorPicker`), Numbered Step Circle Workflows (`01`, `02`, `03`), Panel Type Breakdown Cards (*Professional IPS*, *Consumer IPS*, *VA Panel*, *OLED*), and E-E-A-T SEO technical articles with 10 structured FAQs.

## Requirements
1. Diagnostic Bento Integration: Incorporate 4-card diagnostic bento (`ScreenInfoCard`, `QuickColorPalette` with 12 swatches & active glow, `KeyboardShortcutsCard` with capsule keys & yellow TV remote hint, `CustomColorPicker` with hex input & preview CTA) across test pages.
2. Numbered Step Workflow Cards (`01`, `02`, `03`): Add "How To Test / Calibrate" section with numbered step circles inside dark rounded containers (`rounded-3xl border border-white/10 bg-[#121215]`), title, and description. (Standardized `StepWorkflowSection.astro` created).
3. Panel Type & Device Capability Comparison Grid: Add 4-card grid (*Professional IPS*, *Consumer IPS*, *VA Panel*, *OLED*) featuring colored monitor SVG icons (Red, Blue, Yellow, Purple), `rounded-3xl` cards with inner `rounded-2xl` dark containers (`bg-[#08080a]`), and detailed accuracy characteristics. (Standardized `PanelTypeBreakdownSection.astro` created).
4. E-E-A-T Technical SEO Articles & 10-Item Structured FAQs: Technical engineering articles with SVGs, tables, metrics, and exactly 10 real-intent technical FAQs paired with automatic `FAQPage` JSON-LD schema generation.

## Technical Verification Targets
- `npx tsc --noEmit` returns 0 errors.
- `TMPDIR=$PWD/.tmp npm test` passes 100% (329/329 unit tests across 57 test files).
- `TMPDIR=$PWD/.tmp npm run build` compiles cleanly (2,800+ static HTML pages).

## Operational Rules
- Work within `.agents/orchestrator_redesign/` for your planning and progress documents.
- Keep `.agents/orchestrator_redesign/progress.md` updated continuously with active status, completed items, and verification status so the Sentinel can track progress via cron scan.
- Dispatch worker/explorer subagents to execute implementation tasks cleanly and efficiently.
- When all tasks are complete and verified against acceptance criteria, produce `.agents/orchestrator_redesign/handoff.md` and claim victory to the Sentinel via `send_message`.
