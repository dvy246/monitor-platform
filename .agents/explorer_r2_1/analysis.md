# R2 Investigation Report: Touch Canvas & Component Frame Fitting and FAB Mobile Visibility

## Executive Summary
This report presents a complete investigation of all visual diagnostic test canvas components and the Floating Action Menu (`FloatingActionMenu.astro`) within `monitor_test_hub`.
The primary objectives are:
1. Ensuring every visual diagnostic test canvas component dynamically fits within mobile viewports using the standard frame formula (`h-60 sm:h-[460px] min-h-[320px]`).
2. Ensuring `FloatingActionMenu.astro` (FAB) remains strictly hidden on mobile viewports (`hidden sm:flex`) so it NEVER obstructs test cards, color swatches, diagnostic buttons, or browser address bars on 320px–430px viewports under any state (including after exiting full-screen mode).

---

## 1. Canvas Frame Fitting Analysis

### 1.1 `UniversalScreenTestDeck.astro`
- **File Path**: `src/components/diagnostics/UniversalScreenTestDeck.astro`
- **Target Line**: 59
- **Current CSS Classes**:
  ```astro
  class:list={[
    "relative w-full rounded-xl border border-border-hairline cursor-crosshair overflow-hidden flex items-center justify-center transition-colors shadow-inner touch-none select-none",
    isHero ? "h-56 sm:h-80 md:h-96" : "h-60 sm:h-[460px] md:h-[540px]"
  ]}
  ```
- **Observations & Defect Analysis**:
  - In standard non-hero mode (`isHero === false`), the canvas height is set to `h-60 sm:h-[460px] md:h-[540px]`.
  - While it specifies `h-60` on mobile and `sm:h-[460px]`, it is missing the `min-h-[320px]` safety floor, allowing viewports under edge cases to shrink below usable touch target heights.
  - In hero mode (`isHero === true`), `h-56` (224px) lacks min-height constraints.
- **Required Modification**:
  Update line 59:
  ```astro
  isHero ? "h-60 sm:h-80 md:h-96 min-h-[320px]" : "h-60 sm:h-[460px] md:h-[540px] min-h-[320px]"
  ```

### 1.2 `DeviceDeadPixelInspector.astro`
- **File Path**: `src/components/diagnostics/DeviceDeadPixelInspector.astro`
- **Target Line**: 94
- **Current CSS Classes**:
  ```astro
  <div
    id="device-test-canvas"
    class="relative w-full h-80 sm:h-96 rounded-xl bg-white border border-border-hairline cursor-crosshair overflow-hidden flex items-center justify-center transition-colors shadow-inner touch-none"
  >
  ```
- **Observations & Defect Analysis**:
  - Uses `h-80 sm:h-96` (320px on mobile, 384px on tablet/desktop).
  - It does NOT implement `h-60 sm:h-[460px] min-h-[320px]`. On mobile viewports (320px–430px), rigid `h-80` occupies excessive vertical height while limiting desktop canvas area.
- **Required Modification**:
  Replace `h-80 sm:h-96` on line 94 with `h-60 sm:h-[460px] min-h-[320px]`:
  ```astro
  class="relative w-full h-60 sm:h-[460px] min-h-[320px] rounded-xl bg-white border border-border-hairline cursor-crosshair overflow-hidden flex items-center justify-center transition-colors shadow-inner touch-none"
  ```

### 1.3 `TouchMatrixTester.astro`
- **File Path**: `src/components/diagnostics/TouchMatrixTester.astro`
- **Target Line**: 170
- **Current CSS Classes**:
  ```astro
  <div class="relative min-h-[320px] sm:min-h-[480px] md:min-h-[560px] h-[50dvh] sm:h-[60dvh] rounded-2xl border border-border-hairline overflow-hidden bg-[#08080a] shadow-2xl transition-colors">
  ```
- **Observations & Defect Analysis**:
  - Uses `h-[50dvh] sm:h-[60dvh]` with dynamic viewport height units (`dvh`).
  - Mobile browser URL bars collapsing and expanding cause dynamic height shifts, resulting in layout instability during multi-touch gestures.
- **Required Modification**:
  Standardize line 170 with `h-60 sm:h-[460px] min-h-[320px]`:
  ```astro
  <div class="relative w-full h-60 sm:h-[460px] min-h-[320px] rounded-2xl border border-border-hairline overflow-hidden bg-[#08080a] shadow-2xl transition-colors">
  ```

### 1.4 `WhiteScreenCanvas.astro`
- **File Path**: `src/components/diagnostics/WhiteScreenCanvas.astro`
- **Target Line**: 68
- **Current CSS Classes**:
  ```astro
  <div
    id="lighting-preview-box"
    class="relative w-full h-60 sm:h-80 md:h-96 rounded-xl border border-border-hairline flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer overflow-hidden group shadow-inner"
    style={`background-color: ${initialColor};`}
  >
  ```
- **Observations & Defect Analysis**:
  - Uses `h-60 sm:h-80 md:h-96`.
  - Lacks `min-h-[320px]` safety floor on mobile, and restricts desktop height to 384px (`md:h-96`).
- **Required Modification**:
  Replace `h-60 sm:h-80 md:h-96` on line 68 with `h-60 sm:h-[460px] min-h-[320px]`:
  ```astro
  class="relative w-full h-60 sm:h-[460px] min-h-[320px] rounded-xl border border-border-hairline flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer overflow-hidden group shadow-inner"
  ```

### 1.5 `KeyboardTesterCanvas.astro`
- **File Path**: `src/components/diagnostics/KeyboardTesterCanvas.astro`
- **Target Line**: 86-93
- **Current CSS Classes**:
  ```astro
  <div class="w-full overflow-x-auto pb-2 touch-pan-x">
    <div id="keyboard-visual-grid" class="min-w-[840px] space-y-1.5 p-4 rounded-xl bg-bg-canvas border border-border-subtle select-none">
  ```
- **Observations & Defect Analysis**:
  - Uses `min-w-[840px]` inside an `overflow-x-auto pb-2 touch-pan-x` horizontal scroll container.
  - While horizontal touch scrolling is properly enabled for mobile 104-key ANSI/Mac key matrix layouts, the scroll wrapper container should enforce `min-h-[320px]` for touch target usability on small mobile devices.
- **Required Modification**:
  Ensure the parent scroll wrapper has `min-h-[320px]` and `max-w-full`:
  ```astro
  <div class="w-full max-w-full overflow-x-auto pb-2 touch-pan-x min-h-[320px]">
  ```

### 1.6 `OledBurnInAnalyzer.astro`
- **File Path**: `src/components/diagnostics/OledBurnInAnalyzer.astro`
- **Target Line**: 172
- **Current CSS Classes**:
  ```astro
  <div id="uniformity-canvas-container" class="relative w-full h-52 bg-[#08080a] rounded-lg border border-border-hairline overflow-hidden flex items-center justify-center">
  ```
- **Observations & Defect Analysis**:
  - Uses fixed height `h-52` (208px) across all viewports.
  - On mobile screens (320px–430px), 208px is small and lacks the `min-h-[320px]` touch canvas frame standard. On desktop, 208px is far too small for inspecting 5%/10% low-gray OLED uniformity banding.
- **Required Modification**:
  Replace `h-52` on line 172 with `h-60 sm:h-[460px] min-h-[320px]`:
  ```astro
  <div id="uniformity-canvas-container" class="relative w-full h-60 sm:h-[460px] min-h-[320px] bg-[#08080a] rounded-lg border border-border-hairline overflow-hidden flex items-center justify-center">
  ```

### 1.7 `VrrStutterGenerator.astro`
- **File Path**: `src/components/diagnostics/VrrStutterGenerator.astro`
- **Target Line**: 156–157
- **Current CSS Classes**:
  ```astro
  <div class="min-h-[400px] w-full rounded-xl border border-border-hairline bg-[#08080a] relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
    <canvas id="vrr-generator-canvas" class="w-full h-[400px] block" aria-label="VRR vertical sweep visual pattern display canvas"></canvas>
  ```
- **Observations & Defect Analysis**:
  - Fixed `h-[400px]` forces 400px height on mobile devices, causing vertical viewport crowding on 320px-393px screens.
- **Required Modification**:
  Replace `min-h-[400px]` / `h-[400px]` with standard dynamic frame fitting `h-60 sm:h-[460px] min-h-[320px]`:
  ```astro
  <div class="w-full h-60 sm:h-[460px] min-h-[320px] rounded-xl border border-border-hairline bg-[#08080a] relative overflow-hidden shadow-2xl flex flex-col items-center justify-center">
    <canvas id="vrr-generator-canvas" class="w-full h-full block" aria-label="VRR vertical sweep visual pattern display canvas"></canvas>
  ```

---

## 2. Floating Action Menu (FAB) Mobile Visibility & Positioning

### 2.1 Component Structure & Placement
- **File Path**: `src/components/ui/FloatingActionMenu.astro`
- **Container Line**: 15
- **Current Container Markup**:
  ```astro
  <div 
    id="floating-fab-container" 
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-mono text-xs select-none pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)] transition-all duration-300 transform-gpu hidden sm:flex"
  >
  ```
- **Current Positioning Assessment**:
  - `fixed bottom-4 right-4 sm:bottom-6 sm:right-6`: Correctly offset from viewport edges.
  - `pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]`: Safe-area inset handling for iOS gesture bars and notch regions is in place.
  - `hidden sm:flex`: Hides the FAB container on mobile viewports (< 640px) and displays it on `sm` (>= 640px) viewports.

### 2.2 Critical Edge-Case Bug Discovered in JavaScript Logic
- **Target Lines**: 135–144 in `FloatingActionMenu.astro`
- **Current JS Code**:
  ```ts
  function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
    if (fabContainer) {
      if (isFullscreen) {
        fabContainer.classList.add('hidden');
      } else {
        fabContainer.classList.remove('hidden');
      }
    }
  }
  ```
- **Bug Mechanism**:
  1. The initial HTML class is `hidden sm:flex`. On mobile (<640px), `hidden` (`display: none`) keeps the FAB hidden. On desktop (>=640px), `sm:flex` overrides `hidden`.
  2. When the user enters fullscreen mode, `handleFullscreenChange` calls `fabContainer.classList.add('hidden')`.
  3. When the user **exits fullscreen mode**, `handleFullscreenChange` calls `fabContainer.classList.remove('hidden')`.
  4. **Consequence**: Calling `classList.remove('hidden')` removes the base `hidden` class from the DOM element entirely. When exiting fullscreen on a mobile viewport (<640px), the element no longer has `hidden`, so it falls back to block/flex display on mobile! This causes the FAB button to suddenly appear on mobile viewports after any fullscreen test execution!

### 2.3 Required Fix for `FloatingActionMenu.astro`
Replace `classList.add('hidden')` and `classList.remove('hidden')` with Tailwind's important modifier class `!hidden`:
```ts
function handleFullscreenChange() {
  const isFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
  if (fabContainer) {
    if (isFullscreen) {
      fabContainer.classList.add('!hidden');
    } else {
      fabContainer.classList.remove('!hidden');
    }
  }
}
```
When `!hidden` is added, it hides the FAB during fullscreen mode on all screen sizes. When `!hidden` is removed upon exiting fullscreen, the base class `hidden sm:flex` is preserved intact. Thus, mobile viewports (<640px) remain hidden via `hidden`, while tablet/desktop viewports (>=640px) display the FAB via `sm:flex`.

---

## 3. Summary of Exact File Modifications Required

| # | File Path | Line # | Current Code / Issue | Modification / Fix |
|---|-----------|--------|----------------------|-------------------|
| 1 | `src/components/diagnostics/UniversalScreenTestDeck.astro` | 59 | `isHero ? "h-56 sm:h-80 md:h-96" : "h-60 sm:h-[460px] md:h-[540px]"` | Append `min-h-[320px]` to standard and hero mode classes |
| 2 | `src/components/diagnostics/DeviceDeadPixelInspector.astro` | 94 | `h-80 sm:h-96` | Replace with `h-60 sm:h-[460px] min-h-[320px]` |
| 3 | `src/components/diagnostics/TouchMatrixTester.astro` | 170 | `h-[50dvh] sm:h-[60dvh]` with dynamic dvh units | Replace with `h-60 sm:h-[460px] min-h-[320px]` |
| 4 | `src/components/diagnostics/WhiteScreenCanvas.astro` | 68 | `h-60 sm:h-80 md:h-96` | Replace with `h-60 sm:h-[460px] min-h-[320px]` |
| 5 | `src/components/diagnostics/KeyboardTesterCanvas.astro` | 86 | Scroll container missing explicit `min-h-[320px]` | Add `min-h-[320px] max-w-full` to scroll wrapper |
| 6 | `src/components/diagnostics/OledBurnInAnalyzer.astro` | 172 | `h-52` (208px fixed height) | Replace with `h-60 sm:h-[460px] min-h-[320px]` |
| 7 | `src/components/diagnostics/VrrStutterGenerator.astro` | 156-157 | `min-h-[400px]` and `h-[400px]` | Replace with `h-60 sm:h-[460px] min-h-[320px]` |
| 8 | `src/components/ui/FloatingActionMenu.astro` | 138-142 | `classList.remove('hidden')` strips base `hidden` class on mobile after exiting fullscreen | Change JS fullscreen handler to add/remove `!hidden` class |
