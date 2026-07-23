import glob
import re
import os

print("=== GOOGLE INDEXATION & CRAWLABILITY AUDIT ===\n")

# 1. Inspect astro.config.mjs
config_path = 'astro.config.mjs'
if os.path.exists(config_path):
    with open(config_path, 'r', encoding='utf-8') as f:
        config_content = f.read()
    print("1. astro.config.mjs Verified:")
    print("   - Site URL:", re.findall(r'site:\s*[\'\"]([^\'\"]+)[\'\"]', config_content))
    print("   - Redirects Configured:", re.findall(r'redirects:\s*(\{.*?\})', config_content, re.DOTALL))
else:
    print("1. 🚨 astro.config.mjs NOT FOUND!")

# 2. Inspect robots.txt
robots_path = 'public/robots.txt'
if os.path.exists(robots_path):
    with open(robots_path, 'r', encoding='utf-8') as f:
        robots_content = f.read()
    print("\n2. public/robots.txt Verified:")
    print(f"   {robots_content.strip()}")
else:
    print("\n2. 🚨 public/robots.txt NOT FOUND!")

# 3. Check for Placeholder Domains across src/
files = sorted(glob.glob('src/**/*.*', recursive=True))

placeholders = ['[DOMAIN]', 'localhost', 'example.com', 'monitortester.com']
found_placeholders = []

for filepath in files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for ph in placeholders:
        if ph in content:
            found_placeholders.append((filepath, ph))

print(f"\n3. Placeholder Domain Check: {len(found_placeholders)} instances found")
for filepath, ph in found_placeholders:
    print(f"   - [{filepath}]: contains placeholder '{ph}'")

# 4. Check for Custom Canonical Overrides
pages = sorted(glob.glob('src/pages/**/*.astro', recursive=True))
canonical_overrides = []

for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    canonical_match = re.search(r'canonicalUrl\s*=\s*[\'\"]([^\'\"]+)[\'\"]', content)
    if canonical_match:
        canonical_overrides.append((p, canonical_match.group(1)))

print(f"\n4. Pages with Custom Canonical Overrides: {len(canonical_overrides)}")
for p, target in canonical_overrides:
    print(f"   - [{p}] -> canonical points to: {target}")

