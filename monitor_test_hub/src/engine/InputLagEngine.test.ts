import { describe, it, expect } from 'vitest';
import {
  getAllRefreshRates,
  getAllPollingRates,
  sanitizeRefreshRate,
  sanitizePollingRate,
  getRefreshRateHz,
  getPollingRateHz,
  getRefreshRateLabel,
  getPollingRateLabel,
  getFrameIntervalMs,
  getPollingIntervalMs,
  calculateLatency,
  sanitizeLatencies,
  calculateReactionStats,
  analyzeBottleneck,
  calculateHistogramBins,
  calculateInputLagSummary
} from './InputLagEngine';

describe('InputLagEngine — Preset & Sanitization Helpers', () => {
  it('returns complete arrays of preset refresh rates and polling rates', () => {
    const rates = getAllRefreshRates();
    const polls = getAllPollingRates();

    expect(rates).toEqual(['60hz', '120hz', '144hz', '240hz', '360hz', '540hz']);
    expect(polls).toEqual(['125hz', '500hz', '1000hz', '2000hz', '4000hz', '8000hz']);
  });

  it('correctly sanitizes refresh rates from various inputs', () => {
    expect(sanitizeRefreshRate('60hz')).toBe('60hz');
    expect(sanitizeRefreshRate('144')).toBe('144hz');
    expect(sanitizeRefreshRate('  360HZ  ')).toBe('360hz');
    expect(sanitizeRefreshRate(540)).toBe('540hz');
    expect(sanitizeRefreshRate(60)).toBe('60hz');
    // Fallback default
    expect(sanitizeRefreshRate('unknown')).toBe('240hz');
    expect(sanitizeRefreshRate(null)).toBe('240hz');
    expect(sanitizeRefreshRate(undefined)).toBe('240hz');
    expect(sanitizeRefreshRate(NaN)).toBe('240hz');
  });

  it('correctly sanitizes polling rates from various inputs', () => {
    expect(sanitizePollingRate('125hz')).toBe('125hz');
    expect(sanitizePollingRate('500')).toBe('500hz');
    expect(sanitizePollingRate('8000HZ')).toBe('8000hz');
    expect(sanitizePollingRate(1000)).toBe('1000hz');
    expect(sanitizePollingRate(4000)).toBe('4000hz');
    // Fallback default
    expect(sanitizePollingRate('invalid')).toBe('1000hz');
    expect(sanitizePollingRate(null)).toBe('1000hz');
    expect(sanitizePollingRate(undefined)).toBe('1000hz');
  });

  it('returns accurate Hz numbers, labels, and period intervals', () => {
    expect(getRefreshRateHz('60hz')).toBe(60);
    expect(getRefreshRateHz(240)).toBe(240);
    expect(getPollingRateHz('1000hz')).toBe(1000);
    expect(getPollingRateHz(8000)).toBe(8000);

    expect(getRefreshRateLabel('144hz')).toBe('144 Hz Gaming');
    expect(getPollingRateLabel('8000hz')).toBe('8000 Hz Ultra-Polling');

    expect(getFrameIntervalMs('60hz')).toBeCloseTo(16.67, 2);
    expect(getFrameIntervalMs('240hz')).toBeCloseTo(4.17, 2);
    expect(getPollingIntervalMs('1000hz')).toBe(1.0);
    expect(getPollingIntervalMs('125hz')).toBe(8.0);
  });
});

describe('InputLagEngine — Latency Calculations & Sanitization', () => {
  it('calculates sub-millisecond click latency correctly', () => {
    expect(calculateLatency(1000.5, 1150.75)).toBe(150.25);
    expect(calculateLatency(500, 500)).toBe(0);
    expect(calculateLatency(500, 400)).toBe(0); // Negative delta clamped to 0
    expect(calculateLatency(NaN, 100)).toBe(0);
    expect(calculateLatency(100, Infinity)).toBe(0);
  });

  it('sanitizes latencies array filtering early clicks and timeouts', () => {
    const raw = [10, 45, 120, 180, 220, 2050, NaN, -50, 300];
    const cleaned = sanitizeLatencies(raw, 50, 2000);
    expect(cleaned).toEqual([120, 180, 220, 300]);
  });

  it('returns empty array when given invalid or empty latencies input', () => {
    expect(sanitizeLatencies([])).toEqual([]);
    expect(sanitizeLatencies(null as any)).toEqual([]);
    expect(sanitizeLatencies([10, 20, 30])).toEqual([]); // all below default minThreshold (50ms)
  });
});

describe('InputLagEngine — Reaction Statistics', () => {
  it('returns fallback zero stats for empty or invalid latency arrays', () => {
    const stats = calculateReactionStats([]);
    expect(stats.meanMs).toBe(0);
    expect(stats.medianMs).toBe(0);
    expect(stats.minMs).toBe(0);
    expect(stats.maxMs).toBe(0);
    expect(stats.stdDevMs).toBe(0);
    expect(stats.sampleCount).toBe(0);
    expect(stats.jitterMs).toBe(0);
    expect(stats.rating).toBe('DELAYED');
    expect(stats.ratingLabel).toBe('No Valid Reaction Data');
  });

  it('calculates precise statistics for odd sample count', () => {
    const latencies = [150, 170, 160];
    const stats = calculateReactionStats(latencies);

    expect(stats.sampleCount).toBe(3);
    expect(stats.minMs).toBe(150);
    expect(stats.maxMs).toBe(170);
    expect(stats.meanMs).toBe(160);
    expect(stats.medianMs).toBe(160);
    expect(stats.rating).toBe('FAST_REFLEX');
  });

  it('calculates precise statistics for even sample count', () => {
    const latencies = [140, 150, 160, 170];
    const stats = calculateReactionStats(latencies);

    expect(stats.sampleCount).toBe(4);
    expect(stats.minMs).toBe(140);
    expect(stats.maxMs).toBe(170);
    expect(stats.meanMs).toBe(155);
    expect(stats.medianMs).toBe(155); // (150 + 160) / 2
    expect(stats.rating).toBe('ESPORTS_ELITE');
  });

  it('classifies all reaction rating tiers correctly', () => {
    expect(calculateReactionStats([140, 150]).rating).toBe('ESPORTS_ELITE');
    expect(calculateReactionStats([170, 180]).rating).toBe('FAST_REFLEX');
    expect(calculateReactionStats([210, 230]).rating).toBe('AVERAGE');
    expect(calculateReactionStats([260, 300]).rating).toBe('SLOW');
    expect(calculateReactionStats([360, 400]).rating).toBe('DELAYED');
  });

  it('computes correct inter-sample jitter', () => {
    // Deltas: |160 - 150| = 10, |170 - 160| = 10, |150 - 170| = 20. Total = 40. Count - 1 = 3. Jitter = 40 / 3 = 13.33
    const latencies = [150, 160, 170, 150];
    const stats = calculateReactionStats(latencies);
    expect(stats.jitterMs).toBeCloseTo(13.33, 2);
  });
});

describe('InputLagEngine — Hardware Bottleneck Analysis', () => {
  it('detects display refresh rate bottleneck when refresh rate is low relative to polling', () => {
    const analysis = analyzeBottleneck('60hz', '8000hz');
    expect(analysis.bottleneckType).toBe('DISPLAY_LIMITED');
    expect(analysis.bottleneckLabel).toBe('Display Refresh Bottleneck');
    expect(analysis.frameIntervalMs).toBeCloseTo(16.67, 2);
    expect(analysis.pollingIntervalMs).toBeCloseTo(0.125, 2);
    expect(analysis.recommendation).toContain('Upgrade to a 240Hz, 360Hz, or 540Hz');
  });

  it('detects USB mouse polling bottleneck when polling rate is low relative to refresh', () => {
    const analysis = analyzeBottleneck('540hz', '125hz');
    expect(analysis.bottleneckType).toBe('POLLING_LIMITED');
    expect(analysis.bottleneckLabel).toBe('USB Mouse Polling Bottleneck');
    expect(analysis.frameIntervalMs).toBeCloseTo(1.85, 2);
    expect(analysis.pollingIntervalMs).toBe(8.0);
    expect(analysis.recommendation).toContain('Increase mouse polling rate');
  });

  it('detects balanced hardware pipeline when refresh rate and polling rate are aligned', () => {
    const analysis = analyzeBottleneck('540hz', '500hz');
    expect(analysis.bottleneckType).toBe('BALANCED');
    expect(analysis.bottleneckLabel).toBe('Balanced Hardware Pipeline');
    expect(analysis.recommendation).toContain('Hardware configuration is optimal');
  });

  it('computes baseline hardware delay and maximum phase jitter', () => {
    const analysis = analyzeBottleneck('240hz', '1000hz');
    // Frame period: 4.17ms -> avg delay 2.085ms
    // Poll period: 1.00ms -> avg delay 0.50ms
    // Baseline delay = 2.085 + 0.50 = 2.585 -> 2.59ms or 2.58ms
    expect(analysis.avgDisplayFrameDelayMs).toBeCloseTo(2.08, 1);
    expect(analysis.avgPollingDelayMs).toBe(0.5);
    expect(analysis.totalBaselineHardwareDelayMs).toBeCloseTo(2.58, 1);
    expect(analysis.maxLatencyJitterMs).toBeCloseTo(5.17, 1);
  });
});

describe('InputLagEngine — Reaction Time Histogram Binning', () => {
  it('returns empty result when latencies array is empty', () => {
    const result = calculateHistogramBins([]);
    expect(result.bins).toEqual([]);
    expect(result.totalValidSamples).toBe(0);
    expect(result.modalPeakBinIndex).toBe(-1);
    expect(result.binWidthMs).toBe(0);
  });

  it('handles single item or equal item latencies without division by zero', () => {
    const result = calculateHistogramBins([150]);
    expect(result.totalValidSamples).toBe(1);
    expect(result.bins.length).toBe(5);
    expect(result.modalPeakBinIndex).toBe(0);
    expect(result.bins[0].count).toBe(1);
  });

  it('bins latencies into requested bin count and identifies modal peak', () => {
    const latencies = [150, 155, 158, 175, 190, 192, 195, 198];
    const result = calculateHistogramBins(latencies, { binCount: 4, minMs: 150, maxMs: 200 });

    expect(result.totalValidSamples).toBe(8);
    expect(result.bins.length).toBe(4);
    expect(result.binWidthMs).toBe(12.5);

    // Bin 0: [150, 162.5) -> 150, 155, 158 (3)
    // Bin 1: [162.5, 175) -> none (0)
    // Bin 2: [175, 187.5) -> 175 (1)
    // Bin 3: [187.5, 200] -> 190, 192, 195, 198 (4)
    expect(result.bins[0].count).toBe(3);
    expect(result.bins[3].count).toBe(4);
    expect(result.bins[3].isPeak).toBe(true);
    expect(result.modalPeakBinIndex).toBe(3);
  });
});

describe('InputLagEngine — Input Lag Full Summary', () => {
  it('produces complete summary combining stats, bottleneck, and histogram', () => {
    const latencies = [140, 150, 160, 170, 180];
    const summary = calculateInputLagSummary(latencies, '240hz', '1000hz');

    expect(summary.stats.sampleCount).toBe(5);
    expect(summary.stats.meanMs).toBe(160);
    expect(summary.bottleneck.refreshRate).toBe('240hz');
    expect(summary.bottleneck.pollingRate).toBe('1000hz');
    expect(summary.histogram.totalValidSamples).toBe(5);
  });
});
