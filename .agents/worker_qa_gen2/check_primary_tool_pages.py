import os
import glob
import re

pages_dir = "/Users/divyyadav/newws/monitor_test_hub/src/pages"

primary_tool_files = [
    "refresh-rate-test.astro",
    "monitor-color-calibration.astro",
    "sound-test.astro",
    "white-screen/index.astro",
    "keyboard-tester/index.astro",
    "mouse-test/index.astro",
    "mouse-test/[slug].astro",
    "controller-test/index.astro",
    "benchmarks/pc-bottleneck.astro",
    "benchmarks/wire-gauge-calculator.astro",
    "benchmarks/3d-print-cost.astro",
    "benchmarks/gamepad-drift.astro",
    "benchmarks/room-mode-calculator.astro",
    "benchmarks/solar-tilt-calculator.astro",
    "benchmarks/wireless-latency.astro",
    "audio-tests/mic-noise-floor.astro",
    "audio-tests/speaker-frequency.astro",
    "arcade/color-match-alchemist.astro",
    "arcade/ghosting-invaders.astro",
    "arcade/lag-reflex-sniper.astro",
    "arcade/touch-matrix-defusal.astro"
]

for dt in glob.glob(os.path.join(pages_dir, "display-tests/*.astro")):
    rel = os.path.relpath(dt, pages_dir)
    if rel not in primary_tool_files:
        primary_tool_files.append(rel)

for tt in glob.glob(os.path.join(pages_dir, "touch-tests/*.astro")):
    rel = os.path.relpath(tt, pages_dir)
    if rel not in primary_tool_files:
        primary_tool_files.append(rel)

print(f"Checking {len(primary_tool_files)} primary tool pages...")

results = []
all_passed = True

for rel_path in sorted(primary_tool_files):
    full_path = os.path.join(pages_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"WARNING: File {rel_path} does not exist")
        continue

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    has_bento = "MasterBentoDiagnosticSuite" in content
    has_step = "StepWorkflowSection" in content
    has_panel = "PanelTypeBreakdownSection" in content
    has_faq_section = "FAQSection" in content
    has_layout_faqs = "faqs=" in content or "faqs: faqs" in content or "faqs }" in content or "faqs={" in content or "faqs: cat.faqs" in content or "faqs={cat.faqs}" in content

    # Find faqs count by counting question/q keys
    q_matches = re.findall(r'\{\s*(?:question|q)\s*:', content)

    # In [slug] files, multiple categories each have 10 FAQs, e.g. 5 categories * 10 = 50 total Qs or at least 10 per category
    faq_count = len(q_matches)
    faq_ok = (faq_count >= 10 and faq_count % 10 == 0) or (faq_count == 10)

    status = (has_bento and has_step and has_panel and has_faq_section and has_layout_faqs and faq_ok)
    if not status:
        all_passed = False

    results.append({
        "file": rel_path,
        "bento": has_bento,
        "step": has_step,
        "panel": has_panel,
        "faq_sec": has_faq_section,
        "layout_faqs": has_layout_faqs,
        "faq_count": faq_count,
        "pass": status
    })

print("\n--- DETAILED CHECK RESULTS ---")
for r in results:
    flag = "PASS" if r["pass"] else "FAIL"
    print(f"[{flag}] {r['file']}: Bento={r['bento']}, Step={r['step']}, Panel={r['panel']}, FAQSec={r['faq_sec']}, LayoutFaqs={r['layout_faqs']}, TotalFAQs={r['faq_count']}")

print(f"\nOVERALL PRIMARY TOOL PAGE STATUS: {'100% PASS' if all_passed else 'FAIL'}")
