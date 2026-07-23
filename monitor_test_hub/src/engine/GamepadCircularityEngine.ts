/**
 * GamepadCircularityEngine.ts
 * Pure TypeScript calculation engine analyzing analog stick circularity error %,
 * centering drift variance, and outer bound radial deviation for gamepads and controllers.
 * Standard: W3C Gamepad API Spec & Gamepad Hardware Calibration Specs.
 */

export interface IStickCoordinate {
  x: number; // Normalized -1.0 to 1.0
  y: number; // Normalized -1.0 to 1.0
}

export interface IGamepadCircularityReport {
  circularityErrorPercent: number; // Average percentage deviation from ideal 1.0 radius
  maxRadius: number;
  minRadius: number;
  centeringDriftPercent: number; // Centering offset when stick is released
  isCenteringAccurate: boolean; // True if centering drift <= 5%
  totalPointsSampled: number;
  qualityRating: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR_DRIFT';
}

/**
 * Calculates analog stick circularity error % and centering drift variance from sampled coordinates
 */
export function calculateGamepadCircularity(
  coordinates: IStickCoordinate[],
  idleCoordinate: IStickCoordinate = { x: 0, y: 0 }
): IGamepadCircularityReport {
  const centeringDriftRadius = Math.sqrt(idleCoordinate.x * idleCoordinate.x + idleCoordinate.y * idleCoordinate.y);
  const centeringDriftPercent = Number((centeringDriftRadius * 100).toFixed(2));
  const isCenteringAccurate = centeringDriftPercent <= 5.0;

  if (coordinates.length === 0) {
    return {
      circularityErrorPercent: 0,
      maxRadius: 0,
      minRadius: 0,
      centeringDriftPercent,
      isCenteringAccurate,
      totalPointsSampled: 0,
      qualityRating: isCenteringAccurate ? 'EXCELLENT' : 'POOR_DRIFT'
    };
  }

  let radii: number[] = [];
  let totalError = 0;

  for (const pt of coordinates) {
    const r = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    radii.push(r);
    // Outer edge circularity error measures deviation from ideal unit circle r = 1.0
    totalError += Math.abs(r - 1.0);
  }

  const avgError = totalError / coordinates.length;
  const circularityErrorPercent = Number((avgError * 100).toFixed(2));
  const maxRadius = Number(Math.max(...radii).toFixed(3));
  const minRadius = Number(Math.min(...radii).toFixed(3));

  let qualityRating: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR_DRIFT' = 'EXCELLENT';
  if (centeringDriftPercent > 10 || circularityErrorPercent > 20) {
    qualityRating = 'POOR_DRIFT';
  } else if (centeringDriftPercent > 5 || circularityErrorPercent > 12) {
    qualityRating = 'MODERATE';
  } else if (circularityErrorPercent > 6) {
    qualityRating = 'GOOD';
  }

  return {
    circularityErrorPercent,
    maxRadius,
    minRadius,
    centeringDriftPercent,
    isCenteringAccurate,
    totalPointsSampled: coordinates.length,
    qualityRating
  };
}
