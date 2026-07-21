# AGENTS.md — Monitor Test Hub Project Guidelines

Welcome to **Monitor Test Hub** (`nasty-neptune`), a high-performance, web-native diagnostic, calibration, and benchmarking suite built for visual display testing, high-refresh-rate latency diagnostics, VRR stutter detection, OLED burn-in risk modeling, and mobile touch matrix testing.

This document serves as the primary technical guide and rules of engagement for AI agents and human developers operating within this repository.

---

## 1. Project Architecture & Tech Stack

### Core Technologies
- **Framework**: [Astro v7](https://astro.build/) (`output: 'static'`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Language**: TypeScript (`tsconfig.json`, strict mode)
- **Engine Testing**: [Vitest](https://vitest.dev/) (198 unit & stress test cases across 33 test suites)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **SEO & Performance Audit**: Lighthouse CI (`@lhci/cli`), `@astrojs/sitemap` (752 static pages generated)
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
    ├── src/
    │   ├── engine/                          # Decoupled TypeScript calculation & math engines
    │   │   ├── HardwarePassportEngine.ts    # SHA-256 signed hardware receipt & health index engine
    │   │   ├── MultiDisplaySync.ts          # Native BroadcastChannel peer window sync bus
    │   │   ├── InputLagEngine.ts            # Reaction time, hardware delay & polling stats
    │   │   ├── OledBurnInEngine.ts          # Burn-in risk model & sub-pixel degradation engine
    │   │   ├── HdrTestEngine.ts             # 10-bit PQ EOTF tone mapping & ABL window size evaluator
    │   │   ├── TouchMatrixEngine.ts         # Multi-touch gesture & dead-zone matrix analyzer
    │   │   ├── VrrSweepEngine.ts            # Variable Refresh Rate stutter & tear engine (540Hz+)
    │   │   ├── IccExporter.ts               # Display calibration & binary ICC v4.3 profile exporter
    │   │   └── *.test.ts                    # Vitest unit/stress/perf test suites (136 tests)
    │   ├── pages/                           # Astro page routes
    │   │   ├── index.astro                  # Homepage & real-time telemetry deck
    │   │   ├── [locale]/                    # Localized routes (es, de, fr)
    │   │   ├── display-tests/               # Visual tests (dead-pixel, sub-pixel, uniformity, vrr, oled-burn-in, hdr-test, ppi-calculator, color-gamut)
    │   │   ├── touch-tests/                 # Mobile touch tests (dead-zone, multi-touch, vector-precision, swipe-velocity, input-lag)
    │   │   ├── input-lag-test/              # Programmatic input lag pSEO routes
    │   │   ├── oled-burn-in-risk/           # Dynamic burn-in risk pSEO routes
    │   │   ├── vrr-stutter-test/            # VRR tear & stutter pSEO routes
    │   │   ├── touch-matrix/                # Touch matrix pSEO routes
    │   │   ├── hdr-test/                    # HDR clipping pSEO routes
    │   │   ├── arcade/                      # Interactive diagnostic micro-games (4 games)
    │   │   ├── about.astro                  # 600-word SEO & engineering standards overview
    │   │   ├── faq.astro                    # 12-item FAQ page with JSON-LD schema
    │   │   ├── contact.astro                # Client-side contact form
    │   │   ├── terms.astro                  # Terms & conditions page
    │   │   └── privacy.astro                # Privacy policy page
    │   ├── components/                      # UI, Diagnostic & Disclaimer components
    │   │   ├── diagnostics/                 # DeadPixel, HardwarePassportModal, SubPixel, Uniformity, VRR, HDR, Touch components
    │   │   ├── disclaimers/                 # Epilepsy, Ergonomics & Hardware Limitation warnings
    │   │   ├── seo/                         # SEOHead, SchemaGraph & Medical notice banners
    │   │   └── arcade/                      # Diagnostic game components
    │   ├── layouts/                         # Layout templates (Layout.astro)
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
| **Build** | `npm run build` | Compile static production site to `./dist/` (596 static pages) |
| **Preview** | `npm run preview` | Serve production build locally |

### Testing & Quality Assurance
| Test Suite | Command | Notes |
| :--- | :--- | :--- |
| **Unit & Engine Tests** | `npm test` *(or `npx vitest run`)* | Runs all 198 `src/engine/*.test.ts` test cases across 33 test suites |
| **Targeted Engine Test** | `npx vitest run src/engine/HardwarePassportEngine.test.ts` | Test specific engine module |
| **Stress & Perf Tests** | `npx vitest run src/engine/HdrTestEngine.stress.test.ts` | Benchmark under 100,000-operation high load |
| **Type Check** | `npx tsc --noEmit` | Strict TypeScript type verification |
| **E2E Integration** | `npx playwright test` | Runs Playwright tests in `tests/e2e/` |
| **Doc Verification** | `python3 verify_docs.py` | Verifies PRD, Plan & Competitor report integrity (20/20 PASS) |

### Deployment
| Destination | Command | Notes |
| :--- | :--- | :--- |
| **Cloudflare Pages Production** | `npm run deploy` | Builds site & deploys `./dist/` to `monitor-testing` project |
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
