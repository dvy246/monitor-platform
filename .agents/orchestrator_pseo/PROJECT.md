# Project: Monitor Test Hub pSEO Diagnostic Features

## Architecture
- Framework: Astro v7.1.3 + Vite + Tailwind CSS v4 (`@tailwindcss/vite`)
- Engine / Business Logic: TypeScript engines in `src/engine/`
- Component Library: Astro + HTML5 Web APIs (Canvas 2D/10-bit, Web Worker, rAF, PointerEvents, High-res performance.now()) in `src/components/diagnostics/`
- SEO & Schema: `SEOHead.astro` + `SchemaGraph.astro` (`WebApplication` and `TechArticle` JSON-LD graphs)
- Routing: i18n static generation (`en` default locale without prefix, `es`/`de`/`fr` localized under `[locale]`)

## Code Layout
- `src/engine/`: Pure TypeScript calculation and simulation engines with Vitest unit tests (`*.test.ts`)
- `src/components/diagnostics/`: Interactive client-side diagnostic components with accessible UI, focus rings (`focus:ring-2`), and zero layout shift (`min-h` pre-allocated containers)
- `src/components/seo/`: SEO head and Schema.org JSON-LD generators
- `src/pages/`: Main programmatic static routes
- `src/pages/[locale]/`: Localized route aliases for `es`, `de`, `fr`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Dynamic OLED Burn-In Risk Analyzer | Engine, UI Component, Unit Tests, Routes `/oled-burn-in-risk/` & `/oled-burn-in-risk/[panel-type]/[usage-tier]` | none | DONE |
| M2 | Real-Time VRR Stutter & Tear Pattern Generator | Worker/rAF Engine, UI Component, Unit Tests, Routes `/vrr-stutter-test/` & `/vrr-stutter-test/[gpu-vendor]/[refresh-rate]` | none | DONE |
| M3 | Touchscreen Digitizer Precision Matrix | PointerEvent Engine, UI Component, Unit Tests, Routes `/touch-matrix/` & `/touch-matrix/[device-type]/[grid-density]` | none | DONE |
| M4 | High-Refresh Input Lag Sniper | Latency Engine, UI Component, Unit Tests, Routes `/input-lag-test/` & `/input-lag-test/[refresh-rate]/[polling-rate]` | none | DONE |

| M5 | Display HDR Peak Brightness Test | 10-bit Canvas/ABL Engine, UI Component, Unit Tests, Routes `/hdr-test/` & `/hdr-test/[peak-nits]/[tone-mapping]` | none | PLANNED |
| M6 | E2E Testing, Integration, Integrity Audit & Hardening | Full build/test/type-check/docs validation & Forensic Audit | M1-M5 | PLANNED |

## Interface Contracts
### `src/engine/` Standard Contract
Every engine module must export:
1. Standardized input types / interfaces
2. Pure mathematical calculation/simulation functions
3. Comprehensive Vitest suite (`*.test.ts`) covering 100% of edge cases
