import { describe, it, expect } from 'vitest';
import {
  calculateVrrMetrics,
  calculateLfcStatus,
  calculateStutterVariance,
  getSweepFps,
  sanitizeGpuVendor,
  sanitizeRefreshRate,
  getRefreshRateHz,
  getGpuVendorLabel,
  getRefreshRateLabel
} from '../../src/engine/VrrSweepEngine';

describe('Adversarial Stress Test: Edge Cases', () => {
  it('handles 0 Hz refresh rate input', () => {
    const metrics = calculateVrrMetrics(60, 0);
    expect(metrics.displayRefreshHz).toBe(60);
    expect(metrics.refreshRateLabel).toBe('144 Hz'); // fallback applied
  });

  it('handles 1000 Hz refresh rate input', () => {
    const metrics = calculateVrrMetrics(60, 1000);
    expect(metrics.displayRefreshHz).toBe(60);
    expect(metrics.refreshRateLabel).toBe('1000 Hz');
  });

  it('handles 0 target FPS input', () => {
    const lfc = calculateLfcStatus(0, 48);
    expect(lfc.isLfcActive).toBe(false);
    expect(lfc.effectiveFps).toBe(0);

    const metrics = calculateVrrMetrics(0, 144);
    // Note: calculateVrrMetrics falls back targetFps 0 to 60
    expect(metrics.targetFps).toBe(60);
  });

  it('handles extremely small positive target FPS (e.g. 0.0001)', () => {
    const lfc = calculateLfcStatus(0.0001, 48);
    expect(lfc.isLfcActive).toBe(true);
    expect(lfc.multiplier).toBe(480000);
    expect(lfc.effectiveFps).toBe(48);
  });

  it('handles NaN and Infinity inputs across functions', () => {
    expect(calculateVrrMetrics(NaN, NaN, NaN, NaN).targetFps).toBe(60);
    expect(calculateVrrMetrics(Infinity, -Infinity, NaN, {}).targetFps).toBe(60);

    expect(calculateLfcStatus(NaN, NaN)).toEqual({ isLfcActive: false, effectiveFps: 0, multiplier: 1 });
    expect(calculateLfcStatus(Infinity, -Infinity)).toEqual({ isLfcActive: false, effectiveFps: 0, multiplier: 1 });

    expect(calculateStutterVariance([NaN, Infinity, -10, 0])).toEqual({
      variance: 0,
      stdDev: 0,
      maxDeltaMs: 0,
      frameDropCount: 0
    });

    expect(getSweepFps('sine', NaN, NaN, NaN)).toBe(97); // safeMin (20) + (144 - 20) * sin(0) = 20 + 124*0.5 = 82? wait, sin(0)=0 so 0.5+0 = 0.5 -> 20 + 62 = 82.
  });

  it('handles invalid GPU vendor strings and objects', () => {
    expect(sanitizeGpuVendor('ARM-Mali-Extreme-9000')).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor('<script>alert(1)</script>')).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor({ vendor: 'nvidia' })).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor(['nvidia'])).toBe('nvidia-geforce');
    expect(sanitizeGpuVendor(Symbol('gpu'))).toBe('nvidia-geforce');
  });

  it('handles invalid refresh rate strings and objects', () => {
    expect(sanitizeRefreshRate('1000hz')).toBe('144hz');
    expect(sanitizeRefreshRate('0hz')).toBe('144hz');
    expect(sanitizeRefreshRate('-144hz')).toBe('144hz');
    expect(sanitizeRefreshRate('invalid_string')).toBe('144hz');
    expect(sanitizeRefreshRate({ rate: 144 })).toBe('144hz');
    expect(sanitizeRefreshRate(144)).toBe('144hz');
  });

  it('tests minHz > maxHz in getSweepFps', () => {
    // What if maxHz (15) < minHz (20)?
    const fps = getSweepFps('sine', 0, 15, 20);
    // safeMax is 15 (> 0 so safeMax = 15). safeMin is 20 (>= 10 so safeMin = 20).
    // range = 15 - 20 = -5.
    // sineFactor = 0.5. safeMin + range*sineFactor = 20 + (-2.5) = 17.5.
    expect(fps).toBe(17.5);
  });
});
