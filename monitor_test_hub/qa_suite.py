import glob
import re

components = sorted(glob.glob('src/**/*.astro', recursive=True))

print("=== QA TEST SUITE 1: DOM QUERY SELECTOR & NULL DEREFERENCE AUDIT ===\n")

missing_id_bugs = []
missing_null_checks = []

for c in components:
    with open(c, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find script block
    script_match = re.search(r'<script\b[^>]*>(.*?)</script>', content, re.DOTALL)
    if not script_match:
        continue

    script = script_match.group(1)
    
    # Find getElementById calls
    get_id_calls = set(re.findall(r'document\.getElementById\s*\(\s*[\'\"]([^\'\"]+)[\'\"]\s*\)', script))
    
    # Find all id="..." or id='...' in HTML
    html_ids = set(re.findall(r'\bid\s*=\s*[\'\"]([^\'\"]+)[\'\"]', content))

    for queried_id in get_id_calls:
        if queried_id not in html_ids and '${' not in queried_id:
            missing_id_bugs.append((c, queried_id))

print(f"Total Missing DOM ID Bugs Found: {len(missing_id_bugs)}")
for comp, qid in missing_id_bugs:
    print(f"  - [{comp}]: script queries document.getElementById('{qid}'), but id='{qid}' is missing in HTML!")

print("\n=== QA TEST SUITE 2: UNCHECKED NULL EVENT LISTENERS AUDIT ===\n")

unchecked_listeners = []
for c in components:
    with open(c, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    script_match = re.search(r'<script\b[^>]*>(.*?)</script>', content, re.DOTALL)
    if not script_match:
        continue

    script = script_match.group(1)
    direct_listens = re.findall(r'document\.getElementById\s*\(\s*[\'\"]([^\'\"]+)[\'\"]\s*\)\s*\.\s*addEventListener', script)
    for qid in direct_listens:
        unchecked_listeners.append((c, qid))

print(f"Total Chained addEventListener Calls Without Null Guard: {len(unchecked_listeners)}")
for comp, qid in unchecked_listeners:
    print(f"  - [{comp}]: document.getElementById('{qid}').addEventListener (will throw TypeError if '{qid}' missing)")

