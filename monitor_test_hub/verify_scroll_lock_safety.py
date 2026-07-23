import glob
import re
import os

all_css_files = sorted(glob.glob('src/**/*.css', recursive=True))
all_astro_files = sorted(glob.glob('src/**/*.astro', recursive=True))
all_js_files = sorted(glob.glob('src/**/*.{js,ts,mjs,cjs}', recursive=True))

scroll_warnings = []

# 1. CSS Audit: Check for dangerous overflow rules on html or body
for fpath in all_css_files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Look for html/body rules with overflow: hidden or overflow-x: clip
    matches = re.findall(r'(html|body)\s*\{[^}]*overflow[^}]*\}', content, re.DOTALL | re.IGNORECASE)
    for m in matches:
        if 'clip' in m.lower() or ('hidden' in m.lower() and 'overflow-x' not in m.lower()):
            scroll_warnings.append((fpath, f"CSS rule on {m[:30]} contains restrictive overflow"))

# 2. JS/Astro Audit: Check all style/classList modifications on body
for fpath in all_astro_files + all_js_files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    if 'body.style.overflow = ' in content or "classList.add('overflow-hidden')" in content:
        # Check if cleanup exists in same file
        has_cleanup = (
            'body.style.overflow = ' in content and (
                "body.style.overflow = ''" in content or 'body.style.overflow = "auto"' in content or "body.style.overflow = 'auto'" in content
            )
        ) or (
            "classList.add('overflow-hidden')" in content and "classList.remove('overflow-hidden')" in content
        )

        if not has_cleanup:
            scroll_warnings.append((fpath, "Sets body overflow lock without cleanup in same file"))

# 3. Check for global keydown preventDefault on scroll keys (Space, ArrowDown, ArrowUp, PageDown, PageUp)
for fpath in all_astro_files + all_js_files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    if 'e.preventDefault()' in content:
        for key in ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space']:
            if f"'{key}'" in content or f'"{key}"' in content:
                # Check if it is inside an input focus check
                if 'isInput' not in content and 'tagName === \'INPUT\'' not in content and 'search' not in fpath.lower() and 'canvas' not in fpath.lower() and 'tester' not in fpath.lower():
                    scroll_warnings.append((fpath, f"preventDefault on key '{key}' without input scope check"))

print("=== SCROLL SAFETY VERIFICATION SUITE ===\n")
print(f"Total files audited: {len(all_css_files) + len(all_astro_files) + len(all_js_files)}")
print(f"Total potential scroll risk warnings: {len(scroll_warnings)}\n")

if scroll_warnings:
    for fpath, warning in scroll_warnings:
        print(f"  - ⚠️ [{fpath}]: {warning}")
else:
    print("✅ ZERO SCROLL LOCK RISKS DETECTED ACROSS THE CODEBASE!")

