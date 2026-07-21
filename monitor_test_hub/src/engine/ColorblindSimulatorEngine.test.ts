import { describe, it, expect } from 'vitest';
import { simulateColorblindRgb } from './ColorblindSimulatorEngine';

describe('ColorblindSimulatorEngine Unit Tests', () => {
  it('should transform pure red (255,0,0) into Protanopia LMS projection', () => {
    const sim = simulateColorblindRgb({ r: 255, g: 0, b: 0 }, 'protanopia');
    expect(sim.r).toBe(145);
    expect(sim.g).toBe(142);
    expect(sim.b).toBe(0);
  });

  it('should transform pure green (0,255,0) into Deuteranopia projection', () => {
    const sim = simulateColorblindRgb({ r: 0, g: 255, b: 0 }, 'deuteranopia');
    expect(sim.r).toBe(96);
    expect(sim.g).toBe(77);
  });

  it('should transform pure blue (0,0,255) into Tritanopia projection', () => {
    const sim = simulateColorblindRgb({ r: 0, g: 0, b: 255 }, 'tritanopia');
    expect(sim.r).toBe(0);
    expect(sim.g).toBe(145);
    expect(sim.b).toBe(134);
  });
});
