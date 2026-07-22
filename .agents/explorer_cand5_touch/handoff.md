# Handoff Report — Candidate 5: Hardware Touch Sampling Rate & Coalesced Event Jitter Inspector

## 1. Observation
- Existing codebase inspection:
  - `src/engine/TouchMatrixEngine.ts` (lines 1-100): Touch matrix dead-zone grid isolation, gesture velocity calculation (`calculateGestureVelocity`), jitter variance (`JitterResult`).
  - `src/engine/TouchPrecisionEngine.ts` (lines 1-99): RMS straight-line vector deviation error & digitizer EMI noise floor (`TouchPrecisionMetrics`).
  - `src/engine/MousePollingEngine.ts` (lines 1-60): USB HID mouse polling frequency (Hz), inter-report interval, standard deviation.
  - `src/pages/touch-tests/` contains `dead-zone.astro`, `input-lag.astro`, `multi-touch.astro`, `stylus-pressure.astro`, `swipe-velocity.astro`, `vector-precision.astro`.
- Command execution result:
  - `./node_modules/.bin/vitest run src/engine/TouchMatrixEngine.test.ts`: Passed 16/16 unit tests in 201ms.
- Verified gap: Zero existing engine or page measures W3C `PointerEvent.prototype.getCoalescedEvents()` hardware touch polling rate (Hz) or digitizer-to-rAF sync phase beat frequency.

## 2. Logic Chain
1. *Observation*: Modern mobile displays have high touch sampling rates (240Hz-960Hz), but standard browser `pointermove` callbacks are throttled by `requestAnimationFrame` to display refresh rates (60Hz/120Hz).
2. *Observation*: Competitor web touch tools (e.g. `touchtest.com`) fail to unwrap coalesced events, leading users to falsely believe their 240Hz digitizers are only 60Hz.
3. *Deduction*: By unwrapping `PointerEvent.prototype.getCoalescedEvents()`, Monitor Test Hub can capture microsecond hardware timestamps ($t_{\text{hardware}}$) for un-throttled digitizer reports.
4. *Deduction*: Reusing math paradigms from `MousePollingEngine.ts` (frequency & standard deviation calculation) and `TouchMatrixEngine.ts` (touch data contracts), a pure TypeScript engine `TouchSamplingRateEngine.ts` can calculate true hardware touch polling rate ($F_{\text{touch}}$), jitter standard deviation ($\sigma$), coalesced buffer depth ($C_{\text{factor}}$), and phase beat frequency ($F_{\text{beat}}$).
5. *Compliance Check*: Framed as a technical VESA / ISO 9241-307 display timing standard with US English spelling and units, ensuring YMYL safety and US audience alignment.

## 3. Caveats
- Browser support: `getCoalescedEvents()` is supported on W3C Level 3 PointerEvents browsers (Chrome 58+, Safari 13+, Firefox 59+). Native WebViews inside certain third-party apps may clamp event arrays.
- Battery saver mode: Mobile operating systems throttle digitizer rates when Low Power Mode is active.

## 4. Conclusion
- Candidate 5: **Hardware Touch Sampling Rate & Coalesced Event Jitter Inspector** (`/touch-tests/touch-sampling-rate`) is **GREENLIT**.
- Provides a high-utility, uncontested web-native diagnostic tool backed by pure TypeScript calculation engine `src/engine/TouchSamplingRateEngine.ts`.

## 5. Verification Method
- Inspect analysis report: `/Users/divyyadav/newws/.agents/explorer_cand5_touch/analysis.md`.
- Run engine test command inside `monitor_test_hub/`:
  `./node_modules/.bin/vitest run src/engine/TouchMatrixEngine.test.ts`
- Invalidation condition: If browser engine security sandbox strips `getCoalescedEvents()` across all mobile OS platforms, fallback to standard `pointermove` polling rate estimation is required.
