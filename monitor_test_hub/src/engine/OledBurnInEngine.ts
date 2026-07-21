/**
 * OLED Burn-In & Image Retention Risk Engine
 * Computes estimated luminance degradation based on cumulative usage hours,
 * panel generation (QD-OLED v1/v2, WOLED, WOLED META, AMOLED), and static element retention risk.
 */

export type PanelType = 'qd-oled' | 'woled' | 'amoled' | 'qd-oled-v1' | 'qd-oled-v2' | 'woled-meta' | 'amoled-laptop';
export type UsageTier = 'light' | 'moderate' | 'heavy' | 'extreme';

export interface OledRiskParams {
  panelType: PanelType | string;
  usageHours?: number;
  usageTier?: UsageTier | string;
  staticElementHoursPerDay?: number;
  averageNits?: number;
}

export interface OledRiskResult {
  riskScore: number; // 0 (Low) to 100 (Critical)
  estimatedLuminanceRetentionPct: number; // e.g. 98.4%
  retentionDecayRatePct: number; // e.g. 1.6%
  riskCategory: 'MINIMAL' | 'MODERATE' | 'ELEVATED' | 'HIGH_RISK';
  recommendedRefreshIntervalHours: number;
  panelTypeName: string;
  usageTierName: string;
  hoursEvaluated: number;
  staticHoursPerDayEvaluated: number;
}

const PANEL_TYPE_CONFIG: Record<string, { label: string; multiplier: number }> = {
  'qd-oled': { label: 'Samsung QD-OLED Gen 1', multiplier: 1.45 },
  'qd-oled-v1': { label: 'Samsung QD-OLED Gen 1', multiplier: 1.45 },
  'qd-oled-v2': { label: 'Samsung QD-OLED Gen 2/3', multiplier: 1.10 },
  'woled': { label: 'Standard WOLED', multiplier: 1.25 },
  'woled-meta': { label: 'LG Display WOLED META / MLA', multiplier: 0.95 },
  'amoled': { label: 'AMOLED Mobile / Laptop Panel', multiplier: 1.55 },
  'amoled-laptop': { label: 'AMOLED Mobile / Laptop Panel', multiplier: 1.55 }
};

const USAGE_TIER_CONFIG: Record<string, { label: string; hours: number; staticHours: number }> = {
  light: { label: 'Light Usage (1,000h)', hours: 1000, staticHours: 2 },
  moderate: { label: 'Moderate Usage (3,500h)', hours: 3500, staticHours: 5 },
  heavy: { label: 'Heavy Usage (7,500h)', hours: 7500, staticHours: 8 },
  extreme: { label: 'Extreme Usage (15,000h)', hours: 15000, staticHours: 12 }
};

export function getAllPanelTypes(): PanelType[] {
  return ['qd-oled', 'woled', 'amoled', 'qd-oled-v1', 'qd-oled-v2', 'woled-meta', 'amoled-laptop'];
}

export function getAllUsageTiers(): UsageTier[] {
  return ['light', 'moderate', 'heavy', 'extreme'];
}

export function getPanelLabel(panelType: string): string {
  const key = typeof panelType === 'string' ? panelType.toLowerCase() : '';
  return PANEL_TYPE_CONFIG[key]?.label || 'Standard OLED Panel';
}

export function getTierLabel(usageTier: string): string {
  const key = typeof usageTier === 'string' ? usageTier.toLowerCase() : '';
  return USAGE_TIER_CONFIG[key]?.label || 'Custom Usage';
}

export function getTierHours(usageTier: string): number {
  const key = typeof usageTier === 'string' ? usageTier.toLowerCase() : '';
  return USAGE_TIER_CONFIG[key]?.hours || 3500;
}

export function getTierStaticHours(usageTier: string): number {
  const key = typeof usageTier === 'string' ? usageTier.toLowerCase() : '';
  return USAGE_TIER_CONFIG[key]?.staticHours || 5;
}

export function calculateOledBurnInRisk(params: OledRiskParams): OledRiskResult {
  const rawPanelKey = typeof params.panelType === 'string' ? params.panelType.toLowerCase() : '';
  const panelKey = rawPanelKey || 'qd-oled-v2';
  const panelConfig = PANEL_TYPE_CONFIG[panelKey] || { label: 'Standard OLED Panel', multiplier: 1.20 };
  
  const rawTierKey = typeof params.usageTier === 'string' ? params.usageTier.toLowerCase() : undefined;
  const tierKey = rawTierKey && USAGE_TIER_CONFIG[rawTierKey] ? rawTierKey : undefined;
  const defaultHours = tierKey ? USAGE_TIER_CONFIG[tierKey].hours : 2000;
  const defaultStaticHours = tierKey ? USAGE_TIER_CONFIG[tierKey].staticHours : 6;

  const rawHours = typeof params.usageHours === 'number' && Number.isFinite(params.usageHours)
    ? params.usageHours
    : defaultHours;
  const usageHours = Math.max(0, rawHours);

  const rawStaticHours = typeof params.staticElementHoursPerDay === 'number' && Number.isFinite(params.staticElementHoursPerDay)
    ? params.staticElementHoursPerDay
    : defaultStaticHours;
  const staticElementHoursPerDay = Math.max(0, Math.min(24, rawStaticHours));

  const rawNits = typeof params.averageNits === 'number' && Number.isFinite(params.averageNits)
    ? params.averageNits
    : 200;
  const averageNits = Math.max(50, rawNits);

  const mult = panelConfig.multiplier;
  const staticRatio = Math.min(1.0, staticElementHoursPerDay / 12);
  const nitRatio = Math.min(2.0, averageNits / 200);

  // Cumulative wear units based on hours, panel tech, static content ratio, and luminance nits
  const totalWearUnits = (usageHours / 1000) * mult * (1 + staticRatio * 0.8) * nitRatio;

  // Risk Score (0 - 100)
  const riskScore = Math.min(100, Math.round(totalWearUnits * 12.5));

  // Estimated luminance retention percentage (bounded between 60.0% and 100.0%)
  const rawRetention = 100 - totalWearUnits * 1.8;
  const clampedRetention = Math.min(100, Math.max(60, Number.isFinite(rawRetention) ? rawRetention : 60));
  const retentionPct = Number(clampedRetention.toFixed(1));
  const decayRatePct = Number((100 - retentionPct).toFixed(1));

  let riskCategory: OledRiskResult['riskCategory'] = 'MINIMAL';
  if (riskScore > 75) {
    riskCategory = 'HIGH_RISK';
  } else if (riskScore > 50) {
    riskCategory = 'ELEVATED';
  } else if (riskScore > 25) {
    riskCategory = 'MODERATE';
  }

  const recommendedRefreshIntervalHours = Math.max(4, Math.round(16 - riskScore * 0.1));

  return {
    riskScore,
    estimatedLuminanceRetentionPct: retentionPct,
    retentionDecayRatePct: decayRatePct,
    riskCategory,
    recommendedRefreshIntervalHours,
    panelTypeName: panelConfig.label,
    usageTierName: tierKey ? USAGE_TIER_CONFIG[tierKey].label : 'Custom Usage',
    hoursEvaluated: usageHours,
    staticHoursPerDayEvaluated: staticElementHoursPerDay
  };
}
