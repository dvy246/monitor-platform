import { describe, it, expect } from 'vitest';
import { calculateGamepadCircularity } from './GamepadCircularityEngine';

describe('GamepadCircularityEngine Unit Tests', () => {
  it('should calculate perfect circularity for ideal unit circle coordinates', () => {
    const coords = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 }
    ];
    const report = calculateGamepadCircularity(coords, { x: 0, y: 0 });
    expect(report.circularityErrorPercent).toBe(0);
    expect(report.maxRadius).toBe(1.0);
    expect(report.minRadius).toBe(1.0);
    expect(report.isCenteringAccurate).toBe(true);
    expect(report.qualityRating).toBe('EXCELLENT');
  });

  it('should detect centering stick drift when idle coordinates deviate > 5%', () => {
    const report = calculateGamepadCircularity([], { x: 0.08, y: 0.06 });
    expect(report.centeringDriftPercent).toBe(10);
    expect(report.isCenteringAccurate).toBe(false);
    expect(report.qualityRating).toBe('POOR_DRIFT');
  });

  it('should calculate circularity error for realistic analog stick outer bound points', () => {
    const coords = [
      { x: 0.9, y: 0 },
      { x: 0, y: 1.1 },
      { x: -0.95, y: 0 },
      { x: 0, y: -1.05 }
    ];
    const report = calculateGamepadCircularity(coords, { x: 0.01, y: 0.01 });
    expect(report.circularityErrorPercent).toBeGreaterThan(0);
    expect(report.circularityErrorPercent).toBeLessThan(15);
    expect(report.totalPointsSampled).toBe(4);
  });
});
