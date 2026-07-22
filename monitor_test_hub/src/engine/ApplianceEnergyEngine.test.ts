import { describe, it, expect } from 'vitest';
import { ApplianceEnergyEngine } from './ApplianceEnergyEngine';

describe('ApplianceEnergyEngine Unit Tests', () => {
  it('should find US state rates by state code', () => {
    const ca = ApplianceEnergyEngine.getStateByCode('CA');
    const tx = ApplianceEnergyEngine.getStateByCode('TX');

    expect(ca.name).toBe('California');
    expect(ca.rateCentsPerKwh).toBe(32.5);
    expect(tx.name).toBe('Texas');
    expect(tx.rateCentsPerKwh).toBe(14.6);
  });

  it('should calculate cost accurately for space heater in California', () => {
    // Space heater: 1500W, 8 hours/day, 32.5 cents/kWh
    const result = ApplianceEnergyEngine.calculateCost('CA', 'space-heater');

    expect(result.dailyKwh).toBe(12); // (1500 * 8) / 1000 = 12 kWh
    expect(result.dailyCost).toBeCloseTo(3.9, 1); // 12 * 0.325 = $3.90
    expect(result.monthlyCost).toBeGreaterThan(110);
    expect(result.formattedMonthlyCost).toContain('$');
  });

  it('should support custom wattage and hours', () => {
    const result = ApplianceEnergyEngine.calculateCost('TX', 'gaming-pc', 800, 10);

    expect(result.watts).toBe(800);
    expect(result.dailyHours).toBe(10);
    expect(result.dailyKwh).toBe(8); // (800 * 10) / 1000 = 8 kWh
  });
});
