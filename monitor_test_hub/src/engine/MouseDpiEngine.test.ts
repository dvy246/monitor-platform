import { describe, it, expect } from 'vitest';
import { calculateMouseDpi } from './MouseDpiEngine';

describe('MouseDpiEngine Unit Tests', () => {
  it('should calculate DPI accurately for a 800 DPI mouse moved 25.4mm (1 inch)', () => {
    const report = calculateMouseDpi(800, 25.4);
    expect(report.calculatedDpi).toBe(800);
    expect(report.roundedDpi).toBe(800);
    expect(report.targetDistanceInches).toBe(1.0);
    expect(report.trueDpiAccuracyPercent).toBe(100);
  });

  it('should calculate eDPI based on in-game sensitivity multiplier', () => {
    const report = calculateMouseDpi(800, 25.4, 1.5);
    expect(report.eDpi).toBe(1200);
  });

  it('should handle zero or negative input distance gracefully', () => {
    const report = calculateMouseDpi(0, 0);
    expect(report.calculatedDpi).toBe(0);
    expect(report.roundedDpi).toBe(0);
  });

  it('should match nearest standard DPI step (e.g. 1590 pixels over 1 inch -> 1600 DPI)', () => {
    const report = calculateMouseDpi(1590, 25.4);
    expect(report.calculatedDpi).toBe(1590);
    expect(report.roundedDpi).toBe(1600);
    expect(report.trueDpiAccuracyPercent).toBeGreaterThanOrEqual(99);
  });
});
