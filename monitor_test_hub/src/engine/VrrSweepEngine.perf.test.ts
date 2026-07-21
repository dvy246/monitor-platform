import { describe, it, expect } from 'vitest';
import {
  calculateVrrMetrics,
  calculateStutterVariance,
  getSweepFps
} from './VrrSweepEngine';

describe('Performance & Memory Allocation Stress Test', () => {
  it('simulates 100,000 frame rAF loops to measure calculation latency and allocation impact', () => {
    const frameCount = 100000;
    const startMemory = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    let frameTimesBuffer: number[] = [];
    let cumulativeDrops = 0;

    for (let i = 0; i < frameCount; i++) {
      const timestamp = i * 16.666; // 60 FPS simulation
      const deltaMs = 16.666;
      const elapsedTimeSec = timestamp / 1000;

      // Engine math
      const targetFps = getSweepFps('stress', elapsedTimeSec, 144, 20);
      const metrics = calculateVrrMetrics(targetFps, 144, 48, 'nvidia-geforce');

      // Buffer management (matching VrrStutterGenerator.astro)
      frameTimesBuffer.push(deltaMs);
      if (frameTimesBuffer.length > 60) {
        frameTimesBuffer.shift();
      }

      const expectedFrameTimeMs = 1000 / Math.max(targetFps, 1);
      const stutterMetrics = calculateStutterVariance(frameTimesBuffer, expectedFrameTimeMs);
      cumulativeDrops += stutterMetrics.frameDropCount > 0 ? 1 : 0;
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    const totalTimeMs = endTime - startTime;
    const perFrameTimeUs = (totalTimeMs / frameCount) * 1000; // microseconds per frame

    console.log(`100k Frame Performance: Total ${totalTimeMs.toFixed(2)}ms | Per Frame: ${perFrameTimeUs.toFixed(2)}µs`);
    console.log(`Heap Delta: ${((endMemory - startMemory) / 1024 / 1024).toFixed(2)} MB`);

    // Frame budget at 540 Hz is ~1.85 ms (1850 µs).
    // Engine math per frame should ideally be under 50 µs (< 0.05 ms).
    expect(perFrameTimeUs).toBeLessThan(100);
  });
});
