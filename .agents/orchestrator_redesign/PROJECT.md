# Project: DisplayTestOnline.com Redesign

## Architecture
- Framework: Astro v7 (`output: 'static'`)
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`
- Core Layout Paradigm: Left Diagnostic Canvas (flexible, primary interactivity surface) + Right Sidebar (unified component deck with Info, Metrics, Shortcuts, Configuration, Status, Palette, Telemetry, Inspector, Passport cards).
- Visual Identity Constraint: Retain existing dark theme (`#08080a` canvas, `#121215` surface, `#18181b` elevated), typography, hero language, technical branding, and homepage.
- Local Verification: Playwright visual regression baseline/comparison, `npm run build`, `npm run preview`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Phase 1: Cross-Functional Design Analysis | Audit all diagnostic tool pages (Visual Display, Touch Screen, Audio & Input, Utility). Extract ScreenTester.io UX principles (hierarchy, disclosure, workflow, rhythm). Produce complete redesign plan artifact for user approval. | none | DONE |
| 2 | Phase 2: Unified Component Architecture | Design Right Sidebar component system (InfoCard, MetricCard, ShortcutCard, ConfigurationCard, StatusCard, PaletteCard, TelemetryCard, InspectorCard, PassportCard). Produce component mapping matrix across all diagnostic tools for user approval. | M1 (Approved) | DONE |
| 3 | Phase 3A: Visual Regression Suite Setup | Create Playwright visual regression test scripts (`tests/e2e/visual-regression.spec.ts`) capturing baseline screenshots of all diagnostic tool routes in local dev environment. | M2 (Approved) | DONE |
| 4 | Phase 3B: Incremental Tool Redesign & Verification | Upgrade pages systematically (Visual Display → Touch Screen → Audio & Input → Utility) using unified component system. Verify zero regressions via Playwright visual comparison and Vitest unit tests. | M3 | IN_PROGRESS |
| 5 | Phase 3C: Final System Audit & Delivery | Verify local production build (`npm run build`), preview server (`npm run preview`), complete Playwright visual regression pass, forensic audit, and submit final human report. | M4 | PLANNED |

## Interface Contracts & Layout Constraints
- All diagnostic pages MUST maintain the Left Canvas / Right Sidebar layout on desktop (`lg:grid lg:grid-cols-12`, Canvas spanning `lg:col-span-8` or `lg:col-span-7`, Sidebar spanning `lg:col-span-4` or `lg:col-span-5`).
- On mobile viewports (< 1024px), Right Sidebar components collapse cleanly below or above the canvas according to progressive disclosure priorities without horizontal overflow.
- Component props and state contracts must be TypeScript-strict with 0 type errors.

## UI/UX Pro Max Rules (Strict Enforcement)
1. **SVG Icons Only**: Zero emoji icons in UI controls, indicators, or cards. Use Lucide/Heroicons SVG paths with fixed `viewBox="0 0 24 24"` and explicit dimensions (`w-5 h-5` / `w-6 h-6`).
2. **Interactive Cursor & Transitions**: Apply `cursor-pointer` to all interactive cards, controls, and buttons. Use `transition-colors duration-200` or `transition-opacity duration-200`.
3. **Hover Stability**: DO NOT use layout-shifting transforms (such as `scale-105` or `hover:translate-y-1`). Use border highlight (`border-emerald-500/50`), subtle background shift (`bg-white/[0.04]`), or glow ring.
4. **Touch & Accessibility**: Minimum 44x44px touch target dimensions for interactive controls (`min-h-[44px] min-w-[44px]`). Visible, high-contrast focus rings (`focus:outline-none focus:ring-2 focus:ring-emerald-500`).
5. **Layout & Glassmorphic Consistency**: Enforce global `max-w-7xl` container bounds across all pages. Standardize glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-2xl` or `rounded-3xl`).

## Code Layout
- Source files: `monitor_test_hub/src/`
  - Engine logic: `src/engine/` (100% pure TS)
  - Diagnostic Pages: `src/pages/`
  - Reusable Right Sidebar Components: `src/components/diagnostics/sidebar/` (or `src/components/ui/`)
  - Layouts: `src/layouts/`
- Visual Regression Tests: `monitor_test_hub/tests/e2e/`
