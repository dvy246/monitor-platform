/**
 * GammaCalibrationEngine.ts
 * Pure TypeScript calculation engine evaluating display gamma response (1.8, 2.2, 2.4 EOTF).
 * Standards: ITU-R BT.709 & IEC 61966-2-1 Transfer Specs.
 */

export interface IGammaEvaluation {
  targetGamma: number;
  calculatedGamma: number;
  perceivedLuminance: number; // 0-1 scale
  blendMatchOffset: number;   // -0.5 to +0.5 user adjustment
  accuracyRating: 'EXCELLENT' | 'FAIR' | 'POOR';
}

/**
 * Calculates target gamma luminance for a given input signal value (0-1).
 * Formula: L = V^gamma
 */
export function calculateGammaLuminance(inputSignal: number, gamma: number): number {
  const v = Math.max(0, Math.min(1, inputSignal));
  return Number(Math.pow(v, gamma).toFixed(4));
}

/**
 * Evaluates gamma accuracy based on user dither pattern blend match slider (-0.5 to +0.5).
 */
export function evaluateGammaMatch(
  targetGamma: number,
  sliderOffset: number
): IGammaEvaluation {
  const safeOffset = Math.max(-0.5, Math.min(0.5, sliderOffset));
  const calculatedGamma = Number((targetGamma + safeOffset * 0.8).toFixed(2));
  const perceivedLuminance = calculateGammaLuminance(0.5, calculatedGamma);

  const delta = Math.abs(calculatedGamma - targetGamma);
  let accuracyRating: 'EXCELLENT' | 'FAIR' | 'POOR' = 'EXCELLENT';
  if (delta > 0.3) {
    accuracyRating = 'POOR';
  } else if (delta > 0.1) {
    accuracyRating = 'FAIR';
  }

  return {
    targetGamma,
    calculatedGamma,
    perceivedLuminance,
    blendMatchOffset: safeOffset,
    accuracyRating
  };
}
