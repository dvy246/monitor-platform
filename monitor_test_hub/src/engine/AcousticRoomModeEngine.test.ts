import { describe, it, expect } from 'vitest';
import { AcousticRoomModeEngine } from './AcousticRoomModeEngine';

describe('AcousticRoomModeEngine Unit Test Suite', () => {
  it('correctly calculates axial room modes for 12ft x 15ft x 8ft room', () => {
    const metrics = AcousticRoomModeEngine.calculateMetrics(15, 12, 8);
    expect(metrics.modes.length).toBeGreaterThan(10);
    
    // First length axial mode (1,0,0) for 15ft = 4.572m -> f = 343 / (2 * 4.572) ≈ 37.5 Hz
    const firstLengthMode = metrics.modes.find(m => m.nx === 1 && m.ny === 0 && m.nz === 0);
    expect(firstLengthMode).toBeDefined();
    expect(firstLengthMode?.frequencyHz).toBeCloseTo(37.5, 0);
  });

  it('correctly identifies Bolt Area aspect ratio compliance', () => {
    // 8ft H, 12ft W (ratio 1.5), 16ft L (ratio 2.0) -> Valid Bolt Area
    const validRoom = AcousticRoomModeEngine.calculateMetrics(16, 12, 8);
    expect(validRoom.boltRatioCompliant).toBe(true);

    // Square 10ft x 10ft x 10ft room -> Fails Bolt Area
    const squareRoom = AcousticRoomModeEngine.calculateMetrics(10, 10, 10);
    expect(squareRoom.boltRatioCompliant).toBe(false);
  });
});
