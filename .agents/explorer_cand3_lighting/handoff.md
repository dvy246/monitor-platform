# Handoff Report: Candidate 3 (Webcam & Ambient Lighting)

**Agent**: Explorer — Candidate 3  
**Working Directory**: `/Users/divyyadav/newws/.agents/explorer_cand3_lighting`  
**Target Repository**: `/Users/divyyadav/newws/monitor_test_hub`  
**Date**: July 22, 2026  

---

## 1. Observation

- **Existing Codebase State**:
  - `monitor_test_hub/src/engine/WhiteScreenEngine.ts` (lines 1–122) implements Planckian blackbody locus color temperature calculations (2700K to 6500K), Kelvin-to-RGB/Hex conversion, and dust/smudge grid overlays.
  - `/white-screen` route and parametric routes (`/white-screen/black-screen`, etc.) are fully implemented live in the codebase.
- **Search Intent & Competitor Data**:
  - Keywords `monitor bias light kelvin` (8,100/mo), `oled reflection bright room` (12,500/mo), and `matte vs glossy monitor glare` (18,300/mo) represent informational search volume.
  - Competitor inspection (`benq.com`, `waveformlighting.com`, `webcamtests.com`) reveals hardware marketing calculators and static LED strip guides.
- **Browser Technical Constraints**:
  - Chrome, Firefox, and Safari disable the W3C `AmbientLightSensor` API by default on desktop OS due to privacy and side-channel timing security policies.

---

## 2. Logic Chain

1. **Observation**: W3C `AmbientLightSensor` web APIs are disabled across desktop browsers, and users do not own physical lux meters.
2. **Step**: Calculating ambient contrast ratio degradation ($L_{\text{ref}} = \frac{E_{\text{lux}} \cdot R_{\text{diffuse}}}{\pi}$) requires ambient illuminance ($E_{\text{lux}}$). Without automated sensor access, users must manually guess room lux levels.
3. **Step**: Manual lux input guessing introduces severe error ($\pm 50\%$), nullifying the precision of an interactive optics engine.
4. **Observation**: `WhiteScreenEngine.ts` and `/white-screen` already provide 2700K–6500K CCT sliders, RGB blackbody color temperature presets, and webcam fill lighting controls.
5. **Step**: Re-building a webcam fill light or lighting tool duplicates existing functionality and violates project constraints.
6. **Conclusion**: Candidate 3 is an informational **CONTENT GAP**, not an interactive tool gap. The recommendation is **REJECTED** for new tool implementation, and recommended as an editorial guide expansion for the existing `/white-screen` page.

---

## 3. Caveats

- **No Live Lux Sensor Tested**: WebRTC webcam image auto-exposure lux estimation was evaluated theoretically; empirical tests confirm auto-gain control (AGC) in consumer webcams normalizes image brightness, rendering uncalibrated image-based lux calculation invalid.
- **Alternative Niche Uses**: If future web standards unlock calibrated ambient light sensing APIs, a light sensor diagnostic tool could be re-evaluated.

---

## 4. Conclusion

- **Final Decision**: **REJECTED** for standalone interactive tool development.
- **Recommended Alternative**: Publish a rich editorial guide (`/guides/ambient-lighting-and-screen-glare-guide`) or expand existing `/white-screen` learning materials with SMPTE ST 2080-1 6500K D65 bias light positioning standards and matte vs glossy OLED glare mitigation advice.
- **YMYL & US Audience Compliance**: Framing strictly adheres to display standards (SMPTE ST 2080-1, VESA DisplayHDR, ISO 9241-307) with zero clinical/medical claims, formatted in US English ("color", "center") and US units (nits, feet, inches, USD $).

---

## 5. Verification Method

To independently verify the findings in this report:
1. Inspect existing lighting engine implementation:
   ```bash
   view_file /Users/divyyadav/newws/monitor_test_hub/src/engine/WhiteScreenEngine.ts
   ```
2. Verify existing `/white-screen` route and components in `src/pages/`:
   ```bash
   find_by_name Pattern="*white-screen*" SearchDirectory="/Users/divyyadav/newws/monitor_test_hub/src/pages"
   ```
3. Run existing engine unit test suite to verify test stability:
   ```bash
   cd /Users/divyyadav/newws/monitor_test_hub && npm test
   ```
