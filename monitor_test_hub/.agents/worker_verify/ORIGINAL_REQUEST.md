## 2026-07-21T12:16:20Z
You are a teamwork_preview_worker agent assigned to create a verification script and run the verification for Monitor Test Hub documentation (`prd.md` and `plan.md`).

Working directory for your metadata: `/Users/divyyadav/newws/monitor_test_hub/.agents/worker_verify`

Target Verification Script to write: `/Users/divyyadav/newws/monitor_test_hub/verify_docs.py`

Files to inspect and verify:
1. `/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md`
2. `/Users/divyyadav/newws/monitor_test_hub/prd.md`
3. `/Users/divyyadav/newws/monitor_test_hub/plan.md`

Tasks:
1. Write a Python script `verify_docs.py` in `/Users/divyyadav/newws/monitor_test_hub/verify_docs.py`.
   The script must programmatically check that both `prd.md` and `plan.md` exist, are non-empty, and contain all required technical details, specifications, formulas, disclaimers, schema snippets, citations, and milestones from `competitor_analysis_report.md`.
   Specifically, verify:
   - Astro.js & Tailwind CSS stack references.
   - Desktop visual diagnostic engine features (540Hz+ VSYNC, Sub-pixel RGB/BGR/QD-OLED/WOLED layout analyzer, OLED 5%/10% gray uniformity & burn-in, VRR tear-bar oscillation, BroadcastChannel + WebSocket multi-display sync, WASM LittleCMS ICC exporter).
   - Mobile touch diagnostic engine features (Multi-touch count, Adaptive dead-zone grid matrix, Swipe velocity tracking, Vector draw precision with RMS formula `Dev_rms`, Mobile Viewport Sandboxing `100dvh`/`100dvw`, non-passive event listeners, offline PWA Service Worker).
   - All 4 Arcade micro-games ("Ghosting Invaders", "Color Match Alchemist", "Lag Reflex Sniper", "Touch Matrix Defusal") with their mathematical formulas (pursuit speed, sRGB linearization, CIE Lab, CIEDE2000 ΔE00, performance.now() latency delta, USB HID polling rate, 10x16 grid hit testing) and ASCII UI diagrams.
   - Strict YMYL / E-E-A-T Compliance:
     * Thin Content Avoidance strategy.
     * Core Web Vitals & UX (Astro SSG, responsive layout, no intrusive popups).
     * Information Architecture & URL taxonomy (`/display-tests/` vs `/screen-test-meaning/`).
     * Medical Bounce Neutralizer Hero Banner (HTML template & CSS styles).
     * Schema.org JSON-LD graph metadata with explicit `medicalAudience` override (`audienceType: "None - Non-Medical Hardware Diagnostic Tool"`).
     * Copy-pasteable disclaimer HTML templates (Photosensitive Epilepsy WCAG 2.3.1, Optometric Ergonomics 20-20-20, Hardware Colorimeter Limitation).
     * Formal hardware engineering citations (ISO 9241-307:2008, VESA DisplayHDR 1.2, IEC 62341, CIE, ANSI/IES RP-28-20).
     * YMYL compliance verification checklist table (10 items).
   - Actionable chronological engineering milestones in `plan.md` (Milestones 1 through 8) including SEO metadata setup, Schema.org JSON-LD injection, performance auditing, and deployment.

2. Run the script: `python3 /Users/divyyadav/newws/monitor_test_hub/verify_docs.py` using `run_command` in `/Users/divyyadav/newws/monitor_test_hub`.

3. Ensure the script prints a structured test report detailing each check name, status (PASS/FAIL), and overall summary.
