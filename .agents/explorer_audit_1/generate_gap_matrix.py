import os
import re
import json

pages_dir = '/Users/divyyadav/newws/monitor_test_hub/src/pages'
ignore_files = {'404.astro', '500.astro', 'about.astro', 'contact.astro', 'privacy.astro', 'terms.astro', 'faq.astro'}

routes = []
for root, dirs, files in os.walk(pages_dir):
    if '[locale]' in root:
        continue
    for f in files:
        if f.endswith('.astro') and f not in ignore_files:
            rel_path = os.path.relpath(os.path.join(root, f), pages_dir)
            routes.append((rel_path, os.path.join(root, f)))

routes.sort(key=lambda x: x[0])

gap_matrix = []

for rel_path, full_path in routes:
    with open(full_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 1. Curved containers & specular highlights
    has_rounded_3xl = 'rounded-3xl' in content
    has_rounded_2xl = 'rounded-2xl' in content
    has_rounded = has_rounded_3xl or has_rounded_2xl
    has_border_specular = any(b in content for b in [
        'border-white/10', 'border-white/20', 'border-white/15', 'border-white/5',
        'border-border-hairline', 'border-white/30', 'border-white/25', 'border-border-interactive'
    ])
    req1_pass = has_rounded and has_border_specular

    # 2. 4-part Master Bento Diagnostic Suite
    has_master_bento = 'MasterBentoDiagnosticSuite' in content
    req2_pass = has_master_bento

    # 3. Step Workflow Section
    has_step_workflow = 'StepWorkflowSection' in content or ('01' in content and 'Preparation' in content and 'Execution' in content)
    req3_pass = 'StepWorkflowSection' in content

    # 4. Panel Type Breakdown Section
    has_panel_breakdown = 'PanelTypeBreakdownSection' in content or ('Professional IPS' in content and 'OLED' in content and 'Hardware Architecture' in content)
    req4_pass = 'PanelTypeBreakdownSection' in content

    # 5. E-E-A-T Technical SEO article & 10-item structured FAQs
    has_eeat = len(content) > 3000 and ('<article' in content or 'prose' in content or 'Technical Specification' in content or '<h2' in content)
    
    # FAQ analysis
    faq_match = re.search(r'const\s+faqs\b.*?\=\s*(\[\s*\{.*?\}(?:\s*,\s*\{.*?\})*\s*\]);', content, re.DOTALL) or \
                re.search(r'faqs\s*:\s*FAQItem\[\]\s*=\s*(\[.*?\]);', content, re.DOTALL) or \
                re.search(r'faqs\s*=\s*(\[.*?\]);', content, re.DOTALL)
    
    if faq_match:
        q_count = len(re.findall(r'(?:question|q)\s*:\s*["`\']', faq_match.group(1)))
    else:
        q_count = len(re.findall(r'question\s*:\s*["`\']', content))
    
    has_faq_comp = '<FAQSection' in content
    passed_to_layout = 'faqs={faqs}' in content or ('faqs={' in content and '<Layout' in content) or ('faqs}' in content and '<Layout' in content)

    req5_pass = has_eeat and q_count == 10 and has_faq_comp and passed_to_layout

    # Determine changes needed
    changes = []
    if not req1_pass:
        if not has_rounded:
            changes.append("Add curved box styling (rounded-3xl / rounded-2xl)")
        if not has_border_specular:
            changes.append("Add specular highlights (border-white/10)")
    if not req2_pass:
        changes.append("Integrate MasterBentoDiagnosticSuite")
    if not req3_pass:
        changes.append("Import and render StepWorkflowSection")
    if not req4_pass:
        changes.append("Import and render PanelTypeBreakdownSection")
    if not req5_pass:
        if not has_eeat:
            changes.append("Expand E-E-A-T technical SEO article")
        if q_count != 10:
            changes.append(f"Adjust FAQ count from {q_count} to exactly 10 FAQs")
        if not has_faq_comp:
            changes.append("Render <FAQSection faqs={faqs} />")
        if not passed_to_layout:
            changes.append("Pass faqs={faqs} to <Layout>")

    gap_matrix.append({
        'route': rel_path,
        'req1_curved_specular': req1_pass,
        'req2_master_bento': req2_pass,
        'req3_step_workflow': req3_pass,
        'req4_panel_breakdown': req4_pass,
        'req5_eeat_10faqs': req5_pass,
        'faq_count': q_count,
        'has_faq_comp': has_faq_comp,
        'passed_to_layout': passed_to_layout,
        'has_eeat': has_eeat,
        'changes_needed': changes if changes else ["Fully compliant"]
    })

with open('/Users/divyyadav/newws/.agents/explorer_audit_1/full_gap_matrix.json', 'w') as out:
    json.dump(gap_matrix, out, indent=2)

print(f"Gap matrix generated for {len(gap_matrix)} routes.")
