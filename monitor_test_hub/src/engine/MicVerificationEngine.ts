export interface VerificationResult {
  preDb: number;
  postDb: number;
  deltaDb: number;
  recoveryPercentage: number;
  status: 'improved' | 'unchanged' | 'degraded';
  recommendation: string;
}

export class MicVerificationEngine {
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private isMeasuring: boolean = false;

  public async requestMicPermission(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      return true;
    } catch (_) {
      return false;
    }
  }

  public async measureAcousticAmplitude(durationMs: number = 2000): Promise<number> {
    if (!this.micStream) {
      const granted = await this.requestMicPermission();
      if (!granted || !this.micStream) return 0;
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return 0;

    this.audioCtx = new AudioCtx();
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const source = this.audioCtx.createMediaStreamSource(this.micStream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 512;
    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let totalRms = 0;
    let samples = 0;
    const startTime = Date.now();

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.analyser) {
          clearInterval(interval);
          resolve(0);
          return;
        }
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / bufferLength);
        totalRms += rms;
        samples++;

        if (Date.now() - startTime >= durationMs) {
          clearInterval(interval);
          this.cleanupAudioCtx();
          const avgRms = samples > 0 ? totalRms / samples : 0;
          // Convert average RMS to normalized dB scale (0 to 100)
          const normalizedDb = Math.min(100, Math.max(0, (avgRms / 255) * 100));
          resolve(Math.round(normalizedDb * 10) / 10);
        }
      }, 50);
    });
  }

  public evaluateRecovery(preDb: number, postDb: number): VerificationResult {
    const deltaDb = Math.round((postDb - preDb) * 10) / 10;
    const recoveryPercentage = preDb > 0 ? Math.min(100, Math.round(((postDb - preDb) / preDb) * 100)) : 0;

    let status: 'improved' | 'unchanged' | 'degraded' = 'unchanged';
    let recommendation = 'Acoustic volume levels remained identical. If muffled audio persists, try Deep Clean mode.';

    if (deltaDb > 2.0) {
      status = 'improved';
      recommendation = `Great news! Acoustic volume increased by +${deltaDb} dB (${recoveryPercentage}% recovery). Your speaker membrane is clearer.`;
    } else if (deltaDb < -2.0) {
      status = 'degraded';
      recommendation = 'Acoustic volume decreased slightly. Ensure device mic is not blocked and test again.';
    }

    return {
      preDb,
      postDb,
      deltaDb,
      recoveryPercentage,
      status,
      recommendation
    };
  }

  public stopMicStream(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    this.cleanupAudioCtx();
  }

  private cleanupAudioCtx(): void {
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (_) {}
    }
    this.audioCtx = null;
    this.analyser = null;
  }
}
