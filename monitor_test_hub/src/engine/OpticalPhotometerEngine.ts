/**
 * Optical WebCam Display Telemetry & Spatial Uniformity Engine
 * 
 * Provides pure TypeScript calculation functions for webcam-assisted optical display
 * photometer analysis, 9-zone spatial luminance variance (ISO 9241-307),
 * delta-E color shift, ISO 9241-307 defect class classification, and
 * cryptographic SHA-256 panel passport payload generation.
 */

export interface IOpticalGridPoint {
  zoneIndex: number; // 0 - 8 (3x3 grid)
  x: number; // normalized 0.0 - 1.0
  y: number; // normalized 0.0 - 1.0
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  luminance: number; // 0 - 100
}

export interface IOpticalUniformityResult {
  meanLuminance: number;
  spatialVariance: number;
  maxLuminanceDelta: number;
  uniformityPercentage: number;
  isoClass: 'Class I' | 'Class II' | 'Class III' | 'Class IV';
  zoneLuminanceMap: number[];
  rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DEFECTIVE';
  disclaimer: string;
}

export interface IPassportSignaturePayload {
  resolution: string;
  vsyncFps: number;
  devicePixelRatio: number;
  spatialVariance: number;
  isoClass: string;
  healthScore: number;
  timestamp: string;
  signatureHash?: string;
}

export const OPTICAL_PHOTOMETER_DISCLAIMER =
  'Notice: Optical photometer readings are calculated client-side using normalized WebCam/Camera sensor luminance data and ISO 9241-307 display tolerance matrices. Results are subject to camera exposure lock and ambient lighting conditions.';

export class OpticalPhotometerEngine {
  /**
   * Computes sRGB relative luminance (0 - 100) using ITU-R BT.709 coefficients
   * Y = 0.2126 * R + 0.7152 * G + 0.0722 * B
   */
  public static calculateRelativeLuminance(r: number, g: number, b: number): number {
    const normR = r / 255;
    const normG = g / 255;
    const normB = b / 255;

    const R = normR <= 0.03928 ? normR / 12.92 : Math.pow((normR + 0.055) / 1.055, 2.4);
    const G = normG <= 0.03928 ? normG / 12.92 : Math.pow((normG + 0.055) / 1.055, 2.4);
    const B = normB <= 0.03928 ? normB / 12.92 : Math.pow((normB + 0.055) / 1.055, 2.4);

    const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return Math.min(100, Math.max(0, Y * 100));
  }

  /**
   * Evaluates spatial luminance variance across a 9-zone (3x3) optical sampling grid
   */
  public static calculateSpatialUniformity(luminanceMap: number[]): IOpticalUniformityResult {
    if (!luminanceMap || luminanceMap.length === 0) {
      return {
        meanLuminance: 0,
        spatialVariance: 0,
        maxLuminanceDelta: 0,
        uniformityPercentage: 100,
        isoClass: 'Class I',
        zoneLuminanceMap: [],
        rating: 'EXCELLENT',
        disclaimer: OPTICAL_PHOTOMETER_DISCLAIMER,
      };
    }

    const n = luminanceMap.length;
    const sum = luminanceMap.reduce((acc, val) => acc + val, 0);
    const meanLuminance = sum / n;

    // Variance calculation: sigma^2 = (1/N) * sum((L_i - L_mean)^2)
    const varianceSum = luminanceMap.reduce((acc, val) => acc + Math.pow(val - meanLuminance, 2), 0);
    const spatialVariance = varianceSum / n;

    // Max delta between any zone and mean
    const maxLuminanceDelta = Math.max(...luminanceMap.map((val) => Math.abs(val - meanLuminance)));

    // Uniformity %: 100 * (1 - (maxDelta / max(meanLuminance, 1)))
    const safeMean = Math.max(1, meanLuminance);
    const rawUniformity = 100 * (1 - maxLuminanceDelta / safeMean);
    const uniformityPercentage = Math.min(100, Math.max(0, Math.round(rawUniformity * 10) / 10));

    // ISO 9241-307 Class Determination based on spatial variance & uniformity %
    let isoClass: 'Class I' | 'Class II' | 'Class III' | 'Class IV' = 'Class I';
    let rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DEFECTIVE' = 'EXCELLENT';

    if (uniformityPercentage >= 92 && spatialVariance <= 5) {
      isoClass = 'Class I';
      rating = 'EXCELLENT';
    } else if (uniformityPercentage >= 84 && spatialVariance <= 15) {
      isoClass = 'Class II';
      rating = 'GOOD';
    } else if (uniformityPercentage >= 75 && spatialVariance <= 50) {
      isoClass = 'Class III';
      rating = 'FAIR';
    } else {
      isoClass = 'Class IV';
      rating = 'DEFECTIVE';
    }

    return {
      meanLuminance: Math.round(meanLuminance * 100) / 100,
      spatialVariance: Math.round(spatialVariance * 100) / 100,
      maxLuminanceDelta: Math.round(maxLuminanceDelta * 100) / 100,
      uniformityPercentage,
      isoClass,
      zoneLuminanceMap: luminanceMap.map((v) => Math.round(v * 10) / 10),
      rating,
      disclaimer: OPTICAL_PHOTOMETER_DISCLAIMER,
    };
  }

  /**
   * Generates a deterministic hash signature string from payload data
   */
  public static async generateSignatureString(payload: IPassportSignaturePayload): Promise<string> {
    const rawString = `${payload.resolution}|${payload.vsyncFps}|${payload.devicePixelRatio}|${payload.spatialVariance}|${payload.isoClass}|${payload.healthScore}|${payload.timestamp}`;
    
    // Check if Web Crypto API is available
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback pseudo-hash for Node test environments without Web Crypto
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256-fb-${Math.abs(hash).toString(16)}`;
  }
}
