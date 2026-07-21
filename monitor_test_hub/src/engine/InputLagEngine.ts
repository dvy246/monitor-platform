/**
 * High-Refresh Input Lag & Reflex Reaction Sniper Engine
 * Pure math engine for sub-millisecond flash-to-click latency statistics,
 * polling rate vs refresh rate bottleneck analysis, and reaction time histogram binning.
 */

export type RefreshRate = '60hz' | '120hz' | '144hz' | '240hz' | '360hz' | '540hz';
export type PollingRate = '125hz' | '500hz' | '1000hz' | '2000hz' | '4000hz' | '8000hz';
export type ReactionRating = 'ESPORTS_ELITE' | 'FAST_REFLEX' | 'AVERAGE' | 'SLOW' | 'DELAYED';
export type BottleneckType = 'DISPLAY_LIMITED' | 'POLLING_LIMITED' | 'BALANCED';

export interface ReactionStats {
  meanMs: number;
  medianMs: number;
  minMs: number;
  maxMs: number;
  stdDevMs: number;
  sampleCount: number;
  jitterMs: number;
  rating: ReactionRating;
  ratingLabel: string;
}

export interface BottleneckAnalysis {
  refreshRate: RefreshRate;
  pollingRate: PollingRate;
  refreshRateHz: number;
  pollingRateHz: number;
  frameIntervalMs: number;
  pollingIntervalMs: number;
  avgDisplayFrameDelayMs: number;
  avgPollingDelayMs: number;
  totalBaselineHardwareDelayMs: number;
  maxLatencyJitterMs: number;
  bottleneckType: BottleneckType;
  bottleneckLabel: string;
  bottleneckDescription: string;
  recommendation: string;
}

export interface HistogramBin {
  binIndex: number;
  minMs: number;
  maxMs: number;
  rangeLabel: string;
  count: number;
  percentage: number;
  isPeak: boolean;
}

export interface HistogramResult {
  bins: HistogramBin[];
  totalValidSamples: number;
  modalPeakBinIndex: number;
  binWidthMs: number;
}

export interface HistogramOptions {
  binCount?: number;
  minMs?: number;
  maxMs?: number;
  fixedBinWidthMs?: number;
}

export interface InputLagSummary {
  stats: ReactionStats;
  bottleneck: BottleneckAnalysis;
  histogram: HistogramResult;
}

export const REFRESH_RATE_CONFIG: Record<RefreshRate, { hz: number; label: string; framePeriodMs: number }> = {
  '60hz': { hz: 60, label: '60 Hz Standard', framePeriodMs: 16.67 },
  '120hz': { hz: 120, label: '120 Hz High-Speed', framePeriodMs: 8.33 },
  '144hz': { hz: 144, label: '144 Hz Gaming', framePeriodMs: 6.94 },
  '240hz': { hz: 240, label: '240 Hz Esports', framePeriodMs: 4.17 },
  '360hz': { hz: 360, label: '360 Hz Pro', framePeriodMs: 2.78 },
  '540hz': { hz: 540, label: '540 Hz Ultra-Fast', framePeriodMs: 1.85 }
};

export const POLLING_RATE_CONFIG: Record<PollingRate, { hz: number; label: string; pollPeriodMs: number }> = {
  '125hz': { hz: 125, label: '125 Hz Standard', pollPeriodMs: 8.00 },
  '500hz': { hz: 500, label: '500 Hz High-Speed', pollPeriodMs: 2.00 },
  '1000hz': { hz: 1000, label: '1000 Hz Gaming', pollPeriodMs: 1.00 },
  '2000hz': { hz: 2000, label: '2000 Hz Pro-Polling', pollPeriodMs: 0.50 },
  '4000hz': { hz: 4000, label: '4000 Hz Hyper-Polling', pollPeriodMs: 0.25 },
  '8000hz': { hz: 8000, label: '8000 Hz Ultra-Polling', pollPeriodMs: 0.125 }
};

export function getAllRefreshRates(): RefreshRate[] {
  return ['60hz', '120hz', '144hz', '240hz', '360hz', '540hz'];
}

export function getAllPollingRates(): PollingRate[] {
  return ['125hz', '500hz', '1000hz', '2000hz', '4000hz', '8000hz'];
}

export function sanitizeRefreshRate(rate: unknown): RefreshRate {
  if (typeof rate === 'number' && Number.isFinite(rate)) {
    const key = `${Math.round(rate)}hz` as RefreshRate;
    if (key in REFRESH_RATE_CONFIG) return key;
  }
  if (typeof rate === 'string') {
    const normalized = rate.trim().toLowerCase();
    const withHz = normalized.endsWith('hz') ? normalized : `${normalized}hz`;
    if (withHz in REFRESH_RATE_CONFIG) return withHz as RefreshRate;
  }
  return '240hz';
}

export function sanitizePollingRate(rate: unknown): PollingRate {
  if (typeof rate === 'number' && Number.isFinite(rate)) {
    const key = `${Math.round(rate)}hz` as PollingRate;
    if (key in POLLING_RATE_CONFIG) return key;
  }
  if (typeof rate === 'string') {
    const normalized = rate.trim().toLowerCase();
    const withHz = normalized.endsWith('hz') ? normalized : `${normalized}hz`;
    if (withHz in POLLING_RATE_CONFIG) return withHz as PollingRate;
  }
  return '1000hz';
}

export function getRefreshRateHz(rate: unknown): number {
  return REFRESH_RATE_CONFIG[sanitizeRefreshRate(rate)].hz;
}

export function getPollingRateHz(rate: unknown): number {
  return POLLING_RATE_CONFIG[sanitizePollingRate(rate)].hz;
}

export function getRefreshRateLabel(rate: unknown): string {
  return REFRESH_RATE_CONFIG[sanitizeRefreshRate(rate)].label;
}

export function getPollingRateLabel(rate: unknown): string {
  return POLLING_RATE_CONFIG[sanitizePollingRate(rate)].label;
}

export function getFrameIntervalMs(rate: unknown): number {
  const hz = getRefreshRateHz(rate);
  return Number((1000 / hz).toFixed(2));
}

export function getPollingIntervalMs(rate: unknown): number {
  const hz = getPollingRateHz(rate);
  return Number((1000 / hz).toFixed(3));
}

export function calculateLatency(flashTime: number, clickTime: number): number {
  if (!Number.isFinite(flashTime) || !Number.isFinite(clickTime)) return 0;
  const delta = clickTime - flashTime;
  return Number(Math.max(0, delta).toFixed(2));
}

export function sanitizeLatencies(latencies: number[], minThresholdMs = 50, maxThresholdMs = 2000): number[] {
  if (!Array.isArray(latencies)) return [];
  return latencies.filter(
    (l) => typeof l === 'number' && Number.isFinite(l) && l >= minThresholdMs && l <= maxThresholdMs
  );
}

export function calculateReactionStats(
  latencies: number[],
  minThresholdMs = 50,
  maxThresholdMs = 2000
): ReactionStats {
  const valid = sanitizeLatencies(latencies, minThresholdMs, maxThresholdMs);
  const sampleCount = valid.length;

  if (sampleCount === 0) {
    return {
      meanMs: 0,
      medianMs: 0,
      minMs: 0,
      maxMs: 0,
      stdDevMs: 0,
      sampleCount: 0,
      jitterMs: 0,
      rating: 'DELAYED',
      ratingLabel: 'No Valid Reaction Data'
    };
  }

  const sorted = [...valid].sort((a, b) => a - b);
  const minMs = Number(sorted[0].toFixed(2));
  const maxMs = Number(sorted[sorted.length - 1].toFixed(2));

  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const meanMs = Number((sum / sampleCount).toFixed(2));

  const mid = Math.floor(sampleCount / 2);
  const medianMs =
    sampleCount % 2 === 0
      ? Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2))
      : Number(sorted[mid].toFixed(2));

  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - meanMs, 2), 0) / sampleCount;
  const stdDevMs = Number(Math.sqrt(variance).toFixed(2));

  let jitterSum = 0;
  if (valid.length > 1) {
    for (let i = 1; i < valid.length; i++) {
      jitterSum += Math.abs(valid[i] - valid[i - 1]);
    }
  }
  const jitterMs = valid.length > 1 ? Number((jitterSum / (valid.length - 1)).toFixed(2)) : 0;

  let rating: ReactionRating;
  let ratingLabel: string;

  if (meanMs < 160) {
    rating = 'ESPORTS_ELITE';
    ratingLabel = 'Esports Elite (<160ms)';
  } else if (meanMs < 200) {
    rating = 'FAST_REFLEX';
    ratingLabel = 'Fast Reflexes (160-200ms)';
  } else if (meanMs < 250) {
    rating = 'AVERAGE';
    ratingLabel = 'Average Human Reaction (200-250ms)';
  } else if (meanMs < 350) {
    rating = 'SLOW';
    ratingLabel = 'Slower Reaction (250-350ms)';
  } else {
    rating = 'DELAYED';
    ratingLabel = 'Delayed Reaction (≥350ms)';
  }

  return {
    meanMs,
    medianMs,
    minMs,
    maxMs,
    stdDevMs,
    sampleCount,
    jitterMs,
    rating,
    ratingLabel
  };
}

export function analyzeBottleneck(refreshRate: unknown, pollingRate: unknown): BottleneckAnalysis {
  const cleanHzKey = sanitizeRefreshRate(refreshRate);
  const cleanPollKey = sanitizePollingRate(pollingRate);

  const refreshRateHz = REFRESH_RATE_CONFIG[cleanHzKey].hz;
  const pollingRateHz = POLLING_RATE_CONFIG[cleanPollKey].hz;

  const frameIntervalMs = Number((1000 / refreshRateHz).toFixed(2));
  const pollingIntervalMs = Number((1000 / pollingRateHz).toFixed(3));

  const avgDisplayFrameDelayMs = Number((frameIntervalMs / 2).toFixed(2));
  const avgPollingDelayMs = Number((pollingIntervalMs / 2).toFixed(3));

  const totalBaselineHardwareDelayMs = Number((avgDisplayFrameDelayMs + avgPollingDelayMs).toFixed(3));
  const maxLatencyJitterMs = Number((frameIntervalMs + pollingIntervalMs).toFixed(3));

  const ratio = frameIntervalMs / pollingIntervalMs;

  let bottleneckType: BottleneckType;
  let bottleneckLabel: string;
  let bottleneckDescription: string;
  let recommendation: string;

  if (ratio > 1.5) {
    bottleneckType = 'DISPLAY_LIMITED';
    bottleneckLabel = 'Display Refresh Bottleneck';
    bottleneckDescription = `Display frame interval (${frameIntervalMs}ms) is significantly larger than mouse polling interval (${pollingIntervalMs}ms). Input events spend more time waiting for the next VSync scanline.`;
    recommendation = 'Upgrade to a 240Hz, 360Hz, or 540Hz high-refresh display to reduce hardware latency delay.';
  } else if (ratio < 0.67) {
    bottleneckType = 'POLLING_LIMITED';
    bottleneckLabel = 'USB Mouse Polling Bottleneck';
    bottleneckDescription = `Mouse polling interval (${pollingIntervalMs}ms) is larger than display frame time (${frameIntervalMs}ms). Mouse position updates lag behind display refresh updates.`;
    recommendation = 'Increase mouse polling rate to 1000Hz, 4000Hz, or 8000Hz in your mouse software.';
  } else {
    bottleneckType = 'BALANCED';
    bottleneckLabel = 'Balanced Hardware Pipeline';
    bottleneckDescription = `Display refresh rate (${refreshRateHz}Hz) and mouse polling rate (${pollingRateHz}Hz) are well-aligned for low input latency.`;
    recommendation = 'Hardware configuration is optimal. Focus on GPU frame pacing and low-latency display settings.';
  }

  return {
    refreshRate: cleanHzKey,
    pollingRate: cleanPollKey,
    refreshRateHz,
    pollingRateHz,
    frameIntervalMs,
    pollingIntervalMs,
    avgDisplayFrameDelayMs,
    avgPollingDelayMs,
    totalBaselineHardwareDelayMs,
    maxLatencyJitterMs,
    bottleneckType,
    bottleneckLabel,
    bottleneckDescription,
    recommendation
  };
}

export function calculateHistogramBins(latencies: number[], options?: HistogramOptions): HistogramResult {
  const sanitized = sanitizeLatencies(latencies);
  const totalValidSamples = sanitized.length;

  const binCount = Math.max(1, options?.binCount ?? 5);

  if (totalValidSamples === 0) {
    return {
      bins: [],
      totalValidSamples: 0,
      modalPeakBinIndex: -1,
      binWidthMs: 0
    };
  }

  let minVal = options?.minMs ?? Math.floor(Math.min(...sanitized));
  let maxVal = options?.maxMs ?? Math.ceil(Math.max(...sanitized));

  if (minVal >= maxVal) {
    maxVal = minVal + 10;
  }

  const binWidthMs = options?.fixedBinWidthMs ?? Number(((maxVal - minVal) / binCount).toFixed(2));

  let maxCount = 0;
  const rawBins: { binIndex: number; minMs: number; maxMs: number; rangeLabel: string; count: number; percentage: number }[] = [];

  for (let i = 0; i < binCount; i++) {
    const bMin = Number((minVal + i * binWidthMs).toFixed(2));
    const bMax = Number((minVal + (i + 1) * binWidthMs).toFixed(2));

    const count = sanitized.filter((val) => {
      if (i === binCount - 1) {
        return val >= bMin && val <= bMax;
      }
      return val >= bMin && val < bMax;
    }).length;

    if (count > maxCount) maxCount = count;

    const percentage = Number(((count / totalValidSamples) * 100).toFixed(1));

    rawBins.push({
      binIndex: i,
      minMs: bMin,
      maxMs: bMax,
      rangeLabel: `${bMin} - ${bMax} ms`,
      count,
      percentage
    });
  }

  let modalPeakBinIndex = -1;
  const bins: HistogramBin[] = rawBins.map((bin) => {
    const isPeak = maxCount > 0 && bin.count === maxCount;
    if (isPeak && modalPeakBinIndex === -1) {
      modalPeakBinIndex = bin.binIndex;
    }
    return {
      ...bin,
      isPeak
    };
  });

  return {
    bins,
    totalValidSamples,
    modalPeakBinIndex,
    binWidthMs
  };
}

export function calculateInputLagSummary(
  latencies: number[],
  refreshRate: unknown,
  pollingRate: unknown,
  options?: HistogramOptions
): InputLagSummary {
  return {
    stats: calculateReactionStats(latencies),
    bottleneck: analyzeBottleneck(refreshRate, pollingRate),
    histogram: calculateHistogramBins(latencies, options)
  };
}
