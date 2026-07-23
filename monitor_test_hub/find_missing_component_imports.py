import glob
import re
import os

all_files = sorted(glob.glob('src/**/*.astro', recursive=True))

missing_imports = []

for filepath in all_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    parts = content.split('---', 2)
    if len(parts) < 3:
        continue

    frontmatter = parts[1]
    template = parts[2]

    # Find all component tags <ComponentName or <ComponentName.Property
    tags = set(re.findall(r'<([A-Z][a-zA-Z0-9_]*)(?:\s|/|>|\.)', template))

    # Find all imported symbols in frontmatter
    imported_symbols = set()
    # Direct imports: import Foo from ...
    for m in re.findall(r'import\s+([A-Z][a-zA-Z0-9_]*)\s+from', frontmatter):
        imported_symbols.add(m)
    # Named imports: import { Foo, Bar } from ...
    for block in re.findall(r'import\s+\{([^}]+)\}\s+from', frontmatter):
        for sym in block.split(','):
            sym_clean = sym.strip().split(' as ')[-1].strip()
            if sym_clean and sym_clean[0].isupper():
                imported_symbols.add(sym_clean)

    for tag in sorted(tags):
        # Ignore Astro built-in or global components if any (e.g. Fragment, Slot)
        if tag in ['Fragment', 'Slot']:
            continue
        if tag not in imported_symbols:
            missing_imports.append((filepath, tag))

print("=== MISSING COMPONENT IMPORT AUDIT ===\n")
print(f"Total missing component imports found: {len(missing_imports)}\n")
for fpath, tag in missing_imports:
    print(f"  - 🚨 [{fpath}]: renders <{tag} /> but lacks 'import {tag} ...'")

