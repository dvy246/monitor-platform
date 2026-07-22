## 2026-07-22T09:00:00Z
You are an Implementer Worker agent for Pure TypeScript Engine & Vitest Test Suites.
Your working directory is: /Users/divyyadav/newws/.agents/worker_engines
Target web application: /Users/divyyadav/newws/monitor_test_hub

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission:
Implement 4 pure TypeScript calculation engines in `src/engine/` and write corresponding Vitest unit test suites in `src/engine/*.test.ts` for Monitor Test Hub.

Instructions & Specifications:
1. Candidate 1: `src/engine/WirelessLatencyEngine.ts` & `WirelessLatencyEngine.test.ts`
   - Read specs in /Users/divyyadav/newws/.agents/explorer_cand1_gaming/analysis.md
   - Calculate audio codec transmission latency (SBC, AAC, aptX, aptX-LL, LDAC, LC3, 2.4GHz RF, USB), OS buffer queue delay (WASAPI Shared/Exclusive, CoreAudio, AAudio), DAC delay, display frame lip-sync offset (at 60Hz, 120Hz, 144Hz, 240Hz, 360Hz, 540Hz), and protocol jitter variance.
   - Include non-clinical display/peripheral calibration disclaimers and US English terminology.

2. Candidate 2: `src/engine/ApcaAmbientContrastEngine.ts` & `ApcaAmbientContrastEngine.test.ts`
   - Read specs in /Users/divyyadav/newws/.agents/explorer_cand2_vision/analysis.md
   - Calculate WCAG 2.1 contrast ratio, W3C APCA 0.98G perceptual lightness contrast (Lc score), font weight/size readability thresholds, and physical Ambient Contrast Ratio (ACR) under room lux / foot-candles and screen surface reflectance factor (Rd).
   - Frame strictly as an ISO 9241-307 / WCAG / APCA display hardware calibration standard with zero clinical diagnostic claims.

3. Candidate 4: `src/engine/DeltaE2000Engine.ts` & `DeltaE2000Engine.test.ts`
   - Read specs in /Users/divyyadav/newws/.agents/explorer_cand4_calibration/analysis.md
   - Calculate sRGB / Hex / XYZ to CIE L*a*b* conversion (D65 white point), full CIEDE2000 (deltaE00), CIE94, and CIE76 color difference formulas with orthogonal error breakdown (deltaL, deltaC, deltaH) and ISO 9241-307 / Calman display tolerance grading.

4. Candidate 5: `src/engine/TouchSamplingRateEngine.ts` & `TouchSamplingRateEngine.test.ts`
   - Read specs in /Users/divyyadav/newws/.agents/explorer_cand5_touch/analysis.md
   - Unwraps W3C PointerEvent.prototype.getCoalescedEvents() to calculate true hardware touch sampling rate (Hz), inter-sample timestamp jitter (ms), coalesced buffer depth, and VSync phase beat frequency stutter (Hz).

5. Verification:
   - Run `npm test` inside `/Users/divyyadav/newws/monitor_test_hub` (MUST pass all 246+ existing tests AND all new engine test suites with 100% pass rate!).
   - Run `npx tsc --noEmit` inside `/Users/divyyadav/newws/monitor_test_hub` (MUST return 0 errors!).

6. Report & Handoff:
   - Save your work summary report to /Users/divyyadav/newws/.agents/worker_engines/handoff.md.
   - Send a completion message to parent (ID: dae2dd47-7820-4286-9cda-a35c42de48fd).
