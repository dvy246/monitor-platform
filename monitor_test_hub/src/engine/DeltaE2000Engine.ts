/**
 * CIEDE2000 Display Calibration Color Accuracy & Perceptual Tolerancing Engine
 * Pure TypeScript calculation engine for sRGB/Hex/Lab color conversions,
 * CIEDE2000 (deltaE00), CIE94 (deltaE94), and CIE76 (deltaE76) color difference formulas,
 * lightness/chroma/hue error breakdown, and ISO 9241-307 display tolerance grading.
 */

export interface IRgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ILabColor {
  L: number; // 0-100
  a: number; // -128 to +127
  b: number; // -128 to +127
}

export interface IXyzColor {
  X: number;
  Y: number;
  Z: number;
}

export interface IDeltaE2000Result {
  deltaE00: number;
  deltaE76: number;
  deltaE94: number;
  deltaL: number; // Lightness error
  deltaC: number; // Chroma error
  deltaH: number; // Hue error
  rating: 'MASTERING_REFERENCE' | 'PROFESSIONAL_GRADE' | 'ACCEPTABLE_CONSUMER' | 'UNACCEPTABLE_SHIFT';
  ratingDescription: string;
  isPassedIso9241: boolean;
  disclaimer: string;
}

export const DISPLAY_DELTA_E_DISCLAIMER =
  'Notice: Delta E metrics are calculated mathematically using standard D65 illuminant reference matrices and ISO 9241-307 display calibration specifications. Rendered canvas color patches are previews subject to local operating system and display ICC profiles.';

export const MACBETH_COLORCHECKER_24: Array<{ id: number; name: string; hex: string }> = [
  { id: 1, name: 'Dark Skin', hex: '#735244' },
  { id: 2, name: 'Light Skin', hex: '#c29682' },
  { id: 3, name: 'Blue Sky', hex: '#627a9d' },
  { id: 4, name: 'Foliage', hex: '#576c43' },
  { id: 5, name: 'Blue Flower', hex: '#8580b1' },
  { id: 6, name: 'Purplish Blue', hex: '#67bdaa' },
  { id: 7, name: 'Orange', hex: '#d67b2c' },
  { id: 8, name: 'Purplish Blue 2', hex: '#5056a0' },
  { id: 9, name: 'Moderate Red', hex: '#c45d67' },
  { id: 10, name: 'Purple', hex: '#5b3a68' },
  { id: 11, name: 'Yellow Green', hex: '#9ebb3b' },
  { id: 12, name: 'Orange Yellow', hex: '#e2a12d' },
  { id: 13, name: 'Blue', hex: '#404492' },
  { id: 14, name: 'Green', hex: '#56a052' },
  { id: 15, name: 'Red', hex: '#b03b44' },
  { id: 16, name: 'Yellow', hex: '#e8c835' },
  { id: 17, name: 'Magenta', hex: '#a85296' },
  { id: 18, name: 'Cyan', hex: '#0084a7' },
  { id: 19, name: 'White 0.05D', hex: '#f3f3f2' },
  { id: 20, name: 'Neutral 8', hex: '#c8c8c8' },
  { id: 21, name: 'Neutral 6.5', hex: '#a0a0a0' },
  { id: 22, name: 'Neutral 5', hex: '#7a7a7a' },
  { id: 23, name: 'Neutral 3.5', hex: '#555555' },
  { id: 24, name: 'Black 2D', hex: '#323232' },
];

/**
 * Parses Hex string (#RRGGBB) to IRgbColor.
 */
export function hexToRgb(hex: string): IRgbColor {
  const cleanHex = hex.replace(/^#/, '');
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts IRgbColor to Hex string.
 */
export function rgbToHex(rgb: IRgbColor): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Converts sRGB (0-255) to Linear sRGB (0.0 - 1.0).
 */
export function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Converts Linear sRGB to XYZ under D65 illuminant.
 */
export function rgbToXyz(rgb: IRgbColor): IXyzColor {
  const rL = srgbToLinear(rgb.r);
  const gL = srgbToLinear(rgb.g);
  const bL = srgbToLinear(rgb.b);

  return {
    X: rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375,
    Y: rL * 0.2126729 + gL * 0.7151522 + bL * 0.072175,
    Z: rL * 0.0193339 + gL * 0.119192 + bL * 0.9503041,
  };
}

function fLab(t: number): number {
  const delta = 6 / 29; // ~0.206896
  return t > Math.pow(delta, 3) ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29;
}

/**
 * Converts XYZ to CIE L*a*b* (D65 illuminant reference Xn=0.95047, Yn=1.00000, Zn=1.08883).
 */
export function xyzToLab(xyz: IXyzColor): ILabColor {
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  const fx = fLab(xyz.X / Xn);
  const fy = fLab(xyz.Y / Yn);
  const fz = fLab(xyz.Z / Zn);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Converts sRGB color directly to CIE L*a*b*.
 */
export function rgbToLab(rgb: IRgbColor): ILabColor {
  return xyzToLab(rgbToXyz(rgb));
}

/**
 * Calculates legacy CIE76 color difference (deltaE_ab).
 */
export function calculateCie76(lab1: ILabColor, lab2: ILabColor): number {
  const dL = lab2.L - lab1.L;
  const da = lab2.a - lab1.a;
  const db = lab2.b - lab1.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Calculates CIE94 color difference.
 */
export function calculateCie94(lab1: ILabColor, lab2: ILabColor): number {
  const dL = lab1.L - lab2.L;
  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const dC = C1 - C2;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  const dH2 = da * da + db * db - dC * dC;
  const dH = dH2 < 0 ? 0 : Math.sqrt(dH2);

  const SL = 1;
  const SC = 1 + 0.045 * C1;
  const SH = 1 + 0.015 * C1;

  return Math.sqrt(
    Math.pow(dL / SL, 2) + Math.pow(dC / SC, 2) + Math.pow(dH / SH, 2)
  );
}

/**
 * Calculates full CIEDE2000 (deltaE00) color difference.
 */
export function calculateDeltaE2000(
  lab1: ILabColor,
  lab2: ILabColor,
  kL: number = 1,
  kC: number = 1,
  kH: number = 1
): IDeltaE2000Result {
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const C_bar = (C1 + C2) / 2;
  const C_bar7 = Math.pow(C_bar, 7);
  const G = 0.5 * (1 - Math.sqrt(C_bar7 / (C_bar7 + Math.pow(25, 7))));

  const a1_prime = (1 + G) * a1;
  const a2_prime = (1 + G) * a2;

  const C1_prime = Math.sqrt(a1_prime * a1_prime + b1 * b1);
  const C2_prime = Math.sqrt(a2_prime * a2_prime + b2 * b2);

  const rad2deg = 180 / Math.PI;
  const deg2rad = Math.PI / 180;

  const h1_prime = (Math.atan2(b1, a1_prime) * rad2deg + 360) % 360;
  const h2_prime = (Math.atan2(b2, a2_prime) * rad2deg + 360) % 360;

  const dL_prime = L2 - L1;
  const dC_prime = C2_prime - C1_prime;

  let dh_prime = 0;
  if (C1_prime * C2_prime !== 0) {
    const diff = h2_prime - h1_prime;
    if (Math.abs(diff) <= 180) {
      dh_prime = diff;
    } else if (diff > 180) {
      dh_prime = diff - 360;
    } else {
      dh_prime = diff + 360;
    }
  }

  const dH_prime = 2 * Math.sqrt(C1_prime * C2_prime) * Math.sin((dh_prime / 2) * deg2rad);

  const L_bar_prime = (L1 + L2) / 2;
  const C_bar_prime = (C1_prime + C2_prime) / 2;

  let h_bar_prime = 0;
  if (C1_prime * C2_prime !== 0) {
    const sum = h1_prime + h2_prime;
    const diff = Math.abs(h1_prime - h2_prime);
    if (diff <= 180) {
      h_bar_prime = sum / 2;
    } else if (sum < 360) {
      h_bar_prime = (sum + 360) / 2;
    } else {
      h_bar_prime = (sum - 360) / 2;
    }
  } else {
    h_bar_prime = h1_prime + h2_prime;
  }

  const T =
    1 -
    0.17 * Math.cos((h_bar_prime - 30) * deg2rad) +
    0.24 * Math.cos((2 * h_bar_prime) * deg2rad) +
    0.32 * Math.cos((3 * h_bar_prime + 6) * deg2rad) -
    0.2 * Math.cos((4 * h_bar_prime - 63) * deg2rad);

  const L_bar_50_sq = Math.pow(L_bar_prime - 50, 2);
  const SL = 1 + (0.015 * L_bar_50_sq) / Math.sqrt(20 + L_bar_50_sq);
  const SC = 1 + 0.045 * C_bar_prime;
  const SH = 1 + 0.015 * C_bar_prime * T;

  const C_bar_prime7 = Math.pow(C_bar_prime, 7);
  const delta_theta = 30 * Math.exp(-Math.pow((h_bar_prime - 275) / 25, 2));
  const RC = 2 * Math.sqrt(C_bar_prime7 / (C_bar_prime7 + Math.pow(25, 7)));
  const RT = -Math.sin(2 * delta_theta * deg2rad) * RC;

  const termL = dL_prime / (kL * SL);
  const termC = dC_prime / (kC * SC);
  const termH = dH_prime / (kH * SH);

  const deltaE00Val = Math.sqrt(
    termL * termL + termC * termC + termH * termH + RT * termC * termH
  );

  const deltaE00 = Number(deltaE00Val.toFixed(2));
  const deltaE76 = Number(calculateCie76(lab1, lab2).toFixed(2));
  const deltaE94 = Number(calculateCie94(lab1, lab2).toFixed(2));

  let rating: IDeltaE2000Result['rating'] = 'UNACCEPTABLE_SHIFT';
  let ratingDescription = 'Unacceptable color error (Delta E >= 3.0). Requires display LUT calibration.';

  if (deltaE00 < 1.0) {
    rating = 'MASTERING_REFERENCE';
    ratingDescription = 'Mastering Reference Grade (Delta E < 1.0). Imperceptible error to human eye.';
  } else if (deltaE00 < 2.0) {
    rating = 'PROFESSIONAL_GRADE';
    ratingDescription = 'Professional Content Creation Grade (Delta E < 2.0). Within JND threshold for trained colorists.';
  } else if (deltaE00 < 3.0) {
    rating = 'ACCEPTABLE_CONSUMER';
    ratingDescription = 'Acceptable Consumer Grade (Delta E < 3.0). Minor color shift visible only in direct comparison.';
  }

  const isPassedIso9241 = deltaE00 < 3.0;

  return {
    deltaE00,
    deltaE76,
    deltaE94,
    deltaL: Number(dL_prime.toFixed(2)),
    deltaC: Number(dC_prime.toFixed(2)),
    deltaH: Number(dH_prime.toFixed(2)),
    rating,
    ratingDescription,
    isPassedIso9241,
    disclaimer: DISPLAY_DELTA_E_DISCLAIMER,
  };
}
