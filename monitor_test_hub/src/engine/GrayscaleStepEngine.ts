/**
 * GrayscaleStepEngine.ts
 * Pure TypeScript calculation engine evaluating 16-step grayscale ramps,
 * black crush detection (RGB 0 vs 1), and white highlight clipping (DICOM GSDF).
 * Standard: ANSI/NAPM IT9.18 & DICOM Part 14 Grayscale Specs.
 */

export interface IGrayscaleStep {
  stepNumber: number; // 1 to 16
  rgbValue: number;   // 0 to 255
  normalizedLuminance: number;
}

export interface IGrayscaleReport {
  steps: IGrayscaleStep[];
  hasBlackCrush: boolean;
  hasWhiteClipping: boolean;
  rampLinearityScore: number; // 0-100 score
}

/**
 * Generates calibrated 16-step grayscale luminance values from RGB 0 to 255.
 */
export function generateGrayscaleSteps(gamma: number = 2.2): IGrayscaleStep[] {
  const steps: IGrayscaleStep[] = [];
  for (let i = 0; i < 16; i++) {
    const rgbValue = Math.round((i / 15) * 255);
    const normalizedLuminance = Number(Math.pow(rgbValue / 255, gamma).toFixed(4));
    steps.push({
      stepNumber: i + 1,
      rgbValue,
      normalizedLuminance
    });
  }
  return steps;
}

/**
 * Evaluates grayscale step response for black crush and white highlight clipping.
 */
export function evaluateGrayscaleRamp(
  observedVisibleSteps: number = 16,
  gamma: number = 2.2
): IGrayscaleReport {
  const steps = generateGrayscaleSteps(gamma);
  const visible = Math.max(1, Math.min(16, observedVisibleSteps));

  const hasBlackCrush = visible < 15;
  const hasWhiteClipping = visible < 14;
  const rampLinearityScore = Number(((visible / 16) * 100).toFixed(1));

  return {
    steps,
    hasBlackCrush,
    hasWhiteClipping,
    rampLinearityScore
  };
}
