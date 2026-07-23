import glob
import re
import os

pages = sorted(glob.glob('src/pages/**/*.astro', recursive=True))

print("=== TECHNICAL SEO & SEARCH QUALITY AUDIT SUITE ===\n")

missing_titles = []
missing_descriptions = []
multiple_h1s = []
missing_h1s = []
schema_pages = 0
hreflang_pages = 0

for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Title check
    title_match = re.search(r'title\s*=\s*[\'\"]([^\'\"]+)[\'\"]', content) or re.search(r'title\s*=\s*\{', content)
    if not title_match:
        missing_titles.append(p)

    # Description check
    desc_match = re.search(r'description\s*=\s*[\'\"]([^\'\"]+)[\'\"]', content) or re.search(r'description\s*=\s*\{', content)
    if not desc_match:
        missing_descriptions.append(p)

    # H1 count check in template
    h1s = re.findall(r'<h1\b[^>]*>(.*?)</h1>', content, re.DOTALL)
    if len(h1s) == 0 and not re.search(r'<Layout', content):
        missing_h1s.append(p)
    elif len(h1s) > 1:
        multiple_h1s.append((p, len(h1s)))

    # Schema & hreflang checks
    if 'schema' in content.lower() or 'ld+json' in content.lower():
        schema_pages += 1
    if 'hreflang' in content.lower() or 'localizeLink' in content:
        hreflang_pages += 1

print(f"1. Total Pages Audited: {len(pages)}")
print(f"2. Pages Missing Unique Title Prop: {len(missing_titles)}")
for p in missing_titles[:5]:
    print(f"   - [{p}]")

print(f"\n3. Pages Missing Meta Description Prop: {len(missing_descriptions)}")
for p in missing_descriptions[:5]:
    print(f"   - [{p}]")

print(f"\n4. Pages with Multiple <h1> Tags (Heading Hierarchy Risk): {len(multiple_h1s)}")
for p, count in multiple_h1s[:5]:
    print(f"   - [{p}]: contains {count} <h1> tags!")

print(f"\n5. Schema.org JSON-LD Structured Data Coverage: {schema_pages}/{len(pages)} pages")
print(f"6. Hreflang / i18n Localization Coverage: {hreflang_pages}/{len(pages)} pages")

# Check robots.txt
robots_path = 'public/robots.txt'
if os.path.exists(robots_path):
    with open(robots_path, 'r', encoding='utf-8') as f:
        robots_txt = f.read()
    print(f"\n7. robots.txt Verified:\n{robots_txt.strip()}")
else:
    print("\n7. 🚨 MISSING public/robots.txt!")

