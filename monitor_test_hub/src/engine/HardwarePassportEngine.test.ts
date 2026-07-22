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

  it('deducts points for high OLED burn-in risk category and dead pixels', () => {
    const normal = HardwarePassportEngine.calculateHealthScore({
      vsyncFps: 120,
      colorDepth: 24,
      devicePixelRatio: 1,
      touchSupport: false,
      maxTouchPoints: 0,
      oledRiskCategory: 'MINIMAL'
    });

    const highRiskWithDefects = HardwarePassportEngine.calculateHealthScore({
      vsyncFps: 120,
      colorDepth: 24,
      devicePixelRatio: 1,
      touchSupport: false,
      maxTouchPoints: 0,
      oledRiskCategory: 'HIGH_RISK',
      deadPixels: 2,
      stuckPixels: 1
    });

    expect(highRiskWithDefects.totalScore).toBeLessThan(normal.totalScore);
    expect(highRiskWithDefects.colorUniformityScore).toBeLessThan(normal.colorUniformityScore);
  });

  it('generates 16-character signature hash and verifies signature integrity', async () => {
    const data = {
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
    };

    const hash = await HardwarePassportEngine.generateSignature(data);
    expect(hash).toHaveLength(16);
    expect(typeof hash).toBe('string');

    const isValid = await HardwarePassportEngine.verifySignature({
      ...data,
      signatureHash: hash
    });
    expect(isValid).toBe(true);

    const isTamperedValid = await HardwarePassportEngine.verifySignature({
      ...data,
      healthScore: 40, // Tampered score
      signatureHash: hash
    });
    expect(isTamperedValid).toBe(false);
  });

  it('generates SVG badge markup containing passport metrics', () => {
    const svg = HardwarePassportEngine.generateBadgeSvg({
      timestamp: '2026-07-22T00:00:00Z',
      resolution: '3840x2160',
      devicePixelRatio: 2,
      colorDepth: 30,
      vsyncFps: 240,
      touchSupport: true,
      maxTouchPoints: 10,
      subpixelLayout: 'RGB Stripe',
      oledRiskCategory: 'MINIMAL',
      vrrRange: '48Hz - 240Hz',
      hdrSupport: 'HDR10',
      healthScore: 98,
      signatureHash: 'a4f8b92c103e57f1'
    });

    expect(svg).toContain('<svg');
    expect(svg).toContain('VERIFIED DISPLAY PASSPORT');
    expect(svg).toContain('#a4f8b92c');
    expect(svg).toContain('98');
    expect(svg).toContain('ISO 9241-307 PASS');
  });

  it('generates embed snippet formats for iframe, markdown, and html', () => {
    const snippets = HardwarePassportEngine.generateEmbedSnippets('a4f8b92c103e57f1', 98);

    expect(snippets.iframeSnippet).toContain('<iframe src="https://monitor-testing.pages.dev/embed/passport?hash=a4f8b92c103e57f1"');
    expect(snippets.markdownSnippet).toContain('[![Verified Display Passport #a4f8b92c103e57f1');
    expect(snippets.htmlBadgeSnippet).toContain('<a href="https://monitor-testing.pages.dev/passport/a4f8b92c103e57f1"');
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

