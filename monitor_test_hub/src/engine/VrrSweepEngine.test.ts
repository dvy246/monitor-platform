import { describe, it, expect } from 'vitest';
import {
  getAllGpuVendors,
  getAllRefreshRates,
  sanitizeGpuVendor,
  sanitizeRefreshRate,
  getRefreshRateHz,
  getGpuVendorLabel,
  getRefreshRateLabel,
  calculateLfcStatus,
  calculateStutterVariance,
  getSweepFps,
  calculateVrrMetrics
} from './VrrSweepEngine';

describe('VrrSweepEngine', () => {
  it('returns valid lists of GPU vendors and refresh rates', () => {
    const vendors = getAllGpuVendors();
    expect(vendors).toEqual(['nvidia-geforce', 'amd-radeon', 'intel-arc', 'apple-silicon']);

    const rates = getAllRefreshRates();
    expect(rates).toEqual(['60hz', '144hz', '240hz', '360hz', '540hz']);
  });

  it('sanitizes GPU vendor strings correctly and falls back safely', () => {
    expect(sanitizeGpuVendor('nvidia-geforce')).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor('NVIDIA-GEFORCE')).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor('  amd-radeon  ')).toBe('amd-radeon');
    expect(sanitizeGpuVendor('intel-arc')).toBe('intel-arc');
    expect(sanitizeGpuVendor('apple-silicon')).toBe('apple-silicon');
    expect(sanitizeGpuVendor('invalid-gpu')).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor(null)).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor(undefined)).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor(123)).toBe('nvidia-geforce');
  });

  it('sanitizes Refresh Rate strings correctly and falls back safely', () => {
    expect(sanitizeRefreshRate('144hz')).toBe('144hz');
    expect(sanitizeRefreshRate('240HZ')).toBe('240hz');
    expect(sanitizeRefreshRate('360')).toBe('360hz');
    expect(sanitizeRefreshRate(' 540hz ')).toBe('540hz');
    expect(sanitizeRefreshRate('999hz')).toBe('144hz');
    expect(sanitizeRefreshRate(null)).toBe('144hz');
    expect(sanitizeRefreshRate(NaN)).toBe('144hz');
  });

  it('converts refresh rate identifiers to numeric Hz values', () => {
    expect(getRefreshRateHz('60hz')).toBe(60);
    expect(getRefreshRateHz('144hz')).toBe(144);
    expect(getRefreshRateHz('240hz')).toBe(240);
    expect(getRefreshRateHz('360hz')).toBe(360);
    expect(getRefreshRateHz('540hz')).toBe(540);
    expect(getRefreshRateHz('invalid')).toBe(144);
  });

  it('provides descriptive labels for vendors and refresh rates', () => {
    expect(getGpuVendorLabel('nvidia-geforce')).toContain('NVIDIA GeForce');
    expect(getGpuVendorLabel('amd-radeon')).toContain('AMD Radeon');
    expect(getGpuVendorLabel('intel-arc')).toContain('Intel Arc');
    expect(getGpuVendorLabel('apple-silicon')).toContain('Apple Silicon');
    expect(getRefreshRateLabel('240hz')).toBe('240 Hz');
  });

  describe('LFC (Low Frame Rate Compensation) Detection', () => {
    it('detects native VRR range when target FPS is >= minVRR threshold (48Hz)', () => {
      const lfc = calculateLfcStatus(60, 48);
      expect(lfc.isLfcActive).toBe(false);
      expect(lfc.multiplier).toBe(1);
      expect(lfc.effectiveFps).toBe(60);
    });

    it('triggers LFC frame doubling when FPS is below minVRR (e.g. 30 FPS < 48Hz)', () => {
      const lfc = calculateLfcStatus(30, 48);
      expect(lfc.isLfcActive).toBe(true);
      expect(lfc.multiplier).toBe(2);
      expect(lfc.effectiveFps).toBe(60);
    });

    it('triggers LFC frame tripling for very low FPS (e.g. 15 FPS < 48Hz)', () => {
      const lfc = calculateLfcStatus(15, 48);
      expect(lfc.isLfcActive).toBe(true);
      expect(lfc.multiplier).toBe(4);
      expect(lfc.effectiveFps).toBe(60);
    });

    it('handles zero, negative, NaN, and Infinity FPS gracefully', () => {
      expect(calculateLfcStatus(0, 48).isLfcActive).toBe(false);
      expect(calculateLfcStatus(-10, 48).isLfcActive).toBe(false);
      expect(calculateLfcStatus(NaN, 48).isLfcActive).toBe(false);
      expect(calculateLfcStatus(Infinity, 48).isLfcActive).toBe(false);
    });
  });

  describe('Micro-stutter Variance Calculation', () => {
    it('calculates 0 variance for empty or invalid arrays', () => {
      expect(calculateStutterVariance([])).toEqual({
        variance: 0,
        stdDev: 0,
        maxDeltaMs: 0,
        frameDropCount: 0
      });
      expect(calculateStutterVariance([NaN, Infinity] as any)).toEqual({
        variance: 0,
        stdDev: 0,
        maxDeltaMs: 0,
        frameDropCount: 0
      });
    });

    it('calculates variance and standard deviation correctly for valid frame deltas', () => {
      const frameTimes = [16.6, 16.7, 16.6, 16.7]; // almost consistent
      const result = calculateStutterVariance(frameTimes, 16.67);
      expect(result.variance).toBeLessThan(0.1);
      expect(result.stdDev).toBeLessThan(0.5);
      expect(result.frameDropCount).toBe(0);
    });

    it('counts frame drops when delta time exceeds 1.5x expected frame time', () => {
      const expected = 16.67; // 60 FPS
      const frameTimes = [16.6, 16.7, 35.0, 16.6, 50.0]; // 2 drops (35ms & 50ms >= 25ms)
      const result = calculateStutterVariance(frameTimes, expected);
      expect(result.frameDropCount).toBe(2);
      expect(result.maxDeltaMs).toBe(50);
      expect(result.variance).toBeGreaterThan(0);
      expect(result.stdDev).toBeGreaterThan(0);
    });
  });

  describe('Sweep FPS Generator', () => {
    it('generates sine sweep values bounded within [minHz, maxHz]', () => {
      const fps0 = getSweepFps('sine', 0, 144, 20);
      const fps1 = getSweepFps('sine', 1, 144, 20);
      expect(fps0).toBeGreaterThanOrEqual(20);
      expect(fps0).toBeLessThanOrEqual(144);
      expect(fps1).toBeGreaterThanOrEqual(20);
      expect(fps1).toBeLessThanOrEqual(144);
    });

    it('generates ramp sweep values correctly', () => {
      const fpsRampStart = getSweepFps('ramp', 0, 240, 20);
      const fpsRampPeak = getSweepFps('ramp', 1.5, 240, 20);
      expect(fpsRampStart).toBe(20);
      expect(fpsRampPeak).toBe(130);
    });

    it('handles negative or invalid elapsed times safely', () => {
      expect(getSweepFps('sine', -5, 144, 20)).toBeGreaterThanOrEqual(20);
      expect(getSweepFps('ramp', NaN, 144, 20)).toBe(20);
    });
  });

  describe('Full VRR Metrics Snapshot', () => {
    it('computes metrics for native VRR range', () => {
      const metrics = calculateVrrMetrics(120, 144, 48, 'nvidia-geforce');
      expect(metrics.syncMode).toBe('NATIVE_VRR');
      expect(metrics.isTearing).toBe(false);
      expect(metrics.lfc.isLfcActive).toBe(false);
      expect(metrics.displayRefreshHz).toBe(120);
      expect(metrics.vendorLabel).toContain('NVIDIA');
    });

    it('computes metrics for tearing/desync when FPS exceeds max refresh rate', () => {
      const metrics = calculateVrrMetrics(200, 144, 48, 'amd-radeon');
      expect(metrics.syncMode).toBe('TEARING_DESYNC');
      expect(metrics.isTearing).toBe(true);
      expect(metrics.displayRefreshHz).toBe(144);
    });

    it('computes metrics for LFC mode when FPS falls below minVRR range', () => {
      const metrics = calculateVrrMetrics(30, 144, 48, 'intel-arc');
      expect(metrics.syncMode).toBe('LFC_ACTIVE');
      expect(metrics.isTearing).toBe(false);
      expect(metrics.lfc.isLfcActive).toBe(true);
      expect(metrics.effectiveFps).toBe(60);
      expect(metrics.displayRefreshHz).toBe(60);
    });
  });
});
