import unicodedata

REPORT_PATH = "/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md"

def char_display_width(char):
    # Determine visual display width of unicode characters (East Asian Width / Emoji)
    w = unicodedata.east_asian_width(char)
    if w in ('F', 'W'):
        return 2
    # Check for emojis that render as 2 cells wide
    if ord(char) in [0x1F47E, 0x2714, 0x1F590, 0x274C, 0xFE0F]: # 👾, ✔, 🖐, ❌
        return 2
    return 1

def string_display_width(s):
    # sum width of characters, handling emoji sequence
    total = 0
    for char in s:
        # ignore variation selector 0xFE0F
        if ord(char) == 0xFE0F:
            continue
        total += char_display_width(char)
    return total

with open(REPORT_PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

ascii_blocks = []
current_block = []
in_ascii = False
start_line = 0

for idx, line in enumerate(lines, 1):
    if line.strip().startswith("```") and not in_ascii and idx > 300:
        if idx + 1 < len(lines) and ("+" in lines[idx] or "|" in lines[idx] or "+" in lines[idx+1] or "|" in lines[idx+1]):
            in_ascii = True
            start_line = idx
            current_block = []
            continue
    if line.strip().startswith("```") and in_ascii:
        in_ascii = False
        ascii_blocks.append((start_line, current_block))
        current_block = []
        continue
    if in_ascii:
        current_block.append(line.rstrip("\r\n"))

game_names = ["Ghosting Invaders", "Color Match Alchemist", "Lag Reflex Sniper", "Touch Matrix Defusal"]

for i, (start_l, block) in enumerate(ascii_blocks):
    print(f"\n==================================================")
    print(f"Game {i+1}: {game_names[i]} (Lines {start_l+1}-{start_l+len(block)})")
    print(f"==================================================")
    for row_idx, row in enumerate(block, 1):
        char_len = len(row)
        disp_width = string_display_width(row)
        first_char = row[0] if row else ''
        last_char = row[-1] if row else ''
        print(f"Row {row_idx:02d} | char_len={char_len} | disp_width={disp_width} | first='{first_char}' last='{last_char}' | content: {row}")
