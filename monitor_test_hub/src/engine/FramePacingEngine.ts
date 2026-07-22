/**
 * FramePacingEngine.ts — Decoupled Pure-TypeScript Frame Pacing & Display Latency Engine
 * Evaluates FPS vs Refresh Rate (Hz) Cadence Stutter, VRR Cap Offsets & RTSS Config Profiles
 */

export interface FramePacingMetrics {
  targetFps: number;
  refreshHz: number;
  frameTimeMs: number;
  refreshIntervalMs: number;
  vrrRecommendedCap: number;
  cadenceStutterHz: number;
  vSyncQueueDelayMs: number;
  hasCadenceMismatch: boolean;
  rtssConfigString: string;
}

export class FramePacingEngine {
  /**
   * Calculate Frame Time (ms)
   */
  public static calculateFrameTimeMs(fps: number): number {
    if (fps <= 0) return 0;
    return Math.round((1000 / fps) * 100) / 100;
  }

  /**
   * Calculate Complete Frame Pacing & Latency Metrics
   */
  public static calculateMetrics(targetFps: number, refreshHz: number): FramePacingMetrics {
    const safeFps = Math.max(1, targetFps);
    const safeHz = Math.max(1, refreshHz);

    const frameTimeMs = this.calculateFrameTimeMs(safeFps);
    const refreshIntervalMs = this.calculateFrameTimeMs(safeHz);

    // Recommended VRR / G-Sync cap (usually Hz - 3 or Hz - 4)
    const vrrRecommendedCap = Math.max(30, safeHz - 3);

    // Cadence mismatch stutter frequency
    const ratio = safeHz / safeFps;
    const isIntegerRatio = Math.abs(ratio - Math.round(ratio)) < 0.01;
    const hasCadenceMismatch = !isIntegerRatio && safeFps < safeHz;
    const cadenceStutterHz = hasCadenceMismatch ? Math.round(Math.abs(safeHz - Math.round(ratio) * safeFps)) : 0;

    // Estimated double-buffer V-Sync queue latency
    const vSyncQueueDelayMs = Math.round((refreshIntervalMs * 2) * 10) / 10;

    // Generated RTSS (RivaTuner Statistics Server) configuration string
    const rtssConfigString = `[Framerate]\nLimit=${vrrRecommendedCap}\nLimitType=1\nBackBufferLatency=1\nPassiveWait=1`;

    return {
      targetFps: safeFps,
      refreshHz: safeHz,
      frameTimeMs,
      refreshIntervalMs,
      vrrRecommendedCap,
      cadenceStutterHz,
      vSyncQueueDelayMs,
      hasCadenceMismatch,
      rtssConfigString
    };
  }
}
