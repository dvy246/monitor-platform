/**
 * MicNoiseGateEngine.ts
 * Pure TypeScript engine for evaluating microphone noise gate thresholds,
 * gate state (Open/Closed), and attenuation levels based on dBFS input.
 */

export interface INoiseGateAnalysis {
  dbfs: number;
  isOpen: boolean;
  attenuationDb: number; // 0 if open, negative if closed/attenuating
  gateState: 'OPEN' | 'CLOSED';
}

export class MicNoiseGateEngine {
  private thresholdDbfs: number;
  private attackMs: number;
  private releaseMs: number;
  
  private isGateOpen: boolean = false;
  private lastTriggerTime: number = 0;

  constructor(thresholdDbfs: number = -40, attackMs: number = 10, releaseMs: number = 200) {
    this.thresholdDbfs = thresholdDbfs;
    this.attackMs = attackMs;
    this.releaseMs = releaseMs;
  }

  public setThreshold(thresholdDbfs: number) {
    this.thresholdDbfs = thresholdDbfs;
  }

  public evaluateGate(currentDbfs: number, currentTimeMs: number): INoiseGateAnalysis {
    if (currentDbfs > this.thresholdDbfs) {
      this.isGateOpen = true;
      this.lastTriggerTime = currentTimeMs;
    } else {
      const timeSinceTrigger = currentTimeMs - this.lastTriggerTime;
      if (timeSinceTrigger > this.releaseMs) {
        this.isGateOpen = false;
      }
    }

    return {
      dbfs: currentDbfs,
      isOpen: this.isGateOpen,
      attenuationDb: this.isGateOpen ? 0 : -100, // Hard gate simulation
      gateState: this.isGateOpen ? 'OPEN' : 'CLOSED'
    };
  }

  public static calculateDbfsFromSamples(pcmSamples: Float32Array): number {
    if (pcmSamples.length === 0) return -100;
    
    let sumSquares = 0;
    for (let i = 0; i < pcmSamples.length; i++) {
      sumSquares += pcmSamples[i] * pcmSamples[i];
    }
  
    const rms = Math.sqrt(sumSquares / pcmSamples.length);
    if (rms <= 0.00001) return -100;
  
    const dbfs = 20 * Math.log10(rms);
    return Number(Math.max(-100, Math.min(0, dbfs)).toFixed(1));
  }
}
