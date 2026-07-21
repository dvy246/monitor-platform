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
  sanitizeToneMapping,
  sanitizeToneMappingMode,
  sanitizeHdrPanelType,
  sanitizePeakNits,
  PQ_M1,
  PQ_M2,
  PQ_C1,
  PQ_C2,
  PQ_C3,
  PQ_MAX_NITS,
  HDR_PANEL_TYPES,
  TONE_MAPPING_MODES,
  APL_WINDOWS
} from './HdrTestEngine';

describe('HdrTestEngine Empirical Stress Test Suite', () => {
  describe('1. PQ EOTF (SMPTE ST 2084) Math Formulas & Precision', () => {
    it('matches official SMPTE ST 2084 constants exactly', () => {
      expect(PQ_M1).toBe(2610 / 16384);
      expect(PQ_M2).toBe(2523 / 32);
      expect(PQ_C1).toBe(3424 / 4096);
      expect(PQ_C2).toBe(2413 / 128);
      expect(PQ_C3).toBe(2392 / 128);
      expect(PQ_MAX_NITS).toBe(10000.0);
    });

    it('matches reference PQ signal values for key luminance levels', () => {
      // Reference PQ values (SMPTE ST 2084 exact values)
      // 0 nits -> 0.0
      // 100 nits -> ~0.508078
      // 1000 nits -> ~0.751827
      // 4000 nits -> ~0.902572
      // 10000 nits -> 1.0
      expect(nitsToPqSignal(0)).toBe(0.0);
      expect(nitsToPqSignal(100)).toBeCloseTo(0.508078, 5);
      expect(nitsToPqSignal(1000)).toBeCloseTo(0.751827, 5);
      expect(nitsToPqSignal(4000)).toBeCloseTo(0.902572, 5);
      expect(nitsToPqSignal(10000)).toBe(1.0);
    });

    it('maintains strict forward monotonicity from 0 to 10,000 nits', () => {
      const stepCount = 1000;
      let prevPq = -1;
      for (let i = 0; i <= stepCount; i++) {
        const nits = (i / stepCount) * PQ_MAX_NITS;
        const pq = nitsToPqSignal(nits);
        expect(pq).toBeGreaterThanOrEqual(prevPq);
        expect(pq).toBeGreaterThanOrEqual(0.0);
        expect(pq).toBeLessThanOrEqual(1.0);
        prevPq = pq;
      }
    });

    it('maintains strict inverse monotonicity from 0.0 to 1.0 PQ signal', () => {
      const stepCount = 1000;
      let prevNits = -1;
      for (let i = 0; i <= stepCount; i++) {
        const pq = i / stepCount;
        const nits = pqSignalToNits(pq);
        expect(nits).toBeGreaterThanOrEqual(prevNits);
        expect(nits).toBeGreaterThanOrEqual(0.0);
        expect(nits).toBeLessThanOrEqual(PQ_MAX_NITS);
        prevNits = nits;
      }
    });

    it('achieves accurate roundtrip mapping across 10,000 luminance test points', () => {
      const testCount = 10000;
      for (let i = 1; i <= testCount; i++) {
        const originalNits = (i / testCount) * PQ_MAX_NITS;
        const pqSignal = nitsToPqSignal(originalNits);
        const restoredNits = pqSignalToNits(pqSignal);
        
        // Assert roundtrip error is under 0.05 nits for luminance >= 0.1 nits
        const delta = Math.abs(restoredNits - originalNits);
        if (originalNits >= 0.1) {
          expect(delta).toBeLessThan(0.05);
        }
      }
    });

    it('handles numerical extreme inputs (NaN, Infinity, negative, subnormal)', () => {
      expect(nitsToPqSignal(NaN)).toBe(0.0);
      expect(nitsToPqSignal(-Infinity)).toBe(0.0);
      // NOTE: Number.isFinite(Infinity) is false, so nitsToPqSignal(Infinity) falls back to 0.0 instead of 1.0.
      expect(nitsToPqSignal(Infinity)).toBe(0.0);
      expect(nitsToPqSignal(-99999)).toBe(0.0);
      expect(nitsToPqSignal(1e-15)).toBeGreaterThanOrEqual(0.0);

      expect(pqSignalToNits(NaN)).toBe(0.0);
      expect(pqSignalToNits(-Infinity)).toBe(0.0);
      expect(pqSignalToNits(Infinity)).toBe(0.0);
      expect(pqSignalToNits(-0.5)).toBe(0.0);
      expect(pqSignalToNits(1.5)).toBe(10000.0);
    });
  });

  describe('2. 10-Bit Color Step & Code Value Calculations', () => {
    it('maps nits to valid integer 10-bit (0..1023) and 8-bit (0..255) color metadata', () => {
      const inputs = [0, 0.01, 1, 10, 100, 400, 600, 1000, 1400, 2000, 4000, 10000];
      for (const nits of inputs) {
        const result = nitsTo10BitColor(nits);
        expect(Number.isInteger(result.code10Bit)).toBe(true);
        expect(result.code10Bit).toBeGreaterThanOrEqual(0);
        expect(result.code10Bit).toBeLessThanOrEqual(1023);

        expect(Number.isInteger(result.code8Bit)).toBe(true);
        expect(result.code8Bit).toBeGreaterThanOrEqual(0);
        expect(result.code8Bit).toBeLessThanOrEqual(255);

        expect(result.hexColor).toMatch(/^#[0-9a-f]{6}$/i);
        expect(result.normalizedRgb.length).toBe(3);
        expect(result.normalizedRgb[0]).toBe(result.normalizedRgb[1]);
        expect(result.normalizedRgb[1]).toBe(result.normalizedRgb[2]);
      }
    });

    it('clamps stepCount in calculateColorSteps between 2 and 64', () => {
      const stepsUnder = calculateColorSteps(1000, -10, 'hgig', 4000);
      expect(stepsUnder.length).toBe(2);

      const stepsOver = calculateColorSteps(1000, 1000, 'hgig', 4000);
      expect(stepsOver.length).toBe(64);
    });

    it('demonstrates step generator behavior when displayPeakNits < 100 nits', () => {
      // NOTE: calculateColorSteps hardcodes startPq = nitsToPqSignal(100).
      // When displayPeakNits = 50 and maxNits = 50, startPq (100 nits) > endPq (50 nits),
      // causing targetNits to decrease from 100 nits down to 50 nits.
      const stepsLowPeak = calculateColorSteps(50, 10, 'hgig', 50);
      expect(stepsLowPeak.length).toBe(10);
      expect(stepsLowPeak[0].targetNits).toBeCloseTo(100, 1);
      expect(stepsLowPeak[9].targetNits).toBeCloseTo(50, 1);
    });
  });

  describe('3. Tone Mapping Roll-Off Curves (HGIG, Static, Dynamic, Clip)', () => {
    it('evaluates HGIG and Clip hard-clipping behavior accurately', () => {
      const hgigUnder = simulateToneMap(500, 1000, 4000, 'hgig');
      expect(hgigUnder.outputNits).toBe(500);
      expect(hgigUnder.isClipped).toBe(false);

      const hgigOver = simulateToneMap(1200, 1000, 4000, 'hgig');
      expect(hgigOver.outputNits).toBe(1000);
      expect(hgigOver.isClipped).toBe(true);

      const clipOver = simulateToneMap(3000, 1000, 4000, 'clip');
      expect(clipOver.outputNits).toBe(1000);
      expect(clipOver.isClipped).toBe(true);
    });

    it('highlights isClipped threshold artifact at 99.5% of peak in HGIG mode', () => {
      // In HGIG mode, safeIn = 996 on a 1000 nit peak display is uncompressed (output = 996).
      // However, outputNits (996) >= 1000 * 0.995 (995), so isClipped returns true even though safeIn <= safePeak!
      const unclippedNearPeak = simulateToneMap(996, 1000, 4000, 'hgig');
      expect(unclippedNearPeak.outputNits).toBe(996);
      expect(unclippedNearPeak.isClipped).toBe(true); // Demonstrates 99.5% threshold edge case
    });

    it('empirically reveals Static mode maximum output luminance truncation flaw', () => {
      // Math breakdown of static mode in HdrTestEngine.ts:
      // kneeNits = displayPeakNits * 0.65 (e.g. 650 nits for 1000 nits peak).
      // t = (inputNits - kneeNits) / (contentMaxNits - kneeNits)
      // compressionFactor = t * (1.0 - 0.5 * t)
      // When inputNits = contentMaxNits (4000 nits), t = 1.0, compressionFactor = 0.5.
      // outputNits = kneeNits + 0.5 * (displayPeakNits - kneeNits)
      // For 1000 nits peak: outputNits = 650 + 0.5 * 350 = 825 nits!
      // This caps the maximum achievable output nits at 82.5% of the display's peak capacity!
      const staticAtMax = simulateToneMap(4000, 1000, 4000, 'static');
      expect(staticAtMax.outputNits).toBe(825.0);
      expect(staticAtMax.outputNits).toBeLessThan(1000);

      // Even at 10,000 nits input, output remains capped at 825 nits
      const staticAt10k = simulateToneMap(10000, 1000, 4000, 'static');
      expect(staticAt10k.outputNits).toBe(825.0);
    });

    it('verifies Dynamic mode APL adaptive knee shift and full peak utilization', () => {
      const darkScene = simulateToneMap(2000, 1000, 4000, 'dynamic', 1);
      const brightScene = simulateToneMap(2000, 1000, 4000, 'dynamic', 100);

      // 1% APL yields higher knee point (lower compression) than 100% APL
      expect(darkScene.kneeNits).toBeGreaterThan(brightScene.kneeNits);
      expect(darkScene.kneeNits).toBeCloseTo(845.5, 1); // 1000 * (0.85 - 0.45 * 0.01)
      expect(brightScene.kneeNits).toBeCloseTo(400.0, 1); // 1000 * (0.85 - 0.45 * 1.00)

      // Dynamic mode reaches full display peak (1000 nits) at contentMaxNits
      const dynamicAtMax = simulateToneMap(4000, 1000, 4000, 'dynamic', 10);
      expect(dynamicAtMax.outputNits).toBe(1000.0);
      expect(dynamicAtMax.isClipped).toBe(true);
    });

    it('maintains non-decreasing output nits across input luminance sweep for all modes', () => {
      for (const mode of TONE_MAPPING_MODES) {
        let prevOutput = -1;
        for (let input = 0; input <= 4000; input += 50) {
          const res = simulateToneMap(input, 1000, 4000, mode, 10);
          expect(res.outputNits).toBeGreaterThanOrEqual(prevOutput);
          expect(res.outputNits).toBeLessThanOrEqual(1000);
          prevOutput = res.outputNits;
        }
      }
    });

    it('handles negative or out-of-bound APL percentages gracefully', () => {
      const aplNeg = simulateToneMap(1500, 1000, 4000, 'dynamic', -50);
      const apl1 = simulateToneMap(1500, 1000, 4000, 'dynamic', 1);
      expect(aplNeg.kneeNits).toBe(apl1.kneeNits);

      const aplExcess = simulateToneMap(1500, 1000, 4000, 'dynamic', 500);
      const apl100 = simulateToneMap(1500, 1000, 4000, 'dynamic', 100);
      expect(aplExcess.kneeNits).toBe(apl100.kneeNits);
    });
  });

  describe('4. Clipping Threshold & Category Evaluation', () => {
    it('calculates expected clipping threshold and category for HGIG mode', () => {
      const hgigNormal = calculateClippingThreshold(1000, 4000, 'hgig');
      expect(hgigNormal.clippingNitsThreshold).toBe(1000);
      expect(hgigNormal.clippingCategory).toBe('ACCURATE_MATCH');
      expect(hgigNormal.headroomPct).toBe(75.0); // (4000 - 1000) / 4000 * 100
    });

    it('categorizes EARLY_CLIPPING when threshold < 90% of display peak', () => {
      const early = calculateClippingThreshold(1000, 800, 'hgig');
      expect(early.clippingNitsThreshold).toBe(800);
      expect(early.clippingCategory).toBe('EARLY_CLIPPING');
    });

    it('categorizes HIGH_HEADROOM when threshold > 150% of display peak', () => {
      const highHeadroom = calculateClippingThreshold(1000, 4000, 'static');
      // static threshold = max(1000, 4000 * 0.95) = 3800 nits.
      // 3800 > 1000 * 1.5 (1500) -> HIGH_HEADROOM
      expect(highHeadroom.clippingNitsThreshold).toBe(3800);
      expect(highHeadroom.clippingCategory).toBe('HIGH_HEADROOM');
    });
  });

  describe('5. Auto Brightness Limiter (ABL) Window Decay Curves', () => {
    it('evaluates ABL decay curves across all 5 APL window sizes for QD-OLED', () => {
      const abl = calculateAblWindows(1000, 'qd-oled');
      expect(abl).toHaveLength(5);
      expect(abl.map((w) => w.windowPct)).toEqual(APL_WINDOWS);

      // 1% window boost
      const w1 = abl.find((w) => w.windowPct === 1)!;
      expect(w1.sustainedNits).toBe(1150); // 1000 * (1 + 0.15 * 9/9)
      expect(w1.relativeBrightnessPct).toBe(115.0);
      expect(w1.ablThermalRisk).toBe('LOW');

      // 10% window standard peak
      const w10 = abl.find((w) => w.windowPct === 10)!;
      expect(w10.sustainedNits).toBe(1000);
      expect(w10.relativeBrightnessPct).toBe(100.0);
      expect(w10.ablThermalRisk).toBe('LOW');

      // 100% full screen window decay
      const w100 = abl.find((w) => w.windowPct === 100)!;
      expect(w100.sustainedNits).toBe(250); // 1000 * 0.25 (beta = 0.25)
      expect(w100.relativeBrightnessPct).toBe(25.0);
      expect(w100.ablThermalRisk).toBe('CRITICAL');
    });

    it('verifies strict monotonic decay of sustained nits as window size increases from 10% to 100%', () => {
      for (const panel of HDR_PANEL_TYPES) {
        const abl = calculateAblWindows(1000, panel);
        const w10 = abl.find((w) => w.windowPct === 10)!.sustainedNits;
        const w25 = abl.find((w) => w.windowPct === 25)!.sustainedNits;
        const w100 = abl.find((w) => w.windowPct === 100)!.sustainedNits;

        expect(w10).toBeGreaterThanOrEqual(w25);
        expect(w25).toBeGreaterThanOrEqual(w100);
      }
    });

    it('compares full-screen sustained brightness across panel technologies', () => {
      const peak = 1000;
      const qdOled100 = calculateAblWindows(peak, 'qd-oled').find((w) => w.windowPct === 100)!.sustainedNits;
      const woled100 = calculateAblWindows(peak, 'woled').find((w) => w.windowPct === 100)!.sustainedNits;
      const mla100 = calculateAblWindows(peak, 'woled-mla').find((w) => w.windowPct === 100)!.sustainedNits;
      const miniLed100 = calculateAblWindows(peak, 'mini-led-fald').find((w) => w.windowPct === 100)!.sustainedNits;
      const edgeLit100 = calculateAblWindows(peak, 'edge-lit-lcd').find((w) => w.windowPct === 100)!.sustainedNits;

      expect(edgeLit100).toBeGreaterThan(miniLed100);
      expect(miniLed100).toBeGreaterThan(qdOled100);
      expect(qdOled100).toBeGreaterThan(mla100);
      expect(mla100).toBeGreaterThan(woled100);

      expect(edgeLit100).toBe(850);
      expect(miniLed100).toBe(550);
      expect(qdOled100).toBe(250);
      expect(mla100).toBe(200);
      expect(woled100).toBe(180);
    });
  });

  describe('6. Full Analysis Summary Integration & Sanity Checks', () => {
    it('assembles complete HDR summary with valid nested metrics', () => {
      const summary = calculateHdrSummary(1000, 4000, 'hgig', 'qd-oled');
      expect(summary.displayPeakNits).toBe(1000);
      expect(summary.contentMaxNits).toBe(4000);
      expect(summary.toneMappingMode).toBe('hgig');
      expect(summary.panelType).toBe('qd-oled');
      expect(summary.clipping.clippingNitsThreshold).toBe(1000);
      expect(summary.colorSteps).toHaveLength(16);
      expect(summary.ablWindows).toHaveLength(5);
    });
  });

  describe('7. Performance & Calculation Throughput Benchmark', () => {
    it('executes 100,000 PQ EOTF conversions in under 200ms', () => {
      const iterations = 100000;
      const startTime = performance.now();
      
      let sum = 0;
      for (let i = 0; i < iterations; i++) {
        const nits = (i % 4000);
        const pq = nitsToPqSignal(nits);
        sum += pqSignalToNits(pq);
      }

      const durationMs = performance.now() - startTime;
      const opsPerSec = (iterations / durationMs) * 1000;
      
      expect(sum).toBeGreaterThan(0);
      expect(durationMs).toBeLessThan(200);
      console.log(`[HdrTestEngine Perf] 100k PQ Roundtrips: ${durationMs.toFixed(2)}ms (${opsPerSec.toFixed(0)} ops/sec)`);
    });

    it('executes 10,000 tone mapping simulations in under 150ms', () => {
      const iterations = 10000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const inputNits = (i % 4000);
        simulateToneMap(inputNits, 1000, 4000, 'static', 10);
      }

      const durationMs = performance.now() - startTime;
      expect(durationMs).toBeLessThan(150);
      console.log(`[HdrTestEngine Perf] 10k simulateToneMap calls: ${durationMs.toFixed(2)}ms`);
    });
  });
});
