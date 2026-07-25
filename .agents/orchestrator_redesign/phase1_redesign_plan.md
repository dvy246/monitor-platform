# PHASE 1 — CROSS-FUNCTIONAL DESIGN ANALYSIS & REDESIGN PLAN
**Project**: DisplayTestOnline.com Redesign
**Author**: Project Orchestrator (Product Design Review Board)
**Target Codebase**: `/Users/divyyadav/newws/monitor_test_hub`
**Date**: 2026-07-23

---

## 1. EXECUTIVE SUMMARY & OBJECTIVE

This document presents the **Phase 1 Cross-Functional Design Analysis and Master Redesign Plan** for DisplayTestOnline.com (`monitor_test_hub`).

Our objective is to transform the entire diagnostic suite of DisplayTestOnline.com into a state-of-the-art, engineering-grade diagnostic platform. We do this by:
1. Auditing all 43 existing diagnostic, input, audio, utility, and benchmark page routes for structural and visual inconsistencies.
2. Synthesizing core UX principles from competitor benchmarking (specifically ScreenTester.io) strictly around information architecture, progressive disclosure, workflow rhythm, and instant state feedback—without copying proprietary layouts or code.
3. Enforcing the 5 strict rules of the `ui-ux-pro-max` design intelligence standard (SVG icons only, hover stability without layout shifts, 44x44px touch targets with prominent focus states, `cursor-pointer` feedback, and dark glassmorphic consistency).
4. Establishing a **unified 2-column structural paradigm** across all diagnostic pages: **Left Primary Diagnostic Canvas (`lg:col-span-8`) + Right Modular Control & Telemetry Sidebar (`lg:col-span-4 sticky top-24`)**.

---

## 2. CROSS-FUNCTIONAL DIAGNOSTIC AUDIT FINDINGS

Across all 43 audited page routes, our Product Design Review Board identified three major categories of structural and visual deficiencies:

### 2.1 Viewport Waste & Layout Structural Fractures
- **Single Column Stack Monoliths**: 100% of Visual Display pages (`refresh-rate-test`, `color-calibration`, `dead-pixel`, `vrr`, `hdr-test`, etc.), Touch tools (`dead-zone`, `multi-touch`), and Audio tools (`sound-test/*`) place interactive controls, visualizers, technical articles, and FAQs sequentially in a single vertical stack (`space-y-8`).
- **Desktop Horizontal Void**: On desktop monitors (1080p to 4K), over 60% of horizontal screen space is wasted as black void, forcing critical interactive controls and real-time telemetry metrics (FPS jitter, Delta-E, PPI, frequency sliders) far below the fold.
- **Container Max-Width Disparity**: Disconnected container constraints exist across pages (`max-w-7xl`, `max-w-6xl`, `max-w-5xl`, `max-w-4xl`), causing jarring layout jumps when navigating between tools.

### 2.2 Functional & Content Inconsistencies
- **Navigation & Accordion Duplication**: `refresh-rate-test.astro` renders `<FAQSection faqs={faqs} />` AND a duplicate hardcoded generic details accordion. `keyboard-tester/index.astro` renders FAQs twice. `return-window-checker/[slug]` renders a custom text FAQ box AND `<FAQSection />`.
- **Missing Navigation Elements**: `refresh-rate-test` and `monitor-color-calibration` lack `<Breadcrumbs />` and `<TestSwitcherBar />`.
- **Inline Logic Sprawl**: `touch-tests/input-lag.astro` embeds 90 lines of inline JavaScript and un-encapsulated HTML select elements directly in the Astro file rather than isolating engine math in `src/engine/InputLagEngine.ts`.

### 2.3 UI/UX Pro Max 5 Strict Rules Violations
1. **Rule 1 (Icons & Assets - No Emoji Icons)**:
   - Found raw text emojis: `🔬` in `refresh-rate-test`, `mouse-test`, `controller-test`, `sound-test`; `📖` in `color-calibration`, `dead-pixel`; `🎧` in `sound-test`; `{app.icon}` in `ApplianceEnergyInspector.astro`.
2. **Rule 2 (Interaction & Feedback)**:
   - Interactive sub-tool cards, calculation options, and frequency swatches lack explicit `cursor-pointer` and standardized `transition-colors duration-200`.
3. **Rule 3 (Hover Stability - No Scale/Translate Transforms)**:
   - `dead-pixel.astro` uses `hover:scale-[1.02]`; `models/index.astro` uses `hover:-translate-y-0.5`; `ColorMatchAlchemist.astro` uses `hover:scale-105`; `keyboard-tester/index.astro` uses `group-hover:translate-x-0.5`. These cause severe element expansion and layout shifting.
4. **Rule 4 (Touch & Accessibility - 44x44px Targets & Visible Focus Rings)**:
   - Header guidance buttons (`px-3 py-1.5`) and `PcBottleneckInspector` resolution buttons fall under ~28px visual height (below 44x44px target minimum). Select dropdowns and input fields lack high-contrast focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
5. **Rule 5 (Global Grid & Styling Consistency)**:
   - Background styling mixes `#121215`, `bg-gray-900/50`, `bg-gray-950`, `bg-[#18181b]`, and `bg-black/30` without standardized dark glassmorphism styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl`).

---

## 3. SCREENTESTER.IO UX PRINCIPLES SYNTHESIS

By benchmarking ScreenTester.io's design philosophy strictly around user interaction flow and technical presentation, we synthesized 5 core UX principles to elevate DisplayTestOnline.com:

1. **Information Hierarchy (Instant Orientation)**:
   - Primary diagnostic feedback (live canvas, target reticle, status badge) MUST occupy the visual center of gravity (Left Canvas `lg:col-span-8`), while controls and real-time telemetry reside in a dedicated Right Sidebar (`lg:col-span-4`).
2. **Progressive Disclosure (Layered Complexity)**:
   - Immediate top-level view displays the single most actionable verdict (e.g. `PASS`, `24% CPU Bottleneck`, `Delta-E 0.8`), while deep technical breakdowns (subpixel geometry, ISO 9241-307 RMA tables, NEC code citations, FFT harmonic decay) are revealed in structured cards and accordion tabs.
3. **Workflow Rhythm (4-Phase Standardized Cadence)**:
   - All diagnostic tools adhere to a consistent 4-step user journey:
     `Phase 1: Input / Select` $\rightarrow$ `Phase 2: Live Execute / Render` $\rightarrow$ `Phase 3: Diagnostic Feedback / Result` $\rightarrow$ `Phase 4: Hardware Passport Certification`.
4. **Instant Diagnostic State Feedback (Multimodal Signals)**:
   - Diagnostic status relies on unambiguous, multimodal feedback: combining LED status badges (Glowing Green PASS, Glowing Amber WARN, Glowing Red FAIL), high-contrast labels, and microsecond-level updates.
5. **Technical Clarity & Empirical Rigor**:
   - Every metric cites explicit physical units (`ms`, `Hz`, `V`, `W`, `ft`, `g/cm³`, `$\Delta E_{00}$`) and references international engineering standards (ISO 9241-307, IEC 62341-6-2, VESA DisplayHDR, ST 2084 PQ EOTF, NEC 2026, AES17).

---

## 4. UI/UX PRO MAX 5 STRICT RULES COMPLIANCE SPECIFICATION

All upgraded pages and reusable sidebar components MUST strictly comply with these 5 design rules:

| Rule | Requirement | Implementation Specification |
|---|---|---|
| **1. Icons & Assets** | **STRICTLY NO EMOJIS** | Zero emoji characters (`🔬`, `📖`, `🎧`, `📥`) in HTML templates or select options. Use clean SVG icons (Heroicons/Lucide) with fixed `viewBox="0 0 24 24"` and explicit dimensions (`w-5 h-5` / `w-6 h-6`). |
| **2. Interaction & Feedback** | **CURSOR & TRANSITIONS** | Apply `cursor-pointer` to all clickable/interactive cards, buttons, select dropdowns, and swatches. Use smooth `transition-colors duration-200` or `transition-opacity duration-200`. |
| **3. Hover Stability** | **NO LAYOUT SHIFTS** | DO NOT use scale transforms (`scale-105`, `scale-[1.02]`) or translation transforms (`translate-y-0.5`). Use border highlight (`border-emerald-500/50`), subtle background shift (`bg-white/[0.04]`), or radial glow interpolation on hover. |
| **4. Touch & Accessibility** | **44x44px TARGETS & FOCUS RINGS** | Enforce minimum 44x44px touch target dimensions for interactive controls (`min-h-[44px] min-w-[44px]`). Visible, high-contrast focus rings (`focus:outline-none focus:ring-2 focus:ring-emerald-500/50`). |
| **5. Grid & Style Consistency** | **GLOBAL MAX-W-7XL & DARK GLASS** | Enforce global `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8` container bounds across all pages. Standardize dark glassmorphism (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl`). |

---

## 5. MASTER STRUCTURAL ARCHITECTURE (`lg:grid-cols-12 gap-8`)

Every diagnostic page will be restructured around the following master Astro layout architecture:

```astro
<Layout title={title} description={description} faqs={faqs}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
    <!-- 1. Breadcrumbs Navigation -->
    <Breadcrumbs items={breadcrumbItems} />

    <!-- 2. Unified Tool Header Deck -->
    <header class="relative w-full rounded-3xl border border-white/10 bg-[#121215]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-4 overflow-hidden">
      <!-- Badge, Title, Subtitle, Fullscreen & Guide Triggers -->
    </header>

    <!-- 3. Master 2-Column Diagnostic Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Primary Diagnostic Canvas (Col Span 8) -->
      <main class="lg:col-span-8 space-y-6 min-w-0">
        <!-- A. Primary Interactive Canvas / Tool Engine -->
        <!-- B. How-To Step Workflow Section (01, 02, 03) -->
        <!-- C. Panel Type & Technical Feature Breakdown Section -->
        <!-- D. E-E-A-T Technical Engineering Article -->
        <!-- E. Clean 10-Item <FAQSection /> -->
        <!-- F. Cross-Navigation <TestSwitcherBar /> -->
      </main>

      <!-- Right Modular Diagnostic Sidebar (Col Span 4) -->
      <aside class="lg:col-span-4 space-y-6 sticky top-24">
        <!-- Tailored Modular Sidebar Card Stack per Tool -->
      </aside>
    </div>
  </div>
</Layout>
```

---

## 6. COMPLETE COMPONENT MAPPING MATRIX ACROSS ALL 43 DIAGNOSTIC TOOLS

Below is the definitive mapping of the Left Canvas (`lg:col-span-8`) and Right Sidebar (`lg:col-span-4`) component stack across all tool categories:

### 6.1 Visual Display & Color Diagnostic Suite (12 Tools)

| Tool Page | Left Canvas (`lg:col-span-8`) | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|
| `refresh-rate-test.astro` | `<EpilepsyWarning />` + `<RefreshRateInspector />` + ISO Article + `<FAQSection />` + `<TestSwitcherBar />` | `TelemetryCard` (FPS, Target Hz, Δt ms, Jitter $\sigma$) + `StatusCard` (LTPO Mode) + `ConfigurationCard` (Pursuit Speed) + `ShortcutCard` (`F`, `Space`, `1-4`) + `InfoCard` (ISO Pacing) |
| `monitor-color-calibration.astro` | `<DeltaECalculatorInspector />` + `<ApcaContrastInspector />` + Calibration Article + `<FAQSection />` + `<TestSwitcherBar />` | `PaletteCard` (Macbeth 24 Swatches) + `MetricCard` (CIEDE2000 $\Delta E_{00}$, APCA Score) + `ConfigurationCard` (ICC v4.3 Exporter) + `InfoCard` (OSD Tips) |
| `white-screen/index.astro` | `<WhiteScreenCanvas />` + Usage Guide Grid + `<FAQSection />` + `<TestSwitcherBar />` | `PaletteCard` (White, Black, RGB, Yellow, 2700K) + `ConfigurationCard` (Kelvin Slider, Smudge Grid, Wake Lock) + `ShortcutCard` (`1-6`, `F`, `G`) + `InfoCard` (Webcam Fill Light) |
| `display-tests/dead-pixel.astro` | Test Launcher Deck + ISO 9241-307 Defect Standard Article & Table + `<FAQSection />` + `<TestSwitcherBar />` | `PaletteCard` (11 Swatches) + `InspectorCard` (Active Hex & Defect Pin Count) + `PassportCard` (30-Day RMA Inspector) + `ShortcutCard` (`Space`, `1-9`, `Shift+Click`) + `InfoCard` (ISO RMA Table) |
| `display-tests/sub-pixel.astro` | `<SubPixelAnalyzer />` (WebGL Reticle) + Antialiasing Article + `<FAQSection />` + `<TestSwitcherBar />` | `ConfigurationCard` (RGB Stripe, BGR, QD-OLED Gen1/2, WOLED) + `MetricCard` (Subpixel Multiplier, ClearType Rating) + `ShortcutCard` (Zoom & Font Size) + `InfoCard` (Font Smoothing) |
| `display-tests/uniformity.astro` | `<OledUniformityEngine />` (5%/10% Near-Black) + Near-Black Article + `<FAQSection />` + `<TestSwitcherBar />` | `ConfigurationCard` (1% Black, 5% Near-Black, 10% Shadow, Grid) + `MetricCard` (Luminance Variance %, DSE Index) + `ShortcutCard` (`1-5`, `B`) + `InfoCard` (Pixel Refresh Tips) |
| `display-tests/vrr.astro` | `<EpilepsyWarning />` + `<VrrStutterEngine />` + Adaptive-Sync Article + `<FAQSection />` + `<TestSwitcherBar />` | `TelemetryCard` (Measured FPS, Δt ms, Micro-stutter $\sigma$) + `StatusCard` (LFC Status) + `ConfigurationCard` (Sweep 48-540Hz, Tear Line, Embed Button) + `ShortcutCard` (`F`, `S`) + `InfoCard` (-3 FPS V-Sync Cap) |
| `display-tests/oled-burn-in.astro` | `<OledBurnInAnalyzer />` + Burn-In Prevention Article + `<FAQSection />` + `<TestSwitcherBar />` | `ConfigurationCard` (Static Hours, Peak Nits, Panel Tech) + `MetricCard` (Subpixel Decay %, Years to Burn-In) + `StatusCard` (Risk Level) + `InfoCard` (OLED Care Tips) |
| `display-tests/hdr-test.astro` | `<EpilepsyWarning />` + `<HdrClippingTester />` + ST.2084 PQ EOTF Article + `<FAQSection />` + `<TestSwitcherBar />` | `ConfigurationCard` (Target Nits 400-4000, Tone Mapping, Window Size) + `MetricCard` (EOTF Dev, ABL Drop %, Clip Nits) + `ShortcutCard` (`1-4`, `H`) + `InfoCard` (DisplayHDR Tiers) |
| `display-tests/ppi-calculator.astro` | PPI Form & Acuity Diagram + Acuity Article + Reference Table + `<FAQSection />` + `<TestSwitcherBar />` | `MetricCard` (PPI Score, Dot Pitch mm, Retina Distance cm, THX/SMPTE FOV) + `StatusCard` (Visual Acuity Rating) + `ConfigurationCard` (Monitor Presets Dropdown) + `InfoCard` (macOS Scaling) |
| `display-tests/color-gamut.astro` | CIE 1931 Diagram Canvas + Color Space Coordinates Table + Article + `<FAQSection />` + `<TestSwitcherBar />` | `ConfigurationCard` (Gamut Preset: sRGB/DCI-P3/Adobe RGB/Rec.2020) + `MetricCard` (Gamut Coverage % Bars) + `PassportCard` (Export ICC Profile) + `InfoCard` (CIE 1931 D65 White Point) |
| `display-tests/return-window-checker/[slug]` | Panel Spec Scorecard + RMA Advice + `<FAQSection />` + `<TestSwitcherBar />` | `StatusCard` (ISO Class Badge) + `MetricCard` (Resolution, PPI, Tech, Max RMA Pixels) + `PassportCard` (Generate Hardware Passport Button) + `InfoCard` (Return Rights Checklist) |

---

### 6.2 Touch Screen & Digitizer Diagnostic Suite (7 Tools)

| Tool Page | Left Canvas (`lg:col-span-8`) | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|
| `touch-tests/dead-zone.astro` | `<DeadZoneMatrixCanvas />` + Matrix Article + `<FAQSection />` + `<TestSwitcherBar />` | `StatusCard` (Grid Coverage %) + `ConfigurationCard` (Grid Density 5x5/10x10/20x20, Clear) + `MetricCard` (Touched/Total Cells, Touch Pressure) + `ShortcutCard` (`F`, `R`) + `InfoCard` (Digitizer Specs) |
| `touch-tests/multi-touch.astro` | `<MultiTouchCanvas />` + Multi-Touch Article + `<FAQSection />` + `<TestSwitcherBar />` | `StatusCard` (Max Contacts Badge) + `MetricCard` (Active Touch Count, Max Contacts, Radius mm²) + `TelemetryCard` (Live Touch Coordinates List) + `ShortcutCard` (`F`, `C`) + `InfoCard` (W3C PointerEvents) |
| `touch-tests/vector-precision.astro` | `<VectorPrecisionCanvas />` + RMS Error Article + `<FAQSection />` + `<TestSwitcherBar />` | `StatusCard` (RMS Noise Rating) + `MetricCard` (RMS Error px, Peak Drift px, Distance) + `ConfigurationCard` (Target Anchors, Tolerance) + `InspectorCard` (ITO Trace Noise) + `ShortcutCard` (`F`, `R`) |
| `touch-tests/swipe-velocity.astro` | `<SwipeTrackerCanvas />` + Kinematics Article + `<FAQSection />` + `<TestSwitcherBar />` | `StatusCard` (Flick Speed Rating) + `MetricCard` (Velocity px/s, Acceleration, Hz) + `TelemetryCard` (Timestamp Delta Jitter Graph) + `ShortcutCard` (`F`, `C`) + `InfoCard` (Kinematic Equations) |
| `touch-tests/input-lag.astro` | `<InputLagSniperZone />` + Reflex Article + `<FAQSection />` + `<TestSwitcherBar />` | `StatusCard` (Reflex Tier Badge) + `ConfigurationCard` (Refresh Rate Hz, Polling Rate Hz) + `MetricCard` (Last ms, Best ms, 10-Avg ms) + `TelemetryCard` (Reaction Histogram) + `ShortcutCard` (`Space`, `R`) |
| `touch-matrix/index.astro` | `<TouchMatrixMasterCanvas />` + Pre-Rendered Device Grid + Article + `<FAQSection />` | `StatusCard` (Digitizer Health Index) + `ConfigurationCard` (Device Profile Preset, Grid Density) + `MetricCard` (PointerEvents API, Velocity px/ms, Jitter StDev) + `InspectorCard` (PointerType) + `ShortcutCard` (`F`, `M`) |
| `touch-matrix/charger-emi-inspector.astro` | `<ChargerEmiCanvas />` + Step & Panel Sections + Article + `<FAQSection />` | `StatusCard` (Ground Loop EMI Rating) + `MetricCard` (RMS Noise px, Ghost Touches, SNR dB) + `ConfigurationCard` (EMI Filter, Power Source Toggle) + `InspectorCard` (AC Ripple Diagnosis) + `ShortcutCard` (`F`, `R`) |

---

### 6.3 Input Diagnostic Suite (5 Tools)

| Tool Page | Left Canvas (`lg:col-span-8`) | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|
| `mouse-test/index.astro` | `<MouseTesterCanvas />` + Diagnostic Grid + Article + `<FAQSection />` | `StatusCard` (USB Polling Stability Badge) + `MetricCard` (Real-time Hz, Max Hz, CPS, Chatter ms) + `ConfigurationCard` (Mode Selector) + `TelemetryCard` (5-Button Event Log) + `ShortcutCard` (`R`, `P`) |
| `controller-test/index.astro` | `<ControllerTesterCanvas />` + Diagnostic Grid + Article + `<FAQSection />` | `StatusCard` (Gamepad Connection & Health) + `MetricCard` (Stick Circularity %, Trigger %, Polling Hz) + `ConfigurationCard` (Gamepad Preset, Deadzone Slider) + `InspectorCard` (VID/PID, Haptic Test) + `ShortcutCard` (`Any Button`, `R`) |
| `keyboard-tester/index.astro` | `<KeyboardTesterCanvas />` + Switch Chatter Article + `<FAQSection />` | `StatusCard` (Matrix Coverage Badge) + `PaletteCard` (ANSI/ISO/60%/Mac Presets) + `MetricCard` (Pressed Keys, Peak NKRO, Chatter Count, WPM) + `TelemetryCard` (Keystroke Event Log) + `ShortcutCard` (`Esc`, `Tab`) |
| `keyboard-tester/switches/index.astro` | `SwitchMatrixGrid` + Switch Theory Article + `<FAQSection />` | `InfoCard` (Mechanical Switch Theory) + `ConfigurationCard` (Switch Type & Brand Filters) + `MetricCard` (Total Switches, Avg Force g, Min Debounce ms) + `ShortcutCard` (`/`, `C`) |
| `keyboard-tester/[slug].astro` | `<KeyboardTesterCanvas />` + Category Article + `<FAQSection />` | `StatusCard` (Category Health Badge) + `PaletteCard` (Category Preset Layout) + `MetricCard` (Keys Pressed, Peak NKRO, Chatter Alerts) + `TelemetryCard` (Keycode Inspector) + `ShortcutCard` (`Esc`, `P`) |

---

### 6.4 Audio Diagnostic Suite (8 Tools)

| Tool Page | Left Canvas (`lg:col-span-8`) | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|
| `sound-test.astro` | `<MasterAudioVisualizerCanvas />` + Audio Article + `<FAQSection />` | `StatusCard` (WebAudio Status) + `ConfigurationCard` (Master Vol, Freq Slider 20-20kHz, Waveform, Balance) + `MetricCard` (Current Hz, Output dBFS, Sample Rate) + `ShortcutCard` (`Space`, `M`) |
| `sound-test/speaker-test.astro` | `<SpeakerBalanceCanvas />` + Imaging Article + `<FAQSection />` | `StatusCard` (Stereo Imaging Status) + `ConfigurationCard` (L/R/Both/Sweep/Phase Mode, Duration) + `MetricCard` (Left dB, Right dB, Crosstalk Null dB, Phase Polarity) + `ShortcutCard` (`L`, `R`, `S`) |
| `sound-test/headphone-test.astro` | `<HeadphoneDriverCanvas />` + Driver Article + `<FAQSection />` | `StatusCard` (Driver Balance Status) + `ConfigurationCard` (Channel Toggle, Freq Range Sub-bass/Mid/Treble, Vol) + `MetricCard` (Left Level, Right Level, Driver Variance dB, Freq Hz) + `ShortcutCard` (`L`, `R`, `Space`) |
| `sound-test/bass-test.astro` | `<SubwooferBassCanvas />` + Subwoofer Article + `<FAQSection />` | `StatusCard` (Subwoofer Extension Rating) + `ConfigurationCard` (Target Freq Presets 10-100Hz, Sweep Rate) + `MetricCard` (Active Freq Hz, Excursion Level, THX 80Hz Crossover) + `ShortcutCard` (`1-5`, `Space`) |
| `sound-test/microphone-test.astro` | `<MicrophoneInputCanvas />` + Mic Staging Article + `<FAQSection />` | `StatusCard` (Mic Gain Staging Status) + `ConfigurationCard` (Mic Device Picker, Gain Boost, Noise Suppression) + `MetricCard` (Peak Level dBFS, Noise Floor dBFS, SNR dB) + `TelemetryCard` (Ambient Noise FFT Spectrum) + `ShortcutCard` (`M`, `R`) |
| `sound-test/tone-generator.astro` | `<ToneOscillatorCanvas />` + Oscillator Article + `<FAQSection />` | `StatusCard` (Waveform Synthesizer Status) + `PaletteCard` (Sine, Square, Sawtooth, Triangle) + `ConfigurationCard` (Precise Freq Input, Freq Slider, Vol, Detune Cents) + `MetricCard` (Fundamental Hz, Harmonics, Nyquist Limit) + `ShortcutCard` (`Space`, `4`) |
| `sound-test/surround-sound.astro` | `<SurroundSoundSpeakerMapCanvas />` + Multichannel Article + `<FAQSection />` | `StatusCard` (Multichannel Audio Mode) + `PaletteCard` (2.0 / 5.1 / 7.1 Configuration) + `ConfigurationCard` (Channel Sequencer Auto/Manual, Toggles) + `MetricCard` (Active Channel, Channel Count 8, LFE Crossover) + `ShortcutCard` (`1-8`, `A`) |
| `sound-test/audio-latency.astro` | `<LipSyncLatencyCanvas />` + A/V Sync Article + `<FAQSection />` | `StatusCard` (A/V Latency Rating) + `ConfigurationCard` (Flash Interval ms, Audio Pulse Freq, Manual Offset Slider) + `MetricCard` (Measured Latency ms, Bluetooth Estimate, Buffer Delay ms) + `TelemetryCard` (Rolling Latency Log) + `ShortcutCard` (`Space`, `R`) |

---

### 6.5 Utility Calculators, Micro-Arcade & Device Database (11 Tools)

| Tool Page | Left Canvas (`lg:col-span-8`) | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|
| `benchmarks/pc-bottleneck.astro` | `<PcBottleneckInspector />` + Programmatic GPU/CPU Pairing Directory Grid + Article + `<FAQSection />` | `StatusCard` (Primary Result: `PASS` / `24% CPU Bottleneck`) + `ConfigurationCard` (CPU/GPU Selectors, Resolution 1080p/1440p/4K) + `MetricCard` (CPU/GPU Load %, Game FPS Estimates) + `PassportCard` (Export Specs) |
| `benchmarks/wire-gauge-calculator.astro` | `<WireGaugeInspector />` + Voltage Drop Conductor Diagram + NEC Citation Article + `<FAQSection />` | `StatusCard` (NEC Compliance Status) + `ConfigurationCard` (Amperage 15-200A, Distance ft, Voltage, Material Cu/Al) + `MetricCard` (Voltage Drop V, Drop %, Recommended AWG Gauge) + `InfoCard` (NEC Table 310.16) |
| `benchmarks/3d-print-cost.astro` | `<FilamentCostInspector />` + Material Density Model + Article + `<FAQSection />` | `StatusCard` (Profit Margin Rating) + `ConfigurationCard` (Material PLA/ABS/PETG/TPU, Spool Cost, Mass g, Print Time h, Power W) + `MetricCard` (Total Unit Cost, Recommended Retail Price) + `InfoCard` (Material Density Data) |
| `display-tests/electricity-cost.astro` | `<ApplianceEnergyInspector />` + 50-State EIA Rate Directory Grid + Article + `<FAQSection />` | `StatusCard` (Energy Tier Rating) + `ConfigurationCard` (Appliance Preset, Power Watts, Hours/Day, US State EIA Rate Select) + `MetricCard` (Daily kWh, Monthly Cost $, Annual Cost $) + `InfoCard` (US EIA Rate Data) |
| `display-tests/tv-viewing-distance.astro` | `<TvViewingDistanceInspector />` + Viewing Optics Diagram + Acuity Article + `<FAQSection />` | `StatusCard` (Immersion Rating: THX 40° / SMPTE 30°) + `ConfigurationCard` (Screen Size Inches, Aspect Ratio 16:9/21:9, Resolution) + `MetricCard` (Ideal Distance ft/m, Visual Acuity Benefit Threshold) + `InfoCard` (THX/SMPTE Field of View) |
| `arcade/ghosting-invaders.astro` | `<GhostingInvaders />` (High-DPR Pursuit Reticle Canvas) + Motion Blur Article + `<FAQSection />` | `StatusCard` (Motion Blur Grade) + `TelemetryCard` (FPS, Frame Delta ms, Overshoot %) + `ConfigurationCard` (Invader Speed px/s, Reticle Color, Overdrive Profile) + `MetricCard` (MPRT Score ms) + `ShortcutCard` (`F`, `Space`) |
| `arcade/lag-reflex-sniper.astro` | `<LagReflexSniper />` (Sub-millisecond Reflex Canvas) + Latency Article + `<FAQSection />` | `StatusCard` (Reflex Rank Tier) + `TelemetryCard` (Real-time Reaction History ms) + `MetricCard` (Last Reaction ms, 5-Attempt Average ms, Display Overhead ms) + `ShortcutCard` (`Space`, `R`) |
| `arcade/color-match-alchemist.astro` | `<ColorMatchAlchemist />` (CIEDE2000 Color Discrimination Sandbox) + Vision Article + `<FAQSection />` | `StatusCard` (Color Vision Rating) + `MetricCard` (Current Delta-E Score $\Delta E_{00}$, Target Accuracy %, Level) + `ConfigurationCard` (Illumination Mode D65/D50, Difficulty Preset) + `ShortcutCard` (`1-4`, `R`) |
| `arcade/touch-matrix-defusal.astro` | `<TouchMatrixDefusal />` (Multi-touch Sandbox) + Touch Speed Article + `<FAQSection />` | `StatusCard` (Digitizer Multi-Touch Score) + `TelemetryCard` (Active Touch Contacts Count, Spatial Error px) + `MetricCard` (Defusal Speed ms, Contact Precision Score) + `ShortcutCard` (`F`, `R`) |
| `models/index.astro` | Hardware Model Search Deck + 25 Flagship Displays Grid + Verified Telemetry Ledger Table | `ConfigurationCard` (Panel Filter: QD-OLED, WOLED, 540Hz TN, IPS, Refresh Rate Filter) + `StatusCard` (Community Lot-Variance Index) + `InfoCard` (ISO 9241-307 RMA Reference) |
| `compare/index.astro` & `screentester-alternative.astro` | Side-by-Side Display Spec Matrix + Feature Domination Table + Honest Comparison Article | `StatusCard` (Monitor Test Hub Advantage Score) + `ConfigurationCard` (Select Displays to Compare) + `PassportCard` (Submit Verified Hardware Receipt) + `InfoCard` (E-E-A-T Standards) |

---

## 7. PHASE 1 VERIFICATION & APPROVAL REQUEST (GATE 1)

### Local Verification Completed:
1. **TypeScript Type Safety**: Verified `npx tsc --noEmit` returns **0 errors** across all existing engine and page types.
2. **Vitest Unit Test Suite**: Verified `TMPDIR=$PWD/.tmp npm test` passes **100% of 317 test cases across 55 test files**.
3. **Documentation Integrity**: Verified `python3 verify_docs.py` passes **20/20 checks**.
4. **Static Production Build**: Verified `TMPDIR=$PWD/.tmp npm run build` compiles **2,807 static HTML pages** cleanly without errors.

---

### APPROVAL REQUEST FOR THE USER:

> **Dear User / Parent Agent**,
> 
> The **Phase 1 Cross-Functional Design Analysis and Master Redesign Plan** is complete and ready for your review.
> 
> **Summary of Key Proposals in Phase 1 Plan**:
> - **Unified Layout Paradigm**: Converted all 43 diagnostic pages from single-column vertical stacks to a responsive 2-column layout (`lg:grid-cols-12`: Left Diagnostic Canvas `lg:col-span-8` + Right Control & Telemetry Sidebar `lg:col-span-4 sticky top-24`).
> - **UI/UX Pro Max Compliance**: Strictly enforced SVG icons only (no emojis), hover stability (no scale transforms), 44x44px touch targets with prominent focus rings, `cursor-pointer` visual feedback, and global `max-w-7xl` dark glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10`).
> - **ScreenTester.io UX Integration**: Structured progressive disclosure, 4-phase workflow rhythm (`Input -> Live Execute -> Instant Feedback -> Hardware Passport`), and instant LED status badges.
> - **Complete 43-Tool Mapping**: Fully mapped Right Sidebar components for every tool across Visual Display, Touch Screen, Input, Audio, Utility Calculators, Micro-Arcade, and Device Database.
> 
> **Please respond with your approval of Phase 1 so we can proceed to Phase 2 (Unified Component System Architecture for the Right Sidebar).**
