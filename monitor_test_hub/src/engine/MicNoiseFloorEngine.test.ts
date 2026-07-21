import { describe, it, expect } from 'vitest';
import { calculateDbfsFromSamples, evaluateMicSnr } from './MicNoiseFloorEngine';

describe('MicNoiseFloorEngine Unit Tests', () => {
  it('should calculate -6.0 dBFS for sine wave PCM audio samples', () => {
    const samples = new Float32Array(100).fill(0.5);
    const dbfs = calculateDbfsFromSamples(samples);
    expect(dbfs).toBe(-6.0);
  });

  it('should evaluate EXCELLENT microphone clarity for SNR >= 45dB', () => {
    const analysis = evaluateMicSnr(-65, -12); // SNR = 53 dB
    expect(analysis.snrDb).toBe(53);
    expect(analysis.clarityRating).toBe('EXCELLENT');
    expect(analysis.hasClippingDistortion).toBe(false);
  });

  it('should flag POOR clarity when clipping distortion occurs at 0 dBFS', () => {
    const analysis = evaluateMicSnr(-50, 0); // Clipping
    expect(analysis.hasClippingDistortion).toBe(true);
    expect(analysis.clarityRating).toBe('POOR');
  });
});
