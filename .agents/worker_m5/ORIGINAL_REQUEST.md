## 2026-07-22T00:29:46Z
You are teamwork_preview_worker implementing Milestone 5: Display HDR Peak Brightness & Tone Mapping Clipping Test.
Your metadata working directory is `/Users/divyyadav/newws/.agents/worker_m5/`.
The codebase directory is `/Users/divyyadav/newws/monitor_test_hub`.

Task:
Read the 3 Explorer handoff reports:
- `/Users/divyyadav/newws/.agents/explorer_m5_1/handoff.md` (HDR Engine architecture & PQ EOTF math specs)
- `/Users/divyyadav/newws/.agents/explorer_m5_2/handoff.md` (HDR UI component, 10-bit Canvas & ABL specs)
- `/Users/divyyadav/newws/.agents/explorer_m5_3/handoff.md` (HDR SEO, dynamic routes, JSON-LD specs)

Execute implementation for Milestone 5:
1. Create `src/engine/HdrTestEngine.ts` with pure math functions for ST 2084 PQ curve, 10-bit RGB color step generator, HGIG/static/dynamic tone mapping roll-off curves, clipping nit calculations (100 to 4000 nits), and ABL window brightness calculation (1%, 5%, 10%, 25%, 100% APL windows).
2. Create `src/engine/HdrTestEngine.test.ts` with comprehensive Vitest unit tests covering 100% of functions and edge cases.
3. Create `src/components/diagnostics/HdrClippingTester.astro` matching the specs (10-bit Canvas gradient generator, zebra clipping warning overlay, ABL window size toggles, tone mapping selectors, zero CLS pre-allocated markup, keyboard accessibility `focus:ring-2`, and dark/light optical contrast compliance).
4. Create pages:
   - `src/pages/hdr-test/index.astro`
   - `src/pages/hdr-test/[peakNits]/[toneMapping].astro`
   - Localized dynamic routes under `src/pages/[locale]/hdr-test/` matching the existing i18n structure.
   - Include Schema.org `WebApplication` and `TechArticle` JSON-LD graphs via `SEOHead.astro` / `SchemaGraph.astro`.

Verification:
Run the following commands using `run_command` in `/Users/divyyadav/newws/monitor_test_hub`:
- `npm test`
- `npx tsc --noEmit`
- `npm run build`
- `python3 verify_docs.py`

Write a detailed handoff report in `/Users/divyyadav/newws/.agents/worker_m5/handoff.md` including exact build and test command outputs. Then send a message back to parent.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
