/**
 * GeometryDistortionEngine.ts
 * Pure TypeScript calculation engine validating aspect ratio scaling (16:9, 16:10, 21:9, 32:9)
 * and geometric non-square pixel distortion error.
 * Standard: EBU Tech 3325 Visual Geometry Test Grid Specs.
 */

export type AspectRatioType = '16:9' | '16:10' | '21:9' | '32:9' | '4:3';

export interface IGeometryAnalysis {
  expectedAspectRatio: AspectRatioType;
  expectedRatioValue: number;
  measuredRatioValue: number;
  scalingErrorPercent: number;
  hasDistortion: boolean;
  isSquarePixel: boolean;
}

const ASPECT_RATIO_VALUES: Record<AspectRatioType, number> = {
  '16:9': 16 / 9,
  '16:10': 16 / 10,
  '21:9': 21 / 9,
  '32:9': 32 / 9,
  '4:3': 4 / 3
};

/**
 * Calculates geometric aspect ratio scaling error percentage.
 * Threshold: Scaling error > 1.0% indicates stretched or distorted pixels.
 */
export function analyzeGeometryDistortion(
  pixelWidth: number,
  pixelHeight: number,
  expectedAspectRatio: AspectRatioType = '16:9'
): IGeometryAnalysis {
  const safeW = Math.max(1, pixelWidth);
  const safeH = Math.max(1, pixelHeight);
  const measuredRatioValue = Number((safeW / safeH).toFixed(4));
  const expectedRatioValue = Number(ASPECT_RATIO_VALUES[expectedAspectRatio].toFixed(4));

  const scalingErrorPercent = Number(
    (Math.abs(measuredRatioValue - expectedRatioValue) / expectedRatioValue * 100).toFixed(2)
  );

  const hasDistortion = scalingErrorPercent > 1.0;
  const isSquarePixel = scalingErrorPercent <= 0.2;

  return {
    expectedAspectRatio,
    expectedRatioValue,
    measuredRatioValue,
    scalingErrorPercent,
    hasDistortion,
    isSquarePixel
  };
}

/**
 * Returns pixel radius dimensions for rendering true visual concentric calibration circles.
 */
export function getCalibrationCircleRadius(width: number, height: number): number {
  return Math.round(Math.min(width, height) * 0.4);
}
