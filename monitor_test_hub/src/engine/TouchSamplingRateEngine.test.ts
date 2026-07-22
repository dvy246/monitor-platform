import { describe, it, expect } from 'vitest';
import {
  extractHardwarePoints,
  calculateTouchSamplingMetrics,
  generateSamplingHistogram,
  TOUCH_SAMPLING_DISCLAIMER,
  type HardwareTouchPoint,
} from './TouchSamplingRateEngine';

describe('TouchSamplingRateEngine', () => {
  it('extracts fallback single point when getCoalescedEvents is unavailable', () => {
    const mockEvent = {
      clientX: 100,
      clientY: 200,
      timeStamp: 1000.5,
      pointerId: 1,
    } as unknown as PointerEvent;

    const points = extractHardwarePoints(mockEvent);
    expect(points).toHaveLength(1);
    expect(points[0]).toEqual({
      x: 100,
      y: 200,
      timestamp: 1000.5,
      isCoalesced: false,
      pointerId: 1,
    });
  });

  it('unwraps coalesced events when getCoalescedEvents returns event array', () => {
    const mockCoalesced = [
      { clientX: 10, clientY: 10, timeStamp: 100.0, pointerId: 1 },
      { clientX: 20, clientY: 20, timeStamp: 104.16, pointerId: 1 },
      { clientX: 30, clientY: 30, timeStamp: 108.33, pointerId: 1 },
    ];
    const mockEvent = {
      clientX: 30,
      clientY: 30,
      timeStamp: 108.33,
      pointerId: 1,
      getCoalescedEvents: () => mockCoalesced,
    } as unknown as PointerEvent;

    const points = extractHardwarePoints(mockEvent);
    expect(points).toHaveLength(3);
    expect(points[0].isCoalesced).toBe(true);
    expect(points[2].isCoalesced).toBe(false);
  });

  it('calculates touch sampling metrics for synthetic 240Hz touch data', () => {
    const points: HardwareTouchPoint[] = [];
    const intervalMs = 1000 / 240; // 4.166ms
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 5,
        y: i * 5,
        timestamp: 1000 + i * intervalMs,
        isCoalesced: i % 4 !== 3,
        pointerId: 1,
      });
    }

    const metrics = calculateTouchSamplingMetrics(points, 60);
    expect(metrics.measuredHardwareHz).toBeCloseTo(240, -1);
    expect(metrics.supportsCoalescedEvents).toBe(true);
    expect(metrics.rating).toBe('HIGH');
  });

  it('calculates ultra-high grade metrics for >= 360Hz touch input', () => {
    const points: HardwareTouchPoint[] = [];
    const intervalMs = 1000 / 480; // ~2.08ms
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 5,
        y: i * 5,
        timestamp: 1000 + i * intervalMs,
        isCoalesced: true,
        pointerId: 1,
      });
    }

    const metrics = calculateTouchSamplingMetrics(points, 120);
    expect(metrics.measuredHardwareHz).toBeGreaterThanOrEqual(360);
    expect(metrics.rating).toBe('ULTRA_HIGH');
  });

  it('detects throttled touch sampling rates (< 50Hz)', () => {
    const points: HardwareTouchPoint[] = [];
    const intervalMs = 1000 / 30; // 33.3ms
    for (let i = 0; i < 20; i++) {
      points.push({
        x: i * 2,
        y: i * 2,
        timestamp: 1000 + i * intervalMs,
        isCoalesced: false,
        pointerId: 1,
      });
    }

    const metrics = calculateTouchSamplingMetrics(points, 60);
    expect(metrics.measuredHardwareHz).toBeLessThan(50);
    expect(metrics.rating).toBe('THROTTLED');
  });

  it('computes beat frequency stutter for non-integer touch-to-display refresh ratios', () => {
    const points: HardwareTouchPoint[] = [];
    const intervalMs = 1000 / 240; // 240Hz touch
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 5,
        y: i * 5,
        timestamp: 1000 + i * intervalMs,
        isCoalesced: false,
        pointerId: 1,
      });
    }

    // 240Hz touch on 144Hz screen: k = round(240/144) = 2. beat = |240 - 2*144| = |240 - 288| = 48Hz
    const metrics = calculateTouchSamplingMetrics(points, 144);
    expect(metrics.beatFrequencyHz).toBe(48);
  });

  it('generates sampling histogram buckets correctly', () => {
    const points: HardwareTouchPoint[] = [];
    // Add 10 points at 2ms interval (< 2.5ms)
    for (let i = 0; i < 10; i++) {
      points.push({ x: i, y: i, timestamp: 1000 + i * 2.0, isCoalesced: true, pointerId: 1 });
    }
    // Add 10 points at 4ms interval (2.5ms - 5.0ms)
    const baseT = 1000 + 9 * 2.0;
    for (let i = 1; i <= 10; i++) {
      points.push({ x: i, y: i, timestamp: baseT + i * 4.0, isCoalesced: false, pointerId: 1 });
    }

    const buckets = generateSamplingHistogram(points);
    expect(buckets).toHaveLength(5);
    expect(buckets[0].count).toBe(9); // 9 intervals of 2ms
    expect(buckets[1].count).toBe(10); // 10 intervals of 4ms
  });

  it('returns graceful default metrics for single point input', () => {
    const points: HardwareTouchPoint[] = [
      { x: 10, y: 10, timestamp: 1000, isCoalesced: false, pointerId: 1 },
    ];
    const metrics = calculateTouchSamplingMetrics(points, 60);
    expect(metrics.measuredHardwareHz).toBe(0);
    expect(metrics.sampleCount).toBe(1);
    expect(metrics.disclaimer).toBe(TOUCH_SAMPLING_DISCLAIMER);
  });
});

