## 2026-07-23T13:39:32Z
You are Worker 3 (Phase 3B Group 2 Touch, Input & Audio Implementer) for the DisplayTestOnline.com Redesign Project.

Your working directory for coordination: `/Users/divyyadav/newws/.agents/worker_phase3b_group2/`.
The project codebase is located at `/Users/divyyadav/newws/monitor_test_hub/`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK REQUIREMENTS:
1. Refer to the Phase 2 Technical Specifications artifact at `/Users/divyyadav/newws/.agents/explorer_phase2/handoff.md` (Sections 4.2, 4.3, 4.4).
2. Upgrade all 20 Touch Screen, Input, and Audio diagnostic tool pages in `src/pages/`:
   - Touch Screen Suite (7): `touch-tests/dead-zone.astro`, `touch-tests/multi-touch.astro`, `touch-tests/vector-precision.astro`, `touch-tests/swipe-velocity.astro`, `touch-tests/input-lag.astro`, `touch-matrix/index.astro`, `touch-matrix/charger-emi-inspector.astro`
   - Input Suite (5): `mouse-test/index.astro`, `controller-test/index.astro`, `keyboard-tester/index.astro`, `keyboard-tester/switches/index.astro`, `keyboard-tester/[slug].astro`
   - Audio Suite (8): `sound-test.astro`, `sound-test/speaker-test.astro`, `sound-test/headphone-test.astro`, `sound-test/bass-test.astro`, `sound-test/microphone-test.astro`, `sound-test/tone-generator.astro`, `sound-test/surround-sound.astro`, `sound-test/audio-latency.astro`

3. Layout & Refactoring Directives:
   - Convert every page to 2-column layout (`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8`: Left Canvas `lg:col-span-8` + Right Sidebar `lg:col-span-4 sticky top-24`).
   - Import and instantiate the 9 reusable Right Sidebar Astro components from `src/components/ui/sidebar/` (`InfoCard`, `MetricCard`, `ShortcutCard`, `ConfigurationCard`, `StatusCard`, `PaletteCard`, `TelemetryCard`, `InspectorCard`, `PassportCard`) as specified in the Phase 2 mapping matrix.
   - For `keyboard-tester/index.astro`, eliminate the duplicate inline FAQ section (keep only single `<FAQSection />`).
   - For `touch-tests/input-lag.astro`, ensure clean component integration.

4. UI/UX Pro Max 5 Strict Rules Enforcement:
   - SVG icons ONLY (Heroicons/Lucide). Remove all raw text emojis (`🔬`, `🎧`).
   - Add `cursor-pointer` and `transition-colors duration-200` to all interactive buttons, cards, and select elements.
   - NO hover scale transforms (`scale-105`) or layout shifting on hover (`group-hover:translate-x-0.5`).
   - Min 44x44px touch target sizing on controls; visible focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
   - Dark glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl`).

5. Verification Commands (run inside `/Users/divyyadav/newws/monitor_test_hub`):
   - `npx tsc --noEmit` (0 errors expected)
   - `TMPDIR=$PWD/.tmp npm test` (317+ unit tests PASS expected)

6. Save handoff report in `/Users/divyyadav/newws/.agents/worker_phase3b_group2/handoff.md` and send a summary message back to parent orchestrator.
