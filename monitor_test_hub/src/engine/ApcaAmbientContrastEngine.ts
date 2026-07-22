/**
 * APCA Perceptual & Ambient Display Contrast Engine
 * Pure TypeScript calculation engine for W3C APCA 0.98G lightness contrast (Lc score),
 * WCAG 2.1 relative luminance contrast ratios, physical Ambient Contrast Ratio (ACR) under glare,
 * and font ergonomics calibration.
 */

export interface IRgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface IWcag21Result {
  contrastRatio: number; // e.g. 7.42
  normalTextAA: boolean; // >= 4.5:1
  normalTextAAA: boolean;// >= 7.0:1
  largeTextAA: boolean;  // >= 3.0:1
  largeTextAAA: boolean; // >= 4.5:1
}

export interface IApcaResult {
  lightnessContrast: number; // Lc score, e.g. -78.4 or +82.1
  polarity: 'darkOnLight' | 'lightOnDark';
  minimumFontSizePx: number; // calculated for given font weight
  recommendedFontWeight: number; // 100-900
  readabilityRating: 'PREFERRED' | 'FLUENT_BODY' | 'LARGE_TEXT_ONLY' | 'NON_TEXT' | 'FAIL';
}

export interface IAmbientContrastInput {
  nativeContrastRatio: number;   // e.g. 1000 for 1000:1, or 1000000 for OLED
  peakLuminanceNits: number;    // e.g. 300 nits
  blackLuminanceNits?: number;  // e.g. 0.3 nits
  roomIlluminanceLux: number;   // e.g. 300 lux
  screenReflectanceFactor: number; // Rd, e.g. 0.015 (glossy AR), 0.035 (matte)
}

export interface IAmbientContrastResult {
  nativeContrastRatio: number;
  effectiveAmbientContrastRatio: number;
  contrastLossPercent: number;
  perceivedBlackLevelNits: number;
  perceivedWhiteLevelNits: number;
  glareSeverity: 'NEGLIGIBLE' | 'MODERATE' | 'SEVERE' | 'EXTREME';
}

export interface IFontErgonomicsReport {
  wcag: IWcag21Result;
  apca: IApcaResult;
  ambient?: IAmbientContrastResult;
  astigmatismHalationRisk: 'LOW' | 'MODERATE' | 'HIGH';
  ergonomicAdvice: string[];
  disclaimer: string;
}

export const DISPLAY_CALIBRATION_DISCLAIMER =
  'Notice: This contrast analysis is based strictly on ISO 9241-307, W3C WCAG 2.1, and APCA 0.98G display hardware typography calibration standards. It contains zero clinical or ophthalmic diagnostic assertions.';

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB color.
 */
export function calculateWcagLuminance(color: IRgbColor): number {
  const norm = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const rL = norm(color.r);
  const gL = norm(color.g);
  const bL = norm(color.b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two colors.
 */
export function calculateWcagContrast(textColor: IRgbColor, bgColor: IRgbColor): IWcag21Result {
  const L1 = calculateWcagLuminance(textColor);
  const L2 = calculateWcagLuminance(bgColor);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  const contrastRatio = Number(ratio.toFixed(2));

  return {
    contrastRatio,
    normalTextAA: contrastRatio >= 4.5,
    normalTextAAA: contrastRatio >= 7.0,
    largeTextAA: contrastRatio >= 3.0,
    largeTextAAA: contrastRatio >= 4.5,
  };
}

/**
 * APCA 0.98G relative luminance computation.
 */
function calculateApcaLuminance(color: IRgbColor): number {
  const rL = Math.pow(color.r / 255, 0.56);
  const gL = Math.pow(color.g / 255, 0.56);
  const bL = Math.pow(color.b / 255, 0.56);
  const Y = 0.2126729 * rL + 0.7151522 * gL + 0.0721749 * bL;
  if (Y < 0.022) {
    return Y + Math.pow(0.022 - Y, 1.414);
  }
  return Y;
}

/**
 * Calculates W3C APCA 0.98G perceptual lightness contrast (Lc score).
 */
export function calculateApcaContrast(textColor: IRgbColor, bgColor: IRgbColor, targetFontWeight: number = 400): IApcaResult {
  const txtY = calculateApcaLuminance(textColor);
  const bgY = calculateApcaLuminance(bgColor);

  let Lc = 0;
  let polarity: 'darkOnLight' | 'lightOnDark' = 'darkOnLight';

  // APCA 0.98G Exponents
  const mainTR = 0.56;
  const mainBR = 0.56;
  const mainTxtR = 0.573;
  const darkBR = 0.65;
  const scaleBoW = 1.14;
  const scaleWoB = 1.14;

  if (bgY > txtY) {
    // Dark text on light background
    polarity = 'darkOnLight';
    const sapca = (Math.pow(bgY, mainBR) - Math.pow(txtY, mainTxtR)) * scaleBoW;
    Lc = sapca * 100;
    if (Lc < 7.5) Lc = 0;
    else Lc = Lc - 5;
  } else {
    // Light text on dark background
    polarity = 'lightOnDark';
    const sapca = (Math.pow(bgY, darkBR) - Math.pow(txtY, mainTR)) * scaleWoB;
    Lc = sapca * 100;
    if (Lc > -7.5) Lc = 0;
    else Lc = Lc + 5;
  }

  const lightnessContrast = Number(Lc.toFixed(1));
  const absLc = Math.abs(lightnessContrast);

  let readabilityRating: IApcaResult['readabilityRating'] = 'FAIL';
  if (absLc >= 75) {
    readabilityRating = 'PREFERRED';
  } else if (absLc >= 60) {
    readabilityRating = 'FLUENT_BODY';
  } else if (absLc >= 45) {
    readabilityRating = 'LARGE_TEXT_ONLY';
  } else if (absLc >= 30) {
    readabilityRating = 'NON_TEXT';
  }

  // Determine minimum font size (px) for given weight
  let minimumFontSizePx = 16;
  if (absLc >= 90) {
    minimumFontSizePx = targetFontWeight >= 700 ? 12 : 14;
  } else if (absLc >= 75) {
    minimumFontSizePx = targetFontWeight >= 700 ? 14 : 16;
  } else if (absLc >= 60) {
    minimumFontSizePx = targetFontWeight >= 700 ? 16 : 18;
  } else if (absLc >= 45) {
    minimumFontSizePx = targetFontWeight >= 700 ? 21 : 24;
  } else if (absLc >= 30) {
    minimumFontSizePx = targetFontWeight >= 700 ? 32 : 36;
  } else {
    minimumFontSizePx = 48; // Fail range
  }

  // Recommended font weight
  let recommendedFontWeight = 400;
  if (absLc < 45) recommendedFontWeight = 700;
  else if (absLc < 60) recommendedFontWeight = 600;
  else if (absLc < 75) recommendedFontWeight = 500;

  return {
    lightnessContrast,
    polarity,
    minimumFontSizePx,
    recommendedFontWeight,
    readabilityRating,
  };
}

/**
 * Calculates physical Ambient Contrast Ratio (ACR) under room illuminance and screen glare.
 */
export function calculateAmbientContrast(input: IAmbientContrastInput): IAmbientContrastResult {
  const Lmax = input.peakLuminanceNits;
  let Lmin = input.blackLuminanceNits;
  if (Lmin === undefined || Lmin <= 0) {
    Lmin = input.nativeContrastRatio > 0 ? Lmax / input.nativeContrastRatio : 0.001;
  }

  const glareLuminanceNits = (input.roomIlluminanceLux * input.screenReflectanceFactor) / Math.PI;

  const perceivedWhiteLevelNits = Number((Lmax + glareLuminanceNits).toFixed(2));
  const perceivedBlackLevelNits = Number((Lmin + glareLuminanceNits).toFixed(2));

  const effectiveACR = perceivedWhiteLevelNits / perceivedBlackLevelNits;
  const effectiveAmbientContrastRatio = Number(effectiveACR.toFixed(2));

  const nativeCR = input.nativeContrastRatio;
  const lossFraction = Math.max(0, Math.min(1, (nativeCR - effectiveACR) / nativeCR));
  const contrastLossPercent = Number((lossFraction * 100).toFixed(2));

  let glareSeverity: IAmbientContrastResult['glareSeverity'] = 'NEGLIGIBLE';
  if (effectiveAmbientContrastRatio < 20) {
    glareSeverity = 'EXTREME';
  } else if (effectiveAmbientContrastRatio < 100) {
    glareSeverity = 'SEVERE';
  } else if (effectiveAmbientContrastRatio < 500) {
    glareSeverity = 'MODERATE';
  }

  return {
    nativeContrastRatio: nativeCR,
    effectiveAmbientContrastRatio,
    contrastLossPercent,
    perceivedBlackLevelNits,
    perceivedWhiteLevelNits,
    glareSeverity,
  };
}

/**
 * Comprehensive Font Ergonomics & Display Contrast Evaluation.
 */
export function evaluateFontErgonomics(
  textColor: IRgbColor,
  bgColor: IRgbColor,
  fontWeight: number = 400,
  ambientInput?: IAmbientContrastInput
): IFontErgonomicsReport {
  const wcag = calculateWcagContrast(textColor, bgColor);
  const apca = calculateApcaContrast(textColor, bgColor, fontWeight);

  let ambient: IAmbientContrastResult | undefined = undefined;
  if (ambientInput) {
    ambient = calculateAmbientContrast(ambientInput);
  }

  const bgLum = calculateWcagLuminance(bgColor);
  let astigmatismHalationRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';

  if (apca.polarity === 'lightOnDark' && Math.abs(apca.lightnessContrast) > 85 && bgLum < 0.05) {
    astigmatismHalationRisk = 'HIGH';
  } else if (apca.polarity === 'lightOnDark' && bgLum < 0.08) {
    astigmatismHalationRisk = 'MODERATE';
  }

  const ergonomicAdvice: string[] = [];

  if (astigmatismHalationRisk === 'HIGH') {
    ergonomicAdvice.push(
      'Pure white text on pitch black backgrounds causes astigmatic halation and eye fatigue. Consider using off-white text (#E2E8F0) or a dark gray surface background (#121215).'
    );
  }

  if (apca.readabilityRating === 'FAIL' || apca.readabilityRating === 'NON_TEXT') {
    ergonomicAdvice.push(
      'Text contrast is below recommended APCA Lc thresholds for fluent reading. Increase color lightness difference or use bold font weights.'
    );
  }

  if (ambient && ambient.contrastLossPercent > 50) {
    ergonomicAdvice.push(
      `Ambient room glare is causing a ${ambient.contrastLossPercent}% drop in effective display contrast. Reduce room lighting or use anti-reflective screen shielding.`
    );
  }

  if (ergonomicAdvice.length === 0) {
    ergonomicAdvice.push('Text contrast and display ambient contrast are well within ergonomic recommendations.');
  }

  return {
    wcag,
    apca,
    ambient,
    astigmatismHalationRisk,
    ergonomicAdvice,
    disclaimer: DISPLAY_CALIBRATION_DISCLAIMER,
  };
}

export function hexToRgb(hex: string): IRgbColor {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return { r: 255, g: 255, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export class ApcaAmbientContrastEngine {
  static calculateApcaLc(textColorHex: string, bgColorHex: string): number {
    const txtRgb = hexToRgb(textColorHex);
    const bgRgb = hexToRgb(bgColorHex);
    const res = calculateApcaContrast(txtRgb, bgRgb);
    return res.lightnessContrast;
  }

  static calculateAmbientDeratedContrast(textColorHex: string, bgColorHex: string, roomLux: number, peakNits: number): number {
    const res = calculateAmbientContrast({
      nativeContrastRatio: 1000,
      peakLuminanceNits: peakNits,
      roomIlluminanceLux: roomLux,
      screenReflectanceFactor: 0.02,
    });
    return res.effectiveAmbientContrastRatio;
  }

  static getMinimumFontSize(lcScore: number): number {
    const absLc = Math.abs(lcScore);
    if (absLc >= 90) return 12;
    if (absLc >= 75) return 14;
    if (absLc >= 60) return 16;
    if (absLc >= 45) return 21;
    if (absLc >= 30) return 32;
    return 48;
  }
}

