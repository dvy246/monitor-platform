/**
 * PpiAcuityEngine.ts — Decoupled Pure-TypeScript PPI & Retinal Acuity Calculation Engine
 * Compliant with 1-Arcminute Human Visual Acuity (20/20 Snellen Vision) Standards
 */

export interface PpiAcuityMetrics {
  ppi: number;
  dotPitchMm: number;
  dotPitchInches: number;
  megapixels: number;
  retinalDistanceCm: number;
  retinalDistanceInches: number;
  retinalDistanceFeet: number;
  scalingBlurRisk: 'none' | 'low' | 'moderate' | 'high';
  scalingBlurReason: string;
}

export class PpiAcuityEngine {
  /**
   * Calculate exact Pixel-Per-Inch (PPI)
   */
  public static calculatePpi(widthPx: number, heightPx: number, diagonalInches: number): number {
    if (widthPx <= 0 || heightPx <= 0 || diagonalInches <= 0) return 0;
    const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
    return Math.round((diagonalPx / diagonalInches) * 100) / 100;
  }

  /**
   * Calculate complete PPI & Retinal Acuity Metrics
   */
  public static calculateMetrics(widthPx: number, heightPx: number, diagonalInches: number): PpiAcuityMetrics {
    const ppi = this.calculatePpi(widthPx, heightPx, diagonalInches);
    if (ppi <= 0) {
      return {
        ppi: 0,
        dotPitchMm: 0,
        dotPitchInches: 0,
        megapixels: 0,
        retinalDistanceCm: 0,
        retinalDistanceInches: 0,
        retinalDistanceFeet: 0,
        scalingBlurRisk: 'none',
        scalingBlurReason: 'Invalid display dimensions'
      };
    }

    const dotPitchMm = Math.round((25.4 / ppi) * 10000) / 10000;
    const dotPitchInches = Math.round((1 / ppi) * 10000) / 10000;
    const megapixels = Math.round(((widthPx * heightPx) / 1000000) * 100) / 100;

    // 1 arcminute (1/60th of a degree) = 20/20 human retinal resolution limit
    // Distance (cm) = 25.4 / (PPI * 2 * tan(0.5 / 60 * PI / 180)) ≈ 4369 / PPI
    const retinalDistanceCm = Math.round((4369 / ppi) * 10) / 10;
    const retinalDistanceInches = Math.round((retinalDistanceCm / 2.54) * 10) / 10;
    const retinalDistanceFeet = Math.round((retinalDistanceInches / 12) * 10) / 10;

    // macOS/Windows fractional scaling blur risk evaluation
    let scalingBlurRisk: 'none' | 'low' | 'moderate' | 'high' = 'none';
    let scalingBlurReason = 'Native 1:1 pixel grid alignment';

    if (ppi >= 105 && ppi <= 115) {
      scalingBlurRisk = 'none';
      scalingBlurReason = 'Standard 1x desktop pixel density (e.g. 27" 1440p or 24" 1080p)';
    } else if (ppi >= 215 && ppi <= 230) {
      scalingBlurRisk = 'none';
      scalingBlurReason = 'Native 2x Retina pixel density (e.g. 27" 5K or 16" MacBook Pro)';
    } else if (ppi >= 135 && ppi <= 170) {
      scalingBlurRisk = 'high';
      scalingBlurReason = 'Requires non-integer 150% fractional scaling on macOS, causing subtle subpixel blur';
    } else if (ppi > 170 && ppi < 215) {
      scalingBlurRisk = 'moderate';
      scalingBlurReason = 'Requires 175% or non-native 2x scaling on desktop OS';
    }

    return {
      ppi,
      dotPitchMm,
      dotPitchInches,
      megapixels,
      retinalDistanceCm,
      retinalDistanceInches,
      retinalDistanceFeet,
      scalingBlurRisk,
      scalingBlurReason
    };
  }
}
