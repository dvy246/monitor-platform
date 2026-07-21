/**
 * StuckPixelEngine.ts
 * Pure TypeScript calculation engine executing high-frequency sub-pixel RGB stimulation algorithms
 * to unstick stuck liquid crystal pixels.
 * Standard: ISO 9241-307 Class I Rapid Stimulation Algorithm.
 */

export interface IStuckPixelStimulatorConfig {
  x: number;
  y: number;
  boxSizePx: number;
  frequencyHz: number; // 15Hz to 60Hz
  durationMinutes: number;
}

export interface IStimulatorState {
  currentRgb: [number, number, number];
  elapsedSeconds: number;
  isCompleted: boolean;
}

const COLOR_CYCLE: [number, number, number][] = [
  [255, 0, 0],   // Red
  [0, 255, 0],   // Green
  [0, 0, 255],   // Blue
  [255, 255, 255], // White
  [0, 0, 0]      // Black
];

/**
 * Calculates current stimulation color frame state based on elapsed milliseconds and frequency.
 */
export function getStimulationFrame(
  elapsedMs: number,
  frequencyHz: number = 30
): [number, number, number] {
  const safeHz = Math.max(1, Math.min(60, frequencyHz));
  const frameIndex = Math.floor((elapsedMs / 1000) * safeHz);
  return COLOR_CYCLE[frameIndex % COLOR_CYCLE.length];
}

/**
 * Validates stimulator configuration parameters.
 */
export function validateStimulatorConfig(
  config: Partial<IStuckPixelStimulatorConfig>
): IStuckPixelStimulatorConfig {
  return {
    x: Math.max(0, config.x ?? 100),
    y: Math.max(0, config.y ?? 100),
    boxSizePx: Math.max(20, Math.min(200, config.boxSizePx ?? 80)),
    frequencyHz: Math.max(15, Math.min(60, config.frequencyHz ?? 30)),
    durationMinutes: Math.max(1, Math.min(120, config.durationMinutes ?? 10))
  };
}
