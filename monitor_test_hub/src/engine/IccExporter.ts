export interface IIccExportConfig {
  profileName: string;
  gamma: number;
  whitePoint: { x: number; y: number };
  primaries: {
    red: { x: number; y: number };
    green: { x: number; y: number };
    blue: { x: number; y: number };
  };
}

export class IccExporter {
  // Convert standard x,y chromaticity to XYZ coordinates where Y = 1.0
  public static chromaticityToXYZ(x: number, y: number): { X: number; Y: number; Z: number } {
    if (y === 0) return { X: 0, Y: 0, Z: 0 };
    return {
      X: x / y,
      Y: 1.0,
      Z: (1.0 - x - y) / y
    };
  }

  // Pack s15Fixed16 number (16-bit integer, 16-bit fractional)
  private static toS15Fixed16(val: number): number {
    return Math.round(val * 65536);
  }

  public static generateSrgbProfileBinary(): Uint8Array {
    return this.generateIccProfile({
      profileName: 'sRGB D65 Gamma 2.2 Profile',
      gamma: 2.2,
      whitePoint: { x: 0.3127, y: 0.3290 },
      primaries: {
        red: { x: 0.64, y: 0.33 },
        green: { x: 0.30, y: 0.60 },
        blue: { x: 0.15, y: 0.06 }
      }
    });
  }

  public static generateIccProfile(config: IIccExportConfig): Uint8Array {
    // Generate a minimal version 4 Display ICC Profile
    // Header (128 bytes) + Tag Count (4 bytes) + Tag Table (12 bytes * 5 tags) + Tag Data
    const headerSize = 128;
    const tagCount = 5;
    const tagTableSize = 4 + (12 * tagCount);
    
    // Tag Data preparation
    const descData = this.buildTextDescriptionTag(config.profileName);
    const wtptData = this.buildXYZTag(config.whitePoint.x, config.whitePoint.y);
    const rXYZData = this.buildXYZTag(config.primaries.red.x, config.primaries.red.y);
    const gXYZData = this.buildXYZTag(config.primaries.green.x, config.primaries.green.y);
    const bXYZData = this.buildXYZTag(config.primaries.blue.x, config.primaries.blue.y);

    const tags = [
      { sig: 'desc', data: descData },
      { sig: 'wtpt', data: wtptData },
      { sig: 'rXYZ', data: rXYZData },
      { sig: 'gXYZ', data: gXYZData },
      { sig: 'bXYZ', data: bXYZData }
    ];

    // Compute offsets
    let currentOffset = headerSize + tagTableSize;
    const tagTableEntries: { sig: string; offset: number; size: number; data: Uint8Array }[] = [];

    for (const tag of tags) {
      tagTableEntries.push({
        sig: tag.sig,
        offset: currentOffset,
        size: tag.data.byteLength,
        data: tag.data
      });
      currentOffset += tag.data.byteLength;
    }

    const totalSize = currentOffset;
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // --- 1. Write Header (128 bytes) ---
    view.setUint32(0, totalSize, false); // Profile size
    this.writeString(view, 4, 'lcms'); // Preferred CMM
    view.setUint32(8, 0x04300000, false); // Version 4.3.0
    this.writeString(view, 12, 'mnt '); // Device Class: Monitor
    this.writeString(view, 16, 'RGB '); // Color Space
    this.writeString(view, 20, 'XYZ '); // Connection Space (PCS)
    
    // Date/Time (Dummy valid date: 2026-07-21 12:00:00)
    view.setUint16(24, 2026, false); // Year
    view.setUint16(26, 7, false);  // Month
    view.setUint16(28, 21, false); // Day
    view.setUint16(30, 12, false); // Hour
    view.setUint16(32, 0, false);  // Minute
    view.setUint16(34, 0, false);  // Second

    this.writeString(view, 36, 'acsp'); // Signature
    this.writeString(view, 40, 'APPL'); // Primary platform
    view.setUint32(44, 0, false); // Flags
    this.writeString(view, 48, 'AGY '); // Device Manufacturer
    view.setUint32(52, 0, false); // Device Model
    view.setUint32(56, 0, false); // Attributes
    view.setUint32(60, 0, false); // Attributes cont.
    view.setUint32(64, 1, false); // Rendering Intent: Relative Colorimetric

    // D50 Illuminant in PCS
    view.setInt32(68, this.toS15Fixed16(0.9642), false); // X
    view.setInt32(72, this.toS15Fixed16(1.0), false);    // Y
    view.setInt32(76, this.toS15Fixed16(0.8249), false); // Z

    this.writeString(view, 80, 'ANTG'); // Profile creator

    // --- 2. Write Tag Table ---
    view.setUint32(headerSize, tagCount, false); // Tag count
    let tableOffset = headerSize + 4;
    for (const entry of tagTableEntries) {
      this.writeString(view, tableOffset, entry.sig);
      view.setUint32(tableOffset + 4, entry.offset, false);
      view.setUint32(tableOffset + 8, entry.size, false);
      tableOffset += 12;
    }

    // --- 3. Write Tag Data Payload ---
    for (const entry of tagTableEntries) {
      bytes.set(entry.data, entry.offset);
    }

    return bytes;
  }

  private static writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  private static buildTextDescriptionTag(text: string): Uint8Array {
    // Multi-localized Unicode Type ('mluc')
    const strLen = text.length;
    const rawSize = 28 + (strLen * 2);
    const padding = (4 - (rawSize % 4)) % 4;
    const size = rawSize + padding;
    const buffer = new ArrayBuffer(size);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'mluc'); // Signature
    view.setUint32(4, 0, false); // Reserved
    view.setUint32(8, 1, false); // Number of names (1)
    view.setUint32(12, 12, false); // Name record size (12)
    this.writeString(view, 16, 'enUS'); // Language code + Country code
    view.setUint32(20, strLen * 2, false); // Name length in bytes
    view.setUint32(24, 28, false); // Name offset

    // Write UTF-16 big-endian string
    for (let i = 0; i < strLen; i++) {
      view.setUint16(28 + (i * 2), text.charCodeAt(i), false);
    }

    return new Uint8Array(buffer);
  }

  private static buildXYZTag(x: number, y: number): Uint8Array {
    // XYZType tag containing X, Y, Z values
    const buffer = new ArrayBuffer(20);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'XYZ '); // Signature
    view.setUint32(4, 0, false); // Reserved

    const xyz = this.chromaticityToXYZ(x, y);
    view.setInt32(8, this.toS15Fixed16(xyz.X), false);
    view.setInt32(12, this.toS15Fixed16(xyz.Y), false);
    view.setInt32(16, this.toS15Fixed16(xyz.Z), false);

    return new Uint8Array(buffer);
  }
}
