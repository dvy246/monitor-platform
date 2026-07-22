/**
 * Refresh Rate Engine (RefreshRateEngine.ts)
 * State-of-the-Art Pure TypeScript calculation engine measuring sub-millisecond
 * display refresh rates (Hz), microsecond frame pacing jitter, P99 variance,
 * Apple ProMotion / Android LTPO dynamic refresh rate transitions, and multi-speed
 * reticle motion sweep vectors.
 *
 * Standards: W3C High Resolution Time Level 2 (performance.now()), ISO 9241-307.
 */

export interface IRefreshRateMetrics {
  currentFps: number;            // Instantaneous FPS from last 10 frames
  smoothedHz: number;            // 60-frame moving average Hz (2 decimal places, e.g. 143.98)
  nominalHz: number;             // Nearest standard display Hz (60, 90, 120, 144, 165, 240, 360, 480, 540)
  minDeltaMs: number;            // Peak instantaneous frame time (ms)
  maxDeltaMs: number;            // Worst instantaneous frame time (ms)
  averageDeltaMs: number;        // Average frame interval (ms)
  jitterStdDevMs: number;        // Inter-frame jitter standard deviation (ms)
  p99DeltaMs: number;            // P99 frame pacing latency (ms)
  frameDropSpikeCount: number;   // Count of frames exceeding 1.5x expected pacing
  rating: 'ESPORTS_FLAGSHIP' | 'COMPETITIVE_HIGH_HZ' | 'FLUID_STANDARD' | 'DYNAMIC_LTPO' | 'STUTTER_WARN';
  ratingLabel: string;
  ratingColor: string;
  disclaimer: string;
}

export interface ILtpoStatus {
  isLtpoDetected: boolean;       // Dynamic Hz scaling detected (e.g. 10Hz-120Hz)
  currentLtpoState: 'IDLE_THROTTLED' | 'TOUCH_BOOSTED' | 'STATIC_RATE';
  minObservedHz: number;
  maxObservedHz: number;
  boostMultiplier: number;       // Ratio between peak and idle Hz
}

export interface IMotionSweepVector {
  speedMultiplier: number;       // 1.0 (1x), 0.5 (1/2x), 0.25 (1/4x), 0.125 (1/8x)
  positionPx: number;            // Horizontal pixel offset across screen width
  expectedStepPx: number;        // Step distance per frame presentation
  label: string;
}

export const REFRESH_RATE_DISCLAIMER =
  'Notice: Display refresh rates and frame pacing deltas are evaluated using W3C High Resolution Time performance.now() microsecond hardware timestamps. Results reflect browser compositor scheduling and physical panel VSync refresh capability.';

const STANDARD_NOMINAL_RATES = [60, 75, 90, 100, 120, 144, 165, 180, 240, 270, 360, 480, 540];

/**
 * Calculates the nearest standard nominal display refresh rate in Hz.
 */
export function calculateNominalHz(measuredHz: number): number {
  if (!Number.isFinite(measuredHz) || measuredHz <= 0) return 60;
  let closest = 60;
  let minDiff = Infinity;

  for (const target of STANDARD_NOMINAL_RATES) {
    const diff = Math.abs(measuredHz - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = target;
    }
  }

  // If within 5% of target, return nominal rate; else return rounded measured Hz
  if (minDiff <= closest * 0.08) {
    return closest;
  }
  return Math.round(measuredHz);
}

/**
 * Calculates comprehensive refresh rate telemetry from high-resolution microsecond frame timestamps.
 */
export function calculateRefreshRateMetrics(
  timestampsMs: number[],
  sampleWindow: number = 60
): IRefreshRateMetrics {
  if (!Array.isArray(timestampsMs) || timestampsMs.length < 2) {
    return {
      currentFps: 0,
      smoothedHz: 60.0,
      nominalHz: 60,
      minDeltaMs: 16.67,
      maxDeltaMs: 16.67,
      averageDeltaMs: 16.67,
      jitterStdDevMs: 0,
      p99DeltaMs: 16.67,
      frameDropSpikeCount: 0,
      rating: 'FLUID_STANDARD',
      ratingLabel: 'Standard 60Hz Display',
      ratingColor: '#10b981',
      disclaimer: REFRESH_RATE_DISCLAIMER,
    };
  }

  // Slice recent window
  const windowed = timestampsMs.slice(-sampleWindow);
  const deltas: number[] = [];

  for (let i = 1; i < windowed.length; i++) {
    const dt = windowed[i] - windowed[i - 1];
    // Filter impossible zero/outlier deltas (e.g. background tab throttling > 500ms)
    if (dt > 0.5 && dt < 500) {
      deltas.push(dt);
    }
  }

  if (deltas.length === 0) {
    return {
      currentFps: 60,
      smoothedHz: 60.0,
      nominalHz: 60,
      minDeltaMs: 16.67,
      maxDeltaMs: 16.67,
      averageDeltaMs: 16.67,
      jitterStdDevMs: 0,
      p99DeltaMs: 16.67,
      frameDropSpikeCount: 0,
      rating: 'FLUID_STANDARD',
      ratingLabel: 'Standard 60Hz Display',
      ratingColor: '#10b981',
      disclaimer: REFRESH_RATE_DISCLAIMER,
    };
  }

  const sumDelta = deltas.reduce((a, b) => a + b, 0);
  const averageDeltaMs = sumDelta / deltas.length;
  const rawHz = 1000 / averageDeltaMs;
  const smoothedHz = Number(rawHz.toFixed(2));
  const nominalHz = calculateNominalHz(smoothedHz);

  // Compute recent 10-frame instantaneous FPS
  const recentDeltas = deltas.slice(-10);
  const recentAvg = recentDeltas.reduce((a, b) => a + b, 0) / recentDeltas.length;
  const currentFps = Math.round(1000 / recentAvg);

  const minDeltaMs = Number(Math.min(...deltas).toFixed(2));
  const maxDeltaMs = Number(Math.max(...deltas).toFixed(2));

  // Compute variance & standard deviation jitter
  const variance = deltas.reduce((acc, dt) => acc + Math.pow(dt - averageDeltaMs, 2), 0) / deltas.length;
  const jitterStdDevMs = Number(Math.sqrt(variance).toFixed(2));

  // Compute P99 frame pacing latency
  const sortedDeltas = [...deltas].sort((a, b) => a - b);
  const p99Index = Math.min(sortedDeltas.length - 1, Math.floor(sortedDeltas.length * 0.99));
  const p99DeltaMs = Number(sortedDeltas[p99Index].toFixed(2));

  // Count micro-stutter frame drops (> 1.5x expected pacing)
  const expectedFrameTimeMs = 1000 / nominalHz;
  const frameDropSpikeCount = deltas.filter((dt) => dt >= expectedFrameTimeMs * 1.5).length;

  let rating: IRefreshRateMetrics['rating'] = 'FLUID_STANDARD';
  let ratingLabel = `Standard ${nominalHz}Hz Display`;
  let ratingColor = '#10b981'; // Green

  if (nominalHz >= 360) {
    rating = 'ESPORTS_FLAGSHIP';
    ratingLabel = `Esports Ultra Flagship (${nominalHz}Hz)`;
    ratingColor = '#a855f7'; // Purple
  } else if (nominalHz >= 144) {
    rating = 'COMPETITIVE_HIGH_HZ';
    ratingLabel = `High-Refresh Competitive (${nominalHz}Hz)`;
    ratingColor = '#06b6d4'; // Cyan
  } else if (jitterStdDevMs > 4.0) {
    rating = 'STUTTER_WARN';
    ratingLabel = `Frame Pacing Jitter (${nominalHz}Hz)`;
    ratingColor = '#f59e0b'; // Amber
  }

  return {
    currentFps,
    smoothedHz,
    nominalHz,
    minDeltaMs,
    maxDeltaMs,
    averageDeltaMs: Number(averageDeltaMs.toFixed(2)),
    jitterStdDevMs,
    p99DeltaMs,
    frameDropSpikeCount,
    rating,
    ratingLabel,
    ratingColor,
    disclaimer: REFRESH_RATE_DISCLAIMER,
  };
}

/**
 * Detects Apple ProMotion & Android LTPO dynamic variable refresh rate scaling behavior.
 */
export function detectMobileLtpoStatus(
  historyHz: number[],
  isTouchActive: boolean = false
): ILtpoStatus {
  if (!Array.isArray(historyHz) || historyHz.length < 10) {
    return {
      isLtpoDetected: false,
      currentLtpoState: 'STATIC_RATE',
      minObservedHz: 60,
      maxObservedHz: 60,
      boostMultiplier: 1.0,
    };
  }

  const validHz = historyHz.filter((hz) => Number.isFinite(hz) && hz > 0);
  if (validHz.length < 5) {
    return {
      isLtpoDetected: false,
      currentLtpoState: 'STATIC_RATE',
      minObservedHz: 60,
      maxObservedHz: 60,
      boostMultiplier: 1.0,
    };
  }

  const minObservedHz = Math.round(Math.min(...validHz));
  const maxObservedHz = Math.round(Math.max(...validHz));
  const spread = maxObservedHz - minObservedHz;
  const isLtpoDetected = spread >= 30;

  let currentLtpoState: ILtpoStatus['currentLtpoState'] = 'STATIC_RATE';
  if (isLtpoDetected) {
    if (isTouchActive || validHz[validHz.length - 1] >= maxObservedHz * 0.85) {
      currentLtpoState = 'TOUCH_BOOSTED';
    } else {
      currentLtpoState = 'IDLE_THROTTLED';
    }
  }

  const boostMultiplier = Number((maxObservedHz / Math.max(1, minObservedHz)).toFixed(1));

  return {
    isLtpoDetected,
    currentLtpoState,
    minObservedHz,
    maxObservedHz,
    boostMultiplier,
  };
}

/**
 * Computes side-by-side motion sweep reticle positions for 1x, 1/2x, 1/4x, 1/8x fractional rates.
 */
export function calculateMotionSweepVectors(
  elapsedTimeSec: number,
  canvasWidthPx: number = 800,
  nominalHz: number = 144,
  baseSpeedPxSec: number = 960
): IMotionSweepVector[] {
  const safeTime = Number.isFinite(elapsedTimeSec) && elapsedTimeSec >= 0 ? elapsedTimeSec : 0;
  const safeWidth = Number.isFinite(canvasWidthPx) && canvasWidthPx > 0 ? canvasWidthPx : 800;
  const safeHz = Number.isFinite(nominalHz) && nominalHz > 0 ? nominalHz : 60;

  const multipliers = [
    { speedMultiplier: 1.0, label: '100% Rate (1x Native)' },
    { speedMultiplier: 0.5, label: '50% Rate (1/2x Fractional)' },
    { speedMultiplier: 0.25, label: '25% Rate (1/4x Fractional)' },
    { speedMultiplier: 0.125, label: '12.5% Rate (1/8x Fractional)' },
  ];

  return multipliers.map((item) => {
    const effectiveSpeed = baseSpeedPxSec * item.speedMultiplier;
    // Oscillate back and forth across canvas width
    const periodSec = (safeWidth * 2) / Math.max(1, effectiveSpeed);
    const cyclePos = (safeTime % periodSec) / periodSec; // 0..1
    let positionPx = 0;
    if (cyclePos < 0.5) {
      positionPx = cyclePos * 2 * safeWidth;
    } else {
      positionPx = (1 - cyclePos) * 2 * safeWidth;
    }

    const expectedStepPx = Number((effectiveSpeed / safeHz).toFixed(2));

    return {
      speedMultiplier: item.speedMultiplier,
      positionPx: Number(positionPx.toFixed(1)),
      expectedStepPx,
      label: item.label,
    };
  });
}
