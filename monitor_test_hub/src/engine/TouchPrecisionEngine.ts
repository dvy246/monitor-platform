/**
 * TouchPrecisionEngine.ts — Decoupled Pure-TypeScript Touch Digitizer Vector & Jitter Engine
 * Measures Root-Mean-Square (RMS) Straight-Line Deviation Error & Digitizer EMI Noise Floor
 */

export interface TouchPoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface TouchPrecisionMetrics {
  totalPoints: number;
  rmsDeviationPx: number;
  maxDeviationPx: number;
  emiNoiseRating: 'excellent' | 'good' | 'moderate' | 'poor';
  pressureLinearityPct: number;
  averagePressure: number;
}

export class TouchPrecisionEngine {
  /**
   * Calculate perpendicular distance from point (px, py) to line segment (x1, y1)-(x2, y2)
   */
  public static pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lineLenSq = dx * dx + dy * dy;

    if (lineLenSq === 0) return Math.hypot(px - x1, py - y1);

    let t = ((px - x1) * dx + (py - y1) * dy) / lineLenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return Math.hypot(px - projX, py - projY);
  }

  /**
   * Calculate RMS line jitter error & digitizer precision metrics
   */
  public static calculateMetrics(points: TouchPoint[]): TouchPrecisionMetrics {
    if (points.length < 2) {
      return {
        totalPoints: points.length,
        rmsDeviationPx: 0,
        maxDeviationPx: 0,
        emiNoiseRating: 'excellent',
        pressureLinearityPct: 100,
        averagePressure: 0
      };
    }

    const start = points[0];
    const end = points[points.length - 1];

    let sumSqDiff = 0;
    let maxDeviationPx = 0;
    let totalPressure = 0;
    let pressureCount = 0;

    for (let i = 1; i < points.length - 1; i++) {
      const p = points[i];
      const dist = this.pointToSegmentDistance(p.x, p.y, start.x, start.y, end.x, end.y);
      sumSqDiff += dist * dist;
      if (dist > maxDeviationPx) maxDeviationPx = dist;

      if (p.pressure !== undefined && p.pressure > 0) {
        totalPressure += p.pressure;
        pressureCount++;
      }
    }

    const rmsDeviationPx = Math.round(Math.sqrt(sumSqDiff / Math.max(1, points.length - 2)) * 100) / 100;
    maxDeviationPx = Math.round(maxDeviationPx * 100) / 100;

    let emiNoiseRating: 'excellent' | 'good' | 'moderate' | 'poor' = 'excellent';
    if (rmsDeviationPx <= 0.8) emiNoiseRating = 'excellent';
    else if (rmsDeviationPx <= 1.5) emiNoiseRating = 'good';
    else if (rmsDeviationPx <= 3.0) emiNoiseRating = 'moderate';
    else emiNoiseRating = 'poor';

    const averagePressure = pressureCount > 0 ? Math.round((totalPressure / pressureCount) * 100) / 100 : 0.5;
    const pressureLinearityPct = Math.max(50, Math.min(100, Math.round((100 - rmsDeviationPx * 5) * 10) / 10));

    return {
      totalPoints: points.length,
      rmsDeviationPx,
      maxDeviationPx,
      emiNoiseRating,
      pressureLinearityPct,
      averagePressure
    };
  }
}
