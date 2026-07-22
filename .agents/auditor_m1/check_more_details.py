import os
import re
import glob

REPO_ROOT = "/Users/divyyadav/newws/monitor_test_hub"
SRC_ROOT = os.path.join(REPO_ROOT, "src")

# 1. Check astro.config.mjs and tsconfig.json
astro_config_path = os.path.join(REPO_ROOT, "astro.config.mjs")
with open(astro_config_path, "r", encoding="utf-8") as f:
    astro_config = f.read()

tsconfig_path = os.path.join(REPO_ROOT, "tsconfig.json")
with open(tsconfig_path, "r", encoding="utf-8") as f:
    tsconfig = f.read()

package_json_path = os.path.join(REPO_ROOT, "package.json")
with open(package_json_path, "r", encoding="utf-8") as f:
    package_json = f.read()

print("=== ASTRO CONFIG ===")
print(astro_config)

print("\n=== TSCONFIG ===")
print(tsconfig)

print("\n=== HYDRATION DIRECTIVE SCAN ===")
hydration_count = 0
for root, dirs, files in os.walk(SRC_ROOT):
    for file in files:
        if file.endswith(".astro"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                matches = re.findall(r"client:(?:load|idle|visible|only|media)[\s=>]", content)
                if matches:
                    print(f"Hydration in {os.path.relpath(path, REPO_ROOT)}: {matches}")
                    hydration_count += len(matches)

print(f"Total hydration directives across .astro files: {hydration_count}")

print("\n=== ROUTE COLLISION / OVERLAP SCAN ===")
# Collect all static routes vs dynamic routes
page_files = glob.glob(os.path.join(SRC_ROOT, "pages", "**", "*.astro"), recursive=True)
page_routes = []
for pf in page_files:
    rel_path = os.path.relpath(pf, os.path.join(SRC_ROOT, "pages"))
    # convert file path to route pattern
    route = "/" + rel_path.replace(".astro", "").replace("index", "")
    if route.endswith("/") and len(route) > 1:
        route = route[:-1]
    page_routes.append((rel_path, route))

print(f"Total pages scanned: {len(page_routes)}")

# Check dynamic routes pattern conflicts
# e.g., /white-screen/[color] vs /white-screen/black-screen static
dynamic_patterns = [r for pf, r in page_routes if "[" in r]
static_patterns = [r for pf, r in page_routes if "[" not in r]

print("\nDynamic Routes Found:")
for d in sorted(dynamic_patterns):
    print("  ", d)
