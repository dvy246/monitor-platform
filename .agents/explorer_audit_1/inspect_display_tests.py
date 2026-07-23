import json

with open('/Users/divyyadav/newws/.agents/explorer_audit_1/audit_summary.json') as f:
    data = json.load(f)

print("--- Display Tests Breakdown ---")
display_tests = [i for i in data if i['route'].startswith('display-tests/')]
for dt in display_tests:
    print(f"Path: {dt['route']}")
    print(f"  Curved & Specular: {dt['curved_and_specular']}")
    print(f"  Bento: {dt['bento_type']}")
    print(f"  Step Workflow: {dt['has_step_workflow']}")
    print(f"  Panel Breakdown: {dt['has_panel_breakdown']}")
    print(f"  FAQ Count: {dt['faq_count']} | FAQSection: {dt['has_faq_section_comp']} | Layout faqs: {dt['passed_to_layout']}")
    print(f"  E-E-A-T Article: {dt['has_eeat_article']} (Length: {dt['file_size']} bytes)")
    print()
