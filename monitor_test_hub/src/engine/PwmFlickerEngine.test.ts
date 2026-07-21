import { describe, it, expect } from 'vitest';
import { calculatePwmMetrics, calculateCameraShutterBandWidth } from './PwmFlickerEngine';

describe('PwmFlickerEngine Unit Tests', () => {
  it('should categorize DC dimming displays with <2% flicker as ZERO_RISK', () => {
    const metrics = calculatePwmMetrics(100, 99, 2000);
    expect(metrics.percentFlicker).toBeLessThan(2);
    expect(metrics.isDcDimming).toBe(true);
    expect(metrics.ieeeRiskCategory).toBe('ZERO_RISK');
  });

  it('should categorize low frequency PWM (<240Hz) as HIGH_RISK under IEEE 1789', () => {
    const metrics = calculatePwmMetrics(100, 0, 180);
    expect(metrics.percentFlicker).toBe(100);
    expect(metrics.ieeeRiskCategory).toBe('HIGH_RISK');
  });

  it('should compute camera shutter band width in pixels', () => {
    const bandPx = calculateCameraShutterBandWidth(0.001, 240, 1080);
    expect(bandPx).toBeGreaterThan(0);
  });
});
