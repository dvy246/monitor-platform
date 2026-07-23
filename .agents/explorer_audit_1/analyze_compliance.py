import json

with open('/Users/divyyadav/newws/.agents/explorer_audit_1/full_gap_matrix.json') as f:
    matrix = json.load(f)

fully_compliant = []
partially_compliant = []
non_compliant = []

for item in matrix:
    passes = [
        item['req1_curved_specular'],
        item['req2_master_bento'],
        item['req3_step_workflow'],
        item['req4_panel_breakdown'],
        item['req5_eeat_10faqs']
    ]
    score = sum(1 for p in passes if p)
    item['score'] = score
    if score == 5:
        fully_compliant.append(item)
    elif score >= 3:
        partially_compliant.append(item)
    else:
        non_compliant.append(item)

print(f"Total Routes Audited: {len(matrix)}")
print(f"Fully Compliant (5/5): {len(fully_compliant)}")
print(f"Partially Compliant (3/5 or 4/5): {len(partially_compliant)}")
print(f"Non-Compliant (0/5, 1/5, 2/5): {len(non_compliant)}")

print("\n--- Fully Compliant Routes (5/5) ---")
for fc in fully_compliant:
    print(f"  - {fc['route']}")

print("\n--- Partially Compliant Routes Sample ---")
for pc in partially_compliant[:15]:
    print(f"  - {pc['route']} (Score: {pc['score']}/5) -> Missing: {', '.join(pc['changes_needed'])}")

print("\n--- Non-Compliant Routes Sample ---")
for nc in non_compliant[:15]:
    print(f"  - {nc['route']} (Score: {nc['score']}/5) -> Missing: {', '.join(nc['changes_needed'])}")
