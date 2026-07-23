# Project: Monitor Test Hub Mobile Responsiveness and Canvas Layout Overhaul

## Architecture
- Framework: Astro v7 (static export)
- Styling: Tailwind CSS v4 (@tailwindcss/vite)
- Target Viewports: Mobile 320px to 430px (iPhone SE, iPhone 15 Pro, Android), Tablet, Desktop
- Target Directory: /Users/divyyadav/newws/monitor_test_hub

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Viewport Overflow Elimination (R1) | html, body, #ymyl-routing-banner, header, text wrapping (h1, h2, h3, p, span, kbd) | None | DONE |
| 2 | Canvas Fitting & FAB Auto-Hide (R2) | Dynamic sizing (h-60 sm:h-[460px], min-h-[320px]) for UniversalScreenTestDeck, DeviceDeadPixelInspector, TouchMatrixTester, WhiteScreenCanvas, KeyboardTesterCanvas, OledBurnInAnalyzer; FAB mobile hidden/auto-minimize | None | DONE |
| 3 | Verification, Build & Deploy (R3) | npx tsc --noEmit (0 errors), npm test (292/292 tests pass), python3 verify_docs.py (20/20 PASS), npm run build (static generation), TMPDIR=$PWD/.tmp npm run deploy (Cloudflare Pages) | M1, M2 | DONE |

## Interface & Design Contracts
- Global CSS / layout wrappers enforce `max-w-full overflow-x-hidden box-border`.
- All mobile text breaks long words using CSS (`break-words overflow-wrap-anywhere` or Tailwind utilities).
- Canvas containers enforce `h-60 sm:h-[460px] min-h-[320px]` dynamic responsive frame fitting.
- FAB menu hides or auto-minimizes on mobile (`hidden sm:flex` or similar mobile-safe behavior).
