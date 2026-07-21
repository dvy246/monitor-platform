import { describe, it, expect } from 'vitest';
import { analyzeGradientBanding, calculateFrcDitherStep } from './ColorBandingEngine';

describe('ColorBandingEngine Unit Tests', () => {
  it('should analyze 8-bit gradient steps and compute max delta E', () => {
    const report = analyzeGradientBanding(8, 2.2);
    expect(report.totalSteps).toBe(256);
    expect(report.maxDeltaE).toBeGreaterThan(0);
  });

  it('should analyze 10-bit gradient steps showing significantly smoother transitions', () => {
    const report8 = analyzeGradientBanding(8, 2.2);
    const report10 = analyzeGradientBanding(10, 2.2);
    expect(report10.totalSteps).toBe(1024);
    expect(report10.maxDeltaE).toBeLessThan(report8.maxDeltaE);
  });

  it('should calculate temporal FRC dither pattern steps across frames', () => {
    const stepFrame0 = calculateFrcDitherStep(100, 0);
    const stepFrame1 = calculateFrcDitherStep(100, 1);
    expect(stepFrame0).toBe(25);
    expect(stepFrame1).toBe(25);
  });
});
