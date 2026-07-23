/**
 * MouseDpiEngine.ts
 * Pure TypeScript calculation engine measuring mouse DPI (Dots Per Inch),
 * eDPI (Effective DPI for esports titles), and physical displacement precision.
 */

export interface IMouseDpiReport {
  calculatedDpi: number;
  roundedDpi: number; // Rounded to nearest standard step (e.g., 400, 800, 1200, 1600, 3200, 6400)
  totalPixelsMoved: number;
  targetDistanceInches: number;
  eDpi: number;
  trueDpiAccuracyPercent: number;
}

export const COMMON_DPI_STEPS = [400, 800, 1200, 1600, 2400, 3200, 4000, 6400, 8000, 12000, 16000, 26000, 32000];

/**
 * Calculates raw DPI given total pixel count moved and target physical distance in inches or millimeters
 */
export function calculateMouseDpi(
  totalPixelsMoved: number,
  targetDistanceMm: number,
  inGameSensitivity: number = 1.0
): IMouseDpiReport {
  if (targetDistanceMm <= 0 || totalPixelsMoved <= 0) {
    return {
      calculatedDpi: 0,
      roundedDpi: 0,
      totalPixelsMoved,
      targetDistanceInches: 0,
      eDpi: 0,
      trueDpiAccuracyPercent: 0
    };
  }

  const targetDistanceInches = targetDistanceMm / 25.4;
  const calculatedDpi = Math.round(totalPixelsMoved / targetDistanceInches);

  // Find closest standard DPI step
  let closestDpi = COMMON_DPI_STEPS[0];
  let minDiff = Math.abs(calculatedDpi - closestDpi);

  for (let i = 1; i < COMMON_DPI_STEPS.length; i++) {
    const diff = Math.abs(calculatedDpi - COMMON_DPI_STEPS[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestDpi = COMMON_DPI_STEPS[i];
    }
  }

  const eDpi = Math.round(calculatedDpi * inGameSensitivity);
  const trueDpiAccuracyPercent = Math.min(100, Math.max(0, Math.round((1 - Math.abs(calculatedDpi - closestDpi) / closestDpi) * 100)));

  return {
    calculatedDpi,
    roundedDpi: closestDpi,
    totalPixelsMoved,
    targetDistanceInches: Number(targetDistanceInches.toFixed(2)),
    eDpi,
    trueDpiAccuracyPercent
  };
}
