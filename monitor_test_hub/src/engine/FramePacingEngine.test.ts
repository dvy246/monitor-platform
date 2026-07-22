import { describe, it, expect } from 'vitest';
import { FramePacingEngine } from './FramePacingEngine';

describe('FramePacingEngine Unit Test Suite', () => {
  it('correctly calculates 141 FPS on 144Hz G-Sync display cap', () => {
    const metrics = FramePacingEngine.calculateMetrics(141, 144);
    expect(metrics.vrrRecommendedCap).toBe(141);
    expect(metrics.frameTimeMs).toBeCloseTo(7.09, 1);
    expect(metrics.rtssConfigString).toContain('Limit=141');
  });

  it('detects cadence mismatch when running 100 FPS on 144Hz display', () => {
    const metrics = FramePacingEngine.calculateMetrics(100, 144);
    expect(metrics.hasCadenceMismatch).toBe(true);
    expect(metrics.cadenceStutterHz).toBeGreaterThan(0);
  });

  it('recognizes clean integer division (e.g. 60 FPS on 120Hz display)', () => {
    const metrics = FramePacingEngine.calculateMetrics(60, 120);
    expect(metrics.hasCadenceMismatch).toBe(false);
  });
});
