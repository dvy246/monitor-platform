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
