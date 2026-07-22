/**
 * NEC 2026 Electrical Wire Gauge, Voltage Drop & Conduit Fill Engine
 * 
 * Implements NEC Table 310.16 conductor ampacity limits (Copper/Aluminum, 60°C/75°C/90°C),
 * voltage drop formula Vd = (2 * K * I * L) / CM, conduit fill volume percentages
 * (NEC Chapter 9 Table 1), and NEC 2026 code citations.
 */

export type ConductorMaterial = 'Copper' | 'Aluminum';
export type InsulationTemp = '60C' | '75C' | '90C';
export type ConduitType = 'EMT' | 'PVC-80' | 'RMC';

export interface WireSpec {
  awg: string; // e.g. "14 AWG", "12 AWG", "10 AWG", "8 AWG", "6 AWG", "4 AWG", "2 AWG", "1/0", "2/0", "4/0"
  circularMils: number;
  ampacity60C: number;
  ampacity75C: number;
  ampacity90C: number;
}

export interface WireGaugeResult {
  recommendedGauge: string;
  material: ConductorMaterial;
  amperage: number;
  voltage: number;
  distanceFeet: number;
  insulation: InsulationTemp;
  voltageDropVolts: number;
  voltageDropPercent: number;
  isVoltageDropAcceptable: boolean; // NEC recommendation: <= 3% branch circuit drop
  maxAmperageCapacity: number;
  necCitation: string;
  conduitFillRecommendation: string;
  explanation: string;
}

export class WireGaugeEngine {
  public static readonly AWG_SPECS: Record<string, WireSpec> = {
    '14': { awg: '14 AWG', circularMils: 4110, ampacity60C: 15, ampacity75C: 20, ampacity90C: 25 },
    '12': { awg: '12 AWG', circularMils: 6530, ampacity60C: 20, ampacity75C: 25, ampacity90C: 30 },
    '10': { awg: '10 AWG', circularMils: 10380, ampacity60C: 30, ampacity75C: 35, ampacity90C: 40 },
    '8':  { awg: '8 AWG',  circularMils: 16510, ampacity60C: 40, ampacity75C: 50, ampacity90C: 55 },
    '6':  { awg: '6 AWG',  circularMils: 26240, ampacity60C: 55, ampacity75C: 65, ampacity90C: 75 },
    '4':  { awg: '4 AWG',  circularMils: 41740, ampacity60C: 70, ampacity75C: 85, ampacity90C: 95 },
    '2':  { awg: '2 AWG',  circularMils: 66360, ampacity60C: 95, ampacity75C: 115, ampacity90C: 130 },
    '1/0':{ awg: '1/0 AWG',circularMils: 105600,ampacity60C: 125,ampacity75C: 150,ampacity90C: 170 },
    '2/0':{ awg: '2/0 AWG',circularMils: 133100,ampacity60C: 145,ampacity75C: 175,ampacity90C: 195 },
    '4/0':{ awg: '4/0 AWG',circularMils: 211600,ampacity60C: 195,ampacity75C: 230,ampacity90C: 260 }
  };

  /**
   * Recommends conductor gauge, evaluates voltage drop, and returns NEC 2026 citations.
   */
  public static calculateWireSizing(
    amperage: number,
    voltage: number = 120,
    distanceFeet: number = 50,
    material: ConductorMaterial = 'Copper',
    insulation: InsulationTemp = '75C'
  ): WireGaugeResult {
    // Breaker sizing ampacity threshold (NEC Table 310.16)
    const designAmperage = amperage;

    // 80% continuous load safety factor for branch circuit voltage drop calculation (NEC 210.20)
    const loadAmperage = amperage * 0.8;

    // K constant: Copper ~12.9, Aluminum ~21.2
    const kConstant = material === 'Copper' ? 12.9 : 21.2;

    // Find minimum gauge that satisfies ampacity
    const awgKeys = ['14', '12', '10', '8', '6', '4', '2', '1/0', '2/0', '4/0'];
    let selectedGaugeKey = '14';
    let maxCap = 15;

    for (const key of awgKeys) {
      const spec = this.AWG_SPECS[key];
      const cap = insulation === '60C' ? spec.ampacity60C : insulation === '75C' ? spec.ampacity75C : spec.ampacity90C;
      const adjustedCap = material === 'Aluminum' ? Math.round(cap * 0.8) : cap;

      if (adjustedCap >= designAmperage) {
        selectedGaugeKey = key;
        maxCap = adjustedCap;
        break;
      }
      selectedGaugeKey = key; // fallback to largest if none match
      maxCap = adjustedCap;
    }

    const selectedSpec = this.AWG_SPECS[selectedGaugeKey];

    // Calculate voltage drop: Vd = (2 * K * I * L) / CM using running loadAmperage
    let vDrop = (2 * kConstant * loadAmperage * distanceFeet) / selectedSpec.circularMils;
    let vDropPercent = (vDrop / voltage) * 100;

    // Upsize if voltage drop exceeds 3%
    if (vDropPercent > 3.0) {
      for (const key of awgKeys) {
        const spec = this.AWG_SPECS[key];
        const vdTest = (2 * kConstant * loadAmperage * distanceFeet) / spec.circularMils;
        const vdPctTest = (vdTest / voltage) * 100;
        if (vdPctTest <= 3.0 && spec.circularMils > selectedSpec.circularMils) {
          selectedGaugeKey = key;
          vDrop = vdTest;
          vDropPercent = vdPctTest;
          break;
        }
      }
    }

    const finalSpec = this.AWG_SPECS[selectedGaugeKey];
    const isAcceptable = vDropPercent <= 3.0;

    // Conduit fill recommendation
    let conduit = '1/2" EMT Conduit';
    if (['4', '2'].includes(selectedGaugeKey)) conduit = '3/4" EMT Conduit';
    else if (['1/0', '2/0', '4/0'].includes(selectedGaugeKey)) conduit = '1-1/2" EMT Conduit';

    const necCitation = `NEC Table 310.16 (${material} ${insulation}), NEC 210.19(A) Voltage Drop, NEC Chapter 9 Table 1 Conduit Fill`;

    const explanation = `For a ${amperage}A circuit at ${voltage}V over ${distanceFeet} ft, ${finalSpec.awg} ${material} is recommended. Voltage drop is ${vDrop.toFixed(2)}V (${vDropPercent.toFixed(1)}%), which is ${isAcceptable ? 'within' : 'exceeds'} the 3% NEC recommendation.`;

    return {
      recommendedGauge: finalSpec.awg,
      material,
      amperage,
      voltage,
      distanceFeet,
      insulation,
      voltageDropVolts: Math.round(vDrop * 100) / 100,
      voltageDropPercent: Math.round(vDropPercent * 10) / 10,
      isVoltageDropAcceptable: isAcceptable,
      maxAmperageCapacity: maxCap,
      necCitation,
      conduitFillRecommendation: conduit,
      explanation
    };
  }
}
