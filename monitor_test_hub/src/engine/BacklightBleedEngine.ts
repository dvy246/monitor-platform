/**
 * BacklightBleedEngine.ts
 * Pure TypeScript calculation engine evaluating dark-room display backlight leakage,
 * corner luminance variance, and IPS glow angle shift.
 * Standard: IEC 62341-6-2 Luminance Uniformity Specifications.
 */

export interface ICornerLuminance {
  topLeft: number;     // 0-255 scale
  topRight: number;    // 0-255 scale
  bottomLeft: number;  // 0-255 scale
  bottomRight: number; // 0-255 scale
  center: number;      // 0-255 scale
}

export interface IBleedAnalysis {
  maxCornerDelta: number;      // luminance difference from center
  variancePercent: number;     // percentage variance relative to center
  isUniform: boolean;          // true if variance <= 15%
  leakageSeverity: 'EXCELLENT' | 'MODERATE' | 'SEVERE';
  ipsGlowShiftEstimate: number;// calculated angular shift delta
}

/**
 * Calculates luminance variance across screen regions against center baseline.
 * Threshold: <= 15% delta is considered uniform under IEC 62341-6-2.
 */
export function calculateBacklightBleed(luminance: ICornerLuminance): IBleedAnalysis {
  const center = Math.max(1, luminance.center);
  const corners = [
    luminance.topLeft,
    luminance.topRight,
    luminance.bottomLeft,
    luminance.bottomRight
  ];

  const maxCorner = Math.max(...corners);
  const minCorner = Math.min(...corners);
  const maxCornerDelta = Math.abs(maxCorner - center);
  const variancePercent = Number(((maxCornerDelta / center) * 100).toFixed(2));

  const isUniform = variancePercent <= 15.0;

  let leakageSeverity: 'EXCELLENT' | 'MODERATE' | 'SEVERE' = 'EXCELLENT';
  if (variancePercent > 35.0) {
    leakageSeverity = 'SEVERE';
  } else if (variancePercent > 15.0) {
    leakageSeverity = 'MODERATE';
  }

  // Estimated IPS glow angle shift based on corner-to-corner contrast ratio variance
  const ipsGlowShiftEstimate = Number((Math.abs(maxCorner - minCorner) * 0.45).toFixed(2));

  return {
    maxCornerDelta,
    variancePercent,
    isUniform,
    leakageSeverity,
    ipsGlowShiftEstimate
  };
}

/**
 * Generates test grid coordinates for corner & center sampling boxes.
 */
export function getSamplingBoxCoordinates(width: number, height: number, boxSize: number = 80) {
  const safeW = Math.max(boxSize * 2, width);
  const safeH = Math.max(boxSize * 2, height);

  return {
    topLeft: { x: 20, y: 20, width: boxSize, height: boxSize },
    topRight: { x: safeW - boxSize - 20, y: 20, width: boxSize, height: boxSize },
    bottomLeft: { x: 20, y: safeH - boxSize - 20, width: boxSize, height: boxSize },
    bottomRight: { x: safeW - boxSize - 20, y: safeH - boxSize - 20, width: boxSize, height: boxSize },
    center: { x: Math.round(safeW / 2 - boxSize / 2), y: Math.round(safeH / 2 - boxSize / 2), width: boxSize, height: boxSize }
  };
}
