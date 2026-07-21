# Milestone 3 (Touch Matrix) Adversarial Challenge & Stress Test Report

## Executive Summary

- **Overall Risk Assessment**: **MEDIUM** (Engine math and static routes are highly robust with 0 type/build errors; UI canvas component has unthrottled `pointermove` repaints and unbounded memory growth in trajectory tracking).
- **Test Suite Status**: **55/55 existing tests PASSED** | **17/17 empirical stress tests PASSED**
- **Typecheck**: `npx tsc --noEmit` passed with 0 errors.
- **Build Status**: `npm run build` generated 347 static pages cleanly in 1.02s.

---

## 1. Engine Edge Cases (`src/engine/TouchMatrixEngine.ts`)

| Edge Case / Scenario | Expected Behavior | Actual Behavior | Status |
| :--- | :--- | :--- | :--- |
| **0 Touches** | Empty struct with 0 velocity/jitter/drift | Handled gracefully (`velocityPxPerMs: 0`, `sampleCount: 0`) | **PASS** |
| **Single Touch Point** | Handled without division by zero | Returns zeroed velocity & drift metrics safely | **PASS** |
| **100 Simultaneous Touches** | Non-blocking execution, handle identical timestamps | `durationMs <= 0` check prevents `NaN`/`Infinity`; processes 100 points in < 1ms | **PASS** |
| **100,000 Points Performance** | High throughput without thread lock | 100k points calculated in 54ms | **PASS** |
| **Negative Coordinates** | Correct Euclidean math & bounds filtering | Distance `Math.hypot` accurate; `calculateCellIndex` returns `null` for negative space | **PASS** |
| **NaN / Infinity / Non-Finite** | Strict type & boundary filtering | `Number.isFinite` filters invalid coordinates/timestamps in all math functions | **PASS** |
| **Exact Boundary (`x == width`)** | Standard cell bounding | Returns `null` when `x === canvasWidth` because `col === cols` (`col >= cols` check) | **LOW RISK** |

### Detailed Findings for Engine
1. **Strict Input Sanitization**: Functions `calculateGestureVelocity`, `calculateJitterVariance`, `calculateCellIndex`, and `calculateTrajectoryDrift` correctly validate inputs using `Number.isFinite`.
2. **Division-by-Zero Defense**: `calculateGestureVelocity` guards against `durationMs <= 0` returning explicit zeroed velocity instead of `Infinity`. `calculateJitterVariance` guards against 0 deltas.
3. **Perpendicular Line Equation Guard**: `calculateTrajectoryDrift` checks `denominator === 0` (when start & end points coincide) and falls back to simple point-to-point Euclidean distance.
4. **Boundary Edge Observation**: In `calculateCellIndex`, when `x === canvasWidth` (e.g. touch coordinate exactly on rightmost pixel boundary), `col = Math.floor((canvasWidth/canvasWidth)*cols) = cols`. The guard `if (col < 0 || col >= cols)` returns `null`. This excludes the exact edge pixel from cell indexing.

---

## 2. Canvas Multi-Touch & PointerEvents Performance & Memory Allocation

### Identified Failure Modes & Bottlenecks

#### A. Synchronous Repaints & Telemetry Calculations on `pointermove` (HIGH SEVERITY)
- **Observation**: In `TouchMatrixTester.astro` and `MultiTouchDetector.astro`, `handlePointerMove` directly invokes `updateTelemetryHUD()` and `draw()`.
- **Impact**: Modern touch digitizers (e.g. iPad Pro, gaming smartphones, touch laptops) emit `pointermove` events at 120Hz - 1000Hz. Executing synchronous DOM mutations (`textContent`), matrix evaluations (`cols * rows` iteration), and full canvas redrawing on every single raw pointer tick causes CPU main-thread starvation and frame stuttering during rapid multi-finger dragging.
- **Mitigation**: Wrap `draw()` and telemetry updates inside a `requestAnimationFrame` (rAF) throttle loop, accumulating pointer position updates in an event queue.

#### B. Unbounded Memory Accumulation in Trajectory Mode (MEDIUM SEVERITY)
- **Observation**: In `TouchMatrixTester.astro`, when `currentMode === 'trajectory'`, `recordedTrajectory.push(pt)` appends points infinitely on every move event without an upper bound limit.
- **Impact**: Prolonged drawing tests (e.g. 5-10 minutes of continuous touch tracing) accumulate tens of thousands of `TouchPoint` objects. Because `calculateTrajectoryDrift(recordedTrajectory)` runs over the entire `recordedTrajectory` array on every `pointermove` tick, calculation latency degrades linearly from O(1) to O(N), leading to severe memory bloat and frame drops.
- **Mitigation**: Cap `recordedTrajectory` to a maximum point buffer size (e.g. max 1,000 points) or downsample points based on minimum distance deltas.

#### C. Garbage Collection Pressure from `Array.prototype.shift` (LOW SEVERITY)
- **Observation**: `trail.shift()` and `timestampHistory.shift()` are executed on every move tick once max size is reached.
- **Impact**: Frequent `shift()` operations force JavaScript engines to re-index internal array elements, causing minor GC pauses during rapid multi-finger gestures.
- **Mitigation**: Replace sliding arrays with fixed-size ring buffers or head/tail index pointers.

#### D. Missing Explicit Pointer Capture Release (LOW SEVERITY)
- **Observation**: `canvas.setPointerCapture(e.pointerId)` is called in `handlePointerDown`, but `canvas.releasePointerCapture(e.pointerId)` is missing in `handlePointerUp`/`handlePointerCancel`.
- **Impact**: While most modern browsers release pointer capture automatically on pointerup, explicit release prevents edge-case capture leaks if pointer events bubble out of context.

---

## 3. Static Route Parameters Generation (`getStaticPaths`)

### Path Verification Matrix

1. **Base Dynamic Route**: `src/pages/touch-matrix/[deviceType]/[gridDensity].astro`
   - Devices (4): `smartphone`, `tablet`, `kiosk`, `touch-laptop`
   - Densities (4): `low`, `medium`, `high`, `ultra-dense`
   - **Static Routes Generated**: 4 x 4 = **16 HTML pages**

2. **Localized Dynamic Route**: `src/pages/[locale]/touch-matrix/[deviceType]/[gridDensity].astro`
   - Locales (3): `es`, `de`, `fr`
   - Devices (4): `smartphone`, `tablet`, `kiosk`, `touch-laptop`
   - Densities (4): `low`, `medium`, `high`, `ultra-dense`
   - **Static Routes Generated**: 3 x 4 x 4 = **48 HTML pages**

3. **Build Execution Result**:
   - Total Touch Matrix Static Pages: **64 pages**
   - Build Tool Output: `347 page(s) built in 1.02s` without any parameter generation errors or broken static path warnings.

---

## 4. Verification & Stress Test Output

- **Vitest Unit & Perf Suite**: `6 passed (55 tests)`
- **Vitest Empirical Stress Harness (`touch_matrix_edge.test.ts`)**: `1 passed (17 tests)`
- **TypeScript Compiler (`npx tsc --noEmit`)**: `0 errors`
- **Astro Build Production Target (`npm run build`)**: `Success (347 pages)`
