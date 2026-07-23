import glob
import re
import os

all_files = sorted(glob.glob('src/**/*.astro', recursive=True))

issues = []

for filepath in all_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Frontmatter presence
    if not content.startswith('---'):
        issues.append((filepath, "Missing opening '---' fence at line 1"))
        continue

    # 2. Count '---' fences
    parts = content.split('---', 2)
    if len(parts) < 3:
        issues.append((filepath, "Fewer than 2 '---' fences"))
        continue

    frontmatter = parts[1]
    template = parts[2]

    # 3. JSX tags inside frontmatter check
    jsx_in_fm = re.search(r'^\s*<[A-Z0-9a-z_]+', frontmatter, re.MULTILINE)
    if jsx_in_fm:
        issues.append((filepath, f"JSX tag '{jsx_in_fm.group(0).strip()}' found INSIDE frontmatter block"))

    # 4. Duplicate top-level const/let/var declarations in frontmatter
    declarations = re.findall(r'^\s*(const|let|var)\s+([a-zA-Z0-9_]+)\s*=', frontmatter, re.MULTILINE)
    seen = set()
    for kind, var_name in declarations:
        if var_name in seen:
            issues.append((filepath, f"Duplicate variable declaration '{var_name}' in frontmatter"))
        else:
            seen.add(var_name)

print("=== FINAL CODEBASE STRUCTURAL VERIFICATION SUITE ===\n")
print(f"Total .astro files scanned: {len(all_files)}")
print(f"Total structural/syntax issues found: {len(issues)}\n")

if issues:
    for filepath, err in issues:
        print(f"  - 🚨 [{filepath}]: {err}")
else:
    print("✅ ZERO STRUCTURAL OR SYNTAX ISSUES FOUND ACROSS ALL ASTRO FILES!")

