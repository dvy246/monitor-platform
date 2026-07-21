import { describe, it, expect } from 'vitest';
import { analyzeGeometryDistortion, getCalibrationCircleRadius } from './GeometryDistortionEngine';

describe('GeometryDistortionEngine Unit Tests', () => {
  it('should validate 1920x1080 resolution as exact 16:9 square pixels with 0% error', () => {
    const analysis = analyzeGeometryDistortion(1920, 1080, '16:9');
    expect(analysis.scalingErrorPercent).toBe(0);
    expect(analysis.hasDistortion).toBe(false);
    expect(analysis.isSquarePixel).toBe(true);
  });

  it('should detect geometric distortion when 16:9 aspect is forced on 1920x1200 (16:10) resolution', () => {
    const analysis = analyzeGeometryDistortion(1920, 1200, '16:9');
    expect(analysis.scalingErrorPercent).toBeGreaterThan(5.0);
    expect(analysis.hasDistortion).toBe(true);
    expect(analysis.isSquarePixel).toBe(false);
  });

  it('should compute valid concentric circle radius for 2560x1440 resolution', () => {
    const radius = getCalibrationCircleRadius(2560, 1440);
    expect(radius).toBe(576);
  });
});
