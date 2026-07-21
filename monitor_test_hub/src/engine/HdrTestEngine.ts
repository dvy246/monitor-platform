/**
 * Display HDR Peak Brightness & Tone Mapping Clipping Engine
 * Pure math engine for PQ Curve (SMPTE ST 2084) EOTF conversions, 10-bit RGB color step calculation,
 * clipping nits threshold evaluation (100 to 4000 nits), tone mapping roll-off simulation (HGIG, static, dynamic, clip),
 * and Auto Brightness Limiter (ABL) window size brightness calculations.
 */

export type ToneMappingMode = 'hgig' | 'static' | 'dynamic' | 'clip';
export type HdrPanelType = 'qd-oled' | 'woled' | 'woled-mla' | 'mini-led-fald' | 'edge-lit-lcd';
export type PeakNitsPreset = 400 | 600 | 1000 | 1400 | 2000 | 4000;
export type PeakNits = '400' | '600' | '1000' | '1400' | '2000' | '4000';
export type AplWindowPct = 1 | 5 | 10 | 25 | 100;

export interface PqConversionResult {
  nits: number;
  pqSignal: number; // Normalized 0.0 to 1.0
  code10Bit: number; // Integer 0 to 1023
  code8Bit: number; // Integer 0 to 255
  normalizedRgb: [number, number, number];
  hexColor: string;
}

export interface ColorStepInfo {
  stepIndex: number;
  totalSteps: number;
  targetNits: number;
  effectiveNits: number;
  pqSignal: number;
  code10Bit: number;
  isClipped: boolean;
  hexColor: string;
}

export interface ToneMapResult {
  inputNits: number;
  outputNits: number;
  inputPqSignal: number;
  outputPqSignal: number;
  outputCode10Bit: number;
  kneeNits: number;
  isClipped: boolean;
  compressionRatioPct: number;
}

export interface ClippingThresholdResult {
  displayPeakNits: number;
  contentMaxNits: number;
  toneMappingMode: ToneMappingMode;
  clippingNitsThreshold: number;
  clippingPqSignal: number;
  clippingCode10Bit: number;
  headroomPct: number;
  clippingCategory: 'EARLY_CLIPPING' | 'ACCURATE_MATCH' | 'HIGH_HEADROOM';
}

export interface AblWindowBrightness {
  windowPct: AplWindowPct;
  sustainedNits: number;
  relativeBrightnessPct: number; // Relative to 10% peak
  ablThermalRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface HdrAnalysisSummary {
  displayPeakNits: number;
  contentMaxNits: number;
  toneMappingMode: ToneMappingMode;
  panelType: HdrPanelType;
  clipping: ClippingThresholdResult;
  colorSteps: ColorStepInfo[];
  ablWindows: AblWindowBrightness[];
}

export interface IPeakNitsConfig {
  nits: number;
  label: string;
  displayHdrTier: string;
  typicalPanel: string;
  recommendedAblWindow: string;
}

export interface IToneMappingConfig {
  id: ToneMappingMode;
  label: string;
  shortName: string;
  description: string;
  eotfBehavior: string;
}

// --- SMPTE ST 2084 PQ Constants ---
export const PQ_M1 = 2610 / 16384; // 0.1593017578125
export const PQ_M2 = 2523 / 32; // 78.84375
export const PQ_C1 = 3424 / 4096; // 0.8359375
export const PQ_C2 = 2413 / 128; // 18.8515625
export const PQ_C3 = 2392 / 128; // 18.6875
export const PQ_MAX_NITS = 10000.0;

export const PEAK_NITS_PRESETS: PeakNitsPreset[] = [400, 600, 1000, 1400, 2000, 4000];
export const TONE_MAPPING_MODES: ToneMappingMode[] = ['hgig', 'static', 'dynamic', 'clip'];
export const HDR_PANEL_TYPES: HdrPanelType[] = ['qd-oled', 'woled', 'woled-mla', 'mini-led-fald', 'edge-lit-lcd'];
export const APL_WINDOWS: AplWindowPct[] = [1, 5, 10, 25, 100];

export const PEAK_NITS_CONFIG: Record<PeakNits, IPeakNitsConfig> = {
  '400': { nits: 400, label: '400 Nits', displayHdrTier: 'DisplayHDR 400', typicalPanel: 'Entry LCD / IPS', recommendedAblWindow: '100% Full Screen' },
  '600': { nits: 600, label: '600 Nits', displayHdrTier: 'DisplayHDR 600 / True Black 600', typicalPanel: 'Mid-Tier OLED / IPS Pro', recommendedAblWindow: '10% Window' },
  '1000': { nits: 1000, label: '1000 Nits', displayHdrTier: 'DisplayHDR 1000', typicalPanel: 'Mini-LED / Gaming OLED', recommendedAblWindow: '5% - 10% Window' },
  '1400': { nits: 1400, label: '1400 Nits', displayHdrTier: 'DisplayHDR 1400', typicalPanel: 'QD-OLED / High-Peak Mini-LED', recommendedAblWindow: '2% - 5% Window' },
  '2000': { nits: 2000, label: '2000 Nits', displayHdrTier: 'DisplayHDR 2000 / Mastering', typicalPanel: 'Next-Gen Mini-LED / Dual-Layer LCD', recommendedAblWindow: '1% - 2% Window' },
  '4000': { nits: 4000, label: '4000 Nits', displayHdrTier: 'Mastering Reference (P3/Rec.2020)', typicalPanel: 'Reference Mastering Monitor', recommendedAblWindow: '1% Window' }
};

export const TONE_MAPPING_CONFIG: Record<ToneMappingMode, IToneMappingConfig> = {
  hgig: {
    id: 'hgig',
    label: 'HGiG (HDR Gaming Interest Group)',
    shortName: 'HGiG',
    description: 'Direct console/game tone mapping with strict hard clipping at display peak luminance.',
    eotfBehavior: 'Linear PQ tracking up to clip point; zero display roll-off curve.'
  },
  static: {
    id: 'static',
    label: 'Static EOTF Roll-Off',
    shortName: 'Static Roll-Off',
    description: 'Fixed knee curve compressing highlight details into display peak capabilities.',
    eotfBehavior: 'Smooth static S-curve roll-off starting at 60% PQ threshold.'
  },
  dynamic: {
    id: 'dynamic',
    label: 'Dynamic Tone Mapping (DTM)',
    shortName: 'Dynamic DTM',
    description: 'Real-time frame metadata analysis actively compressing highlight ranges.',
    eotfBehavior: 'Adaptive frame-by-frame EOTF knee curve transformation.'
  },
  clip: {
    id: 'clip',
    label: 'Hard Truncation Clipping',
    shortName: 'Hard Clipping',
    description: 'Direct signal clipping above peak nits threshold without compression curve.',
    eotfBehavior: 'Immediate flatline ceiling at target peak nits.'
  }
};

export function getAllPeakNits(): PeakNits[] {
  return ['400', '600', '1000', '1400', '2000', '4000'];
}

export function getAllToneMappings(): ToneMappingMode[] {
  return ['hgig', 'static', 'dynamic', 'clip'];
}

export function sanitizePeakNits(raw: string | number | undefined): PeakNits {
  const str = String(raw);
  if ((getAllPeakNits() as string[]).includes(str)) {
    return str as PeakNits;
  }
  return '1000';
}

export function sanitizeToneMapping(raw: string | undefined): ToneMappingMode {
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase() as ToneMappingMode;
    if (TONE_MAPPING_MODES.includes(normalized)) return normalized;
  }
  return 'hgig';
}

/**
 * Sanitizes input luminance nits into valid range [0, 10000]
 */
export function sanitizeNits(nits: unknown, defaultNits = 1000): number {
  if (typeof nits === 'number' && Number.isFinite(nits)) {
    return Math.max(0, Math.min(PQ_MAX_NITS, nits));
  }
  if (typeof nits === 'string') {
    const parsed = parseFloat(nits);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.min(PQ_MAX_NITS, parsed));
    }
  }
  return defaultNits;
}

/**
 * Sanitizes tone mapping mode
 */
export function sanitizeToneMappingMode(mode: unknown): ToneMappingMode {
  return sanitizeToneMapping(typeof mode === 'string' ? mode : undefined);
}

/**
 * Sanitizes HDR panel type
 */
export function sanitizeHdrPanelType(panel: unknown): HdrPanelType {
  if (typeof panel === 'string') {
    const normalized = panel.trim().toLowerCase() as HdrPanelType;
    if (HDR_PANEL_TYPES.includes(normalized)) return normalized;
  }
  return 'qd-oled';
}

/**
 * Forward EOTF: Converts absolute luminance in nits to normalized PQ signal value E' [0.0, 1.0]
 */
export function nitsToPqSignal(nits: number): number {
  const safeNits = Math.max(0, Math.min(PQ_MAX_NITS, Number.isFinite(nits) ? nits : 0));
  if (safeNits <= 0) return 0.0;
  
  const Y = safeNits / PQ_MAX_NITS;
  const Ym1 = Math.pow(Y, PQ_M1);
  const num = PQ_C1 + PQ_C2 * Ym1;
  const den = 1.0 + PQ_C3 * Ym1;
  const pqSignal = Math.pow(num / den, PQ_M2);
  
  return Math.max(0.0, Math.min(1.0, Number.isFinite(pqSignal) ? pqSignal : 0.0));
}

/**
 * Inverse EOTF: Converts normalized PQ signal value E' [0.0, 1.0] back to luminance in nits
 */
export function pqSignalToNits(pqSignal: number): number {
  const safeSignal = Math.max(0.0, Math.min(1.0, Number.isFinite(pqSignal) ? pqSignal : 0.0));
  if (safeSignal <= 0.0) return 0.0;
  if (safeSignal >= 1.0) return PQ_MAX_NITS;

  const Em2 = Math.pow(safeSignal, 1.0 / PQ_M2);
  const num = Math.max(0.0, Em2 - PQ_C1);
  const den = PQ_C2 - PQ_C3 * Em2;
  if (den <= 0) return PQ_MAX_NITS;

  const Y = Math.pow(num / den, 1.0 / PQ_M1);
  const nits = Y * PQ_MAX_NITS;

  return Math.max(0.0, Math.min(PQ_MAX_NITS, Number.isFinite(nits) ? nits : 0.0));
}

/**
 * Converts luminance nits to 10-bit code value (0 to 1023) and color metadata
 */
export function nitsTo10BitColor(nits: number): PqConversionResult {
  const safeNits = sanitizeNits(nits);
  const pqSignal = nitsToPqSignal(safeNits);
  const code10Bit = Math.round(pqSignal * 1023.0);
  const code8Bit = Math.round(pqSignal * 255.0);

  const hexVal = Math.min(255, Math.max(0, code8Bit)).toString(16).padStart(2, '0');
  const hexColor = `#${hexVal}${hexVal}${hexVal}`;

  return {
    nits: Number(safeNits.toFixed(2)),
    pqSignal: Number(pqSignal.toFixed(6)),
    code10Bit: Math.min(1023, Math.max(0, code10Bit)),
    code8Bit: Math.min(255, Math.max(0, code8Bit)),
    normalizedRgb: [pqSignal, pqSignal, pqSignal],
    hexColor
  };
}

/**
 * Simulates tone mapping roll-off for a given input luminance (nits)
 */
export function simulateToneMap(
  inputNits: number,
  displayPeakNits: number,
  contentMaxNits = 4000,
  mode: ToneMappingMode = 'hgig',
  aplPct = 10
): ToneMapResult {
  const safeIn = sanitizeNits(inputNits);
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeContentMax = Math.max(safePeak, sanitizeNits(contentMaxNits, 4000));
  const safeMode = sanitizeToneMappingMode(mode);
  const safeApl = Math.max(1, Math.min(100, Number.isFinite(aplPct) ? aplPct : 10));

  let kneeNits = safePeak;
  let outputNits = safeIn;

  if (safeMode === 'hgig' || safeMode === 'clip') {
    // Hard-clip at display peak nits
    kneeNits = safePeak;
    outputNits = Math.min(safeIn, safePeak);
  } else if (safeMode === 'static') {
    // Static soft-knee roll-off starting at 65% of display peak nits
    kneeNits = safePeak * 0.65;
    if (safeIn <= kneeNits) {
      outputNits = safeIn;
    } else {
      const t = Math.min(1.0, (safeIn - kneeNits) / Math.max(1, safeContentMax - kneeNits));
      const compressionFactor = t * (1.0 - 0.5 * t); // Smooth quadratic curve
      outputNits = kneeNits + compressionFactor * (safePeak - kneeNits);
    }
  } else {
    // Dynamic APL-adaptive tone mapping curve
    const aplFactor = safeApl / 100.0;
    const adaptiveKneeRatio = 0.85 - 0.45 * aplFactor; // 0.85 at 1% APL, 0.40 at 100% APL
    kneeNits = safePeak * adaptiveKneeRatio;
    if (safeIn <= kneeNits) {
      outputNits = safeIn;
    } else {
      const t = Math.min(1.0, (safeIn - kneeNits) / Math.max(1, safeContentMax - kneeNits));
      const dynamicRollOff = (1.0 - Math.exp(-2.0 * t)) / (1.0 - Math.exp(-2.0));
      outputNits = kneeNits + dynamicRollOff * (safePeak - kneeNits);
    }
  }

  outputNits = Math.min(safePeak, Math.max(0, outputNits));

  const inputPqSignal = nitsToPqSignal(safeIn);
  const outputPqSignal = nitsToPqSignal(outputNits);
  const outputCode10Bit = Math.round(outputPqSignal * 1023.0);
  const isClipped = outputNits >= safePeak * 0.995;

  const compressionRatioPct = safeIn > 0 
    ? Number((((safeIn - outputNits) / safeIn) * 100).toFixed(1))
    : 0;

  return {
    inputNits: Number(safeIn.toFixed(2)),
    outputNits: Number(outputNits.toFixed(2)),
    inputPqSignal: Number(inputPqSignal.toFixed(6)),
    outputPqSignal: Number(outputPqSignal.toFixed(6)),
    outputCode10Bit,
    kneeNits: Number(kneeNits.toFixed(2)),
    isClipped,
    compressionRatioPct
  };
}

/**
 * Calculates tone mapping clipping nits threshold
 */
export function calculateClippingThreshold(
  displayPeakNits: number,
  contentMaxNits = 4000,
  mode: ToneMappingMode = 'hgig'
): ClippingThresholdResult {
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeContentMax = sanitizeNits(contentMaxNits, 4000);
  const safeMode = sanitizeToneMappingMode(mode);

  let clippingNitsThreshold = safePeak;
  if (safeMode === 'static') {
    clippingNitsThreshold = Math.max(safePeak, safeContentMax * 0.95);
  } else if (safeMode === 'dynamic') {
    clippingNitsThreshold = Math.max(safePeak, safeContentMax * 0.90);
  } else {
    clippingNitsThreshold = Math.min(safePeak, safeContentMax);
  }

  const clippingPqSignal = nitsToPqSignal(clippingNitsThreshold);
  const clippingCode10Bit = Math.round(clippingPqSignal * 1023.0);
  const headroomPct = safeContentMax > 0
    ? Number((((safeContentMax - clippingNitsThreshold) / safeContentMax) * 100).toFixed(1))
    : 0;

  let clippingCategory: ClippingThresholdResult['clippingCategory'] = 'ACCURATE_MATCH';
  if (clippingNitsThreshold < safePeak * 0.9) {
    clippingCategory = 'EARLY_CLIPPING';
  } else if (clippingNitsThreshold > safePeak * 1.5) {
    clippingCategory = 'HIGH_HEADROOM';
  }

  return {
    displayPeakNits: safePeak,
    contentMaxNits: safeContentMax,
    toneMappingMode: safeMode,
    clippingNitsThreshold: Number(clippingNitsThreshold.toFixed(2)),
    clippingPqSignal: Number(clippingPqSignal.toFixed(6)),
    clippingCode10Bit,
    headroomPct,
    clippingCategory
  };
}

/**
 * Generates N discrete 10-bit color gradient steps from min to max nits
 */
export function calculateColorSteps(
  displayPeakNits: number,
  stepCount = 16,
  mode: ToneMappingMode = 'hgig',
  maxNits = 4000
): ColorStepInfo[] {
  const count = Math.max(2, Math.min(64, stepCount));
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeMax = Math.max(safePeak, sanitizeNits(maxNits, 4000));

  const steps: ColorStepInfo[] = [];
  const startPq = nitsToPqSignal(100);
  const endPq = nitsToPqSignal(safeMax);

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const stepPq = startPq + t * (endPq - startPq);
    const targetNits = pqSignalToNits(stepPq);

    const tmResult = simulateToneMap(targetNits, safePeak, safeMax, mode);
    const colorInfo = nitsTo10BitColor(tmResult.outputNits);

    steps.push({
      stepIndex: i,
      totalSteps: count,
      targetNits: Number(targetNits.toFixed(2)),
      effectiveNits: tmResult.outputNits,
      pqSignal: tmResult.outputPqSignal,
      code10Bit: tmResult.outputCode10Bit,
      isClipped: tmResult.isClipped,
      hexColor: colorInfo.hexColor
    });
  }

  return steps;
}

/**
 * Computes Auto Brightness Limiter (ABL) luminance across window sizes (1%, 5%, 10%, 25%, 100%)
 */
export function calculateAblWindows(
  displayPeakNits: number,
  panelType: HdrPanelType = 'qd-oled'
): AblWindowBrightness[] {
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safePanel = sanitizeHdrPanelType(panelType);

  const panelParams: Record<HdrPanelType, { alpha: number; beta: number; smallWindowBoost: number }> = {
    'qd-oled': { alpha: 0.45, beta: 0.25, smallWindowBoost: 0.15 },
    'woled': { alpha: 0.50, beta: 0.18, smallWindowBoost: 0.20 },
    'woled-mla': { alpha: 0.48, beta: 0.20, smallWindowBoost: 0.25 },
    'mini-led-fald': { alpha: 0.20, beta: 0.55, smallWindowBoost: 0.10 },
    'edge-lit-lcd': { alpha: 0.05, beta: 0.85, smallWindowBoost: 0.02 }
  };

  const { alpha, beta, smallWindowBoost } = panelParams[safePanel];

  return APL_WINDOWS.map((win) => {
    let sustainedNits = safePeak;

    if (win <= 10) {
      const boostFactor = 1.0 + smallWindowBoost * ((10 - win) / 9.0);
      sustainedNits = safePeak * boostFactor;
    } else {
      const x = (win - 10) / 90.0;
      const decayFactor = beta + (1.0 - beta) * Math.pow(1.0 - x, alpha);
      sustainedNits = safePeak * decayFactor;
    }

    sustainedNits = Math.max(50, Number(sustainedNits.toFixed(2)));
    const relativeBrightnessPct = Number(((sustainedNits / safePeak) * 100).toFixed(1));

    let ablThermalRisk: AblWindowBrightness['ablThermalRisk'] = 'LOW';
    if (relativeBrightnessPct < 30) {
      ablThermalRisk = 'CRITICAL';
    } else if (relativeBrightnessPct < 50) {
      ablThermalRisk = 'HIGH';
    } else if (relativeBrightnessPct < 80) {
      ablThermalRisk = 'MODERATE';
    }

    return {
      windowPct: win,
      sustainedNits,
      relativeBrightnessPct,
      ablThermalRisk
    };
  });
}

/**
 * Calculates complete HDR analysis summary
 */
export function calculateHdrSummary(
  displayPeakNits: number,
  contentMaxNits = 4000,
  toneMappingMode: ToneMappingMode = 'hgig',
  panelType: HdrPanelType = 'qd-oled'
): HdrAnalysisSummary {
  const safePeak = sanitizeNits(displayPeakNits, 1000);
  const safeContentMax = Math.max(safePeak, sanitizeNits(contentMaxNits, 4000));
  const safeMode = sanitizeToneMappingMode(toneMappingMode);
  const safePanel = sanitizeHdrPanelType(panelType);

  return {
    displayPeakNits: safePeak,
    contentMaxNits: safeContentMax,
    toneMappingMode: safeMode,
    panelType: safePanel,
    clipping: calculateClippingThreshold(safePeak, safeContentMax, safeMode),
    colorSteps: calculateColorSteps(safePeak, 16, safeMode, safeContentMax),
    ablWindows: calculateAblWindows(safePeak, safePanel)
  };
}
