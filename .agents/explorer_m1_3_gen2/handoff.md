# HANDOFF REPORT — Explorer 3 (Replacement)

**Milestone**: Milestone 1 - Root Cause Mobile UX & Responsive Layout Engineering Audit  
**Task**: HTML5 Canvas & Interactive Visualizer Mobile Responsiveness Audit  
**Working Directory**: `/Users/divyyadav/newws/.agents/explorer_m1_3_gen2`

---

## 1. Observation

Direct observations from examining all 28 HTML5 Canvas and interactive visualizer components across `monitor_test_hub/src/`:

1. **`ResizeObserver` Usage**:
   - Grep search for `ResizeObserver` across `monitor_test_hub/src` returned **0 matches**.
   - All 28 canvas components use `window.addEventListener('resize', ...)` or lack resize handlers completely.

2. **`devicePixelRatio` & High-DPI Scaling**:
   - `MouseTesterCanvas.astro` (`src/components/diagnostics/MouseTesterCanvas.astro`, lines 261–262):
     ```typescript
     canvas.width = canvasContainer.clientWidth;
     canvas.height = canvasContainer.clientHeight;
     ```
     `window.devicePixelRatio` is omitted.
   - `color-gamut.astro` (`src/pages/display-tests/color-gamut.astro`, lines 259–262):
     ```typescript
     const W = canvas.clientWidth || 320;
     const H = W;
     canvas.width = W;
     canvas.height = H;
     ```
     `window.devicePixelRatio` is omitted.
   - `SubPixelAnalyzer.astro` (`src/components/diagnostics/SubPixelAnalyzer.astro`, lines 66–67):
     ```typescript
     canvas.width = 400;
     canvas.height = 160;
     ```
     Fixed canvas resolution regardless of viewport DPI.
   - `TouchMatrixTester.astro` (`src/components/diagnostics/TouchMatrixTester.astro`, lines 368–370):
     ```typescript
     canvas.width = (rect.width || 800) * dpr;
     canvas.height = (rect.height || 600) * dpr;
     ```
     `ctx.scale(dpr, dpr)` is missing. Text (`ctx.font = 'bold 12px monospace'`) and shapes are drawn without DPR scaling transform, causing micro-sized illegible rendering on 3x Retina displays.

3. **Fixed Attributes & Conflicting Mobile CSS Classes**:
   - `GamepadDriftInspector.astro` (`src/components/diagnostics/GamepadDriftInspector.astro`, lines 26 & 45):
     ```html
     <canvas id="left-stick-canvas" width="280" height="280" class="border border-white/10 rounded-lg bg-[#0e0e11] max-w-full h-auto"></canvas>
     ```
     Fixed `width="280"` exceeds the 240px available width on 320px mobile viewports (iPhone SE), forcing CSS downscaling distortion.
   - `TouchMatrixTester.astro` (line 170), `KeyboardTesterCanvas.astro` (line 86), `WhiteScreenCanvas.astro` (line 68), `OledBurnInAnalyzer.astro` (line 172), `DeviceDeadPixelInspector.astro` (line 93):
     ```html
     <div class="relative h-60 sm:h-[460px] min-h-[320px] max-w-full ...">
     ```
     `h-60` (240px) is directly overridden and contradicted by `min-h-[320px]` on viewports <640px.

4. **Event Listener & State Leaks**:
   - `OledBurnInAnalyzer.astro` (`src/components/diagnostics/OledBurnInAnalyzer.astro`, lines 437, 443–444):
     ```typescript
     window.addEventListener('resize', renderCanvas);
     document.addEventListener('DOMContentLoaded', initBurnInAnalyzer);
     document.addEventListener('astro:page-load', initBurnInAnalyzer);
     ```
     `astro:page-load` fires on every client-side page transition, continuously accumulating window `resize` event listeners without cleanup.

---

## 2. Logic Chain

1. **Step 1 (Observation 1 -> Scaling Lag)**: Because 0 out of 28 canvas components use `ResizeObserver`, canvas sizing logic only executes when `window.resize` fires. When a parent container resizes due to CSS flexbox/grid recalculations or drawer toggles, the canvas internal dimensions stay fixed, leading to bitmap distortion and layout shift.
2. **Step 2 (Observation 2 -> Blurry Rendering on Mobile Retina)**: Because components like `MouseTesterCanvas.astro`, `SubPixelAnalyzer.astro`, and `color-gamut.astro` set `canvas.width` directly to CSS `clientWidth` without multiplying by `devicePixelRatio`, high-DPI mobile devices (e.g. 3x Retina on iPhone 15 Pro) scale 1x pixels across 3x physical pixels, causing blurry trajectory lines and un-crisp graphics.
3. **Step 3 (Observation 2 -> Text / UI Micro-Sizing)**: In components like `TouchMatrixTester.astro`, `canvas.width` is multiplied by `dpr`, but `ctx.scale(dpr, dpr)` is omitted. Because coordinates and fonts are specified in un-scaled canvas space, `12px` font renders at 4 CSS pixels tall on 3x Retina displays, breaking UI legibility on mobile.
4. **Step 4 (Observation 3 -> Mobile Horizontal Overflow & Height Conflicts)**: In `GamepadDriftInspector.astro`, hardcoded HTML attributes `width="280"` collide with 240px available width on 320px mobile screens. In `TouchMatrixTester.astro`, `WhiteScreenCanvas.astro`, and `OledBurnInAnalyzer.astro`, `h-60` (240px) is contradicted by `min-h-[320px]`, creating CSS height calculation ambiguity.
5. **Step 5 (Observation 4 -> Memory / Re-render Leaks)**: Binding `window.addEventListener('resize', ...)` inside `initBurnInAnalyzer()` called via `astro:page-load` causes event listener accumulation over time, wasting memory and executing multiple duplicate canvas renders on every window resize.

---

## 3. Caveats

- **WebGL Canvas Engines**: WebGL contexts (if added in future subpixel extensions) require `gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)` in addition to canvas resolution scaling.
- **Orientation Transitions**: iOS Safari sometimes reports outdated `window.innerWidth` during viewport orientation rotation; using `ResizeObserver` on the parent container element completely mitigates this issue.

---

## 4. Conclusion

All 28 canvas and visualizer components in `monitor_test_hub/src/` require structural refactoring to establish a unified, robust, and mobile-friendly architecture:
1. Implement a shared `setupResponsiveCanvas` helper using `ResizeObserver` and automatic `window.devicePixelRatio` scaling with `ctx.scale(dpr, dpr)`.
2. Replace hardcoded canvas width/height attributes and conflicting `h-60 min-h-[320px]` class combinations with responsive `aspect-[4/3] sm:aspect-[16/9] min-h-[260px]` containers.
3. Clean up event listeners on page load / teardown to prevent memory leaks during Astro SPA client routing.

---

## 5. Verification Method

To independently verify these findings and confirm future fixes:

1. **Detailed Analysis File Inspection**:
   Inspect `/Users/divyyadav/newws/.agents/explorer_m1_3_gen2/analysis.md` for the full component matrix and root cause breakdown.

2. **Automated Vitest Engine Suite**:
   Run the project test suite from inside `monitor_test_hub/`:
   ```bash
   cd /Users/divyyadav/newws/monitor_test_hub
   TMPDIR=$PWD/.tmp npm test
   ```
   *Expected result*: All 317 unit/engine tests pass (100% PASS).

3. **TypeScript Compliance & Build Verification**:
   ```bash
   cd /Users/divyyadav/newws/monitor_test_hub
   npx tsc --noEmit
   TMPDIR=$PWD/.tmp npm run build
   ```
   *Expected result*: 0 TypeScript errors; successful build of all 2,807 static pages.

4. **Mobile Viewport Inspection (Chrome DevTools / Safari Web Inspector)**:
   - Emulate iPhone SE (320px viewport) and iPhone 15 Pro (393px viewport with DPR 3.0).
   - Inspect `#touch-matrix-canvas`, `#mouse-trajectory-canvas`, `#left-stick-canvas`, `#burnin-canvas`, and `#cie-canvas` to verify crisp DPR rendering and zero horizontal viewport scrollbars.
