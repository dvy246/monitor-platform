/**
 * PwmFlickerEngine.ts
 * Pure TypeScript calculation engine evaluating display PWM flicker, temporal modulation,
 * and stroboscopic camera rolling shutter frequency artifacts.
 * Standard: IEEE Std 1789-2015 Recommended Practices for High-Brightness LEDs.
 */

export interface IPwmFlickerMetrics {
  frequencyHz: number;
  percentFlicker: number;
  flickerIndex: number;
  ieeeRiskCategory: 'ZERO_RISK' | 'LOW_RISK' | 'HIGH_RISK';
  isDcDimming: boolean;
}

/**
 * Calculates Percent Flicker = 100 * (A - B) / (A + B) according to IEEE Std 1789-2015.
 */
export function calculatePwmMetrics(
  maxLuminance: number,
  minLuminance: number,
  frequencyHz: number
): IPwmFlickerMetrics {
  const maxL = Math.max(0.001, maxLuminance);
  const minL = Math.max(0, minLuminance);
  
  const percentFlicker = Number((100 * (maxL - minL) / (maxL + minL)).toFixed(2));
  const flickerIndex = Number(((maxL - minL) / (2 * maxL)).toFixed(3));
  const isDcDimming = percentFlicker < 2.0;

  let ieeeRiskCategory: 'ZERO_RISK' | 'LOW_RISK' | 'HIGH_RISK' = 'ZERO_RISK';
  if (!isDcDimming) {
    if (frequencyHz < 240) {
      ieeeRiskCategory = 'HIGH_RISK';
    } else if (frequencyHz < 3000) {
      ieeeRiskCategory = 'LOW_RISK';
    }
  }

  return {
    frequencyHz,
    percentFlicker,
    flickerIndex,
    ieeeRiskCategory,
    isDcDimming
  };
}

/**
 * Generates rolling shutter camera band width (px) for stroboscopic pattern verification.
 */
export function calculateCameraShutterBandWidth(
  cameraShutterSpeedSec: number,
  pwmFrequencyHz: number,
  screenHeightPx: number = 1080
): number {
  if (pwmFrequencyHz <= 0) return 0;
  const bandDuration = 1 / pwmFrequencyHz;
  return Math.round((bandDuration / cameraShutterSpeedSec) * screenHeightPx);
}
