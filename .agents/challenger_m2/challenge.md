# Milestone 2 (VRR Stutter & Tear Generator) Adversarial Challenge Report

**Date**: 2026-07-22  
**Target Codebase**: `/Users/divyyadav/newws/monitor_test_hub`  
**Overall Risk Assessment**: LOW–MEDIUM  

---

## 1. Executive Summary

Milestone 2 delivers a robust VRR frame pacing simulation engine (`VrrSweepEngine.ts`), interactive diagnostic UI (`VrrStutterGenerator.astro`), and complete static route generation across localized sub-paths. Core unit tests and TypeScript typechecks pass cleanly.

However, adversarial stress-testing identified 4 key areas for improvement:
1. **Engine Edge Cases**: Inconsistency between `calculateVrrMetrics(0)` (which forces `targetFps=0` to fallback to `60`) vs `calculateLfcStatus(0)` (which preserves `0`). Clamping behavior when `maxHz < minHz` in `getSweepFps`.
2. **Preset Clamping**: `sanitizeRefreshRate` hardcodes allowed refresh rates to `['60hz', '144hz', '240hz', '360hz', '540hz']`, causing dynamic rates like `1000hz` or `480hz` to silently clamp to `144hz`.
3. **rAF Loop Garbage Collection & DOM Churn**: `VrrStutterGenerator.astro` allocates 4+ objects/arrays per frame tick and unconditionally mutates 7 DOM node properties/classes on every rAF frame (up to 540 Hz), creating garbage collection pressure and layout invalidation.
4. **Static Route Parameters**: `getStaticPaths` correctly generates all 80 required VRR static route permutations (20 root + 60 localized).

---

## 2. Challenge Findings & Stress-Test Results

### Challenge 1: Engine Edge Cases (`VrrSweepEngine.ts`)

| Scenario | Input | Expected Behavior | Actual Behavior | Result |
| :--- | :--- | :--- | :--- | :--- |
| **0 Hz Refresh Rate** | `calculateVrrMetrics(60, 0)` | Safe fallback to 144 Hz max | `safeMaxHz = 144`, label `"144 Hz"` | PASS |
| **1000 Hz Refresh Rate** | `calculateVrrMetrics(60, 1000)` | Metrics calculation accepts 1000 Hz | `safeMaxHz = 1000`, label `"1000 Hz"` | PASS |
| **1000 Hz String Sanitization** | `sanitizeRefreshRate('1000hz')` | Support numeric string or fall back | Clamped to `'144hz'` (not in `VALID_REFRESH_RATES`) | WARN |
| **0 Target FPS Metrics** | `calculateVrrMetrics(0, 144)` | Maintain 0 target FPS | Falls back `targetFps` to `60` (`safeFps = 60`) | FAIL (Inconsistency) |
| **0 Target FPS LFC** | `calculateLfcStatus(0, 48)` | `effectiveFps: 0`, LFC inactive | `effectiveFps: 0`, `isLfcActive: false` | PASS |
| **Invalid GPU String** | `sanitizeGpuVendor('ARM-Mali-G710')` | Fallback to `'nvidia-geforce'` | Returns `'nvidia-geforce'` | PASS |
| **Object / Symbol Input** | `sanitizeGpuVendor({ vendor: 'amd' })` | Fallback to `'nvidia-geforce'` | Returns `'nvidia-geforce'` | PASS |
| **NaN / Infinity Inputs** | `calculateVrrMetrics(NaN, NaN, NaN, NaN)` | Graceful fallback to default values | Returns default metrics (`targetFps: 60`, `maxHz: 144`) | PASS |
| **Inverted Hz Bounds** | `getSweepFps('sine', 0, 15, 20)` | Clamped range or error | Calculates negative range (`range = -5`), returning `17.5 FPS` | WARN |

---

### Challenge 2: rAF Loop Performance & Memory Allocations (`VrrStutterGenerator.astro`)

- **Allocation Churn per Frame**:
  - `calculateVrrMetrics` creates 4 object instances per frame: `ILfcStatus`, `mockFrameTimes` array (`[expected, expected*1.02, ...]`), `IStutterMetrics`, and `IVrrMetrics`.
  - `calculateStutterVariance` invokes `frameTimesMs.filter()` which allocates a new `Array` instance on every frame tick.
  - At 540 Hz display refresh, this generates **~2,160 temporary allocations per second**.
- **Array Re-indexing Overhead**:
  - Line 284: `frameTimesBuffer.shift()` executes on every frame tick once `frameTimesBuffer.length > 60`, triggering O(N) array element shifting.
- **Unconditional DOM Mutations**:
  - Lines 292–325: `textFps.textContent`, `textHz.textContent`, `textDrops.textContent`, `textStutter.textContent`, `badgeStatus.className`, `overlayLfc.textContent`, `overlayTear.className` are updated on every single frame tick regardless of whether values changed.
  - Updating DOM attributes at 240Hz–540Hz causes unnecessary browser style recalculations and layout invalidation.
- **Context & DOM Queries inside Loop**:
  - `canvas.getContext('2d')` is retrieved on every frame inside `renderCanvasFrame`.
  - `document.documentElement.classList.contains('light')` is queried twice per frame tick.

---

### Challenge 3: Static Route Generation (`getStaticPaths`)

- **Root Route (`src/pages/vrr-stutter-test/[gpuVendor]/[refreshRate].astro`)**:
  - Generates 20 static routes: 4 GPU vendors (`nvidia-geforce`, `amd-radeon`, `intel-arc`, `apple-silicon`) × 5 refresh rates (`60hz`, `144hz`, `240hz`, `360hz`, `540hz`).
- **Localized Route (`src/pages/[locale]/vrr-stutter-test/[gpuVendor]/[refreshRate].astro`)**:
  - Generates 60 static routes: 3 locales (`es`, `de`, `fr`) × 4 GPU vendors × 5 refresh rates.
- **Astro Build Status**:
  - `ASTRO_TELEMETRY_DISABLED=1 ./node_modules/.bin/astro build` compiled 279 static pages cleanly without missing parameters or route collisions.

---

### Challenge 4: Test Suite & Typecheck Status

- **Vitest Unit Tests**: Passed 4/4 test files (38/38 tests) in `207ms`.
- **TypeScript Typecheck**: `tsc --noEmit` completed with **0 errors**.

---

## 3. Recommended Mitigations

1. **Engine Target FPS Handling**:
   Update `calculateVrrMetrics` line 266: `const safeFps = Number.isFinite(targetFps) && targetFps >= 0 ? targetFps : 60;` so `0` target FPS is preserved identically to `calculateLfcStatus`.
2. **Sweep Bounds Check**:
   In `getSweepFps`, ensure `safeMax` is clamped to be at least `safeMin` (e.g. `const safeMax = Math.max(Number.isFinite(maxHz) ? maxHz : 144, safeMin)`).
3. **DOM Update Throttling / Dirty Checking**:
   In `VrrStutterGenerator.astro`, store previous formatted string values and only update `textContent` / `className` when the value actually changes.
4. **Buffer Shift Optimization**:
   Replace `frameTimesBuffer.shift()` with a circular array index pointer to eliminate array re-indexing allocations in rAF loop.
