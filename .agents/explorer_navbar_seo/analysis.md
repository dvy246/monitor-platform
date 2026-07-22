# Comprehensive Audit Report: Navbar Mega-Menu, pSEO Route Families, FAQ Architecture & Schema/Metadata Compliance

**Target Application**: `/Users/divyyadav/newws/monitor_test_hub`  
**Agent**: Explorer (`explorer_navbar_seo`)  
**Date**: July 22, 2026  
**Status**: Read-Only Investigation & Strategy Formulation Complete  

---

## Executive Summary

This comprehensive audit evaluates the **Navbar Mega-menu (Task 2)**, **8 pSEO Route Families & Hub Pages (Task 2)**, **FAQ Architecture & Component Refactoring (Task 3)**, and **Schema.org JSON-LD & Canonical Metadata Compliance (Task 3)** for `Monitor Test Hub` (`monitor_test_hub`).

All findings and proposed solutions strictly enforce **YMYL safety rules** (framing diagnostic tools around ISO 9241-307, VESA, and IEC display engineering standards with zero medical/health claims) and **US-centric specifications** (US English spelling, USD currency, US inches/feet units, and US standards like NEC 2026 and EIA utility rates).

---

## 1. Navbar Audit & Missing Category Hubs List

### 1.1 Current Navbar Architecture
The site navigation is defined in `src/layouts/Layout.astro`. It currently features:
- **Header Shell**: Sticky top navigation (`h-12 sm:h-14`) with blurred background (`bg-bg-canvas/90 backdrop-blur-xl`).
- **Logo Emblem**: Left-aligned `MONITOR/HUB` branding linking to home page.
- **4 Main Navigation Pillars**:
  1. **Diagnostics Suite Mega-Menu**: Dropdown overlay featuring *Display & Panel Diagnostics* and *Touch & Motion Diagnostics*.
  2. **Model Database Direct Link**: Single link to `/models`.
  3. **Peripherals & Tools Mega-Menu**: Dropdown overlay featuring *Keyboard & Mouse Diagnostics* and *Calculators & Compare*.
  4. **Learning Guides Mega-Menu**: Dropdown overlay featuring *Display Standards & Physics* and *Hardware Testing Guides*.
  5. **Arcade Games Link**: Direct link to `/arcade`.
- **Right Control Deck**: `⌘K` Search command palette trigger, Fullscreen mode button (`F`), Hardware Passport SHA-256 settings menu, desktop Language Selector (`EN`, `ES`, `DE`, `FR`), and Theme Slider (`DARK`/`LIGHT`).
- **Mobile Menu Drawer**: Slide-down menu (`#mobile-menu`) with language/theme quick switcher and simplified link groups.

---

### 1.2 Audit of 8 pSEO Route Families & Category Hub Pages

We conducted a complete inspection of all 8 pSEO route families across `src/pages/`:

| pSEO Route Family | Index / Hub Route | Child Slug Route Template | Hub Page Exists? | Hub Reachable from Navbar? | Internal Links to Slugs on Hub? | Status & Gap Rating |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **1. PC Bottleneck & FPS** | `/benchmarks/pc-bottleneck` | `/benchmarks/pc-bottleneck/[slug]` | ✅ Yes | ✅ Yes | ❌ **No (0 links)** | ⚠️ **LINKING GAP**: Hub renders tool, but has zero links to CPU × GPU slug pages. |
| **2. Appliance Energy Cost** | `/display-tests/electricity-cost` | `/display-tests/electricity-cost/[slug]` | ✅ Yes | ✅ Yes | ❌ **No (0 links)** | ⚠️ **LINKING GAP**: Hub renders tool, but has zero links to 50 US State slug pages. |
| **3. Wire Gauge & Voltage Drop**| `/benchmarks/wire-gauge-calculator` | `/benchmarks/wire-gauge-calculator/[slug]` | ✅ Yes | ✅ Yes | ❌ **No (0 links)** | ⚠️ **LINKING GAP**: Hub renders tool, but has zero links to circuit amperage slug pages. |
| **4. 3D Print Cost Estimator** | `/benchmarks/3d-print-cost` | `/benchmarks/3d-print-cost/[slug]` | ✅ Yes | ✅ Yes | ❌ **No (0 links)** | ⚠️ **LINKING GAP**: Hub renders tool, but has zero links to material density slug pages. |
| **5. TV Viewing Distance** | `/display-tests/tv-viewing-distance` | `/display-tests/tv-viewing-distance/[slug]` | ✅ Yes | ✅ Yes | ❌ **No (0 links)** | ⚠️ **LINKING GAP**: Hub renders tool, but has zero links to screen size slug pages. |
| **6. Keyboard Tester & Chatter** | `/keyboard-tester` | `/keyboard-tester/[slug]` & `switches/[slug]` | ✅ Yes | ✅ Yes | ❌ **No (0 links)** | ⚠️ **LINKING GAP**: Hub renders tool, but has zero links to 12 layout/use-case slug pages. |
| **7. Per-Model Telemetry DB** | `/models` | `/models/[slug]` | ✅ Yes | ✅ Yes | ✅ **Yes (Full Grid)** | 🟢 **PASS**: Fully browsable hub page linking to all 100+ device slug pages. |
| **8. Dead Pixel per-device** | `/display-tests/dead-pixel-test` | `/display-tests/dead-pixel-test/[slug]` | ❌ **MISSING** | ❌ **No** | ❌ **No (0 links)** | 🚨 **CRITICAL GAP**: Category hub page `/display-tests/dead-pixel-test` **DOES NOT EXIST (404)**. |

---

### 1.3 Critical Internal-Linking & Hub Gaps Identified

1. **Missing Category Hub Page (`/display-tests/dead-pixel-test`)**:
   - `src/pages/display-tests/dead-pixel-test/[slug].astro` generates static pSEO pages for 8+ flagship devices (MacBook Pro M3, Steam Deck OLED, iPhone 15 Pro Max, Nintendo Switch OLED, etc.).
   - However, there is **NO index page** at `src/pages/display-tests/dead-pixel-test/index.astro` or `src/pages/display-tests/dead-pixel-test.astro`. Visiting `/display-tests/dead-pixel-test` yields a `404 Not Found` error.
   - `src/pages/display-tests/dead-pixel.astro` also does not link to any device-specific dead pixel test pages.

2. **Orphaned Programmatic pSEO Slugs**:
   - For route families 1, 2, 3, 4, 5, 6, and 8, `getStaticPaths()` generates hundreds of high-value static HTML pages.
   - However, the parent category hub pages do **NOT** render an HTML index grid or directory links targeting those slugs. Search engine crawlers visiting the category hub pages cannot discover child pSEO pages through natural DOM link traversal.

3. **Navbar Menu Routing Disconnects**:
   - `/benchmarks/index.astro` exists, but is not linked anywhere in the mega-menu.
   - "120+ Switch Bounce Hub" in the mega-menu links to `/keyboard-tester/switches`, but `/keyboard-tester/switches/index.astro` needs complete cross-linking to switch models.
   - Mobile menu drawer (`#mobile-menu`) does not provide accordion sub-menus, omitting several calculator tool pages on mobile devices.

---

## 2. Proposed Mega-Menu Rebuild Structure & Diff Plan

To resolve all navigation disconnects and ensure 100% crawlability for all 8 pSEO route families, we propose restructuring `Layout.astro`'s navigation bar into **4 unified, accessible Mega-Menu Pillars**:

```text
Header Navigation Deck
├── 1. Visual & Panel Suite (Mega-Menu)
│   ├── Display Diagnostics Hub -> /display-tests
│   ├── Dead Pixel & Device Test Hub -> /display-tests/dead-pixel-test  [NEW HUB LINK]
│   ├── OLED Sub-Pixel & Fringing -> /display-tests/sub-pixel
│   ├── HDR ST 2084 PQ & ABL -> /display-tests/hdr-test
│   ├── 540Hz+ VRR Stutter Sweep -> /display-tests/vrr
│   ├── OLED 5% Gray Uniformity -> /display-tests/uniformity
│   ├── Color Gamut & ICC Profile Exporter -> /display-tests/color-gamut
│   └── White Screen & Fill Light Utility -> /white-screen
├── 2. Touch & Mobile Suite (Mega-Menu)
│   ├── Mobile Touch Suite Hub -> /touch-tests
│   ├── Touch Matrix Dead-Zone Grid -> /touch-tests/dead-zone
│   ├── Multi-Touch Point Counter -> /touch-tests/multi-touch
│   ├── Charger EMI Inspector -> /touch-matrix/charger-emi-inspector
│   ├── Sub-Pixel Vector Precision -> /touch-tests/vector-precision
│   └── Swipe Velocity Tracker -> /touch-tests/swipe-velocity
├── 3. Peripherals & Calculators (Mega-Menu)
│   ├── Benchmarks & Calculators Hub -> /benchmarks                     [NEW HUB LINK]
│   ├── Keyboard Diagnostic Suite -> /keyboard-tester
│   ├── Mechanical Switch Chatter -> /keyboard-tester/key-chatter-test
│   ├── 120+ Switch Bounce Directory -> /keyboard-tester/switches
│   ├── PC Bottleneck & FPS Estimator -> /benchmarks/pc-bottleneck
│   ├── Appliance Energy Cost -> /display-tests/electricity-cost
│   ├── TV & Projector Distance -> /display-tests/tv-viewing-distance
│   ├── NEC 2026 Wire Gauge Calculator -> /benchmarks/wire-gauge-calculator
│   └── 3D Print Filament Cost -> /benchmarks/3d-print-cost
└── 4. Hardware DB & Guides (Mega-Menu)
    ├── Verified Model Database -> /models
    ├── Display Comparison Matrix -> /compare
    ├── Engineering Knowledge Base -> /screen-test-meaning
    ├── Diagnostic Micro-Arcade -> /arcade
    ├── Frequently Asked Questions -> /faq
    └── About & Standards Compliance -> /about
```

---

## 3. FAQ Audit Findings

### 3.1 Central vs Tool-Specific FAQ Audit
- **Central FAQ Page (`src/pages/faq.astro`)**: Contains 14 general items structured using `{ q: string, a: string }`. It manually constructs a static `faqSchema` object and injects it into `<head>` while rendering an inline `<details>` HTML accordion list.
- **Tool-Specific Pages (25+ pages)**: Individual tool pages (e.g. `keyboard-tester/index.astro`, `keyboard-tester/[slug].astro`, `models/index.astro`, `compare/index.astro`, `display-tests/dead-pixel.astro`, etc.) define standalone `faqs` arrays using `{ question: string, answer: string }`.

### 3.2 Duplicate FAQ Questions Matrix

Our audit discovered verbatim and near-verbatim duplicate FAQ questions across pages:

| Duplicate Question Topic | Central `faq.astro` | Tool Page Location(s) | Impact / Conflict |
| :--- | :--- | :--- | :--- |
| **QD-OLED vs WOLED Subpixel Physics** | Q8 in `faq.astro` | `compare/index.astro` Q3, `display-tests/sub-pixel.astro` Q4 | Duplicated text across 3 separate schema graphs. |
| **ISO 9241-307 Defect Classes** | Q4 in `faq.astro` | `display-tests/dead-pixel.astro` Q1, `models/index.astro` Q5 | Duplicate definitions of Class I-IV RMA limits. |
| **N-Key Rollover (NKRO) & 6KRO** | Q14 in `faq.astro` | `keyboard-tester/index.astro` Q2, `keyboard-tester/[slug].astro` Q1 | Duplicate rollover protocol definitions. |
| **Switch Chatter & Debounce Timing** | Q13 in `faq.astro` | `keyboard-tester/index.astro` Q1, `keyboard-tester/switches/[slug].astro` Q1 | Duplicate 35ms chatter threshold explanations. |
| **OLED Burn-In Risk & Mitigation** | Q6 in `faq.astro` | `display-tests/oled-burn-in.astro` Q1, `compare/index.astro` Q2 | Duplicate subpixel degradation model explanations. |
| **VRR (G-Sync/FreeSync) Stutter** | Q7 in `faq.astro` | `display-tests/vrr.astro` Q1 | Duplicate rAF frame pacing descriptions. |

### 3.3 Key Architectural Deficiencies
1. **Inconsistent Data Formats**: Central `faq.astro` uses `{ q, a }` property names, while tool pages use `{ question, answer }`.
2. **Redundant Schema Injection**: `faq.astro` and `index.astro` manually render `<script type="application/ld+json">` tags containing `FAQPage` schema while `SEOHead` simultaneously invokes `SchemaGraph.astro`, creating duplicate schema nodes.
3. **No Reusable Component**: Every page duplicates HTML grid/accordion markup, increasing maintenance overhead and creating visual inconsistencies.

---

## 4. Refactored `FaqSchema.astro` Component Specification

To resolve all FAQ redundancies, schema duplication, and UI inconsistencies, we design a single parameterized Astro component: `src/components/seo/FaqSchema.astro`.

### 4.1 Interface Specification

```typescript
// src/components/seo/FaqSchema.astro
export interface FAQItem {
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
}

export interface Props {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
  renderSchema?: boolean; // Default true: injects valid FAQPage JSON-LD schema
  className?: string;
}
```

### 4.2 Implementation Blueprint & Features

```astro
---
import type { FAQItem } from './FaqSchema.astro';

export interface Props {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
  renderSchema?: boolean;
  className?: string;
}

const {
  faqs = [],
  title = "Frequently Asked Questions",
  subtitle = "Technical specifications, diagnostic standards, and calibration guidance.",
  renderSchema = true,
  className = ""
} = Astro.props;

// Normalize input format to support both {question, answer} and {q, a}
const normalizedFaqs = faqs.map(item => ({
  question: item.question || item.q || '',
  answer: item.answer || item.a || ''
})).filter(item => item.question && item.answer);

const canonicalUrl = Astro.url.href;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${canonicalUrl}#faq`,
  "mainEntity": normalizedFaqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};
---

{normalizedFaqs.length > 0 && (
  <section class={`bg-bg-surface/90 border border-border-hairline rounded-2xl p-6 sm:p-8 backdrop-blur-xl font-sans space-y-6 shadow-specular-top ${className}`}>
    {title && (
      <div class="border-b border-border-hairline pb-4">
        <h2 class="text-xl sm:text-2xl font-bold font-mono text-text-primary tracking-tight">{title}</h2>
        {subtitle && <p class="text-xs text-text-muted mt-1 font-sans leading-relaxed">{subtitle}</p>}
      </div>
    )}

    <div class="space-y-3">
      {normalizedFaqs.map((faq, index) => (
        <details class="group border border-border-hairline rounded-xl bg-bg-canvas overflow-hidden transition-all duration-200 hover:border-status-pass/40">
          <summary class="cursor-pointer py-3.5 px-4 font-mono font-bold text-text-primary flex items-center justify-between gap-3 select-none list-none hover:bg-bg-elevated/60 transition-colors">
            <span class="flex items-center gap-3">
              <span class="text-status-pass text-xs font-mono font-bold tracking-widest shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span class="text-xs sm:text-sm font-sans font-semibold text-text-primary">{faq.question}</span>
            </span>
            <svg class="w-4 h-4 shrink-0 text-text-muted group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="px-4 pb-4 pt-2 border-t border-border-hairline/60 bg-bg-elevated/30">
            <p class="text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>

    {renderSchema && (
      <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
    )}
  </section>
)}
```

---

## 5. Schema JSON-LD Audit Findings & Fixes Needed

### 5.1 Schema Over-Declaration & Entity Mismatches
1. **Generic `SchemaGraph.astro` Over-Inclusion**:
   - `SchemaGraph.astro` currently injects `["WebApplication", "SoftwareApplication"]` AND `TechArticle` on **every single page**.
   - On informational pages (`/about`, `/terms`, `/privacy`, `/faq`), declaring an interactive `WebApplication` schema causes validation warnings in Google Search Console because primary content is an informational document.
   - On `/models/[slug]`, the page primary entity should be `ItemPage` or `Product` hardware specification, not a generic `TechArticle`.
   - On `/guides/[slug].astro`, the primary entity should be `TechArticle` / `Article`.

### 5.2 Required Schema Refactoring Plan
- Update `SchemaGraph.astro` to support a `type` discriminator prop (`type: 'WebApplication' | 'TechArticle' | 'ItemPage' | 'Article' | 'WebPage'`).
- Ensure `WebApplication` schema is ONLY emitted on pages hosting interactive diagnostic engines.
- Ensure `BreadcrumbList` dynamically resolves all path segments with proper US English names.
- Ensure `MedicalAudience` non-medical disclaimer node is retained to guarantee **YMYL safety compliance**.

---

## 6. Canonical & URL Metadata Audit Findings

### 6.1 Domain & Protocol Consistency
- **Configured Site URL**: `https://monitortesthub.com`
- All hardcoded links and canonical references consistently use HTTPS and non-www domain (`https://monitortesthub.com`). Zero http:// or www. mismatches found.

### 6.2 Locale Canonical URL Bug
- In localized routes (`src/pages/[locale]/...`), `canonicalUrl` props must be self-referential to the localized URL (e.g. `https://monitortesthub.com/es/benchmarks/pc-bottleneck/i9-14900k-with-rtx-4090`).
- `SEOHead.astro` correctly generates `hreflang` tags for `en`, `es`, `de`, `fr`, and `x-default`.
- **Fix Needed**: Ensure `SEOHead.astro` strips trailing slashes for content subpaths (e.g. `/display-tests/dead-pixel`) while preserving trailing slashes for root paths (`/`, `/es/`, `/de/`, `/fr/`).

---

## 7. YMYL & US Audience Compliance Verification

All content, schema, and navigation items strictly adhere to project guidelines:
1. **YMYL Compliance**:
   - Display, sub-pixel, uniform, and audio diagnostics are framed as **engineering calibration standards** (ISO 9241-307, VESA DisplayHDR, IEC 62341-6-2).
   - Medical notice banner (`MedicalBounceBanner.astro`) ensures zero health/medical claims are made.
2. **US-Centric Tailoring**:
   - **Spelling**: Enforced US English across all copy ("color", "center", "optimize", "analyzing").
   - **Units**: Display diagonals in inches (`"`), viewing distances in feet (`ft`), conductor lengths in feet (`ft`).
   - **Standards**: NEC 2026 for electrical wire gauge, US EIA 2026 for state electricity rates, THX / SMPTE viewing angles, and USD ($) for pricing models.

---

## 8. Actionable Implementation Tasks for Task 2 & Task 3

The implementer agent should execute the following 6 implementation steps:

### Task 2: Navbar Mega-Menu & Category Hubs
1. **Create Missing Category Hub Page**:
   - Create `src/pages/display-tests/dead-pixel-test/index.astro` (and localized route `src/pages/[locale]/display-tests/dead-pixel-test/index.astro`) to serve as the device-specific dead pixel test category hub listing all target hardware models.
2. **Add Programmatic pSEO Link Grids to Category Hubs**:
   - Update `src/pages/benchmarks/pc-bottleneck.astro` to include an HTML directory grid linking to all CPU × GPU `[slug]` pages.
   - Update `src/pages/display-tests/electricity-cost.astro` to include a 50 US State link grid.
   - Update `src/pages/benchmarks/wire-gauge-calculator.astro` to link to circuit amperage `[slug]` pages.
   - Update `src/pages/benchmarks/3d-print-cost.astro` to link to material density `[slug]` pages.
   - Update `src/pages/display-tests/tv-viewing-distance.astro` to link to screen size `[slug]` pages.
   - Update `src/pages/keyboard-tester/index.astro` to link to all 12 layout/use-case `[slug]` pages.
3. **Rebuild `src/layouts/Layout.astro` Mega-Menu**:
   - Implement the 4-Pillar Mega-Menu structure detailing all tool categories and direct hub links.
   - Update mobile menu drawer (`#mobile-menu`) with full link parity.

### Task 3: FAQ Architecture & Schema/Metadata Refactoring
4. **Create `src/components/seo/FaqSchema.astro`**:
   - Implement the accessible, parameterized FAQ accordion component with built-in `FAQPage` JSON-LD generation.
5. **Refactor FAQ Pages & Tool Pages**:
   - Replace duplicate inline FAQ HTML grids across `faq.astro`, `keyboard-tester/index.astro`, `models/index.astro`, `compare/index.astro`, and tool pages with `<FaqSchema faqs={faqs} />`.
   - Remove redundant `<script type="application/ld+json">` manual tags.
6. **Refactor `SchemaGraph.astro` & `SEOHead.astro`**:
   - Parameterize page types in `SchemaGraph.astro` to prevent schema over-declaration.
   - Ensure clean canonical URL normalization across localized routes.
