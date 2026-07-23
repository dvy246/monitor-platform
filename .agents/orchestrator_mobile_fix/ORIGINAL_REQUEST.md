# Original User Request

## 2026-07-22T13:13:10Z

Fix mobile responsiveness, layout overflow, header/banner wrapping, and canvas frame fitting across all devices in Monitor Test Hub.

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

## Requirements

### R1. Complete Viewport Overflow Elimination
- Ensure html, body, #ymyl-routing-banner, header, and all container elements strictly enforce max-w-full overflow-x-hidden box-border.
- All text elements (h1, h2, h3, p, span, kbd) on mobile viewports (< 640px) must break long words or wrap naturally without forcing any document width beyond 100vw.
- No horizontal scrollbars on body document across any mobile viewport (320px to 430px).

### R2. Touch Canvas & Component Frame Fitting
- Every diagnostic tool canvas (UniversalScreenTestDeck, DeviceDeadPixelInspector, TouchMatrixTester, WhiteScreenCanvas, KeyboardTesterCanvas, OledBurnInAnalyzer) must scale dynamically within the mobile viewport frame (h-60 sm:h-[460px], min-h-[320px]).
- The Floating Action Button (FAB) menu must remain hidden (hidden sm:flex) or auto-minimize on mobile viewports so it NEVER obstructs test cards, swatches, or mobile browser address bars.

### R3. Quality & Verification
- Execute strict TypeScript type checks (npx tsc --noEmit), Vitest unit test suite (npm test), documentation verification (python3 verify_docs.py), and static production build (npm run build).
- Deploy updated static production bundle to Cloudflare Pages.

## Acceptance Criteria

### Mobile Responsiveness & Layout
- [ ] 0px horizontal document scroll on iPhone SE (320px), iPhone 15 Pro (393px), and small Android devices.
- [ ] 100% of headings and top notice banners wrap cleanly inside the visible screen bounds without clipping text.
- [ ] 0 floating buttons overlapping diagnostic cards or color picker swatches on mobile.

### Verification
- [ ] npx tsc --noEmit passes with 0 errors.
- [ ] npm test passes 292/292 unit tests.
- [ ] npm run build generates static HTML pages cleanly.
- [ ] Production build successfully deployed to Cloudflare Pages.
