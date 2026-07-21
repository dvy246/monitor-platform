import type { IVsyncStats } from '../types/display';

export class VsyncSyncEngine {
  private lastTime: number = 0;
  private frameTimes: number[] = [];
  private maxSamples: number = 60;
  private syncLossCount: number = 0;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private expectedFrameTimeMs: number = 16.67; // Default 60Hz placeholder

  constructor(private callback: (stats: IVsyncStats) => void) {}

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameTimes = [];
    this.syncLossCount = 0;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Detect tab backgrounding or severe GPU stutter (e.g. delta > 100ms)
    // and execute self-healing reset of expected pacing
    if (delta > 100) {
      this.syncLossCount++;
      this.frameTimes = [];
    } else {
      this.frameTimes.push(delta);
      if (this.frameTimes.length > this.maxSamples) {
        this.frameTimes.shift();
      }
    }

    // Calculate moving average
    const avgDelta = this.frameTimes.reduce((a, b) => a + b, 0) / (this.frameTimes.length || 1);
    const fps = avgDelta > 0 ? 1000 / avgDelta : 0;

    // Sync loss when delta deviates significantly from running average
    if (this.frameTimes.length > 10 && Math.abs(delta - avgDelta) > avgDelta * 0.3) {
      this.syncLossCount++;
    }

    this.callback({
      currentFps: Math.round(fps * 10) / 10,
      frameDeltaMs: Math.round(delta * 100) / 100,
      syncLossCount: this.syncLossCount,
      lastTimestamp: timestamp
    });

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
