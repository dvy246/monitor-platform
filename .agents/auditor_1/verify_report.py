import sys
import re
import json

file_path = "/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

content = "".join(lines)

print(f"Total Lines: {len(lines)}")
print(f"Total Bytes: {len(content.encode('utf-8'))}")

# 1. Placeholders check
placeholders = re.findall(r'\b(TBD|TODO|FIXME|XXX)\b', content, re.IGNORECASE)
print(f"Placeholders count: {len(placeholders)}")
if placeholders:
    print("Found placeholders:", set(placeholders))

# 2. ASCII Mockups Right-Border Check at column 85
# Find code blocks or ascii art lines
in_ascii = False
ascii_blocks = []
current_block = []

for i, line in enumerate(lines, 1):
    stripped_line = line.rstrip("\r\n")
    # Check if line contains ASCII box borders like '|'
    if stripped_line.startswith("+--") or stripped_line.startswith("|"):
        current_block.append((i, stripped_line))
    else:
        if current_block:
            ascii_blocks.append(current_block)
            current_block = []

if current_block:
    ascii_blocks.append(current_block)

print(f"Found {len(ascii_blocks)} ASCII border blocks.")

for b_idx, block in enumerate(ascii_blocks, 1):
    print(f"\n--- Block {b_idx} (Lines {block[0][0]} to {block[-1][0]}) ---")
    bad_lines = []
    for line_num, line_str in block:
        # check length
        length = len(line_str)
        ends_with_pipe = line_str.endswith("|") or line_str.endswith("+")
        if length != 85 or not ends_with_pipe:
            bad_lines.append((line_num, length, line_str[-1] if line_str else "", line_str))
    if bad_lines:
        print(f"Block {b_idx} has {len(bad_lines)} lines NOT matching col 85 right-border '|':")
        for line_num, length, last_char, line_str in bad_lines:
            print(f"  Line {line_num}: len={length}, last_char='{last_char}' -> {repr(line_str)}")
    else:
        print(f"Block {b_idx}: PERFECT right-border alignment at column 85 (len=85, ends with | or +).")

