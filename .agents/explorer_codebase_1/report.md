# Monitor Test Hub — Codebase & Engine Inspection Report

**Agent Identity**: `explorer_codebase_1`  
**Working Directory**: `/Users/divyyadav/newws/.agents/explorer_codebase_1`  
**Project Root**: `/Users/divyyadav/newws/monitor_test_hub`  
**Date**: 2026-07-22  

---

## Executive Summary

A comprehensive verification build, type check, test suite execution, documentation audit, and deep code inspection was conducted across the **Monitor Test Hub** (`monitor_test_hub`) codebase.

### Key Metrics Summary
| Metric / Verification Step | Output Result | Status |
| :--- | :--- | :--- |
| **Static HTML Page Build** (`npm run build`) | **596 static pages** compiled in 2.25s via Astro 7 + `@astrojs/sitemap` | **PASS** (0 errors) |
| **TypeScript Type Check** (`npx tsc --noEmit`) | Strict mode compilation passed with 0 errors | **PASS** (0 errors) |
| **Vitest Unit & Stress Suite** (`npm test`) | **136 tests passed** across **12 test suites** (0 failures) | **PASS** (100% pass rate) |
| **Doc Integrity Audit** (`python3 verify_docs.py`) | **20 / 20 checks passed** (100.0%) | **PASS** |
| **Engine Modules Inspected** | All 8 core engine modules + 3 support engines in `src/engine/` | **INSPECTED** |

---

## 1. Terminal Command Verification Details

### 1.1 `npm run build` Output
- **Command Executed**: `npm run build`
- **Output Artifacts**: Total **596 static HTML pages** generated across default (`en`) and 3 localized (`es`, `de`, `fr`) routes.
- **Sitemap Index**: `@astrojs/sitemap` successfully created `sitemap-index.xml` in `./dist/`.
- **Duration**: 2.25 seconds.
- **Error Count**: 0 build errors, 0 warnings.

### 1.2 `npx tsc --noEmit` Output
- **Command Executed**: `npx tsc --noEmit`
- **TypeScript Configuration**: `tsconfig.json` in strict mode.
- **Output**: Clean exit (code 0), 0 type errors.

### 1.3 `npm test` Output (Vitest)
- **Command Executed**: `npm test` (`vitest run`)
- **Suite Breakdown**:
  1. `src/engine/HdrTestEngine.test.ts` — 15 passed
  2. `src/engine/InputLagEngine.test.ts` — 20 passed
  3. `src/engine/VrrSweepEngine.test.ts` — 18 passed
  4. `src/engine/OledBurnInEngine.test.ts` — 10 passed
  5. `src/engine/MultiDisplaySync.test.ts` — 3 passed
  6. `src/engine/TouchMatrixEngine.test.ts` — 16 passed
  7. `src/engine/InputLagEngine.stress.test.ts` — 14 passed
  8. `src/engine/VrrSweepEngine.perf.test.ts` — 1 passed (100k frame rAF loop benchmark: 1.67µs per frame, 1.77 MB heap delta)
  9. `src/engine/VrrSweepEngine.stress.test.ts` — 8 passed
  10. `src/engine/IccExporter.test.ts` — 2 passed
  11. `src/engine/HardwarePassportEngine.test.ts` — 5 passed
  12. `src/engine/HdrTestEngine.stress.test.ts` — 24 passed (100k PQ conversions in 46.12ms = 2,168,124 ops/sec; 10k tone map simulations in 23.96ms)
- **Total Test Files**: 12 passed (12)
- **Total Tests**: 136 passed (136)

### 1.4 `python3 verify_docs.py` Output
- **Command Executed**: `python3 verify_docs.py`
- **Audit Results**: 20/20 Checks Passed (100.0%) covering PRD, plan, competitor analysis report, tech stack references, engine specs, 4 Arcade micro-games, E-E-A-T disclaimers, ISO/VESA/IEC/CIE/ANSI standards, and milestone deliverables.

---

## 2. Deep Code Inspection of `src/engine/` Modules

### 2.1 `HardwarePassportEngine.ts` & `HardwarePassportEngine.test.ts`
- **Purpose**: Computes an aggregate **Display & Touch Health Index (0-100)** and generates cryptographically signed SHA-256 diagnostic passport receipts.
- **Health Score Algorithm**:
  1. **Frame Pacing & Refresh Rate (0-35 points)**: 240Hz+ = 35pts, 144Hz = 32pts, 120Hz = 30pts, 75Hz = 25pts, 58Hz = 22pts.
  2. **Color & Uniformity (0-35 points)**: 30-bit color depth (10-bit HDR) = 35pts, 24-bit SDR = 30pts. Deductions for OLED risk: `HIGH_RISK` (-10pts), `ELEVATED` (-5pts).
  3. **Digitizer & Input Touch (0-30 points)**: 10+ touch points = 30pts, 5+ touch points = 25pts, desktop/no touch default = 20pts.
- **Score Verdicts**: `EXCELLENT` (>=90), `GOOD` (75-89), `FAIR` (60-74), `ATTENTION_REQUIRED` (<60).
- **Cryptographic Signature**: `generateSignature()` uses Web Crypto `crypto.subtle.digest('SHA-256')` with fallback non-crypto hash generator, returning a 16-character hexadecimal hash.
- **Export Formats**: `createJsonBlob()` generates formatted `application/json` Blob.

### 2.2 `MultiDisplaySync.ts` & `MultiDisplaySync.test.ts`
- **Purpose**: Low-latency multi-monitor window synchronization bus powered by `BroadcastChannel` ('monitortesthub_sync_bus').
- **Supported Events**:
  - `COLOR_CHANGE` (hex color synchronization across secondary windows)
  - `PATTERN_CHANGE` (test grid / zone pattern selection)
  - `FULLSCREEN_TOGGLE` (synchronized multi-window target layout)
  - `PING_SYNC` (peer window discovery & heartbeat)
- **Design Pattern**: Isolates `BroadcastChannel` so Node/Vitest tests can execute safely without throwing DOM errors.

### 2.3 `InputLagEngine.ts`, `InputLagEngine.test.ts` & `InputLagEngine.stress.test.ts`
- **Purpose**: Sub-millisecond reaction stats, hardware latency bottleneck analysis, and reaction histogram binning.
- **Supported Presets**:
  - Refresh Rates: 60Hz, 120Hz, 144Hz, 240Hz, 360Hz, 540Hz (frame intervals 16.67ms down to 1.85ms).
  - Polling Rates: 125Hz, 500Hz, 1000Hz, 2000Hz, 4000Hz, 8000Hz (poll periods 8.00ms down to 0.125ms).
- **Bottleneck Classifier**: Evaluates ratio `frameIntervalMs / pollingIntervalMs`:
  - Ratio > 1.5 => `DISPLAY_LIMITED` (Display refresh bottleneck)
  - Ratio < 0.67 => `POLLING_LIMITED` (USB mouse polling bottleneck)
  - 0.67 <= Ratio <= 1.5 => `BALANCED` (Optimal pipeline alignment)
- **Reaction Rating Tiers**: `ESPORTS_ELITE` (<160ms), `FAST_REFLEX` (160-200ms), `AVERAGE` (200-250ms), `SLOW` (250-350ms), `DELAYED` (>=350ms).
- **Inter-sample Jitter**: Calculates average delta between consecutive clicks `|x_i - x_{i-1}| / (N-1)`.

### 2.4 `OledBurnInEngine.ts` & `OledBurnInEngine.test.ts`
- **Purpose**: OLED luminance degradation and image retention risk modeling based on panel architecture, cumulative hours, and static content exposure.
- **Supported Panel Technologies**:
  - `qd-oled` / `qd-oled-v1` (Samsung QD-OLED Gen 1, multiplier 1.45)
  - `qd-oled-v2` (Samsung QD-OLED Gen 2/3, multiplier 1.10)
  - `woled` (Standard WOLED, multiplier 1.25)
  - `woled-meta` (LG Display WOLED META / MLA, multiplier 0.95)
  - `amoled` / `amoled-laptop` (AMOLED Mobile/Laptop, multiplier 1.55)
- **Wear Units Formula**: `(usageHours / 1000) * multiplier * (1 + staticRatio * 0.8) * nitRatio`.
- **Outputs**: Risk score (0-100), estimated luminance retention % (bounded 60%-100%), decay rate %, risk category (`MINIMAL`, `MODERATE`, `ELEVATED`, `HIGH_RISK`), and recommended pixel refresh interval in hours.

### 2.5 `HdrTestEngine.ts`, `HdrTestEngine.test.ts` & `HdrTestEngine.stress.test.ts`
- **Purpose**: SMPTE ST 2084 PQ EOTF math engine, 10-bit RGB code step calculation, clipping threshold evaluation, tone mapping roll-off simulation, and Auto Brightness Limiter (ABL) window size evaluator.
- **Mathematical Constants**:
  - `PQ_M1 = 2610 / 16384` (0.1593017578125)
  - `PQ_M2 = 2523 / 32` (78.84375)
  - `PQ_C1 = 3424 / 4096` (0.8359375)
  - `PQ_C2 = 2413 / 128` (18.8515625)
  - `PQ_C3 = 2392 / 128` (18.6875)
  - `PQ_MAX_NITS = 10000.0`
- **Tone Mapping Modes**:
  1. `hgig`: Hard clipping at display peak nits; zero roll-off.
  2. `static`: Fixed S-curve knee roll-off starting at 65% of display peak nits.
  3. `dynamic`: Adaptive APL-dependent knee curve (`kneeRatio = 0.85 - 0.45 * aplFactor`).
  4. `clip`: Direct signal clipping above peak nits.
- **ABL Window Sizes**: 1%, 5%, 10%, 25%, 100% window sizes evaluated across panel types (`qd-oled`, `woled`, `woled-mla`, `mini-led-fald`, `edge-lit-lcd`).

### 2.6 `TouchMatrixEngine.ts` & `TouchMatrixEngine.test.ts`
- **Purpose**: Digitizer dead-zone matrix analyzer, gesture velocity (px/ms & px/sec), inter-frame timestamp jitter variance, and vector trajectory drift error.
- **Grid Densities**: Low (8x12), Medium (10x16), High (16x24), Ultra-Dense (24x36).
- **Matrix States**: `0` = Untested, `1` = Touched/Verified, `2` = Dead zone.
- **Trajectory Drift Error**: Computes Euclidean perpendicular distance from recorded touch points `(x, y)` to ideal line `Ax + By + C = 0` between gesture start and end points, reporting `maxDriftPx`, `meanDriftPx`, `rmsDriftPx`, and `driftErrorPct`.

### 2.7 `VrrSweepEngine.ts`, `VrrSweepEngine.test.ts`, `VrrSweepEngine.stress.test.ts` & `VrrSweepEngine.perf.test.ts`
- **Purpose**: Variable Refresh Rate (48Hz-540Hz) stutter & tear simulation engine.
- **Low Frame Rate Compensation (LFC)**: When target FPS < minVrrHz (48Hz), multiplies frame presentation rate (2x, 3x, 4x) to maintain display refresh rate inside hardware VRR window.
- **Sync Mode Classifier**: `NATIVE_VRR` (within VRR bounds), `LFC_ACTIVE` (below 48Hz), `TEARING_DESYNC` (FPS > max refresh rate).
- **Performance Benchmark**: 100,000 simulated rAF frame loops execute in 166.83ms (1.67µs per frame) with 1.77 MB heap allocation delta.

### 2.8 `IccExporter.ts` & `IccExporter.test.ts`
- **Purpose**: CIE 1931 display calibration & binary ICC v4.3 profile exporter.
- **Chromaticity to XYZ**: Converts CIE 1931 `(x, y)` chromaticity to CIE XYZ coordinates `(X = x/y, Y = 1.0, Z = (1-x-y)/y)`.
- **Binary Format**: Generates 128-byte ICC header (with `mnt `, `RGB `, `XYZ `, `acsp`, `APPL`, `AGY `, D50 illuminant values) + Tag Table + 5 Tag Payloads (`desc`, `wtpt`, `rXYZ`, `gXYZ`, `bXYZ`). Returns `Uint8Array`.

### 2.9 Additional Engine Support Modules
- `VsyncSyncEngine.ts`: Tracks frame delta time via `requestAnimationFrame()`, calculates moving average FPS, detects tab backgrounding/stutter (>100ms delta), and self-heals sync loss state.
- `WebGLContextManager.ts`: Initializes WebGL2 context (`alpha: false`, `desynchronized: true`, `powerPreference: 'high-performance'`) with graceful fallback to Canvas2D desynchronized mode.
- `WorkerBridge.ts`: Handles `transferControlToOffscreen()` for zero-main-thread-jerk Web Worker rendering.

---

## 3. Notable Empirical Findings & Edge Case Behavior

During deep code and stress test inspection, three specific edge-case behaviors were identified:

1. **`InputLagEngine.ts` — Histogram Binning Truncation Edge Case**:
   - **Observation**: In `calculateHistogramBins()`, fixed bin width calculation `binWidthMs = (maxVal - minVal) / binCount` truncates floating-point numbers when using integer rounding (e.g. `(200 - 100) / 3 = 33.33`).
   - **Impact**: The upper bound of bin 2 becomes `100 + 3 * 33.33 = 199.99`, which causes an exact sample value of `200.0` to be excluded from all bins.
   - **Location**: `InputLagEngine.ts:327`, documented in `InputLagEngine.stress.test.ts:186`.

2. **`HdrTestEngine.ts` — Static Tone Mapping Peak Luminance Truncation**:
   - **Observation**: In `simulateToneMap()` under `static` mode, the quadratic roll-off formula `outputNits = kneeNits + compressionFactor * (safePeak - kneeNits)` evaluates to `kneeNits + 0.5 * (safePeak - kneeNits)` when `inputNits = contentMaxNits` (`t = 1.0`).
   - **Impact**: On a 1000-nit display (knee = 650 nits), maximum output nits caps at 825 nits (82.5% of display peak) even at 10,000 nits input.
   - **Location**: `HdrTestEngine.ts:287-289`, documented in `HdrTestEngine.stress.test.ts:171`.

3. **`HdrTestEngine.ts` — `isClipped` Threshold Near Peak**:
   - **Observation**: `simulateToneMap()` calculates `isClipped = outputNits >= safePeak * 0.995`.
   - **Impact**: An uncompressed signal of 996 nits on a 1000-nit display is flagged as `isClipped: true` despite not exceeding the display peak.
   - **Location**: `HdrTestEngine.ts:309`, documented in `HdrTestEngine.stress.test.ts:163`.

---

## 4. Conclusion & Recommendations

The Monitor Test Hub engine suite is architecturally sound, thoroughly tested (136 passing tests), type-safe (0 tsc errors), fully documented (20/20 doc checks), and builds clean static HTML outputs (596 pages). All engine modules operate without DOM dependencies, permitting ultra-fast headless testing in Vitest.
