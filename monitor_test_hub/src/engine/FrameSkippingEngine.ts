/**
 * FrameSkippingEngine.ts
 * Pure TypeScript calculation engine detecting dropped/skipped display frames,
 * real Hz verification, and camera shutter photo block grid matrices.
 * Standard: W3C High Resolution Time API & VSync Timestamp Delta Specs.
 */

export interface IFrameDelta {
  timestampMs: number;
  deltaMs: number;
  isSkipped: boolean;
}

export interface IFrameSkippingReport {
  targetRefreshHz: number;
  measuredRefreshHz: number;
  totalFramesAnalyzed: number;
  skippedFrameCount: number;
  hasSkippedFrames: boolean;
  maxFrameDeltaMs: number;
}

/**
 * Analyzes frame interval deltas to detect skipped frames (where delta > 1.8x expected frame time).
 */
export function analyzeFrameSkipping(
  timestamps: number[],
  targetRefreshHz: number
): IFrameSkippingReport {
  const safeTargetHz = Math.max(30, targetRefreshHz);
  const expectedDeltaMs = 1000 / safeTargetHz;
  const skipThresholdMs = expectedDeltaMs * 1.8;

  let skippedFrameCount = 0;
  let maxFrameDeltaMs = 0;

  for (let i = 1; i < timestamps.length; i++) {
    const deltaMs = timestamps[i] - timestamps[i - 1];
    if (deltaMs > maxFrameDeltaMs) {
      maxFrameDeltaMs = Number(deltaMs.toFixed(2));
    }
    if (deltaMs > skipThresholdMs) {
      skippedFrameCount++;
    }
  }

  const totalFramesAnalyzed = Math.max(0, timestamps.length - 1);
  const avgDeltaMs = totalFramesAnalyzed > 0
    ? (timestamps[timestamps.length - 1] - timestamps[0]) / totalFramesAnalyzed
    : expectedDeltaMs;
  
  const measuredRefreshHz = Number((1000 / Math.max(1, avgDeltaMs)).toFixed(1));

  return {
    targetRefreshHz: safeTargetHz,
    measuredRefreshHz,
    totalFramesAnalyzed,
    skippedFrameCount,
    hasSkippedFrames: skippedFrameCount > 0,
    maxFrameDeltaMs
  };
}

/**
 * Generates shutter camera block grid index states for physical photo verification.
 */
export function calculateShutterGridState(
  frameIndex: number,
  gridColumns: number = 8
): number {
  return frameIndex % gridColumns;
}
