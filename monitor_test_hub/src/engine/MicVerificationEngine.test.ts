import { describe, it, expect, beforeEach } from 'vitest';
import { MicVerificationEngine } from './MicVerificationEngine';

describe('MicVerificationEngine Test Suite', () => {
  let engine: MicVerificationEngine;

  beforeEach(() => {
    engine = new MicVerificationEngine();
  });

  it('evaluates significant acoustic improvement (+5 dB gain)', () => {
    const result = engine.evaluateRecovery(45.0, 50.0);
    expect(result.status).toBe('improved');
    expect(result.deltaDb).toBe(5.0);
    expect(result.recoveryPercentage).toBe(11);
    expect(result.recommendation).toContain('increased by +5 dB');
  });

  it('evaluates unchanged acoustic level (same dB)', () => {
    const result = engine.evaluateRecovery(50.0, 50.5);
    expect(result.status).toBe('unchanged');
    expect(result.deltaDb).toBe(0.5);
  });

  it('evaluates volume reduction gracefully', () => {
    const result = engine.evaluateRecovery(55.0, 50.0);
    expect(result.status).toBe('degraded');
    expect(result.deltaDb).toBe(-5.0);
  });

  it('handles zero initial preDb state safely', () => {
    const result = engine.evaluateRecovery(0, 45.0);
    expect(result.status).toBe('improved');
    expect(result.recoveryPercentage).toBe(0);
  });
});
