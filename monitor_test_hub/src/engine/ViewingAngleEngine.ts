/**
 * ViewingAngleEngine.ts
 * Pure TypeScript calculation engine evaluating off-axis viewing angle contrast loss,
 * VA gamma shift, and OLED chromaticity tint shift.
 * Standard: ISO 9241-307 Viewing Angle Contrast Threshold (CR(theta) >= 10:1).
 */

export interface IViewingAngleMetrics {
  angleDegrees: number;
  panelType: 'IPS' | 'VA' | 'OLED' | 'TN';
  contrastRatio: number;
  gammaShiftDelta: number;
  chromaShiftE: number;
  isCompliant: boolean; // CR >= 10:1
}

/**
 * Estimates off-axis contrast ratio and gamma shift based on angle and panel technology.
 */
export function calculateViewingAngleMetrics(
  angleDegrees: number,
  panelType: 'IPS' | 'VA' | 'OLED' | 'TN' = 'IPS'
): IViewingAngleMetrics {
  const theta = Math.abs(angleDegrees);
  const rad = (theta * Math.PI) / 180;

  let baseContrast = 1000;
  let gammaShiftDelta = 0;
  let chromaShiftE = 0;

  switch (panelType) {
    case 'OLED':
      baseContrast = Math.max(100, 10000 * Math.cos(rad * 0.15));
      gammaShiftDelta = Number((0.02 * (theta / 45)).toFixed(2));
      chromaShiftE = Number((0.8 * (theta / 45)).toFixed(2));
      break;

    case 'IPS':
      baseContrast = Math.max(20, 1000 * Math.cos(rad * 0.4));
      gammaShiftDelta = Number((0.05 * (theta / 45)).toFixed(2));
      chromaShiftE = Number((1.5 * (theta / 45)).toFixed(2));
      break;

    case 'VA':
      baseContrast = Math.max(10, 3000 * Math.pow(Math.cos(rad * 0.7), 2));
      gammaShiftDelta = Number((0.45 * (theta / 45)).toFixed(2)); // High VA gamma shift
      chromaShiftE = Number((3.2 * (theta / 45)).toFixed(2));
      break;

    case 'TN':
      baseContrast = Math.max(2, 800 * Math.pow(Math.cos(rad * 1.1), 4));
      gammaShiftDelta = Number((0.85 * (theta / 45)).toFixed(2));
      chromaShiftE = Number((5.5 * (theta / 45)).toFixed(2));
      break;
  }

  const contrastRatio = Number(baseContrast.toFixed(1));
  const isCompliant = contrastRatio >= 10.0;

  return {
    angleDegrees: theta,
    panelType,
    contrastRatio,
    gammaShiftDelta,
    chromaShiftE,
    isCompliant
  };
}
