import json

with open('/Users/divyyadav/newws/.agents/explorer_audit_1/audit_summary.json') as f:
    data = json.load(f)

categories_to_check = [
    "Primary Standalone Diagnostics",
    "Touch Tests",
    "Touch Matrix",
    "Mouse Diagnostics",
    "Controller Diagnostics",
    "Keyboard Diagnostics"
]

def get_cat(r):
    if r in ['refresh-rate-test.astro', 'monitor-color-calibration.astro', 'sound-test.astro', 'webcam-test.astro', 'screen-test.astro']:
        return "Primary Standalone Diagnostics"
    elif r.startswith('touch-tests/'):
        return "Touch Tests"
    elif r.startswith('touch-matrix/'):
        return "Touch Matrix"
    elif r.startswith('mouse-test/'):
        return "Mouse Diagnostics"
    elif r.startswith('controller-test/'):
        return "Controller Diagnostics"
    elif r.startswith('keyboard-tester/'):
        return "Keyboard Diagnostics"
    return "Other"

for cat in categories_to_check:
    print(f"\n==================== {cat} ====================")
    cat_items = [i for i in data if get_cat(i['route']) == cat]
    for item in cat_items:
        print(f"Path: {item['route']}")
        print(f"  Curved & Specular: {item['curved_and_specular']} (round_3xl={item['has_rounded_3xl']}, round_2xl={item['has_rounded_2xl']}, border={item['has_border_specular']})")
        print(f"  Bento: {item['bento_type']}")
        print(f"  Step Workflow: {item['has_step_workflow']}")
        print(f"  Panel Breakdown: {item['has_panel_breakdown']}")
        print(f"  FAQ Count: {item['faq_count']} | FAQSection: {item['has_faq_section_comp']} | Layout faqs: {item['passed_to_layout']}")
        print(f"  E-E-A-T Article: {item['has_eeat_article']} (Length: {item['file_size']} bytes)")
