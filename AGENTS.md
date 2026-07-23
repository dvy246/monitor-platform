# AGENTS.md — Monitor Test Hub Project Guidelines

Welcome to **Monitor Test Hub** (`nasty-neptune`), a high-performance, web-native diagnostic, calibration, and benchmarking suite built for visual display testing, high-refresh-rate latency diagnostics, VRR stutter detection, OLED burn-in risk modeling, and mobile touch matrix testing.

This document serves as the primary technical guide and rules of engagement for AI agents and human developers operating within this repository.

---

## 1. Project Architecture & Tech Stack

### Core Technologies
- **Framework**: [Astro v7](https://astro.build/) (`output: 'static'`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Language**: TypeScript (`tsconfig.json`, strict mode)
- **Engine Testing**: [Vitest](https://vitest.dev/) (317 unit & stress test cases across 55 test suites, 100% PASS)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **SEO & Performance Audit**: Lighthouse CI (`@lhci/cli`), `@astrojs/sitemap` (2,807 static pages generated across 4 locales, canonical domain: `https://displaytestonline.com`)
- **Hosting & Infrastructure**: Cloudflare Pages via Wrangler (`npm run deploy`)

### Repository Directory Layout
```text
/Users/divyyadav/newws/
├── AGENTS.md                                # Workspace guidelines (this file)
├── niche_research_report.md                 # Market analysis & domain specifications
├── .agents/                                 # Agent trajectory logs, briefing notes & skills
└── monitor_test_hub/                        # Main Astro project root
    ├── astro.config.mjs                     # Astro & i18n configuration
    ├── package.json                         # Scripts & dependency definitions
    ├── playwright.config.ts                 # E2E test configuration
    ├── vitest.config.ts                     # Unit test configuration
    ├── competitor_analysis_report.md        # Technical benchmark report
    ├── prd.md                               # Product Requirements Document
    ├── plan.md                              # Implementation milestones & plan
    ├── verify_docs.py                       # Automated documentation verification script (20/20 PASS)
    ├── public/
    │   └── data/telemetry.jsonl             # Pre-rendered open telemetry static JSONL dataset
    ├── src/
    │   ├── engine/                          # Decoupled TypeScript calculation & math engines
    │   │   ├── RefreshRateEngine.ts         # Microsecond delta tracking, LTPO ProMotion detection, 540Hz+ reticle sweep engine
    │   │   ├── HardwarePassportEngine.ts    # SHA-256 signed hardware receipt, badge generator & health index engine
    │   │   ├── SubpixelFontEngine.ts        # OLED subpixel layout geometry (QD-OLED/WOLED) & ClearType fringing engine
    │   │   ├── MouseFramePacingEngine.ts    # 8000Hz USB mouse polling vs rAF frame pacing jitter RFC 3550 telemetry engine
    │   │   ├── HdrTestEngine.ts             # 10-bit PQ EOTF tone mapping & ABL window size evaluator (100k ops/sec)
    │   │   ├── TouchEmiInspectorEngine.ts   # Mobile touch digitizer RMS vector line noise & charger EMI DSP engine
    │   │   ├── GhostingInvadersEngine.ts    # Motion blur, MPRT & overdrive overshoot target discrimination engine
    │   │   ├── WhiteScreenEngine.ts         # Planckian locus Kelvin temperature & smudge grid engine
    │   │   ├── DeviceDatabase.ts            # Device hardware specs catalog & ISO 9241-307 RMA limits
    │   │   ├── MultiDisplaySync.ts          # Native BroadcastChannel peer window sync bus
    │   │   ├── InputLagEngine.ts            # Reaction time, hardware delay & polling stats
    │   │   ├── OledBurnInEngine.ts          # Burn-in risk model & sub-pixel degradation engine
    │   │   ├── TouchMatrixEngine.ts         # Multi-touch gesture & dead-zone matrix analyzer
    │   │   ├── VrrSweepEngine.ts            # Variable Refresh Rate stutter & tear engine (540Hz+)
    │   │   ├── IccExporter.ts               # Display calibration & binary ICC v4.3 profile exporter
    │   │   ├── AudioTestEngine.ts           # Logarithmic frequency sweep, L/R balance, mic noise floor & audio latency engine
    │   │   └── *.test.ts                    # Vitest unit/stress/perf test suites (315 tests across 55 files)
    │   ├── pages/                           # Astro page routes
    │   │   ├── index.astro                  # Homepage & real-time telemetry deck (~950-word Helpful Content SEO suite)
    │   │   ├── refresh-rate-test.astro      # Screen Refresh Rate & Hz Test suite (10-item FAQ + schema)
    │   │   ├── monitor-color-calibration.astro # Monitor Color Calibration Suite (Gamma 2.2, ΔE00, ICC v4.3, 10-item FAQ)
    │   │   ├── sound-test.astro             # Universal Sound & Speaker Test Suite (L/R balance, 10-item FAQ + schema)
    │   │   ├── sound-test/                  # Sound diagnostic sub-tools (speaker-test, headphone-test, bass-test, microphone-test, tone-generator, surround-sound, audio-latency)
    │   │   ├── [locale]/                    # Localized routes (es, de, fr)
    │   │   ├── models/                      # Device Database Hub (/models) & Crowdsourced Per-Model Reports (/models/[slug])
    │   │   ├── compare/                     # Display Comparison Engine (/compare & /compare/[slug])
    │   │   ├── passport/                    # Hardware Passport receipt verification (/passport/[hash]) & dynamic SVG badge API
    │   │   ├── embed/                       # Embeddable Iframe Widget badge endpoint (/embed/passport)
    │   │   ├── white-screen/                # Fullscreen white screen & fill lighting utility (/white-screen, /[color], 10-item FAQ)
    │   │   ├── display-tests/               # Visual tests (dead-pixel, return-window-checker/[slug], sub-pixel, uniformity, vrr, oled-burn-in, hdr-test, ppi-calculator, color-gamut)
    │   │   ├── touch-tests/                 # Mobile touch tests (dead-zone, multi-touch, vector-precision, swipe-velocity, input-lag, 10-item FAQ)
    │   │   ├── mouse-test/                  # Mouse diagnostic suite (5-button click matrix, 8000Hz polling rate, double-click chatter, DPI solver, CPS test, scroll wheel)
    │   │   ├── controller-test/             # Gamepad diagnostic suite (PS5 DualSense, Xbox Series X/S, Switch Pro, stick drift circularity %, 1000Hz HID polling rate)
    │   │   ├── benchmarks/                  # High-rate mouse frame pacing, pc bottleneck, wire gauge & 3D cost calculators
    │   │   ├── touch-matrix/                # Touch matrix & charger EMI inspector routes (/touch-matrix/charger-emi-inspector)
    │   │   ├── keyboard-tester/             # Keyboard tester, switch chatter & key switch directory (/keyboard-tester/switches & /[slug], 10-item FAQ)
    │   │   ├── arcade/                      # Interactive diagnostic micro-games (Ghosting Invaders, Lag Reflex, Color Alchemist, Touch Defusal)
    │   │   ├── about.astro                  # 600-word SEO & engineering standards overview
    │   │   ├── faq.astro                    # 12-item FAQ page with JSON-LD schema
    │   │   ├── contact.astro                # Client-side contact form
    │   │   ├── terms.astro                  # Terms & conditions page
    │   │   └── privacy.astro                # Privacy policy page
    │   ├── components/                      # UI, Diagnostic & Disclaimer components
    │   │   ├── diagnostics/                 # RefreshRateInspector, DeviceDeadPixelInspector, HardwarePassportModal, ModelStatsCard, ModelTelemetryTable, etc.
    │   │   ├── ui/                          # FloatingActionMenu (dark-glass FAB), FAQSection, TestGuideModal, Breadcrumbs, TestSwitcherBar
    │   │   ├── disclaimers/                 # Epilepsy, Ergonomics & Hardware Limitation warnings
    │   │   ├── seo/                         # SEOHead, SchemaGraph & Medical notice banners
    │   │   └── arcade/                      # Diagnostic game components
    │   ├── layouts/                         # Layout templates (Layout.astro with Learning Guides Mega-Menu & FloatingActionMenu)
    │   ├── styles/                          # Global CSS & Tailwind rules
    │   ├── types/                           # Shared TypeScript interfaces & types
    │   └── utils/                           # i18n & routing helper functions
    └── tests/
        └── e2e/                             # Playwright integration & routing tests
```

---

## 2. Essential Commands & Development Workflow

> **CRITICAL**: Commands targeting the web app must be run from inside `monitor_test_hub/` working directory.

### Environment & Server
| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Start Astro local dev server (`http://localhost:4321`) |
| **Build** | `TMPDIR=$PWD/.tmp npm run build` | Compile static production site to `./dist/` (2,807 static pages) |
| **Preview** | `npm run preview` | Serve production build locally |

### Testing & Quality Assurance
| Test Suite | Command | Notes |
| :--- | :--- | :--- |
| **Unit & Engine Tests** | `TMPDIR=$PWD/.tmp npm test` *(or `npx vitest run`)* | Runs all 317 test cases across 55 test suites (100% PASS) |
| **Targeted Engine Test** | `TMPDIR=$PWD/.tmp npx vitest run src/engine/HardwarePassportEngine.test.ts` | Test specific engine module |
| **Stress & Perf Tests** | `TMPDIR=$PWD/.tmp npx vitest run src/engine/HdrTestEngine.stress.test.ts` | Benchmark under 100,000-operation high load |
| **Type Check** | `npx tsc --noEmit` | Strict TypeScript type verification (0 errors) |
| **E2E Integration** | `npx playwright test` | Runs Playwright tests in `tests/e2e/` |
| **Doc Verification** | `python3 verify_docs.py` | Verifies PRD, Plan & Competitor report integrity (20/20 PASS) |

### Deployment
| Destination | Command | Notes |
| :--- | :--- | :--- |
| **Cloudflare Pages Production** | `TMPDIR=$PWD/.tmp npm run deploy` | Builds site & deploys `./dist/` to `monitor-testing` project |
| **Cloudflare Pages Preview** | `npm run deploy:preview` | Builds site & deploys to preview branch |

---

## 3. Key Design Rules & Architecture Constraints

1. **Engine Decoupling (Pure TypeScript Logic)**
   - All complex math, signal processing, latency estimation, and simulation calculations **MUST** live in `src/engine/`.
   - Core engine modules MUST remain framework-agnostic, pure TypeScript files without direct DOM dependencies so they can be unit-tested in Node/Vitest without mock DOM overhead.

2. **Internationalization (i18n)**
   - Astro i18n supports `en` (default), `es`, `de`, `fr`.
   - Default locale (`en`) paths are unprefixed (e.g. `/display-tests/`).
   - Non-default locale paths use the locale prefix (e.g. `/es/display-tests/`).
   - Ensure route parity across localized route templates in `src/pages/[locale]/`.

3. **Safety & Health Disclaimers**
   - Fast-flashing visual tests (e.g., VRR sweep, refresh rate flicker) **MUST** include the `EpilepsyWarning.astro` disclaimer component.
   - Long-duration display/touch tests MUST incorporate relevant ergonomics and hardware limitation notices.

4. **Styling & Aesthetics**
   - Built with **Tailwind CSS v4** (`@tailwindcss/vite`).
   - Design tone: Sleek, high-precision dark theme optimized for OLED, high-refresh-rate gaming monitors, and mobile touch displays.
   - Design Tokens: `#08080a` (canvas background), `#121215` (surface), `#18181b` (elevated), `rgba(255,255,255,0.08)` (hairline borders), `#059669` (status pass).

---

## 4. Guidelines for AI Agents

- **Source of Truth First**: Never guess parameter names or types. Inspect definitions in `src/types/` and existing engine specs in `src/engine/`.
- **Verification Rule**: Whenever modifying files in `src/engine/` or `src/pages/`, verify your changes by executing `npm test`, `npx tsc --noEmit`, or `npm run build`.
- **Working Directory**: Always specify `Cwd: "/Users/divyyadav/newws/monitor_test_hub"` when launching shell commands or running tests.

---

## 5. Comprehensive Feature Matrix & Diagnostic Instruments

Monitor Test Hub includes the following production features, pure-TypeScript calculation engines, diagnostic micro-games, and pSEO route taxonomy:

### 5.1 Desktop Visual Display Diagnostics Suite
- **Dead Pixel & Sub-Pixel Defect Inspector**:
  - Fullscreen solid color cycler (RGB, Pure Black, Pure White).
  - Defect pin marker system with coordinates logging.
  - Mapped to **ISO 9241-307 Class I-IV** display defect specifications.
- **Sub-Pixel Layout & Font Antialiasing Analyzer**:
  - WebGL subpixel reticle renderer for sub-pixel geometry inspection.
  - Supports Standard RGB Stripe, Inverted BGR, Gen-1/Gen-2 QD-OLED Triangular, and LG WOLED RWBG sub-pixel structures.
  - ClearType (Windows) and FreeType (Linux) subpixel text fringing simulation.
- **OLED 5%/10% Uniformity, IPS Glow & VA Smearing Inspector**:
  - Precision low-gray luminance patterns for inspecting dark-gray OLED banding and vignetting.
  - Mapped to **IEC 62341-6-2** uniformity standards.
- **540Hz+ VRR Stutter & Tearing Sweep Engine**:
  - Real-time rAF (RequestAnimationFrame) frame interval delta measuring ($1/\text{FPS}$).
  - Dynamic vertical oscillation sweep bars for detecting G-Sync, FreeSync, and VRR sync loss.
  - Microsecond-level frame pacing jitter telemetry.
- **OLED Burn-In Risk Model & Sub-Pixel Degradation Engine**:
  - Mathematical degradation model estimating sub-pixel decay based on static UI element brightness, color spectrum distribution, and daily operational hours.
  - Recommends panel maintenance cycles (Pixel Refresh / Panel Refresh).
- **10-Bit HDR PQ EOTF Tone Mapping & ABL Evaluator**:
  - ST 2084 PQ EOTF perceptual curve evaluation.
  - Evaluates ABL (Auto Brightness Limiter) roll-off across 1% to 100% window sizes.
  - Compliant with **VESA DisplayHDR 400 / 600 / 1000 / 1400 / True Black** standards.
- **Sub-Pixel Density (PPI) & Arcminute Acuity Calculator**:
  - Calculates exact Pixel-Per-Inch (PPI), Dot Pitch (mm), and total megapixel resolution.
  - Computes visual acuity viewing distance based on $1/60^\circ$ (1 arcminute) human resolution limits.
- **CIE 1931 Color Gamut Map & WebAssembly ICC v4.3 Profile Exporter**:
  - Visualizes sRGB, DCI-P3, AdobeRGB, and Rec.2020 color spaces on 2D/3D chromaticity coordinates.
  - Generates and exports binary ICC v4.3 color profiles (`.icc`) for OS color management.

### 5.2 Mobile Touchscreen & Digitizer Diagnostic Suite
- **Touch Matrix Grid & Dead-Zone Analyzer**:
  - Dynamic grid matrix tracking active touch contacts and uncalibrated dead-zones.
  - Provides total matrix coverage score (%) and spatial latency breakdown.
- **Multi-Touch Point & Pointer Event Multiplexing Counter**:
  - Tracks up to 10+ simultaneous finger touches with active contact IDs, pressure values, and contact radius geometry.
- **RMS Sub-Pixel Line Noise & Vector Precision Analyzer**:
  - Measures Root-Mean-Square (RMS) deviation of drawn paths against ideal geometric vectors to evaluate touch digitizer EMI noise.
- **Gesture Kinematics & Swipe Velocity Tracker**:
  - Evaluates fling gesture velocity ($\text{px/ms}$ and $\text{mm/s}$) and instantaneous touch velocity vectors.
- **Click-to-Photon Reflex Input Lag & Hardware Polling Delay Engine**:
  - Measures reaction time, browser dispatch overhead, and hardware polling rate ($1000/\text{Hz}$).

### 5.3 Diagnostic Micro-Arcade Suite (Gamified Hardware Testing)
- **Ghosting Invaders**: Measures motion blur, MPRT (Motion Picture Response Time), and overdrive overshoot inverse ghosting.
- **Color Match Alchemist**: Tests perceptual color discrimination using the **CIEDE2000 ($\Delta E_{00}$)** color difference formula.
- **Lag Reflex Sniper**: Benchmarks human reaction time combined with display input latency under sub-millisecond hardware timers.
- **Touch Matrix Defusal**: Gamified touch matrix speed test for evaluating multi-touch digitizer responsiveness.

### 5.4 Hardware Passport & Telemetry Certification
- **Hardware Telemetry Ledger**: Collects GPU renderer string, screen resolution, color depth, refresh rate, and frame pacing variance.
- **SHA-256 Cryptographic Hardware Passport**: Generates an immutable, cryptographically signed SHA-256 hardware health certificate receipt for hardware verification.
- **Multi-Display BroadcastChannel Sync Bus**: Syncs visual test patterns across multiple monitor screens in real-time without server overhead.

### 5.5 Knowledge Base & Learning Guides Library (22+ Articles)
- Comprehensive technical tutorials covering ISO 9241-307 display standards, QD-OLED vs WOLED burn-in physics, 540Hz VRR frame pacing, HDR PQ curves, and capacitive touch digitizer mechanics.

### 5.6 Universal Fullscreen & Privacy Architecture
- **Universal Fullscreen Mode**: One-click **FULLSCREEN** button in the header deck and **`F` / `F11`** hotkey support across all diagnostic instruments.
- **100% Ad-Free & Private**: Zero third-party ad networks, zero tracking cookies, 100% client-side WebGL / Canvas execution.

### 5.7 White Screen Utility & Programmatic Device pSEO Suite
- **Universal Fullscreen White Screen & Lighting Utility (`/white-screen`)**:
  - Fullscreen color canvas featuring Screen Wake Lock API (`navigator.wakeLock`) to prevent screen sleep.
  - 2700K to 6500K Planckian locus color temperature sliders for video call webcam fill light (Tungsten Warm $\rightarrow$ D65 Daylight).
  - Smudge & Dust contrast grid overlay matrix for screen cleaning.
  - Parametric routes for `/white-screen/black-screen`, `/white-screen/blue-screen`, `/white-screen/green-screen`, `/white-screen/red-screen`, `/white-screen/yellow-screen`, and `/white-screen/zoom-light`.
- **Programmatic Device & Resolution Dead Pixel Inspector (`/display-tests/dead-pixel-test/[slug]`)**:
  - Device-tailored static pSEO routes for 8+ popular hardware models (MacBook Pro M3, Steam Deck OLED, iPhone 15 Pro, Nintendo Switch OLED, Alienware QD-OLED, iPad Pro M4, ASUS 540Hz ROG, 4K UHD Monitors).
  - Pre-configured target resolution, aspect ratio, PPI, subpixel matrix, and ISO 9241-307 class limits with manufacturer warranty RMA advice.

### 5.8 High-Demand US Micro-Utility Diagnostic Engines & pSEO Taxonomy
- **PC Bottleneck & FPS Estimator Engine (`/benchmarks/pc-bottleneck`, `/benchmarks/pc-bottleneck/[slug]`)**:
  - Powered by `src/engine/PcBottleneckEngine.ts`.
  - Resolution-aware (1080p, 1440p, 4K) CPU vs GPU component balance analyzer, transparent utilization ratio heuristics, upgrade path advisor, and game FPS estimators.
  - Programmatic pSEO routes across CPU × GPU hardware pairings.
- **Appliance Electricity Cost & Energy Calculator (`/display-tests/electricity-cost`, `/display-tests/electricity-cost/[slug]`)**:
  - Powered by `src/engine/ApplianceEnergyEngine.ts`.
  - 50 US State EIA residential rate auto-population database, 50+ appliance wattage presets, monthly/annual kWh cost breakdown, and seasonal usage models.
  - Programmatic pSEO routes across all 50 US states.
- **TV & Projector Viewing Distance & Room Calculator (`/display-tests/tv-viewing-distance`, `/display-tests/tv-viewing-distance/[slug]`)**:
  - Powered by `src/engine/TvViewingDistanceEngine.ts`.
  - SMPTE (30°/40° FOV) & THX (36° FOV) viewing angle optics, VESA 1-arcminute visual acuity 4K benefit thresholds, screen aspect ratios, and projector throw distance calculations.
  - Programmatic pSEO routes across popular screen sizes (55", 65", 75", 85", 98", 120").
- **NEC 2026 Electrical Wire Gauge & Voltage Drop Calculator (`/benchmarks/wire-gauge-calculator`, `/benchmarks/wire-gauge-calculator/[slug]`)**:
  - Powered by `src/engine/WireGaugeEngine.ts`.
  - NEC Table 310.16 conductor ampacity limits (Copper/Aluminum, 60°C/75°C/90°C), voltage drop formula $V_d = (2 \times K \times I \times L) / CM$, conduit fill ratios, and inline NEC 2026 citations.
  - Programmatic pSEO routes across standard circuit amperages (15A, 20A, 30A, 50A, 100A, 200A).
- **3D Printer Filament Cost & Material Estimator (`/benchmarks/3d-print-cost`, `/benchmarks/3d-print-cost/[slug]`)**:
  - Powered by `src/engine/FilamentCostEngine.ts`.
  - Material density calculations (PLA, ABS, PETG, TPU, Nylon, PC), power consumption, failure rate buffers, and "Etsy Commercial Retail Pricing" profit margin models.
  - Programmatic pSEO routes across filament material types.

### 5.9 Universal Keyboard Testing Ecosystem & Switch Chatter Suite
- **Keyboard Diagnostic Suite & Switch Chatter Engine (`/keyboard-tester`, `/keyboard-tester/[slug]`)**:
  - Powered by `src/engine/KeyboardTesterEngine.ts` and `KeyboardTesterCanvas.astro`.
  - Interactive multi-layout key grid (ANSI 104, ISO 105, TKL 80%, 60% Mini, Apple Mac Layout), microsecond switch chatter/bounce timing analysis ($t_{\text{delta}} < 30\text{ms}$), NKRO gaming combo stress tests (WASD+Shift+Space, MOBA QWER+DF), real-time keypress heatmaps, APM/WPM typing speedometers, synthesized Web Audio switch sound feedback (Clicky Blue, Tactile Brown, Linear Red), and downloadable JSON hardware passport health certificates.
  - Programmatic pSEO routes across 8 keyboard search targets (`mechanical-keyboard-test`, `mac-keyboard-test`, `gaming-keyboard-test`, `laptop-keyboard-test`, `60-percent-keyboard-test`, `wireless-bluetooth-keyboard-test`, `key-chatter-test`, `nkro-rollover-test`).

### 5.10 Public Crowdsourced Per-Model Verified Results Database
- **Per-Model Telemetry Database (`/models`, `/models/[slug]`)**:
  - Powered by `DeviceDatabase.ts`, `HardwarePassportEngine.ts`, `ModelStatsCard.astro`, `ModelTelemetryTable.astro`, and `HardwarePassportModal.astro` contribution drawer.
  - Aggregates cryptographically signed SHA-256 hardware passport receipts across 25 flagship displays (Samsung Odyssey OLED G95SC, Alienware AW3423DWF/AW2725DF, ASUS PG32UCDM/PG248QP 540Hz, LG 27GR95QE/32GS95UE, Steam Deck OLED, MacBook Pro M3, iPad Pro M4, Nintendo Switch OLED, iPhone 15 Pro, etc.).
  - Displays sample volume, median VSync refresh rate ($240.0\text{ Hz}$), P95 frame pacing jitter ($0.42\text{ ms}$), ISO 9241-307 defect incidence breakdown, community health rating, and verified receipt ledger with direct links to `/passport/[hash]`.
  - Programmatic pSEO routes generating 104 static HTML pages across 4 locales (`en`, `es`, `de`, `fr`).

### 5.11 10-Item FAQ Architecture & Structured JSON-LD Schema
- **10 Structured FAQs per Tool Page**: Every primary tool page features exactly 10 real-intent technical FAQs ("What is...", "How do I...", "Why does...", "When should...", "Can I...") for maximum search intent coverage and helpful content compliance.
- **Dual-Layer Integration**:
  - Passed to `<Layout faqs={faqs}>` for automatic `FAQPage` JSON-LD schema graph generation inside `<head>`.
  - Rendered visually for human readers via `<FAQSection faqs={faqs} />` using accessible `<details>/<summary>` accordions with smooth hover transitions.

### 5.12 Premium Floating Action Menu (FAB) & Mobile Safe Area Geometry
- **Floating Action Menu (`FloatingActionMenu.astro`)**:
  - Positioned at `bottom-5 right-5 sm:bottom-6 sm:right-6` with native mobile safe area insets (`env(safe-area-inset-bottom)` and `env(safe-area-inset-right)`).
  - Styled with dark glassmorphic container (`bg-bg-surface/90 backdrop-blur-xl border border-border-hairline`), subtle green radial accent glow, and centered 2.5px SVG plus icon.
  - Eliminates overlap with mobile browser bottom bars, system gesture bars, or main page content.

### 5.13 Universal Mouse Diagnostic Suite & Esports Sensitivity Suite
- **Universal Mouse Diagnostics (`/mouse-test`, `/mouse-test/[slug]`)**:
  - Powered by `src/engine/MouseDpiEngine.ts`, `MousePollingEngine.ts`, `MouseDoubleClickEngine.ts`, and `MouseTesterCanvas.astro`.
  - Interactive 5-button SVG vector (LMB, MMB, RMB, MB4, MB5) with scroll wheel rotational velocity, `Pointer Lock API` physical displacement DPI solver, 8000Hz USB HID polling rate telemetry & jitter histogram, microsecond switch double-click chatter analyzer ($t_{\text{delta}} < 35\text{ms}$), Bezier trajectory smoothness splines, CS2/Valorant yaw-based sensitivity converter, eDPI pro player benchmark calculator, 7-round PSA method A/B testing, and hold-drag signal drop inspector.
  - Programmatic pSEO routes across 12 mouse search targets (`polling-rate`, `double-click`, `dpi-calculator`, `cps-test`, `scroll-wheel`, `jitter-test`, `sensitivity-converter`, `edpi-calculator`, `psa-method-calculator`, `hold-drag-test`, `right-click-cps-test`, `click-latency`, `precision-aim-test`).

### 5.14 Universal Controller & Gamepad Diagnostic Suite
- **Gamepad Diagnostic Suite (`/controller-test`, `/controller-test/[slug]`)**:
  - Powered by `src/engine/GamepadCircularityEngine.ts`, `GamepadDriftEngine.ts`, and `ControllerTesterCanvas.astro`.
  - Interactive 3D/Vector SVG controller keymap illustrations for **Sony PS5 DualSense**, **Microsoft Xbox Series X/S**, **Nintendo Switch Pro**, and **PlayStation 4 DualShock 4**.
  - Real-time W3C Gamepad API event loop (`navigator.getGamepads()`), analog stick circularity error percentage solver ($\text{Error} \% = \max_i \left|\sqrt{x_i^2 + y_i^2} - 1.0\right| \times 100\%$), centering drift variance indicator, analog trigger pressure linear response curves (L2/R2 / LT/RT), W3C vibration motor haptic pulse test, 1000Hz USB HID polling rate benchmark, and downloadable SHA-256 Controller Hardware Passport receipts.
  - Programmatic pSEO routes across 7 controller search targets (`stick-drift`, `polling-rate`, `button-test`, `ps5-dualsense`, `xbox-controller`, `nintendo-switch`, `ps4-dualshock`).

### 5.15 Universal Sound & Audio Diagnostic Suite
- **Universal Sound Diagnostics (`/sound-test`, `/sound-test/[slug]`)**:
  - Powered by `src/engine/AudioTestEngine.ts` and `AudioTesterCanvas.astro`.
  - Interactive Web Audio diagnostic suite featuring 2048-bin HTML5 Canvas FFT spectrum visualizer, AES17 logarithmic 20Hz-20kHz frequency sweeps, stereo speaker polarity & phase alignment analyzer, subwoofer 10Hz-200Hz bass sweep, ISO 8253-1 online hearing audiogram screening (250Hz-8kHz), 5-band binaural beats brainwave entrainment generator (Delta 2.5Hz, Theta 6Hz, Alpha 10Hz, Beta 20Hz, Gamma 40Hz), Web Audio parametric tone oscillator (Sine, Square, Sawtooth, Triangle), 5.1/7.1 spatial surround sound channel test, IEC 61672-1 mic RMS dBFS noise floor meter, Bluetooth click-to-audio latency profiler (SBC, AAC, aptX, LDAC), 10-item FAQ schema graphs, and downloadable SHA-256 Audio Hardware Passports.
  - Programmatic pSEO routes across 10 audio search targets (`speaker-test`, `headphone-test`, `bass-test`, `hearing-test`, `binaural-beats`, `microphone-test`, `tone-generator`, `surround-sound`, `audio-latency`).



