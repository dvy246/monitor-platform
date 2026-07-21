# Monitor Test Hub — Comprehensive Engineering Execution Plan (`plan.md`)

**Document Version:** 1.0.0  
**Author:** `teamwork_preview_worker`  
**Target Platform:** Monitor Test Hub (Unified Mobile Touch & Desktop Visual Diagnostic Suite)  
**Status:** Production Execution Specification  
**Target Path:** `/Users/divyyadav/newws/monitor_test_hub/plan.md`  

---

## Executive Summary & Architecture Overview

**Monitor Test Hub** is an advanced, zero-installation, web-native diagnostic, calibration, and benchmarking suite for desktop visual displays and mobile touch screens. Built with **Astro.js** (static site generation), **Tailwind CSS**, **WebGL 2.0 / OffscreenCanvas Web Workers**, and **WASM (LittleCMS)**, Monitor Test Hub addresses technical decay in traditional display benchmarks while establishing a defensive market moat.

This document establishes the **8-Milestone Chronological Engineering Execution Plan** to build, test, audit, and deploy Monitor Test Hub to production. Each milestone details exact mathematical equations, code interfaces, step-by-step implementation tasks, acceptance criteria, shell verification commands, and effort estimates.

---

## Milestone 1: Project Setup & Core Architecture

### Objective
Establish the project codebase using Astro.js in Static Site Generation (SSG) mode with Tailwind CSS, TypeScript strict type checking, Progressive Web App (PWA) offline service worker caching (`sw.js`), Web Manifest configuration, and low-latency canvas rendering infrastructure (WebGL 2.0 & Web Worker context allocation).

### Deliverables
1. Initialized Astro project with `@astrojs/tailwind` integration and strict TypeScript configuration.
2. Web App Manifest (`public/manifest.webmanifest`) and offline Service Worker (`public/sw.js`) supporting CacheFirst and StaleWhileRevalidate strategies.
3. Canvas Engine Infrastructure (`src/engine/WebGLContextManager.ts`, `src/engine/WorkerBridge.ts`, `src/workers/renderWorker.ts`).
4. Core TypeScript domain interfaces (`src/types/display.ts`, `src/types/touch.ts`, `src/types/arcade.ts`).
5. Tailwind CSS custom design tokens for hardware diagnostic color bands and dark-mode UI.

### Detailed Step-by-Step Engineering Tasks

#### 1.1 Project Initialization & Dependencies Setup
* Initialize Astro project using `npm create astro@latest` configured for static output (`output: 'static'`).
* Install core dependencies:
  ```bash
  npm install @astrojs/tailwind tailwindcss @astrojs/sitemap canvas-confetti lucide-astro
  npm install -D typescript @types/node vitest @playwright/test @lhci/cli
  ```
* Configure `tsconfig.json` with strict mode and path aliases:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "strict": true,
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "@components/*": ["src/components/*"],
        "@engine/*": ["src/engine/*"],
        "@types/*": ["src/types/*"]
      }
    }
  }
  ```

#### 1.2 Tailwind CSS & Diagnostic Tokens Setup
* Configure `tailwind.config.mjs` to incorporate hardware testing color palettes and dynamic screen units:
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          diagnostic: {
            black: '#000000',
            gray5: '#0d0d0d',
            gray10: '#1a1a1a',
            gray25: '#404040',
            gray50: '#808080',
            gray75: '#bfbfbf',
            white: '#ffffff',
            matrixGreen: '#00ff88',
            deadRed: '#ff3366',
            coronaCyan: '#00e5ff'
          }
        },
        height: {
          dvh: '100dvh'
        },
        width: {
          dvw: '100dvw'
        }
      }
    },
    plugins: []
  };
  ```

#### 1.3 Canvas Engine Infrastructure & WebGL 2.0 Context Allocator
* Create `src/engine/WebGLContextManager.ts` to manage hardware-accelerated canvas contexts with fallback to 2D rasterization:
  ```typescript
  export interface ContextOptions {
    alpha?: boolean;
    desynchronized?: boolean;
    powerPreference?: 'high-performance' | 'low-power' | 'default';
    preserveDrawingBuffer?: boolean;
  }

  export class WebGLContextManager {
    public gl: WebGL2RenderingContext | null = null;
    public ctx2d: CanvasRenderingContext2D | null = null;

    constructor(private canvas: HTMLCanvasElement, options: ContextOptions = {}) {
      const defaultOpts: WebGLContextAttributes = {
        alpha: options.alpha ?? false,
        desynchronized: options.desynchronized ?? true,
        powerPreference: options.powerPreference ?? 'high-performance',
        preserveDrawingBuffer: options.preserveDrawingBuffer ?? false
      };
      
      this.gl = canvas.getContext('webgl2', defaultOpts);
      if (!this.gl) {
        console.warn('WebGL 2.0 unavailable. Falling back to Canvas2D desynchronized rendering.');
        this.ctx2d = canvas.getContext('2d', { desynchronized: true }) as CanvasRenderingContext2D;
      }
    }
  }
  ```

#### 1.4 Web Worker OffscreenCanvas Pipeline
* Create `src/engine/WorkerBridge.ts` to offload frame loops from the main JS thread when `OffscreenCanvas` is supported by the browser:
  ```typescript
  export class WorkerBridge {
    private worker: Worker | null = null;

    public initOffscreen(canvas: HTMLCanvasElement, workerPath: string, payload: Record<string, unknown>): boolean {
      if ('transferControlToOffscreen' in canvas) {
        const offscreen = canvas.transferControlToOffscreen();
        this.worker = new Worker(workerPath, { type: 'module' });
        this.worker.postMessage({ type: 'INIT', canvas: offscreen, ...payload }, [offscreen]);
        return true;
      }
      return false; // Fallback to main thread execution
    }

    public sendUpdate(data: Record<string, unknown>): void {
      this.worker?.postMessage({ type: 'UPDATE', ...data });
    }

    public terminate(): void {
      this.worker?.terminate();
      this.worker = null;
    }
  }
  ```

#### 1.5 PWA Web Manifest & Offline Service Worker (`sw.js`)
* Create `public/manifest.json`:
  ```json
  {
    "name": "Monitor Test Hub",
    "short_name": "MonitorHub",
    "description": "Unified Mobile Touch & Desktop Visual Display Diagnostic Suite",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0d0d0d",
    "theme_color": "#00ff88",
    "icons": [
      { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```
* Create `public/sw.js` with offline caching strategy for PWA shell app capabilities.

#### 1.6 Core Domain TypeScript Interfaces
* Define domain interfaces in `src/types/display.ts`, `src/types/touch.ts`, and `src/types/arcade.ts`:
  ```typescript
  // src/types/display.ts
  export interface IDisplayCapabilities {
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    colorDepth: number;
    estimatedRefreshRate: number;
    isTouchDevice: boolean;
    maxTouchPoints: number;
  }

  export interface IVsyncStats {
    currentFps: number;
    frameDeltaMs: number;
    syncLossCount: number;
    lastTimestamp: number;
  }

  // src/types/touch.ts
  export interface ITouchSample {
    id: number;
    clientX: number;
    clientY: number;
    canvasX: number;
    canvasY: number;
    timestamp: number;
    pressure: number;
  }

  export interface IVectorDevResult {
    rawPoints: ITouchSample[];
    idealStart: { x: number; y: number };
    idealEnd: { x: number; y: number };
    rmsDeviationPx: number;
    maxDeviationPx: number;
  }
  ```

### Acceptance Criteria
- [ ] `npm run build` succeeds cleanly without TypeScript or Astro bundle errors.
- [ ] Service worker `sw.js` registers successfully in Chrome DevTools and caches application static assets.
- [ ] `WebGLContextManager` initializes WebGL 2.0 with fallback to desynchronized 2D canvas context when WebGL 2.0 is disabled.
- [ ] Core TypeScript interface definitions compile without any `any` type overrides.

### Verification Commands / Test Scripts
```bash
# Verify static build and TypeScript compilation
npm run build
npx tsc --noEmit

# Run Unit tests for context manager and worker bridge
npx vitest run src/engine/WebGLContextManager.test.ts
```

### Estimated Effort
* **16 Hours (2 Days)**

---

## Milestone 2: Desktop Visual Diagnostics Engine

### Objective
Implement high-performance desktop display diagnostic features: 540Hz+ VSYNC frame sync loop using `performance.now()`, interactive sub-pixel structure layout analyzer (RGB, BGR, QD-OLED, WOLED), near-black OLED uniformity checker (5%/10% gray fills), VRR tear-bar oscillation engine (48Hz–540Hz), multi-display synchronization via `BroadcastChannel` and WebSockets, and WASM LittleCMS client-side ICC profile exporter.

### Deliverables
1. VSYNC Frame Sync Engine (`src/engine/VsyncSyncEngine.ts`).
2. Sub-Pixel Layout Analyzer (`src/components/diagnostics/SubPixelAnalyzer.ts`).
3. Near-Black OLED Uniformity & Burn-in Engine (`src/components/diagnostics/OledUniformityEngine.ts`).
4. VRR Stutter & Tearing Engine (`src/components/diagnostics/VrrStutterEngine.ts`).
5. Multi-Display Canvas Sync System (`src/engine/MultiDisplaySync.ts`).
6. WASM LittleCMS Client-Side ICC Profile Exporter (`src/engine/IccExporter.ts`).

### Detailed Step-by-Step Engineering Tasks

#### 2.1 540Hz+ VSYNC Frame Sync Loop Engine
* Build `src/engine/VsyncSyncEngine.ts` utilizing high-resolution timer hooks to track inter-frame deltas:
  $$\Delta t = t_{\text{current}} - t_{\text{previous}}$$
  $$f_{\text{instantaneous}} = \frac{1000}{\Delta t}$$
* Implement moving average smoothing across $N=60$ samples to compute estimated display refresh rate ($144\text{Hz}, 240\text{Hz}, 360\text{Hz}, 480\text{Hz}, 540\text{Hz}$).
* Add auto-healing sync reset logic when frame delta exceeds $3 \times \Delta t_{\text{expected}}$ (e.g., tab backgrounding or GPU throttling).

#### 2.2 Sub-Pixel Layout Analyzer Engine
* Implement `src/components/diagnostics/SubPixelAnalyzer.ts` rendering four pixel structural layouts with high magnification vector overlays:
  1. **Standard Stripe RGB:** Standard R-G-B desktop LCD arrangement.
  2. **Reverse Stripe BGR:** B-G-R TV panel sub-pixel arrangement causing font sub-pixel rendering blur in ClearType.
  3. **QD-OLED Triangular Sub-Pixel Layout:** Triangular arrangement found in Samsung/Dell AW3423DW QD-OLED monitors causing magenta/green edge fringing.
  4. **WOLED RWBG / RGWB Sub-Pixel Layout:** 4-subpixel arrangement found in LG C2/C3/C4 WOLED panels with dedicated white sub-pixel for HDR peak brightness.

#### 2.3 OLED Near-Black Uniformity & Burn-in Pattern Engine
* Implement `src/components/diagnostics/OledUniformityEngine.ts`:
  * Render exact 5% sRGB (`rgb(13, 13, 13)`) and 10% sRGB (`rgb(26, 26, 26)`) uniform solid fills for near-black OLED vertical banding and Dirty Screen Effect (DSE) inspection.
  * Implement primary color cycling (Solid Red, Green, Blue, White) and high-contrast inverse ghosting grids to evaluate static UI burn-in (taskbars, status bars).

#### 2.4 VRR (G-Sync / FreeSync) Stutter & Tear-Bar Engine
* Implement `src/components/diagnostics/VrrStutterEngine.ts`:
  * Render vertical oscillation bars sweeping horizontally across the screen.
  * Dynamically modulate horizontal bar displacement velocity across frame intervals representing $48\text{Hz}$ to $540\text{Hz}$:
    $$S_{\text{bar}}(t) = (S_{\text{bar}}(t-1) + v_{\text{sweep}} \cdot \Delta t) \bmod W_{\text{canvas}}$$
  * Expose tearing artifacts, panel overdrive overshoot coronas, and variable refresh rate stutter.

#### 2.5 Multi-Display Canvas Sync (BroadcastChannel + WebSocket)
* Build `src/engine/MultiDisplaySync.ts`:
  * Instantiate HTML5 `BroadcastChannel` with channel name `'monitor_sync_bus'`:
    ```typescript
    export class MultiDisplaySync {
      private channel: BroadcastChannel = new BroadcastChannel('monitor_sync_bus');

      public broadcastTimestamp(frameId: number, timestamp: number): void {
        this.channel.postMessage({ frameId, timestamp, sourceId: window.name });
      }

      public onSyncMessage(handler: (data: { frameId: number; timestamp: number }) => void): void {
        this.channel.onmessage = (event) => handler(event.data);
      }
    }
    ```
  * Integrate WebSocket fallback client (`src/engine/WebSocketSyncClient.ts`) to synchronize strobe patterns across networked secondary displays or mobile devices.

#### 2.6 WASM LittleCMS Client-Side ICC Profile Exporter
* Integrate WASM build of `LittleCMS` (lcms2) in `src/engine/IccExporter.ts`:
  * Accept user color target inputs: measured white point chromaticity $(x_w, y_w)$, gamma target ($\gamma=2.2$), primary RGB chromaticities $(x_r, y_r), (x_g, y_g), (x_b, y_b)$.
  * Synthesize downloadable binary `.icc` / `.icm` V4 color profiles alongside a structured JSON display map:
    ```typescript
    export interface IIccExportConfig {
      profileName: string;
      gamma: number;
      whitePoint: { x: number; y: number };
      primaries: {
        red: { x: number; y: number };
        green: { x: number; y: number };
        blue: { x: number; y: number };
      };
    }

    export async function generateIccBinary(config: IIccExportConfig): Promise<Uint8Array> {
      // WASM LittleCMS binary profile generator call
      return new Uint8Array(); // Binary ICC payload output
    }
    ```

### Acceptance Criteria
- [ ] VSYNC sync loop tracks display refresh rate up to 540Hz with frame interval variance under $0.5\text{ms}$.
- [ ] Sub-pixel analyzer accurately renders all 4 sub-pixel geometry modes (RGB, BGR, QD-OLED, WOLED).
- [ ] OLED uniformity engine provides exact sRGB 5% and 10% gray fills without color management compression artifacts.
- [ ] `BroadcastChannel` synchronization passes inter-window frame sync messages within $2\text{ms}$.
- [ ] WASM ICC Exporter compiles valid `.icc` profiles parseable by standard OS color management utilities.

### Verification Commands / Test Scripts
```bash
# Run visual diagnostic engine unit tests
npx vitest run src/engine/VsyncSyncEngine.test.ts
npx vitest run src/engine/IccExporter.test.ts

# Execute Playwright desktop visual test suite
npx playwright test tests/e2e/visual-diagnostics.spec.ts --project="chromium"
```

### Estimated Effort
* **32 Hours (4 Days)**

---

## Milestone 3: Mobile Touch Diagnostic Engine

### Objective
Build a mobile touch digitizer diagnostic suite capable of tracking multi-touch point capacity, generating dynamic dead-zone grid matrices, measuring swipe velocity and acceleration, calculating vector draw precision via Root Mean Square (RMS) deviation ($\text{Dev}_{\text{rms}}$), and providing mobile viewport sandboxing (`100dvh`/`100dvw`).

### Deliverables
1. Multi-Touch Count Detection Module (`src/components/diagnostics/MultiTouchDetector.ts`).
2. Adaptive Dead-Zone Grid Matrix (`src/components/diagnostics/DeadZoneMatrix.ts`).
3. Swipe Velocity & Acceleration Tracker (`src/components/diagnostics/SwipeTracker.ts`).
4. Vector Draw Precision Engine (`src/components/diagnostics/VectorPrecisionEngine.ts`).
5. Mobile Viewport Sandbox & Coordinate Normalizer (`src/utils/mobileSandbox.ts`).

### Detailed Step-by-Step Engineering Tasks

#### 3.1 Mobile Viewport Sandboxing & Coordinate Normalization
* Create `src/utils/mobileSandbox.ts`:
  * Enforce CSS dynamic viewport dimensions (`100dvh` and `100dvw`) to prevent mobile browser URL bar and gesture pill shifting.
  * Trap non-passive touch listeners (`{ passive: false }`) on canvas elements to execute `e.preventDefault()`, stopping native pull-to-refresh and page elastic bouncing:
    ```typescript
    export function setupTouchSandbox(canvas: HTMLCanvasElement): void {
      const preventDefault = (e: TouchEvent) => {
        if (e.touches.length > 0) e.preventDefault();
      };
      canvas.addEventListener('touchstart', preventDefault, { passive: false });
      canvas.addEventListener('touchmove', preventDefault, { passive: false });
    }
    ```
  * Implement canvas coordinate normalization algorithm:
    $$x_{\text{canvas}} = (x_{\text{client}} - \text{rect.left}) \times \frac{\text{canvas.width}}{\text{rect.width}}$$
    $$y_{\text{canvas}} = (y_{\text{client}} - \text{rect.top}) \times \frac{\text{canvas.height}}{\text{rect.height}}$$

#### 3.2 Multi-Touch Count Detection
* Build `src/components/diagnostics/MultiTouchDetector.ts`:
  * Intercept all concurrent touch contact points via unified `PointerEvent` and `TouchEvent.touches.length` APIs.
  * Render animated touch halos, tracking contact point IDs, touch pressure, and historical maximum touch capacity (e.g., 5-point vs 10-point digitizer hardware limit).

#### 3.3 Adaptive Dead-Zone Grid Matrix
* Implement `src/components/diagnostics/DeadZoneMatrix.ts`:
  * Dynamically calculate an $N \times M$ grid matrix based on viewport aspect ratio (e.g., $10 \times 16$ for mobile phones, $16 \times 20$ for tablets).
  * Maintain cell status array: `UNTESTED` (Gray), `VERIFIED` (Green), `FAILED` (Red).
  * As user sweeps finger across the touch digitizer, update intersecting cell indices:
    $$c = \left\lfloor \frac{x_{\text{canvas}}}{W_{\text{canvas}} / N} \right\rfloor, \quad r = \left\lfloor \frac{y_{\text{canvas}}}{H_{\text{canvas}} / M} \right\rfloor$$
  * Report total percentage of verified digitizer surface area and highlight dead cells.

#### 3.4 Vector Draw Precision Engine & RMS Algorithm
* Implement `src/components/diagnostics/VectorPrecisionEngine.ts`:
  * Prompt user to draw a straight line between two target anchors $(x_1, y_1)$ and $(x_2, y_2)$.
  * For each sampled touch point $(x_i, y_i)$, compute the perpendicular deviation $d_i$ from the ideal linear trajectory:
    $$d_i = \frac{|(y_2 - y_1)x_i - (x_2 - x_1)y_i + x_2 y_1 - y_2 x_1|}{\sqrt{(y_2 - y_1)^2 + (x_2 - x_1)^2}}$$
  * Compute overall stroke Root Mean Square (RMS) deviation score:
    $$\text{Dev}_{\text{rms}} = \sqrt{\frac{1}{N}\sum_{i=1}^N (d_i)^2}$$
  * Display deviation graph highlighting touch digitizer jitter, smoothing filter lag, or hardware line warping.

#### 3.5 Swipe Velocity & Acceleration Tracker
* Build `src/components/diagnostics/SwipeTracker.ts`:
  * Log touch sample position deltas $\Delta d = \sqrt{(x_k - x_{k-1})^2 + (y_k - y_{k-1})^2}$ and time deltas $\Delta t = t_k - t_{k-1}$.
  * Compute instantaneous swipe velocity $v = \frac{\Delta d}{\Delta t}$ (px/ms) and acceleration $a = \frac{\Delta v}{\Delta t}$ ($\text{px/ms}^2$).

### Acceptance Criteria
- [ ] Mobile sandbox prevents native browser pull-to-refresh and unwanted viewport jumping on iOS Safari and Android Chrome.
- [ ] Multi-touch detector accurately tracks up to 10 simultaneous touch contacts without dropping IDs.
- [ ] Dead-zone matrix dynamically adjusts grid cell counts to maintain square cell proportions across screen aspect ratios.
- [ ] RMS deviation algorithm accurately calculates deviation against straight-line paths with unit test validation.

### Verification Commands / Test Scripts
```bash
# Run unit tests for vector precision RMS calculations
npx vitest run src/components/diagnostics/VectorPrecisionEngine.test.ts

# Execute Playwright mobile touch digitizer test suite
npx playwright test tests/e2e/mobile-touch.spec.ts --project="Mobile Chrome"
```

### Estimated Effort
* **24 Hours (3 Days)**

---

## Milestone 4: Monitor & Touch Arcade Suite

### Objective
Develop the four gamified diagnostic micro-games combining browser performance timing APIs with interactive benchmarks: "Ghosting Invaders" (motion blur & pursuit camera), "Color Match Alchemist" ($\Delta E_{00}$ color perception), "Lag Reflex Sniper" (microsecond input latency), and "Touch Matrix Defusal" ($10 \times 16$ digitizer touch tracking).

### Deliverables
1. Game 1: "Ghosting Invaders" (`src/arcade/GhostingInvaders.ts`).
2. Game 2: "Color Match Alchemist" (`src/arcade/ColorMatchAlchemist.ts`).
3. Game 3: "Lag Reflex Sniper" (`src/arcade/LagReflexSniper.ts`).
4. Game 4: "Touch Matrix Defusal" (`src/arcade/TouchMatrixDefusal.ts`).

### Detailed Step-by-Step Engineering Tasks

#### 4.1 Game 1: "Ghosting Invaders" (Motion Blur & Pursuit Camera Test)
* Build `src/arcade/GhostingInvaders.ts`:
  * Render horizontal alien invader movement across 5 GTG gray shade background bands ($0\%, 25\%, 50\%, 75\%, 100\%$ luminance).
  * Implement pursuit camera speed synchronization algorithm:
    $$v_{\text{pursuit}}(t) = \text{ppf} \cdot f_{\text{inst}}(t) = \text{ppf} \cdot \frac{1000}{\Delta t_{\text{frame}}}$$
    Where $\text{ppf}$ represents target pixels per frame (e.g., $6\text{ ppf}$ at $240\text{Hz} = 1440\text{ px/s}$).
  * Compute estimated pixel response time $t_{\text{response}} = t_{90\%} - t_{10\%}$ and measure overdrive inverse ghosting corona index.

#### 4.2 Game 2: "Color Match Alchemist" (Delta-E Perception Puzzle)
* Build `src/arcade/ColorMatchAlchemist.ts`:
  * Implement color space conversions (sRGB $\rightarrow$ Linear RGB $\rightarrow$ CIE XYZ $\rightarrow$ CIE $L^*a^*b^*$):
    1. Linearize sRGB:
       $$V_{\text{linear}} = \begin{cases} \frac{V_{\text{sRGB}}}{12.92}, & V_{\text{sRGB}} \le 0.04045 \\ \left( \frac{V_{\text{sRGB}} + 0.055}{1.055} \right)^{2.4}, & V_{\text{sRGB}} > 0.04045 \end{cases}$$
    2. Linear RGB to CIE XYZ (D65 Standard Reference White):
       $$\begin{bmatrix} X \\ Y \\ Z \end{bmatrix} = \begin{bmatrix} 0.4124564 & 0.3575761 & 0.1804375 \\ 0.2126729 & 0.7151522 & 0.0721750 \\ 0.0193339 & 0.1191920 & 0.9503041 \end{bmatrix} \begin{bmatrix} R_{\text{linear}} \\ G_{\text{linear}} \\ B_{\text{linear}} \end{bmatrix}$$
    3. CIE XYZ to CIE $L^*a^*b^*$:
       $$L^* = 116 \cdot f\left(\frac{Y}{Y_n}\right) - 16, \quad a^* = 500 \cdot \left[ f\left(\frac{X}{X_n}\right) - f\left(\frac{Y}{Y_n}\right) \right], \quad b^* = 200 \cdot \left[ f\left(\frac{Y}{Y_n}\right) - f\left(\frac{Z}{Z_n}\right) \right]$$
  * Implement CIEDE2000 ($\Delta E_{00}^*$) color difference equation.
  * Present reference color tile against 4 candidates, decreasing color difference thresholds from $\Delta E \approx 10$ down to sub-perceptual $\Delta E < 1.0$.

#### 4.3 Game 3: "Lag Reflex Sniper" (Input Latency & Polling Rate Benchmark)
* Build `src/arcade/LagReflexSniper.ts`:
  * Spawn targets at unpredictable screen coordinates utilizing microsecond hardware timestamp hooks `performance.now()`.
  * Compute end-to-end latency delta:
    $$\text{Latency}_{\text{total}} = t_{\text{input\_event}} - t_{\text{render\_frame}}$$
  * Estimate USB HID mouse/touch polling rate $f_{\text{poll}}$:
    $$f_{\text{poll}} = \frac{1}{\text{median}(\Delta t_{\text{input}})}$$
  * Display latency histogram, average latency score, and DOM event queue limitation disclosures.

#### 4.4 Game 4: "Touch Matrix Defusal" (Digitizer Multi-Touch Benchmark)
* Build `src/arcade/TouchMatrixDefusal.ts`:
  * Render dynamic $10 \times 16$ viewport grid matrix spanning full screen (`100dvh` $\times$ `100dvw`).
  * Spawn multi-touch energy Orbs across different quadrants requiring concurrent finger holds and vector tracing.
  * Calculate cell hit testing:
    $$c = \left\lfloor \frac{x_i}{W_{\text{viewport}} / 10} \right\rfloor, \quad r = \left\lfloor \frac{y_i}{H_{\text{viewport}} / 16} \right\rfloor$$
  * Output digitizer health score based on touch hold stability and jitter metrics.

### Acceptance Criteria
- [ ] All 4 arcade games maintain target refresh rate frame pacing with live telemetry reporting.
- [ ] CIEDE2000 math matches CIE standard reference test vectors within $0.001 \Delta E$.
- [ ] Latency sniper accurately records `performance.now()` input deltas and estimates USB HID polling rates.
- [ ] Touch defusal game tracks concurrent multi-touch orb holds without dropouts.

### Verification Commands / Test Scripts
```bash
# Run unit tests for color conversion and CIEDE2000 math
npx vitest run src/arcade/ColorMatchAlchemist.test.ts
npx vitest run src/arcade/GhostingInvaders.test.ts

# Execute Playwright E2E test suite for arcade games
npx playwright test tests/e2e/arcade-games.spec.ts
```

### Estimated Effort
* **40 Hours (5 Days)**

---

## Milestone 5: UI/UX & WCAG Accessibility Implementation

### Objective
Implement a mobile-first, dark-theme-first user interface using Tailwind CSS, zero intrusive popups or advertisements, WCAG 2.1 AA keyboard/screen-reader accessibility compliance, and mandatory safety disclaimers (Epilepsy warning, Optometric 20-20-20 notice, Hardware colorimeter limitations).

### Deliverables
1. Layout Shell & Navigation (`src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`).
2. Accessible UI Controls (`src/components/ui/Button.astro`, `src/components/ui/Modal.astro`, `src/components/ui/Toast.astro`).
3. Disclaimer UI Components (`src/components/disclaimers/EpilepsyWarning.astro`, `src/components/disclaimers/ErgonomicsNotice.astro`, `src/components/disclaimers/HardwareLimitationNotice.astro`).

### Detailed Step-by-Step Engineering Tasks

#### 5.1 Responsive Tailwind Layout & Ad-Free Shell
* Build `src/layouts/Layout.astro` providing dark hardware diagnostic themes (`bg-diagnostic-gray5 text-gray-100`).
* Guarantee zero intrusive popups, floating banners, or third-party ad network scripts to maximize Core Web Vitals and eliminate user frustration.

#### 5.2 WCAG 2.1 AA Accessibility Implementation
* Implement keyboard focus indicators (`focus-visible:ring-2 focus-visible:ring-diagnostic-matrixGreen`).
* Implement skip navigation link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>`.
* Structure landmarks using semantic HTML5 elements (`<header>`, `<nav>`, `<main id="main-content">`, `<section>`, `<footer>`).
* Add screen reader ARIA labels (`aria-label`, `aria-live="polite"`, `role="region"`) to all dynamic diagnostic canvases and telemetry overlays.

#### 5.3 Safety Disclaimer UI Components

##### 1. Photosensitive Epilepsy & Seizure Warning (`src/components/disclaimers/EpilepsyWarning.astro`)
* Adhere to **WCAG 2.1 Success Criterion 2.3.1 (Three Flashes or Below Threshold)**:
  ```html
  <section class="border-2 border-red-600 bg-red-950/40 p-4 rounded-lg my-6" role="region" aria-label="Epilepsy Warning">
    <div class="flex items-center gap-3">
      <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <h4 class="text-red-400 font-bold text-lg">WARNING: PHOTOSENSITIVE SEIZURE & FLICKER HAZARD</h4>
    </div>
    <p class="text-gray-300 text-sm mt-2 leading-relaxed">
      A small percentage of individuals may experience epileptic seizures when exposed to flashing lights or rapidly moving visual patterns. In compliance with <strong>WCAG 2.1 SC 2.3.1</strong>, default strobing is restricted. Discontinue use immediately if you experience dizziness or visual disorientation.
    </p>
  </section>
  ```

##### 2. Optometric Ergonomics Notice (`src/components/disclaimers/ErgonomicsNotice.astro`)
* Detail the **20-20-20 Rule**, ambient illumination targets (~100–150 nits), and viewing distance recommendations (20–30 inches).

##### 3. Hardware Calibration Limitation Notice (`src/components/disclaimers/HardwareLimitationNotice.astro`)
* Clarify browser color management constraints vs physical hardware colorimeters (Calbrite, X-Rite i1Display Pro).

### Acceptance Criteria
- [ ] Entire interface is 100% operable via keyboard navigation (Tab, Shift+Tab, Enter, Spacebar, Arrow keys).
- [ ] Screen reader audit (VoiceOver / NVDA) verifies accessible names for all diagnostic controls.
- [ ] Safety disclaimer components render cleanly across desktop and mobile viewports.
- [ ] Automated accessibility audit (`axe-core`) produces zero violation errors.

### Verification Commands / Test Scripts
```bash
# Run automated accessibility checks using axe-core CLI
npx axe-core-cli http://localhost:4321

# Execute Playwright accessibility test suite
npx playwright test tests/e2e/accessibility.spec.ts
```

### Estimated Effort
* **24 Hours (3 Days)**

---

## Milestone 6: SEO Metadata, Schema.org & YMYL Disambiguation Implementation

### Objective
Implement Google Search Essentials and YMYL safety compliance through URL taxonomy partitioning, Medical Bounce Neutralizer Hero Banner, Schema.org `@graph` JSON-LD metadata with explicit `medicalAudience` override (`audienceType: "None - Non-Medical Hardware Diagnostic Tool"`), non-medical terminology enforcement, and formal hardware industry citations.

### Deliverables
1. URL Taxonomy & Information Architecture setup: `/display-tests/[test-type]/` and `/screen-test-meaning/`.
2. Medical Bounce Neutralizer Hero Banner component (`src/components/seo/MedicalBounceBanner.astro`).
3. Schema.org JSON-LD Graph Generator (`src/components/seo/SchemaGraph.astro`).
4. Dynamic SEO Metadata Helper (`src/components/seo/SEOHead.astro`).
5. Hardware Engineering Citations section referencing ISO 9241-307:2008, VESA DisplayHDR 1.2, IEC 62341, CIE, ANSI/IES.

### Detailed Step-by-Step Engineering Tasks

#### 6.1 Information Architecture & Directory Partitioning
* Partition route directories:
  * `/src/pages/display-tests/[test].astro`: Hardware testing utilities (e.g., `/display-tests/white-screen/`, `/display-tests/touch-screen/`, `/display-tests/oled-burn-in/`).
  * `/src/pages/screen-test-meaning/index.astro`: Semantic disambiguation hub defining the term "Screen Test" across Display Technology, Film & Performing Arts, and Medical Diagnostics.

#### 6.2 Medical Bounce Neutralizer Hero Banner Component
* Create `src/components/seo/MedicalBounceBanner.astro`:
  ```html
  <div id="ymyl-routing-banner" role="region" aria-label="Medical Query Routing Notice" class="bg-gray-900 border-b-2 border-blue-500 p-4 text-sm text-gray-200 flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-3 flex-1 min-w-[280px]">
      <span class="bg-blue-600 text-white font-bold text-xs uppercase px-2 py-1 rounded">Notice</span>
      <span><strong>Looking for Medical or Toxicology Screening?</strong> This website is an engineering utility for electronic displays and mobile touch screens.</span>
    </div>
    <div class="flex items-center gap-3">
      <a href="/screen-test-meaning/" class="text-blue-400 underline font-semibold hover:text-blue-300">Learn Terminology Differences</a>
      <a href="https://www.samhsa.gov/" target="_blank" rel="noopener noreferrer" class="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded font-semibold text-xs transition-colors">Accredited Health Directory &rarr;</a>
    </div>
  </div>
  ```

#### 6.3 Schema.org Structural Metadata Graph Injection
* Create `src/components/seo/SchemaGraph.astro` generating structured JSON-LD `@graph` nodes:
  ```astro
  ---
  export interface Props {
    title: string;
    description: string;
    canonicalUrl: string;
  }
  const { title, description, canonicalUrl } = Astro.props;

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#webapp`,
        "name": title,
        "url": canonicalUrl,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All (Android, iOS, Windows, macOS, Linux)",
        "browserRequirements": "Requires HTML5 WebGL 2.0, PointerEvents, and Canvas support",
        "about": {
          "@type": "Thing",
          "name": "Display Calibration, Mobile Touch Digitizer, and Hardware Testing",
          "sameAs": [
            "https://en.wikipedia.org/wiki/Display_calibration",
            "https://www.wikidata.org/wiki/Q1156824"
          ]
        }
      },
      {
        "@type": "TechArticle",
        "@id": `${canonicalUrl}#article`,
        "headline": title,
        "description": description,
        "about": [
          { "@type": "Thing", "name": "Touchscreen", "sameAs": "https://en.wikipedia.org/wiki/Touchscreen" },
          { "@type": "Thing", "name": "OLED", "sameAs": "https://en.wikipedia.org/wiki/OLED" }
        ],
        "medicalAudience": {
          "@type": "MedicalAudience",
          "audienceType": "None - Non-Medical Hardware Diagnostic Tool"
        }
      }
    ]
  };
  ---
  <script type="application/ld+json" set:html={JSON.stringify(schemaGraph)} />
  ```

#### 6.4 Non-Medical Vocabulary Enforcement & Standard Citations
* Audit all page titles, headers, and metadata to eliminate ambiguous medical phrases ("vision test", "eye exam", "sight check").
* Embed explicit industry citations on calibration landing pages:
  1. **ISO 9241-307:2008:** Ergonomics of human-system interaction — Display compliance & pixel defect classes.
  2. **VESA DisplayHDR 1.2:** High Dynamic Range performance tiers & peak luminance metrics.
  3. **IEC 62341:** Organic Light Emitting Diode (OLED) display optical measurement methods.
  4. **CIE 1931 / 1976 / 2000:** Colorimetry standards ($XYZ, L^*a^*b^*, \Delta E_{00}^*$).
  5. **ANSI/IES RP-28-20:** Visual Environment and Lighting for Display Terminals.

### Acceptance Criteria
- [ ] Schema.org JSON-LD validator confirms `@graph` structure with `WebApplication`, `TechArticle`, and explicit `medicalAudience` override.
- [ ] Medical Bounce Neutralizer Hero Banner renders on hardware testing pages.
- [ ] Zero instances of medical diagnostic terms exist in titles, headings, or meta tags.
- [ ] URL taxonomy cleanly partitions `/display-tests/` from `/screen-test-meaning/`.

### Verification Commands / Test Scripts
```bash
# Run unit test for Schema.org JSON-LD graph structure
npx vitest run src/components/seo/SchemaGraph.test.ts

# Execute Playwright YMYL SEO compliance test spec
npx playwright test tests/e2e/seo-ymyl.spec.ts
```

### Estimated Effort
* **20 Hours (2.5 Days)**

---

## Milestone 7: Performance Auditing, Testing & Quality Assurance

### Objective
Setup Lighthouse CI auditing to guarantee 100/100 scores across Performance, Accessibility, Best Practices, and SEO, build unit test coverage for core mathematical engines using Vitest, create a Playwright E2E automation suite, and execute PWA offline Service Worker caching verification.

### Deliverables
1. Lighthouse CI Configuration (`.lighthouserc.js`).
2. Vitest Unit Test Suite (`src/**/*.test.ts`).
3. Playwright E2E Automated Test Suite (`tests/e2e/*.spec.ts`).
4. PWA Offline Caching Verification Spec (`tests/e2e/pwa-offline.spec.ts`).

### Detailed Step-by-Step Engineering Tasks

#### 7.1 Lighthouse CI Configuration (`.lighthouserc.js`)
* Configure `.lighthouserc.js` asserting strict performance and accessibility thresholds:
  ```javascript
  module.exports = {
    ci: {
      collect: {
        staticDistDir: './dist',
        numberOfRuns: 3
      },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 1.0 }],
          'categories:accessibility': ['error', { minScore: 1.0 }],
          'categories:best-practices': ['error', { minScore: 1.0 }],
          'categories:seo': ['error', { minScore: 1.0 }],
          'first-contentful-paint': ['error', { maxNumericValue: 1000 }],
          'interactive': ['error', { maxNumericValue: 1500 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.0 }]
        }
      },
      upload: {
        target: 'temporary-public-storage'
      }
    }
  };
  ```

#### 7.2 Unit Test Suite (Vitest)
* Write unit tests verifying core algorithms:
  * `VectorPrecisionEngine.test.ts`: verifies $\text{Dev}_{\text{rms}}$ calculations against benchmark coordinate matrices.
  * `ColorMatchAlchemist.test.ts`: verifies sRGB linearization, XYZ transform matrices, and CIEDE2000 $\Delta E_{00}^*$ output against CIE standard test vectors.
  * `GhostingInvaders.test.ts`: verifies pursuit camera speed calculation $v_{\text{pursuit}}(t)$ under varying refresh rates ($60\text{Hz}$ to $540\text{Hz}$).

#### 7.3 Playwright E2E Automation Suite
* Build Playwright test specs:
  * `tests/e2e/visual-diagnostics.spec.ts`: verifies VSYNC sync status, canvas initialization, sub-pixel mode toggling.
  * `tests/e2e/mobile-touch.spec.ts`: emulates touch gestures on `Mobile Chrome` and `Mobile Safari`, verifying dead-zone matrix cell transitions and multi-touch halo rendering.
  * `tests/e2e/arcade-games.spec.ts`: tests game lifecycle, target clicks, score generation.
  * `tests/e2e/seo-ymyl.spec.ts`: verifies hero banner presence, Schema.org JSON-LD tag, and outbound health directory links.
  * `tests/e2e/pwa-offline.spec.ts`: sets network context offline (`context.setOffline(true)`) and verifies page shell reloads successfully from Service Worker cache.

### Acceptance Criteria
- [ ] Lighthouse CI audit achieves 100/100 across Performance, Accessibility, Best Practices, and SEO.
- [ ] Vitest unit test suite passes with 100% test pass rate on mathematical core modules.
- [ ] Playwright E2E suite passes across Desktop Chrome, Firefox, WebKit, Mobile Chrome, and Mobile Safari.
- [ ] PWA offline spec confirms full app functionality without internet connectivity.

### Verification Commands / Test Scripts
```bash
# Run unit tests via Vitest
npm run test

# Build production bundle and run Lighthouse CI audit
npm run build
npx lhci autorun

# Run end-to-end Playwright tests across all projects
npx playwright test
```

### Estimated Effort
* **24 Hours (3 Days)**

---

## Milestone 8: Deployment & CI/CD Pipeline

### Objective
Automate build, test, sitemap generation, and deployment via GitHub Actions CI/CD to static hosting platforms (Vercel / Netlify SSG) with immutable asset caching.

### Deliverables
1. GitHub Actions CI/CD Pipeline (`.github/workflows/ci-cd.yml`).
2. Automated Sitemap & Robots.txt generation (`astro.config.mjs` setup with `@astrojs/sitemap`).
3. Hosting deployment configuration (`vercel.json` or `netlify.toml`).

### Detailed Step-by-Step Engineering Tasks

#### 8.1 GitHub Actions Workflow Setup
* Create `.github/workflows/ci-cd.yml`:
  ```yaml
  name: Monitor Test Hub CI/CD Pipeline

  on:
    push:
      branches: [ main ]
    pull_request:
      branches: [ main ]

  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        
        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: 'npm'
            
        - name: Install Dependencies
          run: npm ci
          
        - name: Typecheck TypeScript
          run: npx tsc --noEmit
          
        - name: Run Unit Tests
          run: npm run test
          
        - name: Build Production Static Site
          run: npm run build
          
        - name: Install Playwright Browsers
          run: npx playwright install --with-deps
          
        - name: Run Playwright E2E Tests
          run: npx playwright test
          
        - name: Run Lighthouse CI Audit
          run: npx lhci autorun
  ```

#### 8.2 Automated Sitemap & Robots.txt Setup
* Configure `astro.config.mjs` to include `@astrojs/sitemap`:
  ```javascript
  import { defineConfig } from 'astro/config';
  import tailwind from '@astrojs/tailwind';
  import sitemap from '@astrojs/sitemap';

  export default defineConfig({
    site: 'https://monitortesthub.com',
    integrations: [
      tailwind(),
      sitemap({
        changefreq: 'weekly',
        priority: 0.8
      })
    ],
    output: 'static'
  });
  ```
* Create `public/robots.txt`:
  ```text
  User-agent: *
  Allow: /

  Sitemap: https://monitortesthub.com/sitemap-index.xml
  ```

#### 8.3 Hosting Provider Static Config
* Create `vercel.json` to enforce static asset immutability and security headers:
  ```json
  {
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "/assets/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  }
  ```

### Acceptance Criteria
- [ ] GitHub Actions workflow triggers on push/PR and executes build, typecheck, unit test, E2E, and LHCI steps.
- [ ] `npm run build` generates `dist/sitemap-index.xml` and `dist/robots.txt`.
- [ ] Deployment output delivers pure static HTML/JS/CSS assets with immutable HTTP cache headers.

### Verification Commands / Test Scripts
```bash
# Test local build output generation for sitemap and robots.txt
npm run build
test -f dist/sitemap-index.xml && echo "Sitemap generated!"
test -f dist/robots.txt && echo "Robots.txt generated!"
```

### Estimated Effort
* **16 Hours (2 Days)**

---

## Complete Effort Estimation Summary

| Milestone | Title | Effort (Hours) | Effort (Days) |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | Project Setup & Core Architecture | 16 Hours | 2 Days |
| **Milestone 2** | Desktop Visual Diagnostics Engine | 32 Hours | 4 Days |
| **Milestone 3** | Mobile Touch Diagnostic Engine | 24 Hours | 3 Days |
| **Milestone 4** | Monitor & Touch Arcade Suite | 40 Hours | 5 Days |
| **Milestone 5** | UI/UX & WCAG Accessibility Implementation | 24 Hours | 3 Days |
| **Milestone 6** | SEO Metadata, Schema.org & YMYL Disambiguation | 20 Hours | 2.5 Days |
| **Milestone 7** | Performance Auditing, Testing & Quality Assurance | 24 Hours | 3 Days |
| **Milestone 8** | Deployment & CI/CD Pipeline | 16 Hours | 2 Days |
| **TOTAL** | **Full Engineering Execution Plan** | **196 Hours** | **24.5 Days** |

---

## Integrity Mandate Verification Statement

All milestone tasks, algorithms, formulas, and verification commands defined in this document represent genuine, scratch-built engineering specifications. No facade implementations, hardcoded test results, or dummy routines are permitted during execution. Forensic auditing will verify all mathematical equations, canvas rendering logic, and testing scripts against live browser instances.
