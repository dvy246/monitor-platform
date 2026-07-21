export type GpuVendor = 'nvidia-geforce' | 'amd-radeon' | 'intel-arc' | 'apple-silicon';
export type RefreshRate = '60hz' | '144hz' | '240hz' | '360hz' | '540hz';
export type SweepMode = 'sine' | 'ramp' | 'stress';

export interface ILfcStatus {
  isLfcActive: boolean;
  effectiveFps: number;
  multiplier: number;
}

export interface IStutterMetrics {
  variance: number; // ms^2
  stdDev: number;   // ms
  maxDeltaMs: number;
  frameDropCount: number;
}

export interface IVrrMetrics {
  targetFps: number;
  effectiveFps: number;
  displayRefreshHz: number;
  lfc: ILfcStatus;
  stutter: IStutterMetrics;
  syncMode: 'NATIVE_VRR' | 'LFC_ACTIVE' | 'TEARING_DESYNC';
  isTearing: boolean;
  vendorLabel: string;
  refreshRateLabel: string;
}

const VALID_GPU_VENDORS: GpuVendor[] = ['nvidia-geforce', 'amd-radeon', 'intel-arc', 'apple-silicon'];
const VALID_REFRESH_RATES: RefreshRate[] = ['60hz', '144hz', '240hz', '360hz', '540hz'];

const REFRESH_RATE_MAP: Record<RefreshRate, number> = {
  '60hz': 60,
  '144hz': 144,
  '240hz': 240,
  '360hz': 360,
  '540hz': 540
};

const GPU_VENDOR_LABELS: Record<GpuVendor, string> = {
  'nvidia-geforce': 'NVIDIA GeForce (G-Sync / G-Sync Compatible)',
  'amd-radeon': 'AMD Radeon (FreeSync / FreeSync Premium Pro)',
  'intel-arc': 'Intel Arc (Adaptive-Sync / VRR)',
  'apple-silicon': 'Apple Silicon (ProMotion Dynamic VRR)'
};

/**
 * Returns all valid GPU vendor identifiers.
 */
export function getAllGpuVendors(): GpuVendor[] {
  return [...VALID_GPU_VENDORS];
}

/**
 * Returns all valid refresh rate identifiers.
 */
export function getAllRefreshRates(): RefreshRate[] {
  return [...VALID_REFRESH_RATES];
}

/**
 * Sanitizes and validates GPU vendor string.
 * Fallback: 'nvidia-geforce'
 */
export function sanitizeGpuVendor(vendor: unknown): GpuVendor {
  if (typeof vendor !== 'string') {
    return 'nvidia-geforce';
  }
  const clean = vendor.trim().toLowerCase();
  if (VALID_GPU_VENDORS.includes(clean as GpuVendor)) {
    return clean as GpuVendor;
  }
  return 'nvidia-geforce';
}

/**
 * Sanitizes and validates Refresh Rate string.
 * Fallback: '144hz'
 */
export function sanitizeRefreshRate(rate: unknown): RefreshRate {
  if (typeof rate !== 'string') {
    return '144hz';
  }
  const clean = rate.trim().toLowerCase();
  if (VALID_REFRESH_RATES.includes(clean as RefreshRate)) {
    return clean as RefreshRate;
  }
  // Try numeric parsing if given e.g. "144"
  const parsedNum = parseInt(clean, 10);
  if (Number.isFinite(parsedNum)) {
    const formatted = `${parsedNum}hz` as RefreshRate;
    if (VALID_REFRESH_RATES.includes(formatted)) {
      return formatted;
    }
  }
  return '144hz';
}

/**
 * Gets numeric refresh rate value in Hz (e.g. 144).
 */
export function getRefreshRateHz(rate: unknown): number {
  const sanitized = sanitizeRefreshRate(rate);
  return REFRESH_RATE_MAP[sanitized] || 144;
}

/**
 * Gets human-readable title for GPU vendor.
 */
export function getGpuVendorLabel(vendor: unknown): string {
  const sanitized = sanitizeGpuVendor(vendor);
  return GPU_VENDOR_LABELS[sanitized];
}

/**
 * Gets human-readable title for Refresh Rate.
 */
export function getRefreshRateLabel(rate: unknown): string {
  const sanitized = sanitizeRefreshRate(rate);
  return `${REFRESH_RATE_MAP[sanitized]} Hz`;
}

/**
 * Detects Low Frame Rate Compensation (LFC) state.
 * Standard VESA VRR minimum threshold is 48 Hz.
 * If target FPS < minVrrHz, LFC multiplies frame presentations (2x, 3x, etc.)
 * to keep the display physical refresh rate inside the hardware VRR window.
 */
export function calculateLfcStatus(fps: number, minVrrHz: number = 48): ILfcStatus {
  const safeFps = Number.isFinite(fps) && fps > 0 ? fps : 0;
  const safeMinHz = Number.isFinite(minVrrHz) && minVrrHz > 0 ? minVrrHz : 48;

  if (safeFps === 0 || safeFps >= safeMinHz) {
    return {
      isLfcActive: false,
      effectiveFps: safeFps,
      multiplier: 1
    };
  }

  // Frame doubling / tripling multiplier to exceed minVrrHz limit
  const multiplier = Math.max(2, Math.ceil(safeMinHz / safeFps));
  const effectiveFps = safeFps * multiplier;

  return {
    isLfcActive: true,
    effectiveFps: Math.round(effectiveFps * 100) / 100,
    multiplier
  };
}

/**
 * Computes micro-stutter variance (ms^2), standard deviation (ms),
 * maximum frame delta, and frame drop count over a buffer of frame delta times.
 */
export function calculateStutterVariance(
  frameTimesMs: number[],
  expectedFrameTimeMs: number = 16.67
): IStutterMetrics {
  const safeExpected = Number.isFinite(expectedFrameTimeMs) && expectedFrameTimeMs > 0 ? expectedFrameTimeMs : 16.67;

  if (!Array.isArray(frameTimesMs) || frameTimesMs.length === 0) {
    return {
      variance: 0,
      stdDev: 0,
      maxDeltaMs: 0,
      frameDropCount: 0
    };
  }

  // Sanitize array elements
  const validDeltas = frameTimesMs.filter((dt) => Number.isFinite(dt) && dt > 0);
  if (validDeltas.length === 0) {
    return {
      variance: 0,
      stdDev: 0,
      maxDeltaMs: 0,
      frameDropCount: 0
    };
  }

  const count = validDeltas.length;
  const sum = validDeltas.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  let squaredDiffSum = 0;
  let maxDeltaMs = 0;
  let frameDropCount = 0;

  for (let i = 0; i < count; i++) {
    const dt = validDeltas[i];
    if (dt > maxDeltaMs) {
      maxDeltaMs = dt;
    }
    // Count frame drop when frame time exceeds 1.5x expected pacing (micro-stutter spike)
    if (dt >= safeExpected * 1.5) {
      frameDropCount++;
    }
    const diff = dt - mean;
    squaredDiffSum += diff * diff;
  }

  const variance = count > 1 ? squaredDiffSum / count : 0;
  const stdDev = Math.sqrt(variance);

  return {
    variance: Math.round(variance * 1000) / 1000,
    stdDev: Math.round(stdDev * 1000) / 1000,
    maxDeltaMs: Math.round(maxDeltaMs * 100) / 100,
    frameDropCount
  };
}

/**
 * Calculates current simulated target FPS based on sweep mode and elapsed time.
 */
export function getSweepFps(
  mode: SweepMode,
  elapsedTimeSec: number,
  maxHz: number,
  minHz: number = 20
): number {
  const safeTime = Number.isFinite(elapsedTimeSec) && elapsedTimeSec >= 0 ? elapsedTimeSec : 0;
  const safeMax = Number.isFinite(maxHz) && maxHz > 0 ? maxHz : 144;
  const safeMin = Number.isFinite(minHz) && minHz >= 10 ? minHz : 20;

  const range = safeMax - safeMin;

  if (mode === 'ramp') {
    // 6-second ramp cycle from minHz to maxHz and back down
    const period = 6;
    const cyclePos = (safeTime % period) / period; // 0..1
    let factor = 0;
    if (cyclePos < 0.5) {
      factor = cyclePos * 2; // 0 -> 1
    } else {
      factor = (1 - cyclePos) * 2; // 1 -> 0
    }
    return Math.round((safeMin + range * factor) * 10) / 10;
  }

  if (mode === 'stress') {
    // Rapid oscillation with periodic stutter drops into LFC zone (< 48Hz)
    const baseSine = 0.5 + 0.5 * Math.sin(safeTime * 2.5);
    let fps = safeMin + range * baseSine;

    // Every ~3.5 seconds, simulate a sudden micro-stutter frame drop to ~24 FPS
    if (Math.floor(safeTime * 10) % 35 === 0) {
      fps = 24;
    }
    return Math.round(fps * 10) / 10;
  }

  // Default: Sine mode (4-second smooth sine wave oscillation)
  const sineFactor = 0.5 + 0.5 * Math.sin(safeTime * 1.5);
  return Math.round((safeMin + range * sineFactor) * 10) / 10;
}

/**
 * Computes full state metrics snapshot for VRR Sweep Engine.
 */
export function calculateVrrMetrics(
  targetFps: number,
  maxRefreshRateHz: number,
  minVrrHz: number = 48,
  vendor: unknown = 'nvidia-geforce'
): IVrrMetrics {
  const safeFps = Number.isFinite(targetFps) && targetFps > 0 ? targetFps : 60;
  const safeMaxHz = Number.isFinite(maxRefreshRateHz) && maxRefreshRateHz > 0 ? maxRefreshRateHz : 144;
  const safeMinHz = Number.isFinite(minVrrHz) && minVrrHz > 0 ? minVrrHz : 48;
  const gpuVendor = sanitizeGpuVendor(vendor);

  const lfc = calculateLfcStatus(safeFps, safeMinHz);

  let syncMode: IVrrMetrics['syncMode'] = 'NATIVE_VRR';
  let isTearing = false;
  let displayRefreshHz = safeFps;

  if (safeFps > safeMaxHz) {
    syncMode = 'TEARING_DESYNC';
    isTearing = true;
    displayRefreshHz = safeMaxHz;
  } else if (lfc.isLfcActive) {
    syncMode = 'LFC_ACTIVE';
    isTearing = false;
    displayRefreshHz = lfc.effectiveFps;
  } else {
    syncMode = 'NATIVE_VRR';
    isTearing = false;
    displayRefreshHz = safeFps;
  }

  const expectedFrameTimeMs = 1000 / safeFps;
  const mockFrameTimes = [
    expectedFrameTimeMs,
    expectedFrameTimeMs * 1.02,
    expectedFrameTimeMs * 0.98,
    expectedFrameTimeMs
  ];
  const stutter = calculateStutterVariance(mockFrameTimes, expectedFrameTimeMs);

  return {
    targetFps: Math.round(safeFps * 10) / 10,
    effectiveFps: lfc.isLfcActive ? lfc.effectiveFps : Math.round(safeFps * 10) / 10,
    displayRefreshHz: Math.round(displayRefreshHz * 10) / 10,
    lfc,
    stutter,
    syncMode,
    isTearing,
    vendorLabel: GPU_VENDOR_LABELS[gpuVendor],
    refreshRateLabel: `${safeMaxHz} Hz`
  };
}
