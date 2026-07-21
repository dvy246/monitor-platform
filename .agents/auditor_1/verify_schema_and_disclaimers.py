import sys
import re
import json

file_path = "/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. JSON-LD Check
json_blocks = re.findall(r'```json\s*(.*?)\s*```', text, re.DOTALL)
print("=== JSON-LD SCHEMAS ===")
for idx, block in enumerate(json_blocks, 1):
    try:
        data = json.loads(block)
        print(f"JSON Block {idx}: VALID JSON.")
        graph = data.get("@graph", [])
        types = [item.get("@type") for item in graph]
        print(f"  @graph contains types: {types}")
        for item in graph:
            print(f"  Type: {item.get('@type')}")
            print(f"    name/headline: {item.get('name') or item.get('headline')}")
    except Exception as e:
        print(f"JSON Block {idx}: INVALID JSON -> {e}")

# 2. HTML Disclaimers Check
html_blocks = re.findall(r'```html\s*(.*?)\s*```', text, re.DOTALL)
print("\n=== HTML DISCLAIMERS ===")
print(f"Found {len(html_blocks)} HTML blocks.")
for idx, block in enumerate(html_blocks, 1):
    print(f"\nHTML Block {idx}:")
    lines = block.strip().splitlines()
    print("  Header:", lines[0] if lines else "")
    print("  Line count:", len(lines))

