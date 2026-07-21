import { describe, it, expect } from 'vitest';
import { analyzeStylusStroke } from './StylusPressureEngine';

describe('StylusPressureEngine Unit Tests', () => {
  it('should calculate max pressure and active stylus status for pressure strokes', () => {
    const points = Array.from({ length: 50 }, (_, i) => ({
      pressure: i / 50,
      tiltX: i * 0.5,
      tiltY: 0
    }));

    const analysis = analyzeStylusStroke(points);
    expect(analysis.maxPressure).toBe(0.98);
    expect(analysis.isActiveStylus).toBe(true);
    expect(analysis.maxTiltAngleDegrees).toBe(25);
  });

  it('should identify passive non-pressure styluses with fixed 0.5 pressure', () => {
    const points = Array.from({ length: 10 }, () => ({
      pressure: 0.5,
      tiltX: 0,
      tiltY: 0
    }));

    const analysis = analyzeStylusStroke(points);
    expect(analysis.isActiveStylus).toBe(false);
  });
});
