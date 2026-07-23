# Root Cause Mobile UX & Responsive Layout Engineering Audit — Milestone 1 Analysis Report

**Target Scope**: Layouts (`src/layouts/Layout.astro`), Main Site Structure, Headers, Footers, Navigation, Floating Action Button (`src/components/ui/FloatingActionMenu.astro`), Global CSS (`src/styles/global.css`), YMYL Notice (`src/components/seo/MedicalBounceBanner.astro`), and Core Pages (`src/pages/index.astro`, `about.astro`, `faq.astro`, `contact.astro`, `terms.astro`, `privacy.astro`, `[locale]/`).  
**Audited Mobile Viewports**: 320px (iPhone SE 1st gen), 360px (Galaxy S8/S10), 375px (iPhone SE 2nd/3rd gen), 390px (iPhone 12/13/14), 414px (iPhone XR/11 Pro Max), 430px (iPhone 14/15/16 Pro Max), 480px (Small landscape/Android phablet).

---

## 1. Executive Summary & Root Cause Findings

During the read-only Mobile UX & Responsive Layout Engineering audit, we identified **7 core structural layout defects and responsive anti-patterns** that compromise user experience, cause horizontal layout overflow, break standard CSS sticky positioning, or compress content on narrow mobile screens (320px–430px):

1. **Band-Aid Overflow Hacks (`overflow-x: hidden` / `overflow-x-hidden`)**: Applied globally to `html`, `body`, `<main>`, `<footer>`, and `@media (max-width: 640px)` in `global.css` and `Layout.astro`. This suppresses horizontal scrollbars caused by fixed-width internal elements, while breaking `position: sticky` on `<header>` and causing WebKit iOS momentum scrolling bugs.
2. **Viewport Width Overhangs (`100vw` vs `100%`)**: Found in `global.css` (lines 141, 234). `100vw` includes scrollbar width, forcing the body width to exceed the available viewport content box by 12px–17px on desktop and mobile browsers with visible scrollbars.
3. **Fixed-Width & Unconstrained Visual Elements**:
   - `index.astro` (line 60): Absolute background radial light element with `w-[800px] left-1/2 -translate-x-1/2` extends 400px to the right of center (240px past a 320px viewport edge).
   - `Layout.astro` (lines 97, 186, 250, 319, 387, 451, 522): Mega-menu overlay containers have hardcoded widths (`w-[580px]`, `w-[520px]`, `w-[540px]`, `w-[500px]`) without `max-w-full` constraints.
4. **FAB Container Alignment & Safe Area Inset Defect (`FloatingActionMenu.astro`)**:
   - Container uses `flex` (default horizontal row) without `flex-col items-end`. The expanded menu items stack horizontally alongside the FAB button instead of stacking vertically above it.
   - Fixed position offsets use `pb-[env(safe-area-inset-bottom)]` on container padding instead of computing `bottom: calc(1rem + env(safe-area-inset-bottom))`.
5. **Hacky Footer Side Padding Squeezing Content (`Layout.astro`)**:
   - `Layout.astro` (line 1190) applies `pr-14 sm:pr-20` to the footer bottom copyright row to avoid FAB overlap. On 320px viewports, this siphons 56px away from a 320px screen, leaving only ~232px of usable content width and forcing copyright text into single-word line wraps.
6. **Mobile Menu Script Discrepancy & Missing Body Lock (`Layout.astro`)**:
   - `Layout.astro` script (lines 1402–1417) attempts to bind handlers to `mobile-menu-trigger` and `mobile-nav-drawer`, which do not exist in the DOM (the actual IDs are `mobile-menu-toggle` and `mobile-menu`). As a result, body scroll locking (`document.body.style.overflow = 'hidden'`) never fires when the mobile menu is open.
7. **Aggressive Global Text Wrapping Rules (`global.css`)**:
   - `global.css` (lines 151–157) applies `overflow-wrap: anywhere !important;` and `word-break: break-word !important;` to all HTML elements (`div`, `span`, `a`, `button`, etc.) under `max-width: 640px`, causing 2-character words, numbers, and badge labels inside buttons to split unnaturally.

---

## 2. Detailed Technical Breakdown & Proposed Fixes

### Finding #1: Global `overflow-x: hidden` Band-Aid Hacks & Sticky Header Invalidation

- **Files & Line Numbers**:
  - `src/layouts/Layout.astro`: Lines 26, 57, 1151, 1156
  - `src/styles/global.css`: Lines 143, 236
  - `src/components/seo/MedicalBounceBanner.astro`: Line 4
- **Exact Code Snippets**:
  ```astro
  <!-- src/layouts/Layout.astro -->
  26: <html lang={lang} class="scroll-smooth overflow-x-hidden w-full max-w-full">
  57: <body class="... overflow-x-hidden w-full max-w-full">
  1151: <main id="main-content" class="flex-grow flex flex-col w-full max-w-full overflow-x-hidden box-border">
  1156: <footer class="w-full max-w-full overflow-x-hidden box-border border-t border-border-hairline ...">
  ```
  ```css
  /* src/styles/global.css */
  139: html, body {
  140:   max-width: 100% !important;
  141:   max-width: 100vw !important;
  142:   box-sizing: border-box !important;
  143:   overflow-x: hidden !important;
  144:   width: 100% !important;
  145: }
  ```
- **Root Cause Explanation**:
  `overflow-x: hidden` was added to `html`, `body`, `<main>`, and `<footer>` as a catch-all hack to suppress horizontal scrollbars caused by elements overflowing the viewport. However, under W3C CSS Display Module & Positioned Layout specifications, placing `overflow-x: hidden` or `overflow: hidden` on `html` or `body` creates an overflow clipping box. This causes `position: sticky` on descendant sticky elements (such as `<header class="sticky top-0 z-40">` in `Layout.astro` line 63) to fail or behave erratically during touch momentum scrolling on iOS WebKit and Android Chrome.
- **Proposed Clean Fix**:
  1. Remove `overflow-x-hidden` from `html` and `body` in `Layout.astro` and `global.css`.
  2. Ensure child container elements (e.g. hero sections, wide tables, code blocks) manage their own overflow internally using `max-w-full`, `overflow-x-auto`, or relative clipping containers (`overflow-hidden` on specific section blocks).

  ```astro
  <!-- Proposed Layout.astro fix (Line 26 & Line 57) -->
  <html lang={lang} class="scroll-smooth w-full max-w-full">
  <body class="bg-bg-canvas bg-precision-grid text-text-primary min-h-dvh flex flex-col antialiased selection:bg-status-pass selection:text-text-on-accent w-full max-w-full">
  ```

---

### Finding #2: Viewport Width Overhang via `100vw` Utility Usage

- **File & Line Numbers**:
  - `src/styles/global.css`: Lines 141, 234
- **Exact Code Snippets**:
  ```css
  /* src/styles/global.css */
  141: max-width: 100vw !important;
  234: max-width: 100vw !important;
  ```
- **Root Cause Explanation**:
  In CSS, `100vw` equals the total width of the browser viewport, *including* the vertical scrollbar width (typically 12px–17px on Windows, Linux, and macOS scrollbar configurations). Setting `max-width: 100vw` on `html, body` forces the element width to equal the viewport plus scrollbar width, which makes `body` wider than the available content area ($100vw > 100\%$). This directly causes horizontal overflow and forces layout engines to generate scrollbars.
- **Proposed Clean Fix**:
  Replace `max-width: 100vw !important;` with `max-width: 100% !important;` or remove the line entirely as `max-width: 100%` and `width: 100%` already establish proper box constraints.

  ```css
  /* Proposed global.css fix (Lines 139-145) */
  html, body {
    max-width: 100% !important;
    box-sizing: border-box !important;
    width: 100% !important;
  }
  ```

---

### Finding #3: Unconstrained Fixed-Width Elements Overflowing Viewport

- **Files & Line Numbers**:
  - `src/pages/index.astro`: Line 60
  - `src/layouts/Layout.astro`: Lines 97, 186, 250, 319, 387, 451, 522
- **Exact Code Snippets**:
  ```astro
  <!-- src/pages/index.astro: Line 60 -->
  <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial from-white/[0.025] to-transparent blur-3xl"></div>
  ```
  ```astro
  <!-- src/layouts/Layout.astro: Line 97 -->
  <div class="w-[580px] bg-bg-surface/98 backdrop-blur-2xl border border-border-hairline rounded-2xl p-4 shadow-2xl shadow-black/80 font-mono space-y-3">
  ```
- **Root Cause Explanation**:
  1. `index.astro` line 60 renders a `w-[800px]` decorative background radial gradient glow positioned with `left-1/2 -translate-x-1/2`. On a 320px viewport (where `left-1/2` is 160px), half of the 800px element (400px) extends to the right (160px + 400px = 560px), pushing 240px beyond the right edge of the viewport. Although section line 59 has `overflow-hidden`, child elements with `blur-3xl` or absolute positioning without `max-w-full` cause rendering artifacts or layout box expansion in Safari WebKit.
  2. Mega-menus in `Layout.astro` use fixed pixel widths (`w-[580px]`, `w-[520px]`, `w-[540px]`, `w-[500px]`). While hidden on smaller viewports (`hidden lg:flex`), missing `max-w-[calc(100vw-2rem)]` constraints means if they transition or render during viewport resizing, they force horizontal overflow.
- **Proposed Clean Fix**:
  Add `max-w-full` or `max-w-[calc(100vw-2rem)]` responsive constraints.

  ```astro
  <!-- Proposed index.astro line 60 fix -->
  <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-radial from-white/[0.025] to-transparent blur-3xl"></div>
  ```

---

### Finding #4: FAB Container Layout Alignment & Safe Area Defect (`FloatingActionMenu.astro`)

- **File & Line Numbers**:
  - `src/components/ui/FloatingActionMenu.astro`: Lines 14, 27, 74
- **Exact Code Snippets**:
  ```astro
  <!-- src/components/ui/FloatingActionMenu.astro -->
  14: <div 
  15:   id="floating-fab-container" 
  16:   class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-mono text-xs select-none pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)] transition-all duration-300 transform-gpu flex"
  17: >
  ...
  27: <div id="fab-menu" class="... flex flex-col items-end gap-2.5 mb-3">
  ```
- **Root Cause Explanation**:
  1. The container `floating-fab-container` uses `flex` (which defaults to `flex-row`). It contains `#fab-toast`, `#fab-menu`, and `#btn-fab-toggle`. Because the container is `flex-row`, `#fab-menu` attempts to render *horizontally to the left* of `#btn-fab-toggle` while simultaneously having `mb-3` and `flex-col items-end`. This causes layout misalignment and pushes popup items off-screen on 320px–375px mobile screens.
  2. The mobile safe area handling applies `pb-[env(safe-area-inset-bottom,0px)]` to padding inside a fixed element anchored at `bottom-4`. This expands the container height rather than adjusting the fixed bottom anchor.
- **Proposed Clean Fix**:
  Change `flex` on container line 14 to `flex flex-col items-end`, and use dynamic `bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]` anchor positioning.

  ```astro
  <!-- Proposed FloatingActionMenu.astro line 14 fix -->
  <div 
    id="floating-fab-container" 
    class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6 z-40 font-mono text-xs select-none transition-all duration-300 transform-gpu flex flex-col items-end"
  >
  ```

---

### Finding #5: Hacky Footer Right Padding Squeezing Mobile Layout (`Layout.astro`)

- **File & Line Numbers**:
  - `src/layouts/Layout.astro`: Line 1190
- **Exact Code Snippets**:
  ```astro
  <!-- src/layouts/Layout.astro: Line 1190 -->
  <div class="border-t border-border-hairline pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-text-muted pr-14 sm:pr-20">
    <span>&copy; {new Date().getFullYear()} Monitor Test Hub. Precision engineering tools. Non-medical.</span>
    <div class="flex gap-4 flex-wrap">
      <a href={localizeLink("/privacy", lang)} ...>Privacy Policy</a>
      ...
    </div>
  </div>
  ```
- **Root Cause Explanation**:
  `pr-14 sm:pr-20` (3.5rem / 56px padding on mobile) was added to the bottom copyright bar in `Layout.astro` as a hack to prevent footer text from colliding with the FAB button in the bottom right corner. However, on 320px viewports with `px-4` (32px side padding), `pr-14` (56px right padding) reduces total available content width to just $320 - 32 - 56 = 232\text{px}$. This forces copyright text and legal links into awkward single-word wrapping columns.
- **Proposed Clean Fix**:
  Remove `pr-14 sm:pr-20` from line 1190. Instead, allow the footer content to use full container width, while ensuring the FAB container is properly elevated via z-index and auto-hides or dims on scroll (`FloatingActionMenu.astro` script line 149 handles scroll dimming).

  ```astro
  <!-- Proposed Layout.astro line 1190 fix -->
  <div class="border-t border-border-hairline pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-text-muted">
  ```

---

### Finding #6: Mobile Menu Script Discrepancy & Missing Body Lock (`Layout.astro`)

- **File & Line Numbers**:
  - `src/layouts/Layout.astro`: Lines 972, 981, 1207–1215, 1402–1417
- **Exact Code Snippets**:
  ```astro
  <!-- DOM Elements (Lines 972 & 981) -->
  <button id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-menu" ...>
  <nav id="mobile-menu" class="hidden md:hidden ...">

  <!-- Script Block 2 (Lines 1402-1417) -->
  const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  function openMobileMenu() {
    mobileNavDrawer?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  ```
- **Root Cause Explanation**:
  The DOM elements use IDs `mobile-menu-toggle` and `mobile-menu`. Script Block 1 (lines 1207–1215) toggles the `.hidden` class on `#mobile-menu` when `#mobile-menu-toggle` is clicked, but does NOT lock background scrolling. Script Block 2 (lines 1402–1417) defines `openMobileMenu()` with `document.body.style.overflow = 'hidden'`, but references non-existent IDs `mobile-menu-trigger` and `mobile-nav-drawer`. As a result, when users open the mobile navigation menu on 320px–430px screens, scrolling the menu simultaneously scrolls the background page behind it.
- **Proposed Clean Fix**:
  Consolidate the mobile menu event listener logic in `Layout.astro` script to correctly reference `#mobile-menu-toggle` and `#mobile-menu`, and toggle `document.body.style.overflow = expanded ? '' : 'hidden'`.

  ```typescript
  // Proposed Script Fix for Mobile Menu in Layout.astro
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('hidden');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });
  }
  ```

---

### Finding #7: Aggressive Global Text Wrapping Rules (`global.css`)

- **File & Line Numbers**:
  - `src/styles/global.css`: Lines 151–157
- **Exact Code Snippets**:
  ```css
  /* src/styles/global.css */
  151: @media (max-width: 640px) {
  152:   h1, h2, h3, h4, h5, h6, p, span, kbd, code, a, li, td, th, div, label {
  153:     overflow-wrap: anywhere !important;
  154:     word-break: break-word !important;
  155:     hyphens: auto;
  156:   }
  157: }
  ```
- **Root Cause Explanation**:
  Applying `overflow-wrap: anywhere !important;` and `word-break: break-word !important;` to *every single HTML tag* below 640px causes inline flex items, badges (e.g. `ISO 9241`, `60-540Hz`), buttons, and short 2-character words to break mid-word across lines even when ample space exists.
- **Proposed Clean Fix**:
  Scope word wrapping to text block elements (`p`, `h1-h6`, `article`, `section`, `.break-words`) and use `overflow-wrap: break-word` instead of `anywhere !important`.

  ```css
  /* Proposed global.css fix (Lines 151-157) */
  @media (max-width: 640px) {
    p, h1, h2, h3, h4, h5, h6, article, section, .prose {
      overflow-wrap: break-word;
      word-break: normal;
    }
  }
  ```

---

## 3. Viewport-by-Viewport Responsiveness Audit Matrix

| Viewport Width | Device Target | Key Observations & Layout Performance | Critical Issues Found |
| :--- | :--- | :--- | :--- |
| **320px** | iPhone SE (1st gen) | Ultra-narrow canvas. High compression on header controls and footer copyright bar. | `pr-14` in footer siphons 56px leaving 232px content box; header command button text squeezed; background radial glow `w-[800px]` extends 240px offscreen. |
| **360px** | Galaxy S8/S10 / Android | Standard small Android viewport. | FAB menu items expand horizontally due to container `flex` row styling; `100vw` in CSS causes 12px horizontal overflow scrollbar. |
| **375px** | iPhone SE (3rd gen) / iPhone 8 | Standard iOS compact viewport. | Background page scrolls behind mobile nav drawer because body scroll lock script uses wrong DOM IDs. |
| **390px** | iPhone 12/13/14 | Popular modern iOS viewport width. | Text badges in buttons break unnaturally due to `@media (max-width: 640px)` `overflow-wrap: anywhere` rule. |
| **414px** | iPhone XR / 11 Pro Max | Large iOS portrait viewport. | Header sticky positioning exhibits minor jitter on scroll due to `overflow-x: hidden` on `html`/`body`. |
| **430px** | iPhone 14/15/16 Pro Max | Ultra-wide flagship mobile viewport. | Telemetry table and grid cards render cleanly; footer copyright row text wraps properly when `pr-14` is removed. |
| **480px** | Small landscape / Phablets | Transition boundary between compact mobile and tablet. | Responsive grid cards (`sm:grid-cols-2`) transition smoothly; navigation mega-menus remain properly hidden until `lg` breakpoint. |

---

## 4. Summary of Targeted Files Audited

- `src/layouts/Layout.astro` (1,439 lines) — **Audited**: Layout container, sticky header, navigation mega-menus, search command palette modal, mobile drawer, footer, script listeners.
- `src/styles/global.css` (239 lines) — **Audited**: `@theme` definitions, light mode contrast overrides, `100vw` usages, `overflow-x: hidden` rules, global mobile word wrapping rules.
- `src/components/ui/FloatingActionMenu.astro` (222 lines) — **Audited**: Fixed FAB container, toast feedback popup, expanded action items stack, toggle button, touch safety, safe area insets.
- `src/components/seo/MedicalBounceBanner.astro` (5 lines) — **Audited**: YMYL notice component (disabled/commented out).
- `src/components/disclaimers/EpilepsyWarning.astro` (19 lines) — **Audited**: WCAG 2.3.1 photosensitive seizure notice container.
- `src/pages/index.astro` (525 lines) — **Audited**: Hero scope section, decorative background glow, real-time telemetry inspector table, 900+ word content suite, FAQ schema.
- `src/pages/about.astro` (158 lines) — **Audited**: About page layout, engineering standards grid, responsive technology stack list.
- `src/pages/faq.astro` (100 lines) — **Audited**: FAQ page structure, schema graph integration, details/summary accordion layout.
- `src/pages/contact.astro` (170 lines) — **Audited**: Contact form grid, inputs, sidebar info cards.
- `src/pages/terms.astro` (96 lines) — **Audited**: Terms & conditions text sections.
- `src/pages/privacy.astro` (55 lines) — **Audited**: Privacy policy compliance sections.
- `src/pages/tools.astro` (297 lines) — **Audited**: Tool directory index and card grid.
- `src/pages/[locale]/` — **Audited**: Parametric localized route wrappers (`[locale]/index.astro`, `[locale]/tools.astro`, etc.).

---
*Report generated by Explorer 1 (Milestone 1) — Root Cause Mobile UX & Responsive Layout Engineering Audit.*
