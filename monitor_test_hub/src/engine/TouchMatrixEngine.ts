/**
 * Touch Matrix Diagnostic Engine
 * Pure math calculations for digitizer dead-zone grid isolation, multi-touch pointer tracking,
 * gesture velocity (px/ms), timestamp jitter variance (ms), and vector trajectory drift error.
 */

export type DeviceType = 'tablet' | 'smartphone' | 'kiosk' | 'touch-laptop';
export type GridDensity = 'low' | 'medium' | 'high' | 'ultra-dense';

export interface GridDimensions {
  cols: number;
  rows: number;
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
  id?: number;
}

export interface VelocityResult {
  velocityPxPerMs: number;
  velocityPxPerSec: number;
  totalDistancePx: number;
  durationMs: number;
}

export interface JitterResult {
  meanDtMs: number;
  varianceMs: number;
  stdDevMs: number;
  sampleCount: number;
}

export interface DeadZoneResult {
  totalCells: number;
  touchedCells: number;
  deadCells: number;
  untestedCells: number;
  coveragePct: number;
  deadZonePct: number;
}

export interface TrajectoryDriftResult {
  maxDriftPx: number;
  meanDriftPx: number;
  rmsDriftPx: number;
  driftErrorPct: number;
  sampleCount: number;
}

const DEVICE_CONFIG: Record<string, { label: string; defaultDensity: GridDensity }> = {
  smartphone: { label: 'Smartphone', defaultDensity: 'medium' },
  tablet: { label: 'Tablet', defaultDensity: 'medium' },
  kiosk: { label: 'Commercial Kiosk', defaultDensity: 'high' },
  'touch-laptop': { label: 'Touch Laptop', defaultDensity: 'medium' }
};

const DENSITY_CONFIG: Record<string, { label: string; dimensions: GridDimensions }> = {
  low: { label: 'Low (8x12)', dimensions: { cols: 8, rows: 12 } },
  medium: { label: 'Medium (10x16)', dimensions: { cols: 10, rows: 16 } },
  high: { label: 'High (16x24)', dimensions: { cols: 16, rows: 24 } },
  'ultra-dense': { label: 'Ultra-Dense (24x36)', dimensions: { cols: 24, rows: 36 } }
};

export function getAllDeviceTypes(): DeviceType[] {
  return ['tablet', 'smartphone', 'kiosk', 'touch-laptop'];
}

export function getAllGridDensities(): GridDensity[] {
  return ['low', 'medium', 'high', 'ultra-dense'];
}

export function getDeviceLabel(deviceType: string): string {
  const key = typeof deviceType === 'string' ? deviceType.toLowerCase().trim() : '';
  return DEVICE_CONFIG[key]?.label || 'Tablet';
}

export function getDensityLabel(density: string): string {
  const key = typeof density === 'string' ? density.toLowerCase().trim() : '';
  return DENSITY_CONFIG[key]?.label || 'Medium (10x16)';
}

export function getGridDimensions(density: string): GridDimensions {
  const key = typeof density === 'string' ? density.toLowerCase().trim() : '';
  return DENSITY_CONFIG[key]?.dimensions || { cols: 10, rows: 16 };
}

/**
 * Calculates gesture velocity from an ordered sequence of timestamped touch points.
 * Velocity = total distance (px) / total duration (ms).
 */
export function calculateGestureVelocity(points: TouchPoint[]): VelocityResult {
  const emptyResult: VelocityResult = {
    velocityPxPerMs: 0,
    velocityPxPerSec: 0,
    totalDistancePx: 0,
    durationMs: 0
  };

  if (!Array.isArray(points)) return emptyResult;

  const validPoints = points.filter(
    (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.timestamp)
  );

  if (validPoints.length < 2) return emptyResult;

  let totalDistancePx = 0;
  for (let i = 1; i < validPoints.length; i++) {
    const dx = validPoints[i].x - validPoints[i - 1].x;
    const dy = validPoints[i].y - validPoints[i - 1].y;
    totalDistancePx += Math.hypot(dx, dy);
  }

  const durationMs = Math.max(0, validPoints[validPoints.length - 1].timestamp - validPoints[0].timestamp);

  if (durationMs <= 0) {
    return {
      velocityPxPerMs: 0,
      velocityPxPerSec: 0,
      totalDistancePx: Number(totalDistancePx.toFixed(2)),
      durationMs: 0
    };
  }

  const velocityPxPerMs = totalDistancePx / durationMs;
  const velocityPxPerSec = velocityPxPerMs * 1000;

  return {
    velocityPxPerMs: Number(velocityPxPerMs.toFixed(3)),
    velocityPxPerSec: Number(velocityPxPerSec.toFixed(1)),
    totalDistancePx: Number(totalDistancePx.toFixed(2)),
    durationMs: Number(durationMs.toFixed(1))
  };
}

/**
 * Computes inter-frame timestamp jitter variance and standard deviation in milliseconds.
 */
export function calculateJitterVariance(timestamps: number[]): JitterResult {
  const emptyResult: JitterResult = {
    meanDtMs: 0,
    varianceMs: 0,
    stdDevMs: 0,
    sampleCount: 0
  };

  if (!Array.isArray(timestamps)) return emptyResult;

  const validTs = timestamps.filter((t) => Number.isFinite(t));
  if (validTs.length < 2) return emptyResult;

  const deltas: number[] = [];
  for (let i = 1; i < validTs.length; i++) {
    const dt = validTs[i] - validTs[i - 1];
    if (dt >= 0) {
      deltas.push(dt);
    }
  }

  if (deltas.length === 0) return emptyResult;

  const sumDt = deltas.reduce((acc, val) => acc + val, 0);
  const meanDtMs = sumDt / deltas.length;

  const varianceMs = deltas.reduce((acc, val) => acc + Math.pow(val - meanDtMs, 2), 0) / deltas.length;
  const stdDevMs = Math.sqrt(varianceMs);

  return {
    meanDtMs: Number(meanDtMs.toFixed(2)),
    varianceMs: Number(varianceMs.toFixed(2)),
    stdDevMs: Number(stdDevMs.toFixed(2)),
    sampleCount: deltas.length
  };
}

/**
 * Calculates matrix grid cell index for a coordinate on canvas.
 */
export function calculateCellIndex(
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
  cols: number,
  rows: number
): { col: number; row: number } | null {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(canvasWidth) ||
    !Number.isFinite(canvasHeight) ||
    !Number.isFinite(cols) ||
    !Number.isFinite(rows) ||
    canvasWidth <= 0 ||
    canvasHeight <= 0 ||
    cols <= 0 ||
    rows <= 0
  ) {
    return null;
  }

  const col = Math.floor((x / canvasWidth) * cols);
  const row = Math.floor((y / canvasHeight) * rows);

  if (col < 0 || col >= cols || row < 0 || row >= rows) {
    return null;
  }

  return { col, row };
}

/**
 * Evaluates touch matrix coverage and dead-zone cell percentages.
 * Cell state encoding: 0 = untested, 1 = touched/verified, 2 = isolated dead zone.
 */
export function evaluateMatrixCoverage(grid: number[][], cols: number, rows: number): DeadZoneResult {
  const safeCols = Number.isFinite(cols) && cols > 0 ? Math.floor(cols) : 10;
  const safeRows = Number.isFinite(rows) && rows > 0 ? Math.floor(rows) : 16;
  const totalCells = safeCols * safeRows;

  let touchedCells = 0;
  let deadCells = 0;
  let untestedCells = 0;

  if (Array.isArray(grid)) {
    for (let c = 0; c < safeCols; c++) {
      for (let r = 0; r < safeRows; r++) {
        const state = grid[c] ? grid[c][r] : 0;
        if (state === 1) {
          touchedCells++;
        } else if (state === 2) {
          deadCells++;
        } else {
          untestedCells++;
        }
      }
    }
  } else {
    untestedCells = totalCells;
  }

  const coveragePct = (touchedCells / totalCells) * 100;
  const deadZonePct = (deadCells / totalCells) * 100;

  return {
    totalCells,
    touchedCells,
    deadCells,
    untestedCells,
    coveragePct: Number(coveragePct.toFixed(1)),
    deadZonePct: Number(deadZonePct.toFixed(1))
  };
}

/**
 * Isolates untested cells (state 0) by converting them to dead zones (state 2).
 */
export function isolateDeadZones(grid: number[][], cols: number, rows: number): number[][] {
  const safeCols = Number.isFinite(cols) && cols > 0 ? Math.floor(cols) : 10;
  const safeRows = Number.isFinite(rows) && rows > 0 ? Math.floor(rows) : 16;

  const newGrid: number[][] = Array(safeCols)
    .fill(0)
    .map(() => Array(safeRows).fill(0));

  for (let c = 0; c < safeCols; c++) {
    for (let r = 0; r < safeRows; r++) {
      const currentState = grid && grid[c] ? grid[c][r] : 0;
      if (currentState === 1) {
        newGrid[c][r] = 1;
      } else {
        newGrid[c][r] = 2; // Isolated dead zone
      }
    }
  }

  return newGrid;
}

/**
 * Calculates vector trajectory drift error: Euclidean perpendicular distance error
 * between recorded touch path and ideal straight vector trajectory between endpoints.
 */
export function calculateTrajectoryDrift(
  points: TouchPoint[],
  idealStart?: TouchPoint,
  idealEnd?: TouchPoint
): TrajectoryDriftResult {
  const emptyResult: TrajectoryDriftResult = {
    maxDriftPx: 0,
    meanDriftPx: 0,
    rmsDriftPx: 0,
    driftErrorPct: 0,
    sampleCount: 0
  };

  if (!Array.isArray(points)) return emptyResult;

  const validPoints = points.filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y));
  if (validPoints.length < 2) {
    return { ...emptyResult, sampleCount: validPoints.length };
  }

  const pStart = idealStart && Number.isFinite(idealStart.x) && Number.isFinite(idealStart.y)
    ? idealStart
    : validPoints[0];
  const pEnd = idealEnd && Number.isFinite(idealEnd.x) && Number.isFinite(idealEnd.y)
    ? idealEnd
    : validPoints[validPoints.length - 1];

  const dx = pEnd.x - pStart.x;
  const dy = pEnd.y - pStart.y;
  const idealLength = Math.hypot(dx, dy);

  // Line equation parameters A x + B y + C = 0
  const A = pEnd.y - pStart.y;
  const B = -(pEnd.x - pStart.x);
  const C = pEnd.x * pStart.y - pEnd.y * pStart.x;
  const denominator = Math.hypot(A, B);

  const distances: number[] = [];

  for (const pt of validPoints) {
    let dist = 0;
    if (denominator === 0) {
      dist = Math.hypot(pt.x - pStart.x, pt.y - pStart.y);
    } else {
      dist = Math.abs(A * pt.x + B * pt.y + C) / denominator;
    }
    distances.push(dist);
  }

  const maxDriftPx = Math.max(...distances);
  const sumDriftPx = distances.reduce((acc, val) => acc + val, 0);
  const meanDriftPx = sumDriftPx / distances.length;

  const sumSquareDrift = distances.reduce((acc, val) => acc + val * val, 0);
  const rmsDriftPx = Math.sqrt(sumSquareDrift / distances.length);

  const driftErrorPct = idealLength > 0 ? (rmsDriftPx / idealLength) * 100 : 0;

  return {
    maxDriftPx: Number(maxDriftPx.toFixed(2)),
    meanDriftPx: Number(meanDriftPx.toFixed(2)),
    rmsDriftPx: Number(rmsDriftPx.toFixed(2)),
    driftErrorPct: Number(driftErrorPct.toFixed(2)),
    sampleCount: distances.length
  };
}
