/**
 * MicNoiseFloorEngine.ts
 * Pure TypeScript calculation engine measuring microphone audio noise floor (dBFS),
 * peak clipping distortion, and voice Signal-to-Noise Ratio (SNR).
 * Standard: IEC 61672-1 Electroacoustics & Web Audio RMS Specs.
 */

export interface IMicAudioAnalysis {
  noiseFloorDbfs: number;  // decibels full scale (e.g. -60 dBFS)
  peakSignalDbfs: number;  // voice peak decibels
  snrDb: number;           // SNR delta in dB
  hasClippingDistortion: boolean; // peak >= -0.5 dBFS
  clarityRating: 'EXCELLENT' | 'GOOD' | 'POOR';
}

/**
 * Calculates RMS decibels relative to full scale (dBFS) from PCM sample array.
 * Formula: dBFS = 20 * log10(RMS)
 */
export function calculateDbfsFromSamples(pcmSamples: Float32Array): number {
  if (pcmSamples.length === 0) return -100;
  
  let sumSquares = 0;
  for (let i = 0; i < pcmSamples.length; i++) {
    sumSquares += pcmSamples[i] * pcmSamples[i];
  }

  const rms = Math.sqrt(sumSquares / pcmSamples.length);
  if (rms <= 0.00001) return -100;

  const dbfs = 20 * Math.log10(rms);
  return Number(Math.max(-100, Math.min(0, dbfs)).toFixed(1));
}

/**
 * Evaluates Signal-to-Noise Ratio (SNR) and microphone audio clarity rating.
 */
export function evaluateMicSnr(
  noiseFloorDbfs: number,
  peakSignalDbfs: number
): IMicAudioAnalysis {
  const safeNoise = Math.min(-10, noiseFloorDbfs);
  const safePeak = Math.max(-60, Math.min(0, peakSignalDbfs));
  
  const snrDb = Number((safePeak - safeNoise).toFixed(1));
  const hasClippingDistortion = safePeak >= -0.5;

  let clarityRating: 'EXCELLENT' | 'GOOD' | 'POOR' = 'EXCELLENT';
  if (snrDb < 30 || hasClippingDistortion) {
    clarityRating = 'POOR';
  } else if (snrDb < 45) {
    clarityRating = 'GOOD';
  }

  return {
    noiseFloorDbfs: safeNoise,
    peakSignalDbfs: safePeak,
    snrDb,
    hasClippingDistortion,
    clarityRating
  };
}

/**
 * Computes an overall Microphone Health & Clarity Index (0 - 100)
 */
export function calculateAudioHealthScore(
  noiseFloorDbfs: number,
  snrDb: number,
  hasClipping: boolean,
  sampleRate: number = 48000
): number {
  let score = 100;

  // 1. Noise Floor Penalty (Ideal: <= -60 dBFS)
  if (noiseFloorDbfs > -40) score -= 30;
  else if (noiseFloorDbfs > -50) score -= 15;
  else if (noiseFloorDbfs > -60) score -= 5;

  // 2. SNR Penalty (Ideal: >= 45 dB)
  if (snrDb < 25) score -= 35;
  else if (snrDb < 35) score -= 20;
  else if (snrDb < 45) score -= 10;

  // 3. Clipping Overshoot Penalty
  if (hasClipping) score -= 20;

  // 4. Low Sample Rate Penalty (e.g. 16kHz telephony / narrow Bluetooth profile)
  if (sampleRate < 44100) score -= 15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Validates hardware sample rate suitability for studio broadcast vs VoIP
 */
export function evaluateSampleRateQuality(sampleRate: number): {
  category: 'STUDIO_BROADCAST' | 'STANDARD_AUDIO' | 'NARROWBAND_TELEPHONY';
  description: string;
} {
  if (sampleRate >= 48000) {
    return {
      category: 'STUDIO_BROADCAST',
      description: '48kHz+ High-Fidelity Studio & Video Standard',
    };
  } else if (sampleRate >= 44100) {
    return {
      category: 'STANDARD_AUDIO',
      description: '44.1kHz Compact Disc Audio Standard',
    };
  } else {
    return {
      category: 'NARROWBAND_TELEPHONY',
      description: 'Low-Bandwidth Telephony or HSP/HFP Bluetooth Profile',
    };
  }
}

export class MicNoiseFloorEngine {
  public static calculateDbfsFromSamples = calculateDbfsFromSamples;
  public static evaluateMicSnr = evaluateMicSnr;
  public static calculateAudioHealthScore = calculateAudioHealthScore;
  public static evaluateSampleRateQuality = evaluateSampleRateQuality;
}

