# Original User Request

## 2026-07-22T08:41:47Z

# MASTER PROMPT — Monitor Test Hub: Next 5 SEO Capabilities, Navbar Rebuild, Full SEO Pass, Verification Loop

Multi-agent SEO engineering sprint for **Monitor Test Hub** (`nasty-neptune`). The team will: (1) research and validate the next 5 SEO capability candidates through parallel sub-agents following strict client-side static/free-of-cost constraints, (2) rebuild the navbar mega-menu with proper internal-linking for all pSEO route families, (3) run a full SEO/schema/FAQ/canonical pass in parallel with research, and (4) verify everything in an explicit loop with hard test-suite checkpoints before declaring done.

Working directory: /Users/divyyadav/newws/monitor_test_hub
Integrity mode: development

---

## Strategic Constraints & Technical Rules

1. **Static & Free-of-Cost**: All 5 new features/capabilities MUST be 100% static, client-side, browser-executable, and completely free of cost (no external paid APIs, no server-side compute, Astro static output).
2. **Parallel Execution**: Tasks 2 & 3 (Navbar Rebuild, FAQ Consolidation, Schema Audit, Canonicals) run in parallel with Task 1 (Research Sub-agents).
3. **Top-Level Quality & Rejection Discipline**: Reject any candidate that duplicates an existing engine in this codebase or is already feature-complete/well-served by a live competitor.
4. **Target Directory**: All commands targeting the web app must run inside `/Users/divyyadav/newws/monitor_test_hub`.

---

## Requirements

### R1. Research & Build: 5 Validated SEO Capability Candidates
Spawn 5 parallel research sub-agents, each independently identifying one candidate capability adjacent to display/monitor hardware (e.g. gaming peripherals, vision/contrast accessibility, webcam/room lighting, display calibration, touch digitizers). Each sub-agent must:
- Run real searches for the exact user query cluster (head + long-tail + "how do I know if X" style).
- Fetch and read at least 3 competitor pages currently ranking for that cluster.
- Search Reddit and forum communities for unresolved, repeated user questions that no interactive tool currently answers.
- Explicitly determine: is this an *interactive tool gap* or a *content gap*?
- Assess reuse against existing engine patterns (e.g., same shape as `PcBottleneckEngine.ts` or `WireGaugeEngine.ts`).
- Produce a per-candidate writeup: concept, verified demand, why competitors haven't solved it well (with actual URLs checked), engineering complexity, and an honest "why this could fail" section.
- State explicitly whether the candidate reinforces core display/monitor topical authority or extends into a new adjacent vertical (and what the trade-off is).

Orchestrator must cross-check candidates for overlap, then rank by evidence strength. Any candidate found to already be well-served by a competitor or already built in the codebase is to be explicitly rejected with reasoning.

**Already built — MUST NOT re-suggest:**
- Display diagnostics: dead pixel, sub-pixel/ClearType fringing, uniformity, VRR sweep (540Hz+), HDR PQ/EOTF + ABL evaluator, color gamut (CIE 1931) with ICC v4.3 export, PPI/arcminute acuity calculator.
- Touch diagnostics: touch matrix/dead-zone, multi-touch counter, RMS vector precision, swipe velocity, click-to-photon input lag.
- Arcade: Ghosting Invaders, Color Match Alchemist, Lag Reflex Sniper, Touch Matrix Defusal.
- Hardware Passport (SHA-256 signed receipt), crowdsourced per-model telemetry DB (/models/[slug]), embeddable badge widget.
- White screen utility with Planckian-locus color temp slider + parametric color routes.
- Existing pSEO: device-specific dead pixel tests, PC bottleneck/FPS estimator, appliance electricity cost calculator (50 US states), TV/projector viewing distance (6 screen sizes), NEC 2026 wire gauge, 3D printer filament cost, keyboard tester with switch chatter analysis (8 routes).
- 22+ knowledge base articles, FAQ page with JSON-LD, multi-locale routing (en/es/de/fr).

### R2. Navbar & Information Architecture Rebuild (Parallel Track)
Update `src/layouts/Layout.astro`'s mega-menu to:
- Add entry points for any greenlit new capabilities, grouped logically within existing categories.
- Audit existing pSEO route families — confirm each has a real, browsable hub/index page reachable from the navbar (not merely a sitemap entry). Flag any route family lacking a proper index page as a critical internal-linking gap (e.g., ensure all 50 states, CPU×GPU pairings, TV sizes, wire gauge sizes have reachable category hubs).
- Keep locale-switching (en/es/de/fr) intact.
- Deliver the actual before/after diff of the navbar structure as part of the output.

### R3. Full SEO Optimization Pass (Parallel Track)
1. **FAQ audit:** cross-reference the central `faq.astro` (12 items + JSON-LD) against FAQs embedded on individual tool pages. Consolidate duplicate/near-duplicate questions. Page-specific FAQs stay on-page; only genuinely cross-cutting questions belong on the central FAQ. Refactor the FAQ component into one reusable, parameterized component (accepting a props array of Q&A pairs with per-instance schema generation).
2. **Schema audit:** verify JSON-LD is present and valid on every page type (SoftwareApplication/WebApplication for tools, FAQPage for FAQ-bearing pages, BreadcrumbList for pSEO routes, Article for knowledge base guides). Flag schema declared but not matching visible page content.
3. **Metadata pass:** confirm canonical tags match the actually-served hostname and locale. Check for www/non-www or trailing-slash inconsistency between canonical declarations and internal links.

### R4. Verification Loop
Structure work as an explicit loop (max 5 iterations) with hard checkpoints. Do not mark anything done without passing its checkpoint:

```
LOOP:
1. RESEARCH   → sub-agents produce findings
2. CRITIQUE   → actively try to reject each candidate
3. PROPOSE    → concrete engineering spec + navbar diff + SEO diff
4. IMPLEMENT  → write actual code changes
5. VERIFY     →
   - npm test (246+ Vitest tests must pass; new engines need new tests)
   - npx playwright test (new routes must be covered)
   - npx tsc --noEmit (zero TypeScript errors)
   - npm run build (2,645+ static pages must build clean)
   - python3 verify_docs.py (must remain 20/20 PASS)
   - Post-deploy: manually fetch 2-3 live pages and confirm schema/canonical/navbar reflect changes
6. REPORT     → separate verified facts / informed reasoning / assumptions
```

All commands must be run from `/Users/divyyadav/newws/monitor_test_hub`.

### R5. Final Deliverable
Produce in this order:
1. Executive summary (what shipped, what was rejected, what's pending)
2. 5 candidate verdicts with evidence
3. Navbar before/after diff
4. SEO/FAQ/schema changes made
5. Verification loop log (which checkpoint failed on which iteration and how resolved)
6. Explicit assumptions list — anything not independently verified, flagged for human review before merge

## 2026-07-22T08:43:25Z

CRITICAL ADDENDUM FROM USER:
1. YMYL Safe: All 5 candidate features MUST be YMYL-safe (No medical/health/clinical diagnosis claims, no financial/legal liability risk). Frame all visual/contrast/audio tools as display/peripheral calibration standards (ISO 9241-307, VESA, IEC). Include clear disclaimers where appropriate.
2. US Audience Specific: All copy, units, standards, and examples MUST be specifically tailored for a US-based, English-speaking audience (US English spelling: "color", "center", "optimize"; US units: inches/feet; US standards: NEC 2026, EIA rates, THX/SMPTE, USD $).
