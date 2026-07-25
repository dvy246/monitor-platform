## 2026-07-23T13:14:43Z
You are the Phase 2 Component System Architect for the DisplayTestOnline.com Redesign Project.

Your working directory for coordination: `/Users/divyyadav/newws/.agents/explorer_phase2/`.
The project codebase is located at `/Users/divyyadav/newws/monitor_test_hub/`.

USER MANDATE & PHASE 2 REQUIREMENTS:
Phase 1 has been APPROVED by the user. You are authorized to execute Phase 2: Unified Component System Architecture.

TASK REQUIREMENTS:
1. Design the complete technical specification for all 9 reusable Right Sidebar components:
   - `InfoCard.astro`: Technical standards citations (ISO 9241-307, IEC 62341-6-2, VESA, ST 2084 PQ EOTF, NEC 2026, AES17), OSD gain tips, and educational context.
   - `MetricCard.astro`: Single and multi-metric readouts, progress bars, physical units (Hz, ms, ΔE00, PPI, V, W, dBFS), and high-contrast labels.
   - `ShortcutCard.astro`: Keyboard hotkey capsules (`kbd`), action labels, and yellow TV remote hint banner.
   - `ConfigurationCard.astro`: Range sliders, toggle switches, select dropdowns, preset buttons, and target inputs (min 44x44px touch targets, prominent focus rings).
   - `StatusCard.astro`: Multimodal LED status badges (`PASS`/`WARN`/`FAIL`), health ratings, and glowing status rings (`led-glow-pass`, `led-glow-warn`, `led-glow-fail`).
   - `PaletteCard.astro`: Swatch grids (RGB, Macbeth 24, grays), color pickers, hex inputs, and keyboard/display layout pickers.
   - `TelemetryCard.astro`: Real-time microsecond delta graphs, jitter variance σ, reaction histograms, FFT spectrum, and W3C Pointer/Keyboard event logs.
   - `InspectorCard.astro`: Low-level hardware inspection data (W3C PointerType, USB VID/PID, ITO trace noise, subpixel geometry).
   - `PassportCard.astro`: SHA-256 hardware health certificates, 30-day RMA inspectors, export ICC profile buttons, and receipt triggers.

2. Enforce the 5 Strict Rules of UI/UX Pro Max:
   - Rule 1 (Icons): STRICTLY NO emojis. Use SVG icons (Heroicons/Lucide) with fixed `viewBox="0 0 24 24"` and `w-5 h-5` / `w-6 h-6`.
   - Rule 2 (Feedback): Add `cursor-pointer` to all interactive cards and controls with smooth `transition-colors duration-200`.
   - Rule 3 (Hover Stability): DO NOT use scale transforms (`scale-105`) or layout shifting on hover. Use border/background/glow interpolation.
   - Rule 4 (Touch & Focus): Targets min 44x44px (`min-h-[44px] min-w-[44px]`), visible focus rings (`focus:ring-2 focus:ring-emerald-500/50`).
   - Rule 5 (Consistency): Dark glassmorphic styling (`bg-[#121215]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl`).

3. Construct the definitive 43-route component mapping matrix detailing the exact Right Sidebar component stack for every diagnostic, input, audio, utility, arcade, and database tool page.

4. Document your complete specifications and mapping matrix in `/Users/divyyadav/newws/.agents/explorer_phase2/handoff.md`.
5. Send a comprehensive summary message back to the parent orchestrator using `send_message`.

Constraints:
- Read-only regarding source codebase (`src/`). Write files ONLY to `/Users/divyyadav/newws/.agents/explorer_phase2/`.
