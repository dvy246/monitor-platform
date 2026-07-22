import { describe, it, expect } from 'vitest';
import { PcBottleneckEngine } from './PcBottleneckEngine';

describe('PcBottleneckEngine Unit Tests', () => {
  it('should return valid CPU and GPU specs by ID', () => {
    const cpu = PcBottleneckEngine.getCpuById('ryzen-7-7800x3d');
    const gpu = PcBottleneckEngine.getGpuById('rtx-4090');

    expect(cpu).toBeDefined();
    expect(cpu?.brand).toBe('AMD');
    expect(gpu).toBeDefined();
    expect(gpu?.brand).toBe('NVIDIA');
  });

  it('should calculate CPU bottleneck correctly for high GPU + lower CPU at 1080p', () => {
    const result = PcBottleneckEngine.calculateBottleneck('ryzen-5-3600', 'rtx-4090', '1080p');

    expect(result.primaryBottleneck).toBe('CPU');
    expect(result.bottleneckPercentage).toBeGreaterThan(20);
    expect(result.severity).toBe('Severe');
    expect(result.gpuUtilizationEst).toBeLessThan(90);
  });

  it('should calculate GPU bound behavior at 4K resolution', () => {
    const result = PcBottleneckEngine.calculateBottleneck('ryzen-7-7800x3d', 'rtx-3060', '4K');

    expect(result.primaryBottleneck).toBe('GPU');
    expect(result.gpuUtilizationEst).toBe(99);
  });

  it('should provide non-zero estimated FPS across all games', () => {
    const result = PcBottleneckEngine.calculateBottleneck('intel-i5-13600k', 'rtx-4070-super', '1440p');

    expect(result.estimatedFps.cyberpunk2077).toBeGreaterThan(30);
    expect(result.estimatedFps.cs2).toBeGreaterThan(100);
    expect(result.estimatedFps.fortnite).toBeGreaterThan(60);
  });
});
