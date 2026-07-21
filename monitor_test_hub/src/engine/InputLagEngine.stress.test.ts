import { describe, it, expect } from 'vitest';
import {
  getAllRefreshRates,
  getAllPollingRates,
  sanitizeRefreshRate,
  sanitizePollingRate,
  getRefreshRateHz,
  getPollingRateHz,
  getFrameIntervalMs,
  getPollingIntervalMs,
  calculateLatency,
  sanitizeLatencies,
  calculateReactionStats,
  analyzeBottleneck,
  calculateHistogramBins,
  calculateInputLagSummary
} from './InputLagEngine';

describe('InputLagEngine Stress & Boundary Tests — Milestone 4 Challenger', () => {
  describe('1. Boundary Values & Empty / Single Sample Cases', () => {
    it('handles empty sample arrays gracefully without throwing', () => {
      const stats = calculateReactionStats([]);
      expect(stats.sampleCount).toBe(0);
      expect(stats.meanMs).toBe(0);
      expect(stats.medianMs).toBe(0);
      expect(stats.minMs).toBe(0);
      expect(stats.maxMs).toBe(0);
      expect(stats.stdDevMs).toBe(0);
      expect(stats.jitterMs).toBe(0);
      expect(stats.rating).toBe('DELAYED');
      expect(stats.ratingLabel).toBe('No Valid Reaction Data');

      const hist = calculateHistogramBins([]);
      expect(hist.bins).toEqual([]);
      expect(hist.totalValidSamples).toBe(0);
      expect(hist.modalPeakBinIndex).toBe(-1);
      expect(hist.binWidthMs).toBe(0);

      const summary = calculateInputLagSummary([], '540hz', '8000hz');
      expect(summary.stats.sampleCount).toBe(0);
      expect(summary.bottleneck.refreshRate).toBe('540hz');
      expect(summary.bottleneck.pollingRate).toBe('8000hz');
    });

    it('handles exactly 1 integer sample correctly', () => {
      const stats = calculateReactionStats([175]);
      expect(stats.sampleCount).toBe(1);
      expect(stats.meanMs).toBe(175);
      expect(stats.medianMs).toBe(175);
      expect(stats.minMs).toBe(175);
      expect(stats.maxMs).toBe(175);
      expect(stats.stdDevMs).toBe(0);
      expect(stats.jitterMs).toBe(0);
      expect(stats.rating).toBe('FAST_REFLEX');

      // Integer sample: minVal = 175, maxVal = 175 -> equal, so maxVal = 185, binWidth = 2
      const hist = calculateHistogramBins([175]);
      expect(hist.totalValidSamples).toBe(1);
      expect(hist.bins.length).toBe(5);
      expect(hist.modalPeakBinIndex).toBe(0);
      expect(hist.bins[0].count).toBe(1);
      expect(hist.bins[0].isPeak).toBe(true);
    });

    it('handles single float sample correctly', () => {
      const hist = calculateHistogramBins([175.5]);
      expect(hist.totalValidSamples).toBe(1);
      expect(hist.bins.length).toBe(5);
      // minVal = 175, maxVal = 176, binWidth = 0.2, 175.5 is in bin 2 [175.4, 175.6)
      expect(hist.modalPeakBinIndex).toBe(2);
      expect(hist.bins[2].count).toBe(1);
      expect(hist.bins[2].isPeak).toBe(true);
    });

    it('filters out non-finite, negative, anticipation (<50ms), and timeout (>2000ms) values', () => {
      const badInputs = [-100, 0, 49.99, NaN, Infinity, -Infinity, 2000.01, 5000];
      const sanitized = sanitizeLatencies(badInputs);
      expect(sanitized).toEqual([]);

      const mixed = [10, 50, 150, 2000, 2001, NaN];
      expect(sanitizeLatencies(mixed)).toEqual([50, 150, 2000]);
    });
  });

  describe('2. Reaction Ratings Tiers & Exact Boundary Conditions', () => {
    it('verifies exact boundary cutoffs for reaction ratings', () => {
      // Tier 1: ESPORTS_ELITE (< 160ms)
      expect(calculateReactionStats([159.99]).rating).toBe('ESPORTS_ELITE');
      expect(calculateReactionStats([160.00]).rating).toBe('FAST_REFLEX');

      // Tier 2: FAST_REFLEX (160ms - 200ms)
      expect(calculateReactionStats([199.99]).rating).toBe('FAST_REFLEX');
      expect(calculateReactionStats([200.00]).rating).toBe('AVERAGE');

      // Tier 3: AVERAGE (200ms - 250ms)
      expect(calculateReactionStats([249.99]).rating).toBe('AVERAGE');
      expect(calculateReactionStats([250.00]).rating).toBe('SLOW');

      // Tier 4: SLOW (250ms - 350ms)
      expect(calculateReactionStats([349.99]).rating).toBe('SLOW');
      expect(calculateReactionStats([350.00]).rating).toBe('DELAYED');

      // Tier 5: DELAYED (>= 350ms)
      expect(calculateReactionStats([350.01]).rating).toBe('DELAYED');
      expect(calculateReactionStats([500.00]).rating).toBe('DELAYED');
    });
  });

  describe('3. High-Refresh (540Hz) & Ultra-Polling (8000Hz) Bottleneck Calculations', () => {
    it('analyzes 540Hz display and 8000Hz polling rate combination', () => {
      const result = analyzeBottleneck('540hz', '8000hz');
      expect(result.refreshRate).toBe('540hz');
      expect(result.pollingRate).toBe('8000hz');
      expect(result.refreshRateHz).toBe(540);
      expect(result.pollingRateHz).toBe(8000);
      expect(result.frameIntervalMs).toBe(1.85);
      expect(result.pollingIntervalMs).toBe(0.125);
      expect(result.avgDisplayFrameDelayMs).toBe(0.93);
      expect(result.avgPollingDelayMs).toBe(0.063);
      expect(result.totalBaselineHardwareDelayMs).toBe(0.993);
      expect(result.maxLatencyJitterMs).toBe(1.975);
      // 1.85 / 0.125 = 14.8 > 1.5 -> DISPLAY_LIMITED
      expect(result.bottleneckType).toBe('DISPLAY_LIMITED');
    });

    it('analyzes 540Hz display and 125Hz polling rate (POLLING_LIMITED)', () => {
      const result = analyzeBottleneck('540hz', '125hz');
      expect(result.frameIntervalMs).toBe(1.85);
      expect(result.pollingIntervalMs).toBe(8.0);
      // 1.85 / 8.0 = 0.23125 < 0.67 -> POLLING_LIMITED
      expect(result.bottleneckType).toBe('POLLING_LIMITED');
    });

    it('analyzes 540Hz display and 500Hz polling rate (BALANCED)', () => {
      const result = analyzeBottleneck('540hz', '500hz');
      expect(result.frameIntervalMs).toBe(1.85);
      expect(result.pollingIntervalMs).toBe(2.0);
      // 1.85 / 2.0 = 0.925 -> BALANCED
      expect(result.bottleneckType).toBe('BALANCED');
    });

    it('tests all matrix permutations of refresh rates (6) x polling rates (6)', () => {
      const refreshRates = getAllRefreshRates();
      const pollingRates = getAllPollingRates();

      expect(refreshRates.length).toBe(6);
      expect(pollingRates.length).toBe(6);

      let count = 0;
      for (const r of refreshRates) {
        for (const p of pollingRates) {
          const analysis = analyzeBottleneck(r, p);
          expect(analysis.refreshRateHz).toBeGreaterThan(0);
          expect(analysis.pollingRateHz).toBeGreaterThan(0);
          expect(analysis.frameIntervalMs).toBeGreaterThan(0);
          expect(analysis.pollingIntervalMs).toBeGreaterThan(0);
          expect(['DISPLAY_LIMITED', 'POLLING_LIMITED', 'BALANCED']).toContain(analysis.bottleneckType);
          count++;
        }
      }
      expect(count).toBe(36);
    });
  });

  describe('4. Dynamic Histogram Binning Edge Cases & Floating-Point Truncation', () => {
    it('tests histogram binning with custom range options', () => {
      const latencies = [100, 110, 120, 130, 140, 150];
      const result = calculateHistogramBins(latencies, { binCount: 5, minMs: 100, maxMs: 150 });
      expect(result.bins.length).toBe(5);
      expect(result.totalValidSamples).toBe(6);
    });

    it('EMPIRICAL BUG CONFIRMATION: Maximum sample dropped due to binWidth rounding truncation', () => {
      // Sample range 100 to 200, 3 bins:
      // Exact width: (200 - 100) / 3 = 33.33333...
      // Rounded width: 33.33
      // Bin 2 range: [166.66, 100 + 3 * 33.33] = [166.66, 199.99]
      // Value 200.0 is > 199.99 and is completely omitted from the histogram!
      const latencies = [100, 150, 200];
      const result = calculateHistogramBins(latencies, { binCount: 3 });

      const totalBinCount = result.bins.reduce((sum, b) => sum + b.count, 0);

      // Empirically verify that total valid samples is 3, but total bin count is only 2
      expect(result.totalValidSamples).toBe(3);
      expect(totalBinCount).toBe(2); // 1 sample (200ms) was lost!
    });
  });

  describe('5. Extreme Scale Stress Testing (100,000 Samples)', () => {
    it('measures execution time and stability for 100,000 reaction samples in calculateReactionStats', () => {
      const largeArray = new Array(100_000).fill(0).map((_, i) => 150 + (i % 100));

      const startTime = performance.now();
      const stats = calculateReactionStats(largeArray);
      const endTime = performance.now();
      const durationMs = endTime - startTime;

      expect(stats.sampleCount).toBe(100_000);
      expect(stats.minMs).toBe(150);
      expect(stats.maxMs).toBe(249);
      expect(durationMs).toBeLessThan(1000);
    });

    it('tests calculateHistogramBins with 100,000 samples for performance and memory', () => {
      const largeArray = new Array(100_000).fill(0).map((_, i) => 150 + (i % 100));

      const startTime = performance.now();
      const result = calculateHistogramBins(largeArray);
      const endTime = performance.now();
      const durationMs = endTime - startTime;

      expect(result.totalValidSamples).toBe(100_000);
      expect(durationMs).toBeLessThan(1000);
    });

    it('tests calculateInputLagSummary end-to-end with 100,000 samples', () => {
      const largeArray = new Array(100_000).fill(0).map((_, i) => 150 + (i % 100));

      const startTime = performance.now();
      const summary = calculateInputLagSummary(largeArray, '540hz', '8000hz');
      const endTime = performance.now();
      const durationMs = endTime - startTime;

      expect(summary.stats.sampleCount).toBe(100_000);
      expect(summary.bottleneck.refreshRate).toBe('540hz');
      expect(summary.bottleneck.pollingRate).toBe('8000hz');
      expect(durationMs).toBeLessThan(1000);
    });
  });
});
