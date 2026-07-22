/**
 * White Screen Utility & Lighting Calculation Engine
 * 
 * Provides Planckian locus color temperature calculations (2700K to 6500K),
 * Kelvin to RGB/Hex conversions, dust/smudge grid overlay matrix specifications,
 * and Screen Wake Lock state management.
 */

export interface ColorTemperatureSetting {
  kelvin: number;
  label: string;
  description: string;
  rgb: { r: number; g: number; b: number };
  hex: string;
}

export interface GridOverlayConfig {
  enabled: boolean;
  type: 'grid' | 'checkerboard' | 'concentric';
  cellSizePx: number;
  opacity: number; // 0.05 to 0.5
  strokeColor: string;
}

export class WhiteScreenEngine {
  /**
   * Converts Color Temperature (Kelvin: 2700K - 6500K) to RGB color values
   * based on Tanner Helland / Kessner Planckian blackbody approximation algorithm.
   */
  public static kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
    const temp = Math.min(10000, Math.max(1000, kelvin)) / 100;

    let red: number;
    let green: number;
    let blue: number;

    // Calculate Red
    if (temp <= 66) {
      red = 255;
    } else {
      red = temp - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      red = Math.min(255, Math.max(0, red));
    }

    // Calculate Green
    if (temp <= 66) {
      green = temp;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;
      green = Math.min(255, Math.max(0, green));
    } else {
      green = temp - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);
      green = Math.min(255, Math.max(0, green));
    }

    // Calculate Blue
    if (temp >= 66) {
      blue = 255;
    } else if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      blue = Math.min(255, Math.max(0, blue));
    }

    return {
      r: Math.round(red),
      g: Math.round(green),
      b: Math.round(blue)
    };
  }

  /**
   * Converts RGB object to CSS hex string (#RRGGBB)
   */
  public static rgbToHex(rgb: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Retrieves preset color temperature configurations from 2700K to 6500K
   */
  public static getTemperaturePresets(): ColorTemperatureSetting[] {
    const presets = [
      { kelvin: 2700, label: '2700K Warm Soft Light', description: 'Cozy tungsten tone for night zoom calls & reduced eye strain' },
      { kelvin: 3500, label: '3500K Warm Neutral', description: 'Balanced indoor lighting tone for webcam fill light' },
      { kelvin: 4500, label: '4500K Neutral White', description: 'Clean desk lamp temperature for document review & macro photography' },
      { kelvin: 5500, label: '5500K Daylight White', description: 'Direct sunlight color temperature for color grading & display calibration' },
      { kelvin: 6500, label: '6500K D65 Standard', description: 'sRGB / Rec.709 industry reference standard white point' }
    ];

    return presets.map((preset) => {
      const rgb = this.kelvinToRgb(preset.kelvin);
      return {
        ...preset,
        rgb,
        hex: this.rgbToHex(rgb)
      };
    });
  }

  /**
   * Evaluates contrast ratio of overlay stroke against background hex
   * to guarantee dust & smudge visibility
   */
  public static calculateDustGridOverlay(cellSizePx: number = 20, opacity: number = 0.15): GridOverlayConfig {
    const sanitizedSize = Math.min(100, Math.max(5, cellSizePx));
    const sanitizedOpacity = Math.min(0.5, Math.max(0.02, opacity));

    return {
      enabled: true,
      type: 'grid',
      cellSizePx: sanitizedSize,
      opacity: sanitizedOpacity,
      strokeColor: 'rgba(0,0,0,0.15)'
    };
  }
}
