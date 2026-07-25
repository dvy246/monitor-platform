# AGENTS.md — Monitor Test Hub Project Guidelines

Welcome to **Monitor Test Hub** (`nasty-neptune`), a high-performance, web-native diagnostic, calibration, and benchmarking suite built for visual display testing, high-refresh-rate latency diagnostics, VRR stutter detection, OLED burn-in risk modeling, mobile touch matrix testing, and universal sound/speaker diagnostics.

This document serves as the primary technical guide and rules of engagement for AI agents and human developers operating within this repository.

---

## 1. Project Architecture & Tech Stack

### Core Technologies
- **Framework**: [Astro v7](https://astro.build/) (`output: 'static'`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Language**: TypeScript (`tsconfig.json`, strict mode)
- **Engine Testing**: [Vitest](https://vitest.dev/) (337 unit & stress test cases across 59 test suites, 100% PASS)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **SEO & Performance Audit**: Lighthouse CI (`@lhci/cli`), `@astrojs/sitemap` (2,856 static pages generated across 4 locales, canonical domain: `https://displaytestonline.com`)
- **Hosting & Infrastructure**: Cloudflare Pages via Wrangler (`npm run deploy`) — **LIVE AT https://displaytestonline.com**

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
    │   │   ├── MicVerificationEngine.ts     # Closed-loop microphone decibel gain measurement engine
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
    │   │   └── *.test.ts                    # Vitest unit/stress/perf test suites (337 tests across 59 files)
    │   ├── pages/                           # Astro page routes
    │   │   ├── index.astro                  # Homepage & real-time telemetry deck (~950-word Helpful Content SEO suite)
    │   │   ├── tools.astro                  # Universal Diagnostic Tools Hub (/tools - 60+ instruments)
    │   │   ├── refresh-rate-test.astro      # Screen Refresh Rate & Hz Test suite (10-item FAQ + schema)
    │   │   ├── monitor-color-calibration.astro # Monitor Color Calibration Suite (Gamma 2.2, ΔE00, ICC v4.3, 10-item FAQ)
    │   │   ├── sound-test.astro             # Universal Sound & Speaker Test Suite (L/R balance, 10-item FAQ + schema)
    │   │   ├── sound-test/                  # Sound diagnostic sub-tools (speaker-test, headphone-test, bass-test, microphone-test, tone-generator, water-eject, earpiece-cleaner, mic-verification, speaker-test-music, surround-sound, audio-latency)
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
    │   │   ├── diagnostics/                 # FrequencyGeneratorCanvas, EarpieceCleanerCanvas, MicVerificationCanvas, AudiophilePlayerCanvas, RefreshRateInspector, HardwarePassportModal, etc.
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
| **Build** | `TMPDIR=$PWD/.tmp npm run build` | Compile static production site to `./dist/` (2,856 static pages) |
| **Preview** | `npm run preview` | Serve production build locally |

### Testing & Quality Assurance
| Test Suite | Command | Notes |
| :--- | :--- | :--- |
| **Unit & Engine Tests** | `TMPDIR=$PWD/.tmp npm test` *(or `npx vitest run`)* | Runs all 337 test cases across 59 test suites (100% PASS) |
| **Targeted Engine Test** | `TMPDIR=$PWD/.tmp npx vitest run src/engine/MicVerificationEngine.test.ts` | Test specific engine module |
| **Stress & Perf Tests** | `TMPDIR=$PWD/.tmp npx vitest run src/engine/HdrTestEngine.stress.test.ts` | Benchmark under 100,000-operation high load |
| **Type Check** | `./node_modules/.bin/tsc --noEmit` | Strict TypeScript type verification (0 errors) |
| **E2E Integration** | `npx playwright test` | Runs Playwright tests in `tests/e2e/` |
| **Doc Verification** | `python3 verify_docs.py` | Verifies PRD, Plan & Competitor report integrity (20/20 PASS) |

### Deployment
| Destination | Command | Notes |
| :--- | :--- | :--- |
| **Cloudflare Pages Production** | `TMPDIR=$PWD/.tmp npm run deploy` | Builds site & deploys `./dist/` to `monitor-testing` Cloudflare Pages project |
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

3. **SEO & Canonical Integrity**
   - Canonical URLs are normalized in `<SEOHead.astro>` to enforce `https://displaytestonline.com` + clean path without `www` or trailing slash discrepancies.
   - Every primary tool page features 10 real-intent technical FAQs paired with Google `FAQPage` JSON-LD schema graphs.

4. **Styling & Aesthetics**
   - Built with **Tailwind CSS v4** (`@tailwindcss/vite`).
   - Design tone: Sleek, high-precision dark theme optimized for OLED, high-refresh-rate gaming monitors, and mobile touch displays.

---

## 4. Guidelines for AI Agents

- **Source of Truth First**: Never guess parameter names or types. Inspect definitions in `src/types/` and existing engine specs in `src/engine/`.
- **Verification Rule**: Whenever modifying files in `src/engine/` or `src/pages/`, verify your changes by executing `npm test`, `./node_modules/.bin/tsc --noEmit`, or `npm run build`.
- **Working Directory**: Always specify `Cwd: "/Users/divyyadav/newws/monitor_test_hub"` when launching shell commands or running tests.

---

## 5. Comprehensive Feature Matrix & Diagnostic Instruments

### 5.1 Desktop Visual Display Diagnostics Suite
- **Dead Pixel & Sub-Pixel Defect Inspector**: ISO 9241-307 Class I-IV specs with coordinate logging.
- **Sub-Pixel Layout & Font Antialiasing Analyzer**: Standard RGB, BGR, QD-OLED Triangular, WOLED RWBG ClearType fringing simulation.
- **OLED 5%/10% Uniformity, IPS Glow & VA Smearing Inspector**: Low-gray luminance patterns mapped to IEC 62341-6-2.
- **540Hz+ VRR Stutter & Tearing Sweep Engine**: Real-time rAF frame pacing delta ($1/\text{FPS}$) and tear bar sweep.
- **OLED Burn-In Risk Model**: Sub-pixel degradation decay estimator & maintenance cycle calculator.
- **10-Bit HDR PQ EOTF Tone Mapping & ABL Evaluator**: VESA DisplayHDR 400/600/1000/1400/True Black compliance.
- **Sub-Pixel Density (PPI) & Arcminute Acuity Calculator**: 1-arcminute visual acuity viewing distance solver.
- **CIE 1931 Color Gamut Map & ICC v4.3 Profile Exporter**: sRGB, DCI-P3, AdobeRGB, Rec.2020 2D/3D gamut visualizer with binary `.icc` file download.

### 5.2 Mobile Touchscreen & Digitizer Diagnostic Suite
- **Touch Matrix Grid & Dead-Zone Analyzer**: Dynamic contact grid tracking dead-zones and matrix coverage (%).
- **Multi-Touch Point Counter**: 10+ finger simultaneous touch contact IDs, pressure, and radius geometry.
- **RMS Sub-Pixel Line Noise & Vector Precision Analyzer**: Evaluates touch digitizer EMI noise against ideal vectors.
- **Gesture Kinematics & Swipe Velocity Tracker**: Velocity vectors ($\text{px/ms}$, $\text{mm/s}$) and fling kinematics.

### 5.3 Universal Sound & Speaker Diagnostics Ecosystem
- **Free Online Tone Generator & Frequency Sound Maker (`/sound-test/tone-generator`)**:
  - Web Audio 64-bit synthesizer (1 Hz to 20,000 Hz) with instant digital frequency readout.
  - **Hardware-Grade Zero-Crossing Oscilloscope**: Samples live audio time-domain data using rising edge zero-crossing triggering for a stable CRT phosphor trace.
  - **Brainwave Focus Frequencies**: Presets for Beta Waves (20 Hz - Deep Work/Studying), Gamma Waves (40 Hz - Rapid Cognition), and Alpha Waves (10 Hz - Creative Alertness).
  - **Stereo Headphones Binaural Beats Guide**: Dual-oscillator binaural beats instruction banner.
  - **3-Step Interactive Recommendation Wizard Modal**: Asks users 3 quick goal/device/intensity questions and auto-calculates the optimal frequency and waveform with 1-click apply.
- **Phone Earpiece Cleaner (`/sound-test/earpiece-cleaner`)**:
  - High-pass 250Hz–600Hz acoustic sweep specialized for delicate top call receivers with liquid displacement guidance.
- **Microphone Verification Engine (`/sound-test/mic-verification`)**:
  - 3-step decibel test ($dB_{\text{pre}}$ vs $dB_{\text{post}}$) evaluating decibel gain ($\Delta dB$) via `MicVerificationEngine.ts`.
- **Audiophile Player (`/sound-test/speaker-test-music`)**:
  - Web Audio BiquadFilter EQ band isolator for isolating Lows, Mids, and Highs in real time.
- **Water Eject Sound Tool (`/sound-test/water-eject`)**:
  - High-intensity 165Hz kinetic pressure pulse for main speaker water removal.

### 5.4 Universal Keyboard Testing Ecosystem
- **Keyboard Tester & Switch Chatter Engine (`/keyboard-tester`, `/keyboard-tester/[slug]`)**:
  - Multi-layout key grid (ANSI 104, ISO 105, TKL 80%, 60% Mini, Apple Mac Layout), microsecond switch chatter bounce analysis ($t_{\text{delta}} < 35\text{ms}$), NKRO combo stress tests, typing speedometers, Web Audio switch sound synthesis, and downloadable JSON health certificates.

### 5.5 Crowd-Sourced Hardware Passport Database
- **Per-Model Telemetry Hub (`/models`, `/models/[slug]`)**:
  - Aggregates cryptographically signed SHA-256 hardware passport receipts across 25 flagship displays and gaming devices.
