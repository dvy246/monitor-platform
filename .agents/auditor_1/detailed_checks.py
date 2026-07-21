import sys
import re
import json

file_path = "/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.splitlines()

print("=== CHECK 1: PLACEHOLDERS & DUMMY TEXT ===")
placeholders = re.findall(r'\b(TBD|TODO|FIXME|XXX)\b', text, re.IGNORECASE)
print(f"Placeholders count: {len(placeholders)}")

# Check for dummy/facade text patterns like "Lorem ipsum", "sample text", "insert text here"
dummy_patterns = re.findall(r'(lorem ipsum|sample text|insert text|placeholder text|asdf|qwerty)', text, re.IGNORECASE)
print(f"Dummy text patterns found: {len(dummy_patterns)}")

# Check section completeness / truncation markers
truncation_markers = re.findall(r'(\.\.\.|\[truncated\]|\[continued\])', text, re.IGNORECASE)
print(f"Truncation markers found: {len(truncation_markers)}")

print("\n=== CHECK 2: MATHEMATICAL FORMULAS ===")

# 1. CIE76 formula check
cie76 = re.findall(r'\\Delta E_\{ab\}\^\*|[ΔE\*_ab|CIE76]', text)
print(f"CIE76 occurrences: {len(cie76)}")
cie76_formula = re.search(r'\\Delta E_\{ab\}\^\*\s*=\s*\\sqrt\{[^}]+\}', text)
if cie76_formula:
    print(f"CIE76 Formula found: {cie76_formula.group(0)}")
else:
    print("Searching CIE76 text block...")
    cie76_match = [l for l in lines if 'CIE76' in l or 'ab' in l and 'Delta' in l]
    for m in cie76_match[:5]:
        print("  ", m)

# 2. CIEDE2000 formula check
ciede2000 = re.search(r'\\Delta E_\{00\}\^\*\s*=\s*\\sqrt\{[^}]+\}', text)
if ciede2000:
    print(f"CIEDE2000 Formula found: {ciede2000.group(0)}")
else:
    ciede_match = [l for l in lines if 'CIEDE2000' in l or '00' in l and 'Delta' in l]
    for m in ciede_match[:5]:
        print("  ", m)

# 3. Pursuit camera velocity formula check
vpursuit = re.search(r'v_\{[^\}]+\}\(t\)', text)
print(f"v_pursuit formula match: {vpursuit.group(0) if vpursuit else 'None'}")

# 4. Input latency formula check
latency = re.search(r'Latency\s*=\s*t_\{[^\}]+\}', text)
print(f"Latency formula match: {latency.group(0) if latency else 'None'}")

# 5. Vector draw precision Dev_rms formula check
dev_rms = re.search(r'Dev_\{[^\}]+\}\s*=\s*\\sqrt\{[^}]+\}', text)
print(f"Dev_rms formula match: {dev_rms.group(0) if dev_rms else 'None'}")

# Spectre timing quantization check
spectre_check = [l for l in lines if 'Spectre' in l or 'spectre' in l or 'quantiz' in l or 'performance.now' in l]
print(f"Spectre / timing quantization lines found: {len(spectre_check)}")
for s in spectre_check:
    print("  ", s)

print("\n=== CHECK 3: ASCII MOCKUPS ===")

ascii_titles = ["Ghosting Invaders", "Color Match Alchemist", "Lag Reflex Sniper", "Touch Matrix Defusal"]
for title in ascii_titles:
    found = False
    for i, line in enumerate(lines):
        if title.lower() in line.lower():
            print(f"Found ASCII mockup title '{title}' at line {i+1}")
            found = True
            # Print next few lines
            box_lines = []
            j = i + 1
            while j < len(lines):
                l = lines[j]
                if l.startswith("+--") or l.startswith("|"):
                    box_lines.append((j+1, len(l), l.endswith("|") or l.endswith("+"), l))
                elif box_lines and not (l.startswith("+--") or l.startswith("|")):
                    break
                j += 1
            print(f"  Box line count: {len(box_lines)}")
            bad_lines = [b for b in box_lines if b[1] != 85 or not b[2]]
            if bad_lines:
                print(f"  FAILED alignment: {len(bad_lines)} bad lines.")
                for bl in bad_lines:
                    print(f"    Line {bl[0]}: len={bl[1]}, end={bl[2]} -> {bl[3]}")
            else:
                print(f"  PASSED alignment: All {len(box_lines)} lines are EXACTLY length 85 ending with right-border '|' or '+'.")
    if not found:
        print(f"MISSING title '{title}'!")

print("\n=== CHECK 4: JSON-LD SCHEMAS ===")
json_blocks = re.findall(r'```json\s*(.*?)\s*```', text, re.DOTALL)
print(f"JSON blocks found: {len(json_blocks)}")
for idx, jblock in enumerate(json_blocks, 1):
    try:
        parsed = json.loads(jblock)
        print(f"JSON block {idx} parsed successfully!")
        if isinstance(parsed, dict):
            ctx = parsed.get("@context")
            graph = parsed.get("@graph")
            types = [item.get("@type") for item in graph] if graph else [parsed.get("@type")]
            print(f"  @context: {ctx}, @type(s): {types}")
    except Exception as e:
        print(f"JSON block {idx} FAILED to parse: {e}")

print("\n=== CHECK 5: HTML DISCLAIMERS ===")
html_blocks = re.findall(r'```html\s*(.*?)\s*```', text, re.DOTALL)
print(f"HTML code blocks found: {len(html_blocks)}")
for idx, hblock in enumerate(html_blocks, 1):
    print(f"HTML block {idx} length: {len(hblock)} chars")
    print("  Snippet:", repr(hblock[:80]))

disclaimer_lines = [l for l in lines if 'disclaimer' in l.lower() or 'warning' in l.lower() or 'notice' in l.lower()]
print(f"Disclaimer lines found: {len(disclaimer_lines)}")

print("\n=== CHECK 6: CITATIONS ===")
citations = [
    "ISO 9241-307",
    "VESA DisplayHDR 1.2",
    "IEC 62341",
    "CIE 1931/1976/2000",
    "ANSI/IES RP-28-20"
]

for cit in citations:
    # flexible regex search
    pattern = re.escape(cit).replace('/', r'\/|\/')
    match = re.search(cit, text, re.IGNORECASE)
    if not match:
        # try search parts if combined like CIE 1931
        parts = cit.split('/')
        match = all(re.search(re.escape(p), text, re.IGNORECASE) for p in parts)
    print(f"Citation '{cit}': {'FOUND' if match else 'MISSING'}")

