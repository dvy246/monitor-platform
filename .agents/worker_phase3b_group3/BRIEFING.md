# BRIEFING — 2026-07-23T19:14:00Z

## Mission
Upgrade all 11 Utility Calculators, Micro-Arcade, and Device Database tool pages in DisplayTestOnline.com to standardized 2-column layout with Right Sidebar components and strict UI/UX Pro Max rules compliance.

## 🔒 My Identity
- Archetype: implementer, qa, specialist
- Roles: implementer, qa, specialist
- Working directory: /Users/divyyadav/newws/.agents/worker_phase3b_group3
- Original parent: 500ec142-131d-4788-821c-8b5389066447
- Milestone: Phase 3B Group 3 Page Upgrades

## 🔒 Key Constraints
- NO text emojis in code/templates — SVG icons ONLY.
- Standardize container widths to `max-w-7xl mx-auto px-4 py-6 sm:py-8 font-sans`.
- Standardize 2-column layout: Left Canvas `lg:col-span-8` + Right Sidebar `lg:col-span-4 sticky top-24`.
- Import right sidebar components from `src/components/ui/sidebar/` matching Section 4.5 mapping matrix.
- NO hover scale transforms (`scale-105`, `hover:-translate-y-0.5`).
- Touch target min 44x44px (`min-h-[44px] min-w-[44px]`), visible focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
- Dark glassmorphism (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl`).
- 0 tsc errors (`npx tsc --noEmit`), 317+ passing Vitest unit tests (`TMPDIR=$PWD/.tmp npm test`).

## Current Parent
- Conversation ID: 500ec142-131d-4788-821c-8b5389066447
- Updated: 2026-07-23T19:14:00Z

## Task Summary
- **What to build**: Upgrade 11 pages (5 Utility Calculators, 4 Micro-Arcade, 2+ Device Database/Compare pages) + related components (`ApplianceEnergyInspector.astro`, `screentester-alternative.astro`, etc.) to unified layout & UI rules.
- **Success criteria**: All 11 pages pass verification commands, layout directives, sidebar imports, emoji-free SVG icons, focus rings, no hover scaling.

## Change Tracker
- **Files modified**: TBD
- **Build status**: TBD
- **Pending issues**: None

## Quality Status
- **Build/test result**: TBD
- **Lint status**: TBD
- **Tests added/modified**: 0 (UI upgrades)

## Loaded Skills
- None required directly, following instructions in request & Phase 2 handoff Section 4.5.

## Artifact Index
- handoff.md — Handoff report
