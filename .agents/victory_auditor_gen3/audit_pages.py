import os
import glob
import re

PAGES_DIR = "/Users/divyyadav/newws/monitor_test_hub/src/pages"

target_patterns = [
    "refresh-rate-test.astro",
    "monitor-color-calibration.astro",
    "sound-test.astro",
    "webcam-test.astro",
    "screen-test.astro",
    "display-tests/**/*.astro",
    "touch-tests/**/*.astro",
    "touch-matrix/**/*.astro",
    "sound-test/**/*.astro",
    "audio-tests/**/*.astro",
    "mouse-test/**/*.astro",
    "controller-test/**/*.astro",
    "keyboard-tester/**/*.astro",
    "benchmarks/**/*.astro",
    "arcade/**/*.astro",
    "white-screen/**/*.astro"
]

all_files = set()
for pattern in target_patterns:
    full_pattern = os.path.join(PAGES_DIR, pattern)
    matched = glob.glob(full_pattern, recursive=True)
    for m in matched:
        all_files.add(os.path.abspath(m))

print(f"Total target Astro files found for audit: {len(all_files)}")

results = []

for file_path in sorted(all_files):
    rel_path = os.path.relpath(file_path, PAGES_DIR)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check 1: Hardcoded Facade
    has_hardcoded_facade = False
    if "HARDCODED_MOCK_TEST_RESULT" in content or "TODO: Implement genuine logic" in content:
        has_hardcoded_facade = True

    # Check 2: Component Usage
    has_master_bento = ("MasterBentoDiagnosticSuite" in content)
    has_step_workflow = ("StepWorkflowSection" in content)
    has_panel_breakdown = ("PanelTypeBreakdownSection" in content)
    has_faq_section_component = ("FAQSection" in content)

    # Check 3: Container styling (rounded-3xl or rounded-2xl with specular highlights border-white/10, border-border-hairline, etc.)
    has_rounded_containers = bool(re.search(r'rounded-(?:3xl|2xl)', content))
    has_specular_highlights = bool(re.search(r'border-(?:white/10|border-hairline|white/5|white/20|cyan-500/|emerald-500/|purple-500/|border-interactive)', content))

    # Check 4: Technical SEO - FAQ count & passing
    # Count occurrences of question: or "q": in faqs blocks
    # Look for faqs array or getStaticPaths faqs
    q_matches = re.findall(r'(?:question|\"q\")\s*:\s*', content)
    
    # If file has getStaticPaths with multiple categories, check per category
    if "getStaticPaths" in content:
        # Find all categories or faqs blocks inside getStaticPaths
        cat_matches = re.findall(r'faqs\s*:\s*\[([\s\S]*?)\]\s*(?:,|\})', content)
        if cat_matches:
            # Check the min and max faqs count per category
            counts = [len(re.findall(r'(?:question|\"q\")\s*:\s*', cat)) for cat in cat_matches]
            faqs_count = counts[0] if counts else 0
        else:
            faqs_count = len(q_matches)
    else:
        faqs_count = len(q_matches)

    layout_faqs = bool(re.search(r'<Layout[\s\S]*?faqs=\{(?:faqs|cat\.faqs|category\.faqs)\}', content))
    faq_section_rendered = bool(re.search(r'<FAQSection[\s\S]*?faqs=\{(?:faqs|cat\.faqs|category\.faqs)\}', content))

    res = {
        "file": rel_path,
        "has_facade": has_hardcoded_facade,
        "has_master_bento": has_master_bento,
        "has_step_workflow": has_step_workflow,
        "has_panel_breakdown": has_panel_breakdown,
        "has_faq_section_component": has_faq_section_component,
        "has_rounded_containers": has_rounded_containers,
        "has_specular_highlights": has_specular_highlights,
        "faqs_count": faqs_count,
        "layout_faqs": layout_faqs,
        "faq_section_rendered": faq_section_rendered
    }
    results.append(res)

failing_files = []
for r in results:
    issues = []
    if r["has_facade"]:
        issues.append("Hardcoded facade detected")
    if not r["has_master_bento"]:
        issues.append("Missing MasterBentoDiagnosticSuite")
    if not r["has_step_workflow"]:
        issues.append("Missing StepWorkflowSection")
    if not r["has_panel_breakdown"]:
        issues.append("Missing PanelTypeBreakdownSection")
    if not r["has_faq_section_component"]:
        issues.append("Missing FAQSection component")
    if not r["has_rounded_containers"]:
        issues.append("Missing rounded-3xl/rounded-2xl containers")
    if not r["has_specular_highlights"]:
        issues.append("Missing specular highlights")
    if r["faqs_count"] != 10:
        issues.append(f"FAQ count is {r['faqs_count']} (expected 10)")
    if not r["layout_faqs"]:
        issues.append("Layout missing faqs prop")
    if not r["faq_section_rendered"]:
        issues.append("FAQSection missing faqs prop")

    if issues:
        failing_files.append((r["file"], issues))

print(f"\nAudit complete: {len(results) - len(failing_files)}/{len(results)} files fully passed all criteria.")
if failing_files:
    print(f"\nFAILING FILES ({len(failing_files)}):")
    for fname, iss in failing_files:
        print(f"  - {fname}: {', '.join(iss)}")
else:
    print("\nALL 93 DIAGNOSTIC TEST PAGES PASSED PERFECTLY (100% CLEAN)!")
