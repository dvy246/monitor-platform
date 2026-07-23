# Viewport Overflow Elimination & Layout Wrapping Audit Report (R1)

**Target Project**: `/Users/divyyadav/newws/monitor_test_hub`  
**Target Mobile Viewports**: 320px to 430px (iPhone SE [320px], iPhone 15 Pro [393px], Small Android [360px-412px])  
**Investigator**: Explorer 1  
**Date**: 2026-07-22  

---

## 1. Executive Summary

A comprehensive, line-by-line static analysis of the `/Users/divyyadav/newws/monitor_test_hub/src` codebase was conducted to identify all layout overflow risks, missing container constraints, and unwrapped text elements on 320px–430px mobile viewports.

Key Finding:
While `html` and `body` in `src/styles/global.css` set `overflow-x: hidden !important`, several layout containers, tables, hardcoded fixed-width elements (`width="380"`, canvas dimensions, SHA-256 hashes), and text tags (`p`, `span`, `code`, `kbd`, `a`, `li`, `td`) lack explicit `max-w-full`, `overflow-x-hidden`, `min-w-0`, or `break-words` / `overflow-wrap: anywhere` protection. On mobile viewports between 320px and 430px (especially iPhone SE at 320px), these unconstrained elements force horizontal document overflow or clipping.

---

## 2. Detailed Category Analysis

### Category 1: Global CSS & Core Layout Infrastructure Enforcement
- **File**: `src/styles/global.css`
  - **Observation (Lines 139-142 & 228-232)**:
    ```css
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
    }
    ```
    - **Issue**: `max-width: 100vw` on mobile browsers (iOS WebKit / Android Chrome) can include scrollbar calculations or subpixel rendering bounds, causing horizontal document overflow. `max-width: 100%` (`max-w-full`) is safer and strictly enforces body container bounds.
  - **Observation (Lines 148-153)**:
    ```css
    @media (max-width: 640px) {
      h1, h2, h3 {
        word-break: break-word !important;
        overflow-wrap: anywhere !important;
      }
    }
    ```
    - **Issue**: Text wrapping protection is ONLY applied to `h1, h2, h3`. All other text elements (`h4, h5, h6, p, span, kbd, code, a, li, td, th, div, label, dt, dd`) on mobile viewports (<640px) are unprotected globally. Long technical model names, code strings, URLs, or SHA-256 hashes inside these tags break out of screen bounds.

- **File**: `src/layouts/Layout.astro`
  - **Observation (Line 67)**:
    ```html
    <header class="border-b border-border-hairline/80 bg-bg-canvas/90 backdrop-blur-xl sticky top-0 z-40 font-mono transform-gpu shadow-xl">
    ```
    - **Issue**: `<header>` lacks `w-full max-w-full overflow-x-hidden box-border` enforcement.
  - **Observation (Line 723)**:
    ```html
    <main id="main-content" class="flex-grow flex flex-col">
    ```
    - **Issue**: `<main>` container lacks `w-full max-w-full overflow-x-hidden box-border` enforcement.
  - **Observation (Line 728)**:
    ```html
    <footer class="border-t border-border-hairline bg-bg-canvas py-12 text-text-secondary text-xs font-mono">
    ```
    - **Issue**: `<footer>` container lacks `w-full max-w-full overflow-x-hidden box-border` enforcement.

---

### Category 2: Header & Top Notice Banner Sizing
- **File**: `src/components/seo/MedicalBounceBanner.astro`
  - **Observation (Line 4)**:
    ```html
    <div id="ymyl-routing-banner" role="region" aria-label="Medical Query Routing Notice" class="w-full max-w-full overflow-hidden bg-bg-elevated border-b border-border-hairline px-3 sm:px-4 py-2 text-xs text-text-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono tracking-tight z-30 relative shadow-specular-top box-border">
    ```
    - **Issue 1**: Uses `overflow-hidden` instead of `overflow-x-hidden`.
  - **Observation (Lines 5 & 10)**:
    ```html
    <div class="flex items-center gap-2 max-w-full">
      <span class="... shrink-0">SCOPE</span>
      <span class="text-text-primary font-sans text-xs break-words">Looking for Medical...</span>
    </div>
    ```
    - **Issue 2**: The flex container on Line 5 and the text span on Line 10 lack `min-w-0`. In CSS flexbox, flex children default to `min-width: auto`, causing the flex item to resist shrinking below its min-content size on 320px viewports.

---

### Category 3: Unwrapped SHA-256 Hashes, URLs & Long Text Elements
- **File**: `src/components/diagnostics/ModelTelemetryTable.astro`
  - **Observation (Line 136)**:
    ```html
    <a href={`/passport/${entry.signatureHash}`} class="font-bold text-status-pass text-xs">
      #{entry.signatureHash}
    </a>
    ```
    - **Root Cause & Impact**: In the mobile card view (`block md:hidden`), Line 136 renders the full 64-character SHA-256 hash string (`entry.signatureHash`) without `break-all`, `break-words`, `truncate`, or `.slice()`. In font-mono at 12px, a continuous 64-character string measures ~450px wide. On a 320px iPhone SE screen, this single link forces horizontal page overflow by over 130px (>0px document scrollbar)!

- **File**: `src/pages/passport/[hash].astro`
  - **Observation (Line 140)**:
    ```html
    <iframe src={`/embed/passport?hash=${hash}&score=98&res=3840x2160&fps=240`} width="380" height="110" class="rounded-xl border border-border-hairline shadow-lg" loading="lazy"></iframe>
    ```
    - **Root Cause & Impact**: The iframe has hardcoded `width="380"`. On a 320px mobile viewport (where padding leaves ~288px available width inside the container), an iframe with `width="380"` exceeds container bounds by 92px, forcing horizontal scrollbars. Missing `max-w-full`.

- **File**: `src/components/diagnostics/HardwarePassportModal.astro`
  - **Observation (Line 187)**:
    ```html
    <span id="contrib-hash-link" class="text-text-primary">a4f8b92c103e57f1</span>
    ```
    - **Issue**: Lacks `break-all` or `break-words` when full 64-character SHA-256 hashes are injected into `contribHashLink.textContent`.

- **File**: `src/pages/about.astro`
  - **Observation (Line 120)**:
    ```html
    <code class="font-mono text-status-pass bg-bg-canvas px-1 rounded">localStorage</code>
    ```
    - **Issue**: Missing `break-all` / `break-words`.

- **File**: `src/pages/display-tests/color-gamut.astro`
  - **Observation (Lines 219-223)**:
    Inline `<code>` tags (`IccExporter.ts`, `.icc`, `'acsp'`, `'rXYZ'`, `'gXYZ'`, `'bXYZ'`, `'rTRC'`, `'gTRC'`, `'bTRC'`) lack `break-words`.

- **File**: `src/pages/privacy.astro`
  - **Observation (Line 21)**:
    ```html
    <code class="font-mono text-status-pass bg-bg-canvas px-1 rounded">team@displaytestonline.com</code>
    ```
    - **Issue**: Missing `break-all` / `break-words`.

- **File**: `src/pages/touch-tests/input-lag.astro`
  - **Observation (Line 35)**:
    ```html
    <code class="font-mono text-status-pass bg-bg-canvas px-1 rounded">performance.now()</code>
    ```
    - **Issue**: Missing `break-all` / `break-words`.

---

### Category 4: Fixed Width Canvases & Table Overflow Hazards
- **File**: `src/components/diagnostics/GamepadDriftInspector.astro`
  - **Observation (Lines 26 & 45)**:
    ```html
    <canvas id="left-stick-canvas" width="280" height="280" class="border border-white/10 rounded-lg bg-[#0e0e11]"></canvas>
    <canvas id="right-stick-canvas" width="280" height="280" class="border border-white/10 rounded-lg bg-[#0e0e11]"></canvas>
    ```
    - **Root Cause & Impact**: Outer card padding `p-6` (24px left + 24px right = 48px) on 320px screens yields 272px outer width. Inner box padding `p-4` (16px left + 16px right = 32px) yields 240px available width. Fixed `width="280"` canvas elements exceed available width by 40px, causing horizontal overflow. Missing `max-w-full h-auto`.

- **File**: `src/pages/index.astro`
  - **Observation (Lines 110 & 119-149)**:
    ```html
    <div class="border border-border-hairline rounded-xl bg-bg-canvas overflow-hidden font-mono text-xs shadow-specular-top">
      <table class="w-full text-left border-collapse table-fixed" aria-label="Real-Time System Hardware Telemetry">
    ```
    - **Root Cause & Impact**: Table cells specify `min-w-[120px]` (line 132), `min-w-[80px]` (line 138), `min-w-[100px]` (line 144) along with column percentages and cell padding. On 320px screens, total required table width exceeds 320px. The outer wrapper `div` uses `overflow-hidden` instead of `overflow-x-auto`, causing content clipping or subpixel document overflow.

- **File**: `src/pages/compare/[slug].astro`
  - **Observation (Line 62)**:
    ```html
    <div class="overflow-x-auto bg-bg-surface border border-border-hairline rounded-2xl p-6 mb-8">
    ```
    - **Issue**: Heavy `p-6` padding on the `overflow-x-auto` wrapper shrinks available scroll space on 320px screens. Should use `p-4 sm:p-6`.

---

## 3. Comprehensive Summary Table of R1 Overflow Risks

| # | File Path | Line(s) | Element / Class | Identified Root Cause | Corrective Action |
|---|-----------|---------|-----------------|----------------------|-------------------|
| 1 | `src/styles/global.css` | 139-142, 228-232 | `html, body` | `max-width: 100vw !important` can exceed 100% on mobile browsers with scrollbars | Update to `max-width: 100% !important; max-width: 100vw !important; width: 100% !important; overflow-x: hidden !important; box-sizing: border-box;` |
| 2 | `src/styles/global.css` | 148-153 | `@media (max-width: 640px)` | Mobile text wrapping only covers `h1, h2, h3` | Expand `@media (max-width: 640px)` selector to include `h4, h5, h6, p, span, kbd, code, a, li, td, th, div, label, dt, dd` with `word-break: break-word !important; overflow-wrap: anywhere !important;` |
| 3 | `src/layouts/Layout.astro` | 67, 723, 728 | `<header>`, `<main>`, `<footer>` | Missing `w-full max-w-full overflow-x-hidden box-border` classes | Add `w-full max-w-full overflow-x-hidden box-border` to `<header>`, `<main>`, and `<footer>` containers |
| 4 | `src/components/seo/MedicalBounceBanner.astro` | 4, 5, 10 | `#ymyl-routing-banner`, inner flex divs | `overflow-hidden` instead of `overflow-x-hidden`; flex items lack `min-w-0` | Change to `overflow-x-hidden` and add `min-w-0` to flex child containers |
| 5 | `src/components/diagnostics/ModelTelemetryTable.astro` | 136 | Mobile SHA-256 link `#{entry.signatureHash}` | Continuous 64-character SHA-256 hash rendered without `truncate`, `break-all`, or `.slice()` (~450px wide) | Replace `#{entry.signatureHash}` with `#{entry.signatureHash.slice(0, 10)}...` or add `break-all truncate` |
| 6 | `src/components/diagnostics/GamepadDriftInspector.astro` | 26, 45 | `<canvas width="280" height="280">` | Hardcoded 280px canvas exceeds 240px available width inside padded cards on 320px viewports | Add `max-w-full h-auto` to canvas elements |
| 7 | `src/pages/passport/[hash].astro` | 140 | `<iframe width="380" height="110">` | Hardcoded `width="380"` exceeds 288px available container width on 320px mobile viewports | Add `max-w-full` class to `<iframe>` element |
| 8 | `src/components/diagnostics/HardwarePassportModal.astro` | 187 | `#contrib-hash-link` | Dynamic SHA-256 hash inserted into DOM lacks text wrapping | Add `break-all` or `break-words` class |
| 9 | `src/pages/index.astro` | 110, 119-149 | Telemetry Table Wrapper `div` & `<table>` | Outer `div` uses `overflow-hidden` instead of `overflow-x-auto` around minimum-width table columns | Change wrapper `div` to `overflow-x-auto` |
| 10 | `src/pages/about.astro` | 120 | `<code>localStorage</code>` | Code tag lacks word-break utility | Add `break-all` / `break-words` |
| 11 | `src/pages/display-tests/color-gamut.astro` | 219-223 | Inline `<code>` tags | Code tags lack word-break utilities | Add `break-words` |
| 12 | `src/pages/privacy.astro` | 21 | `<code>team@displaytestonline.com</code>` | Email code tag lacks word-break utility | Add `break-all` |
| 13 | `src/pages/touch-tests/input-lag.astro` | 35 | `<code>performance.now()</code>` | Function code tag lacks word-break utility | Add `break-all` |
| 14 | `src/pages/compare/[slug].astro` | 62 | Table wrapper `div` | Fixed `p-6` padding constrains mobile table scrolling area on 320px screens | Change `p-6` to `p-4 sm:p-6` |

---

## 4. Recommendations for Implementer Agent

1. **Global CSS Enforcement**:
   - In `src/styles/global.css`, update the `html, body` rule to:
     ```css
     html, body {
       max-width: 100% !important;
       max-width: 100vw !important;
       width: 100% !important;
       overflow-x: hidden !important;
       box-sizing: border-box;
     }
     ```
   - In `src/styles/global.css`, expand the `@media (max-width: 640px)` rule to:
     ```css
     @media (max-width: 640px) {
       h1, h2, h3, h4, h5, h6, p, span, kbd, code, a, li, td, th, div, label, dt, dd {
         word-break: break-word !important;
         overflow-wrap: anywhere !important;
       }
     }
     ```

2. **Layout Sizing & Banner Enforcement**:
   - In `src/layouts/Layout.astro`, add `w-full max-w-full overflow-x-hidden box-border` to `<header>`, `<main>`, and `<footer>`.
   - In `src/components/seo/MedicalBounceBanner.astro`, update Line 4 to use `overflow-x-hidden` and add `min-w-0` to flex child containers.

3. **Mobile SHA-256 Hash Truncation**:
   - In `src/components/diagnostics/ModelTelemetryTable.astro` (Line 136), replace `#{entry.signatureHash}` with `#{entry.signatureHash.slice(0, 10)}...` (or add `break-all truncate`).

4. **Hardcoded Sizing & Canvas Scaling**:
   - In `src/components/diagnostics/GamepadDriftInspector.astro` (Lines 26 & 45), add `max-w-full h-auto` to both `<canvas>` tags.
   - In `src/pages/passport/[hash].astro` (Line 140), add `max-w-full` to the `<iframe>`.

5. **Table Overflow Protection**:
   - In `src/pages/index.astro` (Line 110), update the telemetry table container to use `overflow-x-auto`.
   - In `src/pages/compare/[slug].astro` (Line 62), update container padding to `p-4 sm:p-6`.
