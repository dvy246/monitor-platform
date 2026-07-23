# Mobile Responsive Canvas & Interactive Visualizer Engineering Audit

## 1. Executive Summary

This report presents a root-cause technical audit of all **28 dynamic HTML5 Canvas elements and interactive visualizer components** across `monitor_test_hub/src/`. The investigation evaluated performance, layout stability, high-DPI scaling, and responsive behavior on mobile viewports ranging from **320px to 430px** (e.g. iPhone SE, iPhone 14/15 Pro, Pixel 7, Samsung Galaxy S23).

### Key Audit Findings:
1. **0% `ResizeObserver` Adoption (28/28 components)**: Not a single canvas component in `monitor_test_hub/src/` uses `ResizeObserver`. All components rely exclusively on `window.addEventListener('resize', ...)`, which fails to detect parent container resizes (e.g., flexbox/grid recalculations, drawer toggles, font loading) and fails to clean up event listeners on page transitions.
2. **High-DPI (`devicePixelRatio`) Scaling Inconsistencies**:
   - Multiple components (`MouseTesterCanvas.astro`, `SubPixelAnalyzer.astro`, `color-gamut.astro` `cie-canvas`) omit `window.devicePixelRatio` entirely, rendering blurry graphics on 2x/3x Retina screens.
   - Other components (`TouchMatrixTester.astro`, `GhostingInvaders.astro`) scale canvas pixel buffer dimensions by DPR but omit `ctx.scale(dpr, dpr)`, causing hardcoded pixel fonts (`12px monospace`) and circle radii to shrink to illegible micro-sizes on mobile Retina displays.
3. **Conflicting CSS Height Utility Bad Smells (`h-60 sm:h-[460px] min-h-[320px]`)**:
   - Present across `TouchMatrixTester.astro`, `KeyboardTesterCanvas.astro`, `WhiteScreenCanvas.astro`, `OledBurnInAnalyzer.astro`, and `DeviceDeadPixelInspector.astro`.
   - On 320px mobile screens, Tailwind class `h-60` (240px) is directly overridden and contradicted by `min-h-[320px]`, causing layout height calculation conflicts.
4. **Event Listener Leaks & Stale Coordinate Caching**:
   - `OledBurnInAnalyzer.astro` binds re-initialization to `astro:page-load`, leaking window `resize` listeners on every client-side navigation.
   - `HeroDiagnosticScope.astro` caches bounding client rects on `mouseenter` and `resize` without `ResizeObserver`, causing touch/mouse crosshair tracking offsets if layout shifts occur.

---

## 2. Comprehensive Inventory of Canvas & Visualizer Components

| Component | Target File | Element Selector / ID | Current Resize Mechanism | DPR Scaling Status | Mobile Overflow / Height Issue |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Touch Matrix Tester** | `src/components/diagnostics/TouchMatrixTester.astro` | `#touch-matrix-canvas` | `window.resize` | Buffer scaled, `ctx.scale` missing (text/radius micro-sized) | `h-60 sm:h-[460px] min-h-[320px]` conflict |
| **Mouse Trajectory Canvas** | `src/components/diagnostics/MouseTesterCanvas.astro` | `#mouse-trajectory-canvas` | `window.resize` | **NO DPR scaling** (`canvas.width = clientWidth`) | Blurry on Retina displays |
| **Gamepad Drift Inspector** | `src/components/diagnostics/GamepadDriftInspector.astro` | `#left-stick-canvas`, `#right-stick-canvas` | None | Fixed attributes `280x280` | `width="280"` exceeds 240px card space on 320px screen |
| **Controller Visualizer** | `src/components/diagnostics/ControllerTesterCanvas.astro` | SVG Vector Shell | CSS Responsive | Native SVG ViewBox | `min-w-[840px]` inner container |
| **Audio FFT Visualizer** | `src/components/diagnostics/AudioTesterCanvas.astro` | `#audio-visualizer` | Static CSS | None | Fixed height `h-64` (256px) |
| **Spacebar Cadence Graph** | `src/components/diagnostics/SpacebarCounterCanvas.astro` | `#sb-cadence-svg` | SVG `preserveAspectRatio` | N/A | Safe SVG scaling |
| **Keyboard Visual Grid** | `src/components/diagnostics/KeyboardTesterCanvas.astro` | `#keyboard-visual-grid` | Touch Pan Horizontal Scroll | N/A | `min-w-[840px]` forces horizontal scroll; `h-60 min-h-[320px]` conflict |
| **White Screen Canvas** | `src/components/diagnostics/WhiteScreenCanvas.astro` | `#lighting-preview-box` | DOM CSS Background | N/A | `h-60 sm:h-[460px] min-h-[320px]` conflict |
| **OLED Burn-In Analyzer** | `src/components/diagnostics/OledBurnInAnalyzer.astro` | `#burnin-canvas` | `window.resize` + `astro:page-load` | `ctx.scale(dpr, dpr)` used | Listener leak on `astro:page-load`; `h-60 min-h-[320px]` conflict |
| **Ghosting Invaders** | `src/components/arcade/GhostingInvaders.astro` | `#gi-canvas` | `window.resize` | Buffer scaled, manual `* scale` in draw calls | No container aspect-ratio constraint |
| **Lag Reflex Sniper** | `src/components/arcade/LagReflexSniper.astro` | `#lrs-canvas` | `window.resize` | Buffer scaled, manual `* scale` | No container aspect-ratio constraint |
| **Touch Matrix Defusal** | `src/components/arcade/TouchMatrixDefusal.astro` | `#tmd-canvas` | `window.resize` | Buffer scaled, inverse scale hacks | No container aspect-ratio constraint |
| **Refresh Rate Motion Sweep** | `src/components/diagnostics/RefreshRateInspector.astro` | `#motion-sweep-canvas` | `window.resize` | `canvas.height = 280 * dpr`, no `ctx.scale` | Fixed `width="800" height="280"` attributes + `h-[280px]` |
| **Device Dead Pixel Inspector** | `src/components/diagnostics/DeviceDeadPixelInspector.astro` | `#device-test-canvas` | DOM Division Box | N/A | `h-60 sm:h-[460px] min-h-[320px]` conflict |
| **Sub-Pixel Geometry Loupe** | `src/components/diagnostics/SubPixelAnalyzer.astro` | `#subpixel-canvas` | None | **Fixed 400x160 canvas resolution** | Blurry on Retina displays |
| **Dead Zone Matrix** | `src/components/diagnostics/DeadZoneMatrix.astro` | `#deadzone-canvas` | `window.resize` | Buffer scaled, no `ctx.scale` | Height dependent on flex layout |
| **Multi-Touch Detector** | `src/components/diagnostics/MultiTouchDetector.astro` | `#multitouch-canvas` | `window.resize` | Buffer scaled, hardcoded DPR offsets | Height dependent on flex layout |
| **Swipe Tracker** | `src/components/diagnostics/SwipeTracker.astro` | `#swipe-canvas` | `window.resize` | Buffer scaled, manual line width scaling | Height dependent on flex layout |
| **Vector Precision Engine** | `src/components/diagnostics/VectorPrecisionEngine.astro` | `#vector-canvas` | `window.resize` | Buffer scaled, mixed scaling | Height dependent on flex layout |
| **Touch Sampling Inspector** | `src/components/diagnostics/TouchSamplingRateInspector.astro` | `#touch-canvas` | `window.resize` | `ctx.scale(dpr, dpr)` used | Container layout dependency |
| **Hero Diagnostic Scope** | `src/components/diagnostics/HeroDiagnosticScope.astro` | `#hero-scope-canvas` | `window.resize` | `cachedRect` tracking without observer | Stale rect caching on layout reflow |
| **Input Lag Sniper** | `src/components/diagnostics/InputLagSniper.astro` | `#sniper-canvas` | `window.resize` | `ctx.scale(dpr, dpr)` used | Absolute inset container |
| **HDR Clipping Tester** | `src/components/diagnostics/HdrClippingTester.astro` | `#hdr-clipping-canvas` | `window.resize` | `ctx.scale(dpr, dpr)` used | Full width container |
| **PWM Flicker Inspector** | `src/components/diagnostics/PwmFlickerInspector.astro` | `#flicker-canvas` | `window.resize` | `ctx.scale(dpr, dpr)` used | Fixed height container |
| **Blooming Test Inspector** | `src/components/diagnostics/BloomingTestInspector.astro` | `#blooming-canvas` | `window.resize` | Buffer scaled | Full width container |
| **VRR Stutter Generator** | `src/components/diagnostics/VrrStutterGenerator.astro` | `#vrr-generator-canvas` | `window.resize` | Buffer scaled | Full width container |
| **VRR Stutter Engine** | `src/components/diagnostics/VrrStutterEngine.astro` | `#vrr-canvas` | `window.resize` | Buffer scaled | Full width container |
| **CIE 1931 Chromaticity Map** | `src/pages/display-tests/color-gamut.astro` | `#cie-canvas` | `window.resize` | **NO DPR scaling** (`canvas.width = clientWidth`) | Blurry on Retina displays; aspect-ratio 1/1 |

---

## 3. Deep-Dive Root Cause Analysis by Category

### Category 1: Lack of `ResizeObserver` & High-DPI Scaling Flaws

#### Root Cause 1.1: Global Window Resize vs Container Observation
In pure responsive layouts, elements resize when parent container dimensions change (e.g. sidebar toggle, flex wrap, CSS container query). Relying solely on `window.addEventListener('resize', ...)` causes:
- Blurry canvas rendering if the parent container resizes due to DOM shifts without a browser window resize event.
- Stale coordinate calculations when mapping `e.clientX / e.clientY` to canvas space.

#### Root Cause 1.2: Omission of `devicePixelRatio`
Components such as `MouseTesterCanvas.astro` (lines 260-263) and `color-gamut.astro` (lines 259-262) initialize canvas buffer size as follows:
```typescript
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;
```
On a 3x Retina display (e.g. iPhone 15 Pro, 393px viewport), the canvas CSS size is 393px, but the physical hardware resolution is 1179px. With `canvas.width = 393`, the browser stretches the 393px bitmap to 1179px physical pixels, creating noticeable blurriness on lines, spline curves, and text.

#### Root Cause 1.3: Buffer DPR Scaling Without `ctx.scale(dpr, dpr)` Context Transform
In `TouchMatrixTester.astro` (line 368), `canvas.width` is correctly scaled by `dpr`:
```typescript
canvas.width = (rect.width || 800) * dpr;
canvas.height = (rect.height || 600) * dpr;
```
However, `ctx.scale(dpr, dpr)` is **never called**. As a result:
- Coordinate space remains $[0, \text{width} \times \text{dpr}]$ instead of $[0, \text{width}]$.
- Hardcoded drawing values, such as `ctx.font = 'bold 12px monospace'` (line 563) and `ctx.arc(head.x, head.y, 24, 0, Math.PI * 2)` (line 552), render at $1/3^{\text{rd}}$ of their intended physical size on 3x Retina displays!

---

### Category 2: Fixed Dimension Attributes & CSS Height Conflicts on Mobile (320px-430px)

#### Root Cause 2.1: Hardcoded Canvas Width Attributes (`width="280"`, `width="800"`)
- `GamepadDriftInspector.astro` (lines 26 & 45):
  ```html
  <canvas id="left-stick-canvas" width="280" height="280" class="border border-white/10 rounded-lg bg-[#0e0e11] max-w-full h-auto"></canvas>
  ```
  On a 320px mobile viewport (iPhone SE), card padding reduces available width to ~240px. The canvas bitmap ratio stays at 280x280 while CSS forces it to scale down to 240px wide. Without high-DPI scaling, the canvas renders at a blurry non-integer downscaled resolution.
- `RefreshRateInspector.astro` (line 96):
  ```html
  <canvas id="motion-sweep-canvas" width="800" height="280" class="w-full h-[280px] rounded-lg bg-[#0a0a0d] block cursor-crosshair"></canvas>
  ```
  HTML attributes set a 800x280 default before JavaScript initializes, causing initial layout aspect ratio distortion.

#### Root Cause 2.2: Height Class Mismatch (`h-60 sm:h-[460px] min-h-[320px]`)
Found across 5 primary diagnostic visualizer containers:
- `TouchMatrixTester.astro` (line 170)
- `KeyboardTesterCanvas.astro` (line 86)
- `WhiteScreenCanvas.astro` (line 68)
- `OledBurnInAnalyzer.astro` (line 172)
- `DeviceDeadPixelInspector.astro` (line 93)

```html
<div class="relative h-60 sm:h-[460px] min-h-[320px] max-w-full ...">
```
- On mobile viewports (<640px), Tailwind `h-60` computes to `15rem` = `240px`.
- However, `min-h-[320px]` mandates a minimum height of `320px`.
- Because `320px > 240px`, `min-h-[320px]` **overrides `h-60`**, making `h-60` dead code and creating height ambiguity that triggers Cumulative Layout Shift (CLS) on dynamic viewport changes.

---

### Category 3: Event Listener Leaks & Stale Coordinate Caching

#### Root Cause 3.1: Duplicate Listener Registration on `astro:page-load`
In `OledBurnInAnalyzer.astro` (lines 437, 443-444):
```typescript
window.addEventListener('resize', renderCanvas);
document.addEventListener('DOMContentLoaded', initBurnInAnalyzer);
document.addEventListener('astro:page-load', initBurnInAnalyzer);
```
With Astro client-side SPA router enabled, navigating back and forth to `/display-tests/oled-burn-in` triggers `astro:page-load` repeatedly, binding duplicate `resize` event listeners to `window` without cleanup.

#### Root Cause 3.2: Stale Bounding Rect Caching
In `HeroDiagnosticScope.astro` (lines 63, 83, 92):
```typescript
let cachedRect = container.getBoundingClientRect();
container.addEventListener('mouseenter', () => {
  cachedRect = container.getBoundingClientRect();
});
```
`cachedRect` is only refreshed on `mouseenter` or `window.resize`. If the page scrolls or content shifts vertically above `hero-scope-container`, `cachedRect.top` becomes incorrect, leading to offset pointer calculation errors in `targetY = (e.clientY - cachedRect.top) * dpr`.

---

## 4. Proposed Structural Architecture Fix Pattern

To resolve all dynamic canvas scaling, high-DPI blurriness, layout shift, and memory leak issues across the project, all canvas components should adopt a standardized **`CanvasResizeObserver` pattern**:

### Standardized `CanvasResizeObserver` Implementation Pattern

```typescript
export interface CanvasResizeOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  onResize?: (width: number, height: number, dpr: number) => void;
}

export function setupResponsiveCanvas({ canvas, container, onResize }: CanvasResizeOptions) {
  let ctx = canvas.getContext('2d');
  
  const handleResize = (entries: ResizeObserverEntry[]) => {
    if (!entries.length) return;
    const entry = entries[0];
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;
    const dpr = window.devicePixelRatio || 1;

    // Set internal buffer size to physical hardware pixels
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Apply global context scale so all drawing code uses CSS logical coordinates
    if (ctx) {
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }

    if (onResize) {
      onResize(width, height, dpr);
    }
  };

  const observer = new ResizeObserver(handleResize);
  observer.observe(container);

  // Return cleanup function to destroy observer and eliminate leaks
  return () => {
    observer.disconnect();
  };
}
```

### Container HTML/CSS Uniform Standard
Replace all conflicting `h-60 sm:h-[460px] min-h-[320px]` classes with aspect-ratio containers that maintain responsiveness across 320px to 430px mobile screens:

```html
<!-- Standard Responsive Canvas Container (Zero CLS, Mobile 320px Safe) -->
<div class="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[260px] max-h-[520px] rounded-xl border border-border-hairline overflow-hidden bg-[#08080a]">
  <canvas class="w-full h-full block select-none touch-none"></canvas>
</div>
```

---
