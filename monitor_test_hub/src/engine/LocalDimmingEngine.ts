/**
 * LocalDimmingEngine.ts
 * Pure TypeScript calculation engine evaluating Mini-LED and FALD local dimming
 * blooming halos, black level retention, and dimming zone count estimates.
 * Standard: VESA DisplayHDR 1400 / True Black Halo Ratio Specs.
 */

export interface IHaloMetrics {
  targetLuminance: number;  // nits (e.g. 1000 nits)
  haloLuminance: number;    // nits surrounding halo
  haloRadiusPx: number;     // radius in pixels
  bloomingRatio: number;    // R_bloom = L_halo / L_target
  bloomingSeverity: 'NEGLIGIBLE' | 'MODERATE' | 'SEVERE';
}

export interface IZoneEstimate {
  horizontalZones: number;
  verticalZones: number;
  totalZones: number;
  zoneSizePx: { width: number; height: number };
}

/**
 * Calculates blooming halo ratio R_bloom = L_halo / L_target.
 * Threshold: > 0.05 is MODERATE blooming; > 0.15 is SEVERE.
 */
export function calculateHaloMetrics(
  targetLuminance: number,
  haloLuminance: number,
  haloRadiusPx: number
): IHaloMetrics {
  const safeTarget = Math.max(1, targetLuminance);
  const bloomingRatio = Number((haloLuminance / safeTarget).toFixed(4));

  let bloomingSeverity: 'NEGLIGIBLE' | 'MODERATE' | 'SEVERE' = 'NEGLIGIBLE';
  if (bloomingRatio > 0.15) {
    bloomingSeverity = 'SEVERE';
  } else if (bloomingRatio > 0.05) {
    bloomingSeverity = 'MODERATE';
  }

  return {
    targetLuminance: safeTarget,
    haloLuminance,
    haloRadiusPx,
    bloomingRatio,
    bloomingSeverity
  };
}

/**
 * Calculates estimated dimming zone count and zone dimensions.
 */
export function calculateDimmingZones(
  screenWidthPx: number,
  screenHeightPx: number,
  totalZonesEstimate: number = 1152
): IZoneEstimate {
  const aspectRatio = screenWidthPx / screenHeightPx;
  const verticalZones = Math.round(Math.sqrt(totalZonesEstimate / aspectRatio));
  const horizontalZones = Math.round(verticalZones * aspectRatio);
  const totalZones = horizontalZones * verticalZones;

  const zoneWidth = Math.round(screenWidthPx / horizontalZones);
  const zoneHeight = Math.round(screenHeightPx / verticalZones);

  return {
    horizontalZones,
    verticalZones,
    totalZones,
    zoneSizePx: { width: zoneWidth, height: zoneHeight }
  };
}
