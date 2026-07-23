import os
import re

target_files = [
    # Standalone visual test pages
    "src/pages/refresh-rate-test.astro",
    "src/pages/monitor-color-calibration.astro",
    "src/pages/sound-test.astro",
    "src/pages/webcam-test.astro",
    "src/pages/screen-test.astro",
    
    # display-tests/*.astro
    "src/pages/display-tests/apca-contrast.astro",
    "src/pages/display-tests/aspect-ratio-calculator.astro",
    "src/pages/display-tests/backlight-bleed.astro",
    "src/pages/display-tests/blooming-test.astro",
    "src/pages/display-tests/color-banding.astro",
    "src/pages/display-tests/color-gamut.astro",
    "src/pages/display-tests/colorblind-simulation.astro",
    "src/pages/display-tests/contrast-accessibility.astro",
    "src/pages/display-tests/dead-pixel.astro",
    "src/pages/display-tests/dead-pixel-test/index.astro",
    "src/pages/display-tests/dead-pixel-test/[slug].astro",
    "src/pages/display-tests/delta-e-calculator.astro",
    "src/pages/display-tests/electricity-cost.astro",
    "src/pages/display-tests/electricity-cost/[slug].astro",
    "src/pages/display-tests/flicker-test.astro",
    "src/pages/display-tests/frame-skipping.astro",
    "src/pages/display-tests/gamma.astro",
    "src/pages/display-tests/geometry.astro",
    "src/pages/display-tests/grayscale.astro",
    "src/pages/display-tests/hdr-test.astro",
    "src/pages/display-tests/index.astro",
    "src/pages/display-tests/local-dimming.astro",
    "src/pages/display-tests/motion-blur.astro",
    "src/pages/display-tests/oled-burn-in.astro",
    "src/pages/display-tests/pixel-walk.astro",
    "src/pages/display-tests/ppi-calculator.astro",
    "src/pages/display-tests/pwm-flicker.astro",
    "src/pages/display-tests/refresh-rate-test/[targetHz].astro",
    "src/pages/display-tests/return-window-checker/[slug].astro",
    "src/pages/display-tests/rgb-channel-test.astro",
    "src/pages/display-tests/screen-test.astro",
    "src/pages/display-tests/stuck-pixel.astro",
    "src/pages/display-tests/sub-pixel.astro",
    "src/pages/display-tests/text-sharpness.astro",
    "src/pages/display-tests/tv-viewing-distance.astro",
    "src/pages/display-tests/tv-viewing-distance/[slug].astro",
    "src/pages/display-tests/uniformity.astro",
    "src/pages/display-tests/viewing-angle.astro",
    "src/pages/display-tests/vrr.astro",
    
    # white-screen/*
    "src/pages/white-screen/index.astro",
    "src/pages/white-screen/[color].astro",
]

base_dir = "/Users/divyyadav/newws/monitor_test_hub"

print(f"Total target files: {len(target_files)}")

results = []

for rel_path in target_files:
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        results.append((rel_path, "FILE_NOT_FOUND", []))
        continue
        
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    has_curved_border = bool(re.search(r'rounded-(3xl|2xl)', content) and re.search(r'border-(white/10|border-hairline|white/20)', content))
    has_bento = "MasterBentoDiagnosticSuite" in content or "Master Bento" in content
    has_step = "StepWorkflowSection" in content or "How To Run" in content
    has_panel = "PanelTypeBreakdownSection" in content or "Panel Technology Breakdown" in content
    
    # Check FAQs
    has_faq_component = "FAQSection" in content
    has_layout_faqs = re.search(r'<Layout[^>]*faqs=\{faqs\}', content) is not None or re.search(r'<Layout[^>]*faqs=\{[a-zA-Z0-9_]+\}', content) is not None
    
    # Count items in faqs array if defined
    faq_match = re.search(r'const (faqs|structuredFaqs)\s*=\s*\[(.*?)\];', content, re.DOTALL)
    faq_count = 0
    if faq_match:
        # count objects { ... }
        faq_items = re.findall(r'\{[^{}]*\}', faq_match.group(2))
        faq_count = len(faq_items)
        
    missing = []
    if not has_curved_border:
        missing.append("Req1 (Curved Box/Border)")
    if not has_bento:
        missing.append("Req2 (MasterBento)")
    if not has_step:
        missing.append("Req3 (StepWorkflow)")
    if not has_panel:
        missing.append("Req4 (PanelTypeBreakdown)")
    if not has_faq_component or not has_layout_faqs or faq_count != 10:
        missing.append(f"Req5 (FAQs: component={has_faq_component}, layout={has_layout_faqs}, count={faq_count})")
        
    results.append((rel_path, "OK" if not missing else "INCOMPLETE", missing))

print("\n--- AUDIT RESULTS ---")
incomplete_count = 0
for path, status, missing in results:
    if status != "OK":
        incomplete_count += 1
        print(f"❌ {path}: {', '.join(missing)}")
    else:
        print(f"✅ {path}")

print(f"\nSummary: {len(results) - incomplete_count}/{len(results)} fully compliant.")
