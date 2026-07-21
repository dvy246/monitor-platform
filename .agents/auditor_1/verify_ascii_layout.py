import sys

file_path = "/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

mockups = [
    ("Ghosting Invaders", 305, 335),
    ("Color Match Alchemist", 345, 375),
    ("Lag Reflex Sniper", 395, 422),
    ("Touch Matrix Defusal", 430, 455)
]

for name, start_search, end_search in mockups:
    print(f"\n=======================================================")
    print(f"MOCKUP: {name}")
    print(f"=======================================================")
    
    found_box = []
    for idx in range(start_search - 1, min(end_search, len(lines))):
        line = lines[idx].rstrip("\r\n")
        if line.startswith("+--") or line.startswith("|"):
            found_box.append((idx + 1, line))
    
    print(f"Total lines in ASCII box: {len(found_box)}")
    all_col_85 = True
    for line_num, l_str in found_box:
        length = len(l_str)
        ends_correctly = l_str.endswith("|") or l_str.endswith("+")
        status = "OK" if (length == 85 and ends_correctly) else "FAIL"
        if status != "OK":
            all_col_85 = False
        print(f"Line {line_num:3d} | Len: {length:2d} | End: '{l_str[-1]}' | Status: {status} | {repr(l_str[:50])}...")
    
    if all_col_85:
        print(f"==> VERDICT FOR {name}: PERFECT RIGHT-BORDER ALIGNMENT AT COL 85 (len=85, ends with | or +) <==")
    else:
        print(f"==> VERDICT FOR {name}: ALIGNMENT FAILURE <==")

