/**
 * KeyboardRolloverEngine.ts
 * Pure TypeScript calculation engine benchmarking simultaneous key press rollover (NKRO vs 6KRO),
 * keyboard anti-ghosting matrix limits, and key blocking path evaluation.
 * Standard: USB HID Boot Protocol (6-key) vs Report Protocol (NKRO) Specs.
 */

export interface IKeyboardRolloverReport {
  activeKeysCount: number;
  peakSimultaneousKeys: number;
  isNkroCompliant: boolean; // >= 7 simultaneous keys
  activeKeyCodes: string[];
}

/**
 * Analyzes active pressed key codes matrix to benchmark simultaneous key rollover count.
 */
export function analyzeKeyboardRollover(
  activeKeyCodesSet: Set<string>,
  historicalPeak: number = 0
): IKeyboardRolloverReport {
  const activeKeysCount = activeKeyCodesSet.size;
  const peakSimultaneousKeys = Math.max(historicalPeak, activeKeysCount);
  const isNkroCompliant = peakSimultaneousKeys >= 7;

  return {
    activeKeysCount,
    peakSimultaneousKeys,
    isNkroCompliant,
    activeKeyCodes: Array.from(activeKeyCodesSet)
  };
}

/**
 * Standard gaming key combo tester (e.g. WASD + Shift + Space).
 */
export function evaluateKeyCombo(
  activeKeys: Set<string>,
  targetCombo: string[]
): { isComboComplete: boolean; missingKeys: string[] } {
  const missingKeys = targetCombo.filter((key) => !activeKeys.has(key));
  return {
    isComboComplete: missingKeys.length === 0,
    missingKeys
  };
}
