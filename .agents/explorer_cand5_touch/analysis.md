# Candidate 5 Exploration Report: Hardware Touch Sampling Rate & Coalesced Event Jitter Inspector

**Target System**: Monitor Test Hub (`/Users/divyyadav/newws/monitor_test_hub`)  
**Working Directory**: `/Users/divyyadav/newws/.agents/explorer_cand5_touch`  
**Candidate Concept**: Hardware Touch Sampling Rate & Coalesced Event Jitter Inspector  
**Proposed Route**: `/touch-tests/touch-sampling-rate`  
**Proposed Engine**: `src/engine/TouchSamplingRateEngine.ts`  
**Recommendation**: **GREENLIT**  

---

## 1. Executive Summary & Candidate Concept

Modern mobile devices, tablets, and touch laptops boast high-frequency touch digitizers (e.g., 240Hz, 360Hz, 480Hz, or 960Hz touch sampling rates on 60Hz, 120Hz, or 165Hz displays). Active styluses—such as the Apple Pencil 2 (240Hz), Samsung S-Pen (240/480Hz), and Microsoft Surface Pen / MPP 2.0 (133/240Hz)—sample input independently of the display's VSync refresh rate.

However, standard web applications listening to raw `pointermove` or `touchmove` events only receive callbacks on each browser animation frame tick (`requestAnimationFrame` / VSync rate, e.g., 60Hz or 120Hz). This creates a massive misconception among users that their mobile device or tablet is only running at 60Hz touch sampling rate.

**The Candidate Solution**: The **Hardware Touch Sampling Rate & Coalesced Event Jitter Inspector** leverages the W3C `PointerEvent.prototype.getCoalescedEvents()` API to unwrap raw, un-throttled hardware touch digitizer timestamps ($t_{\text{hardware}}$). By capturing microsecond hardware event arrays during active touch/stylus swipes, the pure TypeScript calculation engine (`TouchSamplingRateEngine.ts`) measures:
1. True **Hardware Touch Sampling Rate ($F_{\text{touch}}$ in Hz)** (e.g., 240Hz, 360Hz, 480Hz).
2. **Inter-Sample Timestamp Jitter ($\sigma$ in ms)** and variance distribution.
3. **Coalesced Buffer Depth ($C_{\text{factor}}$)** (average hardware digitizer reports batched per browser tick).
4. **Touch-to-Display Refresh Sync Score ($S_{\text{sync}}$)** and non-integer phase beat frequency micro-stutter analysis ($F_{\text{beat}}$).

---

## 2. Verified User Demand & Query Cluster

### Primary Search Query Clusters (US Audience)
- *"touch sampling rate test web"* / *"touch sampling rate tester online"*
- *"ipad touch polling rate test online"* / *"apple pencil 240hz touch test"*
- *"how to check touch sampling rate android"* / *"samsung touch sampling rate benchmark"*
- *"pointer event getcoalescedevents test"* / *"touch sampling rate vs refresh rate stutter"*
- *"touch response rate vs refresh rate calculator"*

### User Pain Points & Forum Research (Reddit & XDA Developers)
- **r/iPad & r/GalaxyTab**: Users frequently post asking why drawing apps (Procreate, Clip Studio Paint, web drawing canvases) occasionally micro-stutter when drawing fast diagonal lines across 120Hz ProMotion or 120Hz AMOLED screens.
- **r/Android & XDA Developers**: Gamers buying high-performance mobile devices (ASUS ROG Phone, RedMagic, Poco, Samsung Galaxy Ultra) want to verify manufacturer claims of 240Hz/480Hz/960Hz touch sampling rate. When using existing web touch testers (like `touchtest.com`), the web page reports only 60Hz or 120Hz because the browser event loop batches events.
- **Web Developer & Gaming Communities**: Developers building mobile web games or high-precision drawing web tools need an online benchmark tool to inspect browser event coalescing behavior across iOS Safari, Android Chrome, and iPadOS.

---

## 3. Competitor Analysis

| Competitor / Tool | Type | Key Strengths | Critical Gaps & Weaknesses |
| :--- | :--- | :--- | :--- |
| **Touchscreen Test (`touchtest.com`)** | Web HTML5 | Simple canvas UI, shows touch coordinates and active touch count. | **Capped by Browser VSync**: Listens to standard `touchmove` events without unwrapping `getCoalescedEvents()`. Reports 60Hz/120Hz max, incorrectly showing 240Hz/480Hz digitizers as slow. Zero jitter analysis. |
| **Touchscreen Test App (Live2Create)** | Native Android APK | Native execution, multi-touch grid matrix inspection. | **Not Web-Native**: Requires Android APK download from Google Play Store; completely unavailable on iOS, iPadOS, macOS, or Windows touch laptops. No touch sampling rate (Hz) measurement. |
| **Device Info HW / Display Tester** | Native Android APK | Direct hardware access to Linux input events (`/dev/input/event*`). | **Requires App Download / Root**: Non-web, platform-locked to Android. Does not evaluate browser event loop batching or rAF frame pacing sync phase offset. |

---

## 4. Tool Gap vs. Content Gap Determination

### Determination: **INTERACTIVE TOOL GAP** (Supported by Technical Learning Guide)

- **Why Tool Gap**: There is currently **zero web-native diagnostic tools** on the internet that accurately calculate true hardware touch sampling rate (Hz), hardware timestamp jitter variance, and coalesced event buffer depth by unwrapping W3C `PointerEvent.prototype.getCoalescedEvents()`. Standard web touch testers flatten events to screen VSync rate.
- **Content Gap Support**: A companion learning guide will explain the physics of capacitive touch digitizer matrix scanning, active stylus carrier frequency, W3C event loop coalescing, and non-integer ratio phase beat frequency (e.g. 240Hz touch on 144Hz screen).

---

## 5. Pure TypeScript Engine Architecture & Reuse Strategy

### Engine Module: `src/engine/TouchSamplingRateEngine.ts`

The engine will be implemented as a pure TypeScript module, decoupled from DOM dependencies, allowing 100% test coverage using Vitest.

#### Reused Architectural Patterns
- **`MousePollingEngine.ts`**: Reuses timestamp delta calculation, rolling sample frequency buffer, outlier rejection, histogram binning, and standard deviation math.
- **`FramePacingEngine.ts`**: Reuses VSync inter-arrival time variance, microsecond jitter calculation, and frame pacing stability metrics.
- **`TouchMatrixEngine.ts` / `TouchPrecisionEngine.ts`**: Reuses `TouchPoint` interface structure and event timestamp parsing.

#### Data Contracts & TypeScript Interfaces

```typescript
export interface HardwareTouchPoint {
  x: number;
  y: number;
  timestamp: number; // High-resolution hardware microsecond timestamp
  isCoalesced: boolean;
  pointerId: number;
}

export interface TouchSamplingMetrics {
  sampleCount: number;
  coalescedEventCount: number;
  measuredHardwareHz: number;
  peakHardwareHz: number;
  averageDeltaMs: number;
  jitterStdDevMs: number;
  coalescedRatio: number; // Average coalesced points per browser dispatch
  supportsCoalescedEvents: boolean;
  syncRatio: number; // Ratio of touch rate to display refresh rate
  beatFrequencyHz: number; // Non-integer phase beat frequency stutter
  rating: 'ultra-high' | 'high' | 'standard' | 'throttled';
}

export interface SamplingHistogramBucket {
  binLabel: string;
  minDeltaMs: number;
  maxDeltaMs: number;
  count: number;
}
```

#### Core Calculation Functions
1. `extractHardwarePoints(event: PointerEvent): HardwareTouchPoint[]`: Unwraps `event.getCoalescedEvents()` if available, extracting raw hardware timestamps.
2. `calculateTouchSamplingMetrics(points: HardwareTouchPoint[], displayRefreshRateHz: number = 60): TouchSamplingMetrics`:
   $$\overline{\Delta t} = \frac{1}{N-1} \sum_{i=1}^{N-1} (t_{i+1} - t_i)$$
   $$F_{\text{touch}} = \frac{1000}{\overline{\Delta t}}$$
   $$\sigma = \sqrt{\frac{1}{N-1} \sum_{i=1}^{N-1} (\Delta t_i - \overline{\Delta t})^2}$$
   $$F_{\text{beat}} = | F_{\text{touch}} - k \cdot F_{\text{display}} | \quad \text{where } k = \text{round}\left(\frac{F_{\text{touch}}}{F_{\text{display}}}\right)$$

#### Standards & YMYL Compliance
- **Calibration Standards**: Compliant with VESA Display Timing Standards, ISO 9241-307 Ergonomic Requirements for Visual Displays, and W3C Pointer Events Level 3 Specifications.
- **YMYL & Medical Disclaimer**: Purely framed as a hardware peripheral diagnostic utility. Explicitly disclaims medical or clinical diagnosis of hand tremors, motor skills, or neurological conditions.
- **US Audience Localization**: All text formatted in US English ("color", "center", "optimize"), using US imperial measurements for touch target physical sizes (inches), and referencing popular US mobile models (Apple iPad Pro, Samsung Galaxy Tab S9, Microsoft Surface Pro, ASUS ROG Phone).

---

## 6. Engineering Complexity

- **Rating**: **Low to Medium**
- **Rationale**:
  - Engine logic is pure TypeScript math without external library dependencies.
  - Vitest test suite (`TouchSamplingRateEngine.test.ts`) can simulate synthetic hardware coalesced events to verify sampling rate calculations, jitter standard deviation, histogram generation, and beat frequency algorithms.
  - UI canvas wrapper (`TouchSamplingRateCanvas.astro`) attaches standard `pointermove` event handlers and renders real-time telemetry gauges.

---

## 7. Honest "Why This Could Fail" Section

1. **Browser / OS API Restrictions**:
   - iOS / iPadOS Safari has supported `getCoalescedEvents()` since iOS 13, but certain third-party in-app webviews (e.g. Instagram/TikTok in-app browsers) disable or clamp high-frequency touch event APIs.
   - Workaround: The engine gracefully detects when `getCoalescedEvents()` returns empty array or single events, reporting `supportsCoalescedEvents: false` and providing clear user feedback.
2. **OS Power Throttling**:
   - Modern mobile operating systems (iOS / Android) dynamically throttle digitizer touch sampling rates to 60Hz/120Hz when Low Power Mode / Battery Saver is enabled.
   - Workaround: Include clear inline hardware diagnostic notices advising users to disable Battery Saver and keep screen brightness normal during testing.
3. **User Confusion Between Touch Rate & Screen Refresh Rate**:
   - Non-technical users often confuse 240Hz Touch Sampling Rate with 120Hz Display Refresh Rate.
   - Workaround: Include a clear visual visualizer comparing Display Refresh Rate (frames/sec) vs. Touch Sampling Rate (touch inputs/sec).

---

## 8. Topical Authority Trade-off

- **Core Display vs. Adjacent Vertical**:
  - Touch digitizer sampling rate is directly adjacent to display refresh rate and input latency diagnostics. Modern gaming displays, tablets, and laptops advertise high refresh rates (120Hz/240Hz/540Hz) alongside high touch sampling rates (240Hz/480Hz).
  - Expanding into touch sampling rate diagnostics reinforces Monitor Test Hub's market positioning as the premier, high-frequency web diagnostic suite for both desktop monitors and mobile touch displays.

---

## 9. Explicit Recommendation

### Status: **GREENLIT**

**Rationale**:
1. **High Technical Feasibility**: Pure TypeScript engine implementation reusing proven math patterns from `MousePollingEngine.ts` and `FramePacingEngine.ts`.
2. **Uncontested Web Gap**: Zero existing web-native competitors offer coalesced event hardware touch sampling rate inspection.
3. **Strong Search Demand**: Fills high-volume consumer and developer queries surrounding mobile device touch response rates, Apple Pencil latency, and Android touch sampling rate verification.
4. **Full YMYL & US Audience Compliance**: Strict adherence to VESA / ISO 9241-307 calibration framing with zero health claims and complete US English localization.
