import { describe, it, expect } from 'vitest';
import {
  calculateWirelessLatency,
  calculateBufferLatencyMs,
  PROTOCOL_CODEC_LATENCY_MAP,
  AUDIO_STACK_LATENCY_MAP,
  ENGINEERING_DISCLAIMER,
  type IWirelessLatencyInput,
} from './WirelessLatencyEngine';

describe('WirelessLatencyEngine', () => {
  it('correctly calculates audio buffer queue latency', () => {
    // 512 samples at 48000 Hz = 512/48000 * 1000 = 10.6666... ms
    const bufMs = calculateBufferLatencyMs(512, 48000);
    expect(bufMs).toBeCloseTo(10.6667, 3);

    // 256 samples at 44100 Hz = 256/44100 * 1000 = 5.80498... ms
    const bufMs44k = calculateBufferLatencyMs(256, 44100);
    expect(bufMs44k).toBeCloseTo(5.805, 3);
  });

  it('handles invalid or zero buffer/sample rate inputs gracefully', () => {
    expect(calculateBufferLatencyMs(0, 48000)).toBe(0);
    expect(calculateBufferLatencyMs(512, 0)).toBe(0);
  });

  it('computes full systemic latency breakdown for low-latency wired setup', () => {
    const input: IWirelessLatencyInput = {
      protocol: 'USB_WIRED',
      audioStack: 'WINDOWS_WASAPI_EXCLUSIVE',
      bufferSizeSamples: 128,
      sampleRateHz: 48000,
      ancEnabled: false,
      displayFps: 240,
      rfInterferenceLevel: 'LOW',
    };

    const result = calculateWirelessLatency(input);

    expect(result.breakdown.codecLatencyMs).toBe(0.5);
    expect(result.breakdown.stackLatencyMs).toBe(3.0);
    expect(result.breakdown.bufferLatencyMs).toBeCloseTo(2.67, 2);
    expect(result.breakdown.dacLatencyMs).toBe(3.0);
    expect(result.breakdown.displayFramePeriodMs).toBeCloseTo(4.17, 2);

    // Total should be sum of stages: 0.5 + 3.0 + 2.67 + 3.0 + 4.17 = 13.34 ms
    expect(result.breakdown.totalSystemicLatencyMs).toBeLessThanOrEqual(20);
    expect(result.lipSync.isEsportsGrade).toBe(true);
    expect(result.lipSync.severityRating).toBe('EXCELLENT');
  });

  it('computes latency for high-lag Bluetooth setup (SBC codec, WASAPI Shared, 60Hz display)', () => {
    const input: IWirelessLatencyInput = {
      protocol: 'BLUETOOTH_SBC',
      audioStack: 'WINDOWS_WASAPI_SHARED',
      bufferSizeSamples: 512,
      sampleRateHz: 48000,
      ancEnabled: true,
      displayFps: 60,
      rfInterferenceLevel: 'HIGH',
    };

    const result = calculateWirelessLatency(input);

    expect(result.breakdown.codecLatencyMs).toBe(170);
    expect(result.breakdown.stackLatencyMs).toBe(20);
    expect(result.breakdown.dacLatencyMs).toBe(17); // 5 base + 12 ANC
    expect(result.breakdown.displayFramePeriodMs).toBeCloseTo(16.67, 2);

    // Total > 200ms -> UNPLAYABLE / POOR
    expect(result.breakdown.totalSystemicLatencyMs).toBeGreaterThan(200);
    expect(result.lipSync.isEsportsGrade).toBe(false);
    expect(result.lipSync.severityRating).toBe('UNPLAYABLE');
    expect(result.primaryBottleneck).toBe('Wireless Codec Transmission');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('evaluates lip-sync frame offset correctly at 540Hz', () => {
    const input: IWirelessLatencyInput = {
      protocol: 'RF_2_4GHZ_DONGLE',
      audioStack: 'MACOS_COREAUDIO',
      bufferSizeSamples: 256,
      sampleRateHz: 48000,
      ancEnabled: false,
      displayFps: 540,
      rfInterferenceLevel: 'LOW',
    };

    const result = calculateWirelessLatency(input);
    // Display period at 540Hz = 1000/540 = 1.8518 ms
    // Frame offset should be Math.ceil(totalMs / 1.8518)
    const expectedFrameOffset = Math.ceil(result.breakdown.totalSystemicLatencyMs / result.breakdown.displayFramePeriodMs);
    expect(result.lipSync.frameOffsetCount).toBe(expectedFrameOffset);
  });

  it('increases jitter variance under high RF interference', () => {
    const lowInput: IWirelessLatencyInput = {
      protocol: 'RF_2_4GHZ_DONGLE',
      audioStack: 'WINDOWS_WASAPI_EXCLUSIVE',
      bufferSizeSamples: 256,
      sampleRateHz: 48000,
      ancEnabled: false,
      displayFps: 144,
      rfInterferenceLevel: 'LOW',
    };

    const highInput: IWirelessLatencyInput = {
      ...lowInput,
      rfInterferenceLevel: 'HIGH',
    };

    const lowResult = calculateWirelessLatency(lowInput);
    const highResult = calculateWirelessLatency(highInput);

    expect(highResult.breakdown.jitterVarianceMs).toBeGreaterThan(lowResult.breakdown.jitterVarianceMs);
  });

  it('includes non-clinical engineering disclaimer', () => {
    const input: IWirelessLatencyInput = {
      protocol: 'BLUETOOTH_LC3',
      audioStack: 'ANDROID_AAUDIO',
      bufferSizeSamples: 256,
      sampleRateHz: 48000,
      ancEnabled: false,
      displayFps: 120,
      rfInterferenceLevel: 'MEDIUM',
    };

    const result = calculateWirelessLatency(input);
    expect(result.disclaimer).toBe(ENGINEERING_DISCLAIMER);
  });
});
