# Comprehensive Performance & Accessibility Audit Report
**Target System:** Monitor Test Hub (`/Users/divyyadav/newws/monitor_test_hub`)  
**Auditors:** Performance Engineer & Accessibility Specialist  
**Date:** July 21, 2026  

---

## Executive Summary

Monitor Test Hub is a high-precision, client-side web utility for evaluating display calibration, refresh rates, sub-pixel structures, and touch screen digitizers. Built with Astro 7, Tailwind CSS v4, and WebGL2 / 2D Canvas rendering pipelines, the codebase demonstrates strong engineering foundations.

However, this deep read-only audit revealed critical performance bottlenecks and severe accessibility (WCAG 2.1 AA) compliance gaps that degrade Core Web Vitals, cause 60+ FPS frame drops during scrolling/benchmarking, and lock out screen reader and keyboard-only users.

### Key Metrics Overview
| Category | Audit Metric | Current Status | Target Requirement |
| :--- | :--- | :--- | :--- |
| **Performance** | Render-Blocking External Resources | 2 Google Fonts `<link>` stylesheets | 0 Render-blocking external assets |
| **Performance** | Idle Timer Execution | Unconditional `setInterval(30ms)` | 0 Idle timers; VSync `rAF` loop |
| **Performance** | CI Lighthouse Config | Missing `.lighthouserc.js` | Automated LHCI thresholds configured |
| **Accessibility** | Viewport Pinch-to-Zoom | **Disabled** (`user-scalable=no`) | **Enabled** (WCAG 1.4.4 / 1.4.10) |
| **Accessibility** | Interactive Target Sizes | 26px – 36px height | >= 44px x 44px (WCAG 2.5.5) |
| **Accessibility** | Text Contrast Ratio | 4.38:1 in footer / dark stats | >= 4.5:1 for normal text (WCAG 1.4.3) |
| **Accessibility** | Mobile Focus Trapping | Missing Esc/Focus trap | Fully trapped modal/flyout (WCAG 2.4.3) |
| **Accessibility** | Canvas ARIA & Keyboard Parity | Unlabeled canvas; mouse-only games | ARIA roles/labels; 100% keyboard operability |

---

## 1. Core Web Vitals & 60 FPS Scrolling Audit (Performance Engineer)

### Finding PERF-01: Render-Blocking Google Fonts Highway Latency
- **Role Perspective:** [Performance Engineer]
- **File & Location:** `src/layouts/Layout.astro:21-23`
- **Concrete Strengths:** Preconnect links for `fonts.googleapis.com` and `fonts.gstatic.com` are correctly placed at lines 21–22.
- **Concrete Weaknesses:**
  ```html
  23: <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Orbitron:wght@500;700;900&display=swap" rel="stylesheet" />
  ```
  The main font stylesheet is requested synchronously in the `<head>`, making it a critical render-blocking resource.
- **Rationale:** External font stylesheets block First Contentful Paint (FCP) and Largest Contentful Paint (LCP). Network roundtrips to external Google CDNs introduce 200–500ms TTFB latency on mobile connections, causing layout shifts (CLS) when web fonts swap in.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Load font stylesheet asynchronously with preload and onload media swap:
    ```html
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Orbitron:wght@500;700;900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Orbitron:wght@500;700;900&display=swap" /></noscript>
    ```
  - **Option B (Architectural Optimization):** Self-host web fonts locally using `@fontsource/outfit` and `@fontsource/orbitron` npm packages. Bundle WOFF2 font files into static assets served from the origin server (or CDN edge).
- **Trade-offs:**
  - *Option A:* Easy single-file change, but still depends on Google CDN uptime and network connectivity.
  - *Option B:* Adds ~50KB to static build output, but completely eliminates third-party DNS/TLS handshakes, guarantees zero render-blocking font latency, and enables 100% offline PWA capability.

---

### Finding PERF-02: Unconditional `setInterval(30)` Micro-Stutter and Battery Drain
- **Role Perspective:** [Performance Engineer]
- **File & Location:** 
  - `src/components/arcade/TouchMatrixDefusal.astro:86`
  - `src/components/diagnostics/SwipeTracker.astro:87`
- **Concrete Strengths:** 30ms interval allows frequent updates for canvas animations.
- **Concrete Weaknesses:**
  ```typescript
  // TouchMatrixDefusal.astro:86
  setInterval(updateGame, 30);
  
  // SwipeTracker.astro:87
  setInterval(updateTrail, 30);
  ```
  Both components launch unconditional 30ms timers upon initialization that run continuously regardless of active state or tab visibility.
- **Rationale:** 30ms timers (~33.3 Hz) do not synchronize with display refresh rates (60Hz = 16.67ms, 120Hz = 8.33ms, 144Hz = 6.94ms). This phase misalignment causes visual micro-stutter and frame drop during high-refresh-rate benchmarking. Furthermore, un-gated background intervals drain mobile device batteries and cause main thread CPU wakeups even when the browser tab is hidden.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Gate `setInterval` execution by state flags (`isPlaying` / `isSwiping`) and stop intervals when inactive:
    ```typescript
    if (isPlaying) updateGame();
    ```
  - **Option B (Architectural Optimization):** Replace `setInterval` with `requestAnimationFrame` loops driven by `VsyncSyncEngine` and paused via the Page Visibility API (`document.addEventListener('visibilitychange', ...)`).
- **Trade-offs:**
  - *Option A:* Minimal code modification, but timer remains asynchronous and out of step with VSync.
  - *Option B:* Requires lifecycle event listeners, but delivers buttery 60/120/144 FPS rendering aligned with display refresh rate and zero idle CPU usage.

---

### Finding PERF-03: Sticky Header `backdrop-blur-md` GPU Offscreen Compositing Thrashing
- **Role Perspective:** [Performance Engineer]
- **File & Location:** `src/layouts/Layout.astro:56`
- **Concrete Strengths:** Clean frosted glass aesthetic (`bg-diagnostic-gray5/80 backdrop-blur-md`).
- **Concrete Weaknesses:**
  ```html
  56: <header class="border-b border-gray-850 bg-diagnostic-gray5/80 backdrop-blur-md sticky top-0 z-40">
  ```
- **Rationale:** Operating `backdrop-blur-md` on a `sticky` fixed position element forces the GPU graphics driver to perform offscreen composite re-renders on every scroll tick. On mobile devices with high DPR screens (Retina 3x) or integrated mobile GPUs, scrolling through long pages drops frame rate below 60 FPS.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Disable `backdrop-blur-md` on mobile viewports using CSS media queries or Tailwind `md:backdrop-blur-md bg-diagnostic-gray5/95`.
  - **Option B (Architectural Optimization):** Apply CSS containment (`contain: paint layout`) and isolate graphics layer with `will-change: transform` or replace backdrop blur with a solid, high-contrast background for all scrolling pages.
- **Trade-offs:**
  - *Option A:* Preserves desktop glass aesthetic while protecting mobile scroll frame rate.
  - *Option B:* Completely eliminates scroll compositing overhead across all devices.

---

### Finding PERF-04: O(N) Array Reductions & GC Allocation in 60+ FPS VSync Loop
- **Role Perspective:** [Performance Engineer]
- **File & Location:** `src/engine/VsyncSyncEngine.ts:43-50`
- **Concrete Strengths:** Accurately measures sliding window FPS telemetry.
- **Concrete Weaknesses:**
  ```typescript
  43: this.frameTimes.push(delta);
  44: if (this.frameTimes.length > this.maxSamples) {
  45:   this.frameTimes.shift();
  46: }
  ...
  50: const avgDelta = this.frameTimes.reduce((a, b) => a + b, 0) / (this.frameTimes.length || 1);
  ```
- **Rationale:** Executing `Array.prototype.push`, `shift`, and `reduce` inside `requestAnimationFrame` (60 to 240 times per second) generates continuous garbage collection (GC) pressure. GC sweeps cause unpredictable frame drops ("jank") during display refresh benchmarks.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Maintain a running sum variable (`this.runningSum += delta - shiftedValue`) to calculate average in O(1) time without `.reduce()`.
  - **Option B (Architectural Optimization):** Replace JavaScript Array with a fixed-length `Float64Array` ring buffer with a write pointer:
    ```typescript
    private frameBuffer = new Float64Array(60);
    private ptr = 0;
    private sum = 0;
    ```
- **Trade-offs:**
  - *Option A:* Fast fix, eliminates O(N) reduce iteration per frame.
  - *Option B:* Completely eliminates heap allocations and GC sweeps inside animation loops.

---

### Finding PERF-05: Unused Engine Module Imports Swelling Client Bundle
- **Role Perspective:** [Performance Engineer]
- **File & Location:** `src/components/arcade/ColorMatchAlchemist.astro:76`
- **Concrete Strengths:** Modular typescript code structure.
- **Concrete Weaknesses:**
  ```typescript
  76: import { IccExporter } from '../../engine/IccExporter';
  ```
  `IccExporter` is imported into `ColorMatchAlchemist.astro` client script but is never called anywhere in the file.
- **Rationale:** Unused module imports increase bundle size and JavaScript parse/compile time, degrading Interaction to Next Paint (INP).
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Delete line 76 in `ColorMatchAlchemist.astro`.
  - **Option B (Architectural Optimization):** Configure ESLint rule `@typescript-eslint/no-unused-vars` and Vite treeshaking checks in CI.
- **Trade-offs:**
  - *Option A:* Immediate reduction in component JS bundle size.
  - *Option B:* Automates prevention across future development.

---

### Finding PERF-06: Missing CI Lighthouse Configuration File (`.lighthouserc.js`)
- **Role Perspective:** [Performance Engineer]
- **File & Location:** `package.json:24` (Repository Root)
- **Concrete Strengths:** `@lhci/cli: ^0.15.1` is listed in `devDependencies`.
- **Concrete Weaknesses:** No `.lighthouserc.js` configuration file exists in the repository root.
- **Rationale:** Without assertions (LCP < 2.5s, CLS < 0.1, INP < 200ms, Accessibility >= 95), performance regressions can be committed without automated detection.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Add `.lighthouserc.js` in repository root:
    ```javascript
    module.exports = {
      ci: {
        collect: { staticDistDir: './dist' },
        assert: {
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.95 }]
          }
        }
      }
    };
    ```
  - **Option B (Architectural Optimization):** Configure LHCI GitHub Actions workflow with PR status checks and performance budget monitoring.
- **Trade-offs:**
  - *Option A:* Enables `npx lhci autorun` locally.
  - *Option B:* Automates CI build gatekeeping.

---

## 2. Accessibility Audit (Accessibility Specialist - WCAG 2.1 AA)

### Finding A11Y-01: Disabling Viewport Pinch-to-Zoom (WCAG 1.4.4 & 1.4.10 Critical Violation)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:** `src/components/seo/SEOHead.astro:16`
- **Concrete Strengths:** Responsive viewport meta tag present.
- **Concrete Weaknesses:**
  ```html
  16: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  ```
- **Rationale:** Using `user-scalable=no` and `maximum-scale=1.0` explicitly disables browser pinch-to-zoom functionality on mobile devices. This violates WCAG 2.1 AA SC 1.4.4 (Resize Text up to 200%) and SC 1.4.10 (Reflow). Low-vision users are prevented from enlarging text and visual diagnostic controls.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Replace viewport content with standard scalable configuration:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    ```
  - **Option B (Architectural Optimization):** Combine unconstrained scaling with liquid typography (`clamp()` / `rem` relative spacing) to ensure interface layouts scale gracefully up to 200% zoom without horizontal scrolling.
- **Trade-offs:**
  - *Option A:* Instantly restores compliance with WCAG 1.4.4.
  - *Option B:* Guarantees high-density responsive layout stability at high zoom levels.

---

### Finding A11Y-02: Interactive Target Sizes Below 44px Minimum (WCAG 2.5.5 & 2.1 AA Violation)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:**
  - `src/components/seo/MedicalBounceBanner.astro:11` (`py-1.5` link = ~26px high)
  - `src/layouts/Layout.astro:114-118` (Mobile menu links `py-2` = ~36px high)
  - `src/components/diagnostics/OledUniformityEngine.astro:39` (`btn-fullscreen` `py-1.5` = ~28px high)
  - `src/components/diagnostics/OledUniformityEngine.astro:13-30` (Pattern buttons `py-2` = ~32px high)
- **Concrete Strengths:** Visually styled buttons with clear labels.
- **Concrete Weaknesses:** Padding choices (`py-1.5`, `py-2`) produce interactive touch target heights between 26px and 36px.
- **Rationale:** WCAG 2.5.5 Target Size (and WCAG 2.1 AA guidelines) recommends a minimum interactive target size of **44px by 44px**. Undersized touch targets lead to high error rates for users with tremors, motor impairments, or those operating mobile screens.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Update button padding across affected files:
    ```html
    <!-- MedicalBounceBanner.astro -->
    class="... px-4 py-2.5 min-h-[44px] inline-flex items-center"
    ```
  - **Option B (Architectural Optimization):** Define standard component classes in `global.css` or Tailwind theme:
    ```css
    .btn-target {
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    ```
- **Trade-offs:**
  - *Option A:* Quick targeted fix across component files.
  - *Option B:* Systemically guarantees 44px touch target compliance across all present and future UI buttons.

---

### Finding A11Y-03: Sub-Threshold Text Contrast Ratios in Dark Mode & Footer (WCAG 1.4.3 Violation)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:**
  - `src/layouts/Layout.astro:128,133` (`text-gray-500` `#6b7280` on `#000000`/`#0d0d0d` background)
  - `src/components/arcade/ColorMatchAlchemist.astro:15,19,23` (`text-gray-500` `#6b7280` on `#0a0c10`)
  - `src/styles/global.css:20` (`--text-muted: var(--color-diagnostic-gray50)`)
- **Concrete Strengths:** Well-organized dark mode color palette.
- **Concrete Weaknesses:** `#6b7280` text on `#000000` dark background yields a contrast ratio of **4.38:1**, which is strictly below the **4.5:1** minimum required for normal/small text (`text-xs` / 12px).
- **Rationale:** Low-contrast text cannot be read by users with low vision, age-related vision loss, or when viewing screens in bright ambient lighting.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Replace `text-gray-500` with `text-gray-400` (`#9ca3af`, contrast ratio **8.2:1**) in small text containers:
    ```html
    <p class="text-gray-400 leading-relaxed text-xs">
    ```
  - **Option B (Architectural Optimization):** Update CSS semantic variable in `global.css`:
    ```css
    --color-diagnostic-gray50: #94a3b8; /* Slate-400: Contrast ratio 7.4:1 on black */
    ```
- **Trade-offs:**
  - *Option A:* Solves specific contrast failures in footer and telemetry cards.
  - *Option B:* Automatically fixes contrast compliance for all muted text variables across the entire design system.

---

### Finding A11Y-04: Missing Focus Trap & Keyboard Navigation in Mobile Flyout Menu (WCAG 2.4.3 & 2.1.2)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:** `src/layouts/Layout.astro:105-120, 171-180`
- **Concrete Strengths:** Toggles `aria-expanded="true/false"` and `aria-controls="mobile-menu"`.
- **Concrete Weaknesses:**
  ```javascript
  175: btn.addEventListener('click', () => {
  176:   const expanded = btn.getAttribute('aria-expanded') === 'true';
  177:   btn.setAttribute('aria-expanded', String(!expanded));
  178:   menu.classList.toggle('hidden');
  179: });
  ```
  When the mobile menu expands, focus is not shifted into the menu, keyboard focus is not trapped within the menu container, and pressing `Escape` does not close the menu.
- **Rationale:** Tabbing forward past the last link in the expanded mobile menu causes focus to slip out of the menu into hidden background page content. Keyboard and screen reader users become disoriented.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Add an `Escape` keydown listener to close the mobile menu and return focus to `btn`.
  - **Option B (Architectural Optimization):** Implement a full focus trap controller:
    ```javascript
    const trapFocus = (container) => {
      const focusables = container.querySelectorAll('a, button');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      // cycle Tab and Shift+Tab keydown events
    };
    ```
- **Trade-offs:**
  - *Option A:* Minimal code, handles Escape key dismissal.
  - *Option B:* Full WCAG 2.4.3 Focus Order compliance for modal/flyout menus.

---

### Finding A11Y-05: Canvas Diagnostics Lacking ARIA Semantics and Keyboard Operability (WCAG 2.1.1 & 1.1.1)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:**
  - `src/components/arcade/LagReflexSniper.astro:38,88` (Canvas shot detection relies exclusively on `pointerdown`; keyboard users cannot trigger shots)
  - `src/components/arcade/GhostingInvaders.astro:38,86-96` (Canvas has no `role="img"` or `aria-label`; global keydown listener traps spacebar)
  - `src/components/diagnostics/OledUniformityEngine.astro:46-54,102` (Preview `<div>` has `click` listener for fullscreen but no `tabindex="0"`, `role="button"`, or keyboard listener)
- **Concrete Strengths:** Smooth WebGL2 / 2D Canvas rendering pipelines.
- **Concrete Weaknesses:** Canvas elements lack ARIA attributes (`role="img"`, `aria-label="..."`), lack `tabindex="0"`, and cannot be operated via keyboard interface.
- **Rationale:** WCAG 2.1 AA SC 2.1.1 requires all functionality to be operable through a keyboard interface. Screen reader users receive zero context from un-labeled canvas elements.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Add ARIA attributes to canvas tags and keyboard listeners to interactive preview containers:
    ```html
    <canvas id="lrs-canvas" role="img" aria-label="Lag Reflex Sniper target diagnostic board" tabindex="0" class="..."></canvas>
    ```
  - **Option B (Architectural Optimization):** Implement keyboard shortcut handlers (e.g. `Space`/`Enter` to trigger sniper target shots or launch test patterns) and provide live ARIA summary updates.
- **Trade-offs:**
  - *Option A:* Establishes standard DOM accessibility tree nodes for canvas elements.
  - *Option B:* Provides 100% keyboard operability parity for non-pointer users.

---

### Finding A11Y-06: Color Alone Used to Convey Diagnostic Test Status (WCAG 1.4.1 Violation)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:** `src/components/diagnostics/DeadZoneMatrix.astro:10,138,180-190`
- **Concrete Strengths:** Provides clear high-contrast visual matrix feedback.
- **Concrete Weaknesses:**
  ```javascript
  180: if (state === 1) { ctx.fillStyle = 'rgba(0, 255, 136, 0.2)'; } // Green
  185: else if (state === 2) { ctx.fillStyle = 'rgba(255, 51, 102, 0.2)'; } // Red
  ```
  Grid cells convey state (Untested, Verified, Dead Zone) solely through Gray, Green, and Red fill colors.
- **Rationale:** Relying strictly on color to convey diagnostic status violates WCAG 2.1 AA SC 1.4.1 (Use of Color). Colorblind users (deuteranopia / protanopia) cannot distinguish red dead cells from green verified cells.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Render distinct visual symbols inside canvas grid cells in addition to color:
    ```javascript
    if (state === 1) ctx.fillText('✓', x + cellW/2, y + cellH/2);
    else if (state === 2) ctx.fillText('✕', x + cellW/2, y + cellH/2);
    ```
  - **Option B (Architectural Optimization):** Add a high-contrast pattern layer toggle (cross-hatching / symbol overlay) and textual status breakdown under the matrix.
- **Trade-offs:**
  - *Option A:* Simple canvas drawing update with zero visual clutter.
  - *Option B:* Comprehensive accessibility options for various vision profiles.

---

### Finding A11Y-07: Silent Real-Time Telemetry Updates Lacking ARIA Live Announcements (WCAG 4.1.3)
- **Role Perspective:** [Accessibility Specialist]
- **File & Location:**
  - `src/components/arcade/ColorMatchAlchemist.astro:140-148,223-228` (`#cma-status` updates silently)
  - `src/components/diagnostics/DeadZoneMatrix.astro:39,138` (`#dz-status` `aria-live` region exists but JS never populates text)
  - `src/components/arcade/TouchMatrixDefusal.astro:28,190-202` (`#tmd-stability` score updates silently)
- **Concrete Strengths:** Real-time telemetry calculations.
- **Concrete Weaknesses:** Dynamic state transitions and benchmark scores are written to standard DOM text nodes without `aria-live` regions.
- **Rationale:** Assistive technology users rely on status messages (`aria-live="polite"` / `aria-live="assertive"`) to be notified of asynchronous state updates without losing focus.
- **Proposed Solutions:**
  - **Option A (Quick Patch):** Add `aria-live="polite"` to `#cma-status` and update `#dz-status` innerText upon evaluation:
    ```html
    <div id="cma-status" aria-live="polite" class="...">
    ```
  - **Option B (Architectural Optimization):** Create a reusable `announceStatus(message: string, priority = 'polite')` utility method tied to a dedicated hidden global live region.
- **Trade-offs:**
  - *Option A:* Fixes existing elements in place.
  - *Option B:* Clean, scalable architecture for all telemetry components.

---

## 3. Comprehensive Solution & Architecture Roadmap

```
+-----------------------------------------------------------------------------------+
|                           MONITOR TEST HUB ARCHITECTURE                            |
+-----------------------------------------------------------------------------------+
|  PERFORMANCE OPTIMIZATION LAYER                   ACCESSIBILITY (WCAG 2.1 AA)     |
|  - Self-hosted WOFF2 Fonts (@fontsource)           - Scalable Viewport (Zoomable)  |
|  - Ring-Buffer VSync Engine (O(1) Memory)         - Minimum 44px Target Sizes     |
|  - Frame-Gated VSync rAF Loops (No setInterval)   - Contrast Ratio >= 7:1 (Pass)  |
|  - LHCI Assertion Gatekeeping (.lighthouserc.js)  - Focus-Trapped Mobile Flyout   |
|                                                   - Canvas ARIA + Keyboard Controls|
+-----------------------------------------------------------------------------------+
```

---

## 4. Verification Methods

To independently verify the resolutions proposed in this report:

1. **Core Web Vitals & LHCI Verification:**
   - Execute `npm run build` and run Lighthouse CI:
     ```bash
     npx lhci autorun
     ```
   - Confirm Performance Score >= 95, Accessibility Score == 100, LCP < 1.8s, CLS == 0.

2. **60 FPS Scrolling & Frame-Rate Verification:**
   - Open Chrome DevTools -> Performance Tab -> Record page scrolling.
   - Confirm zero frame drops below 60/120 FPS and zero long tasks caused by `backdrop-blur-md` compositing.

3. **Screen Reader & Keyboard Accessibility Verification:**
   - Enable VoiceOver (macOS: `Cmd + F5`) or NVDA.
   - Navigate entire site using ONLY `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Escape`.
   - Confirm mobile menu traps focus, canvas elements read descriptions, status changes are announced, and pinch-to-zoom operates smoothly on iOS Safari / Chrome Mobile.
