# Handoff Report: High-Refresh Input Lag & Reflex Reaction Sniper (Milestone 4) - Route & SEO Architecture

## 1. Observation
From direct inspection of the `monitor_test_hub` codebase:

1. **i18n & Dynamic Route Conventions**:
   - M1-M3 follow a two-tier dynamic routing pattern in Astro:
     - Root routes: `src/pages/<test-slug>/[param1]/[param2].astro` for the default `en` locale.
     - Localized routes: `src/pages/[locale]/<test-slug>/[param1]/[param2].astro` for `es`, `de`, `fr` locales.
   - Example from M3 (`src/pages/[locale]/vrr-stutter-test/[gpuVendor]/[refreshRate].astro` lines 4-20):
     ```typescript
     export function getStaticPaths() {
       const locales = ['es', 'de', 'fr'];
       const vendors = getAllGpuVendors();
       const rates = getAllRefreshRates();

       return locales.flatMap((locale) =>
         vendors.flatMap((gpuVendor) =>
           rates.map((refreshRate) => ({
             params: { locale, gpuVendor, refreshRate }
           }))
         )
       );
     }
     import BasePage from '../../../vrr-stutter-test/[gpuVendor]/[refreshRate].astro';
     ```

2. **SEO & Schema Infrastructure**:
   - `SEOHead.astro` (`src/components/seo/SEOHead.astro`, lines 12-26) computes `hreflangs` dynamically for `['en', 'es', 'de', 'fr']` and `x-default`, injecting `<title>`, `<meta description>`, OpenGraph, Twitter, and canonical links.
   - `SchemaGraph.astro` (`src/components/seo/SchemaGraph.astro`, lines 9-44) builds a JSON-LD `@graph` containing `WebApplication` and `TechArticle` types.

3. **Input Lag Diagnostic Artifacts**:
   - Legacy standalone touch input lag test exists at `src/pages/touch-tests/input-lag.astro` (lines 51-68), utilizing dropdown select elements for refresh rate (`60`, `120`, `144`, `240`, `360`, `540`) and polling rate (`125`, `500`, `1000`, `2000`, `8000`).
   - Legacy arcade reflex sniper game exists at `src/pages/arcade/lag-reflex-sniper.astro`.

---

## 2. Logic Chain

1. **Route Architecture Design**:
   - M4 requires a dedicated, SEO-optimized suite for High-Refresh Input Lag & Reflex Reaction Sniper.
   - Route path specification:
     - **Hub Page (Default Locale `en`)**: `/input-lag-test/` (`src/pages/input-lag-test/index.astro`)
     - **Hub Page (Localized `es`, `de`, `fr`)**: `/[locale]/input-lag-test/` (`src/pages/[locale]/input-lag-test/index.astro`)
     - **Matrix Route (Default Locale `en`)**: `/input-lag-test/[refreshRate]/[pollingRate]` (`src/pages/input-lag-test/[refreshRate]/[pollingRate].astro`)
     - **Matrix Route (Localized `es`, `de`, `fr`)**: `/[locale]/input-lag-test/[refreshRate]/[pollingRate]` (`src/pages/[locale]/input-lag-test/[refreshRate]/[pollingRate].astro`)

2. **Parameter Set & Combinations**:
   - **Refresh Rates (5)**: `60hz`, `144hz`, `240hz`, `360hz`, `540hz`
   - **Polling Rates (5)**: `125hz`, `500hz`, `1000hz`, `4000hz`, `8000hz`
   - Total combination static paths per locale = 5 × 5 = 25 paths.
   - Total paths generated across root (`en`) and localized (`es`, `de`, `fr`) = 25 (en) + 75 (es/de/fr) = 100 matrix combination pages + 4 hub pages = 104 static pages.

3. **SEO Title & Description Templates**:
   - **Hub Page Title**: `High-Refresh Input Lag & Reflex Reaction Sniper Test`
   - **Hub Page Description**: `Measure sub-millisecond click-to-render display input lag and mouse polling rate latency. Test 60Hz to 540Hz gaming monitors with 125Hz to 8000Hz polling rates.`
   - **Matrix Page Title Template**: `{refreshRateHz}Hz Monitor + {pollingRateHz}Hz Mouse Input Lag & Latency Test`
     - *Example*: `240Hz Monitor + 1000Hz Mouse Input Lag & Latency Test | Monitor Test Hub`
   - **Matrix Page Meta Description Template**:
     `Input lag, click latency, and frame delay audit for a {refreshRateHz}Hz display ({framePeriodMs}ms frame period) with a {pollingRateHz}Hz mouse ({pollPeriodMs}ms polling interval). Evaluates display vs polling rate bottlenecks and sub-millisecond reflex reaction times.`

4. **JSON-LD Schema Architecture (`WebApplication` + `TechArticle`)**:
   - Every dynamic page renders structured JSON-LD data for search engine rich results.
   - `WebApplication`: Identifies the client-side latency diagnostic app with feature lists, browser requirements, and schema categories.
   - `TechArticle`: Provides technical article metadata regarding frame intervals, HID polling periods, and reflex reaction chronometry.

---

## 3. Caveats

1. **Hardware Jitter & Browser Timer Precision**:
   - Standard browser `performance.now()` precision is capped or jittered (~5–10µs depending on Spectre/Meltdown isolation settings).
   - High polling rates (4000Hz and 8000Hz) require modern browsers supporting `PointerEvents` with coalesced event polling (`getCoalescedEvents()`).
2. **Dynamic Route Param Formatting**:
   - Route parameters in file names use camelCase (`[refreshRate]/[pollingRate].astro`), while values passed in `params` are slugified strings (`240hz`, `1000hz`).

---

## 4. Conclusion & Technical Recommendation

### A. Parameter Engine Specification (`src/engine/InputLagEngine.ts`)

```typescript
export type RefreshRateParam = '60hz' | '144hz' | '240hz' | '360hz' | '540hz';
export type PollingRateParam = '125hz' | '500hz' | '1000hz' | '4000hz' | '8000hz';

export const REFRESH_RATE_CONFIG: Record<RefreshRateParam, { hz: number; label: string; framePeriodMs: number }> = {
  '60hz': { hz: 60, label: '60 Hz Standard', framePeriodMs: 16.67 },
  '144hz': { hz: 144, label: '144 Hz Gaming', framePeriodMs: 6.94 },
  '240hz': { hz: 240, label: '240 Hz Esports', framePeriodMs: 4.17 },
  '360hz': { hz: 360, label: '360 Hz Pro', framePeriodMs: 2.78 },
  '540hz': { hz: 540, label: '540 Hz Ultra-Fast', framePeriodMs: 1.85 }
};

export const POLLING_RATE_CONFIG: Record<PollingRateParam, { hz: number; label: string; pollPeriodMs: number }> = {
  '125hz': { hz: 125, label: '125 Hz Standard', pollPeriodMs: 8.00 },
  '500hz': { hz: 500, label: '500 Hz High-Speed', pollPeriodMs: 2.00 },
  '1000hz': { hz: 1000, label: '1000 Hz Gaming', pollPeriodMs: 1.00 },
  '4000hz': { hz: 4000, label: '4000 Hz Hyper-Polling', pollPeriodMs: 0.25 },
  '8000hz': { hz: 8000, label: '8000 Hz Ultra-Polling', pollPeriodMs: 0.125 }
};

export function getAllRefreshRates(): RefreshRateParam[] {
  return ['60hz', '144hz', '240hz', '360hz', '540hz'];
}

export function getAllPollingRates(): PollingRateParam[] {
  return ['125hz', '500hz', '1000hz', '4000hz', '8000hz'];
}

export function sanitizeRefreshRate(param: string | undefined): RefreshRateParam {
  if (param && param.toLowerCase() in REFRESH_RATE_CONFIG) {
    return param.toLowerCase() as RefreshRateParam;
  }
  return '240hz';
}

export function sanitizePollingRate(param: string | undefined): PollingRateParam {
  if (param && param.toLowerCase() in POLLING_RATE_CONFIG) {
    return param.toLowerCase() as PollingRateParam;
  }
  return '1000hz';
}
```

---

### B. Static Path Files Specification

#### 1. Root Dynamic Route: `src/pages/input-lag-test/[refreshRate]/[pollingRate].astro`
```astro
---
import Layout from '../../../layouts/Layout.astro';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.astro';
import LagReflexSniper from '../../../components/arcade/LagReflexSniper.astro';
import HardwareLimitationNotice from '../../../components/disclaimers/HardwareLimitationNotice.astro';
import {
  getAllRefreshRates,
  getAllPollingRates,
  sanitizeRefreshRate,
  sanitizePollingRate,
  REFRESH_RATE_CONFIG,
  POLLING_RATE_CONFIG
} from '../../../engine/InputLagEngine';

export async function getStaticPaths() {
  const refreshRates = getAllRefreshRates();
  const pollingRates = getAllPollingRates();

  return refreshRates.flatMap((refreshRate) =>
    pollingRates.map((pollingRate) => ({
      params: { refreshRate, pollingRate }
    }))
  );
}

const { refreshRate: rawRefresh, pollingRate: rawPolling } = Astro.params;
const refreshRate = sanitizeRefreshRate(rawRefresh);
const pollingRate = sanitizePollingRate(rawPolling);

const refreshInfo = REFRESH_RATE_CONFIG[refreshRate];
const pollingInfo = POLLING_RATE_CONFIG[pollingRate];

const pageTitle = `${refreshInfo.hz}Hz Monitor + ${pollingInfo.hz}Hz Mouse Input Lag & Latency Test`;
const metaDescription = `Input lag, click latency, and frame delay audit for a ${refreshInfo.hz}Hz display (${refreshInfo.framePeriodMs}ms frame period) with a ${pollingInfo.hz}Hz mouse (${pollingInfo.pollPeriodMs}ms polling interval). Evaluates display vs polling rate bottlenecks and sub-millisecond reflex reaction times.`;
const canonicalUrl = `${Astro.url.origin}/input-lag-test/${refreshRate}/${pollingRate}`;

const isDisplayBottleneck = refreshInfo.framePeriodMs > pollingInfo.pollPeriodMs;
const bottleneckLabel = isDisplayBottleneck ? 'DISPLAY REFRESH RATE' : 'MOUSE POLLING RATE';

// JSON-LD Structured Data Schema Graph
const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#webapp`,
      "name": pageTitle,
      "url": canonicalUrl,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All (Windows, macOS, Linux, ChromeOS, Android, iOS)",
      "browserRequirements": "Requires HTML5 high-resolution performance.now() timer, PointerEvents, and WebGL/Canvas frame sync",
      "featureList": [
        `Sub-millisecond click latency measurement for ${refreshInfo.hz}Hz refresh rate`,
        `Mouse polling latency calculation for ${pollingInfo.hz}Hz polling rate`,
        "Reflex reaction sniper target trigger with visual latency indicator",
        "Reaction time histogram with standard deviation & variance metrics"
      ],
      "about": [
        { "@type": "Thing", "name": "Input Lag", "sameAs": "https://en.wikipedia.org/wiki/Input_lag" },
        { "@type": "Thing", "name": "Refresh Rate", "sameAs": "https://en.wikipedia.org/wiki/Refresh_rate" },
        { "@type": "Thing", "name": "Mouse Polling Rate", "sameAs": "https://en.wikipedia.org/wiki/Computer_mouse#Polling_rate" }
      ]
    },
    {
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      "headline": pageTitle,
      "description": metaDescription,
      "inLanguage": "en",
      "mainEntityOfPage": canonicalUrl,
      "dependencies": "HTML5 performance.now(), requestAnimationFrame, PointerEvents",
      "about": [
        { "@type": "Thing", "name": "Click-to-Photon Latency", "sameAs": "https://en.wikipedia.org/wiki/Input_lag" },
        { "@type": "Thing", "name": "Reflex Reaction Time", "sameAs": "https://en.wikipedia.org/wiki/Mental_chronometry" }
      ],
      "medicalAudience": {
        "@type": "MedicalAudience",
        "audienceType": "None - Non-Medical Hardware Diagnostic Tool"
      }
    }
  ]
};
---

<Layout title={pageTitle} description={metaDescription}>
  <script type="application/ld+json" set:html={JSON.stringify(schemaGraph)} />

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <Breadcrumbs items={[
      { label: 'Input Lag Diagnostics', href: '/input-lag-test' },
      { label: `${refreshInfo.hz}Hz Monitor` },
      { label: `${pollingInfo.hz}Hz Mouse` }
    ]} />

    <!-- Page Header Deck -->
    <header class="space-y-3 border-b border-border-hairline pb-6">
      <div class="flex items-center gap-2 text-status-pass text-xs font-mono font-bold uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-status-pass led-glow-pass"></span>
        HIGH-REFRESH LATENCY & REFLX BENCHMARK
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-mono">
        {refreshInfo.hz}Hz Display + {pollingInfo.hz}Hz Mouse Input Lag Test
      </h1>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        Sub-millisecond click-to-render response analysis for <strong class="text-text-primary">{refreshInfo.hz} Hz</strong> displays paired with <strong class="text-text-primary">{pollingInfo.hz} Hz</strong> mouse polling rates. Evaluates latency bottlenecks and frame cycle delays.
      </p>
    </header>

    <!-- Key Metrics Highlight Deck -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">TARGET REFRESH RATE</span>
        <span class="text-sm font-bold text-status-pass block">{refreshInfo.hz} Hz</span>
        <span class="text-[10px] text-text-secondary mt-1 block">{refreshInfo.framePeriodMs} ms frame interval</span>
      </div>

      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">MOUSE POLLING RATE</span>
        <span class="text-sm font-bold text-text-primary block">{pollingInfo.hz} Hz</span>
        <span class="text-[10px] text-text-secondary mt-1 block">{pollingInfo.pollPeriodMs} ms polling interval</span>
      </div>

      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">THEORETICAL MIN DELAY</span>
        <span class="text-sm font-bold text-text-primary block">{(refreshInfo.framePeriodMs + pollingInfo.pollPeriodMs).toFixed(2)} ms</span>
        <span class="text-[10px] text-text-secondary mt-1 block">Frame + Poll Interval</span>
      </div>

      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">PRIMARY BOTTLENECK</span>
        <span class="text-sm font-bold text-status-warn block">{bottleneckLabel}</span>
        <span class="text-[10px] text-text-secondary mt-1 block">Dominant Latency Source</span>
      </div>
    </div>

    <!-- Diagnostic Interactive Component -->
    <section aria-label="Input Lag & Reflex Reaction Sniper Diagnostic Test">
      <LagReflexSniper initialRefreshRate={refreshInfo.hz} initialPollingRate={pollingInfo.hz} />
    </section>

    <!-- Cross-Navigation Matrix Selection Deck -->
    <section class="bg-bg-surface border border-border-hairline rounded-xl p-6 space-y-6 font-mono">
      <h2 class="text-base font-bold text-text-primary uppercase tracking-wider border-b border-border-hairline pb-3">
        Cross-Navigation Matrix: {refreshInfo.hz}Hz + {pollingInfo.hz}Hz
      </h2>

      <!-- Target Refresh Rate Options for current Polling Rate -->
      <div class="space-y-3">
        <span class="text-xs font-bold text-text-muted uppercase tracking-wider block">Compare Refresh Rates (at {pollingInfo.hz}Hz Polling):</span>
        <div class="flex flex-wrap gap-2 text-xs">
          {getAllRefreshRates().map((r) => (
            <a
              href={`/input-lag-test/${r}/${pollingRate}`}
              class:list={[
                "px-3 py-1.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-status-pass",
                r === refreshRate
                  ? "bg-status-pass/20 border-status-pass text-status-pass font-bold"
                  : "bg-bg-canvas border-border-hairline text-text-secondary hover:text-text-primary"
              ]}
            >
              {REFRESH_RATE_CONFIG[r].hz} Hz
            </a>
          ))}
        </div>
      </div>

      <!-- Target Polling Rate Options for current Refresh Rate -->
      <div class="pt-4 border-t border-border-hairline space-y-3">
        <span class="text-xs font-bold text-text-muted uppercase tracking-wider block">Compare Polling Rates (at {refreshInfo.hz}Hz Display):</span>
        <div class="flex flex-wrap gap-2 text-xs">
          {getAllPollingRates().map((p) => (
            <a
              href={`/input-lag-test/${refreshRate}/${p}`}
              class:list={[
                "px-3 py-1.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-status-pass",
                p === pollingRate
                  ? "bg-status-pass/20 border-status-pass text-status-pass font-bold"
                  : "bg-bg-canvas border-border-hairline text-text-secondary hover:text-text-primary"
              ]}
            >
              {POLLING_RATE_CONFIG[p].hz} Hz
            </a>
          ))}
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto">
      <HardwareLimitationNotice />
    </div>
  </main>
</Layout>
```

#### 2. Localized Dynamic Route: `src/pages/[locale]/input-lag-test/[refreshRate]/[pollingRate].astro`
```astro
---
import { getAllRefreshRates, getAllPollingRates } from '../../../../engine/InputLagEngine';

export function getStaticPaths() {
  const locales = ['es', 'de', 'fr'];
  const refreshRates = getAllRefreshRates();
  const pollingRates = getAllPollingRates();

  return locales.flatMap((locale) =>
    refreshRates.flatMap((refreshRate) =>
      pollingRates.map((pollingRate) => ({
        params: {
          locale,
          refreshRate,
          pollingRate
        }
      }))
    )
  );
}

import BasePage from '../../../input-lag-test/[refreshRate]/[pollingRate].astro';
---

<BasePage />
```

#### 3. Root Hub Page: `src/pages/input-lag-test/index.astro`
```astro
---
import Layout from '../../layouts/Layout.astro';
import Breadcrumbs from '../../components/ui/Breadcrumbs.astro';
import LagReflexSniper from '../../components/arcade/LagReflexSniper.astro';
import HardwareLimitationNotice from '../../components/disclaimers/HardwareLimitationNotice.astro';
import { getAllRefreshRates, getAllPollingRates, REFRESH_RATE_CONFIG, POLLING_RATE_CONFIG } from '../../engine/InputLagEngine';

const pageTitle = "High-Refresh Input Lag & Reflex Reaction Sniper Test";
const metaDescription = "Measure sub-millisecond click-to-render display input lag and mouse polling rate latency. Test 60Hz to 540Hz gaming monitors with 125Hz to 8000Hz polling rates.";
---

<Layout title={pageTitle} description={metaDescription}>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <Breadcrumbs items={[
      { label: 'Arcade Suite', href: '/arcade' },
      { label: 'Input Lag & Reaction Sniper' }
    ]} />

    <header class="space-y-3 border-b border-border-hairline pb-6">
      <div class="flex items-center gap-2 text-status-pass text-xs font-mono font-bold uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-status-pass led-glow-pass"></span>
        PRECISION LATENCY BENCHMARK
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-mono">
        Input Lag & Reflex Reaction Sniper
      </h1>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        Select display refresh rates (60Hz–540Hz) and mouse polling rates (125Hz–8000Hz) to benchmark click-to-photon latency, visual target reaction times, and system input bottlenecks.
      </p>
    </header>

    <section aria-label="Input Lag Test Component">
      <LagReflexSniper />
    </section>

    <!-- Matrix Selector Table / Preset Links Grid -->
    <section class="bg-bg-surface border border-border-hairline rounded-xl p-6 space-y-6 font-mono">
      <h2 class="text-base font-bold text-text-primary uppercase tracking-wider border-b border-border-hairline pb-3">
        Hardware Profile Combinations (Refresh Rate x Polling Rate)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
        {getAllRefreshRates().map((r) => (
          <div class="bg-bg-canvas border border-border-hairline rounded-lg p-3 space-y-2">
            <span class="font-bold text-status-pass block">{REFRESH_RATE_CONFIG[r].hz} Hz Display</span>
            <div class="space-y-1">
              {getAllPollingRates().map((p) => (
                <a
                  href={`/input-lag-test/${r}/${p}`}
                  class="block px-2 py-1 rounded bg-bg-surface border border-border-hairline hover:border-status-pass text-text-secondary hover:text-text-primary transition-colors text-[11px]"
                >
                  + {POLLING_RATE_CONFIG[p].hz} Hz Mouse
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <div class="max-w-4xl mx-auto">
      <HardwareLimitationNotice />
    </div>
  </main>
</Layout>
```

#### 4. Localized Hub Page: `src/pages/[locale]/input-lag-test/index.astro`
```astro
---
export function getStaticPaths() {
  return [
    { params: { locale: 'es' } },
    { params: { locale: 'de' } },
    { params: { locale: 'fr' } }
  ];
}

import BasePage from '../../input-lag-test/index.astro';
---

<BasePage />
```

---

## 5. Verification Method

1. **Astro Static Path Verification**:
   Execute standard build test:
   ```bash
   npm run build
   ```
   Confirm that all 104 paths build successfully without dynamic parameter mismatches or missing module imports:
   - Root Hub: `/input-lag-test/`
   - Localized Hubs: `/es/input-lag-test/`, `/de/input-lag-test/`, `/fr/input-lag-test/`
   - 25 Root Combinations: `/input-lag-test/60hz/125hz/`, `/input-lag-test/240hz/1000hz/`, `/input-lag-test/540hz/8000hz/`, etc.
   - 75 Localized Combinations: `/es/input-lag-test/240hz/1000hz/`, `/de/input-lag-test/540hz/8000hz/`, etc.

2. **Schema & Meta Verification**:
   Inspect generated HTML files in `dist/input-lag-test/240hz/1000hz/index.html` to confirm:
   - `<title>` matches `240Hz Monitor + 1000Hz Mouse Input Lag & Latency Test | Monitor Test Hub`
   - `<script type="application/ld+json">` contains valid `@graph` array with `WebApplication` and `TechArticle` objects.
   - `<link rel="alternate" hreflang="...">` tags exist for `en`, `es`, `de`, `fr`, and `x-default`.

3. **Invalidation Conditions**:
   - Any broken URL generated by cross-navigation links.
   - Missing locale routes in `dist/`.
   - Invalid JSON syntax in generated `<script type="application/ld+json">`.
