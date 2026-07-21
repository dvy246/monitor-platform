# Handoff Report — Milestone 5 Technical Specification: HDR Peak Brightness & Tone Mapping Clipping Engine

## 1. Observation
- **Codebase Directory**: `/Users/divyyadav/newws/monitor_test_hub`
- **Engine Directory**: `src/engine/` containing `InputLagEngine.ts`, `OledBurnInEngine.ts`, `VrrSweepEngine.ts`, `TouchMatrixEngine.ts`, `IccExporter.ts`.
- **Existing Test Execution Verification**: Executed `npx vitest run` with zero failures:
  ```text
  RUN  v4.1.10 /Users/divyyadav/newws/monitor_test_hub
  ✓ src/engine/VrrSweepEngine.stress.test.ts (8 tests)
  ✓ src/engine/IccExporter.test.ts (2 tests)
  ✓ src/engine/VrrSweepEngine.test.ts (18 tests)
  ✓ src/engine/InputLagEngine.test.ts (20 tests)
  ✓ src/engine/OledBurnInEngine.test.ts (10 tests)
  ✓ src/engine/TouchMatrixEngine.test.ts (16 tests)
  ✓ src/engine/InputLagEngine.stress.test.ts (14 tests)
  ✓ src/engine/VrrSweepEngine.perf.test.ts (1 test)
  Test Files  8 passed (8)
  Tests  89 passed (89)
  ```
- **Architectural Requirements (`PROJECT.md` & `AGENTS.md`)**:
  - Pure TypeScript calculation engines placed in `src/engine/` without direct DOM dependencies (lines 10-12 in `PROJECT.md`).
  - Standardized interface contracts, pure math functions, string/number sanitizer helpers with safe edge-case defaults, and 100% Vitest coverage (lines 29-33 in `PROJECT.md`).

## 2. Logic Chain
1. Existing engines in `src/engine/` follow a uniform design pattern: explicit TypeScript type exports, config mappings (`Record<Type, Config>`), string/number sanitizers, edge-case safe calculation functions, and companion `*.test.ts` suites.
2. `HdrTestEngine.ts` must implement:
   - **SMPTE ST 2084 Perceptual Quantizer (PQ) EOTF & Inverse EOTF Math**:
     - Standardized constants:
       $$m_1 = \frac{2610}{16384} = 0.1593017578125$$
       $$m_2 = \frac{2523}{32} = 78.84375$$
       $$c_1 = \frac{3424}{4096} = 0.8359375$$
       $$c_2 = \frac{2413}{128} = 18.8515625$$
       $$c_3 = \frac{2392}{128} = 18.6875$$
       Reference Luminance: $L_{\text{ref}} = 10000.0$ nits.
     - Forward EOTF (Nits $\to$ PQ Signal $E' \in [0.0, 1.0]$):
       $$Y = \frac{\text{clamp}(N, 0, 10000)}{10000.0}$$
       $$E' = \left( \frac{c_1 + c_2 \cdot Y^{m_1}}{1 + c_3 \cdot Y^{m_1}} \right)^{m_2}$$
     - Inverse EOTF (PQ Signal $E' \in [0.0, 1.0] \to$ Nits $N$):
       $$Y = \left( \frac{\max\left(0, (E')^{1/m_2} - c_1\right)}{c_2 - c_3 \cdot (E')^{1/m_2}} \right)^{1/m_1}$$
       $$N = Y \times 10000.0$$
   - **10-Bit RGB Signal & Step Gradient Calculations**:
     - 10-bit integer level $D_{10} = \text{round}(E' \times 1023)$.
     - Normalized step gradient generator for $K$ steps (e.g. 16, 32, 64 steps) spanning target nit range (100 to 4000 nits).
   - **Tone Mapping Roll-Off Simulation**:
     - `hgig`: Hard clip at display peak brightness $N_{\text{peak}}$.
     - `static`: Linear 1:1 up to knee point $N_{\text{knee}} = 0.65 \times N_{\text{peak}}$, then quadratic soft-knee curve up to content max $N_{\text{content\_max}}$.
     - `dynamic`: Scene APL-adaptive knee point moving from $0.85 \times N_{\text{peak}}$ (at 1% APL) down to $0.40 \times N_{\text{peak}}$ (at 100% APL).
   - **Clipping Nits Threshold Calculation**:
     - Evaluates input luminance levels (100 to 4000 nits) to isolate the exact point where output reaches $\ge 99.5\%$ of display peak capability.
   - **Auto Brightness Limiter (ABL) Window Calculations**:
     - Evaluates brightness drop across 1%, 5%, 10%, 25%, and 100% APL window sizes for 5 display panel technologies (`qd-oled`, `woled`, `woled-mla`, `mini-led-fald`, `edge-lit-lcd`).

## 3. Caveats
- Display devices vary in hardware-level tone mapping curves depending on user settings (e.g., HGIG mode vs Dynamic Tone Mapping ON). The engine models all 3 standardized industry modes (`hgig`, `static`, `dynamic`).
- Web browsers translate 10-bit PQ signal values to screen pixel values via sRGB/Display P3 or HDR canvas contexts; `HdrTestEngine` supplies normalized PQ floats and 10-bit code values ($0..1023$) for rendering.

## 4. Conclusion & Technical Specifications

### Proposed `src/engine/HdrTestEngine.ts` Specification
```typescript
/**
 * Display HDR Peak Brightness & Tone Mapping Clipping Engine
 * Pure math engine for PQ Curve (SMPTE ST 2084) EOTF conversions, 10-bit RGB color step calculation,
 * clipping nits threshold evaluation (100 to 4000 nits), tone mapping roll-off simulation (HGIG, static, dynamic),
 * and Auto Brightness Limiter (ABL) window size brightness calculations.
 */

export type ToneMappingMode = 'hgig' | 'static' | 'dynamic';
export type HdrPanelType = 'qd-oled' | 'woled' | 'woled-mla' | 'mini-led-fald' | 'edge-lit-lcd';
export type PeakNitsPreset = 400 | 600 | 1000 | 1400 | 2000 | 4000;
export type AplWindowPct = 1 | 5 | 10 | 25 | 100;

export interface PqConversionResult {
  nits: number;
  pqSignal: number; // Normalized 0.0 to 1.0
  code10Bit: number; // Integer 0 to 1023
  code8Bit: number; // Integer 0 to 255
  normalizedRgb: [number, number, number];
  hexColor: string;
}

export interface ColorStepInfo {
  stepIndex: number;
  totalSteps: number;
  targetNits: number;
  effectiveNits: number;
  pqSignal: number;
  code10Bit: number;
  isClipped: boolean;
  hexColor: string;
}

export interface ToneMapResult {
  inputNits: number;
  outputNits: number;
  inputPqSignal: number;
  outputPqSignal: number;
  outputCode10Bit: number;
  kneeNits: number;
  isClipped: boolean;
  compressionRatioPct: number;
}

export interface ClippingThresholdResult {
  displayPeakNits: number;
  contentMaxNits: number;
  toneMappingMode: ToneMappingMode;
  clippingNitsThreshold: number;
  clippingPqSignal: number;
  clippingCode10Bit: number;
  headroomPct: number;
  clippingCategory: 'EARLY_CLIPPING' | 'ACCURATE_MATCH' | 'HIGH_HEADROOM';
}

export interface AblWindowBrightness {
  windowPct: AplWindowPct;
  sustainedNits: number;
  relativeBrightnessPct: number; // Relative to 10% peak
  ablThermalRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface HdrAnalysisSummary {
  displayPeakNits: number;
  contentMaxNits: number;
  toneMappingMode: ToneMappingMode;
  panelType: HdrPanelType;
  clipping: ClippingThresholdResult;
  colorSteps: ColorStepInfo[];
  ablWindows: AblWindowBrightness[];
}

// --- SMPTE ST 2084 PQ Constants ---
export const PQ_M1 = 2610 / 16384; // 0.1593017578125
export const PQ_M2 = (2523 / 4096) * 128; // 78.84375
export const PQ_C1 = 3424 / 4096; // 0.8359375
export const PQ_C2 = (2413 / 4096) * 32; // 18.8515625
export const PQ_C3 = (2392 / 4096) * 32; // 18.6875
export const PQ_MAX_NITS = 10000.0;

export const PEAK_NITS_PRESETS: PeakNitsPreset[] = [400, 600, 1000, 1400, 2000, 4000];
export const TONE_MAPPING_MODES: ToneMappingMode[] = ['hgig', 'static', 'dynamic'];
export const HDR_PANEL_TYPES: HdrPanelType[] = ['qd-oled', 'woled', 'woled-mla', 'mini-led-fald', 'edge-lit-lcd'];
export const APL_WINDOWS: AplWindowPct[] = [1, 5, 10, 25, 100];

/**
 * Sanitizes input luminance nits into valid range [0, 10000]
 */
export function sanitizeNits(nits: unknown, defaultNits = 1000): number {
  if (typeof nits === 'number' && Number.isFinite(nits)) {
    return Math.max(0, Math.min(PQ_MAX_NITS, nits));
  }
  if (typeof nits === 'string') {
    const parsed = parseFloat(nits);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(PQ_MAX_NITS, parsed));
    }
  }
  return defaultNits;
}

/**
 * Sanitizes tone mapping mode
 */
export function sanitizeToneMappingMode(mode: unknown): ToneMappingMode {
  if (typeof mode === 'string') {
    const normalized = mode.trim().toLowerCase() as ToneMappingMode;
    if (TONE_MAPPING_MODES.includes(normalized)) return normalized;
  }
  return 'hgig';
}

/**
 * Sanitizes HDR panel type
 */
export function sanitizeHdrPanelType(panel: unknown): HdrPanelType {
  if (typeof panel === 'string') {
    const normalized = panel.trim().toLowerCase() as HdrPanelType;
    if (HDR_PANEL_TYPES.includes(normalized)) return normalized;
  }
  return 'qd-oled';
}

/**
 * Forward EOTF: Converts absolute luminance in nits to normalized PQ signal value E' [0.0, 1.0]
 */
export function nitsToPqSignal(nits: number): number {
  const safeNits = Math.max(0, Math.min(PQ_MAX_NITS, Number.isFinite(nits) ? nits : 0));
  if (safeNits <= 0) return 0.0;
  
  const Y = safeNits / PQ_MAX_NITS;
  const Ym1 = Math.pow(Y, PQ_M1);
  const num = PQ_C1 + PQ_C2 * Ym1;
  const den = 1.0 + PQ_C3 * Ym1;
  const pqSignal = Math.pow(num / den, PQ_M2);
  
  return Math.max(0.0, Math.min(1.0, Number.isFinite(pqSignal) ? pqSignal : 0.0));
}

/**
 * Inverse EOTF: Converts normalized PQ signal value E' [0.0, 1.0] back to luminance in nits
 */
export function pqSignalToNits(pqSignal: number): number {
  const safeSignal = Math.max(0.0, Math.min(1.0, Number.isFinite(pqSignal) ? pqSignal : 0.0));
  if (safeSignal <= 0.0) return 0.0;
  if (safeSignal >= 1.0) return PQ_MAX_NITS;

  const Em2 = Math.pow(safeSignal, 1.0 / PQ_M2);
  const num = Math.max(0.0, Em2 - PQ_C1);
  const den = PQ_C2 - PQ_C3 * Em2;
  if (den <= 0) return PQ_MAX_NITS;

  const Y = Math.pow(num / den, 1.0 / PQ_M1);
  const nits = Y * PQ_MAX_NITS;

  return Math.max(0.0, Math.min(PQ_MAX_NITS, Number.isFinite(nits) ? nits : 0.0));
}

/**
 * Converts luminance nits to 10-bit code value (0 to 1023) and color metadata
 */
export function nitsTo10BitColor(nits: number): PqConversionResult {
  const safeNits = sanitizeNits(nits);
  const pqSignal = nitsToPqSignal(safeNits);
  const code10Bit = Math.round(pqSignal * 1023.0);
  const code8Bit = Math.round(pqSignal * 255.0);

  const hexVal = Math.min(255, Math.max(0, code8Bit)).toString(16).padStart(2, '0');
  const hexColor = `#${hexVal}${hexVal}${hexVal}`;

  return {
    nits: Number(safeNits.toFixed(2)),
    pqSignal: Number(pqSignal.toFixed(6)),
    code10Bit: Math.min(1023, Math.max(0, code10Bit)),
    code8Bit: Math.min(255, Math.max(0, code8Bit)),
    normalizedRgb: [pqSignal, pqSignal, pqSignal],
    hexColor
  };
}

/**
 * Simulates tone mapping roll-off for a given input luminance (nits)
 */
export function simulateToneMap(
  inputNits: number,
  displayPeakNits: number,
  contentMaxNits = 4000,
  mode: ToneMappingMode = 'hgig',
  aplPct = 10
): ToneMapResult {
  const safeIn = sanitizeNits(inputNits);
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeContentMax = Math.max(safePeak, sanitizeNits(contentMaxNits, 4000));
  const safeMode = sanitizeToneMappingMode(mode);
  const safeApl = Math.max(1, Math.min(100, Number.isFinite(aplPct) ? aplPct : 10));

  let kneeNits = safePeak;
  let outputNits = safeIn;

  if (safeMode === 'hgig') {
    // Hard-clip at display peak nits
    kneeNits = safePeak;
    outputNits = Math.min(safeIn, safePeak);
  } else if (safeMode === 'static') {
    // Static soft-knee roll-off starting at 65% of display peak nits
    kneeNits = safePeak * 0.65;
    if (safeIn <= kneeNits) {
      outputNits = safeIn;
    } else {
      const t = Math.min(1.0, (safeIn - kneeNits) / Math.max(1, safeContentMax - kneeNits));
      const compressionFactor = t * (1.0 - 0.5 * t); // Smooth quadratic curve
      outputNits = kneeNits + compressionFactor * (safePeak - kneeNits);
    }
  } else {
    // Dynamic APL-adaptive tone mapping curve
    const aplFactor = safeApl / 100.0;
    const adaptiveKneeRatio = 0.85 - 0.45 * aplFactor; // 0.85 at 1% APL, 0.40 at 100% APL
    kneeNits = safePeak * adaptiveKneeRatio;
    if (safeIn <= kneeNits) {
      outputNits = safeIn;
    } else {
      const t = Math.min(1.0, (safeIn - kneeNits) / Math.max(1, safeContentMax - kneeNits));
      const dynamicRollOff = (1.0 - Math.exp(-2.0 * t)) / (1.0 - Math.exp(-2.0));
      outputNits = kneeNits + dynamicRollOff * (safePeak - kneeNits);
    }
  }

  outputNits = Math.min(safePeak, Math.max(0, outputNits));

  const inputPqSignal = nitsToPqSignal(safeIn);
  const outputPqSignal = nitsToPqSignal(outputNits);
  const outputCode10Bit = Math.round(outputPqSignal * 1023.0);
  const isClipped = outputNits >= safePeak * 0.995;

  const compressionRatioPct = safeIn > 0 
    ? Number((((safeIn - outputNits) / safeIn) * 100).toFixed(1))
    : 0;

  return {
    inputNits: Number(safeIn.toFixed(2)),
    outputNits: Number(outputNits.toFixed(2)),
    inputPqSignal: Number(inputPqSignal.toFixed(6)),
    outputPqSignal: Number(outputPqSignal.toFixed(6)),
    outputCode10Bit,
    kneeNits: Number(kneeNits.toFixed(2)),
    isClipped,
    compressionRatioPct
  };
}

/**
 * Calculates tone mapping clipping nits threshold
 */
export function calculateClippingThreshold(
  displayPeakNits: number,
  contentMaxNits = 4000,
  mode: ToneMappingMode = 'hgig'
): ClippingThresholdResult {
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeContentMax = Math.max(safePeak, sanitizeNits(contentMaxNits, 4000));
  const safeMode = sanitizeToneMappingMode(mode);

  let clippingNitsThreshold = safePeak;
  if (safeMode === 'static') {
    clippingNitsThreshold = safeContentMax * 0.95;
  } else if (safeMode === 'dynamic') {
    clippingNitsThreshold = safeContentMax * 0.90;
  } else {
    clippingNitsThreshold = safePeak;
  }

  const clippingPqSignal = nitsToPqSignal(clippingNitsThreshold);
  const clippingCode10Bit = Math.round(clippingPqSignal * 1023.0);
  const headroomPct = Number((((safeContentMax - clippingNitsThreshold) / safeContentMax) * 100).toFixed(1));

  let clippingCategory: ClippingThresholdResult['clippingCategory'] = 'ACCURATE_MATCH';
  if (clippingNitsThreshold < safePeak * 0.9) {
    clippingCategory = 'EARLY_CLIPPING';
  } else if (clippingNitsThreshold > safePeak * 1.5) {
    clippingCategory = 'HIGH_HEADROOM';
  }

  return {
    displayPeakNits: safePeak,
    contentMaxNits: safeContentMax,
    toneMappingMode: safeMode,
    clippingNitsThreshold: Number(clippingNitsThreshold.toFixed(2)),
    clippingPqSignal: Number(clippingPqSignal.toFixed(6)),
    clippingCode10Bit,
    headroomPct,
    clippingCategory
  };
}

/**
 * Generates N discrete 10-bit color gradient steps from min to max nits
 */
export function calculateColorSteps(
  displayPeakNits: number,
  stepCount = 16,
  mode: ToneMappingMode = 'hgig',
  maxNits = 4000
): ColorStepInfo[] {
  const count = Math.max(2, Math.min(64, stepCount));
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeMax = Math.max(safePeak, sanitizeNits(maxNits, 4000));

  const steps: ColorStepInfo[] = [];
  const startPq = nitsToPqSignal(100);
  const endPq = nitsToPqSignal(safeMax);

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const stepPq = startPq + t * (endPq - startPq);
    const targetNits = pqSignalToNits(stepPq);

    const tmResult = simulateToneMap(targetNits, safePeak, safeMax, mode);
    const colorInfo = nitsTo10BitColor(tmResult.outputNits);

    steps.push({
      stepIndex: i,
      totalSteps: count,
      targetNits: Number(targetNits.toFixed(2)),
      effectiveNits: tmResult.outputNits,
      pqSignal: tmResult.outputPqSignal,
      code10Bit: tmResult.outputCode10Bit,
      isClipped: tmResult.isClipped,
      hexColor: colorInfo.hexColor
    });
  }

  return steps;
}

/**
 * Computes Auto Brightness Limiter (ABL) luminance across window sizes (1%, 5%, 10%, 25%, 100%)
 */
export function calculateAblWindows(
  displayPeakNits: number,
  panelType: HdrPanelType = 'qd-oled'
): AblWindowBrightness[] {
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safePanel = sanitizeHdrPanelType(panelType);

  const panelParams: Record<HdrPanelType, { alpha: number; beta: number; smallWindowBoost: number }> = {
    'qd-oled': { alpha: 0.45, beta: 0.25, smallWindowBoost: 0.15 },
    'woled': { alpha: 0.50, beta: 0.18, smallWindowBoost: 0.20 },
    'woled-mla': { alpha: 0.48, beta: 0.20, smallWindowBoost: 0.25 },
    'mini-led-fald': { alpha: 0.20, beta: 0.55, smallWindowBoost: 0.10 },
    'edge-lit-lcd': { alpha: 0.05, beta: 0.85, smallWindowBoost: 0.02 }
  };

  const { alpha, beta, smallWindowBoost } = panelParams[safePanel];

  return APL_WINDOWS.map((win) => {
    let sustainedNits = safePeak;

    if (win <= 10) {
      const boostFactor = 1.0 + smallWindowBoost * ((10 - win) / 9.0);
      sustainedNits = safePeak * boostFactor;
    } else {
      const x = (win - 10) / 90.0;
      const decayFactor = beta + (1.0 - beta) * Math.pow(1.0 - x, alpha);
      sustainedNits = safePeak * decayFactor;
    }

    sustainedNits = Math.max(50, Number(sustainedNits.toFixed(2)));
    const relativeBrightnessPct = Number(((sustainedNits / safePeak) * 100).toFixed(1));

    let ablThermalRisk: AblWindowBrightness['ablThermalRisk'] = 'LOW';
    if (relativeBrightnessPct < 30) {
      ablThermalRisk = 'CRITICAL';
    } else if (relativeBrightnessPct < 50) {
      ablThermalRisk = 'HIGH';
    } else if (relativeBrightnessPct < 80) {
      ablThermalRisk = 'MODERATE';
    }

    return {
      windowPct: win,
      sustainedNits,
      relativeBrightnessPct,
      ablThermalRisk
    };
  });
}

/**
 * Calculates complete HDR analysis summary
 */
export function calculateHdrSummary(
  displayPeakNits: number,
  contentMaxNits = 4000,
  toneMappingMode: ToneMappingMode = 'hgig',
  panelType: HdrPanelType = 'qd-oled'
): HdrAnalysisSummary {
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeContentMax = Math.max(safePeak, sanitizeNits(contentMaxNits, 4000));
  const safeMode = sanitizeToneMappingMode(toneMappingMode);
  const safePanel = sanitizeHdrPanelType(panelType);

  return {
    displayPeakNits: safePeak,
    contentMaxNits: safeContentMax,
    toneMappingMode: safeMode,
    panelType: safePanel,
    clipping: calculateClippingThreshold(safePeak, safeContentMax, safeMode),
    colorSteps: calculateColorSteps(safePeak, 16, safeMode, safeContentMax),
    ablWindows: calculateAblWindows(safePeak, safePanel)
  };
}
```

### Proposed `src/engine/HdrTestEngine.test.ts` Specification
```typescript
import { describe, it, expect } from 'vitest';
import {
  nitsToPqSignal,
  pqSignalToNits,
  nitsTo10BitColor,
  simulateToneMap,
  calculateClippingThreshold,
  calculateColorSteps,
  calculateAblWindows,
  calculateHdrSummary,
  sanitizeNits,
  sanitizeToneMappingMode,
  sanitizeHdrPanelType,
  PEAK_NITS_PRESETS,
  TONE_MAPPING_MODES,
  HDR_PANEL_TYPES,
  APL_WINDOWS
} from './HdrTestEngine';

describe('HdrTestEngine', () => {
  describe('PQ Curve (SMPTE ST 2084) EOTF Calculations', () => {
    it('correctly maps 0 nits to signal 0.0 and 10,000 nits to signal 1.0', () => {
      expect(nitsToPqSignal(0)).toBe(0.0);
      expect(nitsToPqSignal(10000)).toBe(1.0);
      expect(pqSignalToNits(0.0)).toBe(0.0);
      expect(pqSignalToNits(1.0)).toBe(10000);
    });

    it('round-trips nits to PQ signal and back accurately', () => {
      const testNits = [100, 400, 600, 1000, 1400, 2000, 4000];
      testNits.forEach((nits) => {
        const pq = nitsToPqSignal(nits);
        const restoredNits = pqSignalToNits(pq);
        expect(restoredNits).toBeCloseTo(nits, 1);
      });
    });

    it('calculates 10-bit code values within 0..1023', () => {
      const color1000 = nitsTo10BitColor(1000);
      expect(color1000.code10Bit).toBeGreaterThan(0);
      expect(color1000.code10Bit).toBeLessThan(1023);

      const color10k = nitsTo10BitColor(10000);
      expect(color10k.code10Bit).toBe(1023);

      const color0 = nitsTo10BitColor(0);
      expect(color0.code10Bit).toBe(0);
    });
  });

  describe('Tone Mapping Simulation', () => {
    it('performs HGIG hard-clipping accurately at peak nits', () => {
      const underPeak = simulateToneMap(800, 1000, 4000, 'hgig');
      expect(underPeak.outputNits).toBe(800);
      expect(underPeak.isClipped).toBe(false);

      const overPeak = simulateToneMap(1500, 1000, 4000, 'hgig');
      expect(overPeak.outputNits).toBe(1000);
      expect(overPeak.isClipped).toBe(true);
    });

    it('applies soft-knee roll-off in static tone mapping mode', () => {
      const staticResult = simulateToneMap(1500, 1000, 4000, 'static');
      expect(staticResult.outputNits).toBeLessThan(1000);
      expect(staticResult.outputNits).toBeGreaterThan(650);
      expect(staticResult.kneeNits).toBe(650);
    });

    it('modulates knee point in dynamic tone mapping mode based on APL', () => {
      const darkScene = simulateToneMap(1500, 1000, 4000, 'dynamic', 5);
      const brightScene = simulateToneMap(1500, 1000, 4000, 'dynamic', 80);
      expect(darkScene.kneeNits).toBeGreaterThan(brightScene.kneeNits);
    });
  });

  describe('Clipping Threshold & Step Gradient Calculations', () => {
    it('calculates clipping thresholds for HGIG and soft curves', () => {
      const hgigClip = calculateClippingThreshold(1000, 4000, 'hgig');
      expect(hgigClip.clippingNitsThreshold).toBe(1000);

      const staticClip = calculateClippingThreshold(1000, 4000, 'static');
      expect(staticClip.clippingNitsThreshold).toBeGreaterThan(1000);
    });

    it('generates specified number of 10-bit color gradient steps', () => {
      const steps = calculateColorSteps(1000, 16, 'hgig', 4000);
      expect(steps).toHaveLength(16);
      expect(steps[0].targetNits).toBeCloseTo(100, 0);
      expect(steps[15].isClipped).toBe(true);
    });
  });

  describe('ABL Window Luminance Calculation', () => {
    it('calculates ABL decay across 1%, 5%, 10%, 25%, 100% windows', () => {
      const qdOledAbl = calculateAblWindows(1000, 'qd-oled');
      expect(qdOledAbl).toHaveLength(5);
      
      const win1 = qdOledAbl.find((w) => w.windowPct === 1);
      const win100 = qdOledAbl.find((w) => w.windowPct === 100);

      expect(win1?.sustainedNits).toBeGreaterThan(1000);
      expect(win100?.sustainedNits).toBeLessThan(400);
      expect(win100?.ablThermalRisk).toBe('CRITICAL');
    });

    it('reflects higher sustained brightness on Mini-LED FALD panels', () => {
      const miniLedAbl = calculateAblWindows(1000, 'mini-led-fald');
      const win100 = miniLedAbl.find((w) => w.windowPct === 100);
      expect(win100?.sustainedNits).toBeGreaterThan(500);
    });
  });

  describe('Edge Case Safety & Sanitizers', () => {
    it('handles NaN, Infinity, negative, and invalid string inputs gracefully', () => {
      expect(sanitizeNits(NaN)).toBe(1000);
      expect(sanitizeNits(-500)).toBe(0);
      expect(sanitizeNits(20000)).toBe(10000);
      expect(sanitizeToneMappingMode('invalid-mode')).toBe('hgig');
      expect(sanitizeHdrPanelType('unknown-panel')).toBe('qd-oled');

      const summary = calculateHdrSummary(NaN as any, NaN as any, 'invalid' as any, 'invalid' as any);
      expect(summary.displayPeakNits).toBe(1000);
      expect(summary.clipping.clippingCode10Bit).toBeGreaterThan(0);
    });

    it('exports all standard preset arrays', () => {
      expect(PEAK_NITS_PRESETS).toEqual([400, 600, 1000, 1400, 2000, 4000]);
      expect(TONE_MAPPING_MODES).toEqual(['hgig', 'static', 'dynamic']);
      expect(HDR_PANEL_TYPES).toEqual(['qd-oled', 'woled', 'woled-mla', 'mini-led-fald', 'edge-lit-lcd']);
      expect(APL_WINDOWS).toEqual([1, 5, 10, 25, 100]);
    });
  });
});
```

## 5. Verification Method
1. Verify existing vitest suite: `npx vitest run` inside `/Users/divyyadav/newws/monitor_test_hub`.
2. Once implementer agent creates `src/engine/HdrTestEngine.ts` and `src/engine/HdrTestEngine.test.ts`, run target test command:
   `npx vitest run src/engine/HdrTestEngine.test.ts`
3. Invalidation Conditions: Failure of any test case, NaN output from EOTF formulas, or incorrect ABL window percentages.
