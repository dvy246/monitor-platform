import os

base_dir = "/Users/divyyadav/newws/monitor_test_hub/src/pages"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".astro"):
            full_path = os.path.join(root, file)
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()
            if not content.startswith("---"):
                print(f"Missing starting --- in: {os.path.relpath(full_path, base_dir)}")
