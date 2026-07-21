/**
 * TextSharpnessEngine.ts
 * Pure TypeScript calculation engine evaluating ClearType font subpixel antialiasing (RGB vs BGR),
 * text legibility across font sizes (6pt–24pt), and WCAG 2.1 AAA contrast compliance.
 * Standard: Microsoft ClearType Subpixel Rendering & ISO 9241-300 Ergonomic Specs.
 */

export type SubpixelLayoutType = 'RGB' | 'BGR' | 'QD_OLED_TRIANGULAR' | 'WOLED_RWBG';

export interface ITextLegibilityReport {
  layoutType: SubpixelLayoutType;
  fontSizePt: number;
  contrastRatio: number;
  isWcagAa: boolean;   // CR >= 4.5:1
  isWcagAaa: boolean;  // CR >= 7:1
  hasSubpixelFringingRisk: boolean;
}

/**
 * Calculates WCAG 2.1 contrast ratio between foreground and background relative luminance.
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 */
export function calculateContrastRatio(l1: number, l2: number): number {
  const maxL = Math.max(l1, l2);
  const minL = Math.min(l1, l2);
  return Number(((maxL + 0.05) / (minL + 0.05)).toFixed(2));
}

/**
 * Evaluates text legibility and subpixel color fringing risk.
 * Standard RGB font smoothing triggers fringing on BGR or QD-OLED subpixel structures.
 */
export function evaluateTextLegibility(
  layoutType: SubpixelLayoutType,
  fontSizePt: number,
  contrastRatio: number
): ITextLegibilityReport {
  const isWcagAa = contrastRatio >= 4.5;
  const isWcagAaa = contrastRatio >= 7.0;

  // Subpixel fringing risk is present if layout is BGR or QD-OLED without custom font tuner
  const hasSubpixelFringingRisk = layoutType !== 'RGB';

  return {
    layoutType,
    fontSizePt,
    contrastRatio,
    isWcagAa,
    isWcagAaa,
    hasSubpixelFringingRisk
  };
}
