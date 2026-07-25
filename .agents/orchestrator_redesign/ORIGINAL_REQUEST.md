# Original User Request

## 2026-07-23T18:30:11Z

Goal: Redesign the entire diagnostic experience of DisplayTestOnline.com into a premium engineering tool by extracting UX principles from ScreenTester.io and implementing a unified, highly reusable component system (Left Canvas + Right Sidebar), without altering the core visual identity or the homepage.

Working directory: `/Users/divyyadav/newws/monitor_test_hub`
Integrity mode: development

## Requirements

### R1. Cross-Functional Design Analysis
Act as a Product Design Review Board. Audit every existing diagnostic page (Visual Display, Touch Screen, Audio & Input, and Utility pages) and identify inconsistencies. Study ScreenTester.io strictly to extract UX principles (information hierarchy, progressive disclosure, workflow, visual rhythm) without copying their layouts. Generate a complete redesign plan (Phase 1). **Wait for approval before proceeding.**

### R2. Unified Component System Architecture
Design a new reusable component system for the Right Sidebar across all tests, including: InfoCard, MetricCard, ShortcutCard, ConfigurationCard, StatusCard, PaletteCard, TelemetryCard, and InspectorCard. Retain the existing dark theme, typography, hero language, and technical branding. Create a map of where each component applies (Phase 2). **Wait for approval before proceeding.**

### R3. Strict Incremental Implementation & Verification
Implement the redesign incrementally (one feature group at a time). For every change, you must rigorously verify zero regressions. If a regression is detected, you must roll back the change immediately and debug (Phase 3). 

### R4. Automated Visual Regression Testing
Create new Playwright visual regression scripts to capture and compare "Before" and "After" screenshots of the UI. Use these scripts to objectively verify that no visual, layout, or hydration regressions exist between your modifications and the baseline implementation. 

### R5. Local Development Constraints
Do NOT deploy automatically. Do NOT push commits. Do NOT modify production. All work must be verified via `npm run build` and `npm run preview` in the local environment, checked via Playwright visual verification, and presented for explicit approval before moving forward.

## Acceptance Criteria

### Technical & Verification Integrity
- [ ] New Playwright visual regression test scripts are created and successfully execute Before/After screenshot comparisons.
- [ ] `npm run build` completes successfully with zero warnings or errors on every iteration.
- [ ] `npm run preview` matches the development environment output identically.
- [ ] Zero browser console errors or runtime exceptions across all modified routes.

### Design Adherence
- [ ] Visual identity (colors, typography, hero language, animations) remains identical to the original baseline.
- [ ] All diagnostic pages adhere to the new Left Canvas / Right Sidebar structural paradigm.
- [ ] Components (InfoCard, MetricCard, etc.) are reused systematically rather than hardcoded per page.
- [ ] WCAG 2.2 AA accessibility standards are met (visible focus, screen reader labels, keyboard navigation, 44px touch targets).
- [ ] No layout shifts, horizontal scrolling, or overflow on Desktop, Laptop, Tablet, and Mobile viewports.
