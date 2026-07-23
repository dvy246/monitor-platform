import os
import glob
import re

pages_dir = "/Users/divyyadav/newws/monitor_test_hub/src/pages"

# Find all .astro files in src/pages except 404, 500, about, contact, terms, privacy, etc.
all_astro = glob.glob(os.path.join(pages_dir, "**/*.astro"), recursive=True)

# Exclude non-tool pages
non_tool_patterns = [
    "404.astro", "500.astro", "about.astro", "contact.astro", "terms.astro", "privacy.astro",
    "faq.astro", "cdn-cgi", "embed/", "badge.svg", "[locale]/"
]

tool_pages = []
for p in all_astro:
    rel_path = os.path.relpath(p, pages_dir)
    if any(pat in rel_path for pat in non_tool_patterns):
        continue
    tool_pages.append((rel_path, p))

print(f"Total primary tool page templates found: {len(tool_pages)}")

bento_missing = []
step_missing = []
panel_missing = []
faq_missing = []
faq_count_issues = []

for rel_path, full_path in tool_pages:
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    has_bento = "MasterBentoDiagnosticSuite" in content
    has_step = "StepWorkflowSection" in content
    has_panel = "PanelTypeBreakdownSection" in content
    has_faq_section = "FAQSection" in content
    has_layout_faqs = "faqs={" in content or "faqs: faqs" in content or "faqs }" in content or "faqs=" in content

    # Check FAQs array length if faqs = [...] is defined
    # Matches faqs = [ ... ]
    faq_match = re.search(r'const faqs(?:\s*:\s*[^=]+)?\s*=\s*(\[[\s\S]*?\]);', content)
    faq_count = 0
    if faq_match:
        faq_str = faq_match.group(1)
        # Count objects with question: or q: or similar
        items = re.findall(r'\{\s*(?:question|q)\s*:', faq_str)
        if not items:
            # alternative count by {
            items = re.findall(r'\{\s*["\']?question["\']?\s*:', faq_str)
        faq_count = len(items)

    if not has_bento:
        bento_missing.append(rel_path)
    if not has_step:
        step_missing.append(rel_path)
    if not has_panel:
        panel_missing.append(rel_path)
    if not (has_faq_section and has_layout_faqs):
        faq_missing.append((rel_path, has_faq_section, has_layout_faqs))
    elif faq_count > 0 and faq_count != 10:
        faq_count_issues.append((rel_path, faq_count))

print("\n--- RESULTS ---")
print(f"MasterBentoDiagnosticSuite Missing ({len(bento_missing)}):", bento_missing)
print(f"StepWorkflowSection Missing ({len(step_missing)}):", step_missing)
print(f"PanelTypeBreakdownSection Missing ({len(panel_missing)}):", panel_missing)
print(f"FAQ Section/Layout Missing ({len(faq_missing)}):", faq_missing)
print(f"FAQ Count != 10 ({len(faq_count_issues)}):", faq_count_issues)
