import glob
import re
import os

files = sorted(glob.glob('src/**/*.astro', recursive=True))

duplicate_vars = []

for fpath in files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    if not content.startswith('---'):
        continue

    parts = content.split('---', 2)
    if len(parts) < 3:
        continue

    frontmatter = parts[1]
    
    # Find all const/let/var top-level variable declarations
    declarations = re.findall(r'^\s*(const|let|var)\s+([a-zA-Z0-9_]+)\s*=', frontmatter, re.MULTILINE)
    
    seen = set()
    for kind, var_name in declarations:
        if var_name in seen:
            duplicate_vars.append((fpath, var_name))
        else:
            seen.add(var_name)

print("=== FULL CODEBASE DUPLICATE VARIABLE AUDIT ===\n")
print(f"Total files with duplicate variable declarations: {len(duplicate_vars)}")
for fpath, var_name in duplicate_vars:
    print(f"  - [{fpath}]: duplicate declaration of variable '{var_name}'")

