import { describe, it, expect } from 'vitest';
import { analyzePixelWalk, getPatternGridStep } from './PixelWalkEngine';

describe('PixelWalkEngine Unit Tests', () => {
  it('should exempt OLED displays from voltage inversion checks', () => {
    const res = analyzePixelWalk('1x1_checkerboard', 5, true);
    expect(res.isOledExempt).toBe(true);
    expect(res.susceptibilityScore).toBe(0);
    expect(res.hasVoltageImbalance).toBe(false);
  });

  it('should flag voltage imbalance when LCD flicker intensity > 2', () => {
    const res = analyzePixelWalk('2x2_checkerboard', 4, false);
    expect(res.isOledExempt).toBe(false);
    expect(res.susceptibilityScore).toBe(40);
    expect(res.hasVoltageImbalance).toBe(true);
  });

  it('should return correct pattern grid step sizes', () => {
    expect(getPatternGridStep('1x1_checkerboard')).toBe(1);
    expect(getPatternGridStep('2x2_checkerboard')).toBe(2);
  });
});
