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

results = []

for rel_path, full_path in routes:
    with open(full_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Check 1: Curved box containers & Specular Highlights
    # Look for rounded-3xl or rounded-2xl or rounded-xl on main containers
    has_rounded_3xl = 'rounded-3xl' in content
    has_rounded_2xl = 'rounded-2xl' in content
    has_rounded = has_rounded_3xl or has_rounded_2xl
    
    # Specular highlights borders: border-white/10, border-white/20, border-border-hairline, border-white/5, etc.
    has_border_specular = any(b in content for b in [
        'border-white/10', 'border-white/20', 'border-white/15', 'border-white/5',
        'border-border-hairline', 'border-white/30', 'border-white/25', 'border-border-interactive'
    ])
    
    curved_and_specular = has_rounded and has_border_specular

    # Check 2: Master Bento Diagnostic Suite (or 4-part Bento components)
    has_master_bento = 'MasterBentoDiagnosticSuite' in content
    bento_components_found = []
    for comp in ['ScreenInfoCard', 'QuickColorPalette', 'KeyboardShortcutsCard', 'CustomColorPicker', 'ToolControlsCard', 'DiagnosticContextPanel', 'DiagnosticResultPanel']:
        if comp in content:
            bento_components_found.append(comp)
    
    if has_master_bento:
        bento_type = 'MasterBentoDiagnosticSuite'
    elif len(bento_components_found) >= 3:
        bento_type = f'Partial Bento ({len(bento_components_found)} components)'
    elif len(bento_components_found) > 0:
        bento_type = f'Minimal Bento ({len(bento_components_found)} components)'
    else:
        bento_type = 'None'

    # Check 3: Step Workflow Section
    has_step_workflow = 'StepWorkflowSection' in content or 'StepWorkflow' in content

    # Check 4: Panel Type Breakdown Section
    has_panel_breakdown = 'PanelTypeBreakdownSection' in content or 'PanelTypeBreakdown' in content

    # Check 5: E-E-A-T Technical SEO Article & 10 Structured FAQs
    # Extract faqs array
    faq_items = []
    
    # Try finding faqs array in frontmatter
    # Match const faqs = [ ... ]
    faqs_block_match = re.search(r'const\s+faqs\b.*?\=\s*(\[\s*\{.*?\}(?:\s*,\s*\{.*?\})*\s*\]);', content, re.DOTALL)
    if not faqs_block_match:
        faqs_block_match = re.search(r'faqs\s*:\s*FAQItem\[\]\s*=\s*(\[.*?\]);', content, re.DOTALL)
    if not faqs_block_match:
        faqs_block_match = re.search(r'faqs\s*=\s*(\[.*?\]);', content, re.DOTALL)

    if faqs_block_match:
        faq_str = faqs_block_match.group(1)
        # count occurrences of 'question:' or 'q:'
        q_matches = re.findall(r'(?:question|q)\s*:\s*["`\']', faq_str)
        faq_count = len(q_matches)
    else:
        q_matches = re.findall(r'question\s*:\s*["`\']', content)
        faq_count = len(q_matches)

    has_faq_section_comp = '<FAQSection' in content
    passed_to_layout = ('faqs={faqs}' in content or 'faqs={' in content or 'faqs}' in content) and '<Layout' in content

    # E-E-A-T article check: check for substantial prose section or article/guide markup
    has_article_tag = '<article' in content or 'prose' in content or '<h2' in content or '<h3' in content
    # check length of file as proxy for technical article depth
    has_eeat_article = has_article_tag and len(content) > 3000

    results.append({
        'route': rel_path,
        'full_path': full_path,
        'curved_and_specular': curved_and_specular,
        'has_rounded_3xl': has_rounded_3xl,
        'has_rounded_2xl': has_rounded_2xl,
        'has_border_specular': has_border_specular,
        'has_master_bento': has_master_bento,
        'bento_type': bento_type,
        'bento_components': bento_components_found,
        'has_step_workflow': has_step_workflow,
        'has_panel_breakdown': has_panel_breakdown,
        'faq_count': faq_count,
        'has_exactly_10_faqs': faq_count == 10,
        'has_faq_section_comp': has_faq_section_comp,
        'passed_to_layout': passed_to_layout,
        'has_eeat_article': has_eeat_article,
        'file_size': len(content)
    })

with open('/Users/divyyadav/newws/.agents/explorer_audit_1/audit_summary.json', 'w') as out:
    json.dump(results, out, indent=2)

print(f"Audited {len(results)} pages. Summary saved to audit_summary.json.")
