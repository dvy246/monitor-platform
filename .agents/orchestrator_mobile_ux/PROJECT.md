# Project: Root Cause Mobile UX & Responsive Layout Engineering Audit

## Architecture
Monitor Test Hub (`/Users/divyyadav/newws/monitor_test_hub`) is an Astro v7 static web application with Tailwind CSS v4, dynamic HTML5 canvas diagnostic engines, and responsive UI components.

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Geometry & Layout Root Cause Audit | Complete codebase search & analysis for fixed widths (`100vw`, fixed `px`), `flex-nowrap`, grid overflows, unscaled SVGs/canvases, padding/margin overflows, and `overflow-x: hidden` band-aids across pages, layouts, and components. | None | DONE |
| 2 | Structural CSS/HTML & Canvas Responsiveness Implementation | Fix structural layout root causes, ensure dynamic `ResizeObserver` scaling and `devicePixelRatio` handling for interactive canvases (Touch Matrix, Mouse Canvas, Controller Visualizer, Audio FFT, Spacebar Counter), remove overflow hacks. | M1 | DONE |
| 3 | Multi-Breakpoint Empirical Verification & Quality Gate | Verify viewport parity across 320px, 360px, 375px, 390px, 414px, 430px, 480px, 768px (`scrollWidth == window.innerWidth`), run Vitest unit tests (317/317), TypeScript type check (0 errors), build verification, and Forensic Audit gate. | M2 | DONE |

## Interface Contracts
- Canvas elements must use `ResizeObserver` for parent-bound scaling and `window.devicePixelRatio` for high-DPI crispness without causing scrollbars.
- Layouts must adhere to standard box-sizing without relying on `overflow-x: hidden` to suppress horizontal overflow.
- All typography, headings, banners, tables, and cards must break/wrap within viewport bounds on mobile viewports down to 320px.

## Code Layout
- Main app: `/Users/divyyadav/newws/monitor_test_hub`
- Pages: `src/pages/`
- Layouts: `src/layouts/`
- UI & Diagnostic Components: `src/components/`
- Engines: `src/engine/`
