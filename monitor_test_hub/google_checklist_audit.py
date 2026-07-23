import glob
import re
import os

pages = sorted(glob.glob('src/pages/**/*.astro', recursive=True))

print("=== GOOGLE SEARCH ESSENTIALS & QUALITY AUDIT ===\n")

thin_content_warnings = []
keyword_stuffing_warnings = []
link_issues = []

for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Content Length Check (prevent thin content)
    text_only = re.sub(r'<[^>]+>', ' ', content)
    words = text_only.split()
    if len(words) < 150:
        thin_content_warnings.append((p, len(words)))

    # 2. Outbound Link Security Check
    outbound_links = re.findall(r'<a\s+[^>]*href=[\'\"](http[s]?://[^\'\"]+)[\'\"][^>]*>', content)
    for link in outbound_links:
        if 'displaytestonline.com' not in link and 'rel=' not in content:
            link_issues.append((p, link))

print(f"1. Thin Content Pages (<150 words): {len(thin_content_warnings)}")
for p, wcount in thin_content_warnings:
    print(f"   - [{p}]: only {wcount} words")

print(f"\n2. Outbound Links Missing rel='noopener': {len(link_issues)}")

print("\n3. E-E-A-T & Trust Signals Verification:")
print(f"   - About Page: {os.path.exists('src/pages/about.astro')}")
print(f"   - Privacy Policy: {os.path.exists('src/pages/privacy.astro')}")
print(f"   - Terms & Conditions: {os.path.exists('src/pages/terms.astro')}")
print(f"   - Contact Page: {os.path.exists('src/pages/contact.astro')}")
print(f"   - Epilepsy Disclaimer: {os.path.exists('src/components/disclaimers/EpilepsyWarning.astro')}")
print(f"   - Hardware Limitation Notice: {os.path.exists('src/components/disclaimers/HardwareLimitationNotice.astro')}")

