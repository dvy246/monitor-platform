import re

files_to_check = [
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/mouse-test/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/controller-test/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/keyboard-tester/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/display-tests/dead-pixel-test/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/display-tests/electricity-cost/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/display-tests/tv-viewing-distance/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/benchmarks/pc-bottleneck/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/benchmarks/wire-gauge-calculator/[slug].astro',
    '/Users/divyyadav/newws/monitor_test_hub/src/pages/benchmarks/3d-print-cost/[slug].astro'
]

for fpath in files_to_check:
    print(f"\n--- Checking {fpath.split('/')[-2]}/{fpath.split('/')[-1]} ---")
    try:
        with open(fpath) as f:
            content = f.read()
        
        has_faq_comp = '<FAQSection' in content
        has_layout_faqs = 'faqs=' in content
        
        # find getStaticPaths or slug definitions
        slug_match = re.findall(r'params:\s*\{\s*slug:\s*[\'"](.*?)[\'"]', content)
        print(f"  Total Slugs defined: {len(slug_match)}")
        print(f"  FAQSection present: {has_faq_comp}")
        print(f"  Layout faqs prop: {has_layout_faqs}")
        
        # Check faqs per slug in code
        faqs_matches = re.findall(r'faqs:\s*\[(.*?)\]', content, re.DOTALL)
        if faqs_matches:
            # count questions in first faqs array
            q_count = len(re.findall(r'(?:question|q)\s*:', faqs_matches[0]))
            print(f"  FAQs per slug (sample): {q_count}")
        else:
            print("  No explicit faqs array per slug found.")
    except Exception as e:
        print(f"  Error reading file: {e}")
