import { describe, it, expect } from 'vitest';
import { FilamentCostEngine } from './FilamentCostEngine';

describe('FilamentCostEngine Unit Tests', () => {
  it('should return valid material spec by ID', () => {
    const pla = FilamentCostEngine.getMaterialById('pla');
    const petg = FilamentCostEngine.getMaterialById('petg');

    expect(pla.densityGcm3).toBe(1.24);
    expect(petg.densityGcm3).toBe(1.27);
  });

  it('should calculate direct print cost accurately for 100g PLA 5 hour print', () => {
    // 100g PLA on $22 spool = $2.20 filament
    const result = FilamentCostEngine.calculateCost('pla', 100, 5, 22.00);

    expect(result.filamentCostUsd).toBe(2.20);
    expect(result.totalDirectCostUsd).toBeGreaterThan(2.20);
    expect(result.suggestedRetailPriceUsd).toBeGreaterThan(result.totalDirectCostUsd);
  });

  it('should calculate retail price and profit margin correctly', () => {
    const result = FilamentCostEngine.calculateCost('petg', 250, 10, 25.00);

    expect(result.suggestedRetailPriceUsd).toBeGreaterThan(result.totalDirectCostUsd);
    expect(result.profitMarginUsd).toBeGreaterThan(0);
  });
});
