import { describe, it, expect } from 'vitest';
import { TvViewingDistanceEngine } from './TvViewingDistanceEngine';

describe('TvViewingDistanceEngine Unit Tests', () => {
  it('should calculate accurate physical dimensions for 65 inch 16:9 screen', () => {
    const dims = TvViewingDistanceEngine.calculateDimensions(65, '16:9');

    expect(dims.widthInches).toBeCloseTo(56.7, 1);
    expect(dims.heightInches).toBeCloseTo(31.9, 1);
    expect(dims.areaSqInches).toBeGreaterThan(1800);
  });

  it('should calculate THX viewing distance correctly for 65 inch TV', () => {
    const result = TvViewingDistanceEngine.calculateViewingDistance(65, '4K');

    // 65 / 0.833 / 12 = ~6.5 feet
    expect(result.idealThxDistanceFeet).toBeCloseTo(6.5, 1);
    expect(result.minDistanceFeet).toBeLessThan(result.idealThxDistanceFeet);
    expect(result.maxDistanceFeet).toBeGreaterThan(result.idealThxDistanceFeet);
  });

  it('should calculate projector throw distance when throw ratio is provided', () => {
    const result = TvViewingDistanceEngine.calculateViewingDistance(120, '4K', '16:9', undefined, 1.2);

    expect(result.projectorThrowMinFeet).toBeDefined();
    expect(result.projectorThrowMinFeet).toBeGreaterThan(10);
  });
});
