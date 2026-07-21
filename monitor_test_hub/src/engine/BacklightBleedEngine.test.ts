import { describe, it, expect } from 'vitest';
import { calculateBacklightBleed, getSamplingBoxCoordinates } from './BacklightBleedEngine';

describe('BacklightBleedEngine Unit Tests', () => {
  it('should calculate zero variance for perfectly uniform panel', () => {
    const luminance = { topLeft: 10, topRight: 10, bottomLeft: 10, bottomRight: 10, center: 10 };
    const analysis = calculateBacklightBleed(luminance);
    expect(analysis.variancePercent).toBe(0);
    expect(analysis.isUniform).toBe(true);
    expect(analysis.leakageSeverity).toBe('EXCELLENT');
  });

  it('should flag moderate leakage when corner delta exceeds 15% threshold', () => {
    const luminance = { topLeft: 25, topRight: 10, bottomLeft: 10, bottomRight: 10, center: 20 };
    const analysis = calculateBacklightBleed(luminance);
    expect(analysis.variancePercent).toBe(25);
    expect(analysis.isUniform).toBe(false);
    expect(analysis.leakageSeverity).toBe('MODERATE');
  });

  it('should flag severe leakage when variance exceeds 35%', () => {
    const luminance = { topLeft: 40, topRight: 10, bottomLeft: 10, bottomRight: 10, center: 20 };
    const analysis = calculateBacklightBleed(luminance);
    expect(analysis.variancePercent).toBe(100);
    expect(analysis.isUniform).toBe(false);
    expect(analysis.leakageSeverity).toBe('SEVERE');
  });

  it('should compute valid sampling coordinates for 1920x1080 resolution', () => {
    const coords = getSamplingBoxCoordinates(1920, 1080, 80);
    expect(coords.topLeft).toEqual({ x: 20, y: 20, width: 80, height: 80 });
    expect(coords.topRight.x).toBe(1820);
    expect(coords.center.x).toBe(920);
  });
});
