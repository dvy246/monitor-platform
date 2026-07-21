# Handoff Report — Milestone 4 Architecture & Engine Specification

## 1. Observation
- **Codebase Context**: Located in `/Users/divyyadav/newws/monitor_test_hub`.
- **Existing Engines Examined**:
  - `src/engine/OledBurnInEngine.ts` (lines 1-139): Presets mapping, parameter sanitization, formula calculation for wear units/risk score, Vitest unit test suite.
  - `src/engine/VrrSweepEngine.ts` (lines 1-315): Presets for GPU vendors & refresh rates, frame time delta calculations, micro-stutter variance ($ms^2$) and stdDev ($ms$).
  - `src/engine/TouchMatrixEngine.ts` (lines 1-353): Timestamp jitter variance calculation (`calculateJitterVariance`), velocity calculation, dead-zone cell tracking, vector trajectory drift error.
  - `src/engine/TouchMatrixEngine.test.ts` (lines 1-247): Vitest suite structure with unit tests covering boundary values, empty arrays, NaN inputs, and edge case fallbacks.
- **Existing Latency UI / Pages**:
  - `src/pages/touch-tests/input-lag.astro` (lines 113-200): Inline script logic for `performance.now()` measuring, simple average array reduce, inline DOM bottleneck label calculation.
  - `src/components/arcade/LagReflexSniper.astro` (lines 165-187): Target spawn timestamping using `performance.now()`, basic latency array accumulation.
- **Orchestrator Mandates**:
  - `PROJECT.md` (lines 23, 28-33): Milestone 4 scope defines Latency Engine, UI Component, Unit Tests, and routes `/input-lag-test/` and `/input-lag-test/[refresh-rate]/[polling-rate]`. Pure TypeScript calculation functions in `src/engine/` with comprehensive Vitest suite.

---

## 2. Logic Chain
1. **Engine Separation**: Currently, `src/pages/touch-tests/input-lag.astro` and `src/components/arcade/LagReflexSniper.astro` calculate averages and bottleneck strings directly inside client `<script>` blocks. Following the project architecture standard defined in `PROJECT.md`, all math and statistics must be encapsulated in a pure TypeScript engine `src/engine/InputLagEngine.ts` with zero DOM dependencies.
2. **Statistical Precision Requirements**:
   - `performance.now()` returns sub-millisecond timestamps (e.g. `1234.567ms`).
   - Reaction statistics require robust filtering of early clicks/false starts ($<50\text{ ms}$) and timeouts ($>2000\text{ ms}$).
   - Calculations must yield: arithmetic `meanMs`, `medianMs` (50th percentile), `minMs`, `maxMs`, standard deviation `stdDevMs`, sample count `sampleCount`, inter-sample jitter `jitterMs`, and a categorical rating `rating`.
3. **Bottleneck Analysis Mathematics**:
   - Refresh Rate frame interval: $T_{\text{frame}} = 1000 / f_{\text{refresh}}$ (e.g. 60Hz $\rightarrow$ 16.67ms, 144Hz $\rightarrow$ 6.94ms, 240Hz $\rightarrow$ 4.17ms, 360Hz $\rightarrow$ 2.78ms, 540Hz $\rightarrow$ 1.85ms).
   - Mouse Polling interval: $T_{\text{poll}} = 1000 / f_{\text{polling}}$ (e.g. 125Hz $\rightarrow$ 8.00ms, 500Hz $\rightarrow$ 2.00ms, 1000Hz $\rightarrow$ 1.00ms, 4000Hz $\rightarrow$ 0.25ms, 8000Hz $\rightarrow$ 0.125ms).
   - Expected average display frame delay: $D_{\text{frame}} = T_{\text{frame}} / 2$.
   - Expected average input polling delay: $D_{\text{poll}} = T_{\text{poll}} / 2$.
   - Baseline hardware latency penalty: $D_{\text{hardware}} = D_{\text{frame}} + D_{\text{poll}}$.
   - Maximum phase misalignment latency jitter: $J_{\text{max}} = T_{\text{frame}} + T_{\text{poll}}$.
   - Bottleneck classification:
     - Ratio $R = T_{\text{frame}} / T_{\text{poll}}$.
     - If $R > 1.5$: `'DISPLAY_LIMITED'` (Display frame interval dominates latency budget).
     - If $R < 0.67$: `'POLLING_LIMITED'` (Mouse polling interval dominates latency budget).
     - Else: `'BALANCED'`.
4. **Histogram Binning Logic**:
   - Dynamic bin width or fixed bin step calculation over filtered latencies.
   - Returns bins with lower/upper bounds, formatted range labels (e.g. `"150 - 175 ms"`), item count, percentage of total valid samples, and a boolean `isPeak` flag indicating the modal peak bin.

---

## 3. Caveats
- **Browser High-Resolution Timer Clamp**: Modern browsers clamp `performance.now()` resolution (typically to 5µs or 100µs depending on cross-origin isolation headers) for security against Spectre attacks. The engine operates on numeric deltas cleanly regardless of browser quantization.
- **Human Reaction vs Display Input Lag**: Physical click reaction times include human nerve signal propagation (~150-250ms) plus hardware display/polling delay (~1-16ms). The engine explicitly isolates the hardware delay penalty component while reporting overall reaction stats.
- **Empty & Edge Case Inputs**: If `latencies` array is empty or contains only invalid/early clicks, the engine must return safe fallback defaults (all stats 0, sampleCount 0, empty or single default bin) without throwing runtime exceptions or returning `NaN`.

---

## 4. Conclusion & Technical Recommendations

### Specified Architecture for `src/engine/InputLagEngine.ts`

```typescript
/**
 * High-Refresh Input Lag & Reflex Reaction Sniper Engine
 * Pure math engine for sub-millisecond flash-to-click latency statistics,
 * polling rate vs refresh rate bottleneck analysis, and reaction time histogram binning.
 */

export type RefreshRate = '60hz' | '120hz' | '144hz' | '240hz' | '360hz' | '540hz';
export type PollingRate = '125hz' | '500hz' | '1000hz' | '2000hz' | '4000hz' | '8000hz';
export type ReactionRating = 'ESPORTS_ELITE' | 'FAST_REFLEX' | 'AVERAGE' | 'SLOW' | 'DELAYED';
export type BottleneckType = 'DISPLAY_LIMITED' | 'POLLING_LIMITED' | 'BALANCED';

export interface ReactionStats {
  meanMs: number;
  medianMs: number;
  minMs: number;
  maxMs: number;
  stdDevMs: number;
  sampleCount: number;
  jitterMs: number;
  rating: ReactionRating;
  ratingLabel: string;
}

export interface BottleneckAnalysis {
  refreshRate: RefreshRate;
  pollingRate: PollingRate;
  refreshRateHz: number;
  pollingRateHz: number;
  frameIntervalMs: number;
  pollingIntervalMs: number;
  avgDisplayFrameDelayMs: number;
  avgPollingDelayMs: number;
  totalBaselineHardwareDelayMs: number;
  maxLatencyJitterMs: number;
  bottleneckType: BottleneckType;
  bottleneckLabel: string;
  bottleneckDescription: string;
  recommendation: string;
}

export interface HistogramBin {
  binIndex: number;
  minMs: number;
  maxMs: number;
  rangeLabel: string;
  count: number;
  percentage: number;
  isPeak: boolean;
}

export interface HistogramResult {
  bins: HistogramBin[];
  totalValidSamples: number;
  modalPeakBinIndex: number;
  binWidthMs: number;
}

export interface HistogramOptions {
  binCount?: number;
  minMs?: number;
  maxMs?: number;
  fixedBinWidthMs?: number;
}

export interface InputLagSummary {
  stats: ReactionStats;
  bottleneck: BottleneckAnalysis;
  histogram: HistogramResult;
}

// Preset helper functions
export function getAllRefreshRates(): RefreshRate[];
export function getAllPollingRates(): PollingRate[];
export function sanitizeRefreshRate(rate: unknown): RefreshRate;
export function sanitizePollingRate(rate: unknown): PollingRate;
export function getRefreshRateHz(rate: unknown): number;
export function getPollingRateHz(rate: unknown): number;
export function getRefreshRateLabel(rate: unknown): string;
export function getPollingRateLabel(rate: unknown): string;
export function getFrameIntervalMs(rate: unknown): number;
export function getPollingIntervalMs(rate: unknown): number;

// Core engine functions
export function calculateLatency(flashTime: number, clickTime: number): number;
export function sanitizeLatencies(latencies: number[], minThresholdMs?: number, maxThresholdMs?: number): number[];
export function calculateReactionStats(latencies: number[], minThresholdMs?: number, maxThresholdMs?: number): ReactionStats;
export function analyzeBottleneck(refreshRate: unknown, pollingRate: unknown): BottleneckAnalysis;
export function calculateHistogramBins(latencies: number[], options?: HistogramOptions): HistogramResult;
export function calculateInputLagSummary(latencies: number[], refreshRate: unknown, pollingRate: unknown, options?: HistogramOptions): InputLagSummary;
```

---

## 5. Verification Method

To verify the engine once implemented by an implementer subagent:
1. **Unit Tests Execution**:
   ```bash
   npm test src/engine/InputLagEngine.test.ts
   ```
2. **Type Check Verification**:
   ```bash
   npx tsc --noEmit
   ```
3. **Full Build & Doc Verification**:
   ```bash
   npm run build
   python3 verify_docs.py
   ```
4. **Invalidation Criteria**:
   - Any `NaN` returned when calling functions with empty arrays `[]` or dirty inputs (`null`, `undefined`, `'invalid'`).
   - Failure to identify `60Hz + 1000Hz` as `'DISPLAY_LIMITED'` or `240Hz + 125Hz` as `'POLLING_LIMITED'`.
   - Inaccurate median or standard deviation calculations.
