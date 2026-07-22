# Pre-Deployment Audit Report — Agent 2: Functional, UI/UX, Mobile & Accessibility Audit

**Audit Target**: `monitor_test_hub` (Astro v7 + Tailwind CSS v4 + TypeScript)  
**Audit Date**: 2026-07-22  
**Audit Mode**: READ-ONLY Pre-Deployment Audit  
**Auditor Identity**: AGENT 2 — Functional, Interactive UI/UX, Mobile & Accessibility Auditor  
**Workspace Path**: `/Users/divyyadav/newws/.agents/auditor_m2`  

---

## Executive Summary

A comprehensive, read-only pre-deployment audit was conducted across all interactive diagnostic instruments, canvas components, calculation engines (`src/engine/`), UI controls, modal overlays, event listeners, WCAG 2.2 AA accessibility features, and mobile viewport layouts in `monitor_test_hub`.

### Key Metrics & Findings Summary
- **Total Test Suites & Type Check**: 51 Vitest test suites (286 test cases) passing; `tsc --noEmit` 0 errors.
- **Identified Issues Summary**:
  - **P0 Blocker**: 0
  - **P1 Critical**: 3 issues (Broken runtime engine call on `/monitor-color-calibration`, missing Epilepsy Warnings on high-flicker tools, indiscriminate global keyboard event trap in keyboard diagnostic tools).
  - **P2 High**: 4 issues (Global hotkey 'F' intercepting `<select>` dropdowns, uncleaned `requestAnimationFrame` loops on unfocused/background tabs, modal focus management & focus trapping missing, duplicate nested `<main id="main-content">` HTML structure).
  - **P3 Medium**: 3 issues (Dead/unintegrated `MultiDisplaySync` BroadcastChannel engine, form controls missing `aria-label`/`<label>` and focus rings, mobile `100vh` viewport address bar clipping in embed views & FAB `aria-expanded`).
  - **P4 Low**: 3 issues (Suboptimal upgrade recommendations in `PcBottleneckEngine`, dynamic timestamp altering SHA-256 passport hash per render, decorative inline SVGs lacking `aria-hidden="true"`).

---

## Detailed Classification of Identified Issues

### P1 — Critical Severity Issues

#### Issue 1.1: Runtime Exception on ICC Profile Export Button (`TypeError`)
- **Severity**: P1 Critical (Functional Breakage)
- **Location**: `/Users/divyyadav/newws/monitor_test_hub/src/pages/monitor-color-calibration.astro:153`
- **Evidence**:
  ```typescript
  // src/pages/monitor-color-calibration.astro
  const bytes = IccExporter.generateSrgbProfileBinary();
  ```
  `IccExporter` in `src/engine/IccExporter.ts` exports `generateIccProfile(config: IIccExportConfig)` and `chromaticityToXYZ()`. Method `generateSrgbProfileBinary()` does **NOT** exist on `IccExporter`.
- **Why it matters**: When users click the "Export ICC v4.3 Profile (.icc)" button, the browser throws an uncaught JavaScript runtime exception: `TypeError: IccExporter.generateSrgbProfileBinary is not a function`.
- **Impact**: Feature is completely broken for end users trying to export display calibration ICC profiles.
- **Likelihood**: High (100% reproducible on user click).
- **Suggested Remediation**: Implement `generateSrgbProfileBinary()` in `IccExporter.ts` or update `monitor-color-calibration.astro` to call `IccExporter.generateIccProfile({...})` with sRGB primaries and whitepoint specs.

#### Issue 1.2: Missing `EpilepsyWarning` Components on High-Flicker Diagnostic Tools
- **Severity**: P1 Critical (Health & Safety / Project Guideline Violation)
- **Location**: 
  - `src/pages/display-tests/stuck-pixel.astro`
  - `src/pages/display-tests/pwm-flicker.astro`
  - `src/pages/display-tests/pixel-walk.astro`
  - `src/pages/display-tests/frame-skipping.astro`
- **Evidence**:
  - `stuck-pixel.astro` (`StuckPixel.astro`) rapidly cycles full-screen solid RGB primary colors at display refresh rates (60Hz/120Hz/240Hz+).
  - `pwm-flicker.astro`, `pixel-walk.astro`, and `frame-skipping.astro` render high-frequency visual strobe/flicker patterns.
  - None of these four pages import or render `<EpilepsyWarning />`.
- **Why it matters**: Rapid full-screen flashing above 3Hz triggers photosensitive epileptic seizures. Project Guideline #3 explicitly mandates `EpilepsyWarning.astro` on all fast-flashing visual tests, as required by WCAG 2.2 AA SC 2.3.1 (Three Flashes or Below Threshold).
- **Impact**: Seizure risk for photosensitive users and violation of project safety standards.
- **Likelihood**: High.
- **Suggested Remediation**: Import and place `<EpilepsyWarning />` at the top of diagnostic controls on `stuck-pixel.astro`, `pwm-flicker.astro`, `pixel-walk.astro`, and `frame-skipping.astro`.

#### Issue 1.3: Indiscriminate Global `e.preventDefault()` Keyboard Trapping
- **Severity**: P1 Critical (WCAG 2.2 AA SC 2.1.2 Keyboard Trap)
- **Location**:
  - `src/components/diagnostics/KeyboardTesterCanvas.astro:330-353`
  - `src/components/diagnostics/KeyboardRollover.astro:87-97`
- **Evidence**:
  ```typescript
  // src/components/diagnostics/KeyboardTesterCanvas.astro
  window.addEventListener('keydown', (e) => {
    e.preventDefault();
    ...
  });
  ```
- **Why it matters**: `e.preventDefault()` is executed unconditionally on `window` for every single key event. This traps user focus and blocks browser navigation shortcuts: `F5` (Refresh), `F12` (DevTools), `Cmd+R` / `Ctrl+R`, `Tab` (focus movement), `Cmd+L` (Address bar focus), `Escape`, and `Alt+Tab`.
- **Impact**: Users cannot navigate away from or interact with browser controls using the keyboard while viewing these tool pages.
- **Likelihood**: High.
- **Suggested Remediation**: Scope key interception to when the tester canvas container is focused (`document.activeElement === canvas`), or explicitly exclude system/navigation keys (`Tab`, `F5`, `F12`, `Cmd/Ctrl` modifier combos) from `e.preventDefault()`.

---

### P2 — High Severity Issues

#### Issue 2.1: Global Hotkey 'F' Intercepting `<select>` Dropdown Keyboard Navigation
- **Severity**: P2 High (UI/UX & Keyboard Accessibility Bug)
- **Location**:
  - `src/layouts/Layout.astro:864-869`
  - `src/components/diagnostics/WhiteScreenCanvas.astro:265-269`
  - `src/components/diagnostics/BacklightBleed.astro:79-81`
- **Evidence**:
  ```typescript
  // src/layouts/Layout.astro
  const activeEl = document.activeElement;
  const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable);
  if (!isInput && (e.key === 'f' || e.key === 'F')) {
    e.preventDefault();
    (window as any).toggleGlobalFullscreen();
  }
  ```
  `WhiteScreenCanvas.astro` and `BacklightBleed.astro` do not check `activeEl` at all.
- **Why it matters**: `<select>` dropdowns are standard HTML form elements. When focused on a `<select>` (such as resolution, GPU vendor, or target color) and pressing 'F' to jump to an option starting with 'F' (e.g. "Full", "FHD", "FreeSync"), `isInput` returns `false` because `activeEl.tagName === 'SELECT'`. The key event is intercepted, `e.preventDefault()` is called, and full-screen mode is unexpectedly triggered.
- **Impact**: Broken form navigation when interacting with `<select>` dropdown elements.
- **Likelihood**: High.
- **Suggested Remediation**: Add `activeEl.tagName === 'SELECT'` to `isInput` checks in `Layout.astro` and add input focus guards to `WhiteScreenCanvas.astro` and `BacklightBleed.astro`.

#### Issue 2.2: Uncleaned `requestAnimationFrame` Loops on Background/Unfocused Tabs
- **Severity**: P2 High (Performance & Battery Drain Memory Leak)
- **Location**:
  - `src/components/diagnostics/FrameSkipping.astro:98-100`
  - `src/components/diagnostics/MotionBlur.astro:90-92`
  - `src/components/diagnostics/VrrStutterGenerator.astro:251,453`
  - `src/components/diagnostics/GamepadDriftInspector.astro:203,213`
- **Evidence**:
  `VrrStutterGenerator.astro` executes `startEngine()` immediately on page load. Animation loops use recursive `requestAnimationFrame(loop)` without registering `visibilitychange` or `pagehide` handlers to pause rendering when `document.hidden` is `true`.
- **Why it matters**: Unstopped rAF loops on hidden or background tabs continue consuming CPU/GPU cycles and battery, leading to resource leaks.
- **Impact**: High background CPU/GPU usage and battery drain.
- **Likelihood**: High.
- **Suggested Remediation**: Store `animationFrameId` and pause animation loops using `document.addEventListener('visibilitychange')` when `document.hidden` is `true`, cancelling rAF on component unmount or route change.

#### Issue 2.3: Modal Dialog Focus Management & Tab Trapping Deficiencies
- **Severity**: P2 High (WCAG 2.2 AA SC 2.1.2 & SC 2.4.3 Focus Order)
- **Location**:
  - `src/components/diagnostics/HardwarePassportModal.astro`
  - `src/components/ui/EmbedWidgetModal.astro`
  - `src/components/ui/TestGuideModal.astro`
- **Evidence**:
  Modals render `role="dialog"` and `aria-modal="true"`. However, opening a modal does NOT programmatically set focus inside the modal, does NOT trap `Tab` key focus within the modal container, and does NOT restore focus to the triggering element upon close.
- **Why it matters**: Keyboard and screen reader users can tab past the open modal into hidden background page elements.
- **Impact**: Inaccessible modal navigation for screen reader and keyboard-only users.
- **Likelihood**: High.
- **Suggested Remediation**: Add focus trapping logic (`keydown` `Tab` handler cycling focus between first and last focusable element in modal), set initial focus to modal close button or header on open, and restore focus to trigger element on close.

#### Issue 2.4: Duplicate Nested `<main id="main-content">` Landmark Structures
- **Severity**: P2 High (HTML Semantics & WCAG 2.2 AA SC 1.3.1)
- **Location**:
  - `src/layouts/Layout.astro:672`
  - Paired with 30+ pages (e.g. `mic-noise-floor.astro`, `speaker-frequency.astro`, `backlight-bleed.astro`, `color-banding.astro`, `gamma.astro`, `grayscale.astro`, `motion-blur.astro`, `keyboard-tester/index.astro`, `refresh-rate-test.astro`, `monitor-color-calibration.astro`).
- **Evidence**:
  `Layout.astro` renders `<main id="main-content" class="flex-grow flex flex-col"><slot /></main>`. Child pages also wrap content in `<main id="main-content">`, resulting in rendered DOM structure:
  ```html
  <main id="main-content" class="flex-grow flex flex-col">
    <main id="main-content" class="py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      ...
    </main>
  </main>
  ```
- **Why it matters**: Duplicate `id="main-content"` violates W3C HTML specifications. Multiple nested `<main>` landmark regions confuse screen readers navigating by landmarks.
- **Impact**: W3C HTML validation errors and landmark navigation confusion for screen reader users.
- **Likelihood**: High.
- **Suggested Remediation**: Remove inner `<main id="main-content">` from child page templates or remove `<main>` from `Layout.astro` so each page outputs exactly one top-level `<main id="main-content">`.

---

### P3 — Medium Severity Issues

#### Issue 3.1: Dead / Unintegrated `MultiDisplaySync` BroadcastChannel Engine
- **Severity**: P3 Medium (Architecture / Feature Completeness)
- **Location**: `src/engine/MultiDisplaySync.ts`
- **Evidence**: `MultiDisplaySync` is implemented in `src/engine/MultiDisplaySync.ts` and tested in unit tests, but is **NEVER** imported or instantiated anywhere in `src/pages/` or `src/components/`.
- **Why it matters**: Documentation and learning guides describe multi-display BroadcastChannel pattern sync, but the feature is not wired into UI components.
- **Impact**: Promised multi-monitor sync capability is dead code.
- **Likelihood**: Medium.
- **Suggested Remediation**: Integrate `MultiDisplaySync` into multi-display test tools (`vrr.astro`, `white-screen.astro`, `dead-pixel.astro`).

#### Issue 3.2: Form Inputs Missing `aria-label` / `<label>` and Visible Focus Rings
- **Severity**: P3 Medium (WCAG 2.2 AA SC 4.1.2 & SC 2.4.7)
- **Location**:
  - `ApcaContrastInspector.astro:36,45`
  - `DeltaECalculatorInspector.astro:37,38,49,50`
  - `ApplianceEnergyInspector.astro:32,43`
  - `FilamentCostInspector.astro:32,43,48`
  - `KeyboardTesterCanvas.astro:40`
  - `Layout.astro:459`
- **Evidence**: Color pickers, hex text inputs, number inputs, search inputs, and dropdowns lack associated `<label for="...">` or `aria-label`. Several controls use `focus:outline-none` without `focus:ring-2`.
- **Why it matters**: Unlabeled inputs are announced without context by screen readers; missing focus rings prevent keyboard users from knowing which input has focus.
- **Impact**: Reduced accessibility for screen reader and keyboard users.
- **Likelihood**: High.
- **Suggested Remediation**: Add explicit `aria-label` or `<label for="...">` to all inputs and ensure visible focus rings (`focus:ring-2 focus:ring-status-pass`).

#### Issue 3.3: Mobile Viewport Height `100vh` Clipping & Missing `aria-expanded` on FAB
- **Severity**: P3 Medium (Mobile UX & ARIA State)
- **Location**:
  - `src/pages/embed/vrr-stutter.astro:23`
  - `src/components/ui/FloatingActionMenu.astro:68`
- **Evidence**:
  - `vrr-stutter.astro` uses `h-screen` (`100vh`), which causes vertical layout overflow on mobile Safari/Chrome with auto-hiding address bars.
  - `FloatingActionMenu.astro` toggle button `#btn-fab-toggle` lacks dynamic `aria-expanded="false/true"` state management.
- **Why it matters**: `100vh` on mobile causes address bar clipping; missing `aria-expanded` prevents screen readers from knowing whether the FAB menu is open or closed.
- **Impact**: Mobile layout clipping and incomplete screen reader announcements.
- **Likelihood**: Medium.
- **Suggested Remediation**: Replace `h-screen` with `h-dvh` / `min-h-dvh` in `vrr-stutter.astro` and update `aria-expanded` attribute on `#btn-fab-toggle` in `FloatingActionMenu.astro`.

---

### P4 — Low Severity Issues

#### Issue 4.1: Suboptimal Upgrade Recommendations in `PcBottleneckEngine`
- **Severity**: P4 Low (Calculation Logic Edge Case)
- **Location**: `src/engine/PcBottleneckEngine.ts:156,161`
- **Evidence**: `this.CPUS.find(c => c.singleCoreScore > cpu.singleCoreScore)` searches an unsorted array of CPUs. It returns the first CPU matching the condition rather than the next logical tier.
- **Why it matters**: May recommend an entry/mid-tier CPU instead of an actual upgrade path.
- **Impact**: Inaccurate component upgrade recommendations.
- **Likelihood**: Low.
- **Suggested Remediation**: Sort `CPUS` array by `singleCoreScore` before finding the recommended upgrade CPU.

#### Issue 4.2: Dynamic Timestamp Altering Hardware Passport Signature Hash
- **Severity**: P4 Low (State / Cryptographic Determinism)
- **Location**: `src/components/diagnostics/HardwarePassportModal.astro:316`, `src/engine/HardwarePassportEngine.ts:111`
- **Evidence**: `generatePassportData()` includes `timestamp: new Date().toISOString()`. Because timestamp changes every millisecond, re-generating the passport produces a different SHA-256 hash string each time the modal opens.
- **Why it matters**: Hardware passport hashes should be deterministic for identical hardware configurations.
- **Impact**: Hash instability across modal re-opens.
- **Likelihood**: Low.
- **Suggested Remediation**: Exclude dynamic timestamp from SHA-256 hash payload or use a fixed session timestamp.

#### Issue 4.3: Decorative Inline SVGs Lacking `aria-hidden="true"`
- **Severity**: P4 Low (Screen Reader Clutter)
- **Location**: Decorative inline SVGs in `HardwarePassportModal.astro`, `Layout.astro`, `EmbedWidgetModal.astro`, `dead-pixel.astro`, etc.
- **Evidence**: Numerous decorative icons lack `aria-hidden="true"`.
- **Why it matters**: Screen readers attempt to announce unlabelled graphic elements.
- **Impact**: Minor audio clutter for screen reader users.
- **Likelihood**: Low.
- **Suggested Remediation**: Add `aria-hidden="true"` to all decorative inline SVGs.

---

## Audit Verification Summary Table

| Category | Total Checked | Pass | Issues Found | Key Locations |
| :--- | :---: | :---: | :---: | :--- |
| **Unit & Engine Tests** | 51 suites / 286 tests | 286 | 0 | `src/engine/*.test.ts` |
| **TypeScript Type Check** | Entire codebase | 0 errors | 0 | `tsconfig.json` |
| **Functional Engine Call Integrity** | 51 engines | 50 | 1 (P1) | `monitor-color-calibration.astro:153` |
| **Epilepsy & Health Safety Warnings** | 12 flashing tools | 4 | 1 (P1) | `stuck-pixel`, `pwm-flicker`, `pixel-walk`, `frame-skipping` |
| **Keyboard Event & Hotkey Handling** | All listeners | Pass w/ bugs | 2 (P1, P2) | `KeyboardTesterCanvas.astro`, `Layout.astro` |
| **Animation Loop Cleanups (rAF)** | 9 rAF components | 4 | 1 (P2) | `FrameSkipping`, `MotionBlur`, `VrrStutterGenerator` |
| **WCAG Modal Focus & Trapping** | 3 modals | 0 | 1 (P2) | `HardwarePassportModal`, `EmbedWidgetModal`, `TestGuideModal` |
| **HTML Semantics (`<main>` Landmark)** | All 50+ pages | 20 | 1 (P2) | `Layout.astro` + child page templates |
| **Multi-Display BroadcastChannel Sync** | 1 engine | 0 in UI | 1 (P3) | `MultiDisplaySync.ts` |
| **Form ARIA Labels & Focus Rings** | All inputs | Partial | 1 (P3) | `ApcaContrastInspector`, `DeltaECalculatorInspector`, `Layout` |
| **Mobile Viewport Sizing (`dvh`)** | Embed & FAB | Partial | 1 (P3) | `embed/vrr-stutter.astro`, `FloatingActionMenu.astro` |

---

## Conclusion & Actionable Next Steps

1. **Immediate Remediation Priority**: Fix Issue 1.1 (`TypeError` on ICC Exporter) and Issue 1.3 (indiscriminate keyboard event trap in `KeyboardTesterCanvas.astro` and `KeyboardRollover.astro`).
2. **Safety Compliance**: Add `<EpilepsyWarning />` to `stuck-pixel.astro`, `pwm-flicker.astro`, `pixel-walk.astro`, and `frame-skipping.astro`.
3. **Accessibility & HTML Standards**:
   - Update `Layout.astro:865` to include `SELECT` elements in input focus guards.
   - Implement focus trapping and initial focus in modal overlays.
   - Remove duplicate nested `<main id="main-content">` elements across child pages.
