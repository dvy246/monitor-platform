import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  srgbToLinear,
  rgbToXyz,
  xyzToLab,
  rgbToLab,
  calculateCie76,
  calculateCie94,
  calculateDeltaE2000,
  MACBETH_COLORCHECKER_24,
  DISPLAY_DELTA_E_DISCLAIMER,
  type ILabColor,
  type IRgbColor,
} from './DeltaE2000Engine';

describe('DeltaE2000Engine', () => {
  it('converts hex to rgb and back correctly', () => {
    const hex = '#735244';
    const rgb = hexToRgb(hex);
    expect(rgb).toEqual({ r: 115, g: 82, b: 68 });
    expect(rgbToHex(rgb)).toBe(hex);
  });

  it('handles short hex codes and invalid strings gracefully', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts sRGB to Linear sRGB correctly', () => {
    expect(srgbToLinear(0)).toBe(0);
    expect(srgbToLinear(255)).toBe(1);
    expect(srgbToLinear(128)).toBeCloseTo(0.2158, 3);
  });

  it('converts RGB to XYZ and Lab under D65 white point', () => {
    const whiteRgb: IRgbColor = { r: 255, g: 255, b: 255 };
    const xyz = rgbToXyz(whiteRgb);
    // D65 White point: Xn=0.95047, Yn=1.00000, Zn=1.08883
    expect(xyz.X).toBeCloseTo(0.95047, 3);
    expect(xyz.Y).toBeCloseTo(1.00000, 3);
    expect(xyz.Z).toBeCloseTo(1.08883, 3);

    const lab = xyzToLab(xyz);
    expect(lab.L).toBeCloseTo(100, 1);
    expect(lab.a).toBeCloseTo(0, 1);
    expect(lab.b).toBeCloseTo(0, 1);
  });

  it('returns 0 deltaE for identical colors', () => {
    const rgb: IRgbColor = { r: 255, g: 0, b: 0 };
    const lab1: ILabColor = rgbToLab(rgb);
    const res = calculateDeltaE2000(lab1, lab1);
    expect(res.deltaE00).toBe(0);
    expect(res.deltaE76).toBe(0);
    expect(res.deltaE94).toBe(0);
    expect(res.rating).toBe('MASTERING_REFERENCE');
    expect(res.isPassedIso9241).toBe(true);
  });

  it('calculates accurate CIEDE2000 for standard published Lab pair (Sharma et al. 2005 Pair 1)', () => {
    // Pair 1: Lab1 = (50, 2.6772, -79.7751), Lab2 = (50, 0, -82.7485)
    // Expected Delta E 2000 ~ 2.0425
    const lab1: ILabColor = { L: 50.0, a: 2.6772, b: -79.7751 };
    const lab2: ILabColor = { L: 50.0, a: 0.0, b: -82.7485 };
    const res = calculateDeltaE2000(lab1, lab2);
    expect(res.deltaE00).toBeCloseTo(2.04, 1);
  });

  it('evaluates rating thresholds (MASTERING_REFERENCE, PROFESSIONAL_GRADE, ACCEPTABLE_CONSUMER, UNACCEPTABLE_SHIFT)', () => {
    const baseLab: ILabColor = { L: 50, a: 10, b: 20 };
    
    // Very small shift -> MASTERING_REFERENCE (< 1.0)
    const refLab: ILabColor = { L: 50.3, a: 10.1, b: 20.1 };
    const resRef = calculateDeltaE2000(baseLab, refLab);
    expect(resRef.rating).toBe('MASTERING_REFERENCE');
    expect(resRef.isPassedIso9241).toBe(true);

    // Medium shift -> PROFESSIONAL_GRADE (1.0 <= dE < 2.0)
    const profLab: ILabColor = { L: 51.5, a: 10.8, b: 20.5 };
    const resProf = calculateDeltaE2000(baseLab, profLab);
    expect(resProf.rating).toBe('PROFESSIONAL_GRADE');
    expect(resProf.isPassedIso9241).toBe(true);

    // Noticeable shift -> ACCEPTABLE_CONSUMER (2.0 <= dE < 3.0)
    const consLab: ILabColor = { L: 52.5, a: 11.8, b: 21.8 };
    const resCons = calculateDeltaE2000(baseLab, consLab);
    expect(resCons.rating).toBe('ACCEPTABLE_CONSUMER');
    expect(resCons.isPassedIso9241).toBe(true);

    // Large shift -> UNACCEPTABLE_SHIFT (>= 3.0)
    const shiftLab: ILabColor = { L: 58.0, a: 18.0, b: 30.0 };
    const resShift = calculateDeltaE2000(baseLab, shiftLab);
    expect(resShift.rating).toBe('UNACCEPTABLE_SHIFT');
    expect(resShift.isPassedIso9241).toBe(false);
  });

  it('calculates non-zero deltaE and decomposition for target vs measured colors', () => {
    const lab1 = rgbToLab({ r: 255, g: 0, b: 0 });
    const lab2 = rgbToLab({ r: 240, g: 20, b: 10 });
    const res = calculateDeltaE2000(lab1, lab2);
    expect(res.deltaE00).toBeGreaterThan(0);
    expect(res.deltaE76).toBeGreaterThan(0);
    expect(res.deltaE94).toBeGreaterThan(0);
    expect(res.deltaL).toBeDefined();
    expect(res.deltaC).toBeDefined();
    expect(res.deltaH).toBeDefined();
  });

  it('supports custom parametric weighting factors kL, kC, kH', () => {
    const lab1: ILabColor = { L: 50, a: 20, b: 30 };
    const lab2: ILabColor = { L: 55, a: 25, b: 35 };

    const defaultRes = calculateDeltaE2000(lab1, lab2, 1, 1, 1);
    const weightedRes = calculateDeltaE2000(lab1, lab2, 2, 1, 1);

    expect(weightedRes.deltaE00).toBeLessThan(defaultRes.deltaE00);
  });

  it('contains 24 Macbeth ColorChecker patches with valid hex format', () => {
    expect(MACBETH_COLORCHECKER_24).toHaveLength(24);
    expect(MACBETH_COLORCHECKER_24[0].name).toBe('Dark Skin');
    for (const patch of MACBETH_COLORCHECKER_24) {
      expect(patch.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('includes ISO 9241-307 display calibration disclaimer', () => {
    expect(DISPLAY_DELTA_E_DISCLAIMER).toContain('ISO 9241-307');
  });
});

