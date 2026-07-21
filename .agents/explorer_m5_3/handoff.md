# Handoff Report: Dynamic Route Patterns, SEO & Schema Graph Design for HDR Peak Brightness & Tone Mapping Test (Milestone 5)

## 1. Observation

### Codebase Architecture & Dynamic Route Patterns
Through read-only exploration of `monitor_test_hub/src/pages/` and `src/pages/[locale]/`, the dynamic routing and internationalization (i18n) model follows a strict hierarchy:

1. **Unprefixed English Routes (`src/pages/`)**:
   - Primary dynamic pages reside in `src/pages/[feature]/[param1]/[param2].astro`.
   - Examples observed:
     - `src/pages/input-lag-test/[refreshRate]/[pollingRate].astro` (lines 16–25: `getStaticPaths()` returns `params: { refreshRate, pollingRate }`).
     - `src/pages/vrr-stutter-test/[gpuVendor]/[refreshRate].astro` (lines 17–26: `getStaticPaths()` returns `params: { gpuVendor, refreshRate }`).
     - `src/pages/oled-burn-in-risk/[panelType]/[usageTier].astro`.
     - `src/pages/touch-matrix/[deviceType]/[gridDensity].astro`.
   - Existing HDR test page: `src/pages/display-tests/hdr-test.astro` currently acts as a single-page diagnostic. For Milestone 5, dedicated routes `/hdr-test/index.astro` and `/hdr-test/[peakNits]/[toneMapping].astro` will establish deep SEO dynamic routing.

2. **Localized Prefix Routes (`src/pages/[locale]/`)**:
   - Non-default locales (`es`, `de`, `fr`) mirror root routes in `src/pages/[locale]/[feature]/[param1]/[param2].astro`.
   - Observed pattern in `src/pages/[locale]/input-lag-test/[refreshRate]/[pollingRate].astro` (lines 4–25):
     ```ts
     export function getStaticPaths() {
       const locales = ['es', 'de', 'fr'];
       const refreshRates = getAllRefreshRates();
       const pollingRates = getAllPollingRates();

       return locales.flatMap((locale) =>
         refreshRates.flatMap((refreshRate) =>
           pollingRates.map((pollingRate) => ({
             params: { locale, refreshRate, pollingRate }
           }))
         )
       );
     }
     import BasePage from '../../../input-lag-test/[refreshRate]/[pollingRate].astro';
     ```
     This delegation reuses the primary page template without duplicating markup.

3. **SEO Infrastructure (`SEOHead.astro`, `SchemaGraph.astro`, `Layout.astro`)**:
   - `src/components/seo/SEOHead.astro`:
     - Computes `cleanBasePath` by stripping locale prefixes (`en`, `es`, `de`, `fr`).
     - Generates `hreflang` alternate links for `en` (`https://monitortesthub.com${basePath}`), `es`, `de`, `fr`, and `x-default`.
     - Renders OpenGraph (`og:title`, `og:description`, `og:url`, `og:type`) and Twitter Card tags.
     - Calls `<SchemaGraph title={title} description={description} canonicalUrl={canonicalUrl} />`.
   - `src/components/seo/SchemaGraph.astro`:
     - Renders `@context: "https://schema.org"` with `@graph` containing `WebApplication` (`@id`: `${canonicalUrl}#webapp`) and `TechArticle` (`@id`: `${canonicalUrl}#article`).
   - Standard Dynamic Page Pattern: Dynamic pages override/enhance the base schema by embedding custom `<script type="application/ld+json" set:html={JSON.stringify(schemaGraph)} />` into the layout, incorporating metric-specific `featureList`, `about`, `operatingSystem`, and `browserRequirements`.

---

## 2. Logic Chain

1. **Parameter Combinations**:
   - `peakNits` values: `400`, `600`, `1000`, `1400`, `2000`, `4000` (6 values).
   - `toneMapping` values: `hgig`, `static`, `dynamic`, `clip` (4 values).
   - Total combinations per locale = 6 × 4 = 24 dynamic pages.
   - Across 4 supported locales (`en`, `es`, `de`, `fr`) = 96 static page instances generated at build time via `getStaticPaths()`.

2. **Technical Parameter Mapping & Sanitization**:
   - **`peakNits` Target Tiers**:
     - `400`: DisplayHDR 400 (Entry LCD/IPS baseline, 400 nits peak).
     - `600`: DisplayHDR 600 / True Black 600 (Mid-tier HDR OLED & IPS Pro, 600 nits peak).
     - `1000`: DisplayHDR 1000 / True Black 1000 (High-end Mini-LED & Gaming OLED, 1,000 nits peak).
     - `1400`: DisplayHDR 1400 (Ultra High-End QD-OLED & Mini-LED, 1,400 nits peak).
     - `2000`: Extreme Brightness HDR (Mastering Monitors & Next-Gen Mini-LED, 2,000 nits peak).
     - `4000`: Mastering Reference HDR (P3 / Rec.2020 Mastering Standard, 4,000 nits peak).
   - **`toneMapping` Modes**:
     - `hgig`: HGiG (HDR Gaming Interest Group — Hard clip at display peak nits with 0 display-side curve modification).
     - `static`: Static Roll-off (Fixed EOTF knee curve scaling inputs to display peak luminance).
     - `dynamic`: Dynamic Tone Mapping (Real-time active frame luminance scaling & adaptive EOTF fitting).
     - `clip`: Hard Clipping (Direct Signal Truncation above threshold, blowing out highlight detail).

3. **SEO Metadata Strategy**:
   - Title and description templates must include target `peakNits` and `toneMapping` mode names to capture long-tail technical search queries (e.g., *"1000 nits HGiG tone mapping test"*, *"OLED 1400 nits dynamic tone mapping clipping"*).
   - Breadcrumb schema must reflect the diagnostic hierarchy: Home → Display Suite → HDR Diagnostics → {peakNits} Nits → {toneMappingUpper}.

4. **Schema Graph Strategy**:
   - Dual JSON-LD entity graph (`WebApplication` + `TechArticle`) ensures search engine understanding of both the interactive browser tool and technical DisplayHDR calibration guidance.
   - Includes accurate `about` entity links to Wikipedia entries for High-Dynamic-Range Video, Tone Mapping, Perceptual Quantizer (ST.2084), and DisplayHDR specifications.

---

## 3. Caveats

- **Browser HDR Canvas Constraints**: Browsers (Chrome/Edge/Safari) enforce canvas color space limits depending on OS HDR toggles. Visual patterns evaluate tone mapping behavior via 10-bit PQ step gradients, ABL window simulations (1%–100%), and clipping indicators.
- **Param Fallbacks**: Accessing invalid URL parameters (e.g. `/hdr-test/999/unknown`) must sanitize values gracefully via helper functions to fall back to `1000` nits and `hgig` tone mapping without runtime throws.
- **Hreflang Consistency**: The base URL structure must strictly align with `SEOHead.astro` hreflang generator rules (`/hdr-test/[peakNits]/[toneMapping]` for EN, `/[locale]/hdr-test/[peakNits]/[toneMapping]` for ES/DE/FR).

---

## 4. Conclusion & Detailed Recommendations

### A. Engine Helper Module Design (`src/engine/HdrToneMappingEngine.ts`)

```ts
export type PeakNits = '400' | '600' | '1000' | '1400' | '2000' | '4000';
export type ToneMappingMode = 'hgig' | 'static' | 'dynamic' | 'clip';

export interface IPeakNitsConfig {
  nits: number;
  label: string;
  displayHdrTier: string;
  typicalPanel: string;
  recommendedAblWindow: string;
}

export interface IToneMappingConfig {
  id: ToneMappingMode;
  label: string;
  shortName: string;
  description: string;
  eotfBehavior: string;
}

export const PEAK_NITS_CONFIG: Record<PeakNits, IPeakNitsConfig> = {
  '400': { nits: 400, label: '400 Nits', displayHdrTier: 'DisplayHDR 400', typicalPanel: 'Entry LCD / IPS', recommendedAblWindow: '100% Full Screen' },
  '600': { nits: 600, label: '600 Nits', displayHdrTier: 'DisplayHDR 600 / True Black 600', typicalPanel: 'Mid-Tier OLED / IPS Pro', recommendedAblWindow: '10% Window' },
  '1000': { nits: 1000, label: '1000 Nits', displayHdrTier: 'DisplayHDR 1000', typicalPanel: 'Mini-LED / Gaming OLED', recommendedAblWindow: '5% - 10% Window' },
  '1400': { nits: 1400, label: '1400 Nits', displayHdrTier: 'DisplayHDR 1400', typicalPanel: 'QD-OLED / High-Peak Mini-LED', recommendedAblWindow: '2% - 5% Window' },
  '2000': { nits: 2000, label: '2000 Nits', displayHdrTier: 'DisplayHDR 2000 / Mastering', typicalPanel: 'Next-Gen Mini-LED / Dual-Layer LCD', recommendedAblWindow: '1% - 2% Window' },
  '4000': { nits: 4000, label: '4000 Nits', displayHdrTier: 'Mastering Reference (P3/Rec.2020)', typicalPanel: 'Reference Mastering Monitor', recommendedAblWindow: '1% Window' }
};

export const TONE_MAPPING_CONFIG: Record<ToneMappingMode, IToneMappingConfig> = {
  hgig: {
    id: 'hgig',
    label: 'HGiG (HDR Gaming Interest Group)',
    shortName: 'HGiG',
    description: 'Direct console/game tone mapping with strict hard clipping at display peak luminance.',
    eotfBehavior: 'Linear PQ tracking up to clip point; zero display roll-off curve.'
  },
  static: {
    id: 'static',
    label: 'Static EOTF Roll-Off',
    shortName: 'Static Roll-Off',
    description: 'Fixed knee curve compressing highlight details into display peak capabilities.',
    eotfBehavior: 'Smooth static S-curve roll-off starting at 60% PQ threshold.'
  },
  dynamic: {
    id: 'dynamic',
    label: 'Dynamic Tone Mapping (DTM)',
    shortName: 'Dynamic DTM',
    description: 'Real-time frame metadata analysis actively compressing highlight ranges.',
    eotfBehavior: 'Adaptive frame-by-frame EOTF knee curve transformation.'
  },
  clip: {
    id: 'clip',
    label: 'Hard Truncation Clipping',
    shortName: 'Hard Clipping',
    description: 'Direct signal clipping above peak nits threshold without compression curve.',
    eotfBehavior: 'Immediate flatline ceiling at target peak nits.'
  }
};

export function getAllPeakNits(): PeakNits[] {
  return ['400', '600', '1000', '1400', '2000', '4000'];
}

export function getAllToneMappings(): ToneMappingMode[] {
  return ['hgig', 'static', 'dynamic', 'clip'];
}

export function sanitizePeakNits(raw: string | undefined): PeakNits {
  if (raw && (getAllPeakNits() as string[]).includes(raw)) {
    return raw as PeakNits;
  }
  return '1000';
}

export function sanitizeToneMapping(raw: string | undefined): ToneMappingMode {
  if (raw && (getAllToneMappings() as string[]).includes(raw)) {
    return raw as ToneMappingMode;
  }
  return 'hgig';
}
```

---

### B. Unprefixed Dynamic Route (`src/pages/hdr-test/[peakNits]/[toneMapping].astro`)

```astro
---
import Layout from '../../../layouts/Layout.astro';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.astro';
import HardwareLimitationNotice from '../../../components/disclaimers/HardwareLimitationNotice.astro';
import EpilepsyWarning from '../../../components/disclaimers/EpilepsyWarning.astro';
import {
  getAllPeakNits,
  getAllToneMappings,
  sanitizePeakNits,
  sanitizeToneMapping,
  PEAK_NITS_CONFIG,
  TONE_MAPPING_CONFIG
} from '../../../engine/HdrToneMappingEngine';

export async function getStaticPaths() {
  const nitsList = getAllPeakNits();
  const mappingList = getAllToneMappings();

  return nitsList.flatMap((peakNits) =>
    mappingList.map((toneMapping) => ({
      params: { peakNits, toneMapping }
    }))
  );
}

const { peakNits: rawNits, toneMapping: rawMapping } = Astro.params;

const peakNitsKey = sanitizePeakNits(rawNits);
const toneMappingKey = sanitizeToneMapping(rawMapping);

const nitsInfo = PEAK_NITS_CONFIG[peakNitsKey];
const toneInfo = TONE_MAPPING_CONFIG[toneMappingKey];

const pageTitle = `${nitsInfo.label} HDR ${toneInfo.shortName} Tone Mapping Test`;
const metaDescription = `HDR tone mapping, ABL luminance limits, and highlight clipping diagnostic for ${nitsInfo.label} display targets using ${toneInfo.label} mode (${toneInfo.description}). Benchmark 10-bit PQ EOTF step gradients and ABL window curves.`;

const canonicalUrl = `${Astro.url.origin}/hdr-test/${peakNitsKey}/${toneMappingKey}`;

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
      "operatingSystem": "All (Windows 11 HDR, macOS HDR, Linux Wayland HDR, ChromeOS)",
      "browserRequirements": "Requires HTML5 WebGL 2.0 / Canvas 2D with HDR10/PQ (Perceptual Quantizer) or wide-gamut support",
      "featureList": [
        `${nitsInfo.label} peak luminance step gradient evaluation`,
        `${toneInfo.shortName} tone mapping clipping threshold verification`,
        "ABL (Auto Brightness Limiter) window size test (1% to 100%)",
        "10-bit ST.2084 PQ EOTF tone curve calibration check"
      ],
      "about": [
        { "@type": "Thing", "name": "High-dynamic-range video", "sameAs": "https://en.wikipedia.org/wiki/High-dynamic-range_video" },
        { "@type": "Thing", "name": "Tone mapping", "sameAs": "https://en.wikipedia.org/wiki/Tone_mapping" },
        { "@type": "Thing", "name": "Perceptual quantizer", "sameAs": "https://en.wikipedia.org/wiki/Perceptual_quantizer" }
      ]
    },
    {
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      "headline": pageTitle,
      "description": metaDescription,
      "inLanguage": "en",
      "mainEntityOfPage": canonicalUrl,
      "dependencies": "HTML5 Canvas 2D / WebGL 2.0, HDR Color Space (rec2020 / display-p3)",
      "about": [
        { "@type": "Thing", "name": "DisplayHDR", "sameAs": "https://en.wikipedia.org/wiki/DisplayHDR" },
        { "@type": "Thing", "name": "HDR Gaming Interest Group", "sameAs": "https://en.wikipedia.org/wiki/HDR_Gaming_Interest_Group" }
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
      { label: 'Display Suite', href: '/display-tests' },
      { label: 'HDR Diagnostics', href: '/hdr-test' },
      { label: `${nitsInfo.nits} Nits` },
      { label: toneInfo.shortName }
    ]} />

    <header class="space-y-3 border-b border-border-hairline pb-6">
      <div class="flex items-center gap-2 text-status-pass text-xs font-mono font-bold uppercase tracking-wider">
        <span class="w-2.5 h-2.5 rounded-full bg-status-pass led-glow-pass"></span>
        VESA DISPLAYHDR &amp; TONE MAPPING BENCHMARK
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-mono">
        {nitsInfo.label} — {toneInfo.label}
      </h1>
      <p class="text-sm text-text-secondary max-w-3xl leading-relaxed">
        High dynamic range luminance clipping and EOTF tone curve evaluation targeting <strong class="text-text-primary">{nitsInfo.label}</strong> peak brightness operating under <strong class="text-text-primary">{toneInfo.shortName}</strong> mode.
      </p>
    </header>

    <!-- Highlight Metrics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">TARGET PEAK LUMINANCE</span>
        <span class="text-sm font-bold text-status-pass block">{nitsInfo.nits} Nits</span>
        <span class="text-[10px] text-text-secondary mt-1 block">{nitsInfo.displayHdrTier}</span>
      </div>

      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">TONE MAPPING MODE</span>
        <span class="text-sm font-bold text-text-primary block">{toneInfo.shortName}</span>
        <span class="text-[10px] text-text-secondary mt-1 block">EOTF Curve Active</span>
      </div>

      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">RECOMMENDED ABL WINDOW</span>
        <span class="text-sm font-bold text-text-primary block">{nitsInfo.recommendedAblWindow}</span>
        <span class="text-[10px] text-text-secondary mt-1 block">Peak Sustain Target</span>
      </div>

      <div class="bg-bg-surface border border-border-hairline rounded-lg p-4 shadow-specular-top">
        <span class="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">TYPICAL PANEL TARGET</span>
        <span class="text-sm font-bold text-status-warn block truncate">{nitsInfo.typicalPanel}</span>
        <span class="text-[10px] text-text-secondary mt-1 block">Display Hardware</span>
      </div>
    </div>

    <!-- Dynamic Cross-Navigation Matrix Selection Deck -->
    <section class="bg-bg-surface border border-border-hairline rounded-xl p-6 space-y-6 font-mono">
      <h2 class="text-base font-bold text-text-primary uppercase tracking-wider border-b border-border-hairline pb-3">
        Cross-Navigation Matrix: {nitsInfo.label} + {toneInfo.shortName}
      </h2>

      <!-- Target Peak Nits Options for current Tone Mapping Mode -->
      <div class="space-y-3">
        <span class="text-xs font-bold text-text-muted uppercase tracking-wider block">Compare Peak Luminance (at {toneInfo.shortName} Mode):</span>
        <div class="flex flex-wrap gap-2 text-xs">
          {getAllPeakNits().map((n) => (
            <a
              href={`/hdr-test/${n}/${toneMappingKey}`}
              class:list={[
                "px-3 py-1.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-status-pass",
                n === peakNitsKey
                  ? "bg-status-pass/20 border-status-pass text-status-pass font-bold"
                  : "bg-bg-canvas border-border-hairline text-text-secondary hover:text-text-primary"
              ]}
            >
              {PEAK_NITS_CONFIG[n].nits} Nits
            </a>
          ))}
        </div>
      </div>

      <!-- Tone Mapping Options for current Peak Nits -->
      <div class="pt-4 border-t border-border-hairline space-y-3">
        <span class="text-xs font-bold text-text-muted uppercase tracking-wider block">Compare Tone Mapping Modes (at {nitsInfo.nits} Nits):</span>
        <div class="flex flex-wrap gap-2 text-xs">
          {getAllToneMappings().map((m) => (
            <a
              href={`/hdr-test/${peakNitsKey}/${m}`}
              class:list={[
                "px-3 py-1.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-status-pass",
                m === toneMappingKey
                  ? "bg-status-pass/20 border-status-pass text-status-pass font-bold"
                  : "bg-bg-canvas border-border-hairline text-text-secondary hover:text-text-primary"
              ]}
            >
              {TONE_MAPPING_CONFIG[m].shortName}
            </a>
          ))}
        </div>
      </div>
    </section>

    <div class="space-y-4 max-w-4xl mx-auto">
      <EpilepsyWarning />
      <HardwareLimitationNotice />
    </div>
  </main>
</Layout>
```

---

### C. Localized Dynamic Route (`src/pages/[locale]/hdr-test/[peakNits]/[toneMapping].astro`)

```astro
---
import { getAllPeakNits, getAllToneMappings } from '../../../../engine/HdrToneMappingEngine';

export function getStaticPaths() {
  const locales = ['es', 'de', 'fr'];
  const nitsList = getAllPeakNits();
  const mappingList = getAllToneMappings();

  return locales.flatMap((locale) =>
    nitsList.flatMap((peakNits) =>
      mappingList.map((toneMapping) => ({
        params: {
          locale,
          peakNits,
          toneMapping
        }
      }))
    )
  );
}

import BasePage from '../../../hdr-test/[peakNits]/[toneMapping].astro';
---

<BasePage />
```

---

### D. Root Index Page Structure (`src/pages/hdr-test/index.astro` and `src/pages/[locale]/hdr-test/index.astro`)

- **Root index route (`src/pages/hdr-test/index.astro`)**:
  - Acts as the main hub listing all 24 dynamic preset cards categorized by DisplayHDR tier (`400`, `600`, `1000`, `1400`, `2000`, `4000`) and Tone Mapping modes (`HGiG`, `Static`, `Dynamic`, `Clip`).
  - Embeds the main interactive HDR canvas diagnostic component.
- **Localized index route (`src/pages/[locale]/hdr-test/index.astro`)**:
  ```astro
  ---
  export function getStaticPaths() {
    return [
      { params: { locale: 'es' } },
      { params: { locale: 'de' } },
      { params: { locale: 'fr' } }
    ];
  }

  import BasePage from '../../hdr-test/index.astro';
  ---

  <BasePage />
  ```

---

## 5. Verification Method

To independently verify the implementation:

1. **Static Route Build Generation**:
   Run the production build inside `monitor_test_hub/`:
   ```bash
   npm run build
   ```
   Inspect `./dist/hdr-test/` and `./dist/[locale]/hdr-test/` to verify that all 96 dynamic pages (24 for EN + 24 for ES, DE, FR each) are emitted as static HTML.

2. **Vitest Engine Unit Test Verification**:
   Execute Vitest unit tests:
   ```bash
   npx vitest run src/engine/HdrToneMappingEngine.test.ts
   ```
   Ensure helper functions (`getAllPeakNits()`, `getAllToneMappings()`, `sanitizePeakNits()`, `sanitizeToneMapping()`) pass tests with 100% coverage.

3. **SEO HTML & Schema Inspection**:
   Inspect generated `dist/hdr-test/1000/hgig/index.html` to confirm:
   - `<title>` matches `1000 Nits HDR HGiG Tone Mapping Test | Monitor Test Hub`
   - Canonical link equals `https://monitortesthub.com/hdr-test/1000/hgig`
   - `<script type="application/ld+json">` contains valid `@graph` array with both `WebApplication` and `TechArticle` entries.
   - Hreflang links point to `/hdr-test/1000/hgig`, `/es/hdr-test/1000/hgig`, `/de/hdr-test/1000/hgig`, and `/fr/hdr-test/1000/hgig`.
