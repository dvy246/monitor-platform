# Milestone 1 (OLED Burn-In Risk Analyzer) Adversarial Challenge Report

## Challenge Summary

**Overall risk assessment**: MEDIUM

Milestone 1 introduces solid foundational math for OLED luminance degradation and basic canvas-based near-black uniformity visualization. However, stress-testing uncovered several critical edge cases in mathematical calculations, canvas memory re-allocation anti-patterns, missing dynamic SSG routes, and potential client-side memory leaks during Astro SPA navigation.

---

## Challenges

### [High] Challenge 1: Unhandled RangeError and NaN Propagation in `OledBurnInEngine.ts`

- **Assumption challenged**: Engine assumes input `usageHours`, `averageNits`, and `staticElementHoursPerDay` are finite non-NaN numbers within typical ranges.
- **Attack scenario**: 
  1. Passing `usageHours: Infinity` causes `(100 - totalWearUnits * 1.8)` to evaluate to `-Infinity`. Line 94 calls `(-Infinity).toFixed(1)`, which throws an unhandled JS `RangeError: toFixed() digits argument must be between 0 and 100`, crashing client script execution.
  2. Passing `usageHours: NaN`, `averageNits: NaN`, or `staticElementHoursPerDay: NaN` results in `Math.max()` evaluating to `NaN`. All wear metrics return `NaN`. Because comparisons `NaN > 75`, `NaN > 50`, `NaN > 25` fail silently, the engine reports `'MINIMAL'` risk category alongside `NaN%` retention.
  3. Passing uppercase panel strings (e.g. `'QD-OLED'`) fails lookup in `PANEL_TYPE_CONFIG['QD-OLED']` due to case sensitivity, falling back to default 1.20x multiplier instead of 1.45x.
- **Blast radius**: UI crash on unbounded inputs; incorrect risk categorization and misleading user metrics on bad query/slider inputs.
- **Mitigation**: Sanitize all numerical inputs with `Number.isFinite()`, convert panel strings to lowercase before lookup, and clamp `retentionPct` before calling `.toFixed(1)`.

```typescript
// Recommended Mitigation Pattern:
const rawHours = Number(params.usageHours);
const usageHours = Number.isFinite(rawHours) && rawHours >= 0 ? rawHours : defaultHours;
```

---

### [Medium] Challenge 2: Canvas Memory Re-allocation and Blurry HiDPI Rendering

- **Assumption challenged**: Canvas dimensions can be updated on every render frame without performance or visual fidelity impact.
- **Attack scenario**: 
  1. In `OledBurnInAnalyzer.astro` (lines 266-269), `canvas.width = width; canvas.height = height;` is executed inside `renderCanvas()`, which runs on every slider input event. Mutating canvas width/height clears the backing store surface and forces browser GPU memory re-allocation and paint layout recalculations, causing frame drops during slider dragging.
  2. Canvas width/height are set directly to CSS pixel dimensions (`clientWidth`/`clientHeight`) without scaling by `window.devicePixelRatio`. On Retina/4K OLED screens, 5% near-black grid lines render blurry and pixelated.
  3. `window.addEventListener('resize', renderCanvas)` and `document.addEventListener('astro:page-load', initBurnInAnalyzer)` add event listeners on every Astro view transition without cleaning up old listeners, causing memory leaks.
- **Blast radius**: UI lag during slider interactions, blurry rendering on high-DPI display hardware, memory accumulation during client-side navigation.
- **Mitigation**: Only update `canvas.width`/`canvas.height` when `clientWidth` or `devicePixelRatio` actually changes. Account for `devicePixelRatio` in scale transforms. Cleanup event listeners on Astro page unmount (`astro:before-swap` / cleanup functions).

---

### [Medium] Challenge 3: Incomplete Dynamic Route Parameters Generation (`getStaticPaths`)

- **Assumption challenged**: `getAllPanelTypes()` returns all panel types supported by `OledBurnInEngine`.
- **Attack scenario**: 
  1. `PANEL_TYPE_CONFIG` in `OledBurnInEngine.ts` supports panel keys `'qd-oled-v1'` and `'amoled-laptop'`.
  2. `getAllPanelTypes()` only returns `['qd-oled', 'woled', 'amoled', 'qd-oled-v2', 'woled-meta']`.
  3. In `src/pages/oled-burn-in-risk/[panelType]/[usageTier].astro` and `src/pages/[locale]/oled-burn-in-risk/[panelType]/[usageTier].astro`, `getStaticPaths` relies exclusively on `getAllPanelTypes()`. Consequently, pre-rendered static routes are never generated for `'qd-oled-v1'` or `'amoled-laptop'`, leading to 404 errors if users navigate to those panel URLs.
- **Blast radius**: Broken links / 404 errors for valid panel type URLs during static site generation.
- **Mitigation**: Update `getAllPanelTypes()` to include all keys from `PANEL_TYPE_CONFIG` or filter out obsolete internal aliases explicitly.

---

### [Low] Challenge 4: Fullscreen Overlay UX in `OledUniformityEngine.astro`

- **Assumption challenged**: Fullscreen near-black gray test pattern provides a clean, unobstructed screen background for panel inspection.
- **Attack scenario**: 
  1. Clicking "Go Fullscreen" makes `<div id="uniform-preview">` fullscreen.
  2. The instruction text ("Click window or use the button above... Press ESC to exit fullscreen") is rendered inside `<div class="absolute inset-0 flex items-center justify-center ...">` inside `uniform-preview`.
  3. In fullscreen mode, the prompt text stays visible in the middle of the screen, obscuring the center of the display where user wants to check for OLED vertical banding and DSE.
- **Blast radius**: Degraded diagnostic usability when inspecting 5% near-black gray and solid burn-in test patterns in fullscreen mode.
- **Mitigation**: Hide the instruction overlay when fullscreen state is active (e.g. using `:fullscreen` CSS pseudo-class or JavaScript `fullscreenchange` event).

---

## Stress Test Results

| Scenario | Expected Behavior | Actual / Predicted Behavior | Pass / Fail |
| --- | --- | --- | --- |
| `usageHours: 0` | 0 risk score, 100% retention, 16h refresh | `riskScore: 0`, `retentionPct: 100%`, `refresh: 16h` | **PASS** |
| `usageHours: 50000` | 100 risk score, retention bounded at 60% | `riskScore: 100`, `retentionPct: 60.0%`, `refresh: 6h` | **PASS** |
| `usageHours: Infinity` | Bounded math / fall back to upper limits | Throws `RangeError: toFixed() digits argument must be between 0 and 100` | **FAIL** |
| `usageHours: NaN` | Safe fallback or error validation | Returns `riskScore: NaN`, `retentionPct: NaN`, `riskCategory: 'MINIMAL'` | **FAIL** |
| `panelType: 'QD-OLED'` (uppercase) | Match `'qd-oled'` config multiplier 1.45x | Unmatched key, falls back to default 1.20x multiplier | **FAIL** |
| `averageNits: 2000` | High nit degradation modeling | `nitRatio` capped at 2.0 (same as 400 nits) | **PASS (Bounded)** |
| `canvas.width` reset on frame | Retain width/height unless resized | Reset on every `renderCanvas()` call | **FAIL** |
| `getStaticPaths` for `'qd-oled-v1'` | Static route generated | Missing from `getAllPanelTypes()`, returns 404 | **FAIL** |
| `npm test` execution | All Vitest unit tests pass | 8 tests passed across 2 test files | **PASS** |
| `npx tsc --noEmit` typecheck | 0 TypeScript errors | Executed clean with 0 errors | **PASS** |
| `npx astro build` SSG | 163 pages built successfully | Completed in 816ms with 0 errors | **PASS** |

---

## Unchallenged Areas

- **ICC Profile Exporter (`IccExporter.ts`)**: Out of primary scope for OLED Burn-In Risk Analyzer milestone, though unit tests pass (2/2).
- **Sub-Pixel Diagnostic Rendering (`SubPixelAnalyzer.astro`)**: Deferred to Sub-Pixel milestone stress testing.
