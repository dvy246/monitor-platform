import { describe, it, expect } from 'vitest';
import { calculateContrastRatio, evaluateTextLegibility } from './TextSharpnessEngine';

describe('TextSharpnessEngine Unit Tests', () => {
  it('should calculate 21:1 contrast ratio for black text on white background', () => {
    const cr = calculateContrastRatio(1.0, 0.0);
    expect(cr).toBe(21.0);
  });

  it('should pass WCAG AAA for contrast ratio >= 7:1', () => {
    const report = evaluateTextLegibility('RGB', 12, 10.5);
    expect(report.isWcagAa).toBe(true);
    expect(report.isWcagAaa).toBe(true);
    expect(report.hasSubpixelFringingRisk).toBe(false);
  });

  it('should flag subpixel fringing risk on BGR and QD-OLED subpixel layouts', () => {
    const report = evaluateTextLegibility('BGR', 12, 10.5);
    expect(report.hasSubpixelFringingRisk).toBe(true);
  });
});
