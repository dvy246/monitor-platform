/**
 * MouseDoubleClickEngine.ts
 * Pure TypeScript calculation engine detecting mechanical mouse switch chatter defects
 * and measuring microsecond click debounce intervals.
 * Standard: Human Neuromuscular Refractory Period & Switch Mechanical Bounce Threshold (<30ms).
 */

export interface IClickEventLog {
  button: number;      // 0: Left, 1: Middle, 2: Right
  timestampMs: number;
  deltaFromLastMs: number;
  isChatterDefect: boolean;
}

export interface IDoubleClickReport {
  totalClicks: number;
  defectCount: number;
  fastestClickMs: number;
  chatterRatePercent: number;
  hasFaultySwitch: boolean;
}

/**
 * Analyzes click timestamp deltas to identify mechanical switch chatter (delta < 30ms).
 */
export function analyzeClickEvents(
  clickTimestampsMs: number[],
  debounceThresholdMs: number = 30
): IDoubleClickReport {
  if (clickTimestampsMs.length === 0) {
    return {
      totalClicks: 0,
      defectCount: 0,
      fastestClickMs: 0,
      chatterRatePercent: 0,
      hasFaultySwitch: false
    };
  }

  let defectCount = 0;
  let fastestClickMs = Infinity;

  for (let i = 1; i < clickTimestampsMs.length; i++) {
    const delta = clickTimestampsMs[i] - clickTimestampsMs[i - 1];
    if (delta < fastestClickMs) {
      fastestClickMs = Number(delta.toFixed(2));
    }
    if (delta < debounceThresholdMs) {
      defectCount++;
    }
  }

  if (fastestClickMs === Infinity) fastestClickMs = 0;

  const totalClicks = clickTimestampsMs.length;
  const chatterRatePercent = Number(((defectCount / Math.max(1, totalClicks)) * 100).toFixed(2));

  return {
    totalClicks,
    defectCount,
    fastestClickMs,
    chatterRatePercent,
    hasFaultySwitch: defectCount > 0
  };
}
