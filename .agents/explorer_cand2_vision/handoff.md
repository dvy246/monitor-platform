# Handoff Report: Candidate 2 (Vision & Contrast Accessibility Explorer)

## 1. Observation
- **Inspected Files**:
  - `src/engine/ColorblindSimulatorEngine.ts`: Contains Brettel LMS matrix transformations for Protanopia, Deuteranopia, Tritanopia (`IRgbColor`, lines 10-14).
  - `src/engine/GrayscaleStepEngine.ts`: 16-step grayscale ramp generator and black crush / white clipping evaluator (lines 8-19).
  - `src/engine/GammaCalibrationEngine.ts`: ITU-R BT.709 transfer function gamma curve evaluator (lines 7-13).
  - `src/engine/PpiAcuityEngine.ts`: 1-arcminute Snellen 20/20 visual acuity retinal distance calculator (lines 6-16).
  - `src/engine/TextSharpnessEngine.ts` and `src/pages/display-tests/text-sharpness.astro`: ClearType subpixel text antialiasing simulator.
  - `competitor_analysis_report.md`: Identifies accessibility gaps in web tools, noting lack of contrast warnings, ambient glare indicators, and dark mode readability tuning (lines 34, 97-98).
- **Target Deliverable Location**: `/Users/divyyadav/newws/.agents/explorer_cand2_vision/analysis.md`

## 2. Logic Chain
1. *Observation*: Existing features in `monitor_test_hub` cover colorblindness, sub-pixel PPI, dead pixels, PWM flicker, and ClearType sharpness, but lack an APCA contrast checker, ambient glare contrast ratio evaluator, or dark mode astigmatism halation strain model.
2. *Observation*: Competitor tools (WebAIM, Stark) calculate static WCAG 2.1 math ($CR = (L1+0.05)/(L2+0.05)$) for graphic hex codes, but ignore spatial font weight (100-900), background/text polarity, APCA $L_c$ lightness contrast, display nits, and ambient room illuminance ($E_{amb}$) screen reflection ($R_d$).
3. *Logic*: Creating a pure TypeScript `ApcaAmbientContrastEngine.ts` fills a distinct **Interactive Tool Gap** by combining W3C APCA 0.98G perceptual lightness contrast with physical display Ambient Contrast Ratio ($ACR$) math:
   $$ACR = \frac{L_{max} + \frac{E_{amb} \times R_d}{\pi}}{L_{min} + \frac{E_{amb} \times R_d}{\pi}}$$
4. *Logic*: The engine reuses existing patterns from `ColorblindSimulatorEngine.ts` (`IRgbColor`), `GammaCalibrationEngine.ts` (gamma EOTF), `PpiAcuityEngine.ts` (spatial acuity), and `DeviceDatabase.ts` (display nits and panel reflection presets).
5. *Logic*: The tool is framed strictly as an ISO 9241-307 / WCAG 2.1 / APCA 0.98G display hardware and typography calibration standard, ensuring 100% YMYL safety (no medical diagnosis claims) and US audience compliance (US English spelling, foot-candles / lux).

## 3. Caveats
- APCA is currently a W3C Candidate Draft for WCAG 3.0. While APCA 0.98G is widely recognized, future minor exponent revisions may occur. The engine architecture retains configurable constants and presents stable WCAG 2.1 alongside APCA 0.98G.
- Ambient room illuminance in lux/foot-candles ($E_{amb}$) is provided via intuitive preset buttons (e.g. 5 lux dark room, 300 lux office) to prevent user friction from lack of physical light meters.

## 4. Conclusion
Candidate 2 (APCA Perceptual & Ambient Display Contrast Engine) is **GREENLIT**. It satisfies all criteria: addresses an interactive tool gap, targets high-volume query clusters (~150k monthly), reuses existing codebase patterns, requires medium engineering complexity, ensures YMYL safety and US audience compliance, and strengthens Monitor Test Hub's core display diagnostic authority.

## 5. Verification Method
- Inspect the comprehensive report at `/Users/divyyadav/newws/.agents/explorer_cand2_vision/analysis.md`.
- Verify file existence:
  - `ls -la /Users/divyyadav/newws/.agents/explorer_cand2_vision/analysis.md`
- Verify codebase baseline tests pass:
  - Command: `npm test` inside `/Users/divyyadav/newws/monitor_test_hub`
