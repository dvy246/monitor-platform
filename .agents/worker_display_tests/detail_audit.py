import os
import re

target_files = [
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
    "src/pages/white-screen/index.astro",
    "src/pages/white-screen/[color].astro",
]

base_dir = "/Users/divyyadav/newws/monitor_test_hub"

for rel_path in target_files:
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"MISSING FILE: {rel_path}")
        continue
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    has_bento = "MasterBentoDiagnosticSuite" in content or "Master Bento" in content
    has_step = "StepWorkflowSection" in content
    has_panel = "PanelTypeBreakdownSection" in content
    has_faq_comp = "<FAQSection" in content
    has_layout_faqs = "faqs={" in content
    
    # Extract faqs array
    faq_match = re.search(r'const (faqs|structuredFaqs)\s*=\s*\[(.*?)\];', content, re.DOTALL)
    count = 0
    if faq_match:
        items = re.findall(r'\{[^{}]*\}', faq_match.group(2))
        count = len(items)
        
    status = "OK" if (has_bento and has_step and has_panel and has_faq_comp and has_layout_faqs and count == 10) else "NEED_WORK"
    print(f"{status} | {rel_path} | Bento={has_bento} Step={has_step} Panel={has_panel} FAQComp={has_faq_comp} LayoutFaqs={has_layout_faqs} FAQCount={count}")
