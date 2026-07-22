/**
 * Wireless Audio & Peripheral Latency Simulator & Protocol Jitter Engine
 * Pure TypeScript calculation engine for multi-layer systemic audio-visual latency breakdown,
 * audio codec transmission delay, OS audio stack queue overhead, display lip-sync frame offsets,
 * and protocol jitter models.
 */

export type WirelessProtocol = 
  | 'BLUETOOTH_SBC' 
  | 'BLUETOOTH_AAC' 
  | 'BLUETOOTH_APTX' 
  | 'BLUETOOTH_APTX_LL' 
  | 'BLUETOOTH_APTX_ADAPTIVE' 
  | 'BLUETOOTH_LDAC' 
  | 'BLUETOOTH_LC3' 
  | 'RF_2_4GHZ_DONGLE' 
  | 'USB_WIRED';

export type OsAudioStack = 
  | 'WINDOWS_WASAPI_SHARED' 
  | 'WINDOWS_WASAPI_EXCLUSIVE' 
  | 'MACOS_COREAUDIO' 
  | 'ANDROID_AAUDIO' 
  | 'LINUX_PIPEWIRE';

export type DisplayRefreshRate = 60 | 120 | 144 | 240 | 360 | 540;

export interface IWirelessLatencyInput {
  protocol: WirelessProtocol;
  audioStack: OsAudioStack;
  bufferSizeSamples: number; // e.g. 128, 256, 512, 1024
  sampleRateHz: number;      // e.g. 44100, 48000, 96000
  ancEnabled: boolean;
  displayFps: DisplayRefreshRate;
  rfInterferenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ILatencyBreakdown {
  codecLatencyMs: number;
  stackLatencyMs: number;
  bufferLatencyMs: number;
  dacLatencyMs: number;
  displayFramePeriodMs: number;
  totalSystemicLatencyMs: number;
  jitterVarianceMs: number;
}

export interface ILipSyncMetrics {
  frameOffsetCount: number; // How many frames sound trails video
  severityRating: 'EXCELLENT' | 'GOOD' | 'NOTICEABLE' | 'POOR' | 'UNPLAYABLE';
  isEsportsGrade: boolean;   // Total latency <= 30ms
}

export interface IWirelessLatencyResult {
  breakdown: ILatencyBreakdown;
  lipSync: ILipSyncMetrics;
  primaryBottleneck: string;
  recommendations: string[];
  disclaimer: string;
}

export const PROTOCOL_CODEC_LATENCY_MAP: Record<WirelessProtocol, number> = {
  USB_WIRED: 0.5,
  RF_2_4GHZ_DONGLE: 12.0,
  BLUETOOTH_APTX_LL: 35.0,
  BLUETOOTH_LC3: 45.0,
  BLUETOOTH_APTX_ADAPTIVE: 60.0,
  BLUETOOTH_APTX: 130.0,
  BLUETOOTH_LDAC: 160.0,
  BLUETOOTH_SBC: 170.0,
  BLUETOOTH_AAC: 200.0,
};

export const PROTOCOL_JITTER_BASELINE_MAP: Record<WirelessProtocol, number> = {
  USB_WIRED: 0.1,
  RF_2_4GHZ_DONGLE: 1.5,
  BLUETOOTH_APTX_LL: 2.0,
  BLUETOOTH_LC3: 2.5,
  BLUETOOTH_APTX_ADAPTIVE: 4.0,
  BLUETOOTH_APTX: 6.0,
  BLUETOOTH_LDAC: 12.0,
  BLUETOOTH_SBC: 8.0,
  BLUETOOTH_AAC: 10.0,
};

export const AUDIO_STACK_LATENCY_MAP: Record<OsAudioStack, number> = {
  WINDOWS_WASAPI_EXCLUSIVE: 3.0,
  MACOS_COREAUDIO: 5.0,
  LINUX_PIPEWIRE: 7.0,
  ANDROID_AAUDIO: 15.0,
  WINDOWS_WASAPI_SHARED: 20.0,
};

export const RF_INTERFERENCE_MULTIPLIER: Record<'LOW' | 'MEDIUM' | 'HIGH', number> = {
  LOW: 1.0,
  MEDIUM: 1.8,
  HIGH: 3.2,
};

export const ENGINEERING_DISCLAIMER =
  'Notice: This tool provides hardware signal timing estimations and synthetic audio-visual synchronization metrics for gaming peripherals and display devices. It is strictly a non-clinical engineering diagnostic utility.';

/**
 * Calculates audio buffer delay in milliseconds.
 */
export function calculateBufferLatencyMs(bufferSizeSamples: number, sampleRateHz: number): number {
  if (sampleRateHz <= 0 || bufferSizeSamples <= 0) return 0;
  return (bufferSizeSamples / sampleRateHz) * 1000;
}

/**
 * Calculates multi-layer systemic latency, lip-sync offsets, and optimization recommendations.
 */
export function calculateWirelessLatency(input: IWirelessLatencyInput): IWirelessLatencyResult {
  const codecLatencyMs = PROTOCOL_CODEC_LATENCY_MAP[input.protocol] ?? 100;
  const stackLatencyMs = AUDIO_STACK_LATENCY_MAP[input.audioStack] ?? 10;
  const bufferLatencyMs = calculateBufferLatencyMs(input.bufferSizeSamples, input.sampleRateHz);
  
  const baseDacLatency = (input.protocol === 'USB_WIRED' || input.protocol === 'RF_2_4GHZ_DONGLE') ? 3.0 : 5.0;
  const ancLatency = input.ancEnabled ? 12.0 : 0.0;
  const dacLatencyMs = baseDacLatency + ancLatency;

  const displayFramePeriodMs = 1000 / (input.displayFps || 60);

  const rawTotalMs = codecLatencyMs + stackLatencyMs + bufferLatencyMs + dacLatencyMs + displayFramePeriodMs;
  const totalSystemicLatencyMs = Number(rawTotalMs.toFixed(2));

  const baseJitter = PROTOCOL_JITTER_BASELINE_MAP[input.protocol] ?? 5.0;
  const interferenceMult = RF_INTERFERENCE_MULTIPLIER[input.rfInterferenceLevel] ?? 1.0;
  const jitterVarianceMs = Number((baseJitter * interferenceMult).toFixed(2));

  const breakdown: ILatencyBreakdown = {
    codecLatencyMs: Number(codecLatencyMs.toFixed(2)),
    stackLatencyMs: Number(stackLatencyMs.toFixed(2)),
    bufferLatencyMs: Number(bufferLatencyMs.toFixed(2)),
    dacLatencyMs: Number(dacLatencyMs.toFixed(2)),
    displayFramePeriodMs: Number(displayFramePeriodMs.toFixed(2)),
    totalSystemicLatencyMs,
    jitterVarianceMs,
  };

  const frameOffsetCount = Math.ceil(totalSystemicLatencyMs / displayFramePeriodMs);
  
  let severityRating: ILipSyncMetrics['severityRating'] = 'UNPLAYABLE';
  if (totalSystemicLatencyMs <= 30) {
    severityRating = 'EXCELLENT';
  } else if (totalSystemicLatencyMs <= 60) {
    severityRating = 'GOOD';
  } else if (totalSystemicLatencyMs <= 120) {
    severityRating = 'NOTICEABLE';
  } else if (totalSystemicLatencyMs <= 200) {
    severityRating = 'POOR';
  }

  const isEsportsGrade = totalSystemicLatencyMs <= 30;

  const lipSync: ILipSyncMetrics = {
    frameOffsetCount,
    severityRating,
    isEsportsGrade,
  };

  // Determine Primary Bottleneck
  const stages = [
    { name: 'Wireless Codec Transmission', val: codecLatencyMs },
    { name: 'OS Audio Stack', val: stackLatencyMs },
    { name: 'Audio Buffer Queue', val: bufferLatencyMs },
    { name: 'Hardware DAC / ANC DSP Processing', val: dacLatencyMs },
    { name: 'Display Frame Refresh Interval', val: displayFramePeriodMs },
  ];
  stages.sort((a, b) => b.val - a.val);
  const primaryBottleneck = stages[0].name;

  // Build actionable recommendations
  const recommendations: string[] = [];

  if (input.protocol === 'BLUETOOTH_SBC' || input.protocol === 'BLUETOOTH_AAC' || input.protocol === 'BLUETOOTH_LDAC') {
    recommendations.push(
      'Switch to a 2.4GHz RF USB dongle or LC3/aptX-LL Low Latency Bluetooth codec to cut codec transmission delay by over 100ms.'
    );
  }

  if (input.audioStack === 'WINDOWS_WASAPI_SHARED') {
    recommendations.push(
      'Enable WASAPI Exclusive Mode or ASIO audio driver routing to bypass Windows mixer buffer overhead and reduce OS stack delay.'
    );
  }

  if (input.bufferSizeSamples >= 512) {
    recommendations.push(
      `Decrease audio buffer size from ${input.bufferSizeSamples} to 128 or 256 samples to minimize audio buffer queue latency.`
    );
  }

  if (input.ancEnabled) {
    recommendations.push(
      'Disable Active Noise Cancellation (ANC) during competitive gameplay to eliminate DSP filtering processing delay (~12ms).'
    );
  }

  if (input.displayFps <= 60) {
    recommendations.push(
      'Upgrade to a higher display refresh rate (144Hz, 240Hz, or 540Hz) to reduce display frame period lag.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Your audio-visual signal pipeline is highly optimized for low-latency gaming performance.');
  }

  return {
    breakdown,
    lipSync,
    primaryBottleneck,
    recommendations,
    disclaimer: ENGINEERING_DISCLAIMER,
  };
}

export const WirelessLatencyEngine = {
  calculateWirelessLatency,
  calculateBufferLatencyMs,
  estimateCodecLatency(codecKey: string) {
    let protocol: WirelessProtocol = 'BLUETOOTH_SBC';
    if (codecKey === 'RF_24GHZ' || codecKey === 'RF_2_4GHZ_DONGLE') protocol = 'RF_2_4GHZ_DONGLE';
    else if (codecKey === 'BLUETOOTH_APTX_LL') protocol = 'BLUETOOTH_APTX_LL';
    else if (codecKey === 'BLUETOOTH_AAC') protocol = 'BLUETOOTH_AAC';
    else if (codecKey === 'BLUETOOTH_SBC') protocol = 'BLUETOOTH_SBC';
    else if (codecKey === 'BLUETOOTH_LDAC') protocol = 'BLUETOOTH_LDAC';

    const result = calculateWirelessLatency({
      protocol,
      audioStack: 'MACOS_COREAUDIO',
      bufferSizeSamples: 256,
      sampleRateHz: 48000,
      ancEnabled: false,
      displayFps: 144,
      rfInterferenceLevel: 'LOW',
    });
    return {
      typicalMs: result.breakdown.totalSystemicLatencyMs,
      recommendation: result.recommendations[0] || 'Optimized wireless setup.',
    };
  },
};

