import { describe, it, expect } from 'vitest';
import { ScreenTestEngine } from './ScreenTestEngine';

describe('ScreenTestEngine', () => {
  it('contains expected pattern definitions', () => {
    expect(ScreenTestEngine.PATTERNS.length).toBeGreaterThanOrEqual(14);
    const whitePattern = ScreenTestEngine.PATTERNS.find(p => p.id === 'white');
    expect(whitePattern).toBeDefined();
    expect(whitePattern?.hex).toBe('#ffffff');
  });

  it('converts Kelvin temperature to hex color correctly', () => {
    const hex2700 = ScreenTestEngine.kelvinToHex(2700);
    const hex6500 = ScreenTestEngine.kelvinToHex(6500);
    expect(hex2700).toMatch(/^#[0-9a-f]{6}$/i);
    expect(hex6500).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('cycles pattern index in wrapping bounds', () => {
    const total = ScreenTestEngine.PATTERNS.length;
    expect(ScreenTestEngine.getNextPatternIndex(0, 1)).toBe(1);
    expect(ScreenTestEngine.getNextPatternIndex(total - 1, 1)).toBe(0);
    expect(ScreenTestEngine.getNextPatternIndex(0, -1)).toBe(total - 1);
  });

  it('classifies touch swipe gestures correctly', () => {
    expect(ScreenTestEngine.classifySwipeGesture(100, 100, 105, 105)).toBe('TAP');
    expect(ScreenTestEngine.classifySwipeGesture(100, 100, 200, 100)).toBe('SWIPE_RIGHT');
    expect(ScreenTestEngine.classifySwipeGesture(200, 100, 100, 100)).toBe('SWIPE_LEFT');
    expect(ScreenTestEngine.classifySwipeGesture(100, 100, 100, 200)).toBe('SWIPE_DOWN');
    expect(ScreenTestEngine.classifySwipeGesture(100, 200, 100, 100)).toBe('SWIPE_UP');
  });

  it('processes gamepad inputs to expected actions', () => {
    const defaultButtons = new Array(16).fill(false);
    const defaultAxes = [0, 0, 0, 0];

    // D-Pad Right
    const buttonsRight = [...defaultButtons];
    buttonsRight[15] = true;
    expect(ScreenTestEngine.processGamepadInput({ buttons: buttonsRight, axes: defaultAxes }).action).toBe('NEXT_PATTERN');

    // Button 0 (A/Cross)
    const buttonsA = [...defaultButtons];
    buttonsA[0] = true;
    expect(ScreenTestEngine.processGamepadInput({ buttons: buttonsA, axes: defaultAxes }).action).toBe('TOGGLE_FULLSCREEN');
  });
});
