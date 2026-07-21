import { describe, it, expect } from 'vitest';
import { calculateMotionMetrics, calculatePursuitPosition } from './MotionBlurEngine';

describe('MotionBlurEngine Unit Tests', () => {
  it('should calculate MPRT and pixels per frame for 144Hz at 960px/s', () => {
    const metrics = calculateMotionMetrics(144, 960);
    expect(metrics.pixelsPerFrame).toBe(6.67);
    expect(metrics.estimatedMprtMs).toBe(6.94);
    expect(metrics.hasCoronaTrail).toBe(false);
  });

  it('should detect overdrive overshoot corona trails when factor > 0.35', () => {
    const metrics = calculateMotionMetrics(240, 1920, 0.5);
    expect(metrics.hasCoronaTrail).toBe(true);
    expect(metrics.overshootDelta).toBe(12.75);
  });

  it('should cycle pursuit pattern positions smoothly across screen width', () => {
    const posX = calculatePursuitPosition(1000, 1000, 1920, 100);
    expect(posX).toBeGreaterThanOrEqual(-100);
    expect(posX).toBeLessThanOrEqual(1920);
  });
});
