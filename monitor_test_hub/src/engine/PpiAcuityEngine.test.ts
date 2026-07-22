import { describe, it, expect } from 'vitest';
import { PpiAcuityEngine } from './PpiAcuityEngine';

describe('PpiAcuityEngine Unit Test Suite', () => {
  it('correctly calculates PPI for 27" 4K UHD monitor (3840x2160)', () => {
    const metrics = PpiAcuityEngine.calculateMetrics(3840, 2160, 27);
    expect(metrics.ppi).toBeCloseTo(163, 0);
    expect(metrics.dotPitchMm).toBeCloseTo(0.155, 2);
    expect(metrics.megapixels).toBe(8.29);
    expect(metrics.retinalDistanceInches).toBeGreaterThan(10);
    expect(metrics.scalingBlurRisk).toBe('high');
  });

  it('correctly evaluates 27" 1440p QHD monitor (2560x1440)', () => {
    const metrics = PpiAcuityEngine.calculateMetrics(2560, 1440, 27);
    expect(metrics.ppi).toBeCloseTo(109, 0);
    expect(metrics.scalingBlurRisk).toBe('none');
  });

  it('handles invalid inputs safely without crashing', () => {
    const metrics = PpiAcuityEngine.calculateMetrics(0, 0, 0);
    expect(metrics.ppi).toBe(0);
    expect(metrics.dotPitchMm).toBe(0);
  });
});
