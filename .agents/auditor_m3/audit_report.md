# READ-ONLY PRE-DEPLOYMENT AUDIT REPORT — SEO, JSON-LD SCHEMA & SEARCH QUALITY RATER

**Audit Date**: 2026-07-22  
**Auditor**: AGENT 3 — SEO, JSON-LD Schema & Search Quality Rater Auditor  
**Target Repository**: `/Users/divyyadav/newws/monitor_test_hub`  
**Agent Workspace**: `/Users/divyyadav/newws/.agents/auditor_m3`  
**Audit Type**: Read-Only Pre-Deployment Technical Audit (Zero Code Modification)  

---

## 1. Executive Audit Summary

A comprehensive, empirical SEO, JSON-LD Schema, and Google Search Quality Rater Audit was conducted across all 164 page templates and static routes in `monitor_test_hub`.

### Audit Verdict: **FAIL — P0 BLOCKERS DETECTED**

While the project features strong technical display benchmarks (ISO 9241-307 defect standards, VESA Adaptive-Sync frame pacing, ST 2084 PQ EOTF tone mapping, and WebGL colorimetry engines), critical architectural flaws in canonical domain declarations, schema graph generation, duplicate metadata injection, hidden structured data, and untranslated localized page routes currently pose severe indexing risks and search engine manual action penalties.

---

## 2. Executive Scorecard

| Category | Score (/100) | Status | Key Risk |
| :--- | :---: | :---: | :--- |
| **Canonical & Domain Alignment** | **35/100** | ❌ FAIL | `robots.txt` points to `monitortesthub.com` while 62+ codebase files hardcode `monitortester.com`. |
| **JSON-LD Schema Compliance** | **40/100** | ❌ FAIL | 28 pages inject duplicate schema graphs; 27 pages contain hidden `FAQPage` schema without visual rendering. |
| **Page Metadata & Head Tag Integrity** | **45/100** | ❌ FAIL | 28 pages inject double `<title>`, double `<meta description>`, double `<link rel="canonical">` tags into DOM. |
| **Internationalization (i18n) SEO** | **30/100** | ❌ FAIL | Localized routes (`es`, `de`, `fr`) render 100% untranslated English titles, meta descriptions, and H1 tags. |
| **Google Search Quality & E-E-A-T** | **65/100** | ⚠️ WARN | High technical depth, but lacks named display calibrator bios, author attribution, and repo links. |
| **YMYL & Safety Compliance** | **90/100** | ✅ PASS | Good medical search query disambiguation banner (`MedicalBounceBanner.astro`) and ergonomics notices. |
| **Internal Linking & Navigation Architecture** | **85/100** | ✅ PASS | Mega-menu deck in `Layout.astro` covers primary diagnostic hubs and tools cleanly. |

---

## 3. Comprehensive Issue Log by Severity

---

### P0 — RELEASE BLOCKER ISSUES

#### Issue P0-1: Canonical Domain & Sitemap URL Mismatch (`monitortester.com` vs `monitortesthub.com`)
- **Location**:
  - `public/robots.txt` (Line 7)
  - `astro.config.mjs` (Line 7)
  - `src/components/seo/SEOHead.astro` (Lines 18, 25, 64)
  - `src/components/seo/SchemaGraph.astro` (Lines 24, 30, 39, 51, 58, 60, 63, 83, 84, 94)
  - `src/pages/about.astro` (Lines 12, 16)
  - `src/components/ui/EmbedWidgetModal.astro` (Lines 9, 12)
  - `src/components/diagnostics/HardwarePassportModal.astro` (Line 349)
  - All dynamic `[slug].astro` route files in `src/pages/`
- **Evidence**:
  `public/robots.txt` declares:
  ```text
  Sitemap: https://monitortesthub.com/sitemap-index.xml
  ```
  However, `astro.config.mjs` configures Astro static site generation as:
  ```js
  site: 'https://monitortester.com'
  ```
  Consequently, `@astrojs/sitemap` generates sitemaps containing `https://monitortester.com/...`. In addition, 62+ occurrences across `src/` hardcode `https://monitortester.com`.
- **Why it matters**: Search engine crawlers visiting `monitortesthub.com` are instructed by `robots.txt` to read a sitemap index that lists cross-domain URLs on `monitortester.com`. Cross-domain sitemap declarations and canonical URL mismatches cause search engines to reject sitemaps, ignore canonical signals, or drop pages from indexing.
- **Impact**: **Critical / Site-Wide Indexing Failure**.
- **Likelihood**: **High (100% of crawler requests affected)**.
- **Suggested Remediation**: Standardize all site origin declarations, canonical helpers, `astro.config.mjs`, `robots.txt`, `SEOHead.astro`, `SchemaGraph.astro`, `about.astro`, and modal links to consistently use the official single production domain (e.g., `https://monitortesthub.com`).

---

#### Issue P0-2: Duplicate SEO Head Metadata & Schema Script Injection Across 28+ Pages
- **Location**: 28 page files including:
  - `src/pages/[locale]/benchmarks/3d-print-cost/[slug].astro`
  - `src/pages/[locale]/benchmarks/pc-bottleneck/[slug].astro`
  - `src/pages/[locale]/benchmarks/wire-gauge-calculator/[slug].astro`
  - `src/pages/[locale]/display-tests/electricity-cost/[slug].astro`
  - `src/pages/[locale]/display-tests/tv-viewing-distance/[slug].astro`
  - `src/pages/benchmarks/3d-print-cost.astro`
  - `src/pages/benchmarks/3d-print-cost/[slug].astro`
  - `src/pages/benchmarks/gamepad-drift.astro`
  - `src/pages/benchmarks/pc-bottleneck.astro`
  - `src/pages/benchmarks/pc-bottleneck/[slug].astro`
  - `src/pages/benchmarks/room-mode-calculator.astro`
  - `src/pages/benchmarks/solar-tilt-calculator.astro`
  - `src/pages/benchmarks/wire-gauge-calculator.astro`
  - `src/pages/benchmarks/wire-gauge-calculator/[slug].astro`
  - `src/pages/benchmarks/wireless-latency.astro`
  - `src/pages/display-tests/apca-contrast.astro`
  - `src/pages/display-tests/contrast-accessibility.astro`
  - `src/pages/display-tests/dead-pixel-test/index.astro`
  - `src/pages/display-tests/delta-e-calculator.astro`
  - `src/pages/display-tests/electricity-cost.astro`
  - `src/pages/display-tests/electricity-cost/[slug].astro`
  - `src/pages/display-tests/tv-viewing-distance.astro`
  - `src/pages/display-tests/tv-viewing-distance/[slug].astro`
  - `src/pages/keyboard-tester/[slug].astro`
  - `src/pages/keyboard-tester/index.astro`
  - `src/pages/models/[slug].astro`
  - `src/pages/screen-test-meaning/index.astro`
  - `src/pages/touch-tests/touch-sampling-rate.astro`
- **Evidence**:
  In `3d-print-cost.astro`:
  ```astro
  <Layout title={seoTitle}>
    <SEOHead title={seoTitle} description={seoDescription} canonicalUrl={canonicalUrl} />
    <SchemaGraph type="WebApplication" name={seoTitle} description={seoDescription} url={canonicalUrl} />
  ```
  `<Layout>` already invokes `<SEOHead>` (which invokes `<SchemaGraph>`) inside `<head>`.
  Calling `<SEOHead>` and `<SchemaGraph>` again inside `<Layout>`'s main slot renders a SECOND set of `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph meta tags, Twitter Card meta tags, and `<script type="application/ld+json">` JSON-LD schema blocks into the DOM body. Furthermore, the second `<SchemaGraph>` call uses incorrect prop names (`name`, `type`, `url` instead of `title`, `canonicalUrl`), producing `headline: undefined` in the second schema payload.
- **Why it matters**: Violates HTML specifications and Google Search Central technical guidelines. Duplicate meta descriptions, title tags, and conflicting schema graphs confuse crawlers, trigger schema validation errors, and dilute search relevance.
- **Impact**: **High / Severe Technical SEO & Schema Corruption**.
- **Likelihood**: **High (100% of visits to these 28 pages)**.
- **Suggested Remediation**: Remove explicit `<SEOHead>` and `<SchemaGraph>` component calls from inside page content bodies. Rely exclusively on `<Layout>`'s head section injection, passing all necessary metadata props directly into `<Layout>`.

---

### P1 — CRITICAL ISSUES

#### Issue P1-1: Hidden FAQ Structured Data / Schema Spam Penalty Risk Across 27 Pages
- **Location**: 27 pages including:
  - `src/pages/display-tests/vrr.astro`
  - `src/pages/display-tests/color-gamut.astro`
  - `src/pages/display-tests/sub-pixel.astro`
  - `src/pages/display-tests/uniformity.astro`
  - `src/pages/display-tests/hdr-test.astro`
  - `src/pages/display-tests/oled-burn-in.astro`
  - `src/pages/display-tests/ppi-calculator.astro`
  - `src/pages/white-screen/index.astro`
  - `src/pages/touch-tests/index.astro`
  - `src/pages/keyboard-tester/index.astro`
  - `src/pages/keyboard-tester/[slug].astro`
  - `src/pages/keyboard-tester/switches/[slug].astro`
  - `src/pages/keyboard-tester/switches/index.astro`
  - `src/pages/compare/[slug].astro`
  - `src/pages/compare/index.astro`
  - `src/pages/models/[slug].astro`
  - `src/pages/models/index.astro`
  - `src/pages/faq.astro`
  - `src/pages/screen-test-meaning/index.astro`
  - `src/pages/touch-tests/touch-sampling-rate.astro`
  - And localized variants in `src/pages/[locale]/`
- **Evidence**:
  These 27 pages define a `faqs` or `vrrFaqs` array and pass it to `<Layout faqs={...}>` (generating `FAQPage` JSON-LD schema in `<head>`), BUT DO NOT render `<FAQSection faqs={...} />` visually anywhere in the page HTML.
- **Why it matters**: Google Search Central Structured Data Guidelines state: *"Structured data MUST accurately reflect the content visible to human readers."* Injecting `FAQPage` JSON-LD schema into `<head>` without displaying corresponding Q&A accordion content on the rendered webpage is classified by Google algorithms as **Hidden Structured Data / Schema Spam**, exposing the domain to manual spam actions and search removal.
- **Impact**: **Critical / Vulnerable to Google Manual Action & Rich Snippet Disqualification**.
- **Likelihood**: **High**.
- **Suggested Remediation**: Render `<FAQSection faqs={faqs} />` in the visible HTML of every page that declares a `faqs` schema array, OR remove `faqs` from pages where visual FAQ sections are not intended. Ensure every primary tool page features 10 structured FAQs displayed both visually and in schema.

---

#### Issue P1-2: Untranslated English Titles, Descriptions & Headings on Localized Routes (`es`, `de`, `fr`)
- **Location**:
  - `src/pages/[locale]/display-tests/dead-pixel.astro`
  - `src/pages/[locale]/display-tests/vrr.astro`
  - `src/pages/[locale]/display-tests/sub-pixel.astro`
  - `src/pages/[locale]/touch-tests/...`
  - `src/pages/[locale]/arcade/...`
  - `src/pages/[locale]/models/...`
  - `src/utils/i18n.ts`
- **Evidence**:
  `src/pages/[locale]/display-tests/dead-pixel.astro` imports `BasePage` from `../../display-tests/dead-pixel.astro` and renders `<BasePage />`. The compiled static output for `/es/display-tests/dead-pixel`, `/de/display-tests/dead-pixel`, and `/fr/display-tests/dead-pixel` contains the exact same untranslated English `<title>` ("Dead Pixel & Screen Color Test Online | Monitor Test Hub"), English meta description, English H1 heading ("Dead Pixel & Screen Color Test"), English methodology text, and English FAQs as the default `/display-tests/dead-pixel` route.
- **Why it matters**: Creates 4× duplicate pages across language trees with identical English metadata. This causes severe keyword cannibalization across international route trees, produces a poor user experience for non-English searchers, and lowers E-E-A-T quality ratings due to thin/doorway localized pages.
- **Impact**: **High / Destroys International SEO Performance & Ranking Potential**.
- **Likelihood**: **High**.
- **Suggested Remediation**: Build translation dictionaries for page titles, descriptions, H1 headings, and FAQs in `src/utils/i18n.ts`, and pass localized strings into `<Layout>` based on the route's `lang` parameter.

---

### P2 — HIGH ISSUES

#### Issue P2-1: Global Overscoping of `WebApplication` and `TechArticle` Schemas on Non-Tool / Policy Pages
- **Location**:
  - `src/components/seo/SchemaGraph.astro` (Lines 105-155)
  - `src/pages/privacy.astro`
  - `src/pages/terms.astro`
  - `src/pages/contact.astro`
  - `src/pages/404.astro`
  - `src/pages/500.astro`
- **Evidence**:
  `SchemaGraph.astro` unconditionally adds `@type: ["WebApplication", "SoftwareApplication"]` and `@type: "TechArticle"` to `graphNodes` for EVERY page wrapped in `<Layout>`.
- **Why it matters**: Legal policy pages (`/privacy`, `/terms`), contact forms (`/contact`), and error pages (`/404`, `/500`) are NOT software applications or technical articles. Declaring software and article schemas on policy and error pages violates Google Search Central schema accuracy rules.
- **Impact**: **Medium-High / Schema Quality Degradation**.
- **Likelihood**: **High**.
- **Suggested Remediation**: Make `WebApplication` and `TechArticle` schema nodes conditional in `SchemaGraph.astro`, rendering them only when explicit `isToolPage` or `isArticlePage` flags are passed.

---

#### Issue P2-2: Duplicate `<h1>` Heading Tags Injected by Component Embeds
- **Location**:
  - `src/components/diagnostics/ModelStatsCard.astro` (Line 59)
  - `src/pages/models/[slug].astro`
  - `src/pages/models/index.astro`
- **Evidence**:
  `ModelStatsCard.astro` contains:
  ```html
  <h1 class="text-xl md:text-2xl font-bold text-text-primary tracking-tight font-sans">{device.name}</h1>
  ```
  When embedded inside pages that already define a primary `<h1>` header, multiple `<h1>` elements are rendered in a single document.
- **Why it matters**: Web standards and SEO best practices require exactly one primary `<h1>` element per document to define topic hierarchy. Component-level sub-headers inside cards or widgets should use `<h2>` or `<h3>`.
- **Impact**: **Medium / Heading Hierarchy & Accessibility Defect**.
- **Likelihood**: **High**.
- **Suggested Remediation**: Change `<h1>` in `ModelStatsCard.astro` (Line 59) to `<h2>` or `<h3>`.

---

### P3 — MEDIUM ISSUES

#### Issue P3-1: Lack of Named Author Credentials & E-E-A-T Attribution
- **Location**:
  - `src/components/seo/SchemaGraph.astro` (Line 23)
  - `src/pages/about.astro` (Line 19)
- **Evidence**:
  `SchemaGraph.astro` hardcodes `"authorName": "Monitor Test Hub Engineering Team"` pointing to `https://monitortester.com/about`. `about.astro` lacks individual author profiles, display engineer bios, or linkable reviewer credentials. Line 19 of `about.astro` also sets `"sameAs": ["https://github.com"]` pointing to generic GitHub instead of a specific repository URL.
- **Why it matters**: Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines place heavy weight on clear authorship and verifiable expert credentials, especially for hardware calibration and technical diagnostic standards.
- **Impact**: **Medium / Search Quality Rater Score Reduction**.
- **Likelihood**: **Medium**.
- **Suggested Remediation**: Enhance `about.astro` and schema graphs to include specific author/reviewer credentials (e.g., Lead Display Systems Engineer), link directly to the official GitHub repository (`https://github.com/dvy246/monitor-platform`), and detail editorial verification procedures.

---

#### Issue P3-2: Incomplete Breadcrumb Schema Item Labels on Localized Routes
- **Location**: `src/components/seo/SchemaGraph.astro` (Lines 34-53)
- **Evidence**:
  Breadcrumb items generated by `SchemaGraph.astro` split `urlObj.pathname` by `/`. For `/es/display-tests/dead-pixel`, it generates intermediate breadcrumb item `https://monitortester.com/es` (labeled "Es") and `https://monitortester.com/es/display-tests` (labeled "Display Tests").
- **Why it matters**: "Es" is an uninformative breadcrumb label, and raw path segment splitting produces unlocalized labels in rich search results.
- **Impact**: **Low-Medium / Search Result Breadcrumb Polish**.
- **Likelihood**: **High for non-English routes**.
- **Suggested Remediation**: Exclude raw language prefixes (`es`, `de`, `fr`) from breadcrumb URL path steps or map them to clean localized labels ("Español", "Deutsch", "Français").

---

### P4 — LOW ISSUES

#### Issue P4-1: Open Graph Image Fallback Points to Unverified Domain
- **Location**: `src/components/seo/SEOHead.astro` (Line 18)
- **Evidence**: `ogImage` defaults to `'https://monitortester.com/og-image.png'`.
- **Why it matters**: If `og-image.png` is not deployed at the specified domain, social shares on Twitter, Facebook, and LinkedIn will show broken image previews.
- **Impact**: **Low / Social Media Preview Polish**.
- **Likelihood**: **High when shared on social channels**.
- **Suggested Remediation**: Align default `ogImage` domain with official site origin and verify `public/og-image.png` exists.

---

#### Issue P4-2: Minor Trailing-Slash Inconsistency in Hreflang Tags
- **Location**: `src/components/seo/SEOHead.astro` (Lines 61-64)
- **Evidence**: `hreflangs` generates `cleanPath` with trailing slashes (e.g. `/display-tests/`), whereas internal navigation links use unprefixed paths without trailing slashes (`/display-tests`).
- **Why it matters**: Inconsistent trailing-slash usage across canonicals, hreflangs, and internal links can cause minor redirect overhead or duplicate URL tracking.
- **Impact**: **Low / Crawl Efficiency Polish**.
- **Likelihood**: **Low**.
- **Suggested Remediation**: Ensure consistent trailing-slash handling across canonical tags, hreflangs, and internal routing helpers (`localizeLink`).

---

## 4. Google Search Quality Rater Guidelines Evaluation

### E-E-A-T Assessment
- **Experience**: Strong. Diagnostic tools (ISO 9241-307 pixel defect marker, sub-pixel GLSL reticle, 540Hz VRR sweep, 8000Hz mouse polling pacing) reflect genuine display hardware testing experience.
- **Expertise**: Good. Articles reference recognized international standards (ISO 9241-307, VESA DisplayHDR, CIE 1931 xy chromaticity, ST 2084 PQ EOTF, NEC 2026 wire gauge).
- **Authoritativeness**: Fair. Open-source client-side WebGL architecture is strong, but authority is weakened by missing author profiles, generic GitHub links, and domain mismatch.
- **Trustworthiness**: High technical privacy framing ("100% client-side, zero telemetry"), but damaged by duplicate head metadata and schema injection bugs.

### Helpfulness & Originality
- **Helpfulness**: High. Interactive WebGL tools and real-time rAF frame pacing offer genuine utility.
- **Originality**: High. Decoupled pure-TypeScript engines (`HardwarePassportEngine.ts`, `RefreshRateEngine.ts`, `VrrSweepEngine.ts`, `HdrTestEngine.ts`) provide unique interactive diagnostic functionality.
- **YMYL Safety**: Passed. Medical bounce banner (`MedicalBounceBanner.astro`) effectively disambiguates "screen test" medical queries from visual hardware monitor diagnostics.

---

## 5. Summary of Remediation Actions (For Post-Audit Phase)

1. **Standardize Official Domain**: Update `robots.txt`, `astro.config.mjs`, `SEOHead.astro`, `SchemaGraph.astro`, and modal links to use one single canonical domain (`https://monitortesthub.com`).
2. **Eliminate Duplicate `<SEOHead>` & `<SchemaGraph>` Calls**: Remove inner `<SEOHead>` and `<SchemaGraph>` calls from body slots in all 28 affected page templates.
3. **Synchronize Visual FAQs with Schema**: Ensure all 27 pages that declare `faqs` render `<FAQSection faqs={faqs} />` in their visible HTML.
4. **Localize Metadata for `es`, `de`, `fr` Routes**: Add localized title, description, H1, and FAQ strings to `src/utils/i18n.ts`.
5. **Scope Schemas Appropriately**: Make `WebApplication` and `TechArticle` schemas conditional in `SchemaGraph.astro`.
6. **Fix Component Heading Hierarchy**: Change `<h1>` in `ModelStatsCard.astro` to `<h2>`.

---

**Report Status**: Complete & Filed to `/Users/divyyadav/newws/.agents/auditor_m3/audit_report.md`.
