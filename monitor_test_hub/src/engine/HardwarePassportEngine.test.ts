import { describe, it, expect } from 'vitest';
import { HardwarePassportEngine } from './HardwarePassportEngine';

describe('HardwarePassportEngine', () => {
  it('calculates 100 health score for top-tier 240Hz 10-bit touch hardware', () => {
    const breakdown = HardwarePassportEngine.calculateHealthScore({
      vsyncFps: 240,
      colorDepth: 30,
      devicePixelRatio: 2,
      touchSupport: true,
      maxTouchPoints: 10,
      oledRiskCategory: 'MINIMAL'
    });

    expect(breakdown.totalScore).toBe(100);
    expect(breakdown.pacingScore).toBe(35);
    expect(breakdown.colorUniformityScore).toBe(35);
    expect(breakdown.digitizerScore).toBe(30);
    expect(breakdown.verdict).toBe('EXCELLENT');
  });

  it('calculates appropriate score for 60Hz 24-bit desktop display', () => {
    const breakdown = HardwarePassportEngine.calculateHealthScore({
      vsyncFps: 60,
      colorDepth: 24,
      devicePixelRatio: 1,
      touchSupport: false,
      maxTouchPoints: 0,
      oledRiskCategory: 'MINIMAL'
    });

    expect(breakdown.totalScore).toBeGreaterThanOrEqual(70);
    expect(breakdown.pacingScore).toBe(22);
    expect(breakdown.colorUniformityScore).toBe(30);
  });

  it('deducts points for high OLED burn-in risk category', () => {
    const normal = HardwarePassportEngine.calculateHealthScore({
      vsyncFps: 120,
      colorDepth: 24,
      devicePixelRatio: 1,
      touchSupport: false,
      maxTouchPoints: 0,
      oledRiskCategory: 'MINIMAL'
    });

    const highRisk = HardwarePassportEngine.calculateHealthScore({
      vsyncFps: 120,
      colorDepth: 24,
      devicePixelRatio: 1,
      touchSupport: false,
      maxTouchPoints: 0,
      oledRiskCategory: 'HIGH_RISK'
    });

    expect(highRisk.totalScore).toBeLessThan(normal.totalScore);
    expect(highRisk.colorUniformityScore).toBe(normal.colorUniformityScore - 10);
  });

  it('generates 16-character signature hash', async () => {
    const hash = await HardwarePassportEngine.generateSignature({
      timestamp: '2026-07-22T00:00:00Z',
      resolution: '3840x2160',
      devicePixelRatio: 2,
      colorDepth: 30,
      vsyncFps: 144,
      touchSupport: false,
      maxTouchPoints: 0,
      subpixelLayout: 'RGB Stripe',
      oledRiskCategory: 'MINIMAL',
      vrrRange: '48Hz - 144Hz',
      hdrSupport: 'HDR10',
      healthScore: 92
    });

    expect(hash).toHaveLength(16);
    expect(typeof hash).toBe('string');
  });

  it('creates JSON Blob with passport contents', () => {
    const blob = HardwarePassportEngine.createJsonBlob({
      timestamp: '2026-07-22T00:00:00Z',
      resolution: '1920x1080',
      devicePixelRatio: 1,
      colorDepth: 24,
      vsyncFps: 60,
      touchSupport: true,
      maxTouchPoints: 5,
      subpixelLayout: 'RGB Stripe',
      oledRiskCategory: 'MINIMAL',
      vrrRange: 'None',
      hdrSupport: 'SDR',
      healthScore: 80,
      signatureHash: 'abc123def4567890'
    });

    expect(blob.type).toBe('application/json');
    expect(blob.size).toBeGreaterThan(50);
  });
});
