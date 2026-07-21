import { describe, it, expect } from 'vitest';
import {
  getAllDeviceTypes,
  getAllGridDensities,
  getDeviceLabel,
  getDensityLabel,
  getGridDimensions,
  calculateGestureVelocity,
  calculateJitterVariance,
  calculateCellIndex,
  evaluateMatrixCoverage,
  isolateDeadZones,
  calculateTrajectoryDrift,
  type TouchPoint
} from '../../monitor_test_hub/src/engine/TouchMatrixEngine';

describe('Empirical Challenger: TouchMatrixEngine Stress & Edge Cases', () => {
  describe('1. 0 Touches & Single Touch Edge Cases', () => {
    it('handles empty points array in calculateGestureVelocity', () => {
      const res = calculateGestureVelocity([]);
      expect(res).toEqual({
        velocityPxPerMs: 0,
        velocityPxPerSec: 0,
        totalDistancePx: 0,
        durationMs: 0
      });
    });

    it('handles single touch point in calculateGestureVelocity', () => {
      const res = calculateGestureVelocity([{ x: 10, y: 20, timestamp: 500 }]);
      expect(res).toEqual({
        velocityPxPerMs: 0,
        velocityPxPerSec: 0,
        totalDistancePx: 0,
        durationMs: 0
      });
    });

    it('handles empty array in calculateJitterVariance', () => {
      const res = calculateJitterVariance([]);
      expect(res).toEqual({
        meanDtMs: 0,
        varianceMs: 0,
        stdDevMs: 0,
        sampleCount: 0
      });
    });

    it('handles empty points array in calculateTrajectoryDrift', () => {
      const res = calculateTrajectoryDrift([]);
      expect(res).toEqual({
        maxDriftPx: 0,
        meanDriftPx: 0,
        rmsDriftPx: 0,
        driftErrorPct: 0,
        sampleCount: 0
      });
    });
  });

  describe('2. 100 Simultaneous Touches & Heavy Load', () => {
    it('processes 100 simultaneous touches (identical timestamps) in calculateGestureVelocity', () => {
      const points: TouchPoint[] = Array.from({ length: 100 }, (_, i) => ({
        x: i * 5,
        y: i * 2,
        timestamp: 1000 // all identical
      }));

      const res = calculateGestureVelocity(points);
      expect(res.durationMs).toBe(0);
      expect(res.velocityPxPerMs).toBe(0);
      expect(res.velocityPxPerSec).toBe(0);
      expect(res.totalDistancePx).toBeGreaterThan(0);
    });

    it('processes 100 simultaneous touches in calculateJitterVariance', () => {
      const timestamps = Array(100).fill(1000);
      const res = calculateJitterVariance(timestamps);
      expect(res.sampleCount).toBe(99);
      expect(res.meanDtMs).toBe(0);
      expect(res.varianceMs).toBe(0);
      expect(res.stdDevMs).toBe(0);
    });

    it('processes 100 points in calculateTrajectoryDrift under high density', () => {
      const points: TouchPoint[] = Array.from({ length: 100 }, (_, i) => ({
        x: i,
        y: i + (i % 2 === 0 ? 1 : -1), // jitter around y=x
        timestamp: 1000 + i * 10
      }));

      const res = calculateTrajectoryDrift(points);
      expect(res.sampleCount).toBe(100);
      expect(res.maxDriftPx).toBeGreaterThan(0);
      expect(Number.isFinite(res.rmsDriftPx)).toBe(true);
    });

    it('measures execution time for 100,000 points calculation', () => {
      const points: TouchPoint[] = Array.from({ length: 100000 }, (_, i) => ({
        x: Math.sin(i) * 100,
        y: Math.cos(i) * 100,
        timestamp: i
      }));

      const start = performance.now();
      const vel = calculateGestureVelocity(points);
      const drift = calculateTrajectoryDrift(points);
      const elapsed = performance.now() - start;

      expect(vel.sampleCount ?? vel.totalDistancePx).toBeGreaterThan(0);
      expect(drift.sampleCount).toBe(100000);
      expect(elapsed).toBeLessThan(1000); // Must complete within 1 second for 100k
    });
  });

  describe('3. Negative Coordinates Edge Cases', () => {
    it('handles negative coordinates in calculateGestureVelocity', () => {
      const points: TouchPoint[] = [
        { x: -100, y: -200, timestamp: 1000 },
        { x: -50, y: -200, timestamp: 1100 } // 50px right in 100ms
      ];
      const res = calculateGestureVelocity(points);
      expect(res.totalDistancePx).toBe(50);
      expect(res.durationMs).toBe(100);
      expect(res.velocityPxPerMs).toBe(0.5);
    });

    it('handles negative coordinates in calculateCellIndex', () => {
      expect(calculateCellIndex(-5, 50, 1000, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(50, -10, 1000, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(-50, -50, 1000, 500, 10, 5)).toBeNull();
    });

    it('handles negative coordinates in calculateTrajectoryDrift', () => {
      const points: TouchPoint[] = [
        { x: -100, y: -100, timestamp: 0 },
        { x: -50, y: -100, timestamp: 50 },
        { x: 0, y: -100, timestamp: 100 }
      ];
      const drift = calculateTrajectoryDrift(points);
      expect(drift.maxDriftPx).toBe(0);
      expect(drift.meanDriftPx).toBe(0);
      expect(drift.sampleCount).toBe(3);
    });
  });

  describe('4. NaN, Infinity, -Infinity, Invalid Type Inputs', () => {
    it('filters NaN / Infinity / -Infinity in calculateGestureVelocity', () => {
      const points: any[] = [
        { x: 0, y: 0, timestamp: 100 },
        { x: NaN, y: 50, timestamp: 150 },
        { x: Infinity, y: 50, timestamp: 150 },
        { x: 50, y: -Infinity, timestamp: 150 },
        { x: 50, y: 50, timestamp: undefined },
        null,
        undefined,
        "not a point",
        { x: 100, y: 0, timestamp: 200 }
      ];
      const res = calculateGestureVelocity(points);
      expect(res.totalDistancePx).toBe(100);
      expect(res.durationMs).toBe(100);
      expect(res.velocityPxPerMs).toBe(1);
    });

    it('filters NaN / Infinity in calculateJitterVariance', () => {
      const timestamps = [100, NaN, Infinity, -Infinity, 116, undefined as any, 132];
      const res = calculateJitterVariance(timestamps);
      expect(res.sampleCount).toBe(2); // 100->116 (16ms), 116->132 (16ms)
      expect(res.meanDtMs).toBe(16);
      expect(res.varianceMs).toBe(0);
    });

    it('rejects NaN / Infinity / 0 in calculateCellIndex', () => {
      expect(calculateCellIndex(NaN, 50, 1000, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(50, Infinity, 1000, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(50, 50, NaN, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(50, 50, 1000, Infinity, 10, 5)).toBeNull();
      expect(calculateCellIndex(50, 50, 1000, 500, 0, 5)).toBeNull();
      expect(calculateCellIndex(50, 50, 1000, 500, 10, -5)).toBeNull();
    });

    it('handles exact right/bottom boundary in calculateCellIndex', () => {
      // If canvas is 1000x500, x=1000, y=500
      expect(calculateCellIndex(1000, 250, 1000, 500, 10, 5)).toBeNull(); // col = 10 >= cols 10
      expect(calculateCellIndex(500, 500, 1000, 500, 10, 5)).toBeNull(); // row = 5 >= rows 5
    });

    it('handles invalid inputs to evaluateMatrixCoverage and isolateDeadZones', () => {
      const resNull = evaluateMatrixCoverage(null as any, NaN, -5);
      expect(resNull.totalCells).toBe(160); // safeCols 10 * safeRows 16
      expect(resNull.untestedCells).toBe(160);

      const isolatedNull = isolateDeadZones(null as any, -1, 0);
      expect(isolatedNull.length).toBe(10);
      expect(isolatedNull[0].length).toBe(16);
      expect(isolatedNull[0][0]).toBe(2);
    });

    it('filters NaN / Infinity in calculateTrajectoryDrift', () => {
      const points: any[] = [
        { x: 0, y: 0, timestamp: 0 },
        { x: NaN, y: 10, timestamp: 50 },
        { x: Infinity, y: Infinity, timestamp: 50 },
        { x: 100, y: 0, timestamp: 100 }
      ];
      const res = calculateTrajectoryDrift(points);
      expect(res.sampleCount).toBe(2);
      expect(res.maxDriftPx).toBe(0);
    });
  });
});
