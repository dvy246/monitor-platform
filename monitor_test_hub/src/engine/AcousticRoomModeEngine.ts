/**
 * AcousticRoomModeEngine.ts — Decoupled Pure-TypeScript Room Mode & Standing Wave Engine
 * Computes Rayleigh Room Resonance Frequencies (Axial, Tangential, Oblique), Bonello Distribution & Bolt Compliance
 */

export interface RoomMode {
  nx: number;
  ny: number;
  nz: number;
  frequencyHz: number;
  type: 'Axial' | 'Tangential' | 'Oblique';
  dimensionName: string;
}

export interface AcousticRoomMetrics {
  lengthM: number;
  widthM: number;
  heightM: number;
  volumeM3: number;
  schroederFrequencyHz: number;
  modes: RoomMode[];
  boltRatioCompliant: boolean;
  bonelloCompliant: boolean;
}

export class AcousticRoomModeEngine {
  private static readonly SPEED_OF_SOUND_MPS = 343; // 20°C in air

  /**
   * Convert feet to meters
   */
  public static feetToMeters(feet: number): number {
    return Math.round((feet * 0.3048) * 1000) / 1000;
  }

  /**
   * Calculate exact standing wave room mode frequency (Hz)
   */
  public static calculateFrequency(nx: number, ny: number, nz: number, lengthM: number, widthM: number, heightM: number): number {
    if (lengthM <= 0 || widthM <= 0 || heightM <= 0) return 0;
    const termX = Math.pow(nx / lengthM, 2);
    const termY = Math.pow(ny / widthM, 2);
    const termZ = Math.pow(nz / heightM, 2);
    return Math.round(((this.SPEED_OF_SOUND_MPS / 2) * Math.sqrt(termX + termY + termZ)) * 10) / 10;
  }

  /**
   * Calculate Schroeder Transition Frequency & Complete Room Mode Distribution
   */
  public static calculateMetrics(lengthFt: number, widthFt: number, heightFt: number, maxFreqHz = 300): AcousticRoomMetrics {
    const lengthM = this.feetToMeters(lengthFt);
    const widthM = this.feetToMeters(widthFt);
    const heightM = this.feetToMeters(heightFt);
    const volumeM3 = Math.round((lengthM * widthM * heightM) * 100) / 100;

    // Schroeder Frequency f_s ≈ 2000 * sqrt(RT60 / Volume) assuming standard RT60 = 0.4s
    const schroederFrequencyHz = Math.round(2000 * Math.sqrt(0.4 / Math.max(1, volumeM3)));

    const modes: RoomMode[] = [];

    for (let nx = 0; nx <= 5; nx++) {
      for (let ny = 0; ny <= 5; ny++) {
        for (let nz = 0; nz <= 5; nz++) {
          if (nx === 0 && ny === 0 && nz === 0) continue;

          const freq = this.calculateFrequency(nx, ny, nz, lengthM, widthM, heightM);
          if (freq > maxFreqHz) continue;

          const nonZeroCount = (nx > 0 ? 1 : 0) + (ny > 0 ? 1 : 0) + (nz > 0 ? 1 : 0);
          let type: 'Axial' | 'Tangential' | 'Oblique' = 'Axial';
          if (nonZeroCount === 2) type = 'Tangential';
          if (nonZeroCount === 3) type = 'Oblique';

          let dimensionName = 'Length';
          if (ny > 0 && nx === 0 && nz === 0) dimensionName = 'Width';
          if (nz > 0 && nx === 0 && ny === 0) dimensionName = 'Height';
          if (nonZeroCount > 1) dimensionName = 'Combined Boundary';

          modes.push({ nx, ny, nz, frequencyHz: freq, type, dimensionName });
        }
      }
    }

    modes.sort((a, b) => a.frequencyHz - b.frequencyHz);

    // Bolt Area Aspect Ratio Compliance Check (1 : W/H : L/H)
    const ratioW = widthM / heightM;
    const ratioL = lengthM / heightM;
    const boltRatioCompliant = ratioW > 1.1 && ratioW < 1.6 && ratioL > 1.3 && ratioL < 2.33;

    // Bonello Criterion Check (number of modes per 1/3 octave band should monotonically increase)
    let bonelloCompliant = true;
    let prevCount = 0;
    const bands = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250];

    for (let i = 0; i < bands.length - 1; i++) {
      const lower = bands[i];
      const upper = bands[i + 1];
      const count = modes.filter(m => m.frequencyHz >= lower && m.frequencyHz < upper).length;
      if (count < prevCount && count > 0) {
        bonelloCompliant = false;
        break;
      }
      if (count > 0) prevCount = count;
    }

    return {
      lengthM,
      widthM,
      heightM,
      volumeM3,
      schroederFrequencyHz,
      modes,
      boltRatioCompliant,
      bonelloCompliant
    };
  }
}
