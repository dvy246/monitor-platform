import re

with open("/Users/divyyadav/newws/niche_research_report.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("--- Box volume & dimension mentions ---")
for i, line in enumerate(lines, 1):
    if any(k in line.lower() for k in ["small box", "medium box", "large box", "wardrobe box", "dish barrel", "cu ft"]):
        print(f"Line {i}: {line.strip()}")
