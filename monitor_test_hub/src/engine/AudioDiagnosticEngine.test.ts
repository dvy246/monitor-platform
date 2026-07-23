import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioDiagnosticEngine } from './AudioDiagnosticEngine';

// Mock Web Audio API for Node environment
class MockAudioNode {
  connect() { return this; }
  disconnect() {}
}

class MockGainNode extends MockAudioNode {
  gain = {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
    exponentialRampToValueAtTime: vi.fn()
  };
}

class MockOscillatorNode extends MockAudioNode {
  type = 'sine';
  frequency = {
    value: 165,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn()
  };
  start = vi.fn();
  stop = vi.fn();
}

class MockStereoPannerNode extends MockAudioNode {
  pan = {
    value: 0,
    setValueAtTime: vi.fn()
  };
}

class MockAnalyserNode extends MockAudioNode {
  fftSize = 64;
  getByteFrequencyData = vi.fn((arr: Uint8Array) => arr.fill(128));
}

class MockAudioContext {
  state = 'running';
  currentTime = 0;
  destination = new MockAudioNode();
  resume = vi.fn().mockResolvedValue(undefined);
  createGain = () => new MockGainNode();
  createOscillator = () => new MockOscillatorNode();
  createStereoPanner = () => new MockStereoPannerNode();
  createAnalyser = () => new MockAnalyserNode();
}

describe('AudioDiagnosticEngine', () => {
  beforeEach(() => {
    vi.stubGlobal('AudioContext', MockAudioContext);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(cb, 16));
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('instantiates cleanly without errors', () => {
    const engine = new AudioDiagnosticEngine();
    expect(engine.active).toBe(false);
  });

  it('starts and sets active state to true', async () => {
    const engine = new AudioDiagnosticEngine();
    await engine.initAudio();
    engine.start({
      mode: 'water-sweep',
      target: 'all',
      baseFreq: 165,
      endFreq: 175,
      intensity: 1.0,
      volume: 0.8
    });
    expect(engine.active).toBe(true);
    engine.stop();
    expect(engine.active).toBe(false);
  });

  it('handles left and right channel target panning', async () => {
    const engine = new AudioDiagnosticEngine();
    engine.start({
      mode: 'constant-tone',
      target: 'left',
      baseFreq: 165,
      intensity: 1.0,
      volume: 0.5
    });
    expect(engine.active).toBe(true);
    engine.stop();
  });

  it('handles mode changes cleanly without throwing', async () => {
    const engine = new AudioDiagnosticEngine();
    engine.start({ mode: 'dust-blower', target: 'all', baseFreq: 250, intensity: 1, volume: 1 });
    expect(engine.active).toBe(true);
    engine.start({ mode: 'pulse', target: 'right', baseFreq: 165, intensity: 1, volume: 1 });
    expect(engine.active).toBe(true);
    engine.stop();
  });
});
