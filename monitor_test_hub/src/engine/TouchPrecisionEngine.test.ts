import { describe, it, expect } from 'vitest';
import { TouchPrecisionEngine, type TouchPoint } from './TouchPrecisionEngine';

describe('TouchPrecisionEngine Unit Test Suite', () => {
  it('calculates zero RMS deviation for perfectly straight line points', () => {
    const points: TouchPoint[] = [
      { x: 0, y: 0, timestamp: 0 },
      { x: 50, y: 50, timestamp: 10 },
      { x: 100, y: 100, timestamp: 20 }
    ];

    const metrics = TouchPrecisionEngine.calculateMetrics(points);
    expect(metrics.rmsDeviationPx).toBe(0);
    expect(metrics.emiNoiseRating).toBe('excellent');
  });

  it('detects line jitter RMS error on noisy touch inputs', () => {
    const points: TouchPoint[] = [
      { x: 0, y: 0, timestamp: 0 },
      { x: 25, y: 30, timestamp: 5 },  // +5px jitter offset
      { x: 50, y: 45, timestamp: 10 }, // -5px jitter offset
      { x: 100, y: 100, timestamp: 20 }
    ];

    const metrics = TouchPrecisionEngine.calculateMetrics(points);
    expect(metrics.rmsDeviationPx).toBeGreaterThan(1.0);
    expect(metrics.maxDeviationPx).toBeGreaterThan(3.0);
  });
});
