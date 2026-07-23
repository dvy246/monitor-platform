import { describe, it, expect } from 'vitest';
import { WebcamDiagnosticsEngine } from './WebcamDiagnosticsEngine';

describe('WebcamDiagnosticsEngine Unit Tests', () => {
  it('correctly classifies 4K, 1080p, 720p, and SD camera resolutions', () => {
    const uhd = WebcamDiagnosticsEngine.classifyResolution(3840, 2160);
    expect(uhd.tier).toBe('4K_UHD');
    expect(uhd.aspectRatio).toBe('16:9');

    const fhd = WebcamDiagnosticsEngine.classifyResolution(1920, 1080);
    expect(fhd.tier).toBe('FULL_HD_1080P');
    expect(fhd.aspectRatio).toBe('16:9');

    const hd = WebcamDiagnosticsEngine.classifyResolution(1280, 720);
    expect(hd.tier).toBe('HD_720P');

    const sd = WebcamDiagnosticsEngine.classifyResolution(640, 480);
    expect(sd.tier).toBe('SD_DEF');
    expect(sd.aspectRatio).toBe('4:3');
  });

  it('calculates frame rate jitter standard deviation correctly', () => {
    const timestamps = [1000, 1033.3, 1066.6, 1100.0, 1133.3]; // Perfect ~30fps (33.3ms interval)
    const jitter = WebcamDiagnosticsEngine.calculateFpsJitter(timestamps);
    expect(jitter).toBeLessThan(1.0);
  });

  it('calculates camera health score index accurately', () => {
    const topScore = WebcamDiagnosticsEngine.calculateHealthScore(3840, 2160, 60, 0.4);
    expect(topScore).toBe(100);
    expect(WebcamDiagnosticsEngine.getVerdict(topScore)).toBe('EXCELLENT');

    const midScore = WebcamDiagnosticsEngine.calculateHealthScore(1920, 1080, 30, 1.0);
    expect(midScore).toBeGreaterThanOrEqual(80);

    const lowScore = WebcamDiagnosticsEngine.calculateHealthScore(640, 480, 15, 6.0);
    expect(lowScore).toBeLessThan(50);
    expect(WebcamDiagnosticsEngine.getVerdict(lowScore)).toBe('POOR');
  });

  it('generates 16-character SHA-256 signature hash', async () => {
    const report = {
      resolution: WebcamDiagnosticsEngine.classifyResolution(1920, 1080),
      actualFps: 60,
      targetFps: 60,
      fpsJitterMs: 0.5,
      healthScore: 95,
      verdict: 'EXCELLENT' as const,
      timestamp: '2026-07-23T09:00:00Z'
    };

    const hash = await WebcamDiagnosticsEngine.generateSignature(report);
    expect(hash).toHaveLength(16);
    expect(typeof hash).toBe('string');
  });
});
