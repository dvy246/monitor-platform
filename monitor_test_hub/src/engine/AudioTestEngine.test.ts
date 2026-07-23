import { describe, it, expect } from 'vitest';
import { AudioTestEngine } from './AudioTestEngine';

describe('AudioTestEngine', () => {
    describe('calculateLogarithmicSweep', () => {
        it('calculates full range sweep correctly', () => {
            expect(AudioTestEngine.calculateFullRangeSweep(10, 0)).toBeCloseTo(20);
            expect(AudioTestEngine.calculateFullRangeSweep(10, 10)).toBeCloseTo(20000);
            // Midpoint should be around 632.45 Hz
            expect(AudioTestEngine.calculateFullRangeSweep(10, 5)).toBeCloseTo(632.45, 1);
        });

        it('calculates subwoofer sweep correctly', () => {
            expect(AudioTestEngine.calculateSubwooferSweep(10, 0)).toBeCloseTo(20);
            expect(AudioTestEngine.calculateSubwooferSweep(10, 10)).toBeCloseTo(120);
        });
    });

    describe('calculateChannelBalanceDelta', () => {
        it('calculates correct delta', () => {
            expect(AudioTestEngine.calculateChannelBalanceDelta(1, 1)).toBeCloseTo(0);
            expect(AudioTestEngine.calculateChannelBalanceDelta(1, 0.5)).toBeCloseTo(6.02, 2);
            expect(AudioTestEngine.calculateChannelBalanceDelta(0.5, 1)).toBeCloseTo(-6.02, 2);
        });

        it('handles silence', () => {
            expect(AudioTestEngine.calculateChannelBalanceDelta(0, 0)).toBe(0);
            expect(AudioTestEngine.calculateChannelBalanceDelta(1, 0)).toBe(Infinity);
            expect(AudioTestEngine.calculateChannelBalanceDelta(0, 1)).toBe(-Infinity);
        });
    });

    describe('getPhaseMultipliers', () => {
        it('returns in-phase multipliers', () => {
            expect(AudioTestEngine.getPhaseMultipliers(true)).toEqual({ leftMultiplier: 1, rightMultiplier: 1 });
        });
        it('returns out-of-phase multipliers', () => {
            expect(AudioTestEngine.getPhaseMultipliers(false)).toEqual({ leftMultiplier: 1, rightMultiplier: -1 });
        });
    });

    describe('calculateOscillatorAmplitude', () => {
        it('calculates sine wave', () => {
            expect(AudioTestEngine.calculateOscillatorAmplitude('sine', 1, 0)).toBeCloseTo(0);
            expect(AudioTestEngine.calculateOscillatorAmplitude('sine', 1, 0.25)).toBeCloseTo(1);
            expect(AudioTestEngine.calculateOscillatorAmplitude('sine', 1, 0.75)).toBeCloseTo(-1);
        });

        it('calculates square wave', () => {
            expect(AudioTestEngine.calculateOscillatorAmplitude('square', 1, 0.25)).toBe(1);
            expect(AudioTestEngine.calculateOscillatorAmplitude('square', 1, 0.75)).toBe(-1);
        });

        it('calculates sawtooth wave', () => {
            expect(AudioTestEngine.calculateOscillatorAmplitude('sawtooth', 1, 0)).toBeCloseTo(-1);
            expect(AudioTestEngine.calculateOscillatorAmplitude('sawtooth', 1, 0.5)).toBeCloseTo(0);
            expect(AudioTestEngine.calculateOscillatorAmplitude('sawtooth', 1, 0.999)).toBeCloseTo(1, 1);
        });

        it('calculates triangle wave', () => {
            expect(AudioTestEngine.calculateOscillatorAmplitude('triangle', 1, 0)).toBeCloseTo(1);
            expect(AudioTestEngine.calculateOscillatorAmplitude('triangle', 1, 0.25)).toBeCloseTo(0);
            expect(AudioTestEngine.calculateOscillatorAmplitude('triangle', 1, 0.5)).toBeCloseTo(-1);
            expect(AudioTestEngine.calculateOscillatorAmplitude('triangle', 1, 0.75)).toBeCloseTo(0);
        });
    });

    describe('calculateRmsDbfs & evaluateSnrScore', () => {
        it('calculates RMS dBFS for a full scale sine wave', () => {
            // A sine wave of amplitude 1 has RMS 1/sqrt(2), so dBFS should be ~0
            const samples = Array.from({ length: 1000 }, (_, i) => Math.sin(2 * Math.PI * i / 1000));
            expect(AudioTestEngine.calculateRmsDbfs(samples)).toBeCloseTo(0, 1);
        });

        it('handles silence in RMS calculation', () => {
            expect(AudioTestEngine.calculateRmsDbfs([0, 0, 0])).toBe(-Infinity);
            expect(AudioTestEngine.calculateRmsDbfs([])).toBe(-Infinity);
        });

        it('evaluates SNR score', () => {
            expect(AudioTestEngine.evaluateSnrScore(-10, -60)).toBe('EXCELLENT'); // 50 dB SNR
            expect(AudioTestEngine.evaluateSnrScore(-10, -40)).toBe('GOOD'); // 30 dB SNR
            expect(AudioTestEngine.evaluateSnrScore(-10, -20)).toBe('POOR'); // 10 dB SNR
        });
    });

    describe('estimateLipSyncLatency', () => {
        it('calculates latency correctly', () => {
            expect(AudioTestEngine.estimateLipSyncLatency(1000, 1050)).toBe(50);
            expect(AudioTestEngine.estimateLipSyncLatency(1050, 1000)).toBe(0); // Should not be negative
        });
    });

    describe('calculateBinauralFrequencies & evaluateHearingRating', () => {
        it('calculates binaural frequencies correctly', () => {
            const resAlpha = AudioTestEngine.calculateBinauralFrequencies(200, 'alpha');
            expect(resAlpha.leftFreq).toBe(200);
            expect(resAlpha.rightFreq).toBe(210);
            expect(resAlpha.beatFreq).toBe(10);

            const resDelta = AudioTestEngine.calculateBinauralFrequencies(100, 'delta');
            expect(resDelta.leftFreq).toBe(100);
            expect(resDelta.rightFreq).toBe(102.5);
            expect(resDelta.beatFreq).toBe(2.5);
        });

        it('evaluates hearing rating correctly', () => {
            expect(AudioTestEngine.evaluateHearingRating(15)).toBe('NORMAL');
            expect(AudioTestEngine.evaluateHearingRating(35)).toBe('MILD_LOSS');
            expect(AudioTestEngine.evaluateHearingRating(55)).toBe('MODERATE_LOSS');
            expect(AudioTestEngine.evaluateHearingRating(85)).toBe('SEVERE_LOSS');
        });
    });
});

