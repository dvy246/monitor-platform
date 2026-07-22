# Monitor Test Hub — Comprehensive Site Route Inventory & Architecture Audit

**Generated Date**: July 22, 2026  
**Target Repository**: `/Users/divyyadav/newws/monitor_test_hub/`  
**Analyzer**: Agent 1 — Site Discovery Specialist  

---

## Executive Summary & High-Level Site Metrics

**Monitor Test Hub** (`nasty-neptune`) is a static, high-performance visual display, latency, touch digitizer, keyboard, and hardware benchmark suite built on **Astro v7**, **Tailwind CSS v4**, and **TypeScript**. 

### Global Route & Generation Metrics
* **Total Source Page Files**: `165` `.astro` / `.ts` files inside `src/pages/`
  * **Root (Default Locale `en`) Source Templates**: `101` files
  * **Localized (`[locale]`: `es`, `de`, `fr`) Source Templates**: `64` files
* **Total Static Generated Output Pages (`./dist/`)**: `2,705` static HTML/SVG pages
  * **English (`en` - Unprefixed)**: `716` pages
  * **Spanish (`es` - `/es/`)**: `663` pages
  * **German (`de` - `/de/`)**: `663` pages
  * **French (`fr` - `/fr/`)**: `663` pages

---

## Section 1: Complete Page Inventory Checklist

Below is the comprehensive inventory mapping out every single route template in the codebase, grouped by functional domain.

### 1.1 Root & Core Static Pages
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & SEO Intent |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/pages/index.astro` | Static | ✅ (`[locale]/index.astro`) | Main Homepage & real-time browser/GPU telemetry dashboard. |
| `/about` | `src/pages/about.astro` | Static | ❌ (Root Only) | Engineering standards, ISO 9241-307 background, team vision. |
| `/contact` | `src/pages/contact.astro` | Static | ❌ (Root Only) | Client-side feedback & developer contact form. |
| `/faq` | `src/pages/faq.astro` | Static | ❌ (Root Only) | 12-item display diagnostic FAQ with JSON-LD schema. |
| `/privacy` | `src/pages/privacy.astro` | Static | ✅ (`[locale]/privacy.astro`) | 100% ad-free & zero-tracking privacy policy statement. |
| `/terms` | `src/pages/terms.astro` | Static | ❌ (Root Only) | Terms of service & warranty disclaimer page. |
| `/monitor-color-calibration` | `src/pages/monitor-color-calibration.astro` | Static | ❌ (Root Only) | Monitor Color Calibration Suite (Gamma 2.2, ΔE00, ICC v4.3). |
| `/refresh-rate-test` | `src/pages/refresh-rate-test.astro` | Static | ❌ (Root Only) | Core Screen Refresh Rate & Hz Test suite. |
| `/screen-test-meaning` | `src/pages/screen-test-meaning/index.astro` | Static Index | ✅ (`[locale]/screen-test-meaning/index.astro`) | Diagnostic interpretation guide for display testing terms. |

---

### 1.2 Desktop Visual Display Diagnostics (`/display-tests/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/display-tests` | `src/pages/display-tests/index.astro` | Directory Index | ✅ | Master directory hub for display diagnostic tools. |
| `/display-tests/apca-contrast` | `src/pages/display-tests/apca-contrast.astro` | Diagnostic Tool | ✅ | Advanced Perceptual Contrast Algorithm (APCA W3C) text readability test. |
| `/display-tests/backlight-bleed` | `src/pages/display-tests/backlight-bleed.astro` | Diagnostic Tool | ❌ | IPS backlight bleed, clouding & corner vignetting dark room evaluator. |
| `/display-tests/color-banding` | `src/pages/display-tests/color-banding.astro` | Diagnostic Tool | ❌ | 8-bit vs 10-bit color depth gradient step & posterization checker. |
| `/display-tests/color-gamut` | `src/pages/display-tests/color-gamut.astro` | Diagnostic Tool | ✅ | sRGB, DCI-P3, AdobeRGB, Rec.2020 2D chromaticity visualization. |
| `/display-tests/colorblind-simulation` | `src/pages/display-tests/colorblind-simulation.astro` | Diagnostic Tool | ❌ | Protanopia, Deuteranopia, Tritanopia vision filter simulator. |
| `/display-tests/contrast-accessibility` | `src/pages/display-tests/contrast-accessibility.astro` | Diagnostic Tool | ✅ | WCAG 2.1 & APCA color contrast compliance checker. |
| `/display-tests/dead-pixel` | `src/pages/display-tests/dead-pixel.astro` | Diagnostic Tool | ✅ | Fullscreen solid color cycler for detecting stuck/dead sub-pixels. |
| `/display-tests/dead-pixel-test` | `src/pages/display-tests/dead-pixel-test/index.astro` | Directory Index | ✅ | Hub for model-specific dead pixel inspection tools. |
| `/display-tests/dead-pixel-test/[slug]` | `src/pages/display-tests/dead-pixel-test/[slug].astro` | Dynamic Template | ✅ | Programmatic device pSEO routes (101 models: MacBook, Steam Deck, Switch, etc.). |
| `/display-tests/delta-e-calculator` | `src/pages/display-tests/delta-e-calculator.astro` | Diagnostic Tool | ✅ | CIEDE2000 ($\Delta E_{00}$) color difference accuracy calculator. |
| `/display-tests/electricity-cost` | `src/pages/display-tests/electricity-cost.astro` | Diagnostic Index | ✅ | US state-by-state appliance & display power cost calculator. |
| `/display-tests/electricity-cost/[slug]` | `src/pages/display-tests/electricity-cost/[slug].astro` | Dynamic Template | ✅ | Programmatic pSEO routes across all 50 US states + DC (51 pages). |
| `/display-tests/frame-skipping` | `src/pages/display-tests/frame-skipping.astro` | Diagnostic Tool | ❌ | High-refresh-rate camera shutter frame drop detection grid. |
| `/display-tests/gamma` | `src/pages/display-tests/gamma.astro` | Diagnostic Tool | ❌ | Gamma 1.8 - 2.6 blend calibration pattern for mid-tone brightness. |
| `/display-tests/geometry` | `src/pages/display-tests/geometry.astro` | Diagnostic Tool | ❌ | CRT & curved display aspect ratio, grid distortion, and alignment checker. |
| `/display-tests/grayscale` | `src/pages/display-tests/grayscale.astro` | Diagnostic Tool | ❌ | 256-level grayscale step ramp for shadow detail & highlight clipping. |
| `/display-tests/hdr-test` | `src/pages/display-tests/hdr-test.astro` | Diagnostic Tool | ✅ | Quick web HDR peak brightness & EOTF tone mapping evaluator. |
| `/display-tests/local-dimming` | `src/pages/display-tests/local-dimming.astro` | Diagnostic Tool | ❌ | Mini-LED zone local dimming blooming & haloing stress test. |
| `/display-tests/motion-blur` | `src/pages/display-tests/motion-blur.astro` | Diagnostic Tool | ❌ | MPRT response time & overdrive ghosting pursuit camera pattern. |
| `/display-tests/oled-burn-in` | `src/pages/display-tests/oled-burn-in.astro` | Diagnostic Tool | ✅ | Sub-pixel burn-in risk estimator & static element wear model. |
| `/display-tests/pixel-walk` | `src/pages/display-tests/pixel-walk.astro` | Diagnostic Tool | ❌ | Inversion & pixel walk flickering pattern for LCD bias voltage evaluation. |
| `/display-tests/ppi-calculator` | `src/pages/display-tests/ppi-calculator.astro` | Diagnostic Tool | ✅ | Pixels-Per-Inch, dot pitch, and 1-arcminute visual acuity calculator. |
| `/display-tests/pwm-flicker` | `src/pages/display-tests/pwm-flicker.astro` | Diagnostic Tool | ❌ | Pulse-Width Modulation backlight flicker & high-speed camera test. |
| `/display-tests/refresh-rate-test/[targetHz]` | `src/pages/display-tests/refresh-rate-test/[targetHz].astro` | Dynamic Template | ❌ | Target Hz landing pages (60Hz, 120Hz, 144Hz, 165Hz, 240Hz, 360Hz, 540Hz). |
| `/display-tests/return-window-checker/[slug]` | `src/pages/display-tests/return-window-checker/[slug].astro` | Dynamic Template | ✅ | ISO 9241-307 Class I-IV return & RMA guidance for 101 hardware models. |
| `/display-tests/stuck-pixel` | `src/pages/display-tests/stuck-pixel.astro` | Diagnostic Tool | ❌ | Rapid color flashing pixel un-sticking repair utility. |
| `/display-tests/sub-pixel` | `src/pages/display-tests/sub-pixel.astro` | Diagnostic Tool | ✅ | Sub-pixel geometry reticle (RGB, BGR, QD-OLED, WOLED RWBG) & ClearType text. |
| `/display-tests/text-sharpness` | `src/pages/display-tests/text-sharpness.astro` | Diagnostic Tool | ❌ | Subpixel text clarity, antialiasing fringing, and font rendering evaluator. |
| `/display-tests/tv-viewing-distance` | `src/pages/display-tests/tv-viewing-distance.astro` | Diagnostic Index | ❌ (Missing in `[locale]`) | SMPTE 30°/40° & THX 36° TV/Projector viewing distance optics hub. |
| `/display-tests/tv-viewing-distance/[slug]` | `src/pages/display-tests/tv-viewing-distance/[slug].astro` | Dynamic Template | ✅ | Programmatic routes for screen sizes (50", 55", 65", 75", 85", 98", 120"). |
| `/display-tests/uniformity` | `src/pages/display-tests/uniformity.astro` | Diagnostic Tool | ✅ | IEC 62341-6-2 5%/10% OLED dark-gray uniformity & IPS vignetting check. |
| `/display-tests/viewing-angle` | `src/pages/display-tests/viewing-angle.astro` | Diagnostic Tool | ❌ | Off-axis gamma shift, color tinting, and contrast roll-off checker. |
| `/display-tests/vrr` | `src/pages/display-tests/vrr.astro` | Diagnostic Tool | ✅ | G-Sync, FreeSync, and VRR frame pacing sweep bar visualizer. |

---

### 1.3 Mobile Touchscreen & Digitizer Diagnostics (`/touch-tests/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/touch-tests` | `src/pages/touch-tests/index.astro` | Directory Index | ✅ | Mobile touchscreen diagnostic hub for phones & tablets. |
| `/touch-tests/dead-zone` | `src/pages/touch-tests/dead-zone.astro` | Diagnostic Tool | ✅ | Screen grid tracking active touch contacts & dead zones. |
| `/touch-tests/input-lag` | `src/pages/touch-tests/input-lag.astro` | Diagnostic Tool | ✅ | Touch-to-photon latency & dispatch delay test. |
| `/touch-tests/multi-touch` | `src/pages/touch-tests/multi-touch.astro` | Diagnostic Tool | ✅ | 10+ point simultaneous touch contact counter & radius tracker. |
| `/touch-tests/stylus-pressure` | `src/pages/touch-tests/stylus-pressure.astro` | Diagnostic Tool | ❌ | Active stylus pressure sensitivity, tilt vector & palm rejection test. |
| `/touch-tests/swipe-velocity` | `src/pages/touch-tests/swipe-velocity.astro` | Diagnostic Tool | ✅ | Fling gesture velocity tracking ($\text{px/ms}$, $\text{mm/s}$). |
| `/touch-tests/touch-sampling-rate` | `src/pages/touch-tests/touch-sampling-rate.astro` | Diagnostic Tool | ✅ | Touch digitizer polling rate evaluator (Hz). |
| `/touch-tests/vector-precision` | `src/pages/touch-tests/vector-precision.astro` | Diagnostic Tool | ✅ | Touch digitizer EMI noise & RMS vector precision line inspector. |

---

### 1.4 Fullscreen White Screen & Lighting Utility (`/white-screen/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/white-screen` | `src/pages/white-screen/index.astro` | Utility Index | ✅ | Fullscreen lighting utility with Screen Wake Lock API & 2700K-6500K CCT. |
| `/white-screen/[color]` | `src/pages/white-screen/[color].astro` | Dynamic Template | ✅ | Programmatic color canvases (`black-screen`, `blue-screen`, `green-screen`, `red-screen`, `yellow-screen`, `zoom-light`). |

---

### 1.5 Keyboard & Switch Diagnostics (`/keyboard-tester/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/keyboard-tester` | `src/pages/keyboard-tester/index.astro` | Diagnostic Hub | ✅ | Multi-layout key tester (ANSI 104, ISO 105, TKL, 60%, Mac) & bounce timing. |
| `/keyboard-tester/[slug]` | `src/pages/keyboard-tester/[slug].astro` | Dynamic Template | ✅ | Programmatic search targets (15 routes: `online-keyboard-test`, `mac-keyboard-test`, `key-chatter-test`, `nkro-rollover-test`, etc.). |
| `/keyboard-tester/switches` | `src/pages/keyboard-tester/switches/index.astro` | Directory Index | ❌ (Missing in `[locale]`) | Mechanical key switch directory & actuation force comparison hub. |
| `/keyboard-tester/switches/[slug]` | `src/pages/keyboard-tester/switches/[slug].astro` | Dynamic Template | ✅ | Model specs for 10 switch types (Cherry MX Red/Blue/Brown, Gateron Oil King, etc.). |

---

### 1.6 Micro-Utility Benchmarks & Calculators (`/benchmarks/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/benchmarks` | `src/pages/benchmarks/index.astro` | Benchmark Hub | ✅ | Main hub for hardware calculators & performance diagnostics. |
| `/benchmarks/3d-print-cost` | `src/pages/benchmarks/3d-print-cost.astro` | Calculator Index | ❌ (Missing in `[locale]`) | 3D printing filament, energy, wear, and Etsy profit margin calculator. |
| `/benchmarks/3d-print-cost/[slug]` | `src/pages/benchmarks/3d-print-cost/[slug].astro` | Dynamic Template | ✅ | Programmatic material routes (6 types: PLA, ABS, PETG, TPU, Nylon, PC). |
| `/benchmarks/gamepad-drift` | `src/pages/benchmarks/gamepad-drift.astro` | Diagnostic Tool | ✅ | HTML5 Gamepad API stick drift, dead-zone, and circularity error inspector. |
| `/benchmarks/pc-bottleneck` | `src/pages/benchmarks/pc-bottleneck.astro` | Calculator Index | ✅ | Resolution-aware CPU vs GPU balance, bottleneck %, and FPS estimator. |
| `/benchmarks/pc-bottleneck/[slug]` | `src/pages/benchmarks/pc-bottleneck/[slug].astro` | Dynamic Template | ✅ | Programmatic pSEO hardware pairings (64 CPU × GPU routes). |
| `/benchmarks/room-mode-calculator` | `src/pages/benchmarks/room-mode-calculator.astro` | Calculator | ✅ | Acoustic standing wave, axial/tangential room mode, and resonance calculator. |
| `/benchmarks/solar-tilt-calculator` | `src/pages/benchmarks/solar-tilt-calculator.astro` | Calculator | ✅ | Seasonal solar PV tilt angle & solar energy output optimizer. |
| `/benchmarks/wire-gauge-calculator` | `src/pages/benchmarks/wire-gauge-calculator.astro` | Calculator Index | ❌ (Missing in `[locale]`) | NEC 2026 electrical conductor ampacity & voltage drop calculator hub. |
| `/benchmarks/wire-gauge-calculator/[slug]` | `src/pages/benchmarks/wire-gauge-calculator/[slug].astro` | Dynamic Template | ✅ | Programmatic circuit amperage routes (15A, 20A, 30A, 50A, 100A, 200A). |
| `/benchmarks/wireless-latency` | `src/pages/benchmarks/wireless-latency.astro` | Diagnostic Tool | ✅ | WebRTC / WebSocket microsecond network ping & packet jitter analyzer. |

---

### 1.7 Gamified Arcade Diagnostic Suite (`/arcade/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/arcade` | `src/pages/arcade/index.astro` | Arcade Hub | ✅ | Diagnostic micro-game hub. |
| `/arcade/color-match-alchemist` | `src/pages/arcade/color-match-alchemist.astro` | Micro-Game | ✅ | Perceptual color discrimination challenge using CIEDE2000 ($\Delta E_{00}$). |
| `/arcade/ghosting-invaders` | `src/pages/arcade/ghosting-invaders.astro` | Micro-Game | ✅ | Motion blur, MPRT, and overdrive overshoot targeting game. |
| `/arcade/lag-reflex-sniper` | `src/pages/arcade/lag-reflex-sniper.astro` | Micro-Game | ✅ | Click-to-photon human reaction time & display input latency benchmark. |
| `/arcade/touch-matrix-defusal` | `src/pages/arcade/touch-matrix-defusal.astro` | Micro-Game | ✅ | Gamified multi-touch digitizer responsiveness & precision speed test. |

---

### 1.8 Device Catalog & Hardware Comparison Engine (`/models/`, `/compare/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/models` | `src/pages/models/index.astro` | Catalog Hub | ✅ | Verified crowdsourced device catalog & telemetry table hub. |
| `/models/[slug]` | `src/pages/models/[slug].astro` | Dynamic Template | ✅ | Crowdsourced telemetry specs & ISO 9241-307 health score (101 models). |
| `/compare` | `src/pages/compare/index.astro` | Comparison Hub | ✅ | Side-by-side display spec & hardware passport comparison hub. |
| `/compare/[slug]` | `src/pages/compare/[slug].astro` | Dynamic Template | ✅ | Pre-configured head-to-head comparison pages (5 flagship pairs). |

---

### 1.9 Hardware Passport Telemetry & Verification (`/passport/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/passport/[hash]` | `src/pages/passport/[hash].astro` | Dynamic Template | ✅ | Immutable SHA-256 signed hardware health receipt verification page (5 sample hashes). |
| `/passport/[hash]/badge.svg` | `src/pages/passport/[hash]/badge.svg.ts` | API Endpoint | ❌ (Root Only) | Dynamic SVG health badge renderer for GitHub README embeds. |

---

### 1.10 Standalone Parametric Matrix Diagnostic Suites
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/hdr-test` | `src/pages/hdr-test/index.astro` | Suite Hub | ✅ | Top-level 10-bit HDR PQ tone mapping matrix hub. |
| `/hdr-test/[peakNits]/[toneMapping]` | `src/pages/hdr-test/[peakNits]/[toneMapping].astro` | Dynamic Template | ✅ | Matrix routes (4 peak nits $\times$ 6 tone mapping curves = 24 routes). |
| `/input-lag-test` | `src/pages/input-lag-test/index.astro` | Suite Hub | ✅ | Top-level click-to-photon latency matrix hub. |
| `/input-lag-test/[refreshRate]/[pollingRate]` | `src/pages/input-lag-test/[refreshRate]/[pollingRate].astro` | Dynamic Template | ✅ | Matrix routes (6 refresh rates $\times$ 6 polling rates = 36 routes). |
| `/oled-burn-in-risk` | `src/pages/oled-burn-in-risk/index.astro` | Suite Hub | ✅ | Top-level OLED sub-pixel burn-in risk matrix hub. |
| `/oled-burn-in-risk/[panelType]/[usageTier]` | `src/pages/oled-burn-in-risk/[panelType]/[usageTier].astro` | Dynamic Template | ✅ | Matrix routes (7 panel types $\times$ 4 usage tiers = 28 routes). |
| `/touch-matrix` | `src/pages/touch-matrix/index.astro` | Suite Hub | ✅ | Top-level touch digitizer & EMI matrix hub. |
| `/touch-matrix/[deviceType]/[gridDensity]` | `src/pages/touch-matrix/[deviceType]/[gridDensity].astro` | Dynamic Template | ✅ | Matrix routes (4 device types $\times$ 4 grid densities = 16 routes). |
| `/vrr-stutter-test` | `src/pages/vrr-stutter-test/index.astro` | Suite Hub | ✅ | Top-level 540Hz+ VRR stutter & tearing matrix hub. |
| `/vrr-stutter-test/[gpuVendor]/[refreshRate]` | `src/pages/vrr-stutter-test/[gpuVendor]/[refreshRate].astro` | Dynamic Template | ✅ | Matrix routes (4 GPU vendors $\times$ 5 refresh rates = 20 routes). |

---

### 1.11 Knowledge Base & Learning Guides Library (`/guides/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| `/guides` | `src/pages/guides/index.astro` | Guide Hub | ✅ | Display diagnostic & hardware technical guide hub. |
| `/guides/[slug]` | `src/pages/guides/[slug].astro` | Dynamic Template | ✅ | Comprehensive engineering articles (22 guide articles: OLED physics, 540Hz VRR, HDR PQ, etc.). |

---

### 1.12 Audio & Legacy Input Suites (`/audio-tests/`, `/input-tests/`)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Status |
| :--- | :--- | :--- | :--- | :--- |
| `/audio-tests/mic-noise-floor` | `src/pages/audio-tests/mic-noise-floor.astro` | Diagnostic Tool | ❌ | Microphone background noise floor & RMS dB inspector. |
| `/audio-tests/speaker-frequency` | `src/pages/audio-tests/speaker-frequency.astro` | Diagnostic Tool | ❌ | Audio speaker frequency response sweep (20Hz - 20kHz). |
| `/input-tests/gamepad-drift` | `src/pages/input-tests/gamepad-drift.astro` | Diagnostic Tool | ❌ | Legacy Gamepad drift inspector (Overlap with `/benchmarks/gamepad-drift`). |
| `/input-tests/keyboard-rollover` | `src/pages/input-tests/keyboard-rollover.astro` | Diagnostic Tool | ❌ | NKRO & key rollover matrix inspector. |
| `/input-tests/mouse-double-click` | `src/pages/input-tests/mouse-double-click.astro` | Diagnostic Tool | ❌ | Mouse switch debouncing & unintended double-click detector. |
| `/input-tests/mouse-polling` | `src/pages/input-tests/mouse-polling.astro` | Diagnostic Tool | ❌ | High-rate (8000Hz USB) mouse polling rate & rAF pacing jitter test. |

---

### 1.13 Embed Widgets & System Endpoint Routes (`/embed/`, system pages)
| Route Path | Source File | Type | Localized (`es/de/fr`) | Purpose & Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/embed/passport` | `src/pages/embed/passport.astro` | Embed Widget | ❌ (Root Only) | Lightweight iframe embed widget for displaying Hardware Passport badges. |
| `/embed/vrr-stutter` | `src/pages/embed/vrr-stutter.astro` | Embed Widget | ❌ (Root Only) | Lightweight iframe embed widget for VRR stutter sweep. |
| `/404` | `src/pages/404.astro` | Error Page | ❌ (Root Only) | Custom 404 page with return links. |
| `/500` | `src/pages/500.astro` | Error Page | ❌ (Root Only) | Custom 500 server error fallback page. |

---

## Section 2: Dynamic Template Matrix & Static Page Generation Rules

The codebase utilizes **20 dynamic template files** (`[slug].astro`, `[color].astro`, etc.) to generate static HTML pages at build time via Astro's `getStaticPaths()`.

Below is the complete breakdown of parameters, underlying data engines, and exact static output counts per locale:

| Dynamic Template Path | Engine / Data Provider | Parameters Returned | Pages per Locale | Total Generated Pages (4 Locales) |
| :--- | :--- | :--- | :--- | :--- |
| `models/[slug].astro` | `DeviceDatabase.ts` | 101 device slugs | 101 | **404** |
| `display-tests/dead-pixel-test/[slug].astro` | `DeviceDatabase.ts` | 101 device slugs | 101 | **404** |
| `display-tests/return-window-checker/[slug].astro` | `DeviceDatabase.ts` | 101 device slugs | 101 | **404** |
| `benchmarks/pc-bottleneck/[slug].astro` | `PcBottleneckEngine.ts` | 8 CPUs $\times$ 8 GPUs = 64 slugs | 64 | **256** |
| `display-tests/electricity-cost/[slug].astro` | `ApplianceEnergyEngine.ts` | 50 US States + DC = 51 slugs | 51 | **204** |
| `input-lag-test/[refreshRate]/[pollingRate].astro` | Matrix Generator | 6 refresh rates $\times$ 6 polling rates = 36 paths | 36 | **144** |
| `oled-burn-in-risk/[panelType]/[usageTier].astro` | Matrix Generator | 7 panel types $\times$ 4 usage tiers = 28 paths | 28 | **112** |
| `hdr-test/[peakNits]/[toneMapping].astro` | Matrix Generator | 4 peak nits $\times$ 6 tone mapping curves = 24 paths | 24 | **96** |
| `guides/[slug].astro` | `guidesData` array | 22 guide article slugs | 22 | **88** |
| `vrr-stutter-test/[gpuVendor]/[refreshRate].astro` | Matrix Generator | 4 GPU vendors $\times$ 5 refresh rates = 20 paths | 20 | **80** |
| `touch-matrix/[deviceType]/[gridDensity].astro` | Matrix Generator | 4 device types $\times$ 4 grid densities = 16 paths | 16 | **64** |
| `keyboard-tester/[slug].astro` | `keyboardCategories` | 15 target search slugs | 15 | **60** |
| `keyboard-tester/switches/[slug].astro` | `switchesList` array | 10 switch model slugs | 10 | **40** |
| `display-tests/tv-viewing-distance/[slug].astro` | Hardcoded sizes | 7 TV screen sizes (50", 55", 65", 75", 85", 98", 120") | 7 | **28** |
| `benchmarks/wire-gauge-calculator/[slug].astro` | Hardcoded circuits | 6 circuit amperage slugs (15A, 20A, 30A, 50A, 100A, 200A) | 6 | **24** |
| `benchmarks/3d-print-cost/[slug].astro` | `FilamentCostEngine.ts` | 6 filament material slugs (PLA, ABS, PETG, TPU, Nylon, PC) | 6 | **24** |
| `white-screen/[color].astro` | `baseGetStaticPaths()` | 6 screen color slugs | 6 | **24** |
| `compare/[slug].astro` | `comparisonPairs` array | 5 flagship comparison pair slugs | 5 | **20** |
| `passport/[hash].astro` | Hardcoded hashes | 5 sample hardware passport SHA-256 hashes | 5 | **20** |
| `display-tests/refresh-rate-test/[targetHz].astro` | Hardcoded rates | 7 target refresh rates (60hz, 120hz, 144hz, 165hz, 240hz, 360hz, 540hz) | 7 (Root Only) | **7** |

---

## Section 3: Localized Route Parity & i18n Evaluation

Astro's i18n configuration in `astro.config.mjs` sets `en` as default (unprefixed) and `es`, `de`, `fr` as localized paths prefixed under `src/pages/[locale]/`.

### 3.1 Localized Parity Summary
* **Total Root Templates**: 101
* **Localized Templates in `[locale]`**: 64
* **Root Templates Missing Localized Twins**: **37 templates**

### 3.2 Missing Localized Parent Index Routes (Routing Gaps)
Four programmatic route directories have sub-route dynamic templates inside `[locale]`, but are **missing their parent index page** inside `src/pages/[locale]/`:

1. `/benchmarks/3d-print-cost`
   * **Root**: `src/pages/benchmarks/3d-print-cost.astro` exists.
   * **Locale Gap**: `src/pages/[locale]/benchmarks/3d-print-cost.astro` is missing.
   * **Impact**: `/es/benchmarks/3d-print-cost` returns 404, while `/es/benchmarks/3d-print-cost/pla` works.
2. `/benchmarks/wire-gauge-calculator`
   * **Root**: `src/pages/benchmarks/wire-gauge-calculator.astro` exists.
   * **Locale Gap**: `src/pages/[locale]/benchmarks/wire-gauge-calculator.astro` is missing.
   * **Impact**: `/es/benchmarks/wire-gauge-calculator` returns 404, while `/es/benchmarks/wire-gauge-calculator/15-amp-120v` works.
3. `/display-tests/tv-viewing-distance`
   * **Root**: `src/pages/display-tests/tv-viewing-distance.astro` exists.
   * **Locale Gap**: `src/pages/[locale]/display-tests/tv-viewing-distance.astro` is missing.
   * **Impact**: `/es/display-tests/tv-viewing-distance` returns 404, while `/es/display-tests/tv-viewing-distance/55-inch-tv` works.
4. `/keyboard-tester/switches`
   * **Root**: `src/pages/keyboard-tester/switches/index.astro` exists.
   * **Locale Gap**: `src/pages/[locale]/keyboard-tester/switches/index.astro` is missing.
   * **Impact**: `/es/keyboard-tester/switches` returns 404, while `/es/keyboard-tester/switches/cherry-mx-red` works.

---

## Section 4: Orphan Pages, i18n Gaps & Duplicate Intent Audit

### 4.1 Unlocalized Feature Suites (37 Root Templates)
The following 37 root templates do not have localized counterparts under `src/pages/[locale]/`:

1. **Entire Unlocalized Categories**:
   * `audio-tests/` (`mic-noise-floor.astro`, `speaker-frequency.astro`)
   * `input-tests/` (`gamepad-drift.astro`, `keyboard-rollover.astro`, `mouse-double-click.astro`, `mouse-polling.astro`)
2. **Unlocalized Diagnostic Display Tools**:
   * `display-tests/backlight-bleed.astro`
   * `display-tests/color-banding.astro`
   * `display-tests/colorblind-simulation.astro`
   * `display-tests/frame-skipping.astro`
   * `display-tests/gamma.astro`
   * `display-tests/geometry.astro`
   * `display-tests/grayscale.astro`
   * `display-tests/local-dimming.astro`
   * `display-tests/motion-blur.astro`
   * `display-tests/pixel-walk.astro`
   * `display-tests/pwm-flicker.astro`
   * `display-tests/stuck-pixel.astro`
   * `display-tests/text-sharpness.astro`
   * `display-tests/viewing-angle.astro`
   * `display-tests/refresh-rate-test/[targetHz].astro`
3. **Unlocalized Core Information Pages**:
   * `about.astro`
   * `contact.astro`
   * `faq.astro`
   * `terms.astro`
   * `monitor-color-calibration.astro`
   * `refresh-rate-test.astro`
   * `touch-tests/stylus-pressure.astro`
4. **Intended Root-Only System Endpoints**:
   * `404.astro`, `500.astro`
   * `embed/passport.astro`, `embed/vrr-stutter.astro`
   * `passport/[hash]/badge.svg.ts`

---

### 4.2 Potential Duplicate Intent & Keyword Cannibalization Risks

During the code audit, several routes were identified as having overlapping user intent or competing search keywords:

1. **`input-tests/gamepad-drift.astro` vs `benchmarks/gamepad-drift.astro`**
   * **Issue**: Duplicate controller drift diagnostic tools under two separate top-level categories (`/input-tests/gamepad-drift` vs `/benchmarks/gamepad-drift`).
   * **Recommendation**: Consolidate under `/benchmarks/gamepad-drift` and 301 redirect `/input-tests/gamepad-drift`.

2. **`display-tests/vrr.astro` vs `vrr-stutter-test/index.astro`**
   * **Issue**: Visual display VRR sync bar animation tool vs standalone parametric VRR stutter generator matrix hub.
   * **Recommendation**: Cross-link both tools clearly in the header deck to differentiate basic visual sweep vs parametric generator.

3. **`display-tests/hdr-test.astro` vs `hdr-test/index.astro`**
   * **Issue**: `/display-tests/hdr-test` is a quick browser HDR checker, while `/hdr-test/` is the top-level hub for the 24-page peak nits $\times$ EOTF tone mapping matrix.
   * **Recommendation**: Ensure explicit internal linking from `/display-tests/hdr-test` to `/hdr-test/`.

4. **`display-tests/oled-burn-in.astro` vs `oled-burn-in-risk/index.astro`**
   * **Issue**: Visual burn-in inspection patterns vs mathematical risk calculator matrix.
   * **Recommendation**: Maintain both, but add a prominent banner linking inspection patterns to the risk calculator.

5. **`touch-tests/input-lag.astro` vs `input-lag-test/index.astro`**
   * **Issue**: `/touch-tests/input-lag` measures mobile touch dispatch latency, whereas `/input-lag-test/` is the 36-page matrix for display refresh rate $\times$ mouse polling rate.
   * **Recommendation**: Rename `/touch-tests/input-lag` page title to explicitly emphasize "Touchscreen Latency" to avoid cannibalizing "Input Lag Test" keywords.

6. **`refresh-rate-test.astro` vs `display-tests/refresh-rate-test/[targetHz].astro`**
   * **Issue**: Top-level root suite `/refresh-rate-test` vs `/display-tests/refresh-rate-test/144hz`.
   * **Recommendation**: Ensure canonical tags and breadcrumbs link back cleanly to `/refresh-rate-test`.

---

## Section 5: Strategic Recommendations for Site Architecture & SEO Consolidation

1. **Fix Missing Localized Parent Index Routes**:
   * Create `[locale]/benchmarks/3d-print-cost.astro`, `[locale]/benchmarks/wire-gauge-calculator.astro`, `[locale]/display-tests/tv-viewing-distance.astro`, and `[locale]/keyboard-tester/switches/index.astro` to eliminate 404 errors on localized category landing pages.

2. **Complete Localization Coverage for Diagnostic Tools**:
   * Migrate the 14 unlocalized display diagnostic tools (e.g. `backlight-bleed.astro`, `motion-blur.astro`, `pwm-flicker.astro`) into `src/pages/[locale]/display-tests/` to boost non-English search visibility.

3. **Deduplicate Overlapping Tool Routes**:
   * Standardize controller drift testing on `/benchmarks/gamepad-drift` and add 301 redirects for legacy `/input-tests/gamepad-drift`.

4. **Maintain Pure Decoupled Engine Architecture**:
   * Ensure all dynamic templates continue delegating calculation logic to `src/engine/` modules for automated Vitest unit testing without DOM overhead.
