import { describe, it, expect } from 'vitest';
import {
  calculateOledBurnInRisk,
  getAllPanelTypes,
  getAllUsageTiers,
  getPanelLabel,
  getTierLabel,
  getTierHours,
  getTierStaticHours
} from './OledBurnInEngine';

describe('OledBurnInEngine', () => {
  it('returns valid lists of panel types and usage tiers including all panel keys', () => {
    const panels = getAllPanelTypes();
    expect(panels).toEqual(['qd-oled', 'woled', 'amoled', 'qd-oled-v1', 'qd-oled-v2', 'woled-meta', 'amoled-laptop']);
    
    const tiers = getAllUsageTiers();
    expect(tiers).toEqual(['light', 'moderate', 'heavy', 'extreme']);
  });

  it('provides correct labels and tier defaults', () => {
    expect(getPanelLabel('qd-oled')).toContain('Samsung QD-OLED Gen 1');
    expect(getPanelLabel('woled-meta')).toContain('LG Display WOLED META');
    expect(getTierLabel('light')).toContain('Light Usage');
    expect(getTierHours('heavy')).toBe(7500);
    expect(getTierStaticHours('extreme')).toBe(12);
  });

  it('calculates minimal risk for low hours on WOLED META panel', () => {
    const res = calculateOledBurnInRisk({
      panelType: 'woled-meta',
      usageHours: 500,
      staticElementHoursPerDay: 2,
      averageNits: 150
    });
    expect(res.riskCategory).toBe('MINIMAL');
    expect(res.estimatedLuminanceRetentionPct).toBeGreaterThan(95);
    expect(res.retentionDecayRatePct).toBeLessThan(5);
  });

  it('calculates elevated/high risk for heavy usage on QD-OLED Gen 1 panel', () => {
    const res = calculateOledBurnInRisk({
      panelType: 'qd-oled',
      usageHours: 8000,
      staticElementHoursPerDay: 10,
      averageNits: 300
    });
    expect(['ELEVATED', 'HIGH_RISK']).toContain(res.riskCategory);
    expect(res.riskScore).toBeGreaterThan(50);
  });

  it('calculates risk based on usageTier parameter', () => {
    const lightRes = calculateOledBurnInRisk({
      panelType: 'woled-meta',
      usageTier: 'light'
    });
    expect(lightRes.riskCategory).toBe('MINIMAL');
    expect(lightRes.hoursEvaluated).toBe(1000);

    const extremeRes = calculateOledBurnInRisk({
      panelType: 'qd-oled',
      usageTier: 'extreme'
    });
    expect(['ELEVATED', 'HIGH_RISK']).toContain(extremeRes.riskCategory);
    expect(extremeRes.hoursEvaluated).toBe(15000);
  });

  it('handles edge cases safely (0 hours, high hours, invalid strings)', () => {
    const zeroRes = calculateOledBurnInRisk({
      panelType: 'unknown-panel' as any,
      usageHours: 0,
      staticElementHoursPerDay: 0
    });
    expect(zeroRes.riskScore).toBe(0);
    expect(zeroRes.estimatedLuminanceRetentionPct).toBe(100);
    expect(zeroRes.retentionDecayRatePct).toBe(0);

    const maxRes = calculateOledBurnInRisk({
      panelType: 'amoled',
      usageHours: 30000,
      staticElementHoursPerDay: 24,
      averageNits: 500
    });
    expect(maxRes.riskScore).toBe(100);
    expect(maxRes.estimatedLuminanceRetentionPct).toBeGreaterThanOrEqual(60);
  });

  it('handles uppercase panel strings (e.g., QD-OLED, WOLED-META)', () => {
    const resUpper = calculateOledBurnInRisk({
      panelType: 'QD-OLED',
      usageHours: 2000
    });
    const resLower = calculateOledBurnInRisk({
      panelType: 'qd-oled',
      usageHours: 2000
    });
    expect(resUpper.panelTypeName).toBe('Samsung QD-OLED Gen 1');
    expect(resUpper.riskScore).toBe(resLower.riskScore);
    expect(getPanelLabel('WOLED-META')).toBe('LG Display WOLED META / MLA');
    expect(getPanelLabel('AMOLED-LAPTOP')).toBe('AMOLED Mobile / Laptop Panel');
  });

  it('handles unknown panel strings gracefully', () => {
    const res = calculateOledBurnInRisk({
      panelType: 'unknown-panel-xyz',
      usageHours: 1000
    });
    expect(res.panelTypeName).toBe('Standard OLED Panel');
    expect(getPanelLabel('random-type')).toBe('Standard OLED Panel');
  });

  it('handles Infinity and NaN inputs for usageHours, staticElementHoursPerDay, and averageNits', () => {
    const nanRes = calculateOledBurnInRisk({
      panelType: 'qd-oled-v2',
      usageHours: NaN,
      staticElementHoursPerDay: NaN,
      averageNits: NaN
    });
    expect(Number.isFinite(nanRes.riskScore)).toBe(true);
    expect(Number.isFinite(nanRes.estimatedLuminanceRetentionPct)).toBe(true);
    expect(nanRes.hoursEvaluated).toBe(2000);

    const infRes = calculateOledBurnInRisk({
      panelType: 'woled',
      usageHours: Infinity,
      staticElementHoursPerDay: Infinity,
      averageNits: Infinity
    });
    expect(Number.isFinite(infRes.riskScore)).toBe(true);
    expect(Number.isFinite(infRes.estimatedLuminanceRetentionPct)).toBe(true);
    expect(infRes.estimatedLuminanceRetentionPct).toBeGreaterThanOrEqual(60);
    expect(infRes.estimatedLuminanceRetentionPct).toBeLessThanOrEqual(100);
  });

  it('evaluates all panel keys in getAllPanelTypes correctly', () => {
    const allPanels = getAllPanelTypes();
    expect(allPanels).toHaveLength(7);
    allPanels.forEach((panel) => {
      const label = getPanelLabel(panel);
      expect(label).not.toBe('Standard OLED Panel');
      const res = calculateOledBurnInRisk({ panelType: panel, usageHours: 2000 });
      expect(res.riskScore).toBeGreaterThanOrEqual(0);
      expect(res.estimatedLuminanceRetentionPct).toBeGreaterThanOrEqual(60);
    });
  });
});
