export type EjectTarget = 'all' | 'left' | 'right' | 'earpiece';
export type DiagnosticMode = 'water-sweep' | 'dust-blower' | 'constant-tone' | 'pulse' | 'crackle-test';
export type DevicePreset = 'mobile' | 'iphone' | 'android' | 'tablet' | 'laptop' | 'earpiece';

export interface DeviceConfig {
  name: string;
  baseFreq: number;
  endFreq: number;
  cycleTimeSec: number;
  description: string;
  badge: string;
}

export const DEVICE_PRESETS: Record<DevicePreset, DeviceConfig> = {
  mobile: {
    name: 'Universal Mobile',
    baseFreq: 165,
    endFreq: 300,
    cycleTimeSec: 30,
    description: 'Universal water eject sound tool for all mobile phone speakers.',
    badge: '165Hz–300Hz'
  },
  iphone: {
    name: 'iPhone & Apple',
    baseFreq: 165,
    endFreq: 250,
    cycleTimeSec: 30,
    description: 'Optimized water removal sound specifically tuned for iPhone speaker systems.',
    badge: 'Apple Optimized'
  },
  android: {
    name: 'Android Devices',
    baseFreq: 160,
    endFreq: 280,
    cycleTimeSec: 30,
    description: 'Designed for Samsung Galaxy, Google Pixel, OnePlus, Xiaomi, and Android devices.',
    badge: 'Android Optimized'
  },
  tablet: {
    name: 'Tablets & iPad',
    baseFreq: 140,
    endFreq: 220,
    cycleTimeSec: 45,
    description: 'Powerful water removal sound for iPad, Samsung Tab, and larger tablet drivers.',
    badge: 'Larger Speakers'
  },
  laptop: {
    name: 'Laptops & MacBook',
    baseFreq: 120,
    endFreq: 240,
    cycleTimeSec: 60,
    description: 'Safe water eject sound tool for MacBook, Windows laptops, and Chromebook speakers.',
    badge: 'Multi-Speaker'
  },
  earpiece: {
    name: 'Call Speaker & Earpiece',
    baseFreq: 250,
    endFreq: 400,
    cycleTimeSec: 30,
    description: 'Specialized high-frequency ejection for top earpiece and call speaker capsules.',
    badge: 'Higher Freq'
  }
};

export interface EngineConfig {
  mode: DiagnosticMode;
  target: EjectTarget;
  preset?: DevicePreset;
  baseFreq: number;
  endFreq?: number;
  intensity: number;
  volume: number;
}

function getAudioContextClass(): typeof AudioContext | null {
  if (typeof window !== 'undefined') {
    return window.AudioContext || (window as any).webkitAudioContext || null;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).AudioContext) {
    return (globalThis as any).AudioContext;
  }
  return null;
}

export class AudioDiagnosticEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  
  private isRunning: boolean = false;
  private animFrameId: number | null = null;
  private hapticTimer: number | null = null;

  private onFreqChange?: (freq: number) => void;
  private onWaveformUpdate?: (data: Uint8Array) => void;

  constructor(
    onFreqChange?: (freq: number) => void,
    onWaveformUpdate?: (data: Uint8Array) => void
  ) {
    this.onFreqChange = onFreqChange;
    this.onWaveformUpdate = onWaveformUpdate;
  }

  public async initAudio(): Promise<void> {
    if (!this.ctx) {
      const AudioCtx = getAudioContextClass();
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (_) {}
    }
  }

  public start(config: EngineConfig): void {
    if (this.isRunning) {
      this.stop();
    }

    if (!this.ctx) {
      const AudioCtx = getAudioContextClass();
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch (_) {}
    }

    this.isRunning = true;
    const ctx = this.ctx;
    if (!ctx) return;

    this.osc = ctx.createOscillator();
    this.gainNode = ctx.createGain();

    if (typeof ctx.createStereoPanner === 'function') {
      this.pannerNode = ctx.createStereoPanner();
    } else {
      this.pannerNode = null;
    }

    this.analyserNode = ctx.createAnalyser();
    this.analyserNode.fftSize = 64;

    if (config.mode === 'dust-blower') {
      this.osc.type = 'sawtooth';
    } else if (config.mode === 'crackle-test') {
      this.osc.type = 'triangle';
    } else {
      this.osc.type = 'sine';
    }

    const initialFreq = config.baseFreq || 165;
    this.osc.frequency.setValueAtTime(initialFreq, ctx.currentTime);

    const targetGain = Math.max(0, Math.min(1, config.volume * config.intensity));
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.05);

    let panVal = 0;
    if (config.target === 'left') panVal = -1;
    if (config.target === 'right') panVal = 1;

    if (this.pannerNode) {
      this.pannerNode.pan.setValueAtTime(panVal, ctx.currentTime);
      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.pannerNode);
      this.pannerNode.connect(this.analyserNode);
    } else {
      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
    }
    this.analyserNode.connect(ctx.destination);

    this.osc.start();

    this.applyModeAutomation(config);
    this.startHaptics();
    this.startVisualizationLoop();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.animFrameId !== null) {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this.animFrameId);
      } else if (typeof clearTimeout === 'function') {
        clearTimeout(this.animFrameId);
      }
      this.animFrameId = null;
    }

    if (this.hapticTimer !== null) {
      if (typeof window !== 'undefined' && window.clearInterval) {
        window.clearInterval(this.hapticTimer);
      } else if (typeof clearInterval === 'function') {
        clearInterval(this.hapticTimer);
      }
      this.hapticTimer = null;
    }

    if (this.gainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.05);
    }

    if (this.osc && this.ctx) {
      const stopTime = this.ctx.currentTime + 0.06;
      try {
        this.osc.stop(stopTime);
      } catch (_) {}
      const activeOsc = this.osc;
      setTimeout(() => {
        try {
          activeOsc.disconnect();
        } catch (_) {}
      }, 100);
    }

    this.osc = null;
    this.gainNode = null;
    this.pannerNode = null;
    this.analyserNode = null;
  }

  public get active(): boolean {
    return this.isRunning;
  }

  private applyModeAutomation(config: EngineConfig): void {
    if (!this.osc || !this.ctx || !this.gainNode) return;
    const ctx = this.ctx;
    const osc = this.osc;
    const gain = this.gainNode;
    const baseF = config.baseFreq || 165;
    const endF = config.endFreq || (baseF + 35);

    if (config.mode === 'water-sweep') {
      const runSweepLoop = () => {
        if (!this.isRunning || !osc || !ctx) return;
        const now = ctx.currentTime;
        osc.frequency.cancelScheduledValues(now);
        osc.frequency.setValueAtTime(baseF, now);
        osc.frequency.linearRampToValueAtTime(endF, now + 0.4);
        osc.frequency.linearRampToValueAtTime(baseF, now + 0.8);

        setTimeout(() => {
          if (this.isRunning) runSweepLoop();
        }, 800);
      };
      runSweepLoop();
    } else if (config.mode === 'pulse') {
      const runPulseLoop = () => {
        if (!this.isRunning || !gain || !ctx) return;
        const now = ctx.currentTime;
        const maxG = Math.max(0, Math.min(1, config.volume * config.intensity));
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(maxG, now);
        gain.gain.setValueAtTime(0.001, now + 0.15);

        setTimeout(() => {
          if (this.isRunning) runPulseLoop();
        }, 300);
      };
      runPulseLoop();
    }
  }

  private startHaptics(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const triggerVibe = () => {
        if (!this.isRunning) return;
        try {
          navigator.vibrate([150, 50, 150]);
        } catch (_) {}
      };
      triggerVibe();
      if (typeof window !== 'undefined' && window.setInterval) {
        this.hapticTimer = window.setInterval(triggerVibe, 400);
      }
    }
  }

  private startVisualizationLoop(): void {
    const dataArray = new Uint8Array(32);
    const update = () => {
      if (!this.isRunning) return;
      if (this.analyserNode) {
        this.analyserNode.getByteFrequencyData(dataArray);
        if (this.onWaveformUpdate) {
          this.onWaveformUpdate(dataArray);
        }
      }
      if (this.osc && this.ctx && this.onFreqChange) {
        try {
          this.onFreqChange(Math.round(this.osc.frequency.value));
        } catch (_) {}
      }
      if (typeof requestAnimationFrame === 'function') {
        this.animFrameId = requestAnimationFrame(update);
      }
    };
    if (typeof requestAnimationFrame === 'function') {
      this.animFrameId = requestAnimationFrame(update);
    }
  }
}
