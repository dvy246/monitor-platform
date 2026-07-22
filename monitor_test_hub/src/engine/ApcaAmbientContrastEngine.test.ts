import { describe, it, expect } from 'vitest';
import {
  calculateWcagLuminance,
  calculateWcagContrast,
  calculateApcaContrast,
  calculateAmbientContrast,
  evaluateFontErgonomics,
  DISPLAY_CALIBRATION_DISCLAIMER,
  type IRgbColor,
  type IAmbientContrastInput,
} from './ApcaAmbientContrastEngine';

describe('ApcaAmbientContrastEngine', () => {
  const BLACK: IRgbColor = { r: 0, g: 0, b: 0 };
  const WHITE: IRgbColor = { r: 255, g: 255, b: 255 };
  const GRAY_MID: IRgbColor = { r: 128, g: 128, b: 128 };
  const DARK_SURFACE: IRgbColor = { r: 18, g: 18, b: 21 }; // #121215

  it('calculates WCAG 2.1 contrast correctly for black on white', () => {
    const res = calculateWcagContrast(BLACK, WHITE);
    expect(res.contrastRatio).toBe(21);
    expect(res.normalTextAA).toBe(true);
    expect(res.normalTextAAA).toBe(true);
  });

  it('calculates WCAG 2.1 contrast ratio as 1:1 for identical colors', () => {
    const res = calculateWcagContrast(WHITE, WHITE);
    expect(res.contrastRatio).toBe(1);
    expect(res.normalTextAA).toBe(false);
  });

  it('computes APCA 0.98G Lc score for black text on white background (darkOnLight)', () => {
    const apca = calculateApcaContrast(BLACK, WHITE, 400);
    expect(apca.polarity).toBe('darkOnLight');
    expect(apca.lightnessContrast).toBeGreaterThan(95);
    expect(apca.readabilityRating).toBe('PREFERRED');
    expect(apca.minimumFontSizePx).toBeLessThanOrEqual(14);
  });

  it('computes APCA 0.98G Lc score for white text on black background (lightOnDark)', () => {
    const apca = calculateApcaContrast(WHITE, BLACK, 400);
    expect(apca.polarity).toBe('lightOnDark');
    expect(apca.lightnessContrast).toBeLessThan(-95);
    expect(apca.readabilityRating).toBe('PREFERRED');
  });

  it('rates low contrast text correctly as FAIL or NON_TEXT', () => {
    const lightGray: IRgbColor = { r: 200, g: 200, b: 200 };
    const apca = calculateApcaContrast(lightGray, WHITE, 400);
    expect(Math.abs(apca.lightnessContrast)).toBeLessThan(45);
    expect(apca.readabilityRating).toBe('FAIL');

    const midGray: IRgbColor = { r: 70, g: 70, b: 70 };
    const apcaMid = calculateApcaContrast(midGray, WHITE, 400);
    expect(Math.abs(apcaMid.lightnessContrast)).toBeGreaterThanOrEqual(30);
    expect(apcaMid.readabilityRating).toBe('NON_TEXT');
  });

  it('calculates physical Ambient Contrast Ratio (ACR) under room glare', () => {
    // 1000:1 IPS display, 300 nits peak, 300 lux office lighting, 0.035 matte reflectance
    const input: IAmbientContrastInput = {
      nativeContrastRatio: 1000,
      peakLuminanceNits: 300,
      blackLuminanceNits: 0.3,
      roomIlluminanceLux: 300,
      screenReflectanceFactor: 0.035, // matte screen
    };

    const res = calculateAmbientContrast(input);
    // Glare nits = (300 * 0.035) / PI = 10.5 / 3.14159 = ~3.34 nits
    // Perceived white = 300 + 3.34 = 303.34
    // Perceived black = 0.3 + 3.34 = 3.64
    // Effective ACR = 303.34 / 3.64 = ~83.33
    expect(res.effectiveAmbientContrastRatio).toBeLessThan(100);
    expect(res.contrastLossPercent).toBeGreaterThan(80);
    expect(res.glareSeverity).toBe('SEVERE');
  });

  it('evaluates OLED ACR superiority under dim lighting', () => {
    const input: IAmbientContrastInput = {
      nativeContrastRatio: 1000000,
      peakLuminanceNits: 1000,
      blackLuminanceNits: 0.0001,
      roomIlluminanceLux: 10, // dim room
      screenReflectanceFactor: 0.015, // glossy AR
    };

    const res = calculateAmbientContrast(input);
    expect(res.effectiveAmbientContrastRatio).toBeGreaterThan(1000);
    expect(res.glareSeverity).toBe('NEGLIGIBLE');
  });

  it('detects astigmatism halation risk for pure white text on dark black background', () => {
    const report = evaluateFontErgonomics(WHITE, BLACK, 400);
    expect(report.astigmatismHalationRisk).toBe('HIGH');
    expect(report.ergonomicAdvice.some((a) => a.includes('halating') || a.includes('halation'))).toBe(true);
  });

  it('includes ISO 9241-307 / WCAG / APCA display calibration disclaimer', () => {
    const report = evaluateFontErgonomics(BLACK, WHITE);
    expect(report.disclaimer).toBe(DISPLAY_CALIBRATION_DISCLAIMER);
  });
});
