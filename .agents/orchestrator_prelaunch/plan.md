# Master Plan: Pre-Launch Competitive Domination & US Audience Acquisition Protocol

## Project Overview
- **Project Root**: `/Users/divyyadav/newws/monitor_test_hub`
- **Orchestration Directory**: `/Users/divyyadav/newws/.agents/orchestrator_prelaunch`
- **Target Competitor**: `screentester.io`
- **Subject Product**: `Monitor Test Hub` (https://displaytestonline.com)

## Verification Loop Architecture (4 Rounds)

### Round 1: Specialized Discovery & First-Draft Analysis
Dispatch 5 subagents in parallel to execute specialized research and analysis tasks with strict inline `[SOURCE: ...]` citations:
- **Agent A (Competitor Forensics)**: Workspace: `.agents/agent_a_forensics`. Inspect screentester.io live homepage, sitemap.xml, robots.txt, indexed page count, meta tags, schema markup, WHOIS/Wayback age, Lighthouse/PageSpeed.
- **Agent B (Technical SEO Parity+ Audit)**: Workspace: `.agents/agent_b_seo`. Re-verify Monitor Test Hub live metrics (`npm test`, `tsc --noEmit`, `python3 verify_docs.py`, sitemap page count). Produce CWV, Schema, E-E-A-T, Zero-click matrix against screentester.io.
- **Agent C (Search Intent & Content Gap)**: Workspace: `.agents/agent_c_intent`. Analyze search intent language, PAA queries, content gaps, and US pSEO expansion opportunities.
- **Agent D (US Audience Acquisition)**: Workspace: `.agents/agent_d_acquisition`. Strategy for r/Monitors, r/OLED, r/buildapc, r/pcmasterrace, YouTube reviewers, US forums, and backlink bait candidates.
- **Agent E ("Why Us, Not Them" Positioning)**: Workspace: `.agents/agent_e_positioning`. Draft visitor-facing comparison page with honest competitor acknowledgment and clear Monitor Test Hub advantages.

### Round 2: Adversarial Red-Team Verification
- **Agent F (Adversarial Verification / Red-Team)**: Workspace: `.agents/agent_f_redteam`. Independently check every claim, re-fetch sources, validate CLI execution outputs, flag unverified assertions, produce Challenge & Verification Log.

### Round 3: Evidence Correction & Resolution Loop
- Re-dispatch/notify Agents A-E to resolve challenges raised by Agent F, update inline citations, or retract unverified points.

### Round 4: Final Synthesis & Scorecard Assembly
- **Agent G (Orchestrator / Synthesizer)**: Workspace: `.agents/agent_g_synthesizer`. Assemble the complete Launch Readiness Report, 0-100 Category Scorecard, GO / GO-WITH-CONDITIONS / NOT-YET final recommendation, and final handoff.md.

## Acceptance Criteria
- [ ] 100% strict anti-hallucination compliance (live source tag [SOURCE: ...] for every numerical/metric claim).
- [ ] Live command verification results incorporated: `npm test`, `npx tsc --noEmit`, `python3 verify_docs.py`, sitemap page count.
- [ ] Adversarial red-team verification log cleanly integrated.
- [ ] Final Launch Readiness Report & Scorecard delivered to `/Users/divyyadav/newws/.agents/orchestrator_prelaunch/handoff.md`.
