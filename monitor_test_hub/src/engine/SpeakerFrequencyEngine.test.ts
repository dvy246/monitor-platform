import { describe, it, expect } from 'vitest';
import { calculateSweepFrequency, evaluateStereoBalance } from './SpeakerFrequencyEngine';

describe('SpeakerFrequencyEngine Unit Tests', () => {
  it('should calculate 20Hz at start of logarithmic audio sweep', () => {
    const f0 = calculateSweepFrequency(0.0, 20, 20000);
    expect(f0).toBe(20.0);
  });

  it('should calculate 20,000Hz at end of logarithmic sweep', () => {
    const f1 = calculateSweepFrequency(1.0, 20, 20000);
    expect(f1).toBe(20000.0);
  });

  it('should calculate ~632.5Hz mid-point frequency on logarithmic 20Hz-20kHz scale', () => {
    const fMid = calculateSweepFrequency(0.5, 20, 20000);
    expect(fMid).toBe(632.5);
  });

  it('should evaluate balanced stereo channels when volume delta <= 1.0 dB', () => {
    const res = evaluateStereoBalance(-3.0, -3.5);
    expect(res.channelBalanceDelta).toBe(0.5);
    expect(res.isBalanced).toBe(true);
    expect(res.isPhaseInverted).toBe(false);
  });
});
