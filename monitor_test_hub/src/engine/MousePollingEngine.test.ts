import { describe, it, expect } from 'vitest';
import { analyzeMousePolling } from './MousePollingEngine';

describe('MousePollingEngine Unit Tests', () => {
  it('should measure stable 1000Hz polling rate with 1.0ms deltas', () => {
    const timestamps = Array.from({ length: 101 }, (_, i) => i * 1.0);
    const report = analyzeMousePolling(timestamps);
    expect(report.measuredHz).toBe(1000);
    expect(report.averageIntervalMs).toBe(1.0);
    expect(report.jitterStdDevMs).toBe(0);
    expect(report.isStable).toBe(true);
  });

  it('should detect 500Hz polling rate with 2.0ms deltas', () => {
    const timestamps = Array.from({ length: 51 }, (_, i) => i * 2.0);
    const report = analyzeMousePolling(timestamps);
    expect(report.measuredHz).toBe(500);
  });

  it('should calculate jitter standard deviation on unstable polling inputs', () => {
    const timestamps = [0, 1.0, 3.5, 4.0, 7.0];
    const report = analyzeMousePolling(timestamps);
    expect(report.jitterStdDevMs).toBeGreaterThan(0);
  });
});
