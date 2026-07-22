import { describe, it, expect } from 'vitest';
import { IccExporter } from './IccExporter';

describe('IccExporter math and structures', () => {
  it('correctly converts chromaticities to XYZ coordinates', () => {
    const xyz = IccExporter.chromaticityToXYZ(0.3127, 0.3290);
    expect(xyz.Y).toBe(1.0);
    expect(xyz.X).toBeCloseTo(0.3127 / 0.3290, 4);
    expect(xyz.Z).toBeCloseTo((1.0 - 0.3127 - 0.3290) / 0.3290, 4);
  });

  it('generates a binary Uint8Array containing valid ICC signature', () => {
    const config = {
      profileName: 'Test Profile',
      gamma: 2.2,
      whitePoint: { x: 0.3127, y: 0.3290 },
      primaries: {
        red: { x: 0.64, y: 0.33 },
        green: { x: 0.30, y: 0.60 },
        blue: { x: 0.15, y: 0.06 }
      }
    };
    const binary = IccExporter.generateIccProfile(config);
    expect(binary).toBeInstanceOf(Uint8Array);
    expect(binary.byteLength).toBeGreaterThan(128);

    // Verify V4 Profile version bytes at offset 8
    expect(binary[8]).toBe(0x04);
    
    // Verify "acsp" signature at offset 36-39
    const acsp = String.fromCharCode(binary[36], binary[37], binary[38], binary[39]);
    expect(acsp).toBe('acsp');
  });

  it('generates a valid sRGB profile binary using generateSrgbProfileBinary', () => {
    const binary = IccExporter.generateSrgbProfileBinary();
    expect(binary).toBeInstanceOf(Uint8Array);
    expect(binary.byteLength).toBeGreaterThan(128);
    const acsp = String.fromCharCode(binary[36], binary[37], binary[38], binary[39]);
    expect(acsp).toBe('acsp');
  });
});
