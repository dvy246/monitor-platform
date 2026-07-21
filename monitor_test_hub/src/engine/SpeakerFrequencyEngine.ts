/**
 * SpeakerFrequencyEngine.ts
 * Pure TypeScript calculation engine evaluating speaker/headphone logarithmic sine sweeps (20Hz to 20kHz),
 * stereo channel balance, and phase inversion.
 * Standard: AES17 Standard for Digital Audio Engineering Specs.
 */

export interface ISpeakerSweepConfig {
  startFrequencyHz: number;
  endFrequencyHz: number;
  durationSeconds: number;
  volume: number; // 0.0 to 1.0
}

export interface IStereoBalanceReport {
  leftChannelVolume: number;
  rightChannelVolume: number;
  channelBalanceDelta: number; // dB delta
  isBalanced: boolean;        // delta <= 1.0 dB
  isPhaseInverted: boolean;
}

/**
 * Calculates logarithmic frequency for a given sweep progress percentage (0.0 to 1.0).
 * Formula: f = start * (end / start)^progress
 */
export function calculateSweepFrequency(
  progress: number,
  startHz: number = 20,
  endHz: number = 20000
): number {
  const p = Math.max(0, Math.min(1, progress));
  const freq = startHz * Math.pow(endHz / startHz, p);
  return Number(freq.toFixed(1));
}

/**
 * Evaluates stereo channel balance and phase inversion.
 */
export function evaluateStereoBalance(
  leftDb: number,
  rightDb: number,
  isPhaseInverted: boolean = false
): IStereoBalanceReport {
  const delta = Number(Math.abs(leftDb - rightDb).toFixed(1));
  const isBalanced = delta <= 1.0;

  return {
    leftChannelVolume: leftDb,
    rightChannelVolume: rightDb,
    channelBalanceDelta: delta,
    isBalanced,
    isPhaseInverted
  };
}
