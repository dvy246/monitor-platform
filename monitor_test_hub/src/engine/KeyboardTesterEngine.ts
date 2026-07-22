/**
 * KeyboardTesterEngine.ts
 * Framework-agnostic pure TypeScript calculation & telemetry engine for Keyboard Diagnostics.
 * Powers key press registration, switch chatter/bounce detection (microsecond delta limits),
 * N-Key Rollover (NKRO) simultaneous key peak tracking, key hold duration analysis,
 * Actions-Per-Minute (APM/WPM) moving window calculation, and key frequency heatmap gradients.
 */

export type LayoutType = 'ansi-104' | 'iso-105' | 'tkl-80' | 'compact-60' | 'mac-ansi';

export interface IKeyInfo {
  code: string;
  label: string;
  subLabel?: string;
  width?: number; // Relative width units (1.0 = standard key width 1u)
  height?: number;
  row: number;
}

export interface IKeyTelemetry {
  code: string;
  pressCount: number;
  lastPressTimestamp: number;
  lastReleaseTimestamp: number;
  lastDurationMs: number;
  minDurationMs: number;
  maxDurationMs: number;
  chatterCount: number;
  lastChatterDeltaMs?: number;
}

export interface IGamingCombo {
  id: string;
  name: string;
  category: 'FPS' | 'MOBA' | 'RTS' | 'General';
  keys: string[];
}

export interface IKeyboardTesterReport {
  activeKeysCount: number;
  testedKeysCount: number;
  totalLayoutKeysCount: number;
  peakSimultaneousKeys: number;
  isNkroCompliant: boolean;
  chatterAlertCount: number;
  totalPresses: number;
  apm: number;
  wpm: number;
  coveragePercent: number;
  chatterLog: Array<{ code: string; deltaMs: number; timestamp: number }>;
}

export const GAMING_COMBOS: IGamingCombo[] = [
  { id: 'fps-wasd-jump', name: 'WASD + Space (FPS Strafe Jump)', category: 'FPS', keys: ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'] },
  { id: 'fps-crouch-jump', name: 'Shift + Ctrl + Space (Tactical Move)', category: 'FPS', keys: ['ShiftLeft', 'ControlLeft', 'Space'] },
  { id: 'moba-qwer-df', name: 'QWER + D + F (MOBA Skill Chain)', category: 'MOBA', keys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyD', 'KeyF'] },
  { id: 'rts-ctrl-group', name: 'Ctrl + 1/2/3 (RTS Control Groups)', category: 'RTS', keys: ['ControlLeft', 'Digit1', 'Digit2', 'Digit3'] },
  { id: 'general-modifier', name: 'Ctrl + Alt + Shift + Space (Heavy Mod)', category: 'General', keys: ['ControlLeft', 'AltLeft', 'ShiftLeft', 'Space'] }
];

/**
 * Standard ANSI 104 layout definition (Row 0 to 5)
 */
export const ANSI_104_KEYS: IKeyInfo[] = [
  // Row 0 - Esc & Function keys
  { code: 'Escape', label: 'Esc', row: 0, width: 1 },
  { code: 'F1', label: 'F1', row: 0, width: 1 },
  { code: 'F2', label: 'F2', row: 0, width: 1 },
  { code: 'F3', label: 'F3', row: 0, width: 1 },
  { code: 'F4', label: 'F4', row: 0, width: 1 },
  { code: 'F5', label: 'F5', row: 0, width: 1 },
  { code: 'F6', label: 'F6', row: 0, width: 1 },
  { code: 'F7', label: 'F7', row: 0, width: 1 },
  { code: 'F8', label: 'F8', row: 0, width: 1 },
  { code: 'F9', label: 'F9', row: 0, width: 1 },
  { code: 'F10', label: 'F10', row: 0, width: 1 },
  { code: 'F11', label: 'F11', row: 0, width: 1 },
  { code: 'F12', label: 'F12', row: 0, width: 1 },
  { code: 'PrintScreen', label: 'PrtSc', row: 0, width: 1 },
  { code: 'ScrollLock', label: 'ScrLk', row: 0, width: 1 },
  { code: 'Pause', label: 'Pause', row: 0, width: 1 },

  // Row 1 - Number row
  { code: 'Backquote', label: '`', subLabel: '~', row: 1, width: 1 },
  { code: 'Digit1', label: '1', subLabel: '!', row: 1, width: 1 },
  { code: 'Digit2', label: '2', subLabel: '@', row: 1, width: 1 },
  { code: 'Digit3', label: '3', subLabel: '#', row: 1, width: 1 },
  { code: 'Digit4', label: '4', subLabel: '$', row: 1, width: 1 },
  { code: 'Digit5', label: '5', subLabel: '%', row: 1, width: 1 },
  { code: 'Digit6', label: '6', subLabel: '^', row: 1, width: 1 },
  { code: 'Digit7', label: '7', subLabel: '&', row: 1, width: 1 },
  { code: 'Digit8', label: '8', subLabel: '*', row: 1, width: 1 },
  { code: 'Digit9', label: '9', subLabel: '(', row: 1, width: 1 },
  { code: 'Digit0', label: '0', subLabel: ')', row: 1, width: 1 },
  { code: 'Minus', label: '-', subLabel: '_', row: 1, width: 1 },
  { code: 'Equal', label: '=', subLabel: '+', row: 1, width: 1 },
  { code: 'Backspace', label: 'Backspace', row: 1, width: 2 },
  { code: 'Insert', label: 'Ins', row: 1, width: 1 },
  { code: 'Home', label: 'Home', row: 1, width: 1 },
  { code: 'PageUp', label: 'PgUp', row: 1, width: 1 },

  // Row 2 - QWERTY
  { code: 'Tab', label: 'Tab', row: 2, width: 1.5 },
  { code: 'KeyQ', label: 'Q', row: 2, width: 1 },
  { code: 'KeyW', label: 'W', row: 2, width: 1 },
  { code: 'KeyE', label: 'E', row: 2, width: 1 },
  { code: 'KeyR', label: 'R', row: 2, width: 1 },
  { code: 'KeyT', label: 'T', row: 2, width: 1 },
  { code: 'KeyY', label: 'Y', row: 2, width: 1 },
  { code: 'KeyU', label: 'U', row: 2, width: 1 },
  { code: 'KeyI', label: 'I', row: 2, width: 1 },
  { code: 'KeyO', label: 'O', row: 2, width: 1 },
  { code: 'KeyP', label: 'P', row: 2, width: 1 },
  { code: 'BracketLeft', label: '[', subLabel: '{', row: 2, width: 1 },
  { code: 'BracketRight', label: ']', subLabel: '}', row: 2, width: 1 },
  { code: 'Backslash', label: '\\\\', subLabel: '|', row: 2, width: 1.5 },
  { code: 'Delete', label: 'Del', row: 2, width: 1 },
  { code: 'End', label: 'End', row: 2, width: 1 },
  { code: 'PageDown', label: 'PgDn', row: 2, width: 1 },

  // Row 3 - ASDFGH
  { code: 'CapsLock', label: 'Caps', row: 3, width: 1.75 },
  { code: 'KeyA', label: 'A', row: 3, width: 1 },
  { code: 'KeyS', label: 'S', row: 3, width: 1 },
  { code: 'KeyD', label: 'D', row: 3, width: 1 },
  { code: 'KeyF', label: 'F', row: 3, width: 1 },
  { code: 'KeyG', label: 'G', row: 3, width: 1 },
  { code: 'KeyH', label: 'H', row: 3, width: 1 },
  { code: 'KeyJ', label: 'J', row: 3, width: 1 },
  { code: 'KeyK', label: 'K', row: 3, width: 1 },
  { code: 'KeyL', label: 'L', row: 3, width: 1 },
  { code: 'Semicolon', label: ';', subLabel: ':', row: 3, width: 1 },
  { code: 'Quote', label: "'", subLabel: '"', row: 3, width: 1 },
  { code: 'Enter', label: 'Enter', row: 3, width: 2.25 },

  // Row 4 - ZXCVBN
  { code: 'ShiftLeft', label: 'Shift', row: 4, width: 2.25 },
  { code: 'KeyZ', label: 'Z', row: 4, width: 1 },
  { code: 'KeyX', label: 'X', row: 4, width: 1 },
  { code: 'KeyC', label: 'C', row: 4, width: 1 },
  { code: 'KeyV', label: 'V', row: 4, width: 1 },
  { code: 'KeyB', label: 'B', row: 4, width: 1 },
  { code: 'KeyN', label: 'N', row: 4, width: 1 },
  { code: 'KeyM', label: 'M', row: 4, width: 1 },
  { code: 'Comma', label: ',', subLabel: '<', row: 4, width: 1 },
  { code: 'Period', label: '.', subLabel: '>', row: 4, width: 1 },
  { code: 'Slash', label: '/', subLabel: '?', row: 4, width: 1 },
  { code: 'ShiftRight', label: 'Shift', row: 4, width: 2.75 },
  { code: 'ArrowUp', label: '▲', row: 4, width: 1 },

  // Row 5 - Bottom row
  { code: 'ControlLeft', label: 'Ctrl', row: 5, width: 1.25 },
  { code: 'MetaLeft', label: 'Win', subLabel: 'Cmd', row: 5, width: 1.25 },
  { code: 'AltLeft', label: 'Alt', row: 5, width: 1.25 },
  { code: 'Space', label: 'Spacebar', row: 5, width: 6.25 },
  { code: 'AltRight', label: 'Alt', row: 5, width: 1.25 },
  { code: 'MetaRight', label: 'Win', subLabel: 'Cmd', row: 5, width: 1.25 },
  { code: 'ContextMenu', label: 'Menu', row: 5, width: 1.25 },
  { code: 'ControlRight', label: 'Ctrl', row: 5, width: 1.25 },
  { code: 'ArrowLeft', label: '◄', row: 5, width: 1 },
  { code: 'ArrowDown', label: '▼', row: 5, width: 1 },
  { code: 'ArrowRight', label: '►', row: 5, width: 1 }
];

export class KeyboardTesterState {
  public activeKeys: Set<string> = new Set();
  public testedKeys: Set<string> = new Set();
  public telemetryMap: Map<string, IKeyTelemetry> = new Map();
  public chatterLog: Array<{ code: string; deltaMs: number; timestamp: number }> = [];
  public peakSimultaneousKeys: number = 0;
  public totalPresses: number = 0;
  public startTimeMs: number | null = null;
  public chatterThresholdMs: number = 35; // If double-press occurs under 35ms, flag chatter

  public processKeyDown(code: string, timestampMs: number): { isChatter: boolean; deltaMs: number } {
    if (!this.startTimeMs) {
      this.startTimeMs = timestampMs;
    }

    let isChatter = false;
    let deltaMs = 0;

    let tele = this.telemetryMap.get(code);
    if (!tele) {
      tele = {
        code,
        pressCount: 0,
        lastPressTimestamp: timestampMs,
        lastReleaseTimestamp: 0,
        lastDurationMs: 0,
        minDurationMs: Infinity,
        maxDurationMs: 0,
        chatterCount: 0
      };
      this.telemetryMap.set(code, tele);
    }

    // Check chatter condition: release -> press delta < threshold
    if (tele.lastReleaseTimestamp > 0) {
      deltaMs = timestampMs - tele.lastReleaseTimestamp;
      if (deltaMs > 0 && deltaMs <= this.chatterThresholdMs) {
        isChatter = true;
        tele.chatterCount += 1;
        tele.lastChatterDeltaMs = deltaMs;
        this.chatterLog.push({ code, deltaMs, timestamp: timestampMs });
      }
    }

    tele.pressCount += 1;
    tele.lastPressTimestamp = timestampMs;
    this.totalPresses += 1;

    this.activeKeys.add(code);
    this.testedKeys.add(code);

    if (this.activeKeys.size > this.peakSimultaneousKeys) {
      this.peakSimultaneousKeys = this.activeKeys.size;
    }

    return { isChatter, deltaMs };
  }

  public processKeyUp(code: string, timestampMs: number): number {
    this.activeKeys.delete(code);
    const tele = this.telemetryMap.get(code);
    if (tele && tele.lastPressTimestamp > 0) {
      const duration = Math.max(0, timestampMs - tele.lastPressTimestamp);
      tele.lastReleaseTimestamp = timestampMs;
      tele.lastDurationMs = duration;
      tele.minDurationMs = Math.min(tele.minDurationMs, duration);
      tele.maxDurationMs = Math.max(tele.maxDurationMs, duration);
      return duration;
    }
    return 0;
  }

  public reset(): void {
    this.activeKeys.clear();
    this.testedKeys.clear();
    this.telemetryMap.clear();
    this.chatterLog = [];
    this.peakSimultaneousKeys = 0;
    this.totalPresses = 0;
    this.startTimeMs = null;
  }

  public generateReport(layout: IKeyInfo[] = ANSI_104_KEYS, currentTimeMs: number = Date.now()): IKeyboardTesterReport {
    const totalLayoutKeysCount = layout.length;
    const testedKeysCount = this.testedKeys.size;
    const activeKeysCount = this.activeKeys.size;
    const isNkroCompliant = this.peakSimultaneousKeys >= 7;
    const chatterAlertCount = this.chatterLog.length;
    const coveragePercent = Math.round((testedKeysCount / Math.max(1, totalLayoutKeysCount)) * 100);

    let apm = 0;
    let wpm = 0;
    if (this.startTimeMs && currentTimeMs > this.startTimeMs) {
      const elapsedMinutes = (currentTimeMs - this.startTimeMs) / 60000;
      if (elapsedMinutes > 0) {
        apm = Math.round(this.totalPresses / elapsedMinutes);
        wpm = Math.round(apm / 5); // Standard 5 keystrokes per word
      }
    }

    return {
      activeKeysCount,
      testedKeysCount,
      totalLayoutKeysCount,
      peakSimultaneousKeys: this.peakSimultaneousKeys,
      isNkroCompliant,
      chatterAlertCount,
      totalPresses: this.totalPresses,
      apm,
      wpm,
      coveragePercent,
      chatterLog: [...this.chatterLog]
    };
  }

  public getHeatmapIntensity(code: string): number {
    const tele = this.telemetryMap.get(code);
    if (!tele || tele.pressCount === 0) return 0;

    let maxPresses = 1;
    this.telemetryMap.forEach(t => {
      if (t.pressCount > maxPresses) maxPresses = t.pressCount;
    });

    return Math.min(1.0, tele.pressCount / maxPresses);
  }
}
