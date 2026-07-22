import { describe, it, expect } from 'vitest';
import {
  calculateNominalHz,
  calculateRefreshRateMetrics,
  detectMobileLtpoStatus,
  calculateMotionSweepVectors,
  REFRESH_RATE_DISCLAIMER,
} from './RefreshRateEngine';

describe('RefreshRateEngine Unit Tests', () => {
  it('correctly maps measured Hz to standard nominal refresh rates', () => {
    expect(calculateNominalHz(59.94)).toBe(60);
    expect(calculateNominalHz(143.98)).toBe(144);
    expect(calculateNominalHz(239.95)).toBe(240);
    expect(calculateNominalHz(359.88)).toBe(360);
    expect(calculateNominalHz(539.91)).toBe(540);
    expect(calculateNominalHz(0)).toBe(60);
  });

  it('calculates refresh rate metrics for synthetic 144Hz timestamps', () => {
    const timestamps: number[] = [];
    const intervalMs = 1000 / 144; // ~6.944ms
    for (let i = 0; i < 60; i++) {
      timestamps.push(1000 + i * intervalMs);
    }

    const metrics = calculateRefreshRateMetrics(timestamps, 60);
    expect(metrics.nominalHz).toBe(144);
    expect(metrics.smoothedHz).toBeCloseTo(144, 0);
    expect(metrics.rating).toBe('COMPETITIVE_HIGH_HZ');
    expect(metrics.disclaimer).toBe(REFRESH_RATE_DISCLAIMER);
  });

  it('calculates esports flagship rating for 540Hz input', () => {
    const timestamps: number[] = [];
    const intervalMs = 1000 / 540; // ~1.85ms
    for (let i = 0; i < 100; i++) {
      timestamps.push(1000 + i * intervalMs);
    }

    const metrics = calculateRefreshRateMetrics(timestamps, 60);
    expect(metrics.nominalHz).toBe(540);
    expect(metrics.rating).toBe('ESPORTS_FLAGSHIP');
  });

  it('detects Apple ProMotion / Android LTPO dynamic refresh rate scaling', () => {
    const historyHz = [30, 30, 30, 60, 120, 120, 120, 30, 30, 30];
    const statusIdle = detectMobileLtpoStatus(historyHz, false);

    expect(statusIdle.isLtpoDetected).toBe(true);
    expect(statusIdle.minObservedHz).toBe(30);
    expect(statusIdle.maxObservedHz).toBe(120);

    const statusTouch = detectMobileLtpoStatus(historyHz, true);
    expect(statusTouch.currentLtpoState).toBe('TOUCH_BOOSTED');
  });

  it('calculates motion sweep reticle vectors for side-by-side motion test', () => {
    const vectors = calculateMotionSweepVectors(1.5, 800, 144, 960);
    expect(vectors).toHaveLength(4);
    expect(vectors[0].speedMultiplier).toBe(1.0);
    expect(vectors[1].speedMultiplier).toBe(0.5);
    expect(vectors[2].speedMultiplier).toBe(0.25);
    expect(vectors[3].speedMultiplier).toBe(0.125);
  });
});
