/**
 * WebcamDiagnosticsEngine.ts
 * Pure TypeScript calculation engine measuring webcam video stream resolution,
 * aspect ratio, frame rate (FPS) pacing jitter, camera quality index (0-100),
 * and SHA-256 cryptographic receipt signing.
 * 
 * Standard: W3C Media Capture and Streams API & requestVideoFrameCallback Specs.
 * Infrastructure Overhead: $0.00 (100% Client-Side Web API)
 */

export interface IWebcamResolution {
  width: number;
  height: number;
  aspectRatio: string; // e.g. "16:9", "4:3"
  tier: '4K_UHD' | 'FULL_HD_1080P' | 'HD_720P' | 'SD_DEF';
  label: string; // e.g. "1080p Full HD"
}

export interface IWebcamHealthReport {
  resolution: IWebcamResolution;
  actualFps: number;
  targetFps: number;
  fpsJitterMs: number;
  healthScore: number;
  verdict: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  timestamp: string;
  signatureHash?: string;
}

export class WebcamDiagnosticsEngine {
  /**
   * Solves aspect ratio fraction string (e.g. 1920x1080 -> "16:9")
   */
  public static calculateAspectRatio(width: number, height: number): string {
    if (width <= 0 || height <= 0) return '16:9';
    
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    const w = width / divisor;
    const h = height / divisor;

    // Approximate common display aspect ratios
    const ratio = width / height;
    if (Math.abs(ratio - 1.777) < 0.05) return '16:9';
    if (Math.abs(ratio - 1.333) < 0.05) return '4:3';
    if (Math.abs(ratio - 2.333) < 0.05) return '21:9';
    if (Math.abs(ratio - 1.0) < 0.05) return '1:1';

    return `${w}:${h}`;
  }

  /**
   * Classifies camera resolution into hardware quality tiers
   */
  public static classifyResolution(width: number, height: number): IWebcamResolution {
    const aspectRatio = this.calculateAspectRatio(width, height);

    if (width >= 3840 || height >= 2160) {
      return { width, height, aspectRatio, tier: '4K_UHD', label: '4K Ultra HD (2160p)' };
    } else if (width >= 1920 || height >= 1080) {
      return { width, height, aspectRatio, tier: 'FULL_HD_1080P', label: '1080p Full HD' };
    } else if (width >= 1280 || height >= 720) {
      return { width, height, aspectRatio, tier: 'HD_720P', label: '720p HD' };
    } else {
      return { width, height, aspectRatio, tier: 'SD_DEF', label: 'Standard Definition (<720p)' };
    }
  }

  /**
   * Computes frame pacing jitter standard deviation in milliseconds from timestamp array
   */
  public static calculateFpsJitter(timestampsMs: number[]): number {
    if (timestampsMs.length < 3) return 0.5;

    const deltas: number[] = [];
    for (let i = 1; i < timestampsMs.length; i++) {
      deltas.push(timestampsMs[i] - timestampsMs[i - 1]);
    }

    const meanDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const variance = deltas.reduce((sum, d) => sum + Math.pow(d - meanDelta, 2), 0) / deltas.length;
    const stdDev = Math.sqrt(variance);

    return Number(stdDev.toFixed(2));
  }

  /**
   * Calculates overall Camera Health Score Index (0 - 100)
   */
  public static calculateHealthScore(
    width: number,
    height: number,
    actualFps: number,
    fpsJitterMs: number = 0.5
  ): number {
    let score = 100;

    // 1. Resolution Points (Max 40 points)
    if (width >= 3840) score += 0; // 4K bonus/ideal
    else if (width >= 1920) score -= 5;
    else if (width >= 1280) score -= 15;
    else score -= 30;

    // 2. Frame Rate Points (Max 40 points)
    if (actualFps >= 58) score += 0;
    else if (actualFps >= 29) score -= 10;
    else if (actualFps >= 23) score -= 20;
    else score -= 35;

    // 3. Jitter Stability Penalty (Max 20 points)
    if (fpsJitterMs > 5.0) score -= 20;
    else if (fpsJitterMs > 2.5) score -= 10;
    else if (fpsJitterMs > 1.2) score -= 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Determines verdict string from score
   */
  public static getVerdict(score: number): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 75) return 'GOOD';
    if (score >= 60) return 'FAIR';
    return 'POOR';
  }

  /**
   * Generates a cryptographic SHA-256 signature hash for receipt verification
   */
  public static async generateSignature(report: Omit<IWebcamHealthReport, 'signatureHash'>): Promise<string> {
    const rawStr = JSON.stringify(report);
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const buffer = encoder.encode(rawStr);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
    }
    // Deterministic fallback for non-browser / SSG environments
    let hash = 0;
    for (let i = 0; i < rawStr.length; i++) {
      hash = (hash << 5) - hash + rawStr.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}
