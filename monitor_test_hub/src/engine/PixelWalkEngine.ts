/**
 * PixelWalkEngine.ts
 * Pure TypeScript calculation engine inspecting LCD sub-pixel voltage inversion balance,
 * crosstalk line artifacts, and spatial 2x2 / 1x1 dither patterns.
 * Standard: VESA FPDM v2.0 Section 305-2 Spatial Inversion Specs.
 */

export type InversionPatternType = '1x1_checkerboard' | '2x2_checkerboard' | 'vertical_lines' | 'horizontal_lines';

export interface IPixelWalkPattern {
  patternType: InversionPatternType;
  primaryColor: string;
  secondaryColor: string;
  gridSize: number;
}

export interface IInversionAnalysis {
  isOledExempt: boolean;
  patternType: InversionPatternType;
  susceptibilityScore: number; // 0-100 score
  hasVoltageImbalance: boolean;
}

/**
 * Calculates inversion crosstalk susceptibility score across pattern types.
 */
export function analyzePixelWalk(
  patternType: InversionPatternType,
  observedFlickerIntensity: number = 0, // 0-10 scale
  isOledPanel: boolean = false
): IInversionAnalysis {
  if (isOledPanel) {
    return {
      isOledExempt: true,
      patternType,
      susceptibilityScore: 0,
      hasVoltageImbalance: false
    };
  }

  const intensity = Math.max(0, Math.min(10, observedFlickerIntensity));
  const susceptibilityScore = Number((intensity * 10).toFixed(1));
  const hasVoltageImbalance = susceptibilityScore > 20;

  return {
    isOledExempt: false,
    patternType,
    susceptibilityScore,
    hasVoltageImbalance
  };
}

/**
 * Returns spatial pixel grid step dimensions for dither canvas rendering.
 */
export function getPatternGridStep(patternType: InversionPatternType): number {
  switch (patternType) {
    case '1x1_checkerboard': return 1;
    case '2x2_checkerboard': return 2;
    case 'vertical_lines': return 1;
    case 'horizontal_lines': return 1;
  }
}
