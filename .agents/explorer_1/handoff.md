# Visual Display & Color Diagnostic Suite Audit & Structural Handoff Report

## 1. Observation

Direct inspection of all 12 Visual Display & Color diagnostic page routes in `monitor_test_hub/src/pages/` was conducted. Below are exact findings, verbatim code patterns, line references, and structural layouts per page.

### 1.1 Page-by-Page Audit Findings

#### 1. `src/pages/refresh-rate-test.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8...">`). No sidebar or `lg:grid-cols-12` split.
- **Header & Deck**: Features a prominent hero deck (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10`) with glowing cyan/emerald background blur circles. Line 65 uses emoji `🔬 ISO 9241-307 & W3C Frame Pacing Telemetry Standards`.
- **Diagnostic Engine**: Renders `<EpilepsyWarning />` and `<RefreshRateInspector targetHz="AUTO (DETECTING)" />` (line 80).
- **FAQ & Content**: Renders `<FAQSection faqs={faqs} />` at line 113 AND a duplicate hardcoded `<details>` accordion section with 10 generic placeholders (`"FAQ Question 1 regarding this test?"` at lines 137-235). Missing `<Breadcrumbs />` and `<TestSwitcherBar />`.

#### 2. `src/pages/monitor-color-calibration.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8...">`).
- **Header & Deck**: Features hero header deck with a `"📖 How To Test"` button (line 84) triggering `<TestGuideModal />`. Uses emoji `📖` (violates UI/UX Pro Max Rule 1).
- **Diagnostic Engine**: Sequentially stacks three separate instruments:
  1. `<DeltaECalculatorInspector />` (line 110)
  2. `<ApcaContrastInspector />` (line 121)
  3. Binary ICC Profile Exporter card (line 125) with inline client script (lines 153-181).
- **FAQ & Content**: Renders `<FAQSection faqs={faqs} />` (line 149). Missing `<Breadcrumbs />` and `<TestSwitcherBar />`.

#### 3. `src/pages/white-screen/index.astro` & `[color].astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Standard mono header with `<Breadcrumbs />` (line 117) and uppercase status badge (`TOP-OF-FUNNEL SCREEN LIGHTING & CLEANING UTILITY`).
- **Diagnostic Engine**: `<WhiteScreenCanvas initialColor="#ffffff" initialKelvin={6500} activeColorName="Pure White" />` (line 133). Dynamic route `[color].astro` passes parametric `hex`, `kelvin`, and `name`.
- **FAQ & Content**: Renders a 3-card usage guide grid (Webcam Fill Light, Screen Cleaning & Dust, Dead Pixel Inspection) and `<FaqSchema faqs={whiteScreenFaqs} emitSchema={false} />` (line 169). Missing `<TestSwitcherBar />`.

#### 4. `src/pages/display-tests/dead-pixel.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Mono header with `<Breadcrumbs />` and `"📖 How To Test"` guide trigger (line 111).
- **Diagnostic Engine**: Interactive color palette card deck (11 color cards, lines 138-161) + action control bar + 30-Day Return Window Inspector card + fixed overlay modal (`#deadpixel-overlay`, line 208). Uses hover scaling (`hover:scale-[1.02]`, line 145), which violates UI/UX Pro Max Rule 3 (Hover Stability).
- **FAQ & Content**: Renders ISO 9241-307 defect class table (lines 275-309), `<FAQSection faqs={faqs} />` (line 312), and `<TestSwitcherBar tests={displayTests} currentId="dead-pixel" />` (line 314).

#### 5. `src/pages/display-tests/sub-pixel.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Standard header with `<Breadcrumbs />`.
- **Diagnostic Engine**: `<SubPixelAnalyzer />` (line 43).
- **FAQ & Content**: Includes 3-column subpixel geometry cards (RGB Stripe, BGR, QD-OLED), `<HardwareLimitationNotice />` (line 74), and `<TestSwitcherBar />` (line 77). Lacks `<FAQSection />`.

#### 6. `src/pages/display-tests/uniformity.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Standard header with `<Breadcrumbs />`.
- **Diagnostic Engine**: `<OledUniformityEngine />` (line 43).
- **FAQ & Content**: Includes 3-column near-black physics cards, `<HardwareLimitationNotice />` (line 74), and `<TestSwitcherBar />` (line 77). Lacks `<FAQSection />`.

#### 7. `src/pages/display-tests/vrr.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Header with `<Breadcrumbs />` and `"EMBED THIS WIDGET"` button with SVG icon (lines 61-67).
- **Diagnostic Engine**: `<EpilepsyWarning />` + `<VrrStutterEngine />` (lines 70-71).
- **FAQ & Content**: Adaptive-Sync physics cards, `<HardwareLimitationNotice />` (line 102), `<TestSwitcherBar />` (line 105), and `<EmbedWidgetModal />` (line 108). FAQs passed to `<Layout faqs={vrrFaqs}>`, but visual `<FAQSection />` component is not called in body.

#### 8. `src/pages/display-tests/oled-burn-in.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`). Shortest file (43 lines).
- **Header & Deck**: Header with `<Breadcrumbs />`.
- **Diagnostic Engine**: `<OledBurnInAnalyzer />` (line 38).
- **FAQ & Content**: Renders `<TestSwitcherBar />` (line 40). Lacks explanatory articles or `<FAQSection />`.

#### 9. `src/pages/display-tests/hdr-test.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Header with `<Breadcrumbs />`.
- **Diagnostic Engine**: `<HdrClippingTester initialPeakNits={1000} initialToneMapping="hgig" initialWindowSize="gradient" />` (line 45).
- **FAQ & Content**: SMPTE ST.2084 PQ EOTF article with 3-column cards + `<EpilepsyWarning />` & `<HardwareLimitationNotice />` embedded inside article (lines 77-78), and `<TestSwitcherBar />` (line 82). Lacks `<FAQSection />`.

#### 10. `src/pages/display-tests/ppi-calculator.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Header with `<Breadcrumbs />`.
- **Diagnostic Engine**: Embedded 2-column card (Inputs form on left, Results on right, lines 74-158) with inline client calculation script (lines 236-305).
- **FAQ & Content**: Common Monitor PPI Reference Table (lines 162-195), Arcminute Acuity article (lines 198-230), and `<TestSwitcherBar />` (line 232). Lacks visual `<FAQSection />` (faqs passed only to Layout props).

#### 11. `src/pages/display-tests/color-gamut.astro`
- **Current Layout**: Single vertical column stack (`<div class="max-w-7xl mx-auto px-4 py-8 space-y-8">`).
- **Header & Deck**: Header with `<Breadcrumbs />`.
- **Diagnostic Engine**: Embedded 2-column card (Controls & metric bars on left, CIE 1931 Canvas on right, lines 96-155) with inline CIE 1931 rendering script and `IccExporter.ts` handler (lines 232-354).
- **FAQ & Content**: Color Space Primary Coordinates Table (lines 157-191), Chromaticity article + `<FAQSection faqs={faqs} />` (line 225), and `<TestSwitcherBar />` (line 228).

#### 12. `src/pages/display-tests/return-window-checker/[slug].astro`
- **Current Layout**: Single vertical column stack with narrower constraint (`max-w-4xl mx-auto px-4 py-8 space-y-8`).
- **Header & Deck**: Header with `<Breadcrumbs />`.
- **Diagnostic Engine**: Spec Scorecard Container with 4 metric cards, RMA Advice box, and "GENERATE HARDWARE PASSPORT" button (lines 64-119).
- **FAQ & Content**: `<AdSenseSlot />` (line 122), custom `<div class="space-y-4 text-xs">` FAQ box AND `<FAQSection faqs={faqs} />` (lines 125-140). Lacks `<TestSwitcherBar />`.

---

### 1.2 Evaluation Against UI/UX Pro Max 5 Strict Rules

| Rule | Requirement | Current Compliance Status & Direct Violations |
| :--- | :--- | :--- |
| **Rule 1: Icons & Assets** | STRICTLY NO emoji icons. Fixed viewBox SVG icons (`w-5 h-5` / `w-6 h-6`). | ❌ **Violated**: `refresh-rate-test.astro` uses `🔬` (line 84). `monitor-color-calibration.astro` uses `📖 How To Test` (line 89) and `📥 Export ICC` (line 139). `dead-pixel.astro` uses `📖 How To Test` (line 114). |
| **Rule 2: Interaction & Feedback** | `cursor-pointer` on all interactive controls with smooth `transition-colors duration-200`. | ⚠️ **Partial**: Buttons have `cursor-pointer`, but transition durations are inconsistent (`duration-150`, `transition-all`, or missing `duration-200`). |
| **Rule 3: Hover Stability** | NO scale transforms (`scale-105`, `scale-[1.02]`) on hover. Interpolate border/background/glow instead. | ❌ **Violated**: `dead-pixel.astro` line 145 uses `hover:scale-[1.02]`, causing layout shifting on color swatch hover. |
| **Rule 4: Touch & Accessibility** | Minimum touch target size 44x44px; prominent focus rings (`focus:ring-2 focus:ring-status-pass`). | ⚠️ **Partial**: Header buttons (`min-h-[36px]`, `px-3 py-1.5`) are under 44px height. Form inputs in `ppi-calculator` use focus rings, but buttons lack standard focus states. |
| **Rule 5: Consistency** | Global `max-w-7xl` grid & dark glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10`). | ❌ **Violated**: Mix of hardcoded `#121215` styling vs token classes (`bg-bg-surface`). `return-window-checker/[slug]` uses `max-w-4xl` instead of standard `max-w-7xl`. |

---

## 2. Logic Chain

1. **Observation**: All 12 Visual Display & Color pages currently place controls, telemetry, calculators, articles, and FAQs sequentially in a single vertical column (`space-y-8`).
2. **Inference**: On desktop monitors (1920x1080 to 4K), over 60% of horizontal viewport width is wasted as black void, while critical controls and real-time telemetry metrics (such as FPS jitter, Delta-E, PPI, or RGB swatches) are forced far below the fold or separated from the main diagnostic canvas.
3. **Observation**: Layout structure, header styles, breadcrumb presence, modal triggers, and FAQ implementations vary widely across tool pages (e.g. `refresh-rate-test` lacks breadcrumbs and has duplicate FAQ sections; `return-window-checker` is restricted to `max-w-4xl`).
4. **Inference**: Adopting a unified `lg:grid-cols-12` 2-column layout (Left Canvas `lg:col-span-8` + Right Sidebar `lg:col-span-4`) resolves viewport waste, keeps diagnostic instruments in focus, and creates visual and structural parity across all 12 tools.
5. **Observation**: Right sidebar requirements differ logically by tool: stateful tools (Refresh Rate, VRR) require real-time `TelemetryCard` and `StatusCard`; color tools require `PaletteCard`, `MetricCard`, and `ConfigurationCard`; calculators require `MetricCard` and `ConfigurationCard`.
6. **Conclusion**: Standardizing all 12 pages on `max-w-7xl mx-auto px-4 py-8`, splitting into `lg:grid-cols-12 gap-8` (Left Canvas `lg:col-span-8 space-y-6` + Right Sidebar `lg:col-span-4 sticky top-24 space-y-6`), enforcing the 5 UI/UX Pro Max rules, and mapping a dedicated Right Sidebar component stack per tool will deliver an optimal desktop & mobile experience.

---

## 3. Caveats

- **Read-Only Scope**: Explorer 1 is strictly read-only regarding `src/` files. Code updates will be executed by implementer agents based on this blueprint.
- **Component Availability**: Sidebar cards (`InfoCard`, `MetricCard`, `ShortcutCard`, `ConfigurationCard`, `StatusCard`, `PaletteCard`, `TelemetryCard`, `InspectorCard`, `PassportCard`) must be implemented as reusable Astro components in `src/components/ui/sidebar/` or co-located inside diagnostic components.
- **Mobile Stack Order**: On mobile devices (`< lg`), the Right Sidebar collapses below the Left Canvas. Mobile responsive order ensures interactive controls appear immediately beneath the canvas before long technical text.

---

## 4. Conclusion & Structural Blueprint

### 4.1 Master Structural Paradigm (`lg:grid-cols-12 gap-8`)

Every Visual Display & Color diagnostic page will adhere to the following container structure:

```astro
<Layout title={title} description={description} faqs={faqs}>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8 font-sans">
    <!-- Breadcrumbs Navigation -->
    <Breadcrumbs items={breadcrumbItems} />

    <!-- Unified Tool Header Deck -->
    <header class="relative w-full rounded-3xl border border-white/10 bg-[#121215]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-4 overflow-hidden">
      <!-- Title, Subtitle, Status Badge, Action Triggers -->
    </header>

    <!-- Unified 2-Column Diagnostic Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Main Diagnostic Canvas (Col Span 8) -->
      <main class="lg:col-span-8 space-y-6 min-w-0">
        <!-- 1. Interactive Diagnostic Engine / Canvas -->
        <!-- 2. Fullscreen / Overlay Controls -->
        <!-- 3. Technical ISO & Engineering Methodology Article -->
        <!-- 4. Unified 10-Item FAQ Accordion Section -->
        <!-- 5. Test Switcher Cross-Navigation Bar -->
      </main>

      <!-- Right Diagnostic Sidebar (Col Span 4) -->
      <aside class="lg:col-span-4 space-y-6 sticky top-24">
        <!-- Structured Card Stack per Tool -->
      </aside>
    </div>
  </div>
</Layout>
```

---

### 4.2 Comprehensive Tool-by-Tool Component Mapping Matrix

Below is the definitive Right Sidebar component stack and Left Canvas layout specification for all 12 Visual Display & Color diagnostic pages:

| Page Route | Left Canvas (`lg:col-span-8`) Content | Right Sidebar (`lg:col-span-4`) Component Stack |
| :--- | :--- | :--- |
| `refresh-rate-test.astro` | 1. Header & Epilepsy Notice<br>2. `<RefreshRateInspector />` (Pursuit Reticle & Canvas)<br>3. Technical ISO 9241-307 Article<br>4. Clean `<FAQSection />` (10 FAQs)<br>5. `<TestSwitcherBar />` | 1. `TelemetryCard` (Real-time Hz, target Hz, microsecond delta, jitter $\sigma$)<br>2. `StatusCard` (LTPO / ProMotion mode badge)<br>3. `ConfigurationCard` (Pursuit reticle speed: 1x, 1/2x, 1/4x)<br>4. `ShortcutCard` (`F` Fullscreen, `Space` Pause, `1-4` Speed presets)<br>5. `InfoCard` (ISO frame pacing standards) |
| `monitor-color-calibration.astro` | 1. Header & Guide Modal Trigger<br>2. `<DeltaECalculatorInspector />`<br>3. `<ApcaContrastInspector />`<br>4. Calibration Physics Article<br>5. Clean `<FAQSection />` (10 FAQs)<br>6. `<TestSwitcherBar />` | 1. `PaletteCard` (Macbeth 24-color patch picker & hex input)<br>2. `MetricCard` (CIEDE2000 $\Delta E_{00}$ readout, APCA score, D65 delta)<br>3. `ConfigurationCard` (ICC v4.3 Generator: sRGB/DCI-P3, Gamma 2.2, "Export .icc Profile" button)<br>4. `InfoCard` (OSD RGB gain adjustment tips) |
| `white-screen/index.astro` & `[color].astro` | 1. Header Deck<br>2. `<WhiteScreenCanvas />` (Full-Screen Light & Smudge Canvas)<br>3. Usage Guide 3-Card Grid<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `PaletteCard` (Solid Swatches: White, Black, Red, Green, Blue, Yellow, 2700K Zoom)<br>2. `ConfigurationCard` (2700K–6500K Kelvin Slider, Smudge Grid Toggle, Wake Lock Status)<br>3. `ShortcutCard` (`1-6` Colors, `F` Fullscreen, `G` Grid toggle, `Esc` Exit)<br>4. `InfoCard` (Webcam fill light tips & OLED ABL notice) |
| `display-tests/dead-pixel.astro` | 1. Header Deck<br>2. Fullscreen Test Launcher Deck<br>3. ISO 9241-307 Defect Standard Article & Table<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `PaletteCard` (11 Color Swatches: RGB, Pure Black, Pure White, Grays, CMY)<br>2. `InspectorCard` (Active color name, hex code, logged pin defects count)<br>3. `PassportCard` (30-Day Return Inspector, Hardware Passport trigger button)<br>4. `ShortcutCard` (`Space` Next, `1-9` Jump, `Shift+Click` Drop Pin, `Esc` Exit)<br>5. `InfoCard` (ISO Class I–IV RMA threshold table) |
| `display-tests/sub-pixel.astro` | 1. Header Deck<br>2. `<SubPixelAnalyzer />` (WebGL Reticle & ClearType Sample)<br>3. Font Smoothing & Chromatic Fringing Article<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `ConfigurationCard` (Sub-pixel layout preset: RGB Stripe, BGR, QD-OLED Gen1/2, WOLED RWBG)<br>2. `MetricCard` (Sub-pixel resolution multiplier, ClearType compatibility rating)<br>3. `ShortcutCard` (Zoom level controls, sample text size slider)<br>4. `InfoCard` (ClearType vs FreeType antialiasing physics & `<HardwareLimitationNotice />`) |
| `display-tests/uniformity.astro` | 1. Header Deck<br>2. `<OledUniformityEngine />` (5%/10% Near-black Canvas)<br>3. IEC 62341-6-2 Near-Black Banding Article<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `ConfigurationCard` (Luminance level: 1% Black, 5% Near-Black, 10% Shadow, 50% Gray, Banding Grid overlay toggle)<br>2. `MetricCard` (Luminance variance %, DSE severity index)<br>3. `ShortcutCard` (`1-5` Luminance levels, `B` Grid, `F` Fullscreen)<br>4. `InfoCard` (OLED Pixel Refresh compensation advice & `<HardwareLimitationNotice />`) |
| `display-tests/vrr.astro` | 1. Header & Epilepsy Notice<br>2. `<VrrStutterEngine />` (Oscillation & Pacing Canvas)<br>3. Adaptive-Sync & LFC Physics Article<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `TelemetryCard` (Measured FPS, frame interval delta ms, micro-stutter $\sigma$)<br>2. `StatusCard` (LFC Status: Active / Inactive)<br>3. `ConfigurationCard` (Target FPS sweep slider: 48–540Hz, LFC mode toggle, Tear Line toggle, Widget Embed button)<br>4. `ShortcutCard` (`F` Fullscreen, `S` Sweep, `L` LFC mode)<br>5. `InfoCard` (GPU V-Sync + G-Sync FPS cap guide & `<HardwareLimitationNotice />`) |
| `display-tests/oled-burn-in.astro` | 1. Header Deck<br>2. `<OledBurnInAnalyzer />` (Retention Canvas & Model)<br>3. Burn-In Prevention & Lifespan Article<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `ConfigurationCard` (Daily static UI hours slider, peak nits input, panel tech selector: WOLED / QD-OLED / AMOLED)<br>2. `MetricCard` (Sub-pixel decay score %, estimated years to burn-in)<br>3. `StatusCard` (Panel Health Rating: Low / Moderate / High Risk)<br>4. `InfoCard` (OLED care best practices: taskbar auto-hide, pixel shift) |
| `display-tests/hdr-test.astro` | 1. Header & Epilepsy Notice<br>2. `<HdrClippingTester />` (10-bit PQ Gradient & Window Canvas)<br>3. SMPTE ST.2084 PQ EOTF Article<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `ConfigurationCard` (Target Peak Nits: 400/600/1000/1400/4000, Tone Mapping mode: HGiG/Display/Hard Clip, Window size: 1%/5%/10%/100%)<br>2. `MetricCard` (PQ EOTF deviation, ABL roll-off drop %, clipping nit level)<br>3. `ShortcutCard` (`1-4` Window sizes, `H` HGiG toggle, `F` Fullscreen)<br>4. `InfoCard` (VESA DisplayHDR tier specifications & `<HardwareLimitationNotice />`) |
| `display-tests/ppi-calculator.astro` | 1. Header Deck<br>2. Interactive Form Inputs & Visual Acuity Bar<br>3. Arcminute Acuity & Ergonomics Article<br>4. Common Monitor Reference Table<br>5. Clean `<FAQSection />`<br>6. `<TestSwitcherBar />` | 1. `MetricCard` (PPI score, Pixel Pitch mm, Retina Distance cm, SMPTE 30° Distance, THX 40° Distance)<br>2. `StatusCard` (Visual Acuity Rating Badge: RETINA CLASS / PIXELS VISIBLE)<br>3. `ConfigurationCard` (Quick Pick Monitor Presets dropdown)<br>4. `InfoCard` (macOS fractional scaling & 110 vs 220 PPI guide) |
| `display-tests/color-gamut.astro` | 1. Header Deck<br>2. CIE 1931 Chromaticity Diagram Canvas<br>3. Color Space Coordinates Reference Table<br>4. CIE 1931 Math Article<br>5. Clean `<FAQSection />`<br>6. `<TestSwitcherBar />` | 1. `ConfigurationCard` (Panel Gamut Preset: sRGB/DCI-P3/Adobe RGB/Rec.2020, Gamma: 2.0/2.2/2.4)<br>2. `MetricCard` (sRGB %, DCI-P3 %, Adobe RGB %, Rec.2020 % progress bars)<br>3. `PassportCard` ("Export ICC Profile (.icc)" button & "Copy Share URL" button)<br>4. `InfoCard` (CIE 1931 D65 white point explanation) |
| `display-tests/return-window-checker/[slug].astro` | 1. Header Deck<br>2. Panel Spec Scorecard & RMA Advice<br>3. AdSense Slot<br>4. Clean `<FAQSection />`<br>5. `<TestSwitcherBar />` | 1. `StatusCard` (ISO 9241-307 Class Rating Badge: Class 0 / Class I / Class II)<br>2. `MetricCard` (Native Resolution, PPI, Display Tech, Max Allowed RMA Dead Pixels)<br>3. `PassportCard` ("GENERATE HARDWARE PASSPORT" trigger button & modal launcher)<br>4. `InfoCard` (14-30 Day Retailer Return Rights & Checklist) |

---

## 5. Verification Method

To independently verify the recommendations in this handoff report:

1. **Grid Layout Verification**:
   Inspect converted `.astro` page files for `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">`, with `<main class="lg:col-span-8 space-y-6">` and `<aside class="lg:col-span-4 space-y-6 sticky top-24">`.
2. **UI/UX Pro Max 5 Rules Verification**:
   - Run `grep -rn "hover:scale" src/pages/` to confirm zero `scale-105` or `scale-[1.02]` hover effects remain.
   - Run `grep -rn "📖" src/pages/` and `grep -rn "🔬" src/pages/` to confirm zero emoji icons remain in HTML elements.
   - Inspect SVG icons for fixed `viewBox="0 0 24 24"` and `w-5 h-5` / `w-6 h-6` dimensions.
   - Inspect focus state classes on interactive elements (`focus:ring-2 focus:ring-status-pass`).
3. **Build & Type Check Commands**:
   - Execute TypeScript check: `Cwd: /Users/divyyadav/newws/monitor_test_hub` -> `npx tsc --noEmit`
   - Execute Vitest unit test suite: `Cwd: /Users/divyyadav/newws/monitor_test_hub` -> `TMPDIR=$PWD/.tmp npm test`
   - Execute Static Production Build: `Cwd: /Users/divyyadav/newws/monitor_test_hub` -> `TMPDIR=$PWD/.tmp npm run build`
