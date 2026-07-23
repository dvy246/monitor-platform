## 2026-07-23T04:23:03Z
Redesign and upgrade all touch test pages (`touch-tests/dead-zone.astro`, `input-lag.astro`, `multi-touch.astro`, `stylus-pressure.astro`, `swipe-velocity.astro`, `touch-sampling-rate.astro`, `vector-precision.astro`, `touch-tests/index.astro`), touch matrix pages (`touch-matrix/charger-emi-inspector.astro`, `touch-matrix/index.astro`, `touch-matrix/[deviceType]/[gridDensity].astro`), and sound test pages (`sound-test/audio-latency.astro`, `bass-test.astro`, `binaural-beats.astro`, `camera-mic-test.astro`, `headphone-test.astro`, `hearing-test.astro`, `microphone-test.astro`, `speaker-test.astro`, `surround-sound.astro`, `tone-generator.astro`, `audio-tests/mic-noise-floor.astro`, `audio-tests/speaker-frequency.astro`).

Requirements for every page:
1. Curved Container Boxes & Specular Highlights (`rounded-3xl`/`rounded-2xl` + `border-white/10` or `border-border-hairline`).
2. 4-part Master Bento Diagnostic Suite (`MasterBentoDiagnosticSuite.astro` or interactive bento tool deck).
3. Numbered Step Workflow Section (`StepWorkflowSection.astro` with steps `01`, `02`, `03`).
4. Panel Type Breakdown Section (`PanelTypeBreakdownSection.astro` with Professional IPS, Consumer IPS, VA Panel, OLED).
5. E-E-A-T Technical SEO article with EXACTLY 10 structured FAQs in `faqs` array passed to `<Layout faqs={faqs}>` and rendered with `<FAQSection faqs={faqs} />`.
