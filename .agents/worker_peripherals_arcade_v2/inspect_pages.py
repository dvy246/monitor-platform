import os
import re

directories = [
    "src/pages/mouse-test",
    "src/pages/controller-test",
    "src/pages/keyboard-tester",
    "src/pages/benchmarks",
    "src/pages/arcade",
    "src/pages/hdr-test",
    "src/pages/input-lag-test",
    "src/pages/input-tests",
    "src/pages/models",
    "src/pages/oled-burn-in-risk",
    "src/pages/passport",
    "src/pages/vrr-stutter-test",
]

base_dir = "/Users/divyyadav/newws/monitor_test_hub"
all_files = []

for d in directories:
    full_d = os.path.join(base_dir, d)
    if os.path.exists(full_d):
        for root, dirs, files in os.walk(full_d):
            for file in files:
                if file.endswith(".astro"):
                    rel = os.path.relpath(os.path.join(root, file), base_dir)
                    all_files.append(rel)

print(f"Total target files found across directories: {len(all_files)}")

results = []

for rel_path in sorted(all_files):
    full_path = os.path.join(base_dir, rel_path)
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    has_step = "StepWorkflowSection" in content
    has_panel = "PanelTypeBreakdownSection" in content
    has_faq_section = "FAQSection" in content
    has_layout_faqs = "faqs={faqs}" in content or "faqs={" in content
    
    # Check curved box / specular highlight styling
    has_curved_box = ("rounded-3xl" in content or "rounded-2xl" in content) and ("border-white/10" in content or "border-border-hairline" in content or "border-white/20" in content)
    
    # Count questions in faqs array
    # Extract faqs array text
    faq_count = 0
    faqs_match = re.search(r'const faqs.*?:.*?\=\s*\[(.*?)\];', content, re.DOTALL)
    if not faqs_match:
        faqs_match = re.search(r'const faqs\s*=\s*\[(.*?)\];', content, re.DOTALL)
    
    if faqs_match:
        faq_text = faqs_match.group(1)
        faq_count = len(re.findall(r'question\s*:', faq_text))
        if faq_count == 0:
            faq_count = len(re.findall(r'q\s*:', faq_text))
    
    status = "OK" if (has_step and has_panel and has_faq_section and has_layout_faqs and faq_count == 10 and has_curved_box) else "NEEDS_UPGRADE"
    
    results.append({
        "file": rel_path,
        "status": status,
        "step": has_step,
        "panel": has_panel,
        "faq_sec": has_faq_section,
        "layout_faq": has_layout_faqs,
        "faq_count": faq_count,
        "curved": has_curved_box
    })

print("\nDetailed Audit Results:")
for r in results:
    print(f"[{r['status']}] {r['file']}: Step={r['step']}, Panel={r['panel']}, FAQSec={r['faq_sec']}, LayoutFAQ={r['layout_faq']}, FAQCount={r['faq_count']}, Curved={r['curved']}")
