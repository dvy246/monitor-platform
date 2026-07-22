# AGENTS.md — Workspace Guidelines for AI Agents

Refer to [/AGENTS.md](file:///Users/divyyadav/newws/AGENTS.md) for full project architecture, commands, directory structure, engine design guidelines, and testing procedures.

### Workspace Summary
- **Primary Project**: `monitor_test_hub/` (Astro v7 + Tailwind CSS v4 + TypeScript + Vitest + Playwright)
- **Primary Working Directory for Commands**: `/Users/divyyadav/newws/monitor_test_hub`
- **Key Verification Commands**: `TMPDIR=$PWD/.tmp npm test`, `npx tsc --noEmit`, `TMPDIR=$PWD/.tmp npm run build`, and `python3 verify_docs.py` inside `monitor_test_hub/`
- **Total Static Pages**: 2,699 static HTML pages generated across 4 localized route trees (en, es, de, fr, canonical domain: `https://monitortester.com`)
- **Unit & Stress Tests**: 287 tests passing across 51 test files (100% Vitest coverage, 0 TypeScript errors)
- **FAQ Architecture**: 10 structured FAQs per primary tool page paired with dynamic `FAQPage` JSON-LD schema & `<FAQSection>` accordions
- **Floating Action Button (FAB)**: Premium dark-glassmorphism FAB positioned at `bottom-5 right-5 sm:bottom-6 sm:right-6` with mobile safe-area insets (`env(safe-area-inset-bottom)`)
