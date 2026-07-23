/**
 * ScreenTestEngine.ts
 * Decoupled pure TypeScript engine for Universal Screen Test calculations,
 * Kelvin color temperature mapping, slideshow interval state, gesture vector math,
 * and Gamepad API D-Pad button state mapping.
 */

export interface PatternDefinition {
  id: string;
  name: string;
  category: 'defect' | 'color' | 'uniformity' | 'grid' | 'touch';
  hex: string;
  textColor: string;
  keyShortcut: string;
  description: string;
}

export interface DefectPin {
  id: string;
  x: number;
  y: number;
  colorHex: string;
  timestamp: string;
}

export interface ScreenTestState {
  activePatternIndex: number;
  isFullscreen: boolean;
  isWakeLockActive: boolean;
  showOverlay: boolean;
  kelvinTemp: number;
  slideshowActive: boolean;
  slideshowIntervalMs: number;
  brightness: number; // 10% to 100%
  pins: DefectPin[];
  gamepadConnected: boolean;
  gamepadName: string;
}

export class ScreenTestEngine {
  public static readonly PATTERNS: PatternDefinition[] = [
    { id: 'white', name: 'Solid White', category: 'defect', hex: '#ffffff', textColor: 'text-zinc-900', keyShortcut: '1', description: 'Inspects for dead black pixels, surface dust, and edge backlight bleed.' },
    { id: 'black', name: 'Solid Black (OLED Off)', category: 'defect', hex: '#000000', textColor: 'text-white', keyShortcut: '2', description: 'Tests stuck bright subpixels and verifies true zero-luminance state.' },
    { id: 'gray05', name: '5% Dark Gray (OLED Banding)', category: 'uniformity', hex: '#0d0d11', textColor: 'text-white', keyShortcut: '3', description: 'IEC 62341-6-2 standard for OLED dark gray banding and vignetting.' },
    { id: 'gray10', name: '10% Dark Gray (Uniformity)', category: 'uniformity', hex: '#1a1a22', textColor: 'text-white', keyShortcut: '4', description: 'Evaluates near-black shadow detail and WOLED/QD-OLED panel uniformity.' },
    { id: 'red', name: 'Pure Red (255,0,0)', category: 'defect', hex: '#ff0000', textColor: 'text-white', keyShortcut: '5', description: 'Isolates red subpixels to detect subpixel gate failures.' },
    { id: 'green', name: 'Pure Green (0,255,0)', category: 'defect', hex: '#00ff00', textColor: 'text-zinc-900', keyShortcut: '6', description: 'Isolates green subpixels (highest human eye luminance sensitivity).' },
    { id: 'blue', name: 'Pure Blue (0,0,255)', category: 'defect', hex: '#0000ff', textColor: 'text-white', keyShortcut: '7', description: 'Isolates blue subpixels (most susceptible to organic degradation).' },
    { id: 'cyan', name: 'Pure Cyan (0,255,255)', category: 'color', hex: '#00ffff', textColor: 'text-zinc-900', keyShortcut: '8', description: 'Tests combined green and blue subpixel alignment.' },
    { id: 'magenta', name: 'Pure Magenta (255,0,255)', category: 'color', hex: '#ff00ff', textColor: 'text-white', keyShortcut: '9', description: 'Tests combined red and blue subpixel alignment.' },
    { id: 'yellow', name: 'Pure Yellow (255,255,0)', category: 'color', hex: '#ffff00', textColor: 'text-zinc-900', keyShortcut: '0', description: 'Tests combined red and green subpixel alignment.' },
    { id: 'gray50', name: '50% Neutral Gray', category: 'color', hex: '#808080', textColor: 'text-white', keyShortcut: 'G', description: 'Evaluates gamma 2.2 midpoint tone response and overall color neutrality.' },
    { id: 'warm2700', name: '2700K Warm Soft Light', category: 'color', hex: '#ffa957', textColor: 'text-zinc-900', keyShortcut: 'K', description: 'Video call fill lighting and warm color balance test.' },
    { id: 'neutral4500', name: '4500K Neutral Light', category: 'color', hex: '#ffd1a3', textColor: 'text-zinc-900', keyShortcut: 'N', description: 'Balanced daylight temperature fill light.' },
    { id: 'grid', name: 'Dust & Smudge Grid', category: 'grid', hex: '#ffffff', textColor: 'text-zinc-900', keyShortcut: 'D', description: '25px vector grid to differentiate surface glass dust from dead pixels.' },
    { id: 'subpixel', name: 'Subpixel Geometry Reticle', category: 'grid', hex: '#ffffff', textColor: 'text-zinc-900', keyShortcut: 'S', description: 'Micro-text reticle for QD-OLED / WOLED ClearType text fringing.' },
    { id: 'touchgrid', name: 'Touch Digitizer Matrix Grid', category: 'touch', hex: '#121215', textColor: 'text-white', keyShortcut: 'T', description: 'Interactive touch matrix tracking digitizer contact dead-zones.' }
  ];

  /**
   * Converts Kelvin temperature (1000K to 12000K) to hex RGB color code
   */
  public static kelvinToHex(kelvin: number): string {
    const temp = Math.max(1000, Math.min(12000, kelvin)) / 100;
    let red: number;
    let green: number;
    let blue: number;

    // Red
    if (temp <= 66) {
      red = 255;
    } else {
      red = temp - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      red = Math.max(0, Math.min(255, red));
    }

    // Green
    if (temp <= 66) {
      green = temp;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;
    } else {
      green = temp - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);
    }
    green = Math.max(0, Math.min(255, green));

    // Blue
    if (temp >= 66) {
      blue = 255;
    } else if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
      blue = Math.max(0, Math.min(255, blue));
    }

    const r = Math.round(red).toString(16).padStart(2, '0');
    const g = Math.round(green).toString(16).padStart(2, '0');
    const b = Math.round(blue).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  }

  /**
   * Calculates next pattern index wrapping around
   */
  public static getNextPatternIndex(currentIndex: number, step: number = 1): number {
    const total = ScreenTestEngine.PATTERNS.length;
    return (currentIndex + step + total) % total;
  }

  /**
   * Evaluates touch swipe gesture direction from start/end touch coordinates
   */
  public static classifySwipeGesture(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    thresholdPx: number = 40
  ): 'SWIPE_LEFT' | 'SWIPE_RIGHT' | 'SWIPE_UP' | 'SWIPE_DOWN' | 'TAP' {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < thresholdPx && absY < thresholdPx) {
      return 'TAP';
    }

    if (absX > absY) {
      return deltaX > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT';
    } else {
      return deltaY > 0 ? 'SWIPE_DOWN' : 'SWIPE_UP';
    }
  }

  /**
   * Maps Gamepad API button and axis inputs to screen test actions
   */
  public static processGamepadInput(params: {
    buttons: boolean[];
    axes: number[];
    axisThreshold?: number;
  }): {
    action: 'NEXT_PATTERN' | 'PREV_PATTERN' | 'TOGGLE_FULLSCREEN' | 'TOGGLE_OVERLAY' | 'TOGGLE_WAKELOCK' | null;
  } {
    const { buttons, axes, axisThreshold = 0.5 } = params;

    // D-Pad Right or Left Stick Right
    if (buttons[15] || (axes[0] && axes[0] > axisThreshold)) {
      return { action: 'NEXT_PATTERN' };
    }
    // D-Pad Left or Left Stick Left
    if (buttons[14] || (axes[0] && axes[0] < -axisThreshold)) {
      return { action: 'PREV_PATTERN' };
    }
    // Button 0 (Cross / A) -> Fullscreen
    if (buttons[0]) {
      return { action: 'TOGGLE_FULLSCREEN' };
    }
    // Button 1 (Circle / B) -> Toggle Overlay
    if (buttons[1]) {
      return { action: 'TOGGLE_OVERLAY' };
    }
    // Button 3 (Triangle / Y) -> Toggle WakeLock
    if (buttons[3]) {
      return { action: 'TOGGLE_WAKELOCK' };
    }

    return { action: null };
  }
}
