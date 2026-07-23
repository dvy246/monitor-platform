import glob
import re

components = sorted(glob.glob('src/**/*.astro', recursive=True))

print("=== UI/UX PRO MAX AUDIT SUITE ===\n")

focus_issues = []
cursor_issues = []
emoji_icon_issues = []
contrast_warnings = []
touch_target_warnings = []

for c in components:
    with open(c, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # 1. Focus Ring Audit
    buttons_and_links = re.findall(r'<(button|a|input|select)\s+[^>]*class=[\'"]([^\'"]+)[\'"]', content)
    for tag, classes in buttons_and_links:
        if 'outline-none' in classes or 'focus:outline-none' in classes:
            if 'focus:ring' not in classes and 'focus-visible' not in classes and 'focus:border' not in classes:
                focus_issues.append((c, tag, classes))
        if tag in ['button', 'a'] and 'cursor-pointer' not in classes and 'pointer-events-none' not in classes:
            cursor_issues.append((c, tag))

    # 2. Emoji Used as Primary Icons
    emojis = re.findall(r'<span[^>]*>([\u2600-\u26FF\u2700-\u27BF\U0001F300-\U0001F9FF])</span>', content)
    if emojis:
        emoji_icon_issues.append((c, emojis))

    # 3. Text Contrast Warnings (e.g. text-zinc-500, text-text-muted on dark bg)
    if 'text-zinc-600' in content or 'text-slate-600' in content or 'text-slate-500' in content:
        contrast_warnings.append(c)

print(f"1. Interactive Elements with outline-none lacking Focus Rings: {len(focus_issues)}")
for comp, tag, cls in focus_issues[:10]:
    print(f"   - [{comp}]: <{tag}> has outline-none without focus ring class!")

print(f"\n2. Clickable Elements Lacking cursor-pointer: {len(cursor_issues)}")
for comp, tag in cursor_issues[:10]:
    print(f"   - [{comp}]: <{tag}> missing cursor-pointer")

print(f"\n3. Components Using Emoji Icons Instead of SVGs: {len(emoji_icon_issues)}")
for comp, ems in emoji_icon_issues[:10]:
    print(f"   - [{comp}]: uses emojis {set(ems)}")

print(f"\n4. Low-Contrast Text Color Classes Detected: {len(contrast_warnings)}")
for comp in contrast_warnings[:10]:
    print(f"   - [{comp}]: contains low-contrast muted text utility classes (e.g. text-zinc-600)")

