export type SnrScore = 'EXCELLENT' | 'GOOD' | 'POOR';

export class AudioTestEngine {
    /**
     * Solves for the frequency at a given time t in a logarithmic sweep.
     * AES17 compliant logarithmic frequency sweep.
     * Formula: f(t) = f_start * (f_end / f_start) ^ (t / duration)
     * @param startFreq Starting frequency in Hz (e.g., 20)
     * @param endFreq Ending frequency in Hz (e.g., 20000)
     * @param duration Total duration of the sweep in seconds
     * @param t Current time in seconds (0 <= t <= duration)
     * @returns Frequency at time t in Hz
     */
    static calculateLogarithmicSweep(startFreq: number, endFreq: number, duration: number, t: number): number {
        if (t <= 0) return startFreq;
        if (t >= duration) return endFreq;
        return startFreq * Math.pow((endFreq / startFreq), (t / duration));
    }

    /**
     * Wrapper for a standard AES17 20Hz-20kHz sweep.
     */
    static calculateFullRangeSweep(duration: number, t: number): number {
        return this.calculateLogarithmicSweep(20, 20000, duration, t);
    }

    /**
     * Subwoofer low-frequency sweep solver (20Hz to 120Hz).
     */
    static calculateSubwooferSweep(duration: number, t: number): number {
        return this.calculateLogarithmicSweep(20, 120, duration, t);
    }

    /**
     * L/R channel balance delta calculation (dB relative gain).
     * Calculates the dB difference between left and right channels given their linear amplitudes (0 to 1).
     * @param amplitudeL Left channel amplitude (0 to 1)
     * @param amplitudeR Right channel amplitude (0 to 1)
     * @returns Delta in dB. Positive if Left is louder, negative if Right is louder.
     */
    static calculateChannelBalanceDelta(amplitudeL: number, amplitudeR: number): number {
        const leftDb = amplitudeL > 0 ? 20 * Math.log10(amplitudeL) : -Infinity;
        const rightDb = amplitudeR > 0 ? 20 * Math.log10(amplitudeR) : -Infinity;
        
        if (leftDb === -Infinity && rightDb === -Infinity) return 0;
        if (leftDb === -Infinity) return -Infinity; // Right is infinitely louder
        if (rightDb === -Infinity) return Infinity; // Left is infinitely louder
        
        return leftDb - rightDb;
    }

    /**
     * Phase inversion signal generator logic (in-phase vs out-of-phase stereo alignment).
     * Returns phase multipliers for left and right channels.
     * @param isInPhase true for in-phase, false for out-of-phase (180 degree phase shift on right channel)
     */
    static getPhaseMultipliers(isInPhase: boolean): { leftMultiplier: number, rightMultiplier: number } {
        return {
            leftMultiplier: 1,
            rightMultiplier: isInPhase ? 1 : -1
        };
    }

    /**
     * Parametric oscillator frequency calculation (Sine, Square, Sawtooth, Triangle waveforms).
     * Returns the instantaneous amplitude of a waveform at time t.
     * @param type Waveform type
     * @param frequency Frequency in Hz
     * @param t Time in seconds
     * @returns Instantaneous amplitude (-1 to 1)
     */
    static calculateOscillatorAmplitude(type: 'sine' | 'square' | 'sawtooth' | 'triangle', frequency: number, t: number): number {
        const period = 1 / frequency;
        const phase = (t % period) / period; // 0 to 1

        switch (type) {
            case 'sine':
                return Math.sin(2 * Math.PI * frequency * t);
            case 'square':
                return phase < 0.5 ? 1 : -1;
            case 'sawtooth':
                return 2 * phase - 1;
            case 'triangle':
                return 4 * Math.abs(phase - 0.5) - 1;
            default:
                return 0;
        }
    }

    /**
     * Calculates the RMS dBFS given an array of linear sample values (-1 to 1).
     * Based on IEC 61672-1 principles.
     */
    static calculateRmsDbfs(samples: number[]): number {
        if (samples.length === 0) return -Infinity;
        let sumSquares = 0;
        for (let i = 0; i < samples.length; i++) {
            sumSquares += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sumSquares / samples.length);
        if (rms === 0) return -Infinity;
        
        // 0 dBFS is typically a sine wave of peak amplitude 1, RMS = 1/sqrt(2)
        // dBFS = 20 * log10(rms / (1/sqrt(2))) = 20 * log10(rms * sqrt(2))
        return 20 * Math.log10(rms * Math.SQRT2);
    }

    /**
     * Calculates SNR score based on signal RMS dBFS and noise floor RMS dBFS.
     */
    static evaluateSnrScore(signalDbfs: number, noiseDbfs: number): SnrScore {
        const snr = signalDbfs - noiseDbfs;
        if (snr >= 40) return 'EXCELLENT';
        if (snr >= 20) return 'GOOD';
        return 'POOR';
    }

    /**
     * Lip-sync click-to-audio latency estimator.
     * @param clickTimestamp Timestamp of user click (ms)
     * @param audioStartTimestamp Timestamp of audio output start (ms)
     * @returns Latency in milliseconds
     */
    /**
     * Lip-sync click-to-audio latency estimator.
     * @param clickTimestamp Timestamp of user click (ms)
     * @param audioStartTimestamp Timestamp of audio output start (ms)
     * @returns Latency in milliseconds
     */
    static estimateLipSyncLatency(clickTimestamp: number, audioStartTimestamp: number): number {
        return Math.max(0, audioStartTimestamp - clickTimestamp);
    }

    /**
     * Binaural beats frequency solver.
     * Calculates Left & Right carrier frequencies for target brainwave states.
     * Delta (0.5-4Hz): Deep sleep & healing
     * Theta (4-8Hz): Meditation & REM sleep
     * Alpha (8-13Hz): Relaxation & focus
     * Beta (13-30Hz): Concentration & alertness
     * Gamma (30-100Hz): Peak cognition & memory
     */
    static calculateBinauralFrequencies(carrierFreq: number, targetState: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'): { leftFreq: number, rightFreq: number, beatFreq: number } {
        const beatFreqs: Record<string, number> = {
            delta: 2.5,
            theta: 6.0,
            alpha: 10.0,
            beta: 20.0,
            gamma: 40.0
        };
        const beat = beatFreqs[targetState] || 10.0;
        return {
            leftFreq: carrierFreq,
            rightFreq: carrierFreq + beat,
            beatFreq: beat
        };
    }

    /**
     * Hearing Audiogram threshold rating evaluator (ISO 8253-1).
     * @param averageThresholdDb Average hearing threshold in dB HL across 500Hz, 1kHz, 2kHz, 4kHz
     * @returns Rating string
     */
    static evaluateHearingRating(averageThresholdDb: number): 'NORMAL' | 'MILD_LOSS' | 'MODERATE_LOSS' | 'SEVERE_LOSS' {
        if (averageThresholdDb <= 25) return 'NORMAL';
        if (averageThresholdDb <= 40) return 'MILD_LOSS';
        if (averageThresholdDb <= 70) return 'MODERATE_LOSS';
        return 'SEVERE_LOSS';
    }
}

