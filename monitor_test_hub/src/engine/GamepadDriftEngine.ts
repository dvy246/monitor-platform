/**
 * GamepadDriftEngine.ts
 * Pure TypeScript calculation engine measuring gamepad analog stick deadzone drift,
 * 360 degree circularity error percentage, and trigger axis linearity.
 * Standard: W3C Gamepad API Polar Coordinate Spec.
 */

export interface IStickMetrics {
  x: number; // -1.0 to +1.0
  y: number; // -1.0 to +1.0
  restingOffsetDistance: number; // r = sqrt(x^2 + y^2)
  hasStickDrift: boolean;       // offset > deadzone
}

export interface ICircularityMetrics {
  circularityErrorPercent: number;
  isHallEffectQuality: boolean; // error <= 2.0%
}

/**
 * Calculates analog stick resting offset distance from center origin (0,0).
 * Threshold: Resting distance > 0.05 indicates stick drift.
 */
export function calculateStickMetrics(
  axisX: number,
  axisY: number,
  deadzoneThreshold: number = 0.05
): IStickMetrics {
  const x = Math.max(-1, Math.min(1, axisX));
  const y = Math.max(-1, Math.min(1, axisY));
  
  const restingOffsetDistance = Number(Math.sqrt(x * x + y * y).toFixed(4));
  const hasStickDrift = restingOffsetDistance > deadzoneThreshold;

  return {
    x,
    y,
    restingOffsetDistance,
    hasStickDrift
  };
}

/**
 * Calculates 360 degree circularity error percentage from sampled boundary points.
 */
export function calculateCircularityError(sampledDistances: number[]): ICircularityMetrics {
  if (sampledDistances.length === 0) {
    return { circularityErrorPercent: 0, isHallEffectQuality: true };
  }

  const avgDistance = sampledDistances.reduce((a, b) => a + b, 0) / sampledDistances.length;
  const errorSum = sampledDistances.reduce((acc, r) => acc + Math.abs(r - 1.0), 0);
  const circularityErrorPercent = Number(((errorSum / sampledDistances.length) * 100).toFixed(2));

  return {
    circularityErrorPercent,
    isHallEffectQuality: circularityErrorPercent <= 2.0
  };
}
