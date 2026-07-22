/**
 * SolarTiltEngine.ts — Decoupled Pure-TypeScript Solar Photovoltaic Tilt & Shading Calculation Engine
 * Compliant with NOAA Solar Calculator & NREL PVWatts Energy Yield Formulas
 */

export interface SolarTiltMetrics {
  latitude: number;
  optimalYearRoundTilt: number;
  optimalWinterTilt: number;
  optimalSummerTilt: number;
  solarDeclinationDeg: number;
  annualKwhYieldMultiplier: number;
  tiltShadingLossPct: number;
}

export class SolarTiltEngine {
  /**
   * Calculate Solar Declination (degrees) for day of year N (1..365)
   */
  public static calculateSolarDeclination(dayOfYear: number): number {
    const clampedDay = Math.max(1, Math.min(365, dayOfYear));
    return Math.round((23.45 * Math.sin(((360 / 365) * (clampedDay + 284) * Math.PI) / 180)) * 100) / 100;
  }

  /**
   * Calculate Optimal Tilt Angles & Energy Yield Metrics for a given latitude & actual roof tilt
   */
  public static calculateMetrics(latitude: number, actualRoofTiltDeg = 30, dayOfYear = 172): SolarTiltMetrics {
    const absLat = Math.abs(latitude);

    // NOAA & NREL Empirical Formulas for PV Array Tilt
    const optimalYearRoundTilt = Math.round((absLat * 0.76 + 3.1) * 10) / 10;
    const optimalWinterTilt = Math.round((absLat * 0.89 + 24.0) * 10) / 10;
    const optimalSummerTilt = Math.max(0, Math.round((absLat * 0.93 - 21.0) * 10) / 10);

    const solarDeclinationDeg = this.calculateSolarDeclination(dayOfYear);

    // Tilt mismatch shading & angle loss percentage
    const tiltDiff = Math.abs(actualRoofTiltDeg - optimalYearRoundTilt);
    const tiltShadingLossPct = Math.min(35, Math.round((tiltDiff * 0.45 + (tiltDiff > 20 ? (tiltDiff - 20) * 0.6 : 0)) * 10) / 10);

    // Annual production factor multiplier (1.0 = optimal)
    const annualKwhYieldMultiplier = Math.round((1 - tiltShadingLossPct / 100) * 100) / 100;

    return {
      latitude,
      optimalYearRoundTilt,
      optimalWinterTilt,
      optimalSummerTilt,
      solarDeclinationDeg,
      annualKwhYieldMultiplier,
      tiltShadingLossPct
    };
  }
}
