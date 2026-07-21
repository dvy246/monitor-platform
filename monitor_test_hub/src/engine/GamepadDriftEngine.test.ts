import { describe, it, expect } from 'vitest';
import { calculateStickMetrics, calculateCircularityError } from './GamepadDriftEngine';

describe('GamepadDriftEngine Unit Tests', () => {
  it('should report zero stick drift for perfectly centered analog stick (0,0)', () => {
    const metrics = calculateStickMetrics(0, 0);
    expect(metrics.restingOffsetDistance).toBe(0);
    expect(metrics.hasStickDrift).toBe(false);
  });

  it('should detect stick drift when resting offset distance exceeds deadzone (0.05)', () => {
    const metrics = calculateStickMetrics(0.08, 0.06);
    expect(metrics.restingOffsetDistance).toBe(0.1);
    expect(metrics.hasStickDrift).toBe(true);
  });

  it('should qualify circularity error <= 2.0% as Hall Effect Quality', () => {
    const distances = [0.99, 1.01, 1.0, 0.98, 1.02];
    const res = calculateCircularityError(distances);
    expect(res.circularityErrorPercent).toBeLessThanOrEqual(2.0);
    expect(res.isHallEffectQuality).toBe(true);
  });
});
