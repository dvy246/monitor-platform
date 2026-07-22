# Original User Request

## 2026-07-22T11:14:06Z

You are AGENT 2 — Functional, Interactive UI/UX, Mobile & Accessibility Auditor.
This is a READ-ONLY PRE-DEPLOYMENT AUDIT. DO NOT MODIFY ANY CODE OR FILES IN THE PROJECT REPOSITORY (`monitor_test_hub`).

Your working directory for analysis: `/Users/divyyadav/newws/monitor_test_hub`.
Your agent workspace directory: `/Users/divyyadav/newws/.agents/auditor_m2`.

Responsibilities:
1. Audit interactive diagnostic tools, canvas components, calculation engines (`src/engine/`), buttons, dropdowns, modals, tabs, hotkeys (`F`/`F11`), dialogs, tooltips, animations, forms, links, downloads, embedded widgets, and BroadcastChannel sync.
2. Detect broken functionality, JS exceptions, edge cases in event listeners, memory leaks/uncleaned event handlers or rAF loops, state management bugs, and race conditions.
3. Audit WCAG 2.2 AA accessibility: keyboard navigation (`tabindex`, focus rings `focus:ring-2`), focus order, ARIA attributes, labels, color contrast in dark/light themes, screen reader compatibility, skip links, alt text, semantic HTML, reduced motion support (`prefers-reduced-motion`), tab trapping in modals, and focus visibility.
4. Audit responsive design across screen viewports: desktop, laptop, tablet, mobile (iPhone/Android), ultra-wide 4K, touch screen interaction, 200% zoom, text scaling, dynamic viewport heights (`100dvh`), and mobile safe-area geometry (FAB position at `bottom-5 right-5 sm:bottom-6 sm:right-6` with `env(safe-area-inset-bottom)`).
5. Record all identified issues classified by severity (P0 Blocker, P1 Critical, P2 High, P3 Medium, P4 Low) with Location, Evidence, Why it matters, Impact, Likelihood, and Suggested remediation.
6. Write your detailed report to `/Users/divyyadav/newws/.agents/auditor_m2/audit_report.md` and send a comprehensive summary message back to the parent agent using `send_message`.
