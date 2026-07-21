/**
 * StylusPressureEngine.ts
 * Pure TypeScript calculation engine evaluating digital stylus pen pressure sensitivity (0.00 to 1.00),
 * tilt angle vectors (X/Y tilt), and azimuth/altitude orientation.
 * Standard: W3C Pointer Events Level 3 Spec (PointerEvent.pressure, tiltX, tiltY).
 */

export interface IStylusPoint {
  pressure: number; // 0.0 to 1.0
  tiltX: number;    // -90 to +90 degrees
  tiltY: number;    // -90 to +90 degrees
  twist?: number;   // 0 to 359 degrees
}

export interface IStylusAnalysis {
  maxPressure: number;
  pressureStepResolution: number; // estimated discrete steps (e.g. 2048, 4096, 8192)
  isActiveStylus: boolean;
  maxTiltAngleDegrees: number;
}

/**
 * Evaluates pressure stroke dataset to compute pressure step resolution and tilt metrics.
 */
export function analyzeStylusStroke(points: IStylusPoint[]): IStylusAnalysis {
  if (points.length === 0) {
    return {
      maxPressure: 0,
      pressureStepResolution: 0,
      isActiveStylus: false,
      maxTiltAngleDegrees: 0
    };
  }

  const pressures = points.map((p) => Math.max(0, Math.min(1, p.pressure)));
  const maxPressure = Number(Math.max(...pressures).toFixed(3));

  // Count unique pressure values to estimate digitizer resolution steps
  const uniquePressures = new Set(pressures.map((p) => Math.round(p * 4096)));
  const isActiveStylus = uniquePressures.size > 5;
  const pressureStepResolution = isActiveStylus ? (uniquePressures.size > 1000 ? 8192 : 4096) : 2048;

  const tilts = points.map((p) => Math.max(Math.abs(p.tiltX), Math.abs(p.tiltY)));
  const maxTiltAngleDegrees = Math.round(Math.max(...tilts));

  return {
    maxPressure,
    pressureStepResolution,
    isActiveStylus,
    maxTiltAngleDegrees
  };
}
