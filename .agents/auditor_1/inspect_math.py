import sys
import re

file_path = "/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.splitlines()

# Extract LaTeX formulas
inline_math = re.findall(r'\$([^\$]+)\$', text)
block_math = re.findall(r'\$\$([^\$]+)\$\$', text, re.DOTALL)

print(f"Total inline math expressions: {len(inline_math)}")
print(f"Total block math expressions: {len(block_math)}")

print("\n--- Block Math Expressions ---")
for idx, bm in enumerate(block_math, 1):
    print(f"[{idx}]\n{bm.strip()}\n")

print("\n--- Search for pursuit, latency, Dev_rms in text ---")
for i, line in enumerate(lines, 1):
    if any(k in line.lower() for k in ["pursuit", "latency", "dev_", "dev_rms", "delta e", "ciede"]):
        print(f"Line {i:3d}: {line}")

