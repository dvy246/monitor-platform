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
} from './TouchMatrixEngine';

describe('TouchMatrixEngine', () => {
  describe('Preset and Dimension Helper Functions', () => {
    it('returns all device types and grid densities', () => {
      expect(getAllDeviceTypes()).toEqual(['tablet', 'smartphone', 'kiosk', 'touch-laptop']);
      expect(getAllGridDensities()).toEqual(['low', 'medium', 'high', 'ultra-dense']);
    });

    it('returns correct device labels with case insensitivity and safe fallback', () => {
      expect(getDeviceLabel('smartphone')).toBe('Smartphone');
      expect(getDeviceLabel('TABLET')).toBe('Tablet');
      expect(getDeviceLabel('kiosk')).toBe('Commercial Kiosk');
      expect(getDeviceLabel('touch-laptop')).toBe('Touch Laptop');
      expect(getDeviceLabel('invalid-device')).toBe('Tablet');
      expect(getDeviceLabel(null as unknown as string)).toBe('Tablet');
    });

    it('returns correct grid density labels and dimensions', () => {
      expect(getDensityLabel('low')).toBe('Low (8x12)');
      expect(getDensityLabel('ULTRA-DENSE')).toBe('Ultra-Dense (24x36)');
      expect(getDensityLabel('unknown')).toBe('Medium (10x16)');

      expect(getGridDimensions('low')).toEqual({ cols: 8, rows: 12 });
      expect(getGridDimensions('medium')).toEqual({ cols: 10, rows: 16 });
      expect(getGridDimensions('high')).toEqual({ cols: 16, rows: 24 });
      expect(getGridDimensions('ultra-dense')).toEqual({ cols: 24, rows: 36 });
      expect(getGridDimensions('invalid')).toEqual({ cols: 10, rows: 16 });
    });
  });

  describe('calculateGestureVelocity', () => {
    it('calculates velocity accurately for straight motion across time', () => {
      const points: TouchPoint[] = [
        { x: 0, y: 0, timestamp: 1000 },
        { x: 100, y: 0, timestamp: 1100 } // 100px in 100ms = 1 px/ms = 1000 px/sec
      ];

      const res = calculateGestureVelocity(points);
      expect(res.velocityPxPerMs).toBe(1);
      expect(res.velocityPxPerSec).toBe(1000);
      expect(res.totalDistancePx).toBe(100);
      expect(res.durationMs).toBe(100);
    });

    it('handles diagonal multi-segment motion', () => {
      const points: TouchPoint[] = [
        { x: 0, y: 0, timestamp: 0 },
        { x: 30, y: 40, timestamp: 50 }, // dist = 50px
        { x: 60, y: 80, timestamp: 100 }  // dist = 50px
      ];

      const res = calculateGestureVelocity(points);
      expect(res.totalDistancePx).toBe(100);
      expect(res.durationMs).toBe(100);
      expect(res.velocityPxPerMs).toBe(1);
    });

    it('handles edge cases safely (empty, single point, zero duration, NaN)', () => {
      expect(calculateGestureVelocity([])).toEqual({
        velocityPxPerMs: 0,
        velocityPxPerSec: 0,
        totalDistancePx: 0,
        durationMs: 0
      });

      expect(calculateGestureVelocity([{ x: 10, y: 10, timestamp: 100 }])).toEqual({
        velocityPxPerMs: 0,
        velocityPxPerSec: 0,
        totalDistancePx: 0,
        durationMs: 0
      });

      // Zero duration
      const zeroDurPoints = [
        { x: 0, y: 0, timestamp: 100 },
        { x: 50, y: 50, timestamp: 100 }
      ];
      const zeroRes = calculateGestureVelocity(zeroDurPoints);
      expect(zeroRes.velocityPxPerMs).toBe(0);
      expect(zeroRes.totalDistancePx).toBeCloseTo(70.71, 1);

      // Filtering invalid NaN inputs
      const nanPoints = [
        { x: 0, y: 0, timestamp: 100 },
        { x: NaN, y: 50, timestamp: 150 },
        { x: 100, y: 0, timestamp: 200 }
      ];
      const nanRes = calculateGestureVelocity(nanPoints);
      expect(nanRes.totalDistancePx).toBe(100);
      expect(nanRes.durationMs).toBe(100);
    });
  });

  describe('calculateJitterVariance', () => {
    it('returns 0 variance for perfectly uniform intervals', () => {
      const timestamps = [100, 116, 132, 148, 164]; // Constant dt = 16ms
      const res = calculateJitterVariance(timestamps);

      expect(res.meanDtMs).toBe(16);
      expect(res.varianceMs).toBe(0);
      expect(res.stdDevMs).toBe(0);
      expect(res.sampleCount).toBe(4);
    });

    it('calculates variance accurately for variable intervals', () => {
      const timestamps = [100, 110, 130]; // dt1 = 10ms, dt2 = 20ms. Mean = 15. Variance = ((10-15)^2 + (20-15)^2)/2 = 25
      const res = calculateJitterVariance(timestamps);

      expect(res.meanDtMs).toBe(15);
      expect(res.varianceMs).toBe(25);
      expect(res.stdDevMs).toBe(5);
      expect(res.sampleCount).toBe(2);
    });

    it('safely handles empty or insufficient inputs', () => {
      expect(calculateJitterVariance([])).toEqual({
        meanDtMs: 0,
        varianceMs: 0,
        stdDevMs: 0,
        sampleCount: 0
      });
      expect(calculateJitterVariance([100])).toEqual({
        meanDtMs: 0,
        varianceMs: 0,
        stdDevMs: 0,
        sampleCount: 0
      });
    });
  });

  describe('calculateCellIndex', () => {
    it('computes correct matrix cell indices', () => {
      // 1000x500 canvas, 10 cols x 5 rows -> each cell is 100x100
      expect(calculateCellIndex(50, 50, 1000, 500, 10, 5)).toEqual({ col: 0, row: 0 });
      expect(calculateCellIndex(150, 250, 1000, 500, 10, 5)).toEqual({ col: 1, row: 2 });
      expect(calculateCellIndex(999, 499, 1000, 500, 10, 5)).toEqual({ col: 9, row: 4 });
    });

    it('returns null for out of bounds or invalid inputs', () => {
      expect(calculateCellIndex(-1, 50, 1000, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(1005, 50, 1000, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(100, 100, 0, 500, 10, 5)).toBeNull();
      expect(calculateCellIndex(NaN, 100, 1000, 500, 10, 5)).toBeNull();
    });
  });

  describe('evaluateMatrixCoverage & isolateDeadZones', () => {
    it('evaluates cell states and calculates coverage percentages', () => {
      const cols = 4;
      const rows = 4;
      const grid = Array(cols).fill(0).map(() => Array(rows).fill(0));

      // Mark 4 cells as touched (state 1) and 2 cells as dead (state 2)
      grid[0][0] = 1;
      grid[0][1] = 1;
      grid[1][0] = 1;
      grid[1][1] = 1;
      grid[3][3] = 2;
      grid[3][2] = 2;

      const evalRes = evaluateMatrixCoverage(grid, cols, rows);
      expect(evalRes.totalCells).toBe(16);
      expect(evalRes.touchedCells).toBe(4);
      expect(evalRes.deadCells).toBe(2);
      expect(evalRes.untestedCells).toBe(10);
      expect(evalRes.coveragePct).toBe(25);
      expect(evalRes.deadZonePct).toBe(12.5);
    });

    it('isolates untested cells into dead zones', () => {
      const cols = 2;
      const rows = 2;
      const grid = Array(cols).fill(0).map(() => Array(rows).fill(0));
      grid[0][0] = 1; // Touched

      const isolated = isolateDeadZones(grid, cols, rows);
      expect(isolated[0][0]).toBe(1); // Retained touched
      expect(isolated[0][1]).toBe(2); // Isolated dead zone
      expect(isolated[1][0]).toBe(2); // Isolated dead zone
      expect(isolated[1][1]).toBe(2); // Isolated dead zone
    });
  });

  describe('calculateTrajectoryDrift', () => {
    it('returns zero drift for a perfect straight line trajectory', () => {
      const points: TouchPoint[] = [
        { x: 0, y: 0, timestamp: 0 },
        { x: 50, y: 0, timestamp: 50 },
        { x: 100, y: 0, timestamp: 100 }
      ];

      const drift = calculateTrajectoryDrift(points);
      expect(drift.maxDriftPx).toBe(0);
      expect(drift.meanDriftPx).toBe(0);
      expect(drift.rmsDriftPx).toBe(0);
      expect(drift.driftErrorPct).toBe(0);
      expect(drift.sampleCount).toBe(3);
    });

    it('calculates Euclidean drift perpendicular error for off-axis points', () => {
      const points: TouchPoint[] = [
        { x: 0, y: 0, timestamp: 0 },
        { x: 50, y: 10, timestamp: 50 }, // 10px perpendicular drift off line y=0
        { x: 100, y: 0, timestamp: 100 }
      ];

      const drift = calculateTrajectoryDrift(points);
      expect(drift.maxDriftPx).toBe(10);
      expect(drift.sampleCount).toBe(3);
      expect(drift.rmsDriftPx).toBeGreaterThan(0);
      expect(drift.driftErrorPct).toBeGreaterThan(0);
    });

    it('safely handles empty or 1-point trajectory', () => {
      expect(calculateTrajectoryDrift([])).toEqual({
        maxDriftPx: 0,
        meanDriftPx: 0,
        rmsDriftPx: 0,
        driftErrorPct: 0,
        sampleCount: 0
      });
      expect(calculateTrajectoryDrift([{ x: 10, y: 10, timestamp: 0 }])).toEqual({
        maxDriftPx: 0,
        meanDriftPx: 0,
        rmsDriftPx: 0,
        driftErrorPct: 0,
        sampleCount: 1
      });
    });
  });
});
