## 2026-07-21T18:58:29Z
You are teamwork_preview_explorer 1 for Milestone 5: Display HDR Peak Brightness & Tone Mapping Clipping Test.
Your metadata working directory is `/Users/divyyadav/newws/.agents/explorer_m5_1/`.
The codebase directory is `/Users/divyyadav/newws/monitor_test_hub`.

Task:
1. Explore existing engines in `src/engine/` (`InputLagEngine.ts`, `OledBurnInEngine.ts`, `VrrEngine.ts`, `TouchMatrixEngine.ts`, `IccExporter.ts`).
2. Inspect `PROJECT.md`, `ORIGINAL_REQUEST.md`, and `plan.md` in `/Users/divyyadav/newws/.agents/orchestrator_pseo/`.
3. Design the technical specification for `src/engine/HdrTestEngine.ts` and `src/engine/HdrTestEngine.test.ts`:
   - Pure math for PQ curve / EOTF (SMPTE ST 2084) nit-to-normalized signal value conversion, 10-bit RGB color step calculation, clipping nits threshold calculation (100 to 4000 nits).
   - Tone mapping roll-off simulation functions (HGIG hard-clip, static roll-off, dynamic compression).
   - ABL (Auto Brightness Limiter) window size brightness calculation (1%, 5%, 10%, 25%, 100% APL windows).
4. Report detailed recommendations in `/Users/divyyadav/newws/.agents/explorer_m5_1/handoff.md` and send a message back to parent.
