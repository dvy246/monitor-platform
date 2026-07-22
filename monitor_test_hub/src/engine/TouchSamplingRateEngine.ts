/**
 * Hardware Touch Sampling Rate & Coalesced Event Jitter Inspector Engine
 * Pure TypeScript calculation engine for unwrapping W3C PointerEvent coalesced events,
 * calculating true hardware touch sampling rate (Hz), inter-sample microsecond jitter,
 * coalesced event buffer ratio, and VSync phase beat frequency micro-stutter.
 */

export interface HardwareTouchPoint {
  x: number;
  y: number;
  timestamp: number; // High-resolution microsecond timestamp
  isCoalesced: boolean;
  pointerId: number;
}

export interface TouchSamplingMetrics {
  sampleCount: number;
  coalescedEventCount: number;
  measuredHardwareHz: number;
  peakHardwareHz: number;
  averageDeltaMs: number;
  jitterStdDevMs: number;
  coalescedRatio: number; // Average coalesced points per browser dispatch tick
  supportsCoalescedEvents: boolean;
  syncRatio: number; // Ratio of touch rate to display refresh rate
  beatFrequencyHz: number; // Non-integer phase beat frequency stutter (Hz)
  rating: 'ULTRA_HIGH' | 'HIGH' | 'STANDARD' | 'THROTTLED';
  ratingDescription: string;
  disclaimer: string;
}

export interface SamplingHistogramBucket {
  binLabel: string;
  minDeltaMs: number;
  maxDeltaMs: number;
  count: number;
}

export const TOUCH_SAMPLING_DISCLAIMER =
  'Notice: Touch sampling rates and coalesced event metrics are evaluated strictly using W3C Pointer Events Level 3 hardware timestamps and ISO 9241-307 display response specs. This tool provides non-clinical peripheral hardware diagnostic telemetry.';

/**
 * Unwraps W3C PointerEvent getCoalescedEvents() array to extract high-rate hardware touch points.
 * Falls back to single event if getCoalescedEvents is unavailable.
 */
export function extractHardwarePoints(event: PointerEvent): HardwareTouchPoint[] {
  const points: HardwareTouchPoint[] = [];

  // Check if getCoalescedEvents exists and returns valid list
  if (typeof event.getCoalescedEvents === 'function') {
    try {
      const coalesced = event.getCoalescedEvents();
      if (coalesced && coalesced.length > 0) {
        for (let i = 0; i < coalesced.length; i++) {
          const p = coalesced[i];
          points.push({
            x: p.clientX,
            y: p.clientY,
            timestamp: p.timeStamp,
            isCoalesced: i < coalesced.length - 1,
            pointerId: p.pointerId,
          });
        }
        return points;
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback to single primary pointer event
  points.push({
    x: event.clientX,
    y: event.clientY,
    timestamp: event.timeStamp,
    isCoalesced: false,
    pointerId: event.pointerId,
  });

  return points;
}

/**
 * Calculates touch sampling rate metrics, inter-sample jitter, coalesced buffer depth,
 * and VSync phase beat frequency stutter.
 */
export function calculateTouchSamplingMetrics(
  points: HardwareTouchPoint[],
  displayRefreshRateHz: number = 60
): TouchSamplingMetrics {
  if (!points || points.length < 2) {
    return {
      sampleCount: points ? points.length : 0,
      coalescedEventCount: 0,
      measuredHardwareHz: 0,
      peakHardwareHz: 0,
      averageDeltaMs: 0,
      jitterStdDevMs: 0,
      coalescedRatio: 1.0,
      supportsCoalescedEvents: false,
      syncRatio: 1.0,
      beatFrequencyHz: 0,
      rating: 'STANDARD',
      ratingDescription: 'Insufficient touch event data. Swipe across the canvas to measure sampling rate.',
      disclaimer: TOUCH_SAMPLING_DISCLAIMER,
    };
  }

  // Sort points chronologically by timestamp
  const sorted = [...points].sort((a, b) => a.timestamp - b.timestamp);

  // Compute inter-sample deltas (in ms)
  const deltas: number[] = [];
  let coalescedCount = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].isCoalesced) coalescedCount++;
    if (i > 0) {
      const dt = sorted[i].timestamp - sorted[i - 1].timestamp;
      if (dt > 0.05 && dt < 100) { // Filter zero/outlier deltas
        deltas.push(dt);
      }
    }
  }

  if (deltas.length === 0) {
    return {
      sampleCount: sorted.length,
      coalescedEventCount: coalescedCount,
      measuredHardwareHz: displayRefreshRateHz,
      peakHardwareHz: displayRefreshRateHz,
      averageDeltaMs: Number((1000 / displayRefreshRateHz).toFixed(2)),
      jitterStdDevMs: 0,
      coalescedRatio: 1.0,
      supportsCoalescedEvents: coalescedCount > 0,
      syncRatio: 1.0,
      beatFrequencyHz: 0,
      rating: 'STANDARD',
      ratingDescription: 'Standard VSync-bound touch event dispatch.',
      disclaimer: TOUCH_SAMPLING_DISCLAIMER,
    };
  }

  const sumDelta = deltas.reduce((a, b) => a + b, 0);
  const averageDeltaMs = sumDelta / deltas.length;
  const measuredHardwareHz = Math.round(1000 / averageDeltaMs);

  const minDelta = Math.min(...deltas);
  const peakHardwareHz = Math.round(1000 / minDelta);

  // Standard deviation calculation
  const variance = deltas.reduce((sum, dt) => sum + Math.pow(dt - averageDeltaMs, 2), 0) / deltas.length;
  const jitterStdDevMs = Number(Math.sqrt(variance).toFixed(2));

  const supportsCoalescedEvents = coalescedCount > 0;
  const coalescedRatio = Number((sorted.length / Math.max(1, sorted.length - coalescedCount)).toFixed(2));

  const syncRatio = Number((measuredHardwareHz / displayRefreshRateHz).toFixed(2));

  // Non-integer phase beat frequency stutter (F_beat = |F_touch - k * F_display|)
  const k = Math.round(measuredHardwareHz / Math.max(1, displayRefreshRateHz));
  const beatFrequencyHz = Number(Math.abs(measuredHardwareHz - k * displayRefreshRateHz).toFixed(1));

  let rating: TouchSamplingMetrics['rating'] = 'STANDARD';
  let ratingDescription = 'Standard touch digitizer performance (~60Hz - 120Hz).';

  if (measuredHardwareHz >= 360) {
    rating = 'ULTRA_HIGH';
    ratingDescription = 'Ultra-High Esports Grade Touch Digitizer (>= 360Hz). Ideal for competitive gaming & stylus precision.';
  } else if (measuredHardwareHz >= 200) {
    rating = 'HIGH';
    ratingDescription = 'High-Frequency Touch Digitizer (200Hz - 359Hz). Excellent fluidity and reduced touch latency.';
  } else if (measuredHardwareHz < 50) {
    rating = 'THROTTLED';
    ratingDescription = 'Throttled / Power-Saver Touch Digitizer (< 50Hz). Battery saver or background throttling detected.';
  }

  return {
    sampleCount: sorted.length,
    coalescedEventCount: coalescedCount,
    measuredHardwareHz,
    peakHardwareHz,
    averageDeltaMs: Number(averageDeltaMs.toFixed(2)),
    jitterStdDevMs,
    coalescedRatio,
    supportsCoalescedEvents,
    syncRatio,
    beatFrequencyHz,
    rating,
    ratingDescription,
    disclaimer: TOUCH_SAMPLING_DISCLAIMER,
  };
}

/**
 * Generates inter-sample interval histogram buckets for analyzing touch jitter distribution.
 */
export function generateSamplingHistogram(points: HardwareTouchPoint[]): SamplingHistogramBucket[] {
  const buckets: SamplingHistogramBucket[] = [
    { binLabel: '< 2.5ms (>= 400Hz)', minDeltaMs: 0, maxDeltaMs: 2.5, count: 0 },
    { binLabel: '2.5ms - 5.0ms (200-400Hz)', minDeltaMs: 2.5, maxDeltaMs: 5.0, count: 0 },
    { binLabel: '5.0ms - 10.0ms (100-200Hz)', minDeltaMs: 10.0, maxDeltaMs: 10.0, count: 0 },
    { binLabel: '10.0ms - 20.0ms (50-100Hz)', minDeltaMs: 10.0, maxDeltaMs: 20.0, count: 0 },
    { binLabel: '> 20.0ms (< 50Hz)', minDeltaMs: 20.0, maxDeltaMs: Infinity, count: 0 },
  ];

  if (!points || points.length < 2) return buckets;
  const sorted = [...points].sort((a, b) => a.timestamp - b.timestamp);
  for (let i = 1; i < sorted.length; i++) {
    const dt = sorted[i].timestamp - sorted[i - 1].timestamp;
    if (dt <= 0) continue;
    const bucket = buckets.find((b) => dt >= b.minDeltaMs && dt < b.maxDeltaMs) || buckets[buckets.length - 1];
    bucket.count++;
  }
  return buckets;
}

