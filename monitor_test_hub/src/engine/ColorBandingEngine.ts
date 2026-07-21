/**
 * ColorBandingEngine.ts
 * Pure TypeScript calculation engine evaluating 8-bit vs 10-bit gradient quantization,
 * color banding step thresholds, and spatial/temporal dithering (FRC).
 * Standard: sRGB IEC 61966-2-1 Quantization Step Formula.
 */

export interface IGradientStep {
  stepIndex: number;
  rgbValue: number;
  normalizedLuminance: number;
  deltaE: number;
  isBandingVisible: boolean;
}

export interface IBandingReport {
  bitDepth: 8 | 10;
  totalSteps: number;
  maxDeltaE: number;
  bandingStepCount: number;
  hasBandingArtifacts: boolean;
}

/**
 * Calculates luminance and perceptible Delta E steps across an 8-bit or 10-bit color gradient.
 * Threshold: Delta E > 1.2 is considered a visible color banding artifact.
 */
export function analyzeGradientBanding(
  bitDepth: 8 | 10,
  gamma: number = 2.2
): IBandingReport {
  const totalSteps = bitDepth === 10 ? 1024 : 256;
  let maxDeltaE = 0;
  let bandingStepCount = 0;

  for (let i = 1; i < totalSteps; i++) {
    const prevNormalized = Math.pow((i - 1) / (totalSteps - 1), gamma);
    const currNormalized = Math.pow(i / (totalSteps - 1), gamma);
    
    // Perceptible step delta E approximation in L* perceptual scale
    const deltaE = Number(((currNormalized - prevNormalized) * 100).toFixed(3));
    if (deltaE > maxDeltaE) {
      maxDeltaE = deltaE;
    }
    if (deltaE > 1.2) {
      bandingStepCount++;
    }
  }

  return {
    bitDepth,
    totalSteps,
    maxDeltaE,
    bandingStepCount,
    hasBandingArtifacts: bandingStepCount > 0
  };
}

/**
 * Simulates temporal Frame Rate Control (FRC) 8-bit + FRC dither pattern values.
 */
export function calculateFrcDitherStep(
  targetValue10Bit: number,
  frameIndex: number
): number {
  const base8Bit = Math.floor(targetValue10Bit / 4);
  const remainder = targetValue10Bit % 4;
  
  const ditherOffsets = [
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 1, 0],
    [1, 1, 1, 0]
  ];
  
  const pattern = ditherOffsets[remainder] || [0, 0, 0, 0];
  const offset = pattern[frameIndex % 4];
  
  return base8Bit + offset;
}
