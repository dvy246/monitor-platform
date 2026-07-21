import { describe, it, expect } from 'vitest';
import { calculateViewingAngleMetrics } from './ViewingAngleEngine';

describe('ViewingAngleEngine Unit Tests', () => {
  it('should calculate near-perfect 178 degree performance for OLED panels', () => {
    const res = calculateViewingAngleMetrics(45, 'OLED');
    expect(res.contrastRatio).toBeGreaterThan(100);
    expect(res.isCompliant).toBe(true);
    expect(res.gammaShiftDelta).toBeLessThan(0.05);
  });

  it('should detect high VA gamma shift at 45 degree viewing offset', () => {
    const vaRes = calculateViewingAngleMetrics(45, 'VA');
    const ipsRes = calculateViewingAngleMetrics(45, 'IPS');
    expect(vaRes.gammaShiftDelta).toBeGreaterThan(ipsRes.gammaShiftDelta);
  });

  it('should flag TN panel contrast failure when contrast ratio falls below 10:1', () => {
    const tnRes = calculateViewingAngleMetrics(75, 'TN');
    expect(tnRes.contrastRatio).toBeLessThan(10);
    expect(tnRes.isCompliant).toBe(false);
  });
});
