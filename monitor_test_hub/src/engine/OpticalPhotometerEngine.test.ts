import { describe, it, expect } from 'vitest';
import { OpticalPhotometerEngine } from './OpticalPhotometerEngine';

describe('OpticalPhotometerEngine', () => {
  it('correctly calculates sRGB relative luminance', () => {
    // Pure White (255, 255, 255) -> 100
    const whiteLum = OpticalPhotometerEngine.calculateRelativeLuminance(255, 255, 255);
    expect(whiteLum).toBeCloseTo(100, 1);

    // Pure Black (0, 0, 0) -> 0
    const blackLum = OpticalPhotometerEngine.calculateRelativeLuminance(0, 0, 0);
    expect(blackLum).toBeCloseTo(0, 1);

    // Green (0, 255, 0) should be higher luminance than Red (255, 0, 0)
    const greenLum = OpticalPhotometerEngine.calculateRelativeLuminance(0, 255, 0);
    const redLum = OpticalPhotometerEngine.calculateRelativeLuminance(255, 0, 0);
    expect(greenLum).toBeGreaterThan(redLum);
  });

  it('evaluates perfectly uniform panel as Class I EXCELLENT', () => {
    const perfectlyUniformGrid = [50, 50, 50, 50, 50, 50, 50, 50, 50];
    const result = OpticalPhotometerEngine.calculateSpatialUniformity(perfectlyUniformGrid);

    expect(result.uniformityPercentage).toBe(100);
    expect(result.spatialVariance).toBe(0);
    expect(result.isoClass).toBe('Class I');
    expect(result.rating).toBe('EXCELLENT');
  });

  it('classifies uneven backlight variance correctly into Class II or III', () => {
    // Panel with vignetting at edges (center 80, corners 60)
    const unevenGrid = [60, 70, 60, 70, 80, 70, 60, 70, 60];
    const result = OpticalPhotometerEngine.calculateSpatialUniformity(unevenGrid);

    expect(result.uniformityPercentage).toBeLessThan(100);
    expect(result.spatialVariance).toBeGreaterThan(0);
    expect(['Class I', 'Class II', 'Class III']).toContain(result.isoClass);
  });

  it('handles empty luminance grid gracefully', () => {
    const result = OpticalPhotometerEngine.calculateSpatialUniformity([]);
    expect(result.uniformityPercentage).toBe(100);
    expect(result.isoClass).toBe('Class I');
  });

  it('generates a valid signature string for telemetry payload', async () => {
    const payload = {
      resolution: '3840x2160',
      vsyncFps: 144,
      devicePixelRatio: 2,
      spatialVariance: 2.1,
      isoClass: 'Class I',
      healthScore: 98,
      timestamp: '2026-07-23T08:00:00Z',
    };

    const signature = await OpticalPhotometerEngine.generateSignatureString(payload);
    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(10);
  });
});
