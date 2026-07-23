# US Audience Acquisition Playbook & Growth Engine
## Monitor Test Hub (`displaytestonline.com`) vs. ScreenTester.io

**Target Market:** United States (Esports Gamers, Display Enthusiasts, Home Theater Builders, PC DIY System Integrators, Used Hardware Buyers & Tech Forum Communities)  
**Document Division:** US Audience Acquisition & Growth Engineering  
**Version:** 1.0.0 (2026 Production Edition)  
**Strict Protocol Compliance:** 100% Inline Verification & Source Citation Required (`[SOURCE: <file_path>]`)

---

## Executive Summary & Competitive Posture

Existing browser-based display testing utilities in the US market are fundamentally flawed, severely outdated, single-purpose, or riddled with disruptive ad units and mandatory lead-capture paywalls [SOURCE: monitor_test_hub/competitor_analysis_report.md:10-15]. 

The market incumbent, **ScreenTester.io**, provides a single-page minimalist web tool that merely cycles 5 solid background colors (`Red`, `Green`, `Blue`, `White`, `Black`) using basic DOM background modifications (`document.body.style.backgroundColor`) [SOURCE: monitor_test_hub/competitor_analysis_report.md:20-37]. ScreenTester.io lacks diagnostic telemetry, photosensitivity disclaimers, sub-pixel geometry pattern controls, high-refresh VSync frame pacing analysis, OLED burn-in risk modeling, mobile touch digitizer matrices, keyboard chatter inspection, or verifiable hardware receipts [SOURCE: monitor_test_hub/competitor_analysis_report.md:38-43].

**Monitor Test Hub** (`displaytestonline.com`) supersedes legacy screen testers by offering a zero-install, 100% client-side, 2,699 static page diagnostic, calibration, and micro-calculator ecosystem powered by Astro v7, Tailwind CSS v4, and decoupled pure-TypeScript calculation engines [SOURCE: AGENTS.md:50-88].

This playbook delivers a battle-tested US audience acquisition strategy targeting high-intent tech communities (Reddit, YouTube Hardware Reviewers, US Tech Forums, and Resale Marketplaces) backed by 6 high-converting backlink viral bait instruments.

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                 COMPETITIVE LANDSCAPE & ACQUISITION POSITIONING                                   |
+------------------------------------+------------------------------------+-----------------------------------------+
| Feature Dimension                  | Incumbent (ScreenTester.io)        | Challenger (Monitor Test Hub)           |
+------------------------------------+------------------------------------+-----------------------------------------+
| Architecture & Scope               | Single-page basic color cycler     | 2,699 static HTML pages across 4 locales|
| Subpixel Geometry & Font Fringing  | None (0%)                          | WebGL reticle (RGB, BGR, QD-OLED, WOLED)|
| OLED Burn-In & Uniformity          | Static solid colors only           | 5%/10% low-gray near-black & decay model|
| High-Refresh VRR & Frame Pacing    | None                               | 540Hz+ rAF frame interval delta tracking|
| Micro-Calculators & Micro-Utilities| None                               | NEC 2026 Wire Gauge, EIA Energy, TV Optics|
| Hardware Telemetry & Proof         | None                               | SHA-256 Cryptographic Hardware Passport |
| Monetization & User Privacy        | Banner ad clutter & dynamic resizes| 100% Ad-Free, 100% Client-Side Privacy  |
+------------------------------------+------------------------------------+-----------------------------------------+
```

---

## 1. High-Leverage US Distribution Surfaces (Audit & Strategy)

### 1.1 Reddit Engineering & Community Matrix

Reddit represents the single highest-density aggregation of US hardware enthusiasts, PC builders, home theater designers, and display calibrators. Each subreddit exhibits distinct intent patterns, technical literacy thresholds, and moderation guidelines:

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                     REDDIT COMMUNITY DISTRIBUTION MATRIX                                          |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| Subreddit         | US Member Base    | Primary User Intent & Pain Points  | High-Leverage Target Instrument Hook |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| r/Monitors        | ~600,000 members  | High-Hz refresh rates, QD-OLED vs  | OLED Subpixel Reticle Inspector      |
|                   |                   | WOLED text clarity, panel RMA gates| & 540Hz+ VRR Stutter Sweep           |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| r/OLED            | ~250,000 members  | OLED burn-in anxiety, 5% gray      | OLED Burn-In Risk Model              |
|                   |                   | banding, HDR tone mapping clipping | & SHA-256 Hardware Passport          |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| r/buildapc        | ~7,500,000 members| Component bottlenecking, wire gauge| PC Bottleneck & FPS Estimator        |
|                   |                   | ampacity, PSU electrical load math | & NEC 2026 Wire Gauge Calculator     |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| r/pcmasterrace    | ~12,000,000 member| High FPS benchmarking, GPU power   | 50-State EIA Electricity Calculator  |
|                   |                   | cost, keyboard switch chatter      | & Keyboard Switch Chatter Engine     |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| r/Hardware        | ~4,000,000 members| Technical hardware specs, ISO 9241-| SHA-256 Verified Hardware Passport  |
|                   |                   | 307 defect classes, ICC v4.3 profiles| & CIE 1931 Gamut Map Export          |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| r/SteamDeck       | ~600,000 members  | Handheld OLED screen defect checks,| Handheld Dead Pixel & Return Window  |
|                   |                   | touch digitizer precision, RMA proof| Inspector (/dead-pixel-test/[slug])  |
+-------------------+-------------------+------------------------------------+--------------------------------------+
```

#### 1. r/Monitors (`600,000+ members`) [SOURCE: monitor_test_hub/competitor_analysis_report.md:143-150]
- **Audience Profile**: High-refresh-rate esports gamers, display enthusiasts, monitor buyers seeking advice on ghosting, motion blur, and text clarity.
- **Key Pain Point**: Users buying new Gen-1/Gen-2 QD-OLED or WOLED gaming monitors struggle with blurry font rendering caused by Windows ClearType subpixel assumptions [SOURCE: monitor_test_hub/src/pages/display-tests/sub-pixel.astro:35-41]. Furthermore, 240Hz/360Hz/540Hz monitor buyers cannot easily detect micro-stutter versus GPU VSync tearing [SOURCE: monitor_test_hub/src/engine/VrrSweepEngine.ts:18-29].
- **High-Leverage Hook**: 
  1. *OLED Subpixel Reticle Inspector* (`/display-tests/sub-pixel`), which renders WebGL subpixel structures (RGB, BGR, QD-OLED Triangular, WOLED RWBG) with ClearType font antialiasing simulation [SOURCE: monitor_test_hub/src/pages/display-tests/sub-pixel.astro:15-22].
  2. *540Hz+ VRR Stutter Sweep* (`/display-tests/vrr`), measuring microsecond rAF frame interval deltas ($1/\text{FPS}$) and tracking G-Sync/FreeSync sync loss [SOURCE: AGENTS.md:168-171].

#### 2. r/OLED (`250,000+ members`) [SOURCE: niche_research_report.md:5-15]
- **Audience Profile**: LG C/G-series TV owners, Alienware/ASUS OLED monitor users, home theater enthusiasts obsessed with black levels, panel uniformity, and burn-in prevention.
- **Key Pain Point**: Severe anxiety regarding OLED subpixel degradation, static UI element burn-in, and 5%/10% near-black gray vertical banding [SOURCE: monitor_test_hub/competitor_analysis_report.md:149-152].
- **High-Leverage Hook**:
  1. *OLED Burn-In Risk Model* (`/display-tests/oled-burn-in`), utilizing pure-TypeScript degradation equations based on static element luminance, color spectrum distribution, and daily operational hours [SOURCE: AGENTS.md:50].
  2. *Cryptographic SHA-256 Hardware Passport* (`/passport/[hash]`), allowing OLED owners to record low-gray uniformity and subpixel health into an immutable receipt for resale proof [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:8-27].

#### 3. r/buildapc (`7,500,000+ members`) [SOURCE: AGENTS.md:228-244]
- **Audience Profile**: First-time and experienced PC builders selecting components, sizing power supplies, planning electrical circuits, and optimizing CPU/GPU pairings.
- **Key Pain Point**: PC builders suffer from predatory, closed-source "bottleneck calculators" that output fake percentages, or struggle to calculate high-amperage 12VHPWR wire gauge voltage drops when running custom PC circuits.
- **High-Leverage Hook**:
  1. *PC Bottleneck & FPS Estimator* (`/benchmarks/pc-bottleneck`), powered by `PcBottleneckEngine.ts` with resolution-aware heuristics (1080p, 1440p, 4K) and transparent CPU/GPU utilization ratio formulas [SOURCE: monitor_test_hub/src/engine/PcBottleneckEngine.ts:32-50].
  2. *NEC 2026 Electrical Wire Gauge & Voltage Drop Calculator* (`/benchmarks/wire-gauge-calculator`), powered by `WireGaugeEngine.ts` implementing NEC Table 310.16 conductor ampacity limits and voltage drop equation $V_d = (2 \times K \times I \times L) / CM$ [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:1-35].

#### 4. r/pcmasterrace (`12,000,000+ members`) [SOURCE: AGENTS.md:232-254]
- **Audience Profile**: Tech enthusiasts, PC gamers, high-end hardware owners sharing setup photos, benchmark scores, and PC optimization tips.
- **Key Pain Point**: High electricity bills from running multi-monitor 4090 rig setups in high-rate US states (California, New York, Connecticut), as well as mechanical keyboard switch chatter causing double-typing during gaming sessions [SOURCE: AGENTS.md:249-253].
- **High-Leverage Hook**:
  1. *50-State EIA Electricity Cost Calculator* (`/display-tests/electricity-cost`), powered by `ApplianceEnergyEngine.ts` with auto-populated EIA state electricity rates (e.g. CA 32.5¢/kWh vs TX 14.6¢/kWh) [SOURCE: monitor_test_hub/src/engine/ApplianceEnergyEngine.ts:41-93].
  2. *Universal Keyboard Diagnostic & Switch Chatter Engine* (`/keyboard-tester`), analyzing microsecond keypress bounce times ($t_{\text{delta}} < 30\text{ms}$) and NKRO rollover combinations [SOURCE: AGENTS.md:249-253].

#### 5. r/Hardware (`4,000,000+ members`) [SOURCE: AGENTS.md:155-185]
- **Audience Profile**: Deep technical hardware enthusiasts, engineers, industry analysts, and benchmarkers interested in display physics, ISO standards, and manufacturing tolerances.
- **Key Pain Point**: Lack of transparent, standardized web diagnostics mapped to international display standards (ISO 9241-307 Class I-IV and VESA DisplayHDR ST 2084 PQ EOTF) [SOURCE: AGENTS.md:160,175].
- **High-Leverage Hook**:
  1. *SHA-256 Verified Hardware Passport Ledger* (`/passport/[hash]`), rendering client-side cryptographic receipts and customizable SVG badges [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:142-168].
  2. *CIE 1931 Color Gamut Map & ICC v4.3 Exporter* (`/display-tests/color-gamut`), generating binary `.icc` color profiles directly in WebAssembly [SOURCE: AGENTS.md:182-184].

#### 6. r/SteamDeck (`600,000+ members`) [SOURCE: AGENTS.md:223-226]
- **Audience Profile**: Handheld gaming console enthusiasts validating Steam Deck OLED, Nintendo Switch OLED, and ROG Ally screens upon unboxing.
- **Key Pain Point**: Steam Deck OLED buyers need to verify zero dead/stuck pixels and touch digitizer dead-zones within Valve's 14-day return window [SOURCE: AGENTS.md:223-226].
- **High-Leverage Hook**:
  1. *Handheld Screen Return Window Inspector* (`/display-tests/dead-pixel-test/steam-deck-oled`), providing device-specific resolution, PPI, and ISO 9241-307 Class I defect limits with RMA advice [SOURCE: AGENTS.md:223-226].
  2. *Mobile Touch Matrix & Dead-Zone Analyzer* (`/touch-matrix`), tracking multi-touch points, pressure, and digitizer line precision [SOURCE: AGENTS.md:187-190].

---

### 1.2 Hardware Review Ecosystems & US Tech Forums

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                HARDWARE REVIEWER & TECH FORUM DISTRIBUTION MATRIX                                 |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| Ecosystem Surface | Platform / Reach  | Core Technical Focus & Content Type| High-Leverage Engagement Strategy    |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| YouTube Reviewers | Monitors Unboxed, | High-refresh display reviews, panel| Offer standardized SHA-256 Hardware  |
|                   | RTINGS, LTT, HWU  | response times, color accuracy     | Passports & embeddable SVG badges for|
|                   | (5M+ total subs)  | testing, pursuit camera ghosting   | video descriptions & benchmark tables|
+-------------------+-------------------+------------------------------------+--------------------------------------+
| Overclock.net     | Hardware Forum    | Extreme PC overclocking, sub-ms    | Contribute deep technical threads on |
|                   | (~800,000 members)| latency, custom power wiring, VRR  | NEC 2026 wire gauge math & 540Hz rAF |
|                   |                   | frame pacing jitter telemetry      | frame pacing variance calculations   |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| AVSForum          | Home Theater Forum| TV optics, projector throw ratios, | Share THX 36° vs SMPTE 30°/40° FOV   |
|                   | (~1.2M members)   | THX/SMPTE FOV viewing angles, HDR  | distance formulas & ST 2084 PQ EOTF  |
|                   |                   | PQ EOTF ST 2084 perceptual curves  | ABL window roll-off evaluator tools  |
+-------------------+-------------------+------------------------------------+--------------------------------------+
| Blur Busters      | High-Hz Forum     | Motion Picture Response Time (MPRT)| Engage with Mark Rejhon's community  |
|                   | (~300,000 members)| overdrive overshoot, ClearType font| showcasing Ghosting Invaders & WebGL |
|                   |                   | subpixel fringing physics          | subpixel reticle clarity analyzer    |
+-------------------+-------------------+------------------------------------+--------------------------------------+
```

#### 1. YouTube Display Reviewers Ecosystem
- **Key Channels**: *Monitors Unboxed* (Tim Schiesser), *RTINGS.com Display Team*, *Hardware Unboxed*, *Linus Tech Tips (LTT Labs)*.
- **Engagement Strategy**: Reviewers constantly seek easy-to-use, zero-friction verification tools that their viewers can replicate at home. We provide reviewers with:
  1. Standardized **SHA-256 Hardware Passports** (`/passport/[hash]`) generated specifically for test samples, allowing reviewers to embed an interactive SVG badge (`/embed/passport?hash=...`) in their video descriptions and website benchmark tables [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:173-192].
  2. Embeddable diagnostic widgets for display defect inspection and VSync frame pacing verification [SOURCE: AGENTS.md:62-63].

#### 2. Overclock.net (`800,000+ members`) [SOURCE: AGENTS.md:240-244]
- **Forum Focus**: Extreme hardware tuning, 540Hz gaming monitors, custom liquid cooling loops, high-amperage power supply wiring.
- **Engagement Strategy**: Post authoritative, mathematically verified technical guides on:
  1. *NEC 2026 Electrical Wire Gauge & Voltage Drop Calculator* (`/benchmarks/wire-gauge-calculator`), referencing NEC Table 310.16 conductor ampacity limits and copper vs aluminum resistance constants ($K_{\text{Cu}} = 12.9$) [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:38-70].
  2. *540Hz VRR Frame Pacing Telemetry* (`/display-tests/vrr`), detailing microsecond rAF variance calculations ($t_{\text{delta}} < 1.85\text{ms}$) [SOURCE: monitor_test_hub/src/engine/VrrSweepEngine.ts:11-28].

#### 3. AVSForum (`1,200,000+ members`) [SOURCE: AGENTS.md:236-240]
- **Forum Focus**: Premium home theater design, OLED TV calibration, 4K/8K projector throw distance, HDR mastering.
- **Engagement Strategy**: Share non-commercial optical calculation tools solving common room layout disputes:
  1. *TV & Projector Viewing Distance & Optics Calculator* (`/display-tests/tv-viewing-distance`), implementing THX 36° FOV ($D = \text{Diagonal} / 0.833$), Cinema 40° FOV, SMPTE 30° FOV, and VESA 1-arcminute 4K visual acuity thresholds [SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:84-120].
  2. *10-Bit WebGL PQ EOTF HDR Evaluator* (`/display-tests/hdr-test`), evaluating Auto Brightness Limiter (ABL) window roll-off across 1% to 100% window sizes [SOURCE: AGENTS.md:175-178].

#### 4. Blur Busters Forums (`300,000+ members`) [SOURCE: monitor_test_hub/competitor_analysis_report.md:56-62]
- **Forum Focus**: High-refresh motion blur, pursuit camera calibration, MPRT vs GtG response times, QD-OLED subpixel layouts.
- **Engagement Strategy**: Contribute to technical discussions initiated by Mark Rejhon (Chief Blur Buster) regarding text fringing and motion response:
  1. *Ghosting Invaders Micro-Game* (`/arcade/ghosting-invaders`), measuring overdrive overshoot inverse ghosting and MPRT targets [SOURCE: AGENTS.md:200].
  2. *WebGL Subpixel Reticle Inspector* (`/display-tests/sub-pixel`), simulating ClearType (Windows) and FreeType (Linux) font antialiasing on non-standard subpixel structures [SOURCE: monitor_test_hub/src/pages/display-tests/sub-pixel.astro:35-50].

---

## 2. High-Converting Backlink & Viral Bait Candidate Mapping

Monitor Test Hub incorporates 6 high-demand, zero-lead-gate micro-calculators and diagnostic instruments specifically engineered to attract organic backlinks, forum citations, and social shares across the US web ecosystem:

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                 VIRAL BAIT & HIGH-CONVERTING BACKLINK INSTRUMENTS                                 |
+------------------------------------+------------------------------------+-----------------------------------------+
| Instrument Name & Route            | Core Calculation Engine            | Target Backlink Surface & Virality Hook |
+------------------------------------+------------------------------------+-----------------------------------------+
| 1. NEC 2026 Wire Gauge Calculator  | WireGaugeEngine.ts                 | Overclock.net, r/buildapc, Electrician  |
|    (/benchmarks/wire-gauge-calculator)| NEC Table 310.16 Ampacity & Vd math| DIY forums, Custom PC rig builders      |
+------------------------------------+------------------------------------+-----------------------------------------+
| 2. 50-State EIA Electricity Cost   | ApplianceEnergyEngine.ts           | r/pcmasterrace, r/Hardware, Homelab    |
|    (/display-tests/electricity-cost)| 50-State EIA rates & daily kWh cost| "4090 PC Cost in CA vs TX" viral graphics|
+------------------------------------+------------------------------------+-----------------------------------------+
| 3. TV & Projector Optics Calculator| TvViewingDistanceEngine.ts         | AVSForum, r/hometheater, TV Buyers      |
|    (/display-tests/tv-viewing-distance)| THX 36° / SMPTE FOV & 4K Acuity   | Super Bowl TV size buying guide stickies|
+------------------------------------+------------------------------------+-----------------------------------------+
| 4. PC Bottleneck & FPS Estimator   | PcBottleneckEngine.ts              | r/buildapc, Tom's Hardware, Reddit advice|
|    (/benchmarks/pc-bottleneck)     | Resolution-aware CPU/GPU balance   | Transparent 1080p/1440p/4K FPS estimates|
+------------------------------------+------------------------------------+-----------------------------------------+
| 5. SHA-256 Hardware Passport       | HardwarePassportEngine.ts          | r/hardwareswap, Swappa, eBay, Craigslist|
|    (/passport/[hash] & /embed/passport)| SHA-256 Signed Ledger & SVG Badge  | Mandatory verification badge for resale |
+------------------------------------+------------------------------------+-----------------------------------------+
| 6. 540Hz VRR & Subpixel Reticle    | VrrSweepEngine.ts & Reticle Engine | r/Monitors, r/OLED, Blur Busters        |
|    (/display-tests/vrr & sub-pixel)| Microsecond rAF delta & ClearType  | QD-OLED vs WOLED text clarity debates   |
+------------------------------------+------------------------------------+-----------------------------------------+
```

### Instrument 1: NEC 2026 Electrical Wire Gauge & Voltage Drop Calculator
- **Route URL**: `/benchmarks/wire-gauge-calculator` & `/benchmarks/wire-gauge-calculator/[slug]` [SOURCE: AGENTS.md:240-244]
- **Calculation Engine**: `WireGaugeEngine.ts` [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:1-37]
- **Mathematical Formula & Physics**:
  - Voltage Drop Equation: $V_d = \frac{2 \times K \times I \times L}{CM}$ where $K_{\text{Copper}} = 12.9$, $K_{\text{Aluminum}} = 21.2$, $I$ = running load amperage, $L$ = line length in feet, $CM$ = circular mils of conductor [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:65-95].
  - Ampacity compliance evaluated against **NEC Table 310.16** ($60^\circ\text{C} / 75^\circ\text{C} / 90^\circ\text{C}$ insulation ratings) with an **80% continuous load safety factor** (NEC 210.20) [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:38-65].
  - Voltage drop threshold flagged if $V_d \% > 3.0\%$ for branch circuits [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:96-100].
- **Target Backlink Ecosystem**: Overclock.net, r/buildapc, Electrician Talk forums, Home Theater Shack, custom mining rig communities.
- **Virality & Link Strategy**: Solves high-amperage circuit planning disputes (e.g. "Can I run a 20A circuit over 100ft on 12 AWG wire?"). Provides direct inline NEC code citations (`NEC 210.19(A)`) for instant authority [SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:30-35].

---

### Instrument 2: 50-State EIA Electricity Cost & Energy Calculator
- **Route URL**: `/display-tests/electricity-cost` & `/display-tests/electricity-cost/[slug]` [SOURCE: AGENTS.md:232-236]
- **Calculation Engine**: `ApplianceEnergyEngine.ts` [SOURCE: monitor_test_hub/src/engine/ApplianceEnergyEngine.ts:1-40]
- **Mathematical Formula & Data Ledger**:
  - Pre-loaded database of all 50 US State EIA residential electricity rates (e.g. California 32.5¢/kWh, Hawaii 42.1¢/kWh, Texas 14.6¢/kWh, New York 23.1¢/kWh, US National Avg 16.8¢/kWh) [SOURCE: monitor_test_hub/src/engine/ApplianceEnergyEngine.ts:41-93].
  - Monthly & Annual Cost Equation:
    $$\text{Monthly kWh} = \frac{\text{Watts} \times \text{Hours/Day} \times 30.416}{1000}$$
    $$\text{Monthly Cost (\$)} = \text{Monthly kWh} \times \frac{\text{RateCentsPerKwh}}{100}$$ [SOURCE: monitor_test_hub/src/engine/ApplianceEnergyEngine.ts:24-38].
- **Target Backlink Ecosystem**: r/pcmasterrace, r/Hardware, r/Homelab, personal finance blogs, energy efficiency forums.
- **Virality & Link Strategy**: Generates shareable visual infographs titled *"The True Cost of Running an RTX 4090 Gaming Rig in All 50 US States"*. Programmatic pSEO routes (`/display-tests/electricity-cost/california`) allow local US users to link directly to their state's benchmark [SOURCE: AGENTS.md:232-236].

---

### Instrument 3: TV & Projector Viewing Distance & Optics Calculator
- **Route URL**: `/display-tests/tv-viewing-distance` & `/display-tests/tv-viewing-distance/[slug]` [SOURCE: AGENTS.md:236-240]
- **Calculation Engine**: `TvViewingDistanceEngine.ts` [SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:1-50]
- **Mathematical Formula & Optics**:
  - THX Recommended Distance Formula ($36^\circ\text{ FOV}$): $D_{\text{THX}} = \frac{\text{Diagonal (inches)}}{0.833}$ [SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:93-96].
  - Cinema Immersive ($40^\circ\text{ FOV}$): $D_{\text{Min}} = \frac{\text{Diagonal}}{0.925}$, SMPTE Standard ($30^\circ\text{ FOV}$): $D_{\text{Max}} = \frac{\text{Diagonal}}{0.625}$ [SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:97-100].
  - VESA 1-Arcminute Visual Acuity 4K Benefit Distance: $D_{4\text{K}} = \text{Diagonal} \times 1.5$ ft [SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:40-44].
- **Target Backlink Ecosystem**: AVSForum, r/hometheater, Blu-ray.com forums, HDTVTest community, Super Bowl TV buyer guides.
- **Virality & Link Strategy**: Serves as the definitive reference link during peak TV buying seasons (Black Friday, Super Bowl, OLED price drops). Outperforms outdated static tables by letting users calculate exact room dimensions and projector throw ratios [SOURCE: AGENTS.md:236-240].

---

### Instrument 4: PC Bottleneck & FPS Estimator
- **Route URL**: `/benchmarks/pc-bottleneck` & `/benchmarks/pc-bottleneck/[slug]` [SOURCE: AGENTS.md:228-232]
- **Calculation Engine**: `PcBottleneckEngine.ts` [SOURCE: monitor_test_hub/src/engine/PcBottleneckEngine.ts:1-35]
- **Mathematical Heuristics & FPS Engine**:
  - Resolution-Aware Weightings: 1080p (55% CPU / 45% GPU), 1440p (40% CPU / 60% GPU), 4K (20% CPU / 80% GPU) [SOURCE: monitor_test_hub/src/engine/PcBottleneckEngine.ts:91-100].
  - Transparent utilization ratio calculation and severity classification (`None`, `Minor`, `Moderate`, `Severe`) paired with real game FPS estimators (Cyberpunk 2077, CS2, Call of Duty, Fortnite, GTA V) [SOURCE: monitor_test_hub/src/engine/PcBottleneckEngine.ts:32-50].
- **Target Backlink Ecosystem**: r/buildapc, Tom's Hardware forums, Linus Tech Tips forum, PCPartPicker community.
- **Virality & Link Strategy**: Counteracts fake "bottleneck percentage" scam sites by providing open-source, mathematically transparent heuristics without ad walls [SOURCE: AGENTS.md:228-232].

---

### Instrument 5: Cryptographic SHA-256 Hardware Passport & Embeddable Badges
- **Route URL**: `/passport/[hash]` & `/embed/passport` [SOURCE: AGENTS.md:62-63, 205-208]
- **Calculation Engine**: `HardwarePassportEngine.ts` [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:1-40]
- **Verification Physics & Embed API**:
  - Generates immutable SHA-256 hash string verifying VSync frame pacing jitter, color depth, touch points, and ISO 9241-307 defect class [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:111-137].
  - Produces dynamic SVG badges (`generateBadgeSvg()`) and markdown/iframe embed snippets (`generateEmbedSnippets()`) [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:142-192].
- **Target Backlink Ecosystem**: Used hardware marketplaces (r/hardwareswap, Swappa, eBay description embeds, Craigslist, offerup).
- **Virality & Link Strategy**: Used monitor and smartphone sellers embed the Hardware Passport badge directly into their listings to prove "0 Dead Pixels & 100/100 Health Score". Every listing becomes a permanent, high-authority backlink to `displaytestonline.com/passport/[hash]` [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:180-185].

---

### Instrument 6: 540Hz+ VRR Stutter Sweep & OLED Subpixel Reticle Inspector
- **Route URL**: `/display-tests/vrr` & `/display-tests/sub-pixel` [SOURCE: AGENTS.md:168-171, 161-164]
- **Calculation Engine**: `VrrSweepEngine.ts` & `SubPixelAnalyzer.astro` [SOURCE: monitor_test_hub/src/engine/VrrSweepEngine.ts:1-40]
- **Microsecond Telemetry & WebGL Physics**:
  - Measures microsecond-level RequestAnimationFrame (rAF) frame interval deltas ($1/\text{FPS}$) to catch G-Sync/FreeSync sync loss and LFC activation [SOURCE: monitor_test_hub/src/engine/VrrSweepEngine.ts:11-28].
  - WebGL subpixel reticle simulates subpixel geometries (Standard RGB, Inverted BGR, Gen-1/Gen-2 QD-OLED Triangular, WOLED RWBG) to explain Windows ClearType font fringing [SOURCE: monitor_test_hub/src/pages/display-tests/sub-pixel.astro:35-50].
- **Target Backlink Ecosystem**: r/Monitors, r/OLED, Blur Busters forums, esports gaming subreddits.
- **Virality & Link Strategy**: Settles ongoing community debates regarding text blurriness on QD-OLED monitors and frame-pacing stutter on 540Hz displays (ASUS ROG Swift PG248QP) [SOURCE: AGENTS.md:257-260].

---

## 3. Tactical Audience Acquisition Playbooks

### Playbook A: Reddit Community Growth & Organic Virality

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                 PLAYBOOK A: REDDIT ORGANIC ENGAGEMENT SPECIFICATION                              |
+------------------------------------+------------------------------------------------------------------------------+
| Parameter                          | Operational Rule / Guideline                                                 |
+------------------------------------+------------------------------------------------------------------------------+
| Content Format                     | Educational engineering breakdowns, technical infographics, zero-gate tools |
| Value Hook vs Competitor           | 100% Client-side, open-source math vs ScreenTester.io's dated color cycler   |
| Value-to-Link Ratio                | 90% in-post value / 10% tool reference link                                  |
| Rules of Engagement                | 1. Full transparent disclosure ("I built a free non-commercial tool").       |
|                                    | 2. Zero shortlink aggregators or affiliate redirects.                        |
|                                    | 3. Answer every technical question in comments before linking.               |
+------------------------------------+------------------------------------------------------------------------------+
```

#### Organic Outreach Template A1: r/Monitors QD-OLED Text Clarity Post
```text
Subject: Why text looks blurry on QD-OLED vs WOLED monitors (and how to simulate ClearType subpixel fringing)

Hey r/Monitors,

With the wave of 240Hz/360Hz QD-OLED and WOLED gaming monitors hitting desks, one of the most common complaints is font fringing—green or magenta halos around white text in Windows.

The root cause isn't resolution—it's that Windows ClearType was engineered in 2006 under the strict assumption of standard RGB vertical stripe subpixels. 

Here is how subpixel geometry breaks down across modern panels:
1. Standard LCD: Red-Green-Blue vertical stripes [R|G|B]. ClearType antialiases perfectly.
2. Gen-1 QD-OLED: Triangular subpixel structure (Green top, Red/Blue bottom). Triggers horizontal color fringing.
3. Gen-2/Gen-3 QD-OLED: Refined triangular layout with larger subpixel fill factor (significantly reduced fringing).
4. LG WOLED: Red-White-Blue-Green [R|W|B|G] 4-subpixel structure. Triggers vertical fringing when Windows bypasses the White subpixel.

I built a free client-side WebGL Subpixel Reticle Inspector that lets you zoom into your exact subpixel structure and toggle ClearType/FreeType font smoothing algorithms in real-time to test your panel:
https://displaytestonline.com/display-tests/sub-pixel

Zero ads, zero lead-capture gates, 100% browser-based. Hope this helps anyone trying to decide between QD-OLED and WOLED for work + gaming!
```
[SOURCE: monitor_test_hub/src/pages/display-tests/sub-pixel.astro:35-50]

---

#### Organic Outreach Template A2: r/buildapc Wire Gauge & PC Bottleneck Post
```text
Subject: Calculating voltage drop on high-draw 12VHPWR / 20A PC circuits (NEC 2026 Ampacity & Wire Gauge breakdown)

Hey r/buildapc,

If you are running a high-end workstation or multi-GPU rig drawing 1,200W+ continuously, standard 14 AWG household extension cords or long branch circuit runs can introduce noticeable voltage drop and thermal resistance.

Under NEC 2026 (National Electrical Code Table 310.16):
- 14 AWG Copper: Rated for 15A breaker max. Recommended continuous load (80% rule per NEC 210.20) = 12A (1,440W at 120V).
- 12 AWG Copper: Rated for 20A breaker max. Recommended continuous load = 16A (1,920W at 120V).

To calculate exact voltage drop over long distance runs, the formula is:
Vd = (2 * K * I * L) / Circular Mils
Where K (Copper constant) = 12.9, I = Load Amperes, L = Distance in Feet.

If your voltage drop exceeds 3.0%, your power supply operating efficiency drops and wire thermals increase.

I put together an open-source, NEC 2026-compliant Electrical Wire Gauge & Voltage Drop Calculator specifically for PC builders and home studio setups:
https://displaytestonline.com/benchmarks/wire-gauge-calculator

It automatically computes circular mils, ampacity safety factors, and conduit fill ratios without requiring any email signups. Let me know if you have any circuit wiring questions!
```
[SOURCE: monitor_test_hub/src/engine/WireGaugeEngine.ts:54-100]

---

### Playbook B: YouTube Hardware Reviewer Ecosystem Partnerships

```text
+-------------------------------------------------------------------------------------------------------------------+
|                            PLAYBOOK B: YOUTUBE REVIEWER OUTREACH SPECIFICATION                                    |
+------------------------------------+------------------------------------------------------------------------------+
| Parameter                          | Operational Rule / Guideline                                                 |
+------------------------------------+------------------------------------+-----------------------------------------+
| Outreach Format                    | Direct personalized email / Discord DM to technical channel producers        |
| Value Proposition                  | Provide viewers with 1-click panel verification receipts matching review data|
| Verification Proof                 | SHA-256 Signed Hardware Passport & SVG Badge embed endpoint                  |
| Rules of Engagement                | 1. Zero pay-for-play demands (100% free utility tool offering).              |
|                                    | 2. Total editorial independence for reviewers.                               |
|                                    | 3. Create custom pre-configured URL presets for reviewed hardware models.     |
+------------------------------------+------------------------------------+-----------------------------------------+
```

#### Organic Outreach Template B1: Email to Display Reviewers (e.g., Monitors Unboxed / RTINGS)
```text
Subject: Free SHA-256 Hardware Verification Receipts & Web Diagnostic Tools for Your Monitor Reviews

Hi [Reviewer Name / Tim / RTINGS Team],

Love your deep-dive display reviews—your pursuit camera ghosting and colorimetry data are the gold standard in the industry.

We built Monitor Test Hub (https://displaytestonline.com), an ad-free, 100% client-side web testing suite engineered to give your viewers zero-install access to the exact diagnostic patterns you reference in your videos:

1. 540Hz+ VRR Stutter & Frame Pacing Engine: Microsecond rAF delta tracking for testing G-Sync/FreeSync sync loss.
2. WebGL Subpixel Reticle Inspector: Simulates ClearType font fringing across QD-OLED Gen 1-3 triangular and WOLED RWBG subpixel layouts.
3. SHA-256 Cryptographic Hardware Passport: Generates an immutable, verified receipt and dynamic SVG badge for display test samples.

We created custom pre-configured model diagnostic pages for flagship displays you've reviewed (e.g. Alienware AW3225QF, ASUS PG248QP 540Hz, LG 32GS95UE):
https://displaytestonline.com/models/asus-rog-swift-pro-pg248qp

Feel free to link these diagnostic tools or embed the SVG verification badges in your review descriptions so your viewers can check their own panels for dead pixels and VRR stutter at home.

No sponsor fees, no lead gates, just clean engineering tools for the community. Keep up the amazing work!

Best regards,
Acquisition & Engineering Team | Monitor Test Hub
```
[SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:173-192]

---

### Playbook C: US Tech Forum Engineering Deep-Dives

```text
+-------------------------------------------------------------------------------------------------------------------+
|                            PLAYBOOK C: US TECH FORUM ENGAGEMENT SPECIFICATION                                     |
+------------------------------------+------------------------------------------------------------------------------+
| Parameter                          | Operational Rule / Guideline                                                 |
+------------------------------------+------------------------------------+-----------------------------------------+
| Forum Target                       | Overclock.net, AVSForum, Blur Busters Forums                                 |
| Content Style                      | Peer-reviewed engineering threads, LaTeX math formulas, code citations       |
| Forum Signature Integration        | Markdown Hardware Passport Badge Snippet in user profile signatures          |
| Rules of Engagement                | 1. Never post short promotional comments.                                    |
|                                    | 2. Provide exhaustive mathematical answers directly inside the thread.        |
|                                    | 3. Cite underlying TypeScript engine source files for technical credibility. |
+------------------------------------+------------------------------------+-----------------------------------------+
```

#### Organic Outreach Template C1: AVSForum Optics & Viewing Distance Thread
```text
Subject: Mathematical breakdown of THX 36° vs SMPTE FOV viewing distances & 4K arcminute visual acuity thresholds

Greetings AVSForum members,

When planning seating distance for a 4K OLED TV or home theater projector, conflicting advice often leads to confusion between THX cinema standards and SMPTE human acuity limits.

Here is the exact optics breakdown:

1. THX Standard (36° Field of View):
Designed for primary cinema immersion where the display fills 36 degrees of your horizontal vision.
Formula: Distance (Inches) = Screen Diagonal / 0.833
Example: For a 75" TV -> 75 / 0.833 = 90 inches (7.5 feet).

2. Cinema Immersive (40° Field of View):
Formula: Distance (Inches) = Screen Diagonal / 0.925
Example: For a 75" TV -> 75 / 0.925 = 81 inches (6.75 feet).

3. VESA 1-Arcminute Visual Acuity Threshold:
Human angular resolution limits are approximately 1/60th of a degree (1 arcminute). Beyond a certain distance, the human eye cannot physically resolve individual 4K pixels over 1080p.
For 4K UHD: Maximum benefit distance = Screen Diagonal * 1.5 feet.
Beyond 9.3 feet on a 75" display, 4K resolution advantages diminish relative to 1080p.

We compiled these optics formulas into a free client-side room planning tool with projector throw distance calculators:
https://displaytestonline.com/display-tests/tv-viewing-distance

Hope this helps members optimize their home theater seating geometry!
```
[SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:84-120]

---

## 4. Quantitative Channel Benchmarks & KPI Tracking Matrix

To measure acquisition velocity and domain authority growth against ScreenTester.io, the following target KPIs are established across US distribution surfaces:

```text
+-------------------------------------------------------------------------------------------------------------------+
|                                QUANTITATIVE CHANNEL BENCHMARKS & TARGET KPIS                                      |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
| Distribution Surface| Monthly Target   | Referral Traffic   | Backlink Target   | Organic Search Authority Impact  |
|                   | Outreach / Posts  | Target (Visitors)  | (Unique Domains)  | (US Search Keywords Target)      |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
| Reddit (6 Subs)   | 15 High-Value     | 25,000 - 45,000    | 35+ Organic Reddit| Ranks Top 3 for "screen test",   |
|                   | Technical Threads | monthly sessions   | thread citations  | "OLED text clarity test", "VRR"  |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
| YouTube Reviewers | 20 Personalized   | 15,000 - 30,000    | 10+ Video Description| Establishes brand authority   |
| (Top 10 Channels) | Creator Outreaches| monthly sessions   | & Website Links   | via Hardware Passport SVG embeds |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
| US Tech Forums    | 12 Deep Technical | 10,000 - 20,000    | 25+ High-DA Forum | High-intent referral traffic &   |
| (OCN, AVS, BlurB) | Forum Contributions| monthly sessions   | Signature Links   | indexation of micro-calculators  |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
| Resale Hardware   | Organic Seller    | 8,000 - 15,000     | 50+ Used Listing  | Viral backlink growth from       |
| (r/hardwareswap)  | Badge Embeds      | monthly sessions   | SVG Badge Embeds  | marketplace proof certificates   |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
| TOTALS            | 47 Strategic      | 58,000 - 110,000   | 120+ High-Authority| Dominates US Web Utility Market  |
|                   | Touchpoints/Month | Monthly Visitors   | Backlink Domains  | Over Legacy ScreenTester.io      |
+-------------------+-------------------+--------------------+-------------------+----------------------------------+
```

---

## Conclusion & Actionable Execution Roadmap

1. **Phase 1 (Immediate)**: Deploy Reddit organic threads utilizing Templates A1 & A2 in `r/Monitors`, `r/OLED`, and `r/buildapc` targeting QD-OLED text fringing and PC wire gauge calculations [SOURCE: AGENTS.md:228-253].
2. **Phase 2 (Week 2)**: Initiate reviewer outreach (Template B1) to YouTube display reviewers, offering pre-rendered SHA-256 Hardware Passport receipts for review units [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:173-192].
3. **Phase 3 (Week 3)**: Publish technical forum deep-dives (Template C1) on Overclock.net and AVSForum showcasing TV viewing distance optics and 540Hz VSync frame pacing deltas [SOURCE: monitor_test_hub/src/engine/TvViewingDistanceEngine.ts:84-120].
4. **Phase 4 (Ongoing)**: Monitor backlink acquisition rate across `r/hardwareswap` marketplace listings embedding the SVG Hardware Passport badge (`/embed/passport`) [SOURCE: monitor_test_hub/src/engine/HardwarePassportEngine.ts:180-185].
