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
  getAllPeakNits,
  getAllToneMappings,
  PEAK_NITS_PRESETS,
  TONE_MAPPING_MODES,
  HDR_PANEL_TYPES,
  APL_WINDOWS,
  PEAK_NITS_CONFIG,
  TONE_MAPPING_CONFIG
} from './HdrTestEngine';

describe('HdrTestEngine', () => {
  describe('PQ Curve (SMPTE ST 2084) EOTF Calculations', () => {
    it('correctly maps 0 nits to signal 0.0 and 10,000 nits to signal 1.0', () => {
      expect(nitsToPqSignal(0)).toBe(0.0);
      expect(nitsToPqSignal(10000)).toBe(1.0);
      expect(pqSignalToNits(0.0)).toBe(0.0);
      expect(pqSignalToNits(1.0)).toBe(10000);
    });

    it('handles negative or out of range inputs to EOTF functions', () => {
      expect(nitsToPqSignal(-500)).toBe(0.0);
      expect(nitsToPqSignal(15000)).toBe(1.0);
      expect(nitsToPqSignal(NaN)).toBe(0.0);

      expect(pqSignalToNits(-0.5)).toBe(0.0);
      expect(pqSignalToNits(1.5)).toBe(10000);
      expect(pqSignalToNits(NaN)).toBe(0.0);
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
      expect(color1000.normalizedRgb[0]).toBeCloseTo(color1000.pqSignal, 5);

      const color10k = nitsTo10BitColor(10000);
      expect(color10k.code10Bit).toBe(1023);
      expect(color10k.code8Bit).toBe(255);

      const color0 = nitsTo10BitColor(0);
      expect(color0.code10Bit).toBe(0);
      expect(color0.code8Bit).toBe(0);
    });
  });

  describe('Tone Mapping Simulation', () => {
    it('performs HGIG and raw clipping accurately at peak nits', () => {
      const underPeak = simulateToneMap(800, 1000, 4000, 'hgig');
      expect(underPeak.outputNits).toBe(800);
      expect(underPeak.isClipped).toBe(false);

      const overPeak = simulateToneMap(1500, 1000, 4000, 'hgig');
      expect(overPeak.outputNits).toBe(1000);
      expect(overPeak.isClipped).toBe(true);
      expect(overPeak.compressionRatioPct).toBeGreaterThan(0);

      const clipMode = simulateToneMap(1200, 1000, 4000, 'clip');
      expect(clipMode.outputNits).toBe(1000);
      expect(clipMode.isClipped).toBe(true);
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

    it('handles 0 input nits in simulateToneMap safely', () => {
      const res0 = simulateToneMap(0, 1000, 4000, 'static');
      expect(res0.outputNits).toBe(0);
      expect(res0.compressionRatioPct).toBe(0);
    });
  });

  describe('Clipping Threshold & Step Gradient Calculations', () => {
    it('calculates clipping thresholds for HGIG and soft curves', () => {
      const hgigClip = calculateClippingThreshold(1000, 4000, 'hgig');
      expect(hgigClip.clippingNitsThreshold).toBe(1000);
      expect(hgigClip.clippingCategory).toBe('ACCURATE_MATCH');

      const staticClip = calculateClippingThreshold(1000, 4000, 'static');
      expect(staticClip.clippingNitsThreshold).toBeGreaterThan(1000);
    });

    it('categorizes early clipping and high headroom thresholds', () => {
      const early = calculateClippingThreshold(1000, 800, 'hgig');
      expect(early.clippingCategory).toBe('EARLY_CLIPPING');

      const highHeadroom = calculateClippingThreshold(1000, 6000, 'static');
      expect(highHeadroom.clippingCategory).toBe('HIGH_HEADROOM');
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

    it('reflects higher sustained brightness on Mini-LED FALD and WOLED panels', () => {
      const miniLedAbl = calculateAblWindows(1000, 'mini-led-fald');
      const win100Mini = miniLedAbl.find((w) => w.windowPct === 100);
      expect(win100Mini?.sustainedNits).toBeGreaterThan(500);

      const woledMlaAbl = calculateAblWindows(1000, 'woled-mla');
      expect(woledMlaAbl).toHaveLength(5);

      const edgeLitAbl = calculateAblWindows(1000, 'edge-lit-lcd');
      expect(edgeLitAbl).toHaveLength(5);
    });
  });

  describe('Edge Case Safety & Sanitizers', () => {
    it('handles NaN, Infinity, negative, and invalid string inputs gracefully', () => {
      expect(sanitizeNits(NaN)).toBe(1000);
      expect(sanitizeNits(-500)).toBe(0);
      expect(sanitizeNits(20000)).toBe(10000);
      expect(sanitizeNits('1500')).toBe(1500);
      expect(sanitizeNits('invalid')).toBe(1000);

      expect(sanitizeToneMapping('invalid-mode')).toBe('hgig');
      expect(sanitizeToneMappingMode('dynamic')).toBe('dynamic');
      expect(sanitizeHdrPanelType('unknown-panel')).toBe('qd-oled');

      expect(sanitizePeakNits('1400')).toBe('1400');
      expect(sanitizePeakNits(400)).toBe('400');
      expect(sanitizePeakNits('invalid')).toBe('1000');

      const summary = calculateHdrSummary(NaN as any, NaN as any, 'invalid' as any, 'invalid' as any);
      expect(summary.displayPeakNits).toBe(1000);
      expect(summary.clipping.clippingCode10Bit).toBeGreaterThan(0);
    });

    it('exports all standard preset arrays and configs', () => {
      expect(PEAK_NITS_PRESETS).toEqual([400, 600, 1000, 1400, 2000, 4000]);
      expect(TONE_MAPPING_MODES).toEqual(['hgig', 'static', 'dynamic', 'clip']);
      expect(HDR_PANEL_TYPES).toEqual(['qd-oled', 'woled', 'woled-mla', 'mini-led-fald', 'edge-lit-lcd']);
      expect(APL_WINDOWS).toEqual([1, 5, 10, 25, 100]);

      expect(getAllPeakNits()).toEqual(['400', '600', '1000', '1400', '2000', '4000']);
      expect(getAllToneMappings()).toEqual(['hgig', 'static', 'dynamic', 'clip']);

      expect(PEAK_NITS_CONFIG['1000'].nits).toBe(1000);
      expect(TONE_MAPPING_CONFIG['hgig'].shortName).toBe('HGiG');
    });
  });
});
