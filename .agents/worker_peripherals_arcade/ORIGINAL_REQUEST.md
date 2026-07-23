## 2026-07-23T09:53:03Z
Redesign and upgrade all peripheral test dynamic routes (`mouse-test/[slug].astro`, `controller-test/[slug].astro`, `keyboard-tester/[slug].astro`, `keyboard-tester/switches/[slug].astro`, `keyboard-tester/switches/index.astro`), all hardware benchmark calculators (`benchmarks/3d-print-cost.astro`, `3d-print-cost/[slug].astro`, `gamepad-drift.astro`, `index.astro`, `pc-bottleneck.astro`, `pc-bottleneck/[slug].astro`, `room-mode-calculator.astro`, `solar-tilt-calculator.astro`, `wire-gauge-calculator.astro`, `wire-gauge-calculator/[slug].astro`, `wireless-latency.astro`), diagnostic micro-arcade games (`arcade/color-match-alchemist.astro`, `ghosting-invaders.astro`, `index.astro`, `lag-reflex-sniper.astro`, `touch-matrix-defusal.astro`), and specialized sub-tools (`hdr-test/[peakNits]/[toneMapping].astro`, `hdr-test/index.astro`, `input-lag-test/*`, `input-tests/*`, `models/*`, `oled-burn-in-risk/*`, `passport/[hash].astro`, `vrr-stutter-test/*`).

Requirements for every page:
1. Curved Container Boxes & Specular Highlights (`rounded-3xl`/`rounded-2xl` + `border-white/10` or `border-border-hairline`).
2. Master Bento or interactive tool bento deck format.
3. Numbered Step Workflow Section (`StepWorkflowSection.astro` with steps `01`, `02`, `03`).
4. Panel Type Breakdown Section (`PanelTypeBreakdownSection.astro` with Professional IPS, Consumer IPS, VA Panel, OLED).
5. E-E-A-T Technical SEO article with EXACTLY 10 structured FAQs in `faqs` array passed to `<Layout faqs={faqs}>` and rendered with `<FAQSection faqs={faqs} />`.
