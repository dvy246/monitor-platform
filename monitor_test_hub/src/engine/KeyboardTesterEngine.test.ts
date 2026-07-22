import { describe, it, expect, beforeEach } from 'vitest';
import { KeyboardTesterState, ANSI_104_KEYS, GAMING_COMBOS } from './KeyboardTesterEngine';

describe('KeyboardTesterEngine Unit Tests', () => {
  let state: KeyboardTesterState;

  beforeEach(() => {
    state = new KeyboardTesterState();
  });

  it('should initialize with clean telemetry and zero active keys', () => {
    const report = state.generateReport(ANSI_104_KEYS);
    expect(report.activeKeysCount).toBe(0);
    expect(report.testedKeysCount).toBe(0);
    expect(report.peakSimultaneousKeys).toBe(0);
    expect(report.isNkroCompliant).toBe(false);
    expect(report.chatterAlertCount).toBe(0);
  });

  it('should process keydown events and track simultaneous active keys peak', () => {
    state.processKeyDown('KeyW', 1000);
    state.processKeyDown('KeyA', 1005);
    state.processKeyDown('KeyS', 1010);

    let report = state.generateReport(ANSI_104_KEYS, 1020);
    expect(report.activeKeysCount).toBe(3);
    expect(report.testedKeysCount).toBe(3);
    expect(report.peakSimultaneousKeys).toBe(3);

    // Release 1 key
    state.processKeyUp('KeyW', 1030);
    report = state.generateReport(ANSI_104_KEYS, 1040);
    expect(report.activeKeysCount).toBe(2);
    expect(report.peakSimultaneousKeys).toBe(3); // Peak maintained
  });

  it('should verify NKRO compliance when 7+ keys are held simultaneously', () => {
    const keys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'Space'];
    keys.forEach((k, idx) => state.processKeyDown(k, 1000 + idx * 2));

    const report = state.generateReport(ANSI_104_KEYS, 1050);
    expect(report.peakSimultaneousKeys).toBe(8);
    expect(report.isNkroCompliant).toBe(true);
  });

  it('should detect switch chatter when re-press occurs below chatterThresholdMs (e.g. 15ms)', () => {
    // Initial press and release
    state.processKeyDown('KeyA', 1000);
    state.processKeyUp('KeyA', 1050);

    // Rapid re-trigger (chatter bounce) 15ms after release
    const { isChatter, deltaMs } = state.processKeyDown('KeyA', 1065);
    expect(isChatter).toBe(true);
    expect(deltaMs).toBe(15);

    const report = state.generateReport(ANSI_104_KEYS, 1100);
    expect(report.chatterAlertCount).toBe(1);
    expect(report.chatterLog[0].code).toBe('KeyA');
    expect(report.chatterLog[0].deltaMs).toBe(15);
  });

  it('should not trigger chatter alert for deliberate key presses above threshold (e.g. 100ms)', () => {
    state.processKeyDown('KeyB', 1000);
    state.processKeyUp('KeyB', 1050);

    const { isChatter } = state.processKeyDown('KeyB', 1160);
    expect(isChatter).toBe(false);
  });

  it('should compute key duration and update telemetry min/max duration bounds', () => {
    state.processKeyDown('Space', 1000);
    const duration = state.processKeyUp('Space', 1250);
    expect(duration).toBe(250);

    const tele = state.telemetryMap.get('Space');
    expect(tele?.lastDurationMs).toBe(250);
    expect(tele?.minDurationMs).toBe(250);
    expect(tele?.maxDurationMs).toBe(250);
  });

  it('should calculate normalized heatmap intensity based on press count ratios', () => {
    state.processKeyDown('KeyW', 1000);
    state.processKeyDown('KeyW', 1100);
    state.processKeyDown('KeyW', 1200); // 3 presses
    state.processKeyDown('KeyA', 1300); // 1 press

    expect(state.getHeatmapIntensity('KeyW')).toBe(1.0);
    expect(state.getHeatmapIntensity('KeyA')).toBeCloseTo(0.333, 2);
    expect(state.getHeatmapIntensity('KeyS')).toBe(0);
  });

  it('should calculate APM and WPM based on elapsed time window', () => {
    state.processKeyDown('KeyA', 1000); // Start time = 1000ms
    for (let i = 0; i < 59; i++) {
      state.processKeyDown('KeyA', 1000 + i * 100);
    }
    // 60 total presses over 60,000ms (1 minute)
    const report = state.generateReport(ANSI_104_KEYS, 61000);
    expect(report.totalPresses).toBe(60);
    expect(report.apm).toBe(60);
    expect(report.wpm).toBe(12);
  });

  it('should evaluate gaming combos correctly', () => {
    expect(GAMING_COMBOS.length).toBeGreaterThanOrEqual(4);
    const fpsCombo = GAMING_COMBOS.find(c => c.id === 'fps-wasd-jump');
    expect(fpsCombo?.keys).toContain('KeyW');
    expect(fpsCombo?.keys).toContain('Space');
  });

  it('should reset state cleanly', () => {
    state.processKeyDown('KeyA', 1000);
    state.reset();
    const report = state.generateReport(ANSI_104_KEYS);
    expect(report.activeKeysCount).toBe(0);
    expect(report.testedKeysCount).toBe(0);
    expect(report.totalPresses).toBe(0);
  });
});
