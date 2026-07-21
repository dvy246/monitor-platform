import { describe, it, expect } from 'vitest';
import { calculateHaloMetrics, calculateDimmingZones } from './LocalDimmingEngine';

describe('LocalDimmingEngine Unit Tests', () => {
  it('should calculate negligible blooming for true black OLED performance (0 halo luminance)', () => {
    const metrics = calculateHaloMetrics(1000, 0, 0);
    expect(metrics.bloomingRatio).toBe(0);
    expect(metrics.bloomingSeverity).toBe('NEGLIGIBLE');
  });

  it('should flag moderate blooming when halo ratio exceeds 0.05', () => {
    const metrics = calculateHaloMetrics(1000, 80, 45);
    expect(metrics.bloomingRatio).toBe(0.08);
    expect(metrics.bloomingSeverity).toBe('MODERATE');
  });

  it('should flag severe blooming when halo ratio exceeds 0.15', () => {
    const metrics = calculateHaloMetrics(1000, 200, 90);
    expect(metrics.bloomingRatio).toBe(0.2);
    expect(metrics.bloomingSeverity).toBe('SEVERE');
  });

  it('should estimate 1152 zone dimensions for 3840x2160 screen', () => {
    const zones = calculateDimmingZones(3840, 2160, 1152);
    expect(zones.horizontalZones).toBe(44);
    expect(zones.verticalZones).toBe(25);
    expect(zones.totalZones).toBe(1100); // rounded grid product
  });
});
