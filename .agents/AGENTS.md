# AGENTS.md — Workspace Guidelines for AI Agents

Refer to [/AGENTS.md](file:///Users/divyyadav/newws/AGENTS.md) for full project architecture, commands, directory structure, engine design guidelines, and testing procedures.

### Workspace Summary
- **Primary Project**: `monitor_test_hub/` (Astro v7 + Tailwind CSS v4 + TypeScript + Vitest + Playwright)
- **Primary Working Directory for Commands**: `/Users/divyyadav/newws/monitor_test_hub`
- **Live Production URL**: `https://displaytestonline.com` (Cloudflare Pages)
- **Key Verification Commands**: `TMPDIR=$PWD/.tmp npm test`, `./node_modules/.bin/tsc --noEmit`, `TMPDIR=$PWD/.tmp npm run build`, `verify_docs.py` inside `monitor_test_hub/`
- **Total Static Pages**: 2,856 static HTML pages generated across 4 localized route trees (en, es, de, fr)
- **Unit & Stress Tests**: 337 tests passing across 59 test files (100% Vitest coverage, 0 TypeScript errors)
- **Key Instruments**: 60+ diagnostic tools across displays, high-refresh latency, mobile touch, mechanical keyboards, mice, gamepads, hardware calculators, white screen, and sound diagnostics.
- **Sound Diagnostics Ecosystem**: Free Online Tone Generator (`/sound-test/tone-generator`) with zero-crossing triggered oscilloscope, Brainwave Focus Frequencies (Beta 20Hz, Gamma 40Hz, Alpha 10Hz), stereo headphones binaural beats guide, and 3-step interactive recommendation wizard modal.
- **SEO & Canonical Integrity**: Canonical URLs normalized site-wide in `<SEOHead.astro>` to `https://displaytestonline.com` + clean path without `www` or trailing slash discrepancies.
