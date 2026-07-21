import { describe, it, expect } from 'vitest';
import { generateGrayscaleSteps, evaluateGrayscaleRamp } from './GrayscaleStepEngine';

describe('GrayscaleStepEngine Unit Tests', () => {
  it('should generate 16 calibrated RGB steps from 0 to 255', () => {
    const steps = generateGrayscaleSteps(2.2);
    expect(steps.length).toBe(16);
    expect(steps[0].rgbValue).toBe(0);
    expect(steps[15].rgbValue).toBe(255);
  });

  it('should score 100% linearity when all 16 steps are distinguishable', () => {
    const report = evaluateGrayscaleRamp(16, 2.2);
    expect(report.rampLinearityScore).toBe(100);
    expect(report.hasBlackCrush).toBe(false);
    expect(report.hasWhiteClipping).toBe(false);
  });

  it('should flag black crush when visible steps drop below 15', () => {
    const report = evaluateGrayscaleRamp(12, 2.2);
    expect(report.hasBlackCrush).toBe(true);
    expect(report.rampLinearityScore).toBe(75);
  });
});
