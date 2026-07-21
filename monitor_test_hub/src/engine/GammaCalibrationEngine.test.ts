import { describe, it, expect } from 'vitest';
import { calculateGammaLuminance, evaluateGammaMatch } from './GammaCalibrationEngine';

describe('GammaCalibrationEngine Unit Tests', () => {
  it('should calculate target luminance for 50% signal at gamma 2.2', () => {
    const lum = calculateGammaLuminance(0.5, 2.2);
    expect(lum).toBe(0.2176);
  });

  it('should evaluate exact match with zero offset', () => {
    const res = evaluateGammaMatch(2.2, 0);
    expect(res.calculatedGamma).toBe(2.2);
    expect(res.accuracyRating).toBe('EXCELLENT');
  });

  it('should detect poor gamma accuracy when offset exceeds threshold', () => {
    const res = evaluateGammaMatch(2.2, 0.45);
    expect(res.calculatedGamma).toBe(2.56);
    expect(res.accuracyRating).toBe('POOR');
  });
});
