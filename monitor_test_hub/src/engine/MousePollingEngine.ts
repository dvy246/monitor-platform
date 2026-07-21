/**
 * MousePollingEngine.ts
 * Pure TypeScript calculation engine measuring gaming mouse USB HID polling frequency (Hz),
 * polling stability, and inter-report timestamp jitter standard deviation.
 * Standard: USB HID Class Spec v1.11 & W3C PointerEvents Timestamp Delta Specs.
 */

export interface IMousePollingReport {
  measuredHz: number;
  averageIntervalMs: number;
  jitterStdDevMs: number;
  totalEventsLogged: number;
  peakHz: number;
  isStable: boolean;
}

/**
 * Calculates polling rate frequency (Hz) and inter-report timestamp jitter standard deviation.
 */
export function analyzeMousePolling(timestampsMs: number[]): IMousePollingReport {
  if (timestampsMs.length < 2) {
    return {
      measuredHz: 0,
      averageIntervalMs: 0,
      jitterStdDevMs: 0,
      totalEventsLogged: timestampsMs.length,
      peakHz: 0,
      isStable: false
    };
  }

  const deltas: number[] = [];
  for (let i = 1; i < timestampsMs.length; i++) {
    const delta = timestampsMs[i] - timestampsMs[i - 1];
    if (delta > 0 && delta < 500) { // filter idle pauses
      deltas.push(delta);
    }
  }

  if (deltas.length === 0) {
    return {
      measuredHz: 0,
      averageIntervalMs: 0,
      jitterStdDevMs: 0,
      totalEventsLogged: timestampsMs.length,
      peakHz: 0,
      isStable: false
    };
  }

  const sum = deltas.reduce((a, b) => a + b, 0);
  const averageIntervalMs = sum / deltas.length;
  const measuredHz = Math.round(1000 / Math.max(0.1, averageIntervalMs));

  // Minimum delta determines peak polling rate
  const minDelta = Math.min(...deltas);
  const peakHz = Math.round(1000 / Math.max(0.1, minDelta));

  // Variance & Standard Deviation calculation
  const variance = deltas.reduce((acc, val) => acc + Math.pow(val - averageIntervalMs, 2), 0) / deltas.length;
  const jitterStdDevMs = Number(Math.sqrt(variance).toFixed(3));

  const isStable = jitterStdDevMs <= 0.8;

  return {
    measuredHz,
    averageIntervalMs: Number(averageIntervalMs.toFixed(3)),
    jitterStdDevMs,
    totalEventsLogged: timestampsMs.length,
    peakHz,
    isStable
  };
}
