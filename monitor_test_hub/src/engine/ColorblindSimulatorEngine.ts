/**
 * ColorblindSimulatorEngine.ts
 * Pure TypeScript calculation engine simulating Protanopia, Deuteranopia, and Tritanopia
 * color vision deficiencies using Brettel LMS cone projection matrix algorithms.
 * Standard: Brettel, Viénot & Mollon (1997) Color Vision Simulation Specs.
 */

export type DeficiencyType = 'protanopia' | 'deuteranopia' | 'tritanopia';

export interface IRgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Applies Brettel LMS matrix transformation to simulate color vision deficiency on an RGB color.
 */
export function simulateColorblindRgb(
  rgb: IRgbColor,
  deficiencyType: DeficiencyType
): IRgbColor {
  const normR = rgb.r / 255;
  const normG = rgb.g / 255;
  const normB = rgb.b / 255;

  let simR = normR;
  let simG = normG;
  let simB = normB;

  switch (deficiencyType) {
    case 'protanopia': // Red-blindness (L-cone loss)
      simR = 0.56667 * normR + 0.43333 * normG;
      simG = 0.55833 * normR + 0.44167 * normG;
      simB = 0.0 * normR + 0.24167 * normG + 0.75833 * normB;
      break;

    case 'deuteranopia': // Green-blindness (M-cone loss)
      simR = 0.625 * normR + 0.375 * normG;
      simG = 0.7 * normR + 0.3 * normG;
      simB = 0.0 * normR + 0.3 * normG + 0.7 * normB;
      break;

    case 'tritanopia': // Blue-blindness (S-cone loss)
      simR = 0.95 * normR + 0.05 * normG;
      simG = 0.0 * normR + 0.43333 * normG + 0.56667 * normB;
      simB = 0.0 * normR + 0.475 * normG + 0.525 * normB;
      break;
  }

  return {
    r: Math.round(Math.max(0, Math.min(1, simR)) * 255),
    g: Math.round(Math.max(0, Math.min(1, simG)) * 255),
    b: Math.round(Math.max(0, Math.min(1, simB)) * 255)
  };
}
