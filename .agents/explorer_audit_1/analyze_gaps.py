import json

with open('/Users/divyyadav/newws/.agents/explorer_audit_1/audit_summary.json') as f:
    data = json.load(f)

print(f"Total routes loaded: {len(data)}")

# Group routes by main directory/type
categories = {
    "Primary Standalone Diagnostics": [],
    "Display Tests": [],
    "Touch Tests": [],
    "Touch Matrix": [],
    "Mouse Diagnostics": [],
    "Controller Diagnostics": [],
    "Keyboard Diagnostics": [],
    "Benchmarks & Calculators": [],
    "Diagnostic Arcade Micro-Games": [],
    "Sound & Audio Diagnostics": [],
    "White Screen & Lighting": [],
    "Other Diagnostic Sub-routes": []
}

for item in data:
    r = item['route']
    if r in ['refresh-rate-test.astro', 'monitor-color-calibration.astro', 'sound-test.astro', 'webcam-test.astro', 'screen-test.astro']:
        categories["Primary Standalone Diagnostics"].append(item)
    elif r.startswith('display-tests/'):
        categories["Display Tests"].append(item)
    elif r.startswith('touch-tests/'):
        categories["Touch Tests"].append(item)
    elif r.startswith('touch-matrix/'):
        categories["Touch Matrix"].append(item)
    elif r.startswith('mouse-test/'):
        categories["Mouse Diagnostics"].append(item)
    elif r.startswith('controller-test/'):
        categories["Controller Diagnostics"].append(item)
    elif r.startswith('keyboard-tester/'):
        categories["Keyboard Diagnostics"].append(item)
    elif r.startswith('benchmarks/'):
        categories["Benchmarks & Calculators"].append(item)
    elif r.startswith('arcade/'):
        categories["Diagnostic Arcade Micro-Games"].append(item)
    elif r.startswith('sound-test/') or r.startswith('audio-tests/'):
        categories["Sound & Audio Diagnostics"].append(item)
    elif r.startswith('white-screen/'):
        categories["White Screen & Lighting"].append(item)
    else:
        categories["Other Diagnostic Sub-routes"].append(item)

summary = {}
for cat, items in categories.items():
    summary[cat] = {
        "count": len(items),
        "full_bento_count": sum(1 for i in items if i['has_master_bento']),
        "step_workflow_count": sum(1 for i in items if i['has_step_workflow']),
        "panel_breakdown_count": sum(1 for i in items if i['has_panel_breakdown']),
        "curved_specular_count": sum(1 for i in items if i['curved_and_specular']),
        "exactly_10_faqs_count": sum(1 for i in items if i['has_exactly_10_faqs']),
        "faq_section_count": sum(1 for i in items if i['has_faq_section_comp'])
    }

print(json.dumps(summary, indent=2))
