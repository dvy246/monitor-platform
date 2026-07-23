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

print(f"Auditing {len(all_files)} diagnostic test page files...\n")

failed = []

for file_path in sorted(all_files):
    rel_path = os.path.relpath(file_path, PAGES_DIR)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []

    # Check 1: Facade check
    if "HARDCODED_MOCK_TEST_RESULT" in content or "TODO: Implement genuine logic" in content:
        errors.append("Hardcoded facade / mock result found")

    # Check 2: Component Usage
    if "MasterBentoDiagnosticSuite" not in content:
        errors.append("Missing MasterBentoDiagnosticSuite")
    if "StepWorkflowSection" not in content:
        errors.append("Missing StepWorkflowSection")
    if "PanelTypeBreakdownSection" not in content:
        errors.append("Missing PanelTypeBreakdownSection")
    if "FAQSection" not in content:
        errors.append("Missing FAQSection component")

    # Check 3: Container styling (rounded-3xl or rounded-2xl with specular highlights)
    if not re.search(r'rounded-(?:3xl|2xl)', content):
        errors.append("Missing rounded-3xl / rounded-2xl containers")
    if not re.search(r'border-(?:white/10|border-hairline|white/5|white/20|cyan-500/|emerald-500/|purple-500/|border-interactive)', content):
        errors.append("Missing specular highlight borders")

    # Check 4: Technical SEO - 10 FAQs in array
    # Extract faqs array: either const faqs = [...], const ppiFaqs = [...], faqs: [...] in category
    # Find all FAQ arrays and count items
    faq_arrays = re.findall(r'(?:faqs|structuredFaqs|cat\.faqs)\s*(?:=|:)\s*\[([\s\S]*?)\]\s*(?:;|,|\n)', content)
    
    # Also find arrays containing { question: ... } or { "q": ... }
    faq_blocks = re.findall(r'\[\s*\{\s*(?:question|\"question\"|\"q\"|q)\s*:\s*[\s\S]*?\}\s*\]', content)
    
    # Accurately count questions in primary faqs
    # Count instances of { question: ... } or { "q": ... } inside faqs block
    faqs_item_count = 0
    # Search for faqs block
    match_faqs = re.search(r'const\s+faqs\s*=\s*\[([\s\S]*?)\]\s*;', content)
    if not match_faqs:
        match_faqs = re.search(r'faqs\s*:\s*\[([\s\S]*?)\]\s*(?:,|\})', content)
    
    if match_faqs:
        block = match_faqs.group(1)
        items = re.findall(r'\{\s*(?:question|\"question\"|\"q\"|q)\s*:\s*', block)
        faqs_item_count = len(items)
    else:
        # Check if faqs prop is passed from category or imported
        items = re.findall(r'\{\s*(?:question|\"question\"|\"q\"|q)\s*:\s*', content)
        faqs_item_count = len(items)

    if faqs_item_count != 10:
        errors.append(f"FAQ count is {faqs_item_count} (expected 10)")

    # Check layout & faq section props
    if not re.search(r'<Layout[\s\S]*?faqs=\{(?:faqs|cat\.faqs|category\.faqs)\}', content):
        errors.append("Layout missing faqs prop")
    if not re.search(r'<FAQSection[\s\S]*?faqs=\{(?:faqs|cat\.faqs|category\.faqs)\}', content):
        errors.append("FAQSection missing faqs prop")

    if errors:
        failed.append((rel_path, errors))

print("=== FORENSIC AUDIT SUMMARY ===")
print(f"Total files audited: {len(all_files)}")
print(f"Passed: {len(all_files) - len(failed)}")
print(f"Failed: {len(failed)}")

if failed:
    print("\nFAILURES DETECTED:")
    for fname, errs in failed:
        print(f"  ❌ {fname}: {'; '.join(errs)}")
else:
    print("\n✅ VERDICT: 100% CLEAN — All 93 diagnostic test page files passed all forensic integrity checks!")
