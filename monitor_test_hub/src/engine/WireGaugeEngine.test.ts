import { describe, it, expect } from 'vitest';
import { WireGaugeEngine } from './WireGaugeEngine';

describe('WireGaugeEngine Unit Tests', () => {
  it('should recommend 12 AWG for standard 20A circuit at 120V 50ft', () => {
    const result = WireGaugeEngine.calculateWireSizing(20, 120, 50, 'Copper', '75C');

    expect(result.recommendedGauge).toBe('12 AWG');
    expect(result.isVoltageDropAcceptable).toBe(true);
    expect(result.voltageDropPercent).toBeLessThan(3.0);
  });

  it('should recommend 10 AWG for 30A circuit at 240V', () => {
    const result = WireGaugeEngine.calculateWireSizing(30, 240, 75, 'Copper', '75C');

    expect(result.recommendedGauge).toBe('10 AWG');
  });

  it('should upsize wire gauge when voltage drop exceeds 3%', () => {
    // 20A at 120V over 250ft will suffer severe voltage drop on 12 AWG, requiring upsizing
    const result = WireGaugeEngine.calculateWireSizing(20, 120, 250, 'Copper', '75C');

    expect(result.recommendedGauge).not.toBe('14 AWG');
    expect(result.recommendedGauge).not.toBe('12 AWG');
    expect(result.necCitation).toContain('NEC');
  });
});
