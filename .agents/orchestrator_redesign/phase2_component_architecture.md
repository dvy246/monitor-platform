# PHASE 2 — UNIFIED COMPONENT SYSTEM ARCHITECTURE & MAPPING PLAN
**Project**: DisplayTestOnline.com Redesign
**Author**: Project Orchestrator (Product Design Review Board)
**Target Codebase**: `/Users/divyyadav/newws/monitor_test_hub`
**Date**: 2026-07-23

---

## 1. EXECUTIVE SUMMARY & APPROVAL GOAL

This document presents the **Phase 2 Unified Component System Architecture and 43-Route Component Mapping Plan** for DisplayTestOnline.com (`monitor_test_hub`).

Following user approval of Phase 1 (Cross-Functional Design Analysis), Phase 2 defines the exact technical specification for all 9 reusable Right Sidebar Astro components and provides an exhaustive component mapping matrix across all 43 diagnostic tool routes on DisplayTestOnline.com.

---

## 2. REUSABLE RIGHT SIDEBAR COMPONENT SYSTEM ARCHITECTURE (9 COMPONENTS)

All components share a unified dark glassmorphism container design (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl`), enforce strict TypeScript interfaces, include zero text emojis, provide 44x44px min touch target sizing, and strictly adhere to the 5 rules of `ui-ux-pro-max`.

### 2.1 `InfoCard.astro` — Technical Standards & OSD Guidance Component
- **Function**: Displays international engineering citations (ISO 9241-307 Class I-IV, IEC 62341-6-2, VESA DisplayHDR, ST 2084 PQ EOTF, NEC 2026 Table 310.16, AES17-2015), Monitor OSD gain/contrast tuning tips, and educational context.
- **Props**: `title`, `subtitle`, `citations: Citation[]`, `osdTips: string[]`, `educationalNotes: string[]`, `badgeText`, `accentColor`.
- **UI/UX Highlights**: Clean SVG Heroicons/Lucide icons, theme badge chips, and expandable citation boxes.

### 2.2 `MetricCard.astro` — Technical Metrics & Physical Units Readout Component
- **Function**: Displays single hero or multi-metric grid metrics with progress bars, physical units (`Hz`, `ms`, `ΔE00`, `PPI`, `V`, `W`, `dBFS`, `px/s`, `g/cm³`), delta change values ($\Delta$), and high-contrast labels.
- **Props**: `title`, `subtitle`, `metrics: MetricItem[]`, `layout: 'hero' | 'grid' | 'list'`, `badgeText`.
- **UI/UX Highlights**: Status-colored progress bars (`emerald`/`amber`/`rose`), data-metric-id hooks for live microsecond DOM updates.

### 2.3 `ShortcutCard.astro` — Standardized Hotkey & Remote Guidance Component
- **Function**: Displays keyboard hotkey capsules (`<kbd>`), action labels, and amber TV remote D-Pad hint banner.
- **Props**: `title`, `subtitle`, `shortcuts: ShortcutItem[]`, `showTvBanner: boolean`, `tvBannerText`.
- **UI/UX Highlights**: 3D-styled `<kbd>` capsules (`bg-[#1a1a24] border-white/20 shadow-[0_2px_4px_rgba(0,0,0,0.4)]`) and TV remote arrow key guide.

### 2.4 `ConfigurationCard.astro` — Parameter Tuning & Interactive Control Component
- **Function**: Displays range sliders, toggle switches, select dropdowns, preset buttons, and numeric inputs for adjusting diagnostic parameters.
- **Props**: `title`, `subtitle`, `controls: ControlField[]`, `badgeText`, `onConfigChange`.
- **UI/UX Highlights**: Minimum 44x44px touch targets (`min-h-[44px]`), high-contrast focus rings (`focus:ring-2 focus:ring-emerald-500/50`), data-control-id hooks.

### 2.5 `StatusCard.astro` — Multimodal LED Status & Health Verdict Component
- **Function**: Displays multimodal LED status indicators (`PASS`, `WARN`, `FAIL`), panel/hardware health indexes (0-100), and glowing status rings (`shadow-[0_0_30px_...]`).
- **Props**: `status: 'pass' | 'warn' | 'fail' | 'testing' | 'neutral'`, `label`, `subtitle`, `score`, `maxScore`, `ringGlow`, `details`.
- **UI/UX Highlights**: Glowing LED status rings, high-contrast verdict badges, key-value detail metrics.

### 2.6 `PaletteCard.astro` — Swatch Grid & Layout Selection Component
- **Function**: Displays solid color swatches (RGB, pure black/white, Macbeth 24 patch swatches), hex pickers, and keyboard/display layout selection buttons.
- **Props**: `title`, `subtitle`, `swatches: ColorSwatch[]`, `activeHex`, `allowCustomHex`, `layoutPresets`, `activePresetId`, `badgeText`.
- **UI/UX Highlights**: Border ring highlight on active swatch (zero scale transforms), custom hex text input, keyboard layout preset buttons.

### 2.7 `TelemetryCard.astro` — Microsecond Delta & Event Log Component
- **Function**: Displays real-time frame delta graphs, jitter variance $\sigma$, reaction time histograms, FFT audio spectrums, and W3C event logs.
- **Props**: `title`, `subtitle`, `type: 'graph' | 'histogram' | 'fft' | 'event-log'`, `eventLogs`, `currentHz`, `jitterSigmaMs`, `badgeText`.
- **UI/UX Highlights**: Microsecond sparkline canvas container, W3C event log stream with timestamp formatting.

### 2.8 `InspectorCard.astro` — Low-Level Hardware Diagnostics Component
- **Function**: Displays low-level hardware inspection data (W3C PointerType, USB VID/PID, ITO digitizer trace noise, WebGL subpixel reticle specifications).
- **Props**: `title`, `subtitle`, `category`, `rows: InspectionRow[]`, `badgeText`.
- **UI/UX Highlights**: Monospace key-value grid, status highlights (`text-emerald-400`).

### 2.9 `PassportCard.astro` — Hardware Passport & RMA Certification Component
- **Function**: Displays cryptographically signed SHA-256 hardware health certificates, 30-day ISO 9241-307 RMA return window inspectors, binary ICC v4.3 exporter triggers, and crowdsourced receipt triggers.
- **Props**: `title`, `passportHash`, `deviceModel`, `healthIndex`, `rmaStatus`, `rmaDetails`, `exportIccEnabled`, `submitTelemetryEnabled`.
- **UI/UX Highlights**: Truncated SHA-256 hash capsule, RMA return window badge, ICC exporter button, passport receipt trigger.

---

## 3. STRICT UI/UX PRO MAX COMPLIANCE ENFORCEMENT

All 9 components enforce the 5 rules by construction:

1. **Rule 1 (Icons)**: STRICTLY NO text emojis (`🔬`, `📖`, `🎧`, `📥`). All icons are pure SVG (Heroicons/Lucide) with fixed `viewBox="0 0 24 24"` and `w-5 h-5` / `w-6 h-6`.
2. **Rule 2 (Feedback)**: `cursor-pointer` on all interactive controls with smooth `transition-colors duration-200`.
3. **Rule 3 (Hover Stability)**: ZERO scale transforms (`scale-105`) or layout shifting on hover; border/background/glow interpolation used exclusively (`border-emerald-500/40`, `bg-white/[0.04]`).
4. **Rule 4 (Touch & Focus)**: Min 44x44px touch targets (`min-h-[44px] min-w-[44px]`) and visible high-contrast focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
5. **Rule 5 (Consistency)**: Standardized dark glassmorphism styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl`).

---

## 4. DEFINITIVE 43-ROUTE COMPONENT MAPPING MATRIX

Below is the complete component mapping matrix detailing the exact Right Sidebar component stack (`lg:col-span-4`) for every diagnostic, input, audio, utility, arcade, and database tool page across the 5 core suites:

### 4.1 Visual Display & Color Diagnostic Suite (12 Tools)

| # | Route / Tool Page | Primary Function & Engine | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|---|
| 1 | `/refresh-rate-test` | Microsecond frame pacing & refresh rate test (`RefreshRateEngine.ts`) | `TelemetryCard` (FPS, Hz, Δt, $\sigma$) $\rightarrow$ `StatusCard` (LTPO Mode) $\rightarrow$ `ConfigurationCard` (Speed) $\rightarrow$ `ShortcutCard` (`F`, `Space`, `1-4`) $\rightarrow$ `InfoCard` (ISO Pacing) |
| 2 | `/monitor-color-calibration` | Gamma 2.2, CIEDE2000 $\Delta E_{00}$ & APCA contrast | `PaletteCard` (Macbeth 24) $\rightarrow$ `MetricCard` ($\Delta E_{00}$, APCA) $\rightarrow$ `ConfigurationCard` (ICC Exporter) $\rightarrow$ `InfoCard` (OSD Tips) |
| 3 | `/white-screen` | Fullscreen fill light & smudge matrix (`WhiteScreenEngine.ts`) | `PaletteCard` (Colors, 2700K-6500K) $\rightarrow$ `ConfigurationCard` (Kelvin, Smudge Grid, Wake Lock) $\rightarrow$ `ShortcutCard` (`1-6`, `F`, `G`) $\rightarrow$ `InfoCard` (Webcam Light) |
| 4 | `/display-tests/dead-pixel` | ISO 9241-307 Class I-IV defect pin marker | `PaletteCard` (11 Swatches) $\rightarrow$ `InspectorCard` (Hex & Pin Count) $\rightarrow$ `PassportCard` (30-Day RMA) $\rightarrow$ `ShortcutCard` (`Space`, `1-9`) $\rightarrow$ `InfoCard` (ISO Limits) |
| 5 | `/display-tests/sub-pixel` | WebGL QD-OLED/WOLED layout & ClearType (`SubpixelFontEngine.ts`) | `ConfigurationCard` (RGB, BGR, QD-OLED, WOLED) $\rightarrow$ `MetricCard` (Multiplier, Fringing) $\rightarrow$ `ShortcutCard` (Zoom, Font) $\rightarrow$ `InfoCard` (Font Smoothing) |
| 6 | `/display-tests/uniformity` | 5%/10% low-gray OLED banding & IEC 62341-6-2 | `ConfigurationCard` (1%, 5%, 10% Shadow) $\rightarrow$ `MetricCard` (Luminance Var %, DSE) $\rightarrow$ `ShortcutCard` (`1-5`, `B`) $\rightarrow$ `InfoCard` (Pixel Refresh) |
| 7 | `/display-tests/vrr` | 540Hz+ G-Sync/FreeSync tear sweep (`VrrSweepEngine.ts`) | `TelemetryCard` (FPS, Δt, Micro-stutter $\sigma$) $\rightarrow$ `StatusCard` (LFC Status) $\rightarrow$ `ConfigurationCard` (Sweep 48-540Hz) $\rightarrow$ `ShortcutCard` (`F`, `S`) $\rightarrow$ `InfoCard` (V-Sync Cap) |
| 8 | `/display-tests/oled-burn-in` | Subpixel decay model & risk calculator (`OledBurnInEngine.ts`) | `ConfigurationCard` (Hours, Nits, Panel Tech) $\rightarrow$ `MetricCard` (Subpixel Decay %, Years) $\rightarrow$ `StatusCard` (Risk Level) $\rightarrow$ `InfoCard` (OLED Care) |
| 9 | `/display-tests/hdr-test` | 10-bit ST.2084 PQ EOTF & ABL window test (`HdrTestEngine.ts`) | `ConfigurationCard` (Nits 400-4000, Window Size) $\rightarrow$ `MetricCard` (EOTF Dev, ABL Drop %) $\rightarrow$ `ShortcutCard` (`1-4`, `H`) $\rightarrow$ `InfoCard` (VESA Tiers) |
| 10 | `/display-tests/ppi-calculator` | Dot pitch & 1-arcminute visual acuity distance | `MetricCard` (PPI, Pitch mm, Retina Distance) $\rightarrow$ `StatusCard` (Acuity Rating) $\rightarrow$ `ConfigurationCard` (Presets) $\rightarrow$ `InfoCard` (macOS Scaling) |
| 11 | `/display-tests/color-gamut` | CIE 1931 chromaticity coordinates (sRGB, DCI-P3, Rec.2020) | `ConfigurationCard` (Gamut Target Select) $\rightarrow$ `MetricCard` (Coverage % Bars) $\rightarrow$ `PassportCard` (Export ICC Profile) $\rightarrow$ `InfoCard` (D65 White Point) |
| 12 | `/display-tests/return-window-checker/[slug]` | Model-specific RMA advice & defect score | `StatusCard` (ISO Class Badge) $\rightarrow$ `MetricCard` (Resolution, PPI, RMA Pixels) $\rightarrow$ `PassportCard` (Generate Passport) $\rightarrow$ `InfoCard` (RMA Rights) |

---

### 4.2 Touch Screen & Digitizer Diagnostic Suite (7 Tools)

| # | Route / Tool Page | Primary Function & Engine | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|---|
| 13 | `/touch-tests/dead-zone` | Grid matrix coverage & uncalibrated dead zones (`TouchMatrixEngine.ts`) | `StatusCard` (Grid Coverage %) $\rightarrow$ `ConfigurationCard` (Density 5x5/10x10/20x20) $\rightarrow$ `MetricCard` (Touched Cells, Pressure) $\rightarrow$ `ShortcutCard` (`F`, `R`) $\rightarrow$ `InfoCard` (Digitizer Specs) |
| 14 | `/touch-tests/multi-touch` | 10+ point touch contact & radius geometry | `StatusCard` (Max Contacts Badge) $\rightarrow$ `MetricCard` (Active Count, Max Points, Radius mm²) $\rightarrow$ `TelemetryCard` (Coordinates Log) $\rightarrow$ `ShortcutCard` (`F`, `C`) $\rightarrow$ `InfoCard` (W3C PointerEvents) |
| 15 | `/touch-tests/vector-precision` | RMS line noise & charger EMI distortion (`TouchEmiInspectorEngine.ts`) | `StatusCard` (RMS Noise Rating) $\rightarrow$ `MetricCard` (RMS Error px, Peak Drift) $\rightarrow$ `ConfigurationCard` (Anchors, Tolerance) $\rightarrow$ `InspectorCard` (ITO Noise) $\rightarrow$ `ShortcutCard` (`F`, `R`) |
| 16 | `/touch-tests/swipe-velocity` | Fling gesture kinematics & instant velocity ($\text{px/ms}$) | `StatusCard` (Flick Speed Rating) $\rightarrow$ `MetricCard` (Velocity px/s, Acceleration) $\rightarrow$ `TelemetryCard` (Delta Jitter Graph) $\rightarrow$ `ShortcutCard` (`F`, `C`) $\rightarrow$ `InfoCard` (Kinematics) |
| 17 | `/touch-tests/input-lag` | Click-to-photon reflex & browser dispatch latency (`InputLagEngine.ts`) | `StatusCard` (Reflex Tier Badge) $\rightarrow$ `ConfigurationCard` (Hz, Polling Hz) $\rightarrow$ `MetricCard` (Last ms, Best ms, 10-Avg ms) $\rightarrow$ `TelemetryCard` (Reaction Histogram) $\rightarrow$ `ShortcutCard` (`Space`, `R`) |
| 18 | `/touch-matrix` | Master device touch matrix analyzer & spatial latency | `StatusCard` (Digitizer Health Index) $\rightarrow$ `ConfigurationCard` (Device Preset, Grid Density) $\rightarrow$ `MetricCard` (PointerEvents API, Velocity, Jitter) $\rightarrow$ `InspectorCard` (PointerType) $\rightarrow$ `ShortcutCard` (`F`, `M`) |
| 19 | `/touch-matrix/charger-emi-inspector` | Ground loop EMI noise & AC ripple inspector | `StatusCard` (Ground Loop EMI Rating) $\rightarrow$ `MetricCard` (RMS Noise px, Ghost Touches, SNR dB) $\rightarrow$ `ConfigurationCard` (Filter, Power Source) $\rightarrow$ `InspectorCard` (AC Ripple) $\rightarrow$ `ShortcutCard` (`F`, `R`) |

---

### 4.3 Input Diagnostic Suite (5 Tools)

| # | Route / Tool Page | Primary Function & Engine | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|---|
| 20 | `/mouse-test` | 8000Hz polling rate & double-click chatter (`MouseFramePacingEngine.ts`) | `StatusCard` (USB Polling Stability) $\rightarrow$ `MetricCard` (Real Hz, Max Hz, CPS, Chatter ms) $\rightarrow$ `ConfigurationCard` (Mode Select) $\rightarrow$ `TelemetryCard` (5-Button Event Log) $\rightarrow$ `ShortcutCard` (`R`, `P`) |
| 21 | `/controller-test` | Gamepad stick drift circularity % & 1000Hz HID | `StatusCard` (Gamepad Connection) $\rightarrow$ `MetricCard` (Circularity %, Trigger %, Polling Hz) $\rightarrow$ `ConfigurationCard` (Preset, Deadzone) $\rightarrow$ `InspectorCard` (VID/PID, Haptics) $\rightarrow$ `ShortcutCard` (`Any Button`, `R`) |
| 22 | `/keyboard-tester` | Microsecond switch chatter bounce & NKRO combo | `StatusCard` (Matrix Coverage) $\rightarrow$ `PaletteCard` (ANSI/ISO/60%/Mac Presets) $\rightarrow$ `MetricCard` (Pressed Keys, NKRO, Chatter, WPM) $\rightarrow$ `TelemetryCard` (Keystroke Log) $\rightarrow$ `ShortcutCard` (`Esc`, `Tab`) |
| 23 | `/keyboard-tester/switches` | Mechanical switch actuation force & debounce database | `InfoCard` (Switch Theory) $\rightarrow$ `ConfigurationCard` (Brand & Type Filters) $\rightarrow$ `MetricCard` (Total Switches, Avg Force g, Debounce ms) $\rightarrow$ `ShortcutCard` (`/`, `C`) |
| 24 | `/keyboard-tester/[slug]` | Category-tailored keyboard tester (Gaming, Mac, 60%) | `StatusCard` (Category Health) $\rightarrow$ `PaletteCard` (Category Preset Layout) $\rightarrow$ `MetricCard` (Keys Pressed, Peak NKRO, Chatter) $\rightarrow$ `TelemetryCard` (Keycode Log) $\rightarrow$ `ShortcutCard` (`Esc`, `P`) |

---

### 4.4 Audio Diagnostic Suite (8 Tools)

| # | Route / Tool Page | Primary Function & Engine | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|---|
| 25 | `/sound-test` | Universal logarithmic frequency sweep & L/R balance (`AudioTestEngine.ts`) | `StatusCard` (WebAudio Status) $\rightarrow$ `ConfigurationCard` (Master Vol, Freq 20-20kHz, Balance) $\rightarrow$ `MetricCard` (Hz, Output dBFS, Sample Rate) $\rightarrow$ `ShortcutCard` (`Space`, `M`) |
| 26 | `/sound-test/speaker-test` | Stereo imaging, channel separation & crosstalk null | `StatusCard` (Stereo Imaging) $\rightarrow$ `ConfigurationCard` (Mode L/R/Sweep, Duration) $\rightarrow$ `MetricCard` (Left dB, Right dB, Crosstalk dB, Phase) $\rightarrow$ `ShortcutCard` (`L`, `R`, `S`) |
| 27 | `/sound-test/headphone-test` | Driver balance & frequency spectrum sweeps | `StatusCard` (Driver Balance) $\rightarrow$ `ConfigurationCard` (Channel Toggle, Range Sub-bass/Treble) $\rightarrow$ `MetricCard` (Left Level, Right Level, Driver Var dB) $\rightarrow$ `ShortcutCard` (`L`, `R`, `Space`) |
| 28 | `/sound-test/bass-test` | Subwoofer low-frequency extension (10Hz - 100Hz) | `StatusCard` (Subwoofer Extension) $\rightarrow$ `ConfigurationCard` (Presets 10-100Hz, Sweep Rate) $\rightarrow$ `MetricCard` (Active Hz, Excursion Level, THX 80Hz) $\rightarrow$ `ShortcutCard` (`1-5`, `Space`) |
| 29 | `/sound-test/microphone-test` | Microphone gain staging & FFT ambient noise floor | `StatusCard` (Mic Gain Staging) $\rightarrow$ `ConfigurationCard` (Mic Select, Gain Boost, Noise Suppression) $\rightarrow$ `MetricCard` (Peak dBFS, Noise Floor dBFS, SNR dB) $\rightarrow$ `TelemetryCard` (FFT Noise Spectrum) $\rightarrow$ `ShortcutCard` (`M`, `R`) |
| 30 | `/sound-test/tone-generator` | Web Audio sine/square/sawtooth oscillator synthesizer | `StatusCard` (Synthesizer Status) $\rightarrow$ `PaletteCard` (Sine, Square, Saw, Triangle) $\rightarrow$ `ConfigurationCard` (Freq Input, Slider, Vol, Detune Cents) $\rightarrow$ `MetricCard` (Hz, Harmonics, Nyquist) $\rightarrow$ `ShortcutCard` (`Space`, `4`) |
| 31 | `/sound-test/surround-sound` | 5.1 & 7.1 multichannel surround speaker map test | `StatusCard` (Multichannel Mode) $\rightarrow$ `PaletteCard` (2.0 / 5.1 / 7.1 Configuration) $\rightarrow$ `ConfigurationCard` (Channel Sequencer, Toggles) $\rightarrow$ `MetricCard` (Active Channel, Count 8, LFE) $\rightarrow$ `ShortcutCard` (`1-8`, `A`) |
| 32 | `/sound-test/audio-latency` | Lip-sync A/V timing offset evaluator (ms) | `StatusCard` (A/V Latency Rating) $\rightarrow$ `ConfigurationCard` (Flash Interval ms, Offset Slider) $\rightarrow$ `MetricCard` (Measured Latency ms, Bluetooth Est) $\rightarrow$ `TelemetryCard` (Rolling Latency Log) $\rightarrow$ `ShortcutCard` (`Space`, `R`) |

---

### 4.5 Utility Calculators, Micro-Arcade & Device Database (11 Tools)

| # | Route / Tool Page | Primary Function & Engine | Right Sidebar (`lg:col-span-4`) Component Stack |
|---|---|---|---|
| 33 | `/benchmarks/pc-bottleneck` | Resolution-aware CPU vs GPU balance (`PcBottleneckEngine.ts`) | `StatusCard` (Result: PASS / 24% Bottleneck) $\rightarrow$ `ConfigurationCard` (CPU/GPU Select, Resolution 1080p/1440p/4K) $\rightarrow$ `MetricCard` (CPU/GPU %, Game FPS) $\rightarrow$ `PassportCard` (Export Specs) |
| 34 | `/benchmarks/wire-gauge-calculator` | NEC 2026 Table 310.16 voltage drop ($V_d$) (`WireGaugeEngine.ts`) | `StatusCard` (NEC Compliance) $\rightarrow$ `ConfigurationCard` (Amps 15-200A, Distance ft, Cu/Al) $\rightarrow$ `MetricCard` (Voltage Drop V, Drop %, AWG Gauge) $\rightarrow$ `InfoCard` (NEC Table 310.16) |
| 35 | `/benchmarks/3d-print-cost` | Material density & Etsy commercial margin (`FilamentCostEngine.ts`) | `StatusCard` (Profit Margin Rating) $\rightarrow$ `ConfigurationCard` (PLA/ABS/PETG, Spool Cost, Mass g, Time) $\rightarrow$ `MetricCard` (Unit Cost $, Retail Price $) $\rightarrow$ `InfoCard` (Material Density) |
| 36 | `/display-tests/electricity-cost` | 50 US State EIA rates & appliance kWh (`ApplianceEnergyEngine.ts`) | `StatusCard` (Energy Tier Rating) $\rightarrow$ `ConfigurationCard` (Appliance Preset, Power W, Hours, US State Select) $\rightarrow$ `MetricCard` (Daily kWh, Monthly $, Annual $) $\rightarrow$ `InfoCard` (US EIA Rate Data) |
| 37 | `/display-tests/tv-viewing-distance` | THX 40° / SMPTE 30° optics & acuity limits (`TvViewingDistanceEngine.ts`) | `StatusCard` (Immersion Rating) $\rightarrow$ `ConfigurationCard` (Screen Size, Aspect Ratio, Resolution) $\rightarrow$ `MetricCard` (Distance ft/m, Acuity Benefit) $\rightarrow$ `InfoCard` (THX/SMPTE FOV) |
| 38 | `/arcade/ghosting-invaders` | Pursuit reticle motion blur & MPRT game (`GhostingInvadersEngine.ts`) | `StatusCard` (Motion Blur Grade) $\rightarrow$ `TelemetryCard` (FPS, Frame Delta ms, Overshoot %) $\rightarrow$ `ConfigurationCard` (Invader Speed, Overdrive) $\rightarrow$ `MetricCard` (MPRT Score ms) $\rightarrow$ `ShortcutCard` (`F`, `Space`) |
| 39 | `/arcade/lag-reflex-sniper` | Sub-millisecond human reflex sniper game | `StatusCard` (Reflex Rank Tier) $\rightarrow$ `TelemetryCard` (Reaction History ms) $\rightarrow$ `MetricCard` (Last ms, 5-Avg ms, Display Overhead) $\rightarrow$ `ShortcutCard` (`Space`, `R`) |
| 40 | `/arcade/color-match-alchemist` | CIEDE2000 $\Delta E_{00}$ color discrimination sandbox | `StatusCard` (Color Vision Rating) $\rightarrow$ `MetricCard` (Current Score $\Delta E_{00}$, Accuracy %) $\rightarrow$ `ConfigurationCard` (Illumination D65/D50, Difficulty) $\rightarrow$ `ShortcutCard` (`1-4`, `R`) |
| 41 | `/arcade/touch-matrix-defusal` | Gamified multi-touch digitizer speed defusal | `StatusCard` (Digitizer Multi-Touch Score) $\rightarrow$ `TelemetryCard` (Active Contacts, Spatial Error px) $\rightarrow$ `MetricCard` (Defusal Speed ms, Precision Score) $\rightarrow$ `ShortcutCard` (`F`, `R`) |
| 42 | `/models` | Crowdsourced telemetry ledger across 25 flagship models | `ConfigurationCard` (Panel Filter: QD-OLED, WOLED, 540Hz TN, IPS, Refresh Rate) $\rightarrow$ `StatusCard` (Community Lot-Variance Index) $\rightarrow$ `InfoCard` (ISO 9241-307 RMA Reference) |
| 43 | `/compare` | Side-by-side display spec engine & benchmark comparison | `StatusCard` (Monitor Test Hub Advantage Score) $\rightarrow$ `ConfigurationCard` (Select Displays to Compare) $\rightarrow$ `PassportCard` (Submit Verified Hardware Receipt) $\rightarrow$ `InfoCard` (E-E-A-T Standards) |

---

## 5. PHASE 2 APPROVAL REQUEST (GATE 2)

### APPROVAL REQUEST FOR THE USER:

> **Dear User / Parent Agent**,
> 
> The **Phase 2 Unified Component System Architecture & 43-Route Component Mapping Plan** is complete and presented for your review.
> 
> **Summary of Phase 2 Plan**:
> 1. **9 Modular Astro Components**: Complete technical specifications, TypeScript interfaces, and templates for `InfoCard.astro`, `MetricCard.astro`, `ShortcutCard.astro`, `ConfigurationCard.astro`, `StatusCard.astro`, `PaletteCard.astro`, `TelemetryCard.astro`, `InspectorCard.astro`, and `PassportCard.astro`.
> 2. **UI/UX Pro Max Enforcement**: Standardized dark glassmorphism (`bg-[#121215]/90 border border-white/10 rounded-3xl p-6`), pure SVG icons only (0 emojis), scale-free hover stability, 44x44px touch target minimums, and visible focus rings.
> 3. **Definitive 43-Route Mapping Matrix**: Exhaustive mapping table showing the exact Right Sidebar component stack for every tool route across Visual Display, Touch Screen, Input, Audio, Utility Calculators, Micro-Arcade, and Device Database.
> 
> **Please respond with your explicit approval of Phase 2 so we can proceed to Phase 3 (Playwright Visual Regression Testing & Incremental Implementation).**
