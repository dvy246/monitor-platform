import { describe, it, expect } from 'vitest';
import { calculateDbfsFromSamples, evaluateMicSnr, calculateAudioHealthScore, evaluateSampleRateQuality } from './MicNoiseFloorEngine';

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

  it('should calculate 100 audio health score for pristine studio microphone setup', () => {
    const score = calculateAudioHealthScore(-65, 50, false, 48000);
    expect(score).toBe(100);
  });

  it('should penalize health score for high noise floor, clipping, and low sample rate', () => {
    const score = calculateAudioHealthScore(-35, 20, true, 16000);
    expect(score).toBeLessThan(50);
  });

  it('should correctly categorize 48kHz, 44.1kHz, and 16kHz sample rates', () => {
    const studio = evaluateSampleRateQuality(48000);
    expect(studio.category).toBe('STUDIO_BROADCAST');

    const cd = evaluateSampleRateQuality(44100);
    expect(cd.category).toBe('STANDARD_AUDIO');

    const phone = evaluateSampleRateQuality(16000);
    expect(phone.category).toBe('NARROWBAND_TELEPHONY');
  });
});
