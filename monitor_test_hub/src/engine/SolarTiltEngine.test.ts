import { describe, it, expect } from 'vitest';
import { SolarTiltEngine } from './SolarTiltEngine';

describe('SolarTiltEngine Unit Test Suite', () => {
  it('correctly calculates optimal tilt angles for Los Angeles, CA (Latitude 34.05°N)', () => {
    const metrics = SolarTiltEngine.calculateMetrics(34.05, 30);
    expect(metrics.optimalYearRoundTilt).toBeCloseTo(29, 0);
    expect(metrics.optimalWinterTilt).toBeGreaterThan(metrics.optimalYearRoundTilt);
    expect(metrics.optimalSummerTilt).toBeLessThan(metrics.optimalYearRoundTilt);
    expect(metrics.tiltShadingLossPct).toBeLessThan(5);
  });

  it('correctly calculates solar declination on summer solstice (approx day 172)', () => {
    const declination = SolarTiltEngine.calculateSolarDeclination(172);
    expect(declination).toBeCloseTo(23.45, 0);
  });

  it('computes higher shading loss when roof tilt heavily deviates from optimal', () => {
    const optimalMetrics = SolarTiltEngine.calculateMetrics(40, 33);
    const subOptimalMetrics = SolarTiltEngine.calculateMetrics(40, 75);
    expect(subOptimalMetrics.tiltShadingLossPct).toBeGreaterThan(optimalMetrics.tiltShadingLossPct);
  });
});
