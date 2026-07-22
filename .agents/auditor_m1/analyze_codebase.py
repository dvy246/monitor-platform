import os
import re
import glob
import json

REPO_ROOT = "/Users/divyyadav/newws/monitor_test_hub"
SRC_ROOT = os.path.join(REPO_ROOT, "src")
PUBLIC_ROOT = os.path.join(REPO_ROOT, "public")
TESTS_ROOT = os.path.join(REPO_ROOT, "tests")
DIST_ROOT = os.path.join(REPO_ROOT, "dist")

report = {}

# 1. CATALOG ALL FILES
def get_file_info(root_dir):
    files_info = []
    for root, dirs, files in os.walk(root_dir):
        for f in sorted(files):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, REPO_ROOT)
            size = os.path.getsize(full)
            files_info.append({"path": rel, "size": size})
    return files_info

src_info = get_file_info(SRC_ROOT)
public_info = get_file_info(PUBLIC_ROOT)
tests_info = get_file_info(TESTS_ROOT) if os.path.exists(TESTS_ROOT) else []

# Categorize src files
pages = [f for f in src_info if f["path"].startswith("src/pages/")]
components = [f for f in src_info if f["path"].startswith("src/components/")]
engines = [f for f in src_info if f["path"].startswith("src/engine/")]
layouts = [f for f in src_info if f["path"].startswith("src/layouts/")]
utils = [f for f in src_info if f["path"].startswith("src/utils/")]
types = [f for f in src_info if f["path"].startswith("src/types/")]
styles = [f for f in src_info if f["path"].startswith("src/styles/")]

report["inventory"] = {
    "total_src_files": len(src_info),
    "total_public_files": len(public_info),
    "total_tests_files": len(tests_info),
    "pages_count": len(pages),
    "components_count": len(components),
    "engines_count": len(engines),
    "layouts_count": len(layouts),
    "utils_count": len(utils),
    "types_count": len(types),
    "styles_count": len(styles),
    "pages": pages,
    "components": components,
    "engines": engines,
    "layouts": layouts,
    "utils": utils,
    "types": types,
    "styles": styles,
    "public": public_info,
    "tests": tests_info
}

# 2. CHECK CONTENTS FOR ALL FILES
file_contents = {}
for item in src_info:
    full = os.path.join(REPO_ROOT, item["path"])
    try:
        with open(full, "r", encoding="utf-8") as f:
            file_contents[item["path"]] = f.read()
    except Exception as e:
        print(f"Error reading {item['path']}: {e}")

# 3. DETECT DYNAMIC ROUTES & ROUTE COLLISION
dynamic_routes = [p["path"] for p in pages if "[" in p["path"] and "]" in p["path"]]
report["dynamic_routes"] = dynamic_routes

# 4. DEEP ORPHAN & DEAD CODE ANALYSIS
# Check each engine file
orphans_found = []
for eng in engines:
    path = eng["path"]
    filename = os.path.basename(path)
    base_name = filename.replace(".ts", "").replace(".test", "").replace(".stress", "").replace(".perf", "")
    
    # Check if imported or referenced anywhere in src/ or tests/
    refs = []
    for src_path, content in file_contents.items():
        if src_path == path:
            continue
        if base_name in content or filename in content:
            refs.append(src_path)
            
    if not refs:
        orphans_found.append({
            "type": "engine",
            "path": path,
            "size": eng["size"]
        })

for comp in components:
    path = comp["path"]
    filename = os.path.basename(path)
    base_name = filename.split(".")[0]
    
    refs = []
    for src_path, content in file_contents.items():
        if src_path == path:
            continue
        if base_name in content or filename in content:
            refs.append(src_path)
            
    if not refs:
        orphans_found.append({
            "type": "component",
            "path": path,
            "size": comp["size"]
        })

report["orphan_files"] = orphans_found

# 5. ENVIRONMENT VARIABLES & SENSITIVE DATA SCAN
env_files = glob.glob(os.path.join(REPO_ROOT, ".env*"))
env_uses = []
for src_path, content in file_contents.items():
    env_matches = re.findall(r"import\.meta\.env\.([A-Z0-9_]+)|process\.env\.([A-Z0-9_]+)", content)
    if env_matches:
        vars_found = [m[0] or m[1] for m in env_matches]
        env_uses.append({"file": src_path, "vars": list(set(vars_found))})

report["env_audit"] = {
    "env_files": [os.path.basename(ef) for ef in env_files],
    "env_vars_used": env_uses
}

# 6. DIST / BUILD OUTPUT AUDIT
if os.path.exists(DIST_ROOT):
    dist_files = []
    html_count = 0
    total_dist_size = 0
    js_files = []
    css_files = []
    
    for root, dirs, files in os.walk(DIST_ROOT):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, DIST_ROOT)
            size = os.path.getsize(full)
            total_dist_size += size
            if f.endswith(".html"):
                html_count += 1
            elif f.endswith(".js"):
                js_files.append({"path": rel, "size": size})
            elif f.endswith(".css"):
                css_files.append({"path": rel, "size": size})
                
    report["dist_audit"] = {
        "html_count": html_count,
        "total_dist_size_bytes": total_dist_size,
        "js_files_count": len(js_files),
        "css_files_count": len(css_files),
        "js_files": js_files,
        "css_files": css_files
    }

# 7. UNUSED IMPORTS & SUSPICIOUS PATTERNS SCAN
suspicious_patterns = []
for src_path, content in file_contents.items():
    # Check for hardcoded test returns or bypasses
    if "VICTORY_CONFIRMED" in content:
        suspicious_patterns.append({"file": src_path, "pattern": "VICTORY_CONFIRMED"})
    if "MOCK_BYPASS" in content or "TODO_MOCK" in content:
        suspicious_patterns.append({"file": src_path, "pattern": "MOCK_BYPASS"})
    # Check console.error or debugger statements
    if "debugger;" in content:
        suspicious_patterns.append({"file": src_path, "pattern": "debugger"})

report["suspicious_patterns"] = suspicious_patterns

print(json.dumps(report, indent=2))
