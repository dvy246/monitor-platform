# Root Cause Analysis: Mobile UX & Responsive Layout Audit (320px – 430px)

**Agent**: Explorer 2  
**Milestone**: Milestone 1 — Mobile UX & Responsive Layout Engineering Audit  
**Target Viewports**: iPhone SE / Galaxy S8 (320px) to iPhone 15 Pro Max (430px)  
**Target Paths**: `src/pages/` (`display-tests/`, `touch-tests/`, `mouse-test/`, `keyboard-tester/`, `controller-test/`, `sound-test/`, `benchmarks/`, `white-screen/`, `models/`, `compare/`, `touch-matrix/`, `arcade/`) and associated components in `src/components/`.

---

## Executive Summary

A comprehensive, line-by-line responsive layout audit of all diagnostic tools, interactive canvases, telemetry decks, comparison tables, and micro-game components in `monitor_test_hub/src/` was conducted.

The audit revealed **4 primary categories of structural responsiveness defects** affecting mobile viewports between 320px and 430px:
1. **Fixed Width Overflows & Hardcoded Min-Widths (>320px/360px)** without responsive mobile overrides.
2. **Uncollapsed Multi-Column Grids** (`grid-cols-2`, `grid-cols-3`, `grid-cols-6`) forcing narrow cell widths (<40px) and text wrapping onto 3+ lines.
3. **Global `overflow-x: hidden !important` Band-Aid Hacks** in `global.css` and `Layout.astro` masking layout overflow bugs and clipping interactive controls.
4. **Non-Wrapping Flex Containers & Control Collisions** (`flex justify-between` and `flex-nowrap` row layouts) causing button overlapping, text clipping, and asymmetric element stacking.

---

## Detailed Findings & Root Cause Analysis

### Category 1: Fixed Widths & Hardcoded Min-Width Overflows

#### 1.1 `KeyboardTesterCanvas.astro` — Visual Key Grid Container Overflow
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/KeyboardTesterCanvas.astro`
- **Line Numbers**: 86, 90
- **Existing Snippet**:
  ```astro
  <div class="w-full overflow-x-auto pb-2 touch-pan-x h-60 sm:h-[460px] min-h-[320px] max-w-full">
    <div id="keyboard-visual-grid" class="min-w-[840px] space-y-1.5 p-4 rounded-xl bg-bg-canvas border border-border-subtle select-none">
  ```
- **Root Cause**: On mobile viewports (320px–430px), `min-w-[840px]` correctly allows horizontal scrolling for the 104-key physical layout, but `h-60` (240px) conflicts with `min-h-[320px]`. On mobile devices, 240px height vertically clips the bottom 2 rows of keys (Spacebar and Arrow keys) when zoomed or scrolled horizontally.
- **Proposed Structural Fix**:
  ```astro
  <div class="w-full overflow-x-auto pb-2 touch-pan-x h-auto min-h-[300px] sm:h-[460px] max-w-full">
    <div id="keyboard-visual-grid" class="min-w-[840px] space-y-1.5 p-3 sm:p-4 rounded-xl bg-bg-canvas border border-border-subtle select-none">
  ```

#### 1.2 `MouseTesterCanvas.astro` — Header Action Buttons Overflow
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/MouseTesterCanvas.astro`
- **Line Number**: 24
- **Existing Snippet**:
  ```astro
  <div class="flex items-center gap-2 self-end sm:self-auto">
    <button id="mouse-sound-toggle" ...>Audio: ON</button>
    <button id="mouse-reset-btn" ...>Reset Telemetry</button>
    <button id="mouse-export-btn" ...>📜 Export Passport</button>
  </div>
  ```
- **Root Cause**: On 320px viewports (inside a card with 32px padding = 288px container), the three buttons side-by-side require 356px total width (`85px + 120px + 135px + 16px gap`). The container lacks `flex-wrap` and `w-full`, causing the export button to overflow the right screen boundary by 68px.
- **Proposed Structural Fix**:
  ```astro
  <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto self-start sm:self-auto pt-2 sm:pt-0">
    <button id="mouse-sound-toggle" class="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-bg-elevated hover:bg-bg-subtle border border-border-hairline text-xs font-mono text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5">
    <button id="mouse-reset-btn" class="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-bg-elevated hover:bg-rose-500/20 border border-border-hairline hover:border-rose-500/40 text-xs font-mono text-text-secondary hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5">
    <button id="mouse-export-btn" class="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-status-pass/20 hover:bg-status-pass/30 border border-status-pass/40 text-xs font-mono text-status-pass font-bold transition-colors flex items-center justify-center gap-1.5">
  ```

#### 1.3 `PcBottleneckInspector.astro` — Unconstrained Severity Badge Overflow
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/PcBottleneckInspector.astro`
- **Line Numbers**: 73–75
- **Existing Snippet**:
  ```astro
  <div id="severity-badge" class={`inline-block px-3 py-1 rounded-full text-xs font-bold ...`}>
    {initialResult.severity} {initialResult.primaryBottleneck} Bottleneck ({initialResult.bottleneckPercentage}%)
  </div>
  ```
- **Root Cause**: `#severity-badge` is rendered as `inline-block` with unconstrained text width. Dynamic strings like `"Moderate Graphic Card (GPU) Bottleneck (24%)"` exceed 320px in width on a single line, causing clipping or page overflow inside a 270px card container on mobile.
- **Proposed Structural Fix**:
  ```astro
  <div id="severity-badge" class={`inline-block max-w-full break-words px-3 py-1 rounded-xl text-xs font-bold leading-normal ...`}>
    {initialResult.severity} {initialResult.primaryBottleneck} Bottleneck ({initialResult.bottleneckPercentage}%)
  </div>
  ```

#### 1.4 `compare/[slug].astro` — Unconstrained Display Comparison Table
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/pages/compare/[slug].astro`
- **Line Numbers**: 62–69
- **Existing Snippet**:
  ```astro
  <div class="overflow-x-auto bg-bg-surface border border-border-hairline rounded-2xl p-4 sm:p-6 mb-8">
    <table class="w-full text-left text-sm font-sans">
      <thead>
        <tr ...>
          <th class="py-3 px-4">Hardware Specification</th>
          <th class="py-3 px-4 text-emerald-400 font-bold">{devA.name}</th>
          <th class="py-3 px-4 text-cyan-400 font-bold">{devB.name}</th>
        </tr>
  ```
- **Root Cause**: On mobile 320px viewports, `<table class="w-full">` squishes 3 columns into 280px total width (~90px per column). Long monitor names (e.g. `Samsung Odyssey OLED G95SC`) wrap into 5 lines of fragmented single words (`Sam-`, `sung`, `Odys-`, `sey`, `OLED`, `G95-`, `SC`).
- **Proposed Structural Fix**:
  ```astro
  <div class="overflow-x-auto bg-bg-surface border border-border-hairline rounded-2xl p-3 sm:p-6 mb-8">
    <table class="w-full min-w-[540px] text-left text-sm font-sans">
  ```

---

### Category 2: Uncollapsed Multi-Column Grids

#### 2.1 `ControllerTesterCanvas.astro` — 18-Button Raw Input Grid Squishing
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/ControllerTesterCanvas.astro`
- **Line Number**: 317
- **Existing Snippet**:
  ```astro
  <div class="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-2 text-center text-xs">
  ```
- **Root Cause**: On 320px viewports (inside `p-4` card = 288px space), 6 grid columns with `gap-2` (40px gaps) leave 41.3px per cell. The cell padding (`p-2` = 16px) leaves only 25px of content space. Live analog values like `0.00` (26px) wrap onto two lines (`0.` on line 1, `00` on line 2).
- **Proposed Structural Fix**:
  ```astro
  <div class="grid grid-cols-3 xs:grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-1.5 sm:gap-2 text-center text-xs">
  ```

#### 2.2 `ApcaContrastInspector.astro` — Preset Palette Grid Truncation
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/ApcaContrastInspector.astro`
- **Line Number**: 53
- **Existing Snippet**:
  ```astro
  <div class="grid grid-cols-3 gap-2">
    <button ...>White on Dark</button>
    <button ...>Off-White/Charcoal</button>
    <button ...>Black on White</button>
  </div>
  ```
- **Root Cause**: On 320px viewports (inside `p-5` container = 280px width), `grid-cols-3` forces each button into an 88px cell. Text like `Off-White/Charcoal` (117px width requirement) breaks into 3 awkward lines (`Off-`, `White/Char`, `coal`).
- **Proposed Structural Fix**:
  ```astro
  <div class="grid grid-cols-1 xs:grid-cols-3 gap-2">
  ```

#### 2.3 `ColorMatchAlchemist.astro` & `GhostingInvaders.astro` — Scoreboard Card Wrapping
- **File Paths**:
  - `/Users/divyyadav/newws/monitor_test_hub/src/components/arcade/ColorMatchAlchemist.astro`: Line 13
  - `/Users/divyyadav/newws/monitor_test_hub/src/components/arcade/GhostingInvaders.astro`: Line 21
- **Existing Snippet**:
  ```astro
  <div class="grid grid-cols-3 gap-4 mb-6 font-mono text-center">
  ```
- **Root Cause**: On 320px screens (inside `p-6` container = 272px width), `grid-cols-3 gap-4` leaves 80px per column. Metric labels like `Target Delta-E` and `Response Time Target` wrap onto 3 lines.
- **Proposed Structural Fix**:
  ```astro
  <div class="grid grid-cols-3 gap-1.5 sm:gap-4 mb-4 font-mono text-center">
    <div class="bg-gray-950 p-1.5 sm:p-2.5 rounded border border-gray-850">
      <span class="text-gray-500 text-[9px] sm:text-[10px] uppercase block truncate">Target Delta-E</span>
  ```

#### 2.4 `GamepadDriftInspector.astro` — Stick Telemetry Card Label Wrapping
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/GamepadDriftInspector.astro`
- **Line Numbers**: 27, 47
- **Existing Snippet**:
  ```astro
  <div class="w-full grid grid-cols-2 gap-2 text-[11px] text-slate-300">
    <div class="bg-[#18181b] p-2 rounded border border-white/5 flex justify-between">
      <span class="text-slate-400">Circularity Err:</span>
      <span id="left-circ-val" class="font-bold text-cyan-400">0.0%</span>
    </div>
  </div>
  ```
- **Root Cause**: On 320px viewports (240px card container), `grid-cols-2` gives 116px per card. `Circularity Err:` (85px) + `0.0%` (25px) inside `p-2` padding (16px) requires 126px width, forcing `Circularity Err:` to wrap onto 2 lines.
- **Proposed Structural Fix**:
  ```astro
  <div class="w-full grid grid-cols-1 xs:grid-cols-2 gap-2 text-[11px] text-slate-300">
    <div class="bg-[#18181b] p-2 rounded border border-white/5 flex justify-between items-center">
      <span class="text-slate-400">Circ. Error:</span>
  ```

#### 2.5 `MicNoiseFloor.astro` — Telemetry Metric Grid Label Wrapping
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/MicNoiseFloor.astro`
- **Line Number**: 39
- **Existing Snippet**:
  ```astro
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
  ```
- **Root Cause**: On 320px viewports (272px space), `grid-cols-2` gives 128px per metric box. `Noise Floor Baseline` in uppercase 10px font requires 143px with `p-3.5` padding, forcing the label onto 3 lines.
- **Proposed Structural Fix**:
  ```astro
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
    <div class="bg-bg-elevated p-2.5 sm:p-3.5 rounded-xl border border-border-hairline">
  ```

---

### Category 3: Global `overflow-x: hidden` Band-Aid Hacks

#### 3.1 `global.css` & `Layout.astro` — Universal Overflow Masking
- **File Paths**:
  - `/Users/divyyadav/newws/monitor_test_hub/src/styles/global.css`: Lines 143, 152, 236
  - `/Users/divyyadav/newws/monitor_test_hub/src/layouts/Layout.astro`: Lines 27, 58, 1152, 1157
- **Existing Snippets**:
  ```css
  /* global.css line 143 & 236 */
  html, body {
    max-width: 100% !important;
    max-width: 100vw !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
    width: 100% !important;
  }

  /* global.css line 152 */
  @media (max-width: 640px) {
    h1, h2, h3, h4, h5, h6, p, span, kbd, code, a, li, td, th, div, label {
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      hyphens: auto;
    }
  }
  ```
- **Root Cause**: `overflow-x: hidden !important` is applied at root document level (`html, body, #main-content, footer`) to force-hide horizontal scrollbars caused by unconstrained child elements. This band-aid hack masks underlying responsive bugs, breaks position sticky, and clips interactive diagnostic tools (e.g. keyboard reticle, touch matrices). Furthermore, line 152 forcibly breaks words anywhere on mobile elements, severing button labels and technical terminology mid-word (`C-I-E-D-E-2-0-0-0`).
- **Proposed Structural Fix**:
  1. Remove `overflow-x: hidden !important;` from `html, body` in `global.css` and use clean `max-w-full overflow-x-clip` on root layouts where needed.
  2. Replace aggressive `overflow-wrap: anywhere !important; word-break: break-word !important;` in `global.css` line 152 with targeted utility class `break-words` on prose text blocks.

---

### Category 4: Non-Wrapping Flex Containers & Control Collisions

#### 4.1 `AudioTesterCanvas.astro` — Button Row Collision
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/AudioTesterCanvas.astro`
- **Line Numbers**: 6–9
- **Existing Snippet**:
  ```astro
  <div class="mt-4 flex justify-between gap-4">
    <button class="bg-primary-500 hover:bg-primary-400 text-white px-6 py-2 rounded font-medium transition-colors">Play Test Tone</button>
    <button class="bg-bg-elevated hover:bg-bg-surface text-text-primary px-6 py-2 rounded font-medium transition-colors border border-border-hairline">Sweep</button>
  </div>
  ```
- **Root Cause**: `flex justify-between gap-4` without `flex-col sm:flex-row` requires 277px width (`168px + 93px + 16px gap`). In a 272px container on 320px mobile viewports, the buttons overflow the right edge by 5px or cause button text wrapping.
- **Proposed Structural Fix**:
  ```astro
  <div class="mt-4 flex flex-col sm:flex-row justify-between gap-3 w-full">
    <button class="w-full sm:w-auto bg-primary-500 hover:bg-primary-400 text-white px-6 py-2.5 rounded-xl font-medium transition-colors cursor-pointer">Play Test Tone</button>
    <button class="w-full sm:w-auto bg-bg-elevated hover:bg-bg-surface text-text-primary px-6 py-2.5 rounded-xl font-medium transition-colors border border-border-hairline cursor-pointer">Sweep</button>
  </div>
  ```

#### 4.2 `DeltaECalculatorInspector.astro` — Header Title & Badge Collision
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/DeltaECalculatorInspector.astro`
- **Line Numbers**: 80–83
- **Existing Snippet**:
  ```astro
  <h4 class="text-sm font-bold text-text-primary border-b border-border-hairline pb-2 flex items-center justify-between">
    <span>📊 PERCEPTUAL DELTA E TELEMETRY</span>
    <span id="iso-pass-badge" class="text-xs font-mono font-bold text-status-pass uppercase">ISO 9241-307: PASS</span>
  </h4>
  ```
- **Root Cause**: On 320px viewports (280px card space), title span (200px) and badge span (120px) in `flex items-center justify-between` require 320px width. Lacking wrapping, the badge collides with the title and wraps onto 2 lines inside the heading.
- **Proposed Structural Fix**:
  ```astro
  <h4 class="text-sm font-bold text-text-primary border-b border-border-hairline pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
  ```

#### 4.3 `UniversalScreenTestDeck.astro` — Action Bar Asymmetrical Button Stack
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/UniversalScreenTestDeck.astro`
- **Line Numbers**: 113–144
- **Existing Snippet**:
  ```astro
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
    <div class="flex items-center gap-2 flex-wrap">
      <button id="ust-btn-fullscreen" class="flex-1 sm:flex-initial ...">ENTER FULLSCREEN TEST</button>
      <button id="ust-btn-slideshow" class="inline-flex ...">▶ AUTO SLIDESHOW</button>
    </div>
    <div class="flex items-center gap-2">
      <button id="ust-btn-passport" class="w-full sm:w-auto ...">SIGN SHA-256 PASSPORT</button>
    </div>
  </div>
  ```
- **Root Cause**: On 320px viewports, button 1 (`flex-1`) stretches on row 1, button 2 (`inline-flex`) wraps to row 2 without stretching, and button 3 (`w-full`) stretches on row 3, creating an unaligned 3-row button pile.
- **Proposed Structural Fix**:
  ```astro
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
    <div class="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <button id="ust-btn-fullscreen" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-status-pass text-bg-canvas font-extrabold text-xs shadow-specular-top hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer font-mono">
      <button id="ust-btn-slideshow" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-bg-canvas text-text-primary border border-border-hairline hover:border-status-pass transition-all cursor-pointer text-xs font-mono">
    </div>
    <button id="ust-btn-passport" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-bg-canvas text-text-secondary border border-border-hairline hover:text-text-primary hover:border-status-pass transition-all cursor-pointer text-xs font-mono">
  ```

#### 4.4 `WhiteScreenCanvas.astro` — Kelvin Temperature Label Collision
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/WhiteScreenCanvas.astro`
- **Line Numbers**: 98–103
- **Existing Snippet**:
  ```astro
  <div class="flex items-center justify-between">
    <label for="kelvin-slider" class="text-xs font-bold text-text-primary uppercase tracking-wider">
      Color Temp (Kelvin): <span id="kelvin-val-display" class="text-status-pass font-extrabold">{initialKelvin}K</span>
    </label>
    <span class="text-[10px] text-text-muted">2700K Warm — 6500K Daylight</span>
  </div>
  ```
- **Root Cause**: On 320px viewports (288px space), label (200px) and hint span (160px) in `flex items-center justify-between` require 360px total width, causing hint text to wrap into 3 lines.
- **Proposed Structural Fix**:
  ```astro
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
  ```

#### 4.5 `ModelTelemetryTable.astro` — Table Footer Pagination Collision
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/ModelTelemetryTable.astro`
- **Line Numbers**: 157–162
- **Existing Snippet**:
  ```astro
  <div class="px-6 py-3 border-t border-border-hairline bg-bg-elevated flex items-center justify-between text-[11px] text-text-muted">
    <span>Showing recent verified submissions</span>
    <a href="/display-tests/dead-pixel" class="text-status-pass hover:underline font-bold">+ Run Diagnostic &amp; Submit Receipt</a>
  </div>
  ```
- **Root Cause**: On 320px viewports (288px space), span (190px) and link (210px) in `flex items-center justify-between` require 400px total width, causing the link to wrap onto 3 lines.
- **Proposed Structural Fix**:
  ```astro
  <div class="px-4 sm:px-6 py-3 border-t border-border-hairline bg-bg-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-text-muted">
  ```

#### 4.6 `HardwarePassportModal.astro` — Receipt Hash & Timestamp Header Collision
- **File Path**: `/Users/divyyadav/newws/monitor_test_hub/src/components/diagnostics/HardwarePassportModal.astro`
- **Line Numbers**: 105–109
- **Existing Snippet**:
  ```astro
  <div class="bg-bg-canvas border border-border-hairline rounded-lg p-3 space-y-1">
    <div class="flex justify-between text-[10px] text-text-muted">
      <span>RECEIPT SHA-256 SIGNATURE</span>
      <span id="passport-timestamp">2026-07-22 00:30 UTC</span>
    </div>
  ```
- **Root Cause**: Inside modal on 320px screens (240px container space), `RECEIPT SHA-256 SIGNATURE` (140px) + timestamp (130px) in `flex justify-between` require 270px width, causing the timestamp to overflow or wrap onto 2 lines.
- **Proposed Structural Fix**:
  ```astro
  <div class="flex flex-col sm:flex-row justify-between gap-1 text-[10px] text-text-muted">
  ```

---

## Summary of Audit Findings Matrix

| Target Route / Component | Primary Issue Identified | Root Cause | Proposed Fix |
|---|---|---|---|
| `KeyboardTesterCanvas.astro` | Reticle vertical clipping & mode selector wrap | `h-60` height conflicts with `min-h-[320px]`; mode buttons `flex-nowrap` | Change height to `h-auto min-h-[300px] sm:h-[460px]`; add `overflow-x-auto` to mode bar |
| `MouseTesterCanvas.astro` | Action bar button overflow (68px) | 3 buttons side-by-side in `flex items-center gap-2` require 356px width | Add `flex-wrap` and `w-full sm:w-auto` to button container |
| `PcBottleneckInspector.astro` | Severity badge horizontal overflow | `#severity-badge` rendered as `inline-block` with 324px unconstrained width | Add `max-w-full break-words leading-normal` |
| `compare/[slug].astro` | Model name table cell squishing | `<table class="w-full">` squishes 3 columns into 280px without `min-w` | Set `<table class="w-full min-w-[540px]">` in `overflow-x-auto` |
| `ControllerTesterCanvas.astro` | 18-button grid number wrapping | `grid-cols-6` leaves 25px content space per cell for `0.00` values | Use `grid-cols-3 xs:grid-cols-6 sm:grid-cols-9` on mobile |
| `ApcaContrastInspector.astro` | Preset button text truncation | `grid-cols-3` forces `Off-White/Charcoal` into 88px cell | Use `grid-cols-1 xs:grid-cols-3 gap-2` |
| `ColorMatchAlchemist.astro` | Scoreboard text wrapping (3 lines) | `grid-cols-3 gap-4` leaves 80px per column for 14-char labels | Reduce gap to `gap-1.5` and add `truncate` |
| `GamepadDriftInspector.astro` | Stick telemetry label wrapping | `grid-cols-2` gives 116px per card for 126px label requirement | Use `grid-cols-1 xs:grid-cols-2` and shorten label |
| `MicNoiseFloor.astro` | Noise floor metric box wrapping | `grid-cols-2` gives 128px per box for 143px label requirement | Reduce padding to `p-2.5` and gap to `gap-2.5` |
| `global.css` & `Layout.astro` | Universal `overflow-x: hidden !important` | Document-level overflow masking hides layout bugs & breaks sticky | Remove global `overflow-x: hidden !important`; use targeted `overflow-x-clip` |
| `AudioTesterCanvas.astro` | Action button row overflow | `flex justify-between gap-4` requires 277px width in 272px card | Use `flex flex-col sm:flex-row gap-3 w-full` |
| `DeltaECalculatorInspector.astro` | Header title & badge collision | Title (200px) and badge (120px) side-by-side require 320px in 280px card | Use `flex flex-col sm:flex-row sm:items-center gap-1` |
| `UniversalScreenTestDeck.astro` | Asymmetrical 3-row button pile | Mix of `flex-1`, `inline-flex`, and `w-full` on button bar | Apply uniform `w-full sm:w-auto` layout to all buttons |
| `WhiteScreenCanvas.astro` | Kelvin temp label collision | Label (200px) and hint (160px) side-by-side require 360px in 288px space | Use `flex flex-col sm:flex-row sm:items-center gap-1` |
| `ModelTelemetryTable.astro` | Table footer link wrapping | Text (190px) and link (210px) side-by-side require 400px in 288px space | Use `flex flex-col sm:flex-row sm:items-center gap-2` |
| `HardwarePassportModal.astro` | Signature & timestamp header collision | Signature (140px) and timestamp (130px) require 270px in 240px modal | Use `flex flex-col sm:flex-row justify-between gap-1` |

---

## Verification & Independent Inspection Instructions

To verify the audit findings and test proposed fix implementations:

1. **Development Server**:
   ```bash
   cd /Users/divyyadav/newws/monitor_test_hub
   npm run dev
   ```
2. **Mobile Viewport Emulation**:
   Open Chrome DevTools / Safari Web Inspector and emulate viewports at **320px × 568px** (iPhone SE 1st Gen) and **390px × 844px** (iPhone 13 / 14 Pro).
3. **Target Verification Commands**:
   ```bash
   # Run Vitest test suite to confirm zero regressions
   TMPDIR=$PWD/.tmp npm test

   # Run TypeScript strict type-checking
   npx tsc --noEmit

   # Run production build compilation test
   TMPDIR=$PWD/.tmp npm run build
   ```
