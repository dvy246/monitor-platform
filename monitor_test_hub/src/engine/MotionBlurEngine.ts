/**
 * MotionBlurEngine.ts
 * Pure TypeScript calculation engine analyzing display motion blur, sample-and-hold MPRT,
 * pursuit velocity, and overdrive overshoot trail artifacts.
 * Standard: ISO 9241-305 Motion Picture Response Time Specs.
 */

export interface IMotionMetrics {
  refreshRateHz: number;
  pixelsPerSecond: number;
  pixelsPerFrame: number;
  estimatedMprtMs: number;
  overshootDelta: number;
  hasCoronaTrail: boolean;
}

/**
 * Calculates pixels per frame and estimated Motion Picture Response Time (MPRT) ms.
 * For sample-and-hold LCDs, MPRT is bounded by 1000 / refreshRate.
 */
export function calculateMotionMetrics(
  refreshRateHz: number,
  pixelsPerSecond: number,
  overdriveOvershootFactor: number = 0
): IMotionMetrics {
  const safeHz = Math.max(30, refreshRateHz);
  const pixelsPerFrame = Number((pixelsPerSecond / safeHz).toFixed(2));
  
  // Sample-and-hold MPRT estimation (ms)
  const estimatedMprtMs = Number((1000 / safeHz).toFixed(2));
  
  const overshootDelta = Number((overdriveOvershootFactor * 25.5).toFixed(2));
  const hasCoronaTrail = overdriveOvershootFactor > 0.35;

  return {
    refreshRateHz: safeHz,
    pixelsPerSecond,
    pixelsPerFrame,
    estimatedMprtMs,
    overshootDelta,
    hasCoronaTrail
  };
}

/**
 * Computes pursuit camera pattern positions across animation frame timestamps.
 */
export function calculatePursuitPosition(
  elapsedMs: number,
  speedPxPerSec: number,
  screenWidth: number,
  patternWidth: number = 100
): number {
  const safeWidth = Math.max(patternWidth * 2, screenWidth);
  const totalTravel = safeWidth + patternWidth;
  const rawX = (elapsedMs / 1000) * speedPxPerSec;
  return Math.round(rawX % totalTravel) - patternWidth;
}
