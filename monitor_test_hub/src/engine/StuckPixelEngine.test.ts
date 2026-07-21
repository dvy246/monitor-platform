import { describe, it, expect } from 'vitest';
import { getStimulationFrame, validateStimulatorConfig } from './StuckPixelEngine';

describe('StuckPixelEngine Unit Tests', () => {
  it('should cycle through RGB colors at 30Hz stimulation frequency', () => {
    const frame0 = getStimulationFrame(0, 30);
    const frame1 = getStimulationFrame(35, 30); // ~1 frame later (35ms > 33.33ms)
    expect(frame0).toEqual([255, 0, 0]);
    expect(frame1).toEqual([0, 255, 0]);
  });

  it('should validate and sanitize stimulator config bounds', () => {
    const config = validateStimulatorConfig({ frequencyHz: 120, durationMinutes: 300 });
    expect(config.frequencyHz).toBe(60); // capped at 60Hz max
    expect(config.durationMinutes).toBe(120); // capped at 120min max
    expect(config.boxSizePx).toBe(80); // default fallback
  });
});
