## 2026-07-22T00:01:03Z
Implement Milestone 1: Dynamic OLED Burn-In & Image Retention Risk Analyzer

Requirements:
1. Base route `/oled-burn-in-risk/` and dynamic routes `/oled-burn-in-risk/[panel-type]/[usage-tier]`.
2. Panel types: `qd-oled`, `woled`, `amoled`, `qd-oled-v2`, `woled-meta`.
3. Usage tiers: `light`, `moderate`, `heavy`, `extreme`.
4. Client-side 5% near-black uniformity canvas inspector with toggleable static UI overlays (Taskbar, HUD, News Ticker).
5. Image retention decay calculator based on panel tech and cumulative usage hours / usage tier in `src/engine/OledBurnInEngine.ts` and unit tests in `src/engine/OledBurnInEngine.test.ts`.
6. UI Component `src/components/diagnostics/OledBurnInAnalyzer.astro` (or script/canvas inside component). Accessible keyboard navigation with visible focus rings (`focus:ring-2`), 100% optical contrast compliance in Dark Mode (#08080a) and Light Mode (#f8fafc), zero layout shift (CLS = 0.000).
7. Create pages:
   - `src/pages/oled-burn-in-risk/index.astro`
   - `src/pages/oled-burn-in-risk/[panel-type]/[usage-tier].astro`
   - `src/pages/[locale]/oled-burn-in-risk/index.astro`
   - `src/pages/[locale]/oled-burn-in-risk/[panel-type]/[usage-tier].astro`
8. Embed Schema.org `WebApplication` and `TechArticle` JSON-LD on every route (using `SEOHead.astro` or `SchemaGraph.astro`).
9. Run build and verification commands:
   - `npm run build`
   - `npx tsc --noEmit`
   - `npm test`
   - `python3 verify_docs.py`
