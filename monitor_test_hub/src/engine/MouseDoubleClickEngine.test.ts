import { describe, it, expect } from 'vitest';
import { analyzeClickEvents } from './MouseDoubleClickEngine';

describe('MouseDoubleClickEngine Unit Tests', () => {
  it('should pass normal human clicks registered over 100ms apart', () => {
    const clicks = [0, 150, 320, 500];
    const report = analyzeClickEvents(clicks);
    expect(report.defectCount).toBe(0);
    expect(report.hasFaultySwitch).toBe(false);
    expect(report.fastestClickMs).toBe(150);
  });

  it('should detect hardware switch chatter defect when click registered under 30ms', () => {
    const clicks = [0, 12.5, 300]; // 12.5ms interval is a switch chatter defect
    const report = analyzeClickEvents(clicks);
    expect(report.defectCount).toBe(1);
    expect(report.hasFaultySwitch).toBe(true);
    expect(report.fastestClickMs).toBe(12.5);
  });
});
