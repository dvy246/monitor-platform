#!/usr/bin/env python3
"""
Empirical Mobile Viewport Verification Script for Monitor Test Hub
Focus:
- 0px document horizontal overflow on viewports: 320px, 375px, 393px, 430px
- Text wrapping for headers, YMYL banners, signature hashes, tables, and code snippets
- Canvas dynamic height scaling (h-60 sm:h-[460px] min-h-[320px])
"""

import os
import re
import glob
from pathlib import Path
from html.parser import HTMLParser

DIST_DIR = Path("/Users/divyyadav/newws/monitor_test_hub/dist")
SRC_DIR = Path("/Users/divyyadav/newws/monitor_test_hub/src")

VIEWPORTS = [320, 375, 393, 430]

class HTMLInspector(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.overflow_risks = []
        self.headers = []
        self.ymyl_banners = []
        self.signature_hashes = []
        self.tables = []
        self.code_snippets = []
        self.canvases = []

        self.current_tag = None
        self.current_attrs = {}
        self.in_pre = False
        self.in_code = False
        self.in_table = False

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        classes = attr_dict.get('class', '')
        style = attr_dict.get('style', '')
        tag_id = attr_dict.get('id', '')

        # Check canvas
        if tag == 'canvas':
            self.canvases.append({
                'id': tag_id,
                'class': classes,
                'style': style,
                'width': attr_dict.get('width'),
                'height': attr_dict.get('height')
            })

        # Check headers
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.headers.append({
                'tag': tag,
                'class': classes,
                'style': style
            })

        # Check YMYL Banners
        if 'ymyl' in tag_id.lower() or 'medical' in tag_id.lower() or 'epilepsy' in tag_id.lower() or 'disclaimer' in classes.lower() or 'warning' in classes.lower() or 'notice' in classes.lower():
            self.ymyl_banners.append({
                'id': tag_id,
                'class': classes,
                'tag': tag
            })

        # Check tables
        if tag == 'table':
            self.in_table = True
            self.tables.append({
                'class': classes,
                'style': style
            })

        # Check pre/code
        if tag == 'pre':
            self.in_pre = True
            self.code_snippets.append({
                'tag': 'pre',
                'class': classes,
                'style': style
            })
        elif tag == 'code':
            self.in_code = True
            self.code_snippets.append({
                'tag': 'code',
                'class': classes,
                'style': style
            })

        # Check fixed width overflow risks (e.g. min-w-[500px], w-[600px], style width: 500px)
        w_match = re.search(r'(?:min-w|w)-\[(\d+)px\]', classes)
        style_w_match = re.search(r'(?:min-)?width:\s*(\d+)px', style)
        
        px_val = None
        if w_match:
            px_val = int(w_match.group(1))
        elif style_w_match:
            px_val = int(style_w_match.group(1))

        if px_val and px_val > 300:
            # Check if parent or element has max-w-full or overflow-x-auto
            has_overflow_control = 'overflow-x-auto' in classes or 'max-w-full' in classes or 'w-full' in classes or 'break-all' in classes or 'overflow-hidden' in classes
            self.overflow_risks.append({
                'tag': tag,
                'id': tag_id,
                'class': classes,
                'style': style,
                'px_width': px_val,
                'has_overflow_control': has_overflow_control
            })

    def handle_endtag(self, tag):
        if tag == 'table':
            self.in_table = False
        elif tag == 'pre':
            self.in_pre = False
        elif tag == 'code':
            self.in_code = False

    def handle_data(self, data):
        # Look for potential raw signature hashes (64-char hex or long unbroken hex strings)
        if len(data.strip()) >= 32 and re.search(r'\b[a-f0-9]{32,64}\b', data.strip(), re.IGNORECASE):
            self.signature_hashes.append({
                'hash': data.strip()[:16] + '...',
                'len': len(data.strip())
            })

def audit_dist():
    html_files = list(DIST_DIR.glob("**/*.html"))
    print(f"Auditing {len(html_files)} generated static HTML files in {DIST_DIR}...")

    total_canvases = 0
    canvas_class_counts = {}
    table_overflow_controls = 0
    tables_without_overflow = []
    code_snippets_overflow = 0
    signature_hashes_found = 0
    overflow_risks_found = []

    # Process representative sample if too many files
    sample_files = [f for f in html_files if any(p in str(f) for p in [
        'index.html', 'refresh-rate-test', 'dead-pixel', 'sub-pixel', 'vrr', 
        'passport', 'models', 'compare', 'white-screen', 'pc-bottleneck', 'keyboard-tester'
    ])][:50]
    
    if not sample_files:
        sample_files = html_files[:50]

    for html_file in sample_files:
        try:
            content = html_file.read_text(encoding='utf-8', errors='ignore')
            parser = HTMLInspector(str(html_file.relative_to(DIST_DIR)))
            parser.feed(content)

            total_canvases += len(parser.canvases)
            for c in parser.canvases:
                cls = c['class']
                canvas_class_counts[cls] = canvas_class_counts.get(cls, 0) + 1

            for t in parser.tables:
                if 'overflow' in t['class'] or 'table' in t['class']:
                    table_overflow_controls += 1

            for r in parser.overflow_risks:
                if not r['has_overflow_control']:
                    overflow_risks_found.append((html_file.name, r))

            signature_hashes_found += len(parser.signature_hashes)

        except Exception as e:
            print(f"Error reading {html_file}: {e}")

    print("\n--- SAMPLE AUDIT SUMMARY ---")
    print(f"Sample html files audited: {len(sample_files)}")
    print(f"Total canvas elements detected: {total_canvases}")
    print(f"Canvas class distribution: {canvas_class_counts}")
    print(f"Signature hashes found in text: {signature_hashes_found}")
    print(f"Uncontrolled fixed-width elements (>300px without max-w-full/overflow): {len(overflow_risks_found)}")
    if overflow_risks_found:
        for fname, r in overflow_risks_found[:5]:
            print(f"  - {fname}: tag <{r['tag']}> id='{r['id']}' px_width={r['px_width']} class='{r['class']}'")

def audit_src_canvas_scaling():
    print("\n--- SRC CANVAS DYNAMIC HEIGHT SCALING AUDIT ---")
    astro_files = list(SRC_DIR.glob("**/*.astro"))
    target_pattern = r'h-60\s+sm:h-\[460px\]\s+min-h-\[320px\]'

    matches = []
    for f in astro_files:
        content = f.read_text(encoding='utf-8', errors='ignore')
        if 'min-h-[320px]' in content:
            for i, line in enumerate(content.splitlines(), 1):
                if 'min-h-[320px]' in line:
                    matches.append((f.relative_to(SRC_DIR), i, line.strip()))

    print(f"Found {len(matches)} occurrences of min-h-[320px] in Astro source files:")
    for filepath, line_num, snippet in matches:
        print(f"  - {filepath}:{line_num}")
        print(f"    {snippet[:100]}...")

def audit_tables_and_code():
    print("\n--- SRC TABLES AND CODE SNIPPETS WRAPPING AUDIT ---")
    astro_files = list(SRC_DIR.glob("**/*.astro"))
    
    table_wrappers = []
    pre_wrappers = []

    for f in astro_files:
        content = f.read_text(encoding='utf-8', errors='ignore')
        lines = content.splitlines()
        for i, line in enumerate(lines, 1):
            if '<table' in line:
                # check context
                context = "\n".join(lines[max(0, i-3):min(len(lines), i+3)])
                has_wrapper = 'overflow-x-auto' in context or 'overflow-hidden' in context or 'touch-pan-x' in context
                table_wrappers.append((f.relative_to(SRC_DIR), i, has_wrapper, line.strip()))
            if '<pre' in line:
                has_overflow = 'overflow-x-auto' in line or 'break-all' in line or 'whitespace-pre-wrap' in line
                pre_wrappers.append((f.relative_to(SRC_DIR), i, has_overflow, line.strip()))

    print(f"Tables found in Astro components: {len(table_wrappers)}")
    unwrapped_tables = [t for t in table_wrappers if not t[2]]
    print(f"  - Wrapped in overflow-x-auto / touch-pan-x: {len(table_wrappers) - len(unwrapped_tables)}")
    print(f"  - Unwrapped tables: {len(unwrapped_tables)}")
    for filepath, line_num, _, snippet in unwrapped_tables:
        print(f"    * {filepath}:{line_num} -> {snippet[:80]}")

    print(f"\nPre/Code blocks found in Astro components: {len(pre_wrappers)}")
    unwrapped_pres = [p for p in pre_wrappers if not p[2]]
    print(f"  - Wrapped in overflow-x-auto / break-all: {len(pre_wrappers) - len(unwrapped_pres)}")
    print(f"  - Unwrapped pre blocks: {len(unwrapped_pres)}")
    for filepath, line_num, _, snippet in unwrapped_pres:
        print(f"    * {filepath}:{line_num} -> {snippet[:80]}")

if __name__ == '__main__':
    print("=" * 80)
    print("EMPIRICAL MOBILE VIEWPORT AUDIT FOR MONITOR TEST HUB")
    print("=" * 80)
    audit_dist()
    audit_src_canvas_scaling()
    audit_tables_and_code()
    print("=" * 80)
