import { describe, it, expect } from 'vitest';
import { analyzeFrameSkipping, calculateShutterGridState } from './FrameSkippingEngine';

describe('FrameSkippingEngine Unit Tests', () => {
  it('should verify true 144Hz refresh rate with uniform 6.94ms deltas', () => {
    const timestamps = Array.from({ length: 145 }, (_, i) => i * (1000 / 144));
    const report = analyzeFrameSkipping(timestamps, 144);
    expect(report.measuredRefreshHz).toBe(144);
    expect(report.skippedFrameCount).toBe(0);
    expect(report.hasSkippedFrames).toBe(false);
  });

  it('should detect skipped frames when frame delta exceeds 1.8x threshold', () => {
    const timestamps = [0, 6.94, 13.88, 30.0, 36.94]; // 30.0ms gap indicates skipped frame
    const report = analyzeFrameSkipping(timestamps, 144);
    expect(report.skippedFrameCount).toBe(1);
    expect(report.hasSkippedFrames).toBe(true);
  });

  it('should calculate correct shutter grid active block index', () => {
    expect(calculateShutterGridState(0, 8)).toBe(0);
    expect(calculateShutterGridState(7, 8)).toBe(7);
    expect(calculateShutterGridState(8, 8)).toBe(0);
  });
});
