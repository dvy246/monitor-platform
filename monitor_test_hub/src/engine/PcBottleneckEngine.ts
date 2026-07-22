/**
 * PC Bottleneck & FPS Estimator Engine
 * 
 * Provides resolution-aware component balance analysis (1080p, 1440p, 4K),
 * transparent CPU/GPU utilization ratio heuristics, bottleneck severity classification,
 * per-game frame rate estimation, and component upgrade recommendations.
 */

export interface CpuSpec {
  id: string;
  name: string;
  brand: 'Intel' | 'AMD';
  singleCoreScore: number; // 0 - 100 normalized
  multiCoreScore: number;  // 0 - 100 normalized
  tier: 'Entry' | 'Mid' | 'High' | 'Enthusiast';
  recommendedPairings: string[];
}

export interface GpuSpec {
  id: string;
  name: string;
  brand: 'NVIDIA' | 'AMD' | 'Intel';
  vramGb: number;
  score1080p: number; // 0 - 100 normalized
  score1440p: number; // 0 - 100 normalized
  score4k: number;    // 0 - 100 normalized
  tier: 'Entry' | 'Mid' | 'High' | 'Enthusiast';
}

export type TargetResolution = '1080p' | '1440p' | '4K';

export interface BottleneckResult {
  cpu: CpuSpec;
  gpu: GpuSpec;
  resolution: TargetResolution;
  bottleneckPercentage: number;
  primaryBottleneck: 'CPU' | 'GPU' | 'Balanced';
  severity: 'None' | 'Minor' | 'Moderate' | 'Severe';
  cpuUtilizationEst: number; // 0 - 100%
  gpuUtilizationEst: number; // 0 - 100%
  explanation: string;
  recommendedUpgrade: string;
  estimatedFps: {
    cyberpunk2077: number;
    cs2: number;
    callOfDuty: number;
    fortnite: number;
    gtaV: number;
  };
}

export class PcBottleneckEngine {
  public static readonly CPUS: CpuSpec[] = [
    { id: 'ryzen-7-7800x3d', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', singleCoreScore: 98, multiCoreScore: 92, tier: 'Enthusiast', recommendedPairings: ['rtx-4080-super', 'rtx-4090', 'rx-7900-xtx'] },
    { id: 'intel-i9-14900k', name: 'Intel Core i9-14900K', brand: 'Intel', singleCoreScore: 100, multiCoreScore: 100, tier: 'Enthusiast', recommendedPairings: ['rtx-4090', 'rtx-4080-super'] },
    { id: 'ryzen-7-5700x3d', name: 'AMD Ryzen 7 5700X3D', brand: 'AMD', singleCoreScore: 82, multiCoreScore: 80, tier: 'High', recommendedPairings: ['rtx-4070-super', 'rx-7800-xt'] },
    { id: 'intel-i5-13600k', name: 'Intel Core i5-13600K', brand: 'Intel', singleCoreScore: 88, multiCoreScore: 86, tier: 'High', recommendedPairings: ['rtx-4070-super', 'rx-7800-xt'] },
    { id: 'ryzen-5-5600', name: 'AMD Ryzen 5 5600', brand: 'AMD', singleCoreScore: 68, multiCoreScore: 65, tier: 'Mid', recommendedPairings: ['rtx-4060', 'rx-6700-xt'] },
    { id: 'intel-i5-12400f', name: 'Intel Core i5-12400F', brand: 'Intel', singleCoreScore: 66, multiCoreScore: 63, tier: 'Mid', recommendedPairings: ['rtx-3060', 'rx-6600'] },
    { id: 'ryzen-5-3600', name: 'AMD Ryzen 5 3600', brand: 'AMD', singleCoreScore: 52, multiCoreScore: 50, tier: 'Entry', recommendedPairings: ['gtx-1660-super', 'rx-580'] },
    { id: 'intel-i7-9700k', name: 'Intel Core i7-9700K', brand: 'Intel', singleCoreScore: 58, multiCoreScore: 55, tier: 'Entry', recommendedPairings: ['rtx-2070', 'gtx-1080'] }
  ];

  public static readonly GPUS: GpuSpec[] = [
    { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', vramGb: 24, score1080p: 100, score1440p: 100, score4k: 100, tier: 'Enthusiast' },
    { id: 'rtx-4080-super', name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', vramGb: 16, score1080p: 95, score1440p: 94, score4k: 90, tier: 'Enthusiast' },
    { id: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', vramGb: 24, score1080p: 93, score1440p: 92, score4k: 88, tier: 'Enthusiast' },
    { id: 'rtx-4070-super', name: 'NVIDIA GeForce RTX 4070 Super', brand: 'NVIDIA', vramGb: 12, score1080p: 82, score1440p: 80, score4k: 72, tier: 'High' },
    { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', vramGb: 16, score1080p: 78, score1440p: 76, score4k: 68, tier: 'High' },
    { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060', brand: 'NVIDIA', vramGb: 8, score1080p: 62, score1440p: 55, score4k: 42, tier: 'Mid' },
    { id: 'rx-6700-xt', name: 'AMD Radeon RX 6700 XT', brand: 'AMD', vramGb: 12, score1080p: 64, score1440p: 58, score4k: 45, tier: 'Mid' },
    { id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060', brand: 'NVIDIA', vramGb: 12, score1080p: 50, score1440p: 42, score4k: 30, tier: 'Entry' }
  ];

  public static getCpuById(id: string): CpuSpec | undefined {
    return this.CPUS.find(c => c.id === id);
  }

  public static getGpuById(id: string): GpuSpec | undefined {
    return this.GPUS.find(g => g.id === id);
  }

  /**
   * Calculates component balance score, bottleneck percentage, and frame rate estimates.
   */
  public static calculateBottleneck(cpuId: string, gpuId: string, resolution: TargetResolution): BottleneckResult {
    const cpu = this.getCpuById(cpuId) || this.CPUS[0];
    const gpu = this.getGpuById(gpuId) || this.GPUS[0];

    // Determine GPU score based on target resolution
    let gpuScore = gpu.score1080p;
    let cpuWeight = 0.55;
    let gpuWeight = 0.45;

    if (resolution === '1440p') {
      gpuScore = gpu.score1440p;
      cpuWeight = 0.40;
      gpuWeight = 0.60;
    } else if (resolution === '4K') {
      gpuScore = gpu.score4k;
      cpuWeight = 0.20;
      gpuWeight = 0.80;
    }

    const cpuCapability = cpu.singleCoreScore;
    const gpuRequirement = gpuScore;

    // Calculate ratio of CPU capability to GPU requirement
    const ratio = cpuCapability / gpuRequirement;
    let bottleneckPercentage = 0;
    let primaryBottleneck: 'CPU' | 'GPU' | 'Balanced' = 'Balanced';
    let severity: 'None' | 'Minor' | 'Moderate' | 'Severe' = 'None';
    let cpuUtil = 50;
    let gpuUtil = 99;

    if (ratio < 0.80) {
      // CPU is bottlenecking GPU
      primaryBottleneck = 'CPU';
      bottleneckPercentage = Math.round((1 - ratio) * 100);
      cpuUtil = 99;
      gpuUtil = Math.round(ratio * 99);

      if (bottleneckPercentage < 10) severity = 'Minor';
      else if (bottleneckPercentage < 25) severity = 'Moderate';
      else severity = 'Severe';
    } else if (ratio > 1.30) {
      // GPU is bottlenecking CPU (normal in high resolution)
      primaryBottleneck = 'GPU';
      const rawB = Math.round((1 - (1 / ratio)) * 100 * (gpuWeight * 0.8));
      bottleneckPercentage = Math.min(60, rawB);
      gpuUtil = 99;
      cpuUtil = Math.max(30, Math.round(99 / ratio));

      if (bottleneckPercentage < 15) severity = 'None';
      else if (bottleneckPercentage < 30) severity = 'Minor';
      else severity = 'Moderate';
    } else {
      primaryBottleneck = 'Balanced';
      bottleneckPercentage = Math.round(Math.abs(1 - ratio) * 10);
      severity = 'None';
      cpuUtil = 75;
      gpuUtil = 98;
    }

    // Explanation text
    let explanation = `Your ${cpu.name} and ${gpu.name} operate in optimal balance at ${resolution}.`;
    if (primaryBottleneck === 'CPU') {
      explanation = `At ${resolution}, your ${cpu.name} limits the max potential of your ${gpu.name}. The GPU operates at ~${gpuUtil}% utilization while waiting for CPU thread dispatch.`;
    } else if (primaryBottleneck === 'GPU') {
      explanation = `At ${resolution}, rendering is graphics-bound. Your ${gpu.name} operates at 99% load, which is expected for gaming at ${resolution}.`;
    }

    // Upgrade recommendation
    let recommendedUpgrade = 'System is well-balanced. No immediate upgrade required.';
    if (primaryBottleneck === 'CPU' && severity !== 'None') {
      const betterCpu = this.CPUS.find(c => c.singleCoreScore > cpu.singleCoreScore);
      if (betterCpu) {
        recommendedUpgrade = `Consider upgrading CPU to ${betterCpu.name} to eliminate the ${bottleneckPercentage}% bottleneck at ${resolution}.`;
      }
    } else if (primaryBottleneck === 'GPU' && severity === 'Moderate') {
      const betterGpu = this.GPUS.find(g => g.score1440p > gpu.score1440p);
      if (betterGpu) {
        recommendedUpgrade = `For higher FPS at ${resolution}, consider upgrading GPU to ${betterGpu.name}.`;
      }
    }

    // Estimated FPS calculation
    const baseGpuFps = gpuScore * 1.8;
    const cpuCapFps = cpuCapability * 2.1;
    const bottleneckedFps = Math.min(baseGpuFps, cpuCapFps);

    const resScaling = resolution === '1080p' ? 1.0 : resolution === '1440p' ? 0.72 : 0.42;

    const estimatedFps = {
      cyberpunk2077: Math.round(bottleneckedFps * resScaling * 0.55),
      cs2: Math.round(cpuCapFps * 2.4),
      callOfDuty: Math.round(bottleneckedFps * resScaling * 1.1),
      fortnite: Math.round(bottleneckedFps * resScaling * 1.3),
      gtaV: Math.round(bottleneckedFps * resScaling * 1.25)
    };

    return {
      cpu,
      gpu,
      resolution,
      bottleneckPercentage,
      primaryBottleneck,
      severity,
      cpuUtilizationEst: cpuUtil,
      gpuUtilizationEst: gpuUtil,
      explanation,
      recommendedUpgrade,
      estimatedFps
    };
  }
}
