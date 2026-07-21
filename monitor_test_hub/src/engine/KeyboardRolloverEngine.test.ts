import { describe, it, expect } from 'vitest';
import { analyzeKeyboardRollover, evaluateKeyCombo } from './KeyboardRolloverEngine';

describe('KeyboardRolloverEngine Unit Tests', () => {
  it('should track active keys count and benchmark peak rollover', () => {
    const active = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ControlLeft', 'KeyE']);
    const report = analyzeKeyboardRollover(active, 0);
    expect(report.activeKeysCount).toBe(8);
    expect(report.peakSimultaneousKeys).toBe(8);
    expect(report.isNkroCompliant).toBe(true);
  });

  it('should evaluate gaming key combo completeness', () => {
    const active = new Set(['KeyW', 'KeyA', 'Space']);
    const target = ['KeyW', 'KeyA', 'Space'];
    const res = evaluateKeyCombo(active, target);
    expect(res.isComboComplete).toBe(true);
    expect(res.missingKeys.length).toBe(0);
  });
});
