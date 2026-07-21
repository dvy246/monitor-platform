## 2026-07-21T17:45:28Z
You are a teamwork_preview_worker agent assigned to create `prd.md` for Monitor Test Hub.

Working directory for your metadata: `/Users/divyyadav/newws/monitor_test_hub/.agents/worker_prd`
Target File to write: `/Users/divyyadav/newws/monitor_test_hub/prd.md`

Input Files to Read:
1. `/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md`
2. `/Users/divyyadav/newws/monitor_test_hub/ORIGINAL_REQUEST.md`

Requirements for `prd.md`:
Create a publication-grade, comprehensive Product Requirements Document (PRD) for "Monitor Test Hub".

1. Executive Summary & Vision:
   - High-level overview of Monitor Test Hub: a web-native diagnostic, calibration, and benchmarking suite for desktop visual displays and mobile touch-screen devices.
   - Core Tech Stack: Astro.js (Static Site Generation / SSG) and Tailwind CSS.
   - Core Moat: Dual desktop visual + mobile touch digitizer diagnostics + Arcade gamified testing suite.

2. Complete Technical Specifications (extracted directly from competitor_analysis_report.md):
   - **Desktop Visual Benchmarking & Diagnostics Engine**:
     * 540Hz+ high-refresh rate VSYNC sync via Web Worker frame loop & `performance.now()`.
     * Sub-pixel layout analyzer (RGB, BGR, QD-OLED triangular, WOLED RWBG/RGWB).
     * Near-black OLED uniformity (5% and 10% sRGB gray fills, image retention & burn-in checker).
     * VRR (G-Sync / FreeSync) stutter & tearing engine (tear-bar oscillation 48Hz-540Hz).
     * Multi-Display Canvas Sync (BroadcastChannel API for local windows, WebSockets for remote devices).
     * WASM LittleCMS ICC Profile Exporter (binary `.icc`/`.icm` and `.json` maps generated client-side).
   - **Mobile Touch & Visual Diagnostics Engine**:
     * Multi-touch count detection (`PointerEvent` + `TouchEvent.touches.length`).
     * Adaptive dead-zone grid matrix ($N \times M$ cells, transition Gray -> Green, unresponsive Red).
     * Swipe & gesture tracking (velocity $v = \Delta d / \Delta t$, acceleration, pinch/zoom latency).
     * Vector draw precision test (perpendicular distance deviation $d_i$, RMS deviation algorithm formula).
     * Mobile Viewport Sandboxing (`100dvh`/`100dvw`, `{ passive: false }` event listeners, coordinate normalization formula).
     * Offline PWA hybrid architecture (`manifest.webmanifest`, Service Worker `sw.js`).

3. Monitor & Touch Arcade Suite (Full specs for all 4 micro-games):
   - **Game 1: "Ghosting Invaders"**: Motion blur & pursuit camera test. Include ASCII diagram, pursuit camera speed formula ($v_{\text{pursuit}} = f_{\text{refresh}} \times S_{\text{step}}$), VRR frame delta adjustments ($\Delta t_{\text{frame}}$), pixel response time $t_{\text{response}} = t_{90\%} - t_{10\%}$.
   - **Game 2: "Color Match Alchemist"**: Delta-E perception puzzle. Include ASCII diagram, sRGB linearization formula, linear RGB to CIE XYZ matrix transformation (D65 reference white), CIE XYZ to CIE $L^*a^*b^*$ transformation, CIE76 $\Delta E_{ab}^*$, and CIEDE2000 $\Delta E_{00}^*$ formulas.
   - **Game 3: "Lag Reflex Sniper"**: Microsecond input latency & delay test. Include ASCII diagram, `performance.now()` timestamp delta formula, USB HID polling rate formula ($f_{\text{poll}} = 1 / \text{median}(\Delta t_{\text{input}})$), and discussion of browser vs hardware latency limits.
   - **Game 4: "Touch Matrix Defusal"**: Multi-touch digitizer dead-zone benchmark. Include ASCII diagram, $10 \times 16$ grid matrix hit testing algorithm formula.

4. Google Search Essentials & Anti-Spam (Strict E-E-A-T) Compliance:
   - **Thin Content Avoidance**: Deep original interactive utility (interactive diagnostic canvases, games, WASM ICC exports) ensuring high engagement and zero doorway-page fluff.
   - **Core Web Vitals & UX**: Astro.js static generation for 100/100 Lighthouse performance, instant LCP, zero CLS, mobile-first responsive design, zero intrusive ads or popups, WCAG 2.1 AA accessibility.
   - **Trust & YMYL Disambiguation Strategy**:
     * URL taxonomy: `/display-tests/[test-type]/` for hardware tools vs `/screen-test-meaning/` for linguistic/medical disambiguation hub.
     * Medical Bounce Neutralizer Hero Banner (include exact HTML snippet).
     * Schema.org structural JSON-LD metadata (`WebApplication`, `TechArticle`, explicit `medicalAudience` override with `audienceType: "None - Non-Medical Hardware Diagnostic Tool"`).
     * Non-medical terminology enforcement rules (prohibit "eye diagnostic", "sight exam"; use "pixel calibration", "digitizer matrix").
     * Copy-pasteable disclaimer HTML templates: (1) Photosensitive Seizure / Epilepsy Warning, (2) Optometric Ergonomics & 20-20-20 Rule, (3) Hardware Calibration Limitations.
     * Formal hardware engineering citations: ISO 9241-307:2008, VESA DisplayHDR 1.2, IEC 62341, CIE 1931/1976/2000, ANSI/IES RP-28-20.
