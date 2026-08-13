<div align="center">

# 🖥️ DISPLAY TEST ONLINE (displaytestonline.com)

### High-Performance Web-Native Display, Touch Digitizer & Hardware Peripheral Diagnostic Suite

[![Astro v7](https://img.shields.io/badge/Astro-v7.0-ff5e00?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest 198/198](https://img.shields.io/badge/Vitest-198%2F198_Pass-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-059669?style=for-the-badge)](LICENSE)

<br />

```text
       ___  ___ _____  _   _ _____ _____ _____ _____     _   _  _____ _____ 
       |  \/  |/  ___|| | | |_   _/  ___|_   _/  ___|   | | | ||  ___| ___ \
       | .  . |\ `--. | |_| | | | \ `--.  | | \ `--.    | |_| || |__ | |_/ /
       | |\/| | `--. \|  _  | | |  `--. \ | |  `--. \   |  _  ||  __|| ___ \
       | |  | |/\__/ /| | | | | | /\__/ / | | /\__/ /   | | | || |___| |_/ /
       \_|  |_/\____/ \_| |_/ \_/ \____/  \_/ \____/    \_| |_/\____/\____/ 
```

**Display Test Online** is an open-source, web-native diagnostic, calibration, and benchmarking platform engineered for gaming monitors, OLED displays, high-refresh-rate panels (540Hz+), capacitive touch digitizers, active stylus pens, and gaming peripherals.

[🚀 Explore 34 Diagnostic Instruments](#-comprehensive-diagnostic-suite-34-instruments) • [📐 Engineering Specs](#-standards--citations-matrix) • [⚡ Quickstart](#-developer-quickstart)

</div>

---

## 🌟 Key Highlights

- **100% Client-Side Engine Architecture**: Decoupled pure-TypeScript calculation engines in `src/engine/` executing WebGL 2.0, Web Audio API, Canvas 2D, and RequestAnimationFrame loops with zero server latency or analytics overhead.
- **34 Hardware Diagnostic Instruments**: Covers visual display panels, mobile digitizer dead-zones, W3C stylus pressure, $8000\text{Hz}$ mouse HID polling, mechanical microswitch double-click chatter, NKRO keyboard matrix, gamepad stick drift, microphone noise floors, and logarithmic speaker frequency sweeps.
- **SHA-256 Cryptographic Hardware Passport**: Generates immutable, signed hardware health certificates certifying panel refresh rates, frame pacing variance, and sub-pixel defect thresholds.
- **Internationalization (i18n)**: Fully localized across `en`, `es`, `de`, and `fr` generating 752 static pages.
- **Standards Compliant**: Built strictly in accordance with ISO 9241-307, VESA DisplayHDR 400–1400 / True Black, IEEE 1789-2015, EBU Tech 3325, DICOM GSDF, and CIE 1931 colorimetry standards.

---

## 🧰 Comprehensive Diagnostic Suite (34 Instruments)

| Category | Diagnostic Tool | Standard / Specification | Key Capabilities |
| :--- | :--- | :--- | :--- |
| 🖥️ **Display** | **Dead Pixel Inspector** | ISO 9241-307 Class I–IV | Solid color cycler & spatial coordinate defect pin-marker system. |
| 🖥️ **Display** | **OLED Uniformity** | IEC 62341-6-2 | 5%/10% low-gray luminance dark-room banding & vignetting analyzer. |
| 🖥️ **Display** | **Sub-Pixel Geometry** | ClearType & FreeType | WebGL reticle inspector for RGB, BGR, QD-OLED & WOLED sub-pixels. |
| 🖥️ **Display** | **540Hz+ VRR Stutter Sweep** | G-Sync / FreeSync / VESA | Real-time rAF microsecond frame interval delta ($\Delta t$) tracker. |
| 🖥️ **Display** | **OLED Burn-In Risk** | Degradation Model | Mathematical decay engine for static UI elements & sub-pixel wear. |
| 🖥️ **Display** | **HDR 10-Bit Tone Mapping** | ST 2084 PQ EOTF | VESA DisplayHDR 400–1400 & ABL roll-off evaluator ($1\%-100\%$). |
| 🖥️ **Display** | **Color Gamut & ICC Exporter** | CIE 1931 & WASM | sRGB, DCI-P3, Rec.2020 2D/3D map & binary ICC v4.3 exporter. |
| 🖥️ **Display** | **PPI & Visual Acuity Calc** | 1 Arcminute Human Acuity | Dot pitch ($mm$) & 20/20 vision optimal viewing distance computer. |
| 🖥️ **Display** | **Backlight Bleed Inspector** | IEC 62341-6-2 | Dark-room IPS glow vs corner backlight leakage analyzer. |
| 🖥️ **Display** | **Motion Blur Ghosting** | MPRT Pursuit Camera | GtG sample-and-hold blur & overdrive overshoot ($\Delta E_{00}$). |
| 🖥️ **Display** | **Gamma 2.2 EOTF** | ITU-R BT.709 | 1.8 / 2.2 / 2.4 dither balance pattern evaluator. |
| 🖥️ **Display** | **Color Banding 10-Bit** | Quantization Ramp | 8-bit vs 10-bit color depth FRC dither step checker. |
| 🖥️ **Display** | **Mini-LED Blooming** | VESA DisplayHDR 1400 | FALD local dimming halo ratio ($R_{\text{bloom}}$) computer. |
| 🖥️ **Display** | **Frame Skipping Hz** | High-Precision rAF | Camera shutter high-refresh frame gap detector. |
| 🖥️ **Display** | **Viewing Angle Shift** | ISO 9241-307 | Off-axis contrast degradation & VA gamma shift evaluator. |
| 🖥️ **Display** | **Aspect Geometry** | EBU Tech 3325 | Scaling distortion, anamorphic stretches & pixel aspect ratio test. |
| 🖥️ **Display** | **PWM Screen Flicker** | IEEE 1789-2015 | High-speed camera pulse-width modulation eye strain evaluator. |
| 🖥️ **Display** | **Pixel Walk Inversion** | VESA FPDM v2.0 | 2x2 & 1x1 dither balance pattern for LCD panel crosstalk. |
| 🖥️ **Display** | **Text Sharpness** | WCAG 2.1 AAA | Subpixel font rendering fringe & contrast legibility validator. |
| 🖥️ **Display** | **Grayscale Step Ramp** | DICOM GSDF | 16-step luminance ramp & dark-gray shadow detail inspector. |
| 🖥️ **Display** | **Stuck Pixel Healer** | LCD Resuscitation | High-frequency 30Hz–60Hz RGB liquid crystal stimulator. |
| 🖥️ **Display** | **Colorblind Simulator** | Brettel LMS Model | Protanopia, Deuteranopia & Tritanopia spectral vision emulator. |
| 📱 **Touch** | **Digitizer Dead-Zone Matrix**| 100dvh Touch Grid | Full-screen spatial touch coverage & dead-spot grid analyzer. |
| 📱 **Touch** | **Multi-Touch Point Counter** | W3C Touch Events | Simultaneous 10+ finger contact IDs, geometry & pressure tracking. |
| 📱 **Touch** | **Vector Draw Precision** | RMS Linear Error | Digitizer EMI noise & drawn vector RMS deviation evaluator. |
| 📱 **Touch** | **Swipe Velocity Tracker** | Kinematics Engine | Instantaneous touch velocity ($px/ms$) & friction coefficient. |
| 📱 **Touch** | **Reflex Input Lag Sniper** | Click-to-Photon | Reaction time & hardware dispatch latency benchmark. |
| 🖊️ **Stylus** | **Stylus Pen Pressure & Tilt** | W3C Pointer Events L3 | Active pen pressure levels (4096+), tilt azimuth & altitude angles. |
| 🖱️ **Inputs** | **Mouse Polling Rate (Hz)** | USB HID Protocol | Real-time USB polling rate ($125\text{Hz}$–$8000\text{Hz}$) & jitter std dev. |
| 🖱️ **Inputs** | **Mouse Double-Click Chatter**| Microswitch Debounce | Mechanical switch chatter detector for accidental double-clicks ($<30\text{ms}$). |
| ⌨️ **Inputs** | **Keyboard Rollover (NKRO)** | W3C KeyboardEvent | Simultaneous key press matrix tracking & NKRO vs 6KRO validator. |
| 🎮 **Inputs** | **Gamepad Stick Drift** | W3C Gamepad API | 2D polar resting offset & 360° circularity error percentage. |
| 🎙️ **Audio** | **Microphone Noise Floor** | Web Audio AnalyserNode | Decibel RMS noise floor ($dBFS$) & signal-to-noise ratio (SNR). |
| 🔊 **Audio** | **Speaker Frequency Sweep** | AES17 Acoustic Standard| Logarithmic sine sweep ($20\text{Hz}$–$20\text{kHz}$) & stereo phase test. |

---

## 🕹️ Interactive Diagnostic Micro-Arcade Suite

Display Test Online includes 4 gamified hardware diagnostic micro-games that combine human reflex testing with hardware performance measuring:

1. **Ghosting Invaders**: Benchmark motion blur, MPRT sample-and-hold time, and overdrive inverse ghosting.
2. **Color Match Alchemist**: Test perceptual color discrimination using the **CIEDE2000 ($\Delta E_{00}$)** color difference formula.
3. **Lag Reflex Sniper**: Measure human reaction speed combined with click-to-photon display latency.
4. **Touch Matrix Defusal**: Gamified speed test for evaluating multi-touch digitizer accuracy and spatial latency.

---

## 📐 Standards & Citations Matrix

```text
┌─────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Engineering Standard    │ Scope & Compliance                                          │
├─────────────────────────┼─────────────────────────────────────────────────────────────┤
│ ISO 9241-307            │ Ergonomic requirements for flat panel display defect classes│
│ VESA DisplayHDR         │ ST 2084 PQ EOTF tone mapping, ABL, and DisplayHDR 400-1400  │
│ IEEE 1789-2015          │ Recommended practices for modulating current in LED lighting│
│ EBU Tech 3325           │ Video display geometry, scaling ratio, and aspect alignment │
│ DICOM GSDF              │ Grayscale Standard Display Function for luminance linearity │
│ CIE 1931 Chromaticity   │ 2D/3D color space gamut maps (sRGB, DCI-P3, AdobeRGB)        │
│ W3C Pointer Events L3   │ Active stylus pressure sensitivity, tilt, and azimuth       │
└─────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Developer Quickstart

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/dvy246/monitor-platform.git
cd monitor-platform/monitor_test_hub

# Install dependencies
npm install

# Start development server
npm run dev
# Server running at http://localhost:4321
```

### Verification & Testing Suite

```bash
# 1. Type Check (Strict Mode)
npx tsc --noEmit

# 2. Run Vitest Unit & Engine Test Suite (198 tests across 33 suites)
npm test

# 3. Documentation Integrity Audit
python3 verify_docs.py

# 4. Compile Static Production Build (752 Static HTML Pages)
npm run build
```

---

## 📂 Repository Layout

```text
monitor_test_hub/
├── src/
│   ├── engine/                          # Decoupled TypeScript calculation & math engines
│   │   ├── HardwarePassportEngine.ts    # SHA-256 signed hardware receipt engine
│   │   ├── MultiDisplaySync.ts          # BroadcastChannel peer window sync bus
│   │   ├── InputLagEngine.ts            # Reaction time & latency engine
│   │   ├── OledBurnInEngine.ts          # Sub-pixel degradation decay engine
│   │   ├── HdrTestEngine.ts             # 10-bit PQ EOTF & ABL evaluator
│   │   ├── TouchMatrixEngine.ts         # Digitizer dead-zone matrix analyzer
│   │   ├── VrrSweepEngine.ts            # 540Hz+ VRR stutter & tear engine
│   │   ├── IccExporter.ts               # Binary ICC v4.3 profile exporter
│   │   └── *.test.ts                    # 198 Vitest unit/stress/perf test suites
│   ├── components/                      # 34 Diagnostic UI components
│   ├── pages/                           # 752 Localized Astro static routes (en, es, de, fr)
│   └── layouts/                         # Layout.astro (Executive 3-tab mega menu header)
├── verify_docs.py                       # Automated documentation audit script (20/20 PASS)
├── astro.config.mjs                     # Astro v7 & i18n configuration
└── vitest.config.ts                     # Vitest engine testing configuration
```

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).
