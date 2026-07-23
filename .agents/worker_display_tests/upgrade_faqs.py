import os
import re

base_dir = "/Users/divyyadav/newws/monitor_test_hub"

# Mapping of file relative path -> list of 10 dicts {"question": ..., "answer": ...}
faq_data = {
    "src/pages/display-tests/apca-contrast.astro": [
        {"question": "What is APCA contrast and how does it differ from WCAG 2.1?", "answer": "APCA (Advanced Perceptual Contrast Algorithm) is the proposed contrast standard for WCAG 3.0. Unlike WCAG 2.1 which uses a simple 4.5:1 ratio, APCA calculates non-linear human visual perception based on spatial frequency, font weight, background polarity, and ambient room light."},
        {"question": "What is an acceptable APCA Lc value for web & UI text?", "answer": "An APCA Lc score of 75+ is recommended for primary body text, Lc 60+ for secondary text, and Lc 45+ for large headings (24px+). Scores below Lc 45 fail accessibility legibility guidelines."},
        {"question": "How does ambient room lighting (Lux) affect display contrast?", "answer": "Ambient room light reflects off screen surfaces, raising effective black levels (especially on glossy OLED or IPS panels). Our calculator applies ISO 9241-307 specular reflection formulas to derate contrast ratio based on room lux."},
        {"question": "Why does text font size and font weight alter APCA legibility thresholds?", "answer": "Human spatial visual acuity decreases for thinner or smaller font strokes. APCA incorporates non-linear spatial frequency factors requiring higher luminance contrast for thin 12px text than bold 32px headers."},
        {"question": "How does dark mode (light-on-dark) contrast calculation differ from light mode?", "answer": "Light text on dark backgrounds causes visual halation and irradiation in human eyes. APCA applies asymmetrical weightings for positive vs negative contrast polarities to ensure comfortable reading."},
        {"question": "What specular reflection coefficient is used for glossy vs matte panels?", "answer": "Matte panels diffuse ambient light with ~1.5% to 3.0% specular reflectivity, raising dark gray black floors under high lux. Glossy OLED panels maintain lower ~0.5% specular reflection but create distinct mirror reflections."},
        {"question": "Can APCA contrast be calculated automatically for dynamic web applications?", "answer": "Yes, our pure-TypeScript APCA calculation engine evaluates any foreground and background RGB color pair in real-time to generate precise Lc legibility metrics."},
        {"question": "How do IPS glow and VA shift degrade off-axis visual contrast legibility?", "answer": "Off-axis viewing angles reduce IPS contrast due to backlight glow bleeding into dark areas, while VA panels exhibit gamma shift that lightens dark grays, lowering effective APCA Lc values."},
        {"question": "What is the difference between visual lightness (Lstar) and luminance (Y)?", "answer": "Luminance (Y) measures absolute physical light output in nits (cd/m²), whereas lightness (L*) represents the non-linear cube-root perception of luminance by human vision under CIE standards."},
        {"question": "How does spatial frequency impact human visual contrast sensitivity (CSF)?", "answer": "The human Visual Contrast Sensitivity Function (CSF) peaks at mid-spatial frequencies. Very fine text details require significantly higher physical contrast than broad solid color blocks."}
    ],
    
    "src/pages/display-tests/aspect-ratio-calculator.astro": [
        {"question": "How is display aspect ratio calculated from resolution dimensions?", "answer": "Aspect ratio is determined by simplifying the horizontal pixel count to vertical pixel count ratio using the greatest common divisor (GCD). For example, 3840 × 2160 simplifies to 16:9."},
        {"question": "What is the difference between 16:9, 16:10, 21:9 ultrawide, and 32:9 super ultrawide?", "answer": "16:9 is the universal standard for widescreen video and gaming. 16:10 provides extra vertical workspace for laptops. 21:9 ultrawide delivers cinema 2.39:1 scope, and 32:9 super ultrawide equals two dual 16:9 monitors side-by-side without bezels."},
        {"question": "How do I prevent black bars (pillarboxing or letterboxing) during video playback?", "answer": "Black bars occur when source video aspect ratio does not match panel aspect ratio. Playing 16:9 video on a 21:9 ultrawide leaves pillarbox bars on the sides unless zoom or crop modes are applied."},
        {"question": "What aspect ratio is best for productivity and multi-window multitasking?", "answer": "Ultrawide (21:9 and 32:9) and tall 16:10 or 3:2 aspect ratios excel at productivity by allowing side-by-side document editing, timeline scrubbers, and code windows without switching desktops."},
        {"question": "How does resolution scaling affect aspect ratio rendering on HiDPI screens?", "answer": "OS scaling (e.g. 150% or 200%) increases font size and UI dimensions while maintaining bit-perfect native aspect ratio and pixel geometry."},
        {"question": "What is display letterboxing vs pillarboxing vs windowboxing?", "answer": "Letterboxing adds horizontal black bars at the top and bottom. Pillarboxing adds vertical black bars on the left and right. Windowboxing surrounds the video with black bars on all four sides."},
        {"question": "How do I calculate diagonal screen size from width and height dimensions?", "answer": "Diagonal screen size is calculated using the Pythagorean theorem: Diagonal = √(Width² + Height²). Using physical aspect ratio aspect angles yields physical panel dimensions."},
        {"question": "Why do 16:10 laptops offer more vertical screen real estate than 16:9?", "answer": "16:10 displays provide 11.1% more vertical pixel rows (e.g., 1200 vertical pixels vs 1080), reducing vertical scrolling in web browsers, spreadsheets, and IDEs."},
        {"question": "How do competitive games handle ultrawide (21:9) field of view (FOV)?", "answer": "Competitive games often use Hor+ scaling, expanding horizontal field of view to reveal more game environment, though some titles enforce 16:9 letterboxing to prevent unfair visual advantages."},
        {"question": "What is the mathematical relationship between physical aspect ratio and pixel aspect ratio?", "answer": "Physical aspect ratio represents total display screen dimensions, whereas pixel aspect ratio (PAR) defines individual subpixel shape (square 1:1 PAR for computer monitors vs anamorphic non-square PAR for broadcast TV)."}
    ],

    "src/pages/display-tests/backlight-bleed.astro": [
        {"question": "What causes backlight bleed in LCD monitors?", "answer": "Backlight bleed occurs when display frame bezels apply uneven physical pressure to LCD panel edges, allowing light from CCFL or LED backlights to leak around panel edges into dark scenes."},
        {"question": "How do I distinguish backlight bleed from IPS glow and VA viewing angle shift?", "answer": "Backlight bleed stays fixed in position regardless of viewing position or camera angle. IPS glow shifts location and intensity as your eye moves relative to screen corners."},
        {"question": "Is backlight bleed covered under standard manufacturer warranty policies?", "answer": "Severe backlight bleed that degrades normal viewing in dim rooms is eligible for warranty RMA claims. Minor uniform corner bleed is often classified by manufacturers as standard IPS manufacturing tolerance."},
        {"question": "Can physical bezel pressure or tight mounting screws worsen backlight bleed?", "answer": "Yes, overtightened VESA mounting screws or pinched plastic OSD frames create localized pressure points that exacerbate light leakage along panel edges."},
        {"question": "How do mini-LED local dimming zones mitigate backlight bleed in dark scenes?", "answer": "Mini-LED arrays dynamically turn off backlight zones behind pure black regions of the screen, eliminating edge light leakage and achieving near-OLED black levels."},
        {"question": "Does OLED display technology eliminate backlight bleed completely?", "answer": "Yes! OLED displays use self-emissive subpixels without any backlight panel, meaning unlit pixels output true 0.000 nits pure black with zero backlight bleed."},
        {"question": "How should I set camera exposure when photographing backlight bleed for RMA claims?", "answer": "Use manual camera exposure matching human eye perception (ISO 400, shutter 1/8s, f/2.8) in a dark room. Avoid smartphone night mode auto-exposures that artificially exaggerate light leakage."},
        {"question": "Can ambient lighting reduce the visual appearance of monitor backlight bleed?", "answer": "Yes, bias lighting placed behind the monitor elevates dark ambient adaptation, making minor backlight bleed imperceptible to human eyes."},
        {"question": "Why does backlight bleed appear more prominent in display corners?", "answer": "Corner joints experience maximum mechanical tension from monitor frame assembly and bezel snaps during manufacturing."},
        {"question": "What dark room brightness level is recommended when testing for backlight bleed?", "answer": "Set display brightness to your typical calibrated operating level (120 nits to 150 nits, roughly 30%-50% OSD brightness) in a room with soft ambient lighting."}
    ],

    "src/pages/display-tests/blooming-test.astro": [
        {"question": "What is display blooming (halo effect) in FALD and mini-LED panels?", "answer": "Blooming occurs when bright HDR highlights spill light into adjacent local dimming zones that are attempting to display dark backgrounds, creating a visible glowing halo."},
        {"question": "Why does blooming occur around high-contrast HDR highlights?", "answer": "Because individual local dimming zones cover thousands of pixels. When a small bright object (like a white star or subtitle) spans across a zone boundary, the entire backlight zone behind the dark background must illuminate."},
        {"question": "How does dimming zone count (e.g. 576 vs 1152 vs 2304 zones) affect halo intensity?", "answer": "Higher zone density reduces the physical area of each dimming zone, dramatically tightening halos around bright objects and minimizing perceived blooming."},
        {"question": "Does OLED panel technology suffer from blooming artifacts?", "answer": "No. OLED pixels are individually self-emissive and control brightness down to single subpixels, eliminating local dimming halos completely."},
        {"question": "How do local dimming algorithm response speed and aggressiveness impact blooming?", "answer": "Aggressive dimming algorithms suppress halos by lowering peak highlight brightness, while fast response algorithms prevent halo trailing behind fast-moving bright targets."},
        {"question": "Can subtitle blooming be reduced on mini-LED monitors and TVs?", "answer": "Yes, changing subtitle color to gray or translucent white and placing subtitles within designated lower black letterbox bars reduces local dimming halo intensity."},
        {"question": "What viewing angle shifts make mini-LED blooming more severe off-axis?", "answer": "Viewing mini-LED displays off-center increases perceived halo size because LCD panel off-axis light leakage allows backlight zone illumination to bleed into dark adjacent pixels."},
        {"question": "How does peak HDR nit brightness (e.g. 1000 nits) scale blooming visibility?", "answer": "Higher peak nit highlights increase contrast ratio between bright text and dark backgrounds, making blooming halos more visually prominent in dark room environments."},
        {"question": "What is the difference between static blooming and dynamic motion blooming?", "answer": "Static blooming affects fixed text and logos. Dynamic motion blooming occurs when glowing halos trail behind moving objects across dimming zone boundaries."},
        {"question": "How do IPS contrast ratios affect blooming halo size compared to VA panels?", "answer": "IPS panels have lower native static contrast (1000:1 vs VA 3000:1), making halo light leakage more visible through dark pixels surrounding mini-LED zones."}
    ],

    "src/pages/display-tests/color-banding.astro": [
        {"question": "What causes visual color banding (posterization) on digital displays?", "answer": "Color banding occurs when continuous color gradients are quantized into visible stepped bands due to insufficient color bit-depth, narrow color gamut limits, or crushed GPU lookup tables."},
        {"question": "What is the difference between 8-bit, 8-bit + FRC, and native 10-bit color depth?", "answer": "Native 8-bit displays 256 shades per channel (16.7M colors). 8-bit + Frame Rate Control (FRC) flickers subpixels to simulate 1.07B colors. Native 10-bit renders 1,024 true shades per channel without temporal dithering."},
        {"question": "How do GPU driver color settings (Limited vs Full RGB) cause color banding?", "answer": "Setting GPU output to Limited RGB (16-235) on a Full RGB (0-255) monitor scales color steps improperly, compressing luminance levels and creating severe gradient posterization."},
        {"question": "How can spatial and temporal dithering smooth color gradients on 8-bit panels?", "answer": "Dithering algorithms mix adjacent color pixels or rapidly alternate subpixel states across refresh cycles to visually blur discrete steps into smooth gradients."},
        {"question": "Does color calibration or ICC profile LUT manipulation induce gradient banding?", "answer": "Aggressive software ICC profiles that make steep corrections to graphics card LUTs can cause gray step quantization and visible gradient banding."},
        {"question": "How do compression artifacts in video streams differ from monitor panel banding?", "answer": "Video compression banding comes from lossy H.264/HEVC bitrate encoding. Panel color banding persists even on uncompressed bit-perfect test gradient patterns."},
        {"question": "What test pattern best identifies shadow detail banding in near-black RGB gradients?", "answer": "A 256-step linear gray gradient or 10-bit smooth ramp pattern isolates bit-depth quantization and near-black shadow crushing."},
        {"question": "How does Windows HDR mode affect color bit-depth and gradient transitions?", "answer": "Enabling Windows HDR switches display pipeline to 10-bit / 12-bit Deep Color, eliminating gradient step banding if content and display pipeline support 10-bit PQ EOTF."},
        {"question": "Why do OLED panels sometimes display subtle micro-banding in low-gray scenes?", "answer": "Low-gray 5% luminance patterns on OLEDs can reveal subtle organic subpixel manufacturing variance and Near-Black Chromaticity quantization."},
        {"question": "Can display panel firmware updates fix color bit-depth quantization errors?", "answer": "Yes, firmware updates optimizing internal scaler processing (12-bit or 14-bit internal processing) improve color gradient smoothness before output to panel drivers."}
    ],

    "src/pages/display-tests/color-gamut.astro": [
        {"question": "What is a display color gamut and how is it mapped on the CIE 1931 chromaticity diagram?", "answer": "A color gamut represents the total range of colors a display can physically produce, plotted as a triangular coordinate region within the 2D CIE 1931 horseshoe chromaticity space."},
        {"question": "What are the differences between sRGB, DCI-P3, Adobe RGB, and Rec. 2020 color spaces?", "answer": "sRGB is the standard color space for web and standard video. DCI-P3 expands green/red coverage for cinema and HDR. Adobe RGB broadens cyan-green for print proofing. Rec. 2020 is the wide ultra-HD target."},
        {"question": "Why does an uncalibrated wide-gamut display cause oversaturated colors in Windows?", "answer": "Standard Windows desktop applications assume sRGB. On a wide-gamut DCI-P3 display without color management, sRGB red/green values map to wider physical primaries, making skin tones look unnaturally red."},
        {"question": "What is hardware sRGB clamp mode and why is it essential for non-HDR web content?", "answer": "sRGB clamp restricts display color output to sRGB gamut coordinates, ensuring accurate, natural color reproduction without oversaturation when viewing standard web content."},
        {"question": "How is color gamut coverage percentage calculated vs gamut volume?", "answer": "Gamut coverage measures the overlap percentage inside target color space boundaries. Gamut volume measures total color space size, which can exceed 100% volume while still missing specific coordinates."},
        {"question": "What color gamut coverage is recommended for photo editing, video grading, and gaming?", "answer": "99%+ sRGB is mandatory for web/photo editing. 95%+ DCI-P3 is recommended for HDR video grading and high-end gaming. 99% Adobe RGB is ideal for commercial print reproduction."},
        {"question": "How do Quantum Dot (QD) film overlays expand monitor color volume?", "answer": "Quantum dots absorb blue LED light and emit sharp, narrow-band red and green spectral peaks, widening chromaticity boundaries and boosting color volume at high nit levels."},
        {"question": "What is the difference between 2D chromaticity gamut area and 3D color volume?", "answer": "2D gamut area measures chromaticity boundaries at single luminance levels. 3D color volume incorporates luminance, evaluating whether saturated colors maintain purity at high nit brightness."},
        {"question": "How does macOS ColorSync manage wide-gamut DCI-P3 displays automatically?", "answer": "macOS utilizes system-wide color management (ColorSync) to automatically map sRGB content into DCI-P3 display space without oversaturating non-managed application windows."},
        {"question": "How does panel degradation over time affect color gamut coverage?", "answer": "Organic OLED subpixels and LED phosphors shift spectral output over thousands of operating hours, requiring periodic recalibration to maintain wide-gamut accuracy."}
    ],

    "src/pages/display-tests/colorblind-simulation.astro": [
        {"question": "What are Protanopia, Deuteranopia, and Tritanopia color vision deficiencies?", "answer": "Protanopia is the absence of red L-cones (red-blind). Deuteranopia is the absence of green M-cones (green-blind). Tritanopia is the absence of blue S-cones (blue-blind)."},
        {"question": "How does our LMS color space matrix mathematically simulate color blindness?", "answer": "Our engine transforms RGB colors into LMS (Long, Medium, Short wavelength cone response) space, projects cone responses onto reduced dichromatic planes, and converts back to sRGB."},
        {"question": "What is the difference between dichromacy and anomalous trichromacy (Protanomaly/Deuteranomaly)?", "answer": "Dichromacy is complete absence of one cone type. Anomalous trichromacy means all three cone types are present, but one cone's spectral sensitivity is shifted, causing reduced color discrimination."},
        {"question": "How do UI/UX designers use colorblind simulation to ensure accessible web design?", "answer": "Designers test interface elements through colorblind filters to confirm that interactive buttons, graphs, and error states retain distinct luminance contrast without relying on color alone."},
        {"question": "Why should critical UI status indicators avoid relying solely on Red vs Green color coding?", "answer": "Because red-green color deficiency affects ~8% of males. Pair color coding with distinct icons, shapes, borders, or text labels to ensure full accessibility."},
        {"question": "What APCA and WCAG contrast rules ensure legibility for colorblind users?", "answer": "Ensuring high luminance contrast (WCAG 4.5:1 or APCA Lc 75+) guarantees legibility even when chromatic differences are imperceptible."},
        {"question": "How do colorblind simulation filters assist game developers with accessibility modes?", "answer": "Simulators allow game developers to preview game HUDs and minimaps under simulated dichromacy, validating high-visibility colorblind palette presets."},
        {"question": "What percentage of the global population is affected by red-green color deficiency?", "answer": "Red-green color blindness affects approximately 8% of men and 0.5% of women of Northern European descent due to X-linked recessive genetic inheritance."},
        {"question": "Can display OSD color temperature adjustments help colorblind users distinguish hues?", "answer": "While OSD gain tweaks cannot restore missing cone signals, adjusting monitor contrast and color temperature can emphasize lightness differences between confusing hues."},
        {"question": "How does ambient room lighting affect color perception for individuals with color vision deficiency?", "answer": "High-CRI daylight room lighting boosts visual color discrimination, whereas dim or warm tungsten lighting exacerbates color confusion for dichromats."}
    ],

    "src/pages/display-tests/contrast-accessibility.astro": [
        {"question": "What are the WCAG 2.1 AA and AAA contrast ratio requirements for text and UI elements?", "answer": "WCAG 2.1 AA requires a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text (18pt+ or 14pt bold). AAA requires 7:1 for normal text and 4.5:1 for large text."},
        {"question": "How is relative luminance calculated from sRGB color channel values?", "answer": "sRGB values are linearized by removing gamma correction, then weighted according to human spectral eye sensitivity: Y = 0.2126R + 0.7152G + 0.0722B."},
        {"question": "What is the mathematical formula for computing WCAG contrast ratio (L1 + 0.05) / (L2 + 0.05)?", "answer": "L1 represents the lighter color's relative luminance and L2 represents the darker color's relative luminance. The 0.05 constant accounts for ambient eye adaptation."},
        {"question": "Why does low contrast cause eye strain and visual fatigue during extended monitor use?", "answer": "Low contrast forces eye ciliary muscles to work harder to focus text boundaries, increasing visual fatigue and reducing reading speed."},
        {"question": "How do dark mode color schemes maintain accessibility contrast without glare?", "answer": "Dark mode uses dark gray surfaces (#121215) rather than pure pitch black (#000000) paired with off-white text (#E4E4E7) to prevent high-contrast eye halation while meeting 7:1+ contrast."},
        {"question": "What is the difference between WCAG 2.1 linear contrast and WCAG 3.0 APCA perceptual contrast?", "answer": "WCAG 2.1 uses a static 2D linear ratio. APCA accounts for non-linear human visual perception, font size, stroke weight, background polarity, and spatial frequency."},
        {"question": "How do high-DPI crisp fonts improve perceived text contrast on 4K monitors?", "answer": "High pixel density eliminates blurry subpixel antialiasing edge halos, producing sharp font outlines that maximize spatial visual contrast."},
        {"question": "How does display panel anti-glare coating affect ambient contrast and readability?", "answer": "Matte anti-glare coatings diffuse ambient light reflections, preventing mirror glare from washing out dark background contrast in bright room environments."},
        {"question": "What tools allow web developers to audit accessibility contrast across entire sites?", "answer": "Browser developer tools (Chrome Lighthouse, Axe DevTools) and our online APCA/WCAG contrast inspector calculate real-time legibility metrics."},
        {"question": "How do subpixel rendering algorithms affect contrast at low font sizes?", "answer": "Subpixel text rendering utilizes individual Red, Green, Blue subpixel channels to triple horizontal text resolution, sharpening micro-font legibility."}
    ],

    "src/pages/display-tests/dead-pixel.astro": [
        {"question": "What is a dead pixel and how does it differ from a stuck pixel or subpixel defect?", "answer": "A dead pixel has a failed subpixel transistor logic gate, remaining permanently unlit and black across all backgrounds. A stuck pixel stays locked in a fixed bright color (red, green, blue)."},
        {"question": "What ISO 9241-307 Class limits govern allowable dead pixels under manufacturer warranties?", "answer": "ISO 9241-307 Class I displays allow zero dead pixels. Class II permits up to 2 permanently bright pixels, 5 dark dead pixels, or 10 subpixel defects per million pixels."},
        {"question": "Can dead pixels spread or cause further panel degradation over time?", "answer": "No. A dead pixel is an isolated electrical or physical subpixel defect. It does not spread to adjacent healthy pixels across display panels."},
        {"question": "What solid background colors best reveal dead pixels on IPS, VA, and OLED screens?", "answer": "Pure White (#FFFFFF) reveals dark dead pixels. Pure Black (#000000) isolates bright stuck pixels. Primary Red, Green, and Blue test individual subpixel gates."},
        {"question": "Is it possible to fix a dead pixel using software rapid-flashing utility scripts?", "answer": "Rapid flashing software utilities can unstick stuck subpixel gates, but true dead pixels caused by broken electrical traces cannot be repaired via software."},
        {"question": "What is transistor gate failure in LCD active matrix panels?", "answer": "Thin-Film Transistor (TFT) gate failure occurs when an individual subpixel control transistor fails to pass electrical current, causing subpixels to remain permanently unlit."},
        {"question": "How do retailer return policies handle single dead pixel defects vs multi-pixel clusters?", "answer": "Many major retailers accept hassle-free returns within 30 days for any visible pixel flaw. Official manufacturer warranty replacements often require a minimum cluster of 3-5 dead pixels."},
        {"question": "Why do dead pixels appear pitch black on bright white backgrounds?", "answer": "Because on a white background, all three RGB subpixels should illuminate. An unlit dead subpixel produces zero light output, creating a dark pixel spot."},
        {"question": "Can physical pressure or screen massage repair stuck or dead subpixels?", "answer": "Gently massaging around a stuck subpixel with a soft microfiber cloth can sometimes restore liquid crystal alignment, though caution is required to avoid panel damage."},
        {"question": "What is the difference between a dark subpixel and a bright subpixel defect?", "answer": "A dark subpixel defect fails to let light pass through (appearing dark). A bright subpixel defect stays continuously illuminated regardless of image signal."}
    ],

    "src/pages/display-tests/delta-e-calculator.astro": [
        {"question": "What is CIEDE2000 (ΔE00) and why is it the industry standard for color accuracy?", "answer": "CIEDE2000 (ΔE00) is the CIE standard formula for calculating human perceptual color error. It incorporates non-linear corrections for lightness, chroma, hue, and neutral gray weighting."},
        {"question": "What Delta-E score threshold represents imperceptible color error to human eyes?", "answer": "A ΔE00 score below 1.0 is considered completely imperceptible to human eyes. ΔE00 between 1.0 and 2.0 is the gold standard for professional color grading."},
        {"question": "How does CIEDE2000 account for human visual non-linearity in lightness, chroma, and hue?", "answer": "CIEDE2000 adds rotation terms for blue hue angles and weighting factors (SL, SC, SH) that mirror human eye sensitivity differences across dark vs vivid tones."},
        {"question": "What Delta-E tolerances are required for professional color grading vs consumer displays?", "answer": "Mastering studio monitors require ΔE < 1.0. Commercial graphic design requires ΔE < 2.0. Standard consumer monitors typically exhibit out-of-box ΔE between 3.0 and 5.0."},
        {"question": "How are Lab color coordinates calculated from sRGB or DCI-P3 color values?", "answer": "sRGB values are linearized, converted to CIE XYZ tristimulus space using chromaticity transformation matrices, and normalized relative to D65 reference white to yield L*a*b* coordinates."},
        {"question": "What is the difference between CIE76 (ΔE76), CIE94 (ΔE94), and CIEDE2000 (ΔE00)?", "answer": "CIE76 used simple Euclidean distance in Lab space. CIE94 added basic chroma/hue weightings. CIEDE2000 resolves blue-purple rotation errors and neutral color non-linearities."},
        {"question": "How do colorimeter and spectrophotometer hardware probes measure ΔE color deviation?", "answer": "Probes read physical spectral power distribution or XYZ tristimulus values emitted by the display, comparing measured coordinates against reference patch target values."},
        {"question": "Can visual web-based color comparison tools provide reliable ΔE estimates?", "answer": "Yes, our web-native ΔE calculator computes bit-perfect mathematical CIEDE2000 distance between target reference swatches and calibrated output values."},
        {"question": "Why does a monitor's white point error impact ΔE measurements across all color patches?", "answer": "If white point shifts away from D65 (6500K), all calculated L*a*b* color coordinates shift systematically, raising average ΔE errors across the entire spectrum."},
        {"question": "How often should professional reference monitors be calibrated to maintain ΔE < 1.0?", "answer": "Reference displays should be recalibrated every 200 to 500 operating hours to compensate for backlight aging and thermal drift."}
    ],

    "src/pages/display-tests/electricity-cost.astro": [
        {"question": "How is display electrical power consumption (Watts) converted into monthly energy cost ($)?", "answer": "Monthly cost is calculated with the formula: (Watts × Hours per Day × 30 Days ÷ 1000) × Electric Rate ($/kWh)."},
        {"question": "What is the annual cost formula: (Watts × Hours/Day × 365) ÷ 1000 × kWh Rate?", "answer": "Annual Cost = (Power Draw in Watts × Daily Operating Hours × 365 Days) ÷ 1000 × Electricity Rate in $/kWh."},
        {"question": "How much energy do OLED, Mini-LED, and IPS monitors consume at peak nits?", "answer": "A 27-inch IPS monitor draws ~30-45W. Mini-LED at 1000 nits draws ~60-90W. OLED power varies dynamically from ~25W (dark UI) to ~110W (100% full-screen white window)."},
        {"question": "How does screen brightness level (0% vs 50% vs 100%) impact monitor power draw?", "answer": "Lowering monitor brightness from 100% (350+ nits) to 50% (~150 nits) can reduce display power consumption by up to 40% to 50%."},
        {"question": "What average residential electricity rates ($/kWh) apply across US states?", "answer": "US residential electricity rates range from ~$0.10/kWh in states like Washington and Idaho to ~$0.30+/kWh in California and Hawaii, with a national average around $0.16/kWh."},
        {"question": "Does dynamic HDR content increase monitor electricity consumption compared to SDR?", "answer": "Yes. HDR content drives backlight zones or OLED subpixels to maximum peak nit levels, increasing power draw by 30% to 80% during intense specular highlights."},
        {"question": "How does Energy Star 8.0 certification regulate display standby power consumption?", "answer": "Energy Star 8.0 mandates that certified monitors enter sleep mode with standby power draw under 0.5 Watts."},
        {"question": "How much money can be saved by enabling OS display sleep timers and auto-dimming?", "answer": "Setting OS screen sleep to 5 minutes saves $15-$40 annually per monitor across typical office and gaming setups."},
        {"question": "What is the power consumption difference between a 24-inch 1080p monitor and a 49-inch ultrawide?", "answer": "A 24-inch 1080p monitor draws ~20W, while a 49-inch super ultrawide (32:9) with local dimming can draw 80W-140W under full load."},
        {"question": "How do power supply efficiency ratings (80 Plus) affect desktop monitor power delivery?", "answer": "External power adapters with high efficiency ratings (85%+) minimize AC-to-DC conversion heat loss, ensuring less wasted power."}
    ],

    "src/pages/display-tests/flicker-test.astro": [
        {"question": "What is Pulse Width Modulation (PWM) screen flickering and why does it cause eye strain?", "answer": "PWM dims monitor backlights by rapidly pulsing LEDs on and off. Low-frequency PWM pulses create stroboscopic flickering that causes eye fatigue, headaches, and migraines."},
        {"question": "What is the difference between low-frequency PWM (<250Hz) and high-frequency PWM (>2000Hz)?", "answer": "Low-frequency PWM (<250Hz) creates visible motion strobosteps and optical strain. High-frequency PWM (>2000Hz) pulses faster than human ocular perception, dramatically reducing eye strain."},
        {"question": "What is DC Dimming (Flicker-Free display technology) and how does it adjust brightness?", "answer": "DC Dimming regulates monitor backlight brightness by continuously adjusting direct electrical current (voltage/amperage) rather than pulsing LEDs on and off."},
        {"question": "How can I test my monitor or smartphone for PWM flicker using a high-speed camera?", "answer": "Point a camera set to 240 FPS or high shutter speed (1/1000s) at your screen at 20% brightness. Visible dark rolling bars confirm PWM backlight flickering."},
        {"question": "Why does PWM flickering become more visible at lower screen brightness levels?", "answer": "Because lower brightness reduces the LED 'on' pulse duration while lengthening 'off' time intervals, increasing stroboscopic flicker visibility."},
        {"question": "What physiological symptoms are linked to screen PWM flickering (headaches, eye fatigue)?", "answer": "PWM flicker causes involuntary iris pupil constriction, triggering eye strain, dry eyes, tension headaches, and visual fatigue during long work sessions."},
        {"question": "How does temporal dithering (FRC) create high-frequency micro-flicker on 8-bit panels?", "answer": "8-bit + FRC panels flicker subpixel luminance between adjacent color shades on alternate frames to simulate 10-bit color, creating subtle high-frequency dithering micro-flicker."},
        {"question": "What display certifications (IEEE 1789, TÜV Rheinland Flicker-Free) validate safe backlight dimming?", "answer": "TÜV Rheinland Flicker-Free certification verifies zero PWM flickering across all brightness levels, adhering to IEEE 1789 low-risk dimming standards."},
        {"question": "Does OLED screen PWM flickering differ from LCD LED backlight PWM flickering?", "answer": "OLED panels flicker at screen refresh rate harmonics (e.g., 120Hz/240Hz) due to panel scanlines, whereas LCD PWM frequency depends on backlight inverter circuits."},
        {"question": "How do I reduce eye strain on monitors that utilize low-frequency PWM backlights?", "answer": "Keep monitor OSD brightness at 100% (where PWM is disabled) and use software dimming apps or ambient bias lighting to comfortable room light levels."}
    ],

    "src/pages/display-tests/frame-skipping.astro": [
        {"question": "What is monitor frame skipping and why does it occur on overclocked high-Hz displays?", "answer": "Frame skipping occurs when a monitor's internal processing scaler fails to display every incoming GPU frame, dropping frames at high refresh rates."},
        {"question": "How do I photograph our frame skipping reticle grid to detect dropped frames?", "answer": "Use a camera or smartphone in manual mode with a slow shutter speed (1/10s to 1/5s). A continuous unbroken line of illuminated blocks indicates zero frame skipping."},
        {"question": "What camera shutter speed (e.g. 1/10s to 1/5s) is recommended when photographing the test?", "answer": "A 1/10s to 1/5s shutter speed captures multiple frame transitions in a single photo exposure, allowing clear verification of sequential block rendering."},
        {"question": "What causes a monitor panel scaler to skip frames at high refresh rates?", "answer": "Overclocking monitor refresh rate beyond internal scaler bandwidth causes timing desynchronization, forcing panel hardware to drop skipped frames."},
        {"question": "Does frame skipping cause visual stuttering during high-FPS competitive gaming?", "answer": "Yes. Dropped frames introduce motion jitter, broken frame pacing, and input lag anomalies during fast-paced competitive gameplay."},
        {"question": "How do I verify if a 144Hz, 240Hz, or 360Hz monitor is displaying every rendered frame?", "answer": "Run our frame skipping test at native refresh rate and take a camera photo. If dark gaps appear between illuminated blocks, the monitor is skipping frames."},
        {"question": "How do GPU driver settings and VSync interact with display frame skipping?", "answer": "Enabling VSync synchronizes GPU frame buffer dispatch with monitor refresh rate. If monitor hardware skips frames, stutter occurs regardless of VSync."},
        {"question": "What is the difference between GPU frame dropping and monitor panel frame skipping?", "answer": "GPU frame dropping happens when graphic cards bottleneck. Monitor frame skipping occurs inside the display scalar panel after frames are delivered."},
        {"question": "Can low-quality DisplayPort or HDMI cables cause display frame skipping?", "answer": "Yes. Insufficient display cable bandwidth causes signal transmission errors, triggering link training dropouts and skipped frame behavior."},
        {"question": "How does display firmware handle custom refresh rate resolutions created via CRU?", "answer": "Custom Resolution Utility (CRU) custom timings can exceed panel timing limits. Always test custom resolution overclocks for frame skipping."}
    ],

    "src/pages/display-tests/gamma.astro": [
        {"question": "What is optical display Gamma and why is 2.2 the universal standard for Windows & sRGB?", "answer": "Gamma defines the non-linear mathematical relationship between digital pixel values and physical panel light output. Gamma 2.2 matches human eye contrast perception under standard room lighting."},
        {"question": "How does our optical dither pattern test monitor gamma alignment without a hardware probe?", "answer": "Alternating 50% black-and-white dither lines create an exact 50% physical luminance target. Squinting or stepping back reveals whether surrounding solid gray blocks match target 2.2 gamma."},
        {"question": "What is the visual difference between Gamma 1.8 (legacy Mac), 2.2 (Standard), and 2.4 (Dark Room)?", "answer": "Gamma 1.8 delivers brighter midtones. Gamma 2.2 is the universal sRGB standard. Gamma 2.4 deepens shadow contrast for dark room movie viewing."},
        {"question": "How does incorrect display gamma ruin shadow detail (crushed blacks) or highlight contrast?", "answer": "Low gamma (<1.8) washes out dark scenes and reduces contrast. High gamma (>2.6) crushes dark grays into pure black, destroying shadow detail."},
        {"question": "How do monitor OSD gamma presets (Gamma 1, Gamma 2, Gamma 3) map to actual curves?", "answer": "OSD gamma presets vary by manufacturer. Testing each preset against our dither grid identifies which mode accurately delivers true 2.2 gamma."},
        {"question": "How does ambient room lighting dictate whether Gamma 2.2 or Gamma 2.4 should be targeted?", "answer": "Bright office environments benefit from Gamma 2.2 for midtone visibility. Dim home theater environments suit Gamma 2.4 (BT.1886) for deep shadow detail."},
        {"question": "How do graphics card control panel gamma sliders modify GPU LUT lookup tables?", "answer": "GPU gamma adjustments modify digital signal values before dispatch, adjusting midtone brightness without altering physical panel hardware response."},
        {"question": "Why do OLED displays require precise near-black gamma tuning to avoid shadow crushing?", "answer": "OLED pixels transition abruptly from pure black (0 nits) to 1% gray. Accurate near-black gamma curves prevent dark detail crush."},
        {"question": "How does Windows HDR PQ EOTF perceptual quantization curve differ from standard Gamma 2.2?", "answer": "PQ EOTF (ST 2084) is an absolute luminance curve targeted up to 10,000 nits, whereas Gamma 2.2 is a relative power-law curve scaled to display peak nits."},
        {"question": "How frequently does panel backlight degradation alter calibrated gamma curves?", "answer": "LED backlights and organic OLED subpixels shift luminance output over 6-12 months of operation, gradually altering calibrated gamma curves."}
    ],

    "src/pages/display-tests/geometry.astro": [
        {"question": "What is display geometric distortion (pincushion, barrel, anamorphic warping)?", "answer": "Geometric distortion causes straight grid lines to bow inward (pincushion) or bulge outward (barrel), skewing image proportions across display surfaces."},
        {"question": "Why do curved gaming monitors and ultra-wide displays exhibit geometric edge distortion?", "answer": "Physical panel curvature (1000R-1800R) alters viewing perspective, causing flat 2D grid patterns to visually bend near extreme left and right bezels."},
        {"question": "How do grid alignment reticles evaluate panel aspect ratio linearity and distortion?", "answer": "Precision pixel grid patterns display perfect squares and concentric circles to verify that display scalers do not warp or stretch image dimensions."},
        {"question": "What causes image warping or convergence misalignment on CRT and projector displays?", "answer": "Projector lens optics, uneven screen throw angles, and CRT magnetic deflection yoke misalignment induce optical geometric warping."},
        {"question": "How does physical bezel alignment affect multi-monitor surround setup geometry?", "answer": "Misaligned monitor arm heights or unequal panel tilt angles disrupt continuous horizon grid lines across multi-screen setups."},
        {"question": "What is aspect ratio stretching (4:3 stretched on 16:9) and how does it distort circle reticles?", "answer": "Stretching 4:3 content to fill 16:9 displays distorts perfect test circles into wide horizontal ellipses."},
        {"question": "How do display scaler settings (Aspect, Full, 1:1 Pixel Mapping) maintain geometric accuracy?", "answer": "1:1 Pixel Mapping renders input signals bit-for-bit without scaling. Aspect mode maintains correct proportions with pillarbox/letterbox bars."},
        {"question": "How do optical lens distortion corrections apply to projector throw geometry?", "answer": "Keystone correction and optical lens shift adjust digital pixel mapping to restore rectangular geometry on angled projection screens."},
        {"question": "Why do IPS and VA curved panels require structural curvature radius matching (e.g., 1000R vs 1800R)?", "answer": "Matching screen curvature radius to human viewing distance ensures equal optical focal length from eye to center and corners."},
        {"question": "How does camera lens distortion affect photos taken of grid test patterns?", "answer": "Wide-angle camera lenses introduce barrel distortion in photos. Use telephoto lenses (50mm+ equivalent) when documenting geometry tests."}
    ],

    "src/pages/display-tests/grayscale.astro": [
        {"question": "What is a 256-level grayscale step test and why is it crucial for display calibration?", "answer": "A 256-step grayscale test evaluates luminance transition smoothness from pure black (RGB 0,0,0) to pure white (RGB 255,255,255), detecting tinting and shadow crush."},
        {"question": "How do I verify near-black shadow detail (RGB 1-10) without crushing dark grays into pure black?", "answer": "Inspect RGB steps 1 through 10 in a dark room. Adjust monitor Brightness so RGB level 1 is barely visible above pure black RGB 0."},
        {"question": "How do I inspect near-white highlight detail (RGB 245-255) to prevent highlight clipping?", "answer": "Adjust monitor Contrast so RGB level 254 remains visually distinct from pure white RGB 255 without blowing out upper highlight steps."},
        {"question": "What causes unwanted color tinting (red, green, or blue color cast) across gray steps?", "answer": "Color tinting indicates unequal Red, Green, or Blue subpixel tracking across gray levels, resolved by calibrating OSD RGB gain and bias controls."},
        {"question": "How do bit-depth limits (6-bit + FRC vs native 8-bit vs 10-bit) affect gray scale smoothness?", "answer": "Native 10-bit panels render 1,024 gray steps without dithering. 6-bit/8-bit panels show step boundaries or temporal dithering noise on fine gradients."},
        {"question": "What monitor OSD settings (Brightness, Contrast, Black Equalizer) directly adjust gray steps?", "answer": "Brightness controls dark gray black floors (RGB 1-15). Contrast scales white highlight ceiling (RGB 240-255). Black Equalizer boosts near-black midtones."},
        {"question": "How does display contrast ratio impact the perceptual separation of adjacent gray steps?", "answer": "Higher static contrast ratio (e.g. OLED infinite:1 or VA 3000:1 vs IPS 1000:1) increases luminance separation between adjacent low-gray steps."},
        {"question": "What role does gamma 2.2 play in linear luminance distribution across grayscale patches?", "answer": "Gamma 2.2 governs the non-linear power curve mapping digital RGB values to physical nit output, ensuring smooth perceptual lightness progression."},
        {"question": "Why is neutral gray balance vital for professional photo retouching and video grading?", "answer": "Uncalibrated gray balance causes editors to introduce compensating color errors into photos and videos, resulting in inaccurate prints and video renders."},
        {"question": "How do OLED panel 5% and 10% low-gray patterns expose non-uniform organic subpixel wear?", "answer": "Low-gray patterns (5% and 10% luminance) expose subtle organic subpixel wear, vertical banding, and dirty screen effect (DSE) on OLED panels."}
    ],

    "src/pages/display-tests/hdr-test.astro": [
        {"question": "What is high dynamic range (HDR) display technology and how does ST 2084 PQ EOTF tone mapping work?", "answer": "HDR expands peak brightness and deep black contrast. ST 2084 Perceptual Quantization (PQ) EOTF is an absolute luminance curve targeted up to 10,000 nits."},
        {"question": "What are VESA DisplayHDR specifications (HDR 400, 600, 1000, 1400, True Black 400/500/600)?", "answer": "VESA specifications certify minimum peak nits, local dimming, wide color gamut, and black level thresholds for LCD and OLED displays."},
        {"question": "How do I test peak nit specular highlights (1%, 5%, 10% window sizes) vs 100% full-field brightness?", "answer": "Display test windows of varying sizes measure maximum burst nit output on small highlights versus sustained full-screen white luminance."},
        {"question": "What is Auto Brightness Limiter (ABL) in OLED panels and how does it affect HDR peak luminance?", "answer": "ABL dims full-screen bright scenes to prevent OLED power supply overload and thermal degradation, while allowing small 10% windows to hit peak nits."},
        {"question": "How do I enable bit-perfect 10-bit HDR output in Windows 11 and web browser settings?", "answer": "Enable 'Use HDR' in Windows Display Settings, set GPU output to 10-bit/12-bit RGB Full, and ensure browser hardware acceleration supports HDR canvas."},
        {"question": "What is HGIG (HDR Gaming Interest Group) tone mapping and why is it preferred for gaming?", "answer": "HGIG disables monitor internal double tone mapping, letting games map HDR output directly to the display's actual physical peak nit capabilities."},
        {"question": "How do local dimming zones in mini-LED displays prevent shadow detail clipping in HDR?", "answer": "Independent local dimming zones illuminate bright HDR highlights while keeping dark background zones dimmed, preserving shadow contrast."},
        {"question": "What is the difference between static metadata (HDR10) and dynamic metadata (Dolby Vision / HDR10+)?", "answer": "Static HDR10 uses single peak nit metadata for the entire title. Dynamic Dolby Vision/HDR10+ updates tone mapping parameters frame-by-frame."},
        {"question": "Why do low-end HDR 400 monitors often wash out colors when HDR is enabled in Windows?", "answer": "Entry HDR 400 displays lack local dimming and wide color gamut, stretching SDR content across bright global backlights and washing out contrast."},
        {"question": "How does W3C CSS Color Level 4 and WebGL enable HDR canvas rendering in modern browsers?", "answer": "Modern web APIs support rec2020 and p3 color spaces with high-float 16-bit canvas contexts, enabling bit-perfect HDR test pattern rendering."}
    ],

    "src/pages/display-tests/index.astro": [
        {"question": "What visual diagnostic instruments are included in our display testing hub?", "answer": "Our testing hub includes dead pixel scanners, OLED burn-in risk models, 540Hz+ VRR frame pacing engines, HDR PQ clipping tools, and touch digitizer inspectors."},
        {"question": "How do I choose between pixel inspection, color calibration, and latency benchmarks?", "answer": "Use Pixel Inspection for new monitor unboxing, Color Calibration for photo/video editing setups, and Latency/VRR Benchmarks for competitive gaming displays."},
        {"question": "Are all visual tests free, browser-native, and private without installing local software?", "answer": "Yes! All diagnostic instruments run 100% client-side in your web browser memory using HTML5 Web APIs. Zero hardware telemetry is transmitted externally."},
        {"question": "What display standards (ISO 9241-307, VESA DisplayHDR, W3C WCAG 3.0) govern our tests?", "answer": "Our calculation engines adhere directly to ISO 9241-307 pixel class limits, VESA DisplayHDR luminance specs, and W3C WCAG 3.0 APCA contrast algorithms."},
        {"question": "Can I run these display tests on high-refresh-rate gaming monitors (240Hz, 360Hz, 540Hz+)?", "answer": "Yes, our high-precision microsecond timer engines evaluate frame pacing jitter and reticle sweeps at high refresh rates up to 540Hz+."},
        {"question": "How do mobile touch diagnostics evaluate capacitive screen precision and line noise?", "answer": "Touch tests track active contact IDs, sampling rates (Hz), RMS line noise vector precision, and dead-zone touch matrices on mobile screens."},
        {"question": "What hardware data is included in our cryptographically signed SHA-256 Hardware Passport?", "answer": "Hardware Passports record screen resolution, refresh rate, color depth, frame pacing variance, and user-marked pixel defect coordinates signed via SHA-256."},
        {"question": "How do I test OLED displays for burn-in risk and 5% low-gray uniformity banding?", "answer": "Select the OLED Burn-In Risk Analyzer or Uniformity Inspector to run low-luminance near-black 5% gray patterns and calculate organic subpixel decay."},
        {"question": "Can these diagnostic tools be used on Smart TVs, tablets, and mobile devices?", "answer": "Yes, our responsive test deck supports touch gestures on iOS/Android, keyboard shortcuts on PC/Mac, and D-Pad remote navigation on Smart TVs."},
        {"question": "How often should computer displays be audited for color shifts and panel defects?", "answer": "We recommend conducting visual inspection every 1 to 3 months, or immediately after purchasing new display hardware or updating GPU drivers."}
    ],

    "src/pages/display-tests/local-dimming.astro": [
        {"question": "What is Full-Array Local Dimming (FALD) and how does mini-LED backlight dimming work?", "answer": "FALD and mini-LED displays arrange backlights into hundreds or thousands of individually controllable dimming zones to boost HDR contrast."},
        {"question": "How does dimming zone count (e.g. 384, 576, 1152, 2304 zones) impact black levels and contrast?", "answer": "Higher zone counts reduce halo sizes around bright objects, allowing deep black rendering right next to bright specular highlights."},
        {"question": "What is local dimming algorithm latency and how does it cause trailing halo artifacts?", "answer": "If backlight zone response lags behind GPU frame dispatches, glowing halos trail behind moving objects across screen zones."},
        {"question": "Why do OLED self-emissive pixels offer infinite contrast without local dimming zone limits?", "answer": "OLED pixels modulate brightness per-subpixel (over 8.2 million individual dimming points on 4K), eliminating local dimming zone halos entirely."},
        {"question": "How do I test local dimming transition smoothness using moving highlight targets?", "answer": "Use our bouncing white reticle pattern to observe how smoothly adjacent backlight zones illuminate and extinguish across panel zone boundaries."},
        {"question": "What is local dimming blooming (halo effect) and how can it be minimized in monitor settings?", "answer": "Blooming is light spilling from bright zones into dark adjacent zones. It can be reduced by lowering peak OSD brightness or adjusting local dimming presets."},
        {"question": "What monitor OSD local dimming presets (Low, Medium, High) are best for SDR vs HDR content?", "answer": "Medium/High local dimming is recommended for HDR movies and games. Low or Off is often preferred for desktop SDR web browsing to avoid text halo flickering."},
        {"question": "How does local dimming affect input lag in fast-paced competitive FPS gaming?", "answer": "Complex local dimming algorithms can add 2ms to 8ms of processing delay. High-refresh gaming monitors often feature Fast local dimming modes to minimize input lag."},
        {"question": "Why do mini-LED displays exhibit brightness variations across different window sizes?", "answer": "Mini-LED power power budgets limit 100% full-screen brightness to prevent thermal overload while driving 10% small highlight windows to maximum nits."},
        {"question": "How do IPS local dimming panels compare to VA local dimming panels in dark room viewing?", "answer": "VA panels have higher native static contrast (3000:1+), which helps absorb local dimming zone light leakage better than lower-contrast IPS panels (1000:1)."}
    ],

    "src/pages/display-tests/motion-blur.astro": [
        {"question": "What causes display motion blur on sample-and-hold LCD and OLED panels?", "answer": "Sample-and-hold displays maintain pixel state continuously for the full duration of a frame. Human eyes tracking moving objects across hold frames perceive blur on the retina."},
        {"question": "What is the difference between Response Time (GtG ms) and Motion Picture Response Time (MPRT ms)?", "answer": "Gray-to-Gray (GtG) measures how fast liquid crystals change color state. MPRT measures visual display motion persistence (how long pixels remain illuminated during a frame)."},
        {"question": "How does Pursuit Camera reticle testing evaluate display motion clarity and ghosting?", "answer": "Pursuit testing sweeps target reticles at controlled velocities (1x, 1/2x, 1/4x speed), allowing human eyes to track moving targets and evaluate motion clarity."},
        {"question": "What is monitor overdrive overshoot (inverse ghosting or trailing bright halos)?", "answer": "Overdrive applies excessive voltage to speed up pixel transitions. Overtuning causes pixels to overshoot target color values, leaving bright trailing halos behind moving objects."},
        {"question": "How do backlight strobing technologies (ULMB, DyAc, ELMB) eliminate motion blur?", "answer": "Backlight strobing pulses the monitor backlight off during pixel transitions and on only when pixels settle, shortening visual motion persistence (MPRT) to ~1ms."},
        {"question": "Why does OLED 0.1ms pixel response time still exhibit sample-and-hold motion blur at lower refresh rates?", "answer": "Even though OLED GtG pixel response is near-instantaneous (~0.1ms), 60Hz sample-and-hold frame duration (16.67ms) creates visual motion blur unless frame rates are increased to 240Hz+."},
        {"question": "How does high refresh rate (240Hz, 360Hz, 540Hz) reduce perceived motion blur?", "answer": "Higher refresh rates shorten individual frame hold times (1000ms / 540Hz = 1.85ms), dramatically improving tracking motion clarity on human retinas."},
        {"question": "What is the relationship between frame rate (FPS), refresh rate (Hz), and motion persistence?", "answer": "Perceived motion blur is determined by frame duration (1/FPS). Matching high FPS to high Hz ensures smooth motion without judder or sample-and-hold blur."},
        {"question": "How do I optimize monitor OSD overdrive settings to balance motion clarity and overshoot?", "answer": "Select the middle OSD overdrive setting (e.g. Fast instead of Fastest) to eliminate motion trailing without introducing bright inverse ghosting halos."},
        {"question": "Can motion blur reduction (MBR) technologies cause backlight flickering and eye fatigue?", "answer": "Yes, backlight strobing pulses LEDs at screen refresh rates (120Hz-240Hz), which can cause visual eye fatigue for users sensitive to PWM flickering."}
    ],

    "src/pages/display-tests/oled-burn-in.astro": [
        {"question": "What is OLED burn-in (permanent image retention) and how does organic subpixel degradation occur?", "answer": "OLED burn-in is cumulative, uneven degradation of organic light-emitting subpixels caused by displaying static high-brightness UI elements over extended hours."},
        {"question": "What static UI elements (taskbars, HUDs, logos) pose the highest risk of OLED burn-in?", "answer": "Bright white Windows taskbars, fixed browser address bars, news channel tickers, and static gaming HUD elements present the highest risk of OLED subpixel wear."},
        {"question": "What is the difference between temporary image retention and permanent OLED burn-in?", "answer": "Temporary image retention clears within minutes after changing screen content. Permanent burn-in is irreversible organic subpixel efficiency loss."},
        {"question": "How do panel maintenance features (Pixel Refresh, Panel Refresh, Screen Shift, ABL) mitigate burn-in?", "answer": "Pixel Refresh runs automated voltage calibration cycles to equalize subpixel luminance. Screen shift moves static pixels periodically to distribute wear."},
        {"question": "How do QD-OLED (Quantum Dot OLED) panels compare to LG WOLED panels in burn-in resistance?", "answer": "Gen-2 and Gen-3 QD-OLED and WOLED panels incorporate advanced heat sinks, real-time thermal compensation, and subpixel geometry refinements that significantly boost burn-in resilience."},
        {"question": "How does our mathematical burn-in risk model compute subpixel degradation based on brightness and hours?", "answer": "Our model calculates cumulative subpixel degradation using exponential decay equations factorizing operating nit luminance, static UI duty cycle hours, and color spectrum wear."},
        {"question": "Can lowering monitor operating brightness (e.g., 120-150 nits) significantly extend OLED panel lifespan?", "answer": "Yes! Operating OLED monitors at moderate SDR brightness (120-150 nits) dramatically reduces thermal stress and subpixel decay rates compared to 100% max nits."},
        {"question": "Does manufacturer warranty coverage include OLED static burn-in damage?", "answer": "Many major monitor manufacturers (Dell Alienware, ASUS, LG, MSI) now provide 3-year warranties that explicitly cover OLED burn-in damage under normal consumer use."},
        {"question": "What desktop habits (hiding taskbars, dark themes, short sleep timers) prevent OLED burn-in?", "answer": "Auto-hiding Windows taskbar, using system dark mode, enabling black desktop wallpapers, and setting screen sleep timers to 3-5 minutes effectively prevent static burn-in."},
        {"question": "How do I inspect an OLED display for subtle burn-in ghosts using 5% and 10% dark gray test patterns?", "answer": "Display 5% and 10% low-gray test slides in a dark room. Inspect for faint residual outlines of taskbars or static logos against the uniform gray background."}
    ],

    "src/pages/display-tests/pixel-walk.astro": [
        {"question": "What is LCD pixel walk (inversion artifact) and why does it cause flickering or fine grid lines?", "answer": "LCD pixel walk occurs when panel voltage inversion polarities desynchronize, causing high-frequency pixel micro-flickering or visible mesh patterns on specific dither grids."},
        {"question": "Why do LCD active matrix panels alternate voltage polarity (pixel inversion) on every frame?", "answer": "Liquid crystals degrade if subjected to constant direct current (DC) voltage. Alternating AC voltage polarity on every frame prevents liquid crystal polarization damage."},
        {"question": "How do line inversion and dot inversion patterns expose uncalibrated panel Vcom voltage?", "answer": "Line and dot inversion test patterns stress specific subpixel polarity pairs. Incorrect common electrode voltage (Vcom) causes visible flicker on matching inversion patterns."},
        {"question": "What causes visible horizontal lines or moving mesh artifacts during high-speed motion?", "answer": "Uncalibrated pixel walk inversion causes liquid crystals to respond unevenly during rapid frame transitions, creating fine horizontal line noise or mesh patterns."},
        {"question": "How does G-Sync / FreeSync variable refresh rate (VRR) interact with LCD pixel walk flicker?", "answer": "Dynamically changing refresh rates under VRR alters voltage inversion timing intervals, which can exacerbate pixel walk flicker if Vcom is not tuned for VRR ranges."},
        {"question": "Why are certain gaming monitor panels more prone to pixel walk artifacts at maximum refresh rate?", "answer": "Driving LCD scalers to extreme refresh rates (240Hz-540Hz) tightens voltage switching timing margins, making subpixel inversion artifacts more noticeable."},
        {"question": "Can display panel firmware or OSD voltage calibration fix pixel walk inversion artifacts?", "answer": "Factory Vcom potentiometer tuning fixes hardware pixel walk. Some monitors provide internal OSD bias tweaks via service menus."},
        {"question": "How do I photograph or record high-speed video of pixel walk inversion patterns?", "answer": "Record 240 FPS high-speed video or take macro photos of inversion patterns. Interlaced horizontal dark lines confirm subpixel walk desynchronization."},
        {"question": "What is the difference between PWM backlight flicker and LCD panel pixel walk flicker?", "answer": "PWM flicker comes from backlight LED pulsing. Pixel walk flicker originates inside the active liquid crystal layer due to voltage inversion imbalance."},
        {"question": "Does OLED technology suffer from LCD pixel walk inversion artifacts?", "answer": "No. OLED subpixels are self-emissive diodes driven by current rather than liquid crystal polarization, eliminating LCD pixel walk inversion completely."}
    ],

    "src/pages/display-tests/ppi-calculator.astro": [
        {"question": "How is Pixels Per Inch (PPI) mathematically calculated from resolution and screen size?", "answer": "PPI is calculated with the formula: PPI = √(Horizontal Pixels² + Vertical Pixels²) ÷ Diagonal Screen Inches."},
        {"question": "What is the PPI formula: √(Width² + Height²) ÷ Diagonal Screen Inches?", "answer": "Using resolution width W and height H, calculate total diagonal pixels using Pythagorean theorem √(W² + H²), then divide by physical diagonal size in inches."},
        {"question": "What PPI density is required for true Retina visual sharpness at normal viewing distance?", "answer": "At standard desktop viewing distance (~24-30 inches), a display density of ~110-163+ PPI satisfies human visual acuity (1 arcminute), eliminating visible pixel grid structure."},
        {"question": "How does viewing distance alter human arcminute acuity requirements (1/60th degree)?", "answer": "Human eye resolution limit is approximately 1 arcminute (1/60th of a degree). Holding a smartphone at 12 inches requires ~300+ PPI, whereas a TV viewed at 9 feet requires only ~60 PPI."},
        {"question": "What is the visual difference between 1080p 24-inch (92 PPI), 1440p 27-inch (109 PPI), and 4K 27-inch (163 PPI)?", "answer": "1080p at 24\" shows visible pixel structure. 1440p at 27\" is the sweet spot for desktop clarity. 4K at 27\" renders razor-sharp text and graphics with invisible pixels."},
        {"question": "How does OS display scaling (125%, 150%, 200%) interact with physical panel PPI?", "answer": "OS scaling increases UI element pixel dimensions while preserving high physical PPI sharpness, delivering larger readable text without pixelation."},
        {"question": "Why do high-PPI displays reduce subpixel text anti-aliasing artifacts and ClearType fringing?", "answer": "Because individual subpixels are so tiny that color fringing along text edges falls below human visual perception thresholds."},
        {"question": "How does dot pitch (pixel pitch in mm) relate directly to PPI display density?", "answer": "Dot pitch measures physical distance between adjacent pixel centers in millimeters. Dot Pitch (mm) = 25.4 ÷ PPI."},
        {"question": "What PPI is optimal for desktop monitor productivity vs smartphone displays?", "answer": "109-163 PPI is optimal for desktop computer monitors. Smartphones require 400-500+ PPI due to much closer viewing distances (8-12 inches)."},
        {"question": "Does higher PPI increase GPU rendering load in 3D gaming applications?", "answer": "Higher PPI displays require driving more total pixels (e.g. 4K has 8.3M pixels vs 1080p 2.1M pixels), significantly increasing GPU 3D rendering workload."}
    ],

    "src/pages/display-tests/pwm-flicker.astro": [
        {"question": "What is Pulse Width Modulation (PWM) screen flickering and why does it cause eye strain?", "answer": "PWM dims screen backlights by rapidly pulsing LEDs on and off. Low-frequency PWM creates invisible stroboscopic flickering that causes eye fatigue, headaches, and migraines."},
        {"question": "What is the difference between low-frequency PWM (<250Hz) and high-frequency PWM (>2000Hz)?", "answer": "Low-frequency PWM (<250Hz) causes strong visual stroboscopic artifacts and eye strain. High-frequency PWM (>2000Hz) pulses faster than human visual sensitivity thresholds."},
        {"question": "What is DC Dimming (Flicker-Free display technology) and how does it adjust brightness?", "answer": "DC Dimming regulates screen brightness by continuously controlling electrical current (voltage/amperage) rather than switching LEDs on and off."},
        {"question": "How can I test my monitor or smartphone for PWM flicker using a high-speed camera?", "answer": "Record your screen at 20% brightness using a 240 FPS smartphone camera or fast shutter speed (1/1000s). Rolling dark bars indicate PWM backlight flickering."},
        {"question": "Why does PWM flickering become more visible at lower screen brightness levels?", "answer": "Lowering brightness shortens the LED 'on' pulse duration while lengthening the 'off' duration, making stroboscopic backlight pulses more severe."},
        {"question": "What physiological symptoms are linked to screen PWM flickering (headaches, eye fatigue)?", "answer": "PWM flicker induces rapid unperceived iris pupil constrictions, leading to eyestrain, dry eyes, tension headaches, and visual migraines."},
        {"question": "How does temporal dithering (FRC) create high-frequency micro-flicker on 8-bit panels?", "answer": "8-bit + FRC panels flicker subpixel luminance between adjacent color shades on alternate frames to simulate 10-bit color, creating subtle high-frequency dithering micro-flicker."},
        {"question": "What display certifications (IEEE 1789, TÜV Rheinland Flicker-Free) validate safe backlight dimming?", "answer": "TÜV Rheinland Flicker-Free certification verifies zero PWM flickering across all brightness levels, adhering to IEEE 1789 low-risk dimming standards."},
        {"question": "Does OLED screen PWM flickering differ from LCD LED backlight PWM flickering?", "answer": "OLED panels flicker at screen refresh rate harmonics (e.g., 120Hz/240Hz) due to panel scanlines, whereas LCD PWM frequency depends on backlight inverter circuits."},
        {"question": "How do I reduce eye strain on monitors that utilize low-frequency PWM backlights?", "answer": "Keep monitor OSD brightness at 100% (where PWM is disabled) and use software dimming apps or ambient bias lighting to comfortable room light levels."}
    ],

    "src/pages/display-tests/refresh-rate-test/[targetHz].astro": [
        {"question": "How does the target Hz refresh rate test measure hardware frame pacing?", "answer": "Our engine uses microsecond performance.now() timestamps combined with requestAnimationFrame callbacks to benchmark actual display refresh rates against target Hz thresholds."},
        {"question": "Why is my 144Hz, 240Hz, 360Hz, or 540Hz gaming monitor running at a lower target Hz?", "answer": "Check OS display adapter settings, ensure your DisplayPort 1.4/2.1 or HDMI 2.1 cable supports full bandwidth, and verify high refresh rate is selected in GPU control panel."},
        {"question": "What is inter-frame pacing jitter and how is frame variance measured?", "answer": "Frame pacing jitter measures standard deviation (σ ms) in frame presentation delivery. Lower jitter guarantees smoother motion without micro-stutter."},
        {"question": "How do mobile dynamic refresh rate screens (Apple ProMotion / Android LTPO) behave under target Hz tests?", "answer": "Dynamic LTPO screens drop to 10Hz-30Hz when static and boost instantly to 120Hz upon touch interaction, which our real-time inspector measures dynamically."},
        {"question": "Does VSync, G-Sync, or FreeSync affect target Hz test measurements?", "answer": "Enabling G-Sync/FreeSync syncs display refresh rate to GPU dispatch rate. Disabling VSync during testing isolates raw browser compositor rendering performance."},
        {"question": "Why do background browser tabs throttle target Hz performance?", "answer": "Web browsers automatically throttle requestAnimationFrame callbacks to 1Hz-10Hz in background tabs to save system CPU/GPU power."},
        {"question": "How does higher target Hz reduce click-to-photon input latency?", "answer": "Higher refresh rates decrease frame delivery delay (1000ms / 240Hz = 4.16ms vs 1000ms / 60Hz = 16.67ms), giving competitive gamers a significant reaction time advantage."},
        {"question": "What browser flags optimize high-refresh rate testing in Chrome or Firefox?", "answer": "Ensure hardware acceleration is enabled and check that flag 'Override software rendering list' is set to active in Chrome."},
        {"question": "How does pursuit reticle motion clarity scale at target refresh rates?", "answer": "Higher target refresh rates shorten sample-and-hold frame hold duration, sharpening pursuit camera reticles and reducing motion blur."},
        {"question": "Can low-quality video cables or adapters limit maximum target Hz?", "answer": "Yes, older HDMI 1.4 or DisplayPort 1.2 cables lack required video bandwidth for 4K 144Hz or 1080p 360Hz+, forcing display fallbacks to 60Hz."}
    ],

    "src/pages/display-tests/return-window-checker/[slug].astro": [
        {"question": "What display defects justify returning a monitor within the retailer 30-day return window?", "answer": "Dead pixels, stuck subpixels, severe backlight bleed, OLED 5% gray vertical banding, frame skipping, and excessive IPS glow justify retailer returns."},
        {"question": "How do major retailer return policies (Amazon, Best Buy, Micro Center, B&H) handle screen returns?", "answer": "Most major retailers allow hassle-free returns within 15 to 30 days for opened monitors if returned in original condition with all accessories."},
        {"question": "How many dead or stuck pixels are required for an official manufacturer warranty replacement (RMA)?", "answer": "Manufacturer warranty policies typically require 3-5 dead pixel clusters or 1-2 bright stuck pixels under ISO 9241-307 Class II warranty terms."},
        {"question": "How do I generate a cryptographically signed SHA-256 Hardware Passport receipt as evidence for returns?", "answer": "Click 'SIGN SHA-256 PASSPORT' in our diagnostic header deck to record active telemetry, defect pin logs, and SHA-256 signatures for RMA verification."},
        {"question": "What is the difference between retailer return windows and manufacturer limited warranty policies?", "answer": "Retailer return windows (15-30 days) offer full refunds or exchanges. Manufacturer warranties (1-3 years) cover hardware repair or RMA replacement."},
        {"question": "Should I test a newly purchased monitor immediately for backlight bleed, dead pixels, and OLED banding?", "answer": "Yes! Running visual diagnostics on day one ensures any hardware flaws are detected well within the zero-friction retailer return window."},
        {"question": "What original packaging and accessories must be retained for hassle-free retailer returns?", "answer": "Retain original monitor box, styrofoam inserts, power brick, HDMI/DisplayPort cables, stand, and factory inspection documents."},
        {"question": "How do restocking fees apply to opened monitor returns at various hardware retailers?", "answer": "Some specialty camera/electronics retailers charge 15% restocking fees on non-defective returns, though fees are waived if hardware is defective."},
        {"question": "Can severe IPS glow or VA backlight bleed be claimed as a hardware defect under warranty?", "answer": "If backlight bleed or IPS glow is severe enough to obscure dark scenes under normal 120 nit room operation, it qualifies as a defective panel claim."},
        {"question": "How do crowdsourced per-model hardware defect rates assist consumers in return decisions?", "answer": "Crowdsourced defect statistics provide baseline comparison metrics, helping buyers decide whether exchanging a monitor will yield a better panel lottery outcome."}
    ],

    "src/pages/display-tests/rgb-channel-test.astro": [
        {"question": "What is an RGB channel isolation test and how does it evaluate display subpixel color purity?", "answer": "RGB channel testing illuminates pure Red (#FF0000), Green (#00FF00), and Blue (#0000FF) solid screens to isolate individual subpixel performance."},
        {"question": "How do I test individual Red, Green, and Blue subpixel channels for dead or stuck subpixels?", "answer": "Cycle solid Red, Green, and Blue backgrounds in fullscreen mode. Unlit spots on a Red screen pinpoint dead Red subpixels; bright blue spots on Black reveal stuck Blue subpixels."},
        {"question": "What is RGB channel crosstalk or color bleeding in display panels?", "answer": "RGB crosstalk occurs when electrical voltage bleeds into adjacent subpixel channels, causing color contamination along high-contrast edges."},
        {"question": "How do OSD Red, Green, and Blue gain controls adjust display color balance?", "answer": "Adjusting individual OSD RGB gain sliders controls the physical amplification of Red, Green, and Blue subpixels to tune white balance to D65 (6500K)."},
        {"question": "How do QD-OLED subpixel layouts (Triangular RGB) differ from standard LCD RGB Stripe subpixels?", "answer": "LCDs use parallel vertical RGB stripes. Gen-1/Gen-2 QD-OLED uses a triangular subpixel layout, which can cause slight green/magenta edge fringing on high-contrast text."},
        {"question": "Why does inspecting pure Red, Green, and Blue screens reveal subpixel transistor defects?", "answer": "Because each solid color pattern activates only one specific subpixel transistor per pixel, isolating individual gate failures."},
        {"question": "How does GPU color depth (8-bit vs 10-bit) map integer values across RGB channels?", "answer": "8-bit maps 256 discrete levels per channel (0-255). 10-bit maps 1,024 levels per channel (0-1023), dramatically improving channel accuracy."},
        {"question": "What causes chromatic aberration or color fringing along high-contrast text edges?", "answer": "Subpixel font antialiasing (like Windows ClearType) assumes standard RGB stripe layout. Non-standard layouts cause visible red/blue chromatic edge halos."},
        {"question": "How do camera sensors capture RGB subpixel patterns during macro photography?", "answer": "Smartphone macro lenses or microscope probes capture raw Bayer pattern subpixel layouts, revealing physical QD-OLED or WOLED subpixel geometry."},
        {"question": "Why is bit-perfect RGB channel rendering essential for digital color calibration?", "answer": "Uncompressed bit-perfect RGB channel rendering prevents GPU color scaling distortions, ensuring accurate baseline measurements."}
    ],

    "src/pages/display-tests/screen-test.astro": [
        {"question": "What is an online monitor screen test?", "answer": "An online screen test is a free, web-native diagnostic instrument evaluating monitors, laptops, smartphones, and Smart TVs for dead pixels, OLED banding, and color accuracy."},
        {"question": "How do I test my screen for dead and stuck pixels?", "answer": "Enter fullscreen mode on our Universal Screen Test deck and cycle through solid primary backgrounds (White, Black, Red, Green, Blue) to spot unlit or stuck subpixels."},
        {"question": "What is the difference between 5% and 10% OLED dark gray banding tests?", "answer": "The 5% and 10% dark gray tests use low-luminance gray patterns (IEC 62341-6-2 standard) to expose unequal organic subpixel wear and dark-gray vertical banding on OLED panels."},
        {"question": "How do I run a screen test on a Smart TV using a remote or gamepad?", "answer": "Open displaytestonline.com on your Smart TV browser. Use D-Pad Left/Right on your TV remote or game controller to cycle test patterns, and Press A/Cross for Fullscreen."},
        {"question": "Why does the Screen Wake Lock API matter during visual inspection?", "answer": "The Screen Wake Lock API prevents screens from dimming or turning off during visual inspection of subpixel defects or backlight bleed."},
        {"question": "How does color temperature (Kelvin) affect screen fill lighting and testing?", "answer": "Color temperature sliders (2700K to 6500K) adjust panel white balance and transform your screen into a high-CRI soft light panel for video calls."},
        {"question": "How does the hands-free auto-cycle slideshow scanner work?", "answer": "Click 'AUTO SLIDESHOW' on the test deck. The engine automatically cycles through diagnostic patterns at 3-second intervals for automated display scanning."},
        {"question": "What are subpixel geometry reticles for QD-OLED and WOLED panels?", "answer": "Subpixel reticles render high-contrast text and micro-lines to inspect subpixel structures (RGB Stripe, QD-OLED Triangular, WOLED RWBG) for ClearType fringing."},
        {"question": "How do touch gesture controls work on mobile smartphones and tablets?", "answer": "Swipe left/right to cycle test patterns, swipe up/down to adjust brightness, single tap to toggle UI overlays, and double tap to toggle fullscreen."},
        {"question": "How do I generate a SHA-256 Hardware Passport receipt for warranty claims?", "answer": "Click 'SIGN SHA-256 PASSPORT' to record active telemetry, defect pin logs, and SHA-256 signatures for eBay/Reddit listings or retailer RMA claims."}
    ],

    "src/pages/display-tests/stuck-pixel.astro": [
        {"question": "What is a stuck pixel and how does it differ from a dead pixel?", "answer": "A stuck pixel has a malfunctioning subpixel transistor gate that remains continuously powered on, displaying a fixed bright red, green, or blue spot."},
        {"question": "Why does a stuck pixel display a constant fixed color (Red, Green, Blue, Cyan, Magenta, Yellow)?", "answer": "Because one or two subpixel transistors remain stuck open, allowing backlight light to pass through specific subpixel color filters constantly."},
        {"question": "Can stuck pixels be fixed using rapid RGB flashing utility tools?", "answer": "Yes! Rapidly flashing high-contrast primary color patterns forces subpixel liquid crystals to cycle rapidly, which can unstick trapped subpixel gates."},
        {"question": "How does physical subpixel transistor gate failure cause a subpixel to remain permanently open?", "answer": "Transistor gate short circuits maintain constant charge across liquid crystal cells, locking subpixels in an open transparent state."},
        {"question": "How long should I run a stuck pixel repair screen flash utility before evaluating results?", "answer": "Run our rapid RGB flashing utility for 10 to 30 minutes. If the subpixel remains stuck after 2 hours, hardware replacement is necessary."},
        {"question": "Is screen massage or gentle pressure recommended for unsticking subpixel gates?", "answer": "Applying gentle pressure around a stuck pixel with a soft cloth while cycling power can unstick liquid crystals, but excessive force risks panel damage."},
        {"question": "What ISO 9241-307 Class limits govern retailer returns for stuck subpixels?", "answer": "ISO 9241-307 Class I allows zero stuck pixels. Class II permits up to 2 permanently bright stuck pixels per million pixels before RMA replacement is required."},
        {"question": "Why do stuck pixels appear bright against dark backgrounds but disappear on matching color backgrounds?", "answer": "A stuck red subpixel glows brightly against a dark black background, but blends invisibly when displaying a solid pure red screen."},
        {"question": "Can temperature changes or panel warm-up resolve stuck subpixels automatically?", "answer": "Yes, thermal expansion during panel warm-up can occasionally unstick liquid crystal alignment naturally."},
        {"question": "What is the success rate of web-based rapid flashing utilities in repairing stuck subpixels?", "answer": "Web-based rapid flashing utilities successfully unstick approximately 30% to 50% of recently stuck subpixels caused by liquid crystal lock-up."}
    ],

    "src/pages/display-tests/sub-pixel.astro": [
        {"question": "What are subpixels and how do Red, Green, and Blue subpixels combine to form full-color pixels?", "answer": "Each display pixel consists of three individual Red, Green, and Blue subpixels. Modulating subpixel luminance intensity creates millions of distinct colors."},
        {"question": "What are the common subpixel geometry layouts: RGB Stripe, BGR Inverted, QD-OLED Triangular, WOLED RWBG?", "answer": "Standard LCDs use vertical RGB stripes. Some displays use inverted BGR. Gen-1/Gen-2 QD-OLED uses triangular RGB. LG WOLED adds a white subpixel (RWBG)."},
        {"question": "Why does Windows ClearType font antialiasing cause color fringing on BGR or QD-OLED panels?", "answer": "ClearType assumes standard RGB stripe layout. On BGR or QD-OLED panels, ClearType subpixel rendering applies color smoothing to incorrect physical subpixels, causing text color halos."},
        {"question": "How does FreeType on Linux and macOS font rendering handle non-standard subpixel layouts?", "answer": "macOS uses grayscale anti-aliasing independent of subpixel layout. Linux FreeType allows configuring custom subpixel rendering filters (RGB, BGR, VRGB, VBGR)."},
        {"question": "How can I inspect subpixel structure using WebGL reticles or a smartphone macro camera lens?", "answer": "Our WebGL subpixel inspector renders single-pixel lines. Viewing with a smartphone macro lens exposes exact physical subpixel geometry."},
        {"question": "What is the subpixel layout of LG WOLED panels (Red, White, Blue, Green)?", "answer": "LG WOLED adds an uncolored White subpixel to boost HDR peak brightness, using an RWBG subpixel array."},
        {"question": "How does subpixel spacing (black matrix gap) affect screen screen-door effect (SDE)?", "answer": "Black matrix gaps between subpixels create faint grid lines (Screen-Door Effect) at low PPI or very close viewing distances."},
        {"question": "Why do subpixel defects appear as tiny colored specks under close inspection?", "answer": "Because single subpixel defects affect only one-third of a full pixel, appearing as tiny red, green, or blue pinpricks."},
        {"question": "How do subpixel rendering algorithms increase effective text resolution on computer monitors?", "answer": "Subpixel rendering addresses individual RGB subpixel channels, effectively tripling horizontal resolution for fine text rendering."},
        {"question": "Can monitor firmware update subpixel font rendering parameters automatically?", "answer": "Monitor firmware cannot change physical subpixel layout, but OS font settings (Windows ClearType Tuner) adapt software rendering to panel layout."}
    ],

    "src/pages/display-tests/text-sharpness.astro": [
        {"question": "What causes text blurriness or color fringing on computer monitors?", "answer": "Text blurriness is caused by non-native resolution scaling, incorrect OSD sharpness settings, or subpixel rendering mismatches (BGR or QD-OLED layouts)."},
        {"question": "How does subpixel layout (RGB vs BGR vs QD-OLED) affect ClearType text anti-aliasing?", "answer": "Windows ClearType assumes RGB stripe layout. BGR or triangular QD-OLED layouts cause ClearType to place color anti-aliasing edges on incorrect subpixels."},
        {"question": "What monitor OSD settings (Sharpness, Vivid Pixel, Super Resolution) introduce unnatural text halos?", "answer": "Overtuned OSD sharpness processors apply high-pass edge filters, adding ugly white halos and ringing artifacts around text fonts."},
        {"question": "How does display PPI density (e.g. 109 PPI vs 163 PPI) impact font legibility?", "answer": "Higher PPI (4K at 27\") renders smooth vector curves with invisible subpixels, eliminating text jaggedness even without subpixel anti-aliasing."},
        {"question": "How do I configure Windows ClearType Tuner to match my display's subpixel layout?", "answer": "Run 'cttune.exe' in Windows. Select text samples that appear sharpest to align ClearType subpixel rendering with your monitor's panel layout."},
        {"question": "Why does 4K resolution at 150% scaling deliver sharper text than native 1080p?", "answer": "4K at 150% scaling renders fonts using 2.25× more physical pixels than 1080p, producing crisp vector typography outlines."},
        {"question": "How do matte anti-glare screen coatings affect perceived font clarity and graininess?", "answer": "Heavy matte anti-glare coatings diffuse subpixel light, creating subtle surface graininess (sparkle effect) on solid white text backgrounds."},
        {"question": "What is the difference between vector font rendering (TrueType/OpenType) and rasterized text?", "answer": "Vector fonts scale infinitely via mathematical curves. Rasterized fonts map to fixed pixel grids, requiring anti-aliasing at low sizes."},
        {"question": "How does video cable interface (HDMI vs DisplayPort) and chroma subsampling (4:4:4 vs 4:2:2) alter text sharpness?", "answer": "Chroma subsampling (4:2:2 or 4:2:0) compresses color resolution, causing red/blue text on dark backgrounds to blur severely. Always use RGB / 4:4:4 Full."},
        {"question": "What font size and weight combinations meet APCA Lc 75+ accessibility guidelines for comfortable reading?", "answer": "16px regular body text or 14px bold text meeting APCA Lc 75+ contrast ensures optimal visual legibility across display environments."}
    ],

    "src/pages/display-tests/tv-viewing-distance.astro": [
        {"question": "What is the ideal TV viewing distance based on screen size (55\", 65\", 75\", 85\", 98\")?", "answer": "Ideal 4K TV viewing distance is ~5.5 ft for 55\", ~6.5 ft for 65\", ~7.5 ft for 75\", ~8.5 ft for 85\", and ~9.8 ft for 98\" displays."},
        {"question": "What are the SMPTE (30°/40° FOV) and THX (36° FOV) recommended viewing angle standards?", "answer": "SMPTE recommends a minimum 30° Field of View (FOV) for casual viewing and 40° for cinema. THX recommends 36° FOV for immersive movie theater experience."},
        {"question": "How does 4K Ultra HD resolution allow sitting closer to larger screens without seeing pixels?", "answer": "4K resolution quadruples 1080p pixel count, pushing individual pixel structure below human visual acuity limits at closer distances."},
        {"question": "What is human visual acuity (1 arcminute) and how does it determine 4K vs 1080p benefits?", "answer": "Human visual acuity limit is 1 arcminute (1/60th degree). Sitting beyond 9 feet from a 55\" screen renders 4K and 1080p visually indistinguishable."},
        {"question": "What is the formula for calculating THX viewing distance: Diagonal Screen Inches ÷ 0.835?", "answer": "THX recommended viewing distance (in inches) = Screen Diagonal Inches ÷ 0.835. Divide result by 12 to obtain viewing distance in feet."},
        {"question": "How does room seating layout and mounting height affect vertical viewing angle and neck ergonomics?", "answer": "TV center should sit at eye level when seated (center ~40-44 inches from floor). Mounting TVs too high ('TVTooHigh') causes neck strain and off-axis contrast loss."},
        {"question": "Why do OLED and IPS TVs maintain contrast and color accuracy at wide off-axis viewing angles?", "answer": "OLED and IPS panels maintain wide 178° viewing angles without gamma washouts, ensuring all room seats enjoy equal color quality."},
        {"question": "What throw distance and screen size calculations apply to home theater projectors?", "answer": "Projector throw distance = Throw Ratio × Screen Width. A 1.2:1 throw projector placed 10 ft away projects a 100-inch diagonal screen."},
        {"question": "How does screen aspect ratio (16:9 vs 21:9 ultrawide) impact field of view immersion?", "answer": "21:9 ultrawide screens expand horizontal field of view without increasing vertical height, delivering immersive cinematic experiences."},
        {"question": "What distance is recommended for desktop computer monitors (24\", 27\", 32\", 42\")?", "answer": "Recommended desktop monitor viewing distance is 1.5 to 2.5 ft (~18-30 inches), aligning screen top with eye level for optimal ergonomics."}
    ],

    "src/pages/display-tests/uniformity.astro": [
        {"question": "What is display screen uniformity and how is luminance variance measured across panel grid zones?", "answer": "Screen uniformity measures luminance and color temperature consistency across a 3x3 or 5x5 grid of panel measurement points."},
        {"question": "What is IEC 62341-6-2 low-gray uniformity testing for OLED and LCD panels?", "answer": "IEC 62341-6-2 standard evaluates 5% and 10% near-black gray patterns to uncover dark-gray vertical banding and dirty screen effect (DSE)."},
        {"question": "What causes Dirty Screen Effect (DSE), vignetting, and dark corner shadowing on monitors and TVs?", "answer": "DSE and vignetting stem from unequal backlight diffuser distribution, LCD layer thickness variations, or organic OLED subpixel manufacturing variance."},
        {"question": "What is the difference between luminance uniformity (%) and color temperature (Kelvin) uniformity?", "answer": "Luminance uniformity measures brightness variance in nits. Color temperature uniformity measures Kelvin white point tint shifts across screen regions."},
        {"question": "How do IPS glow and VA viewing angle falloff degrade off-center uniformity?", "answer": "IPS glow lightens dark corners when viewed off-center, while VA viewing angle falloff reduces contrast away from central perpendicular axes."},
        {"question": "Does OLED panel uniformity improve after running automated Pixel Refresh / Panel Refresh cycles?", "answer": "Yes! OLED automated pixel compensation cycles measure subpixel resistance and equalize luminance across the panel, improving 5% low-gray uniformity."},
        {"question": "What percentage of luminance variance is considered acceptable for professional photo/video editing?", "answer": "Professional proofing displays require luminance variance under 5-10%. Consumer displays typically exhibit 10-20% luminance drop-off near bezels."},
        {"question": "How do display manufacturers use Uniformity Compensation (UC) algorithms in OSD firmware?", "answer": "Uniformity Compensation algorithms digitally dim brighter panel zones to match dimmer areas, creating flat uniform luminance across the screen."},
        {"question": "Why is 5% and 10% dark gray uniformity critical for dark room movie watching and gaming?", "answer": "Near-black low-gray uniformity determines whether dark movie scenes and horror game environments render clean shadows without distracting vertical streaks."},
        {"question": "How does backlight aging affect overall screen uniformity over years of operation?", "answer": "CCFL and LED backlights age unevenly across panel edges, increasing center-to-edge luminance variance over 3 to 5 years of use."}
    ],

    "src/pages/display-tests/viewing-angle.astro": [
        {"question": "How are display viewing angles measured (e.g. 178°/178° IPS standard)?", "answer": "Viewing angle rating specifies the maximum off-axis angle where contrast ratio remains above 10:1 (or 5:1)."},
        {"question": "What is the difference between IPS, VA, and OLED off-axis color and contrast performance?", "answer": "IPS maintains wide 178° color accuracy with minor glow. VA exhibits contrast loss and gamma shift off-axis. OLED offers near-flawless 178° viewing angles with zero contrast loss."},
        {"question": "Why do VA panels exhibit gamma shift (black crush in center, washed out colors on sides)?", "answer": "VA liquid crystals align vertically. Perpendicular viewing crushes shadow details, while off-axis viewing lightens dark grays and washes out colors."},
        {"question": "What is IPS glow and why does it appear as a bright sheen on dark screens when viewed off-angle?", "answer": "IPS glow occurs because unpolarized backlight light bleeds through IPS liquid crystal layers at oblique off-axis viewing angles."},
        {"question": "Why do OLED self-emissive subpixels offer near-perfect 178° viewing angles without contrast loss?", "answer": "OLED subpixels emit light directly from the surface without backlight polarizers or liquid crystal shutter layers, eliminating off-axis contrast falloff."},
        {"question": "How does screen curvature (e.g. 1000R, 1500R, 1800R) improve viewing angle uniformity on large panels?", "answer": "Curvature wraps panel edges inward so off-center screen regions face the viewer at perpendicular angles, mitigating VA gamma shift and IPS glow."},
        {"question": "What role does anti-reflective (AR) and anti-glare (AG) coating play in off-axis glare?", "answer": "Anti-reflective coatings absorb ambient room reflections, preserving off-axis black levels and color saturation under bright lighting."},
        {"question": "How does color shift (ΔE variation off-axis) impact multi-user viewing on workstation monitors?", "answer": "Off-axis color shift causes collaborators sitting beside the primary user to perceive shifted colors, making wide-angle IPS/OLED mandatory for team reviews."},
        {"question": "Why do laptop screens often use TN or low-cost IPS panels with narrow viewing angles?", "answer": "Budget laptops use low-cost panels that sacrifice viewing angles to save manufacturing cost and power draw."},
        {"question": "How do optical polarizer filters control light output directionality in LCD panels?", "answer": "Polarizing films align light waves in specific orientations, controlling how liquid crystals modulate light output relative to viewer angle."}
    ],

    "src/pages/display-tests/vrr.astro": [
        {"question": "What is Variable Refresh Rate (VRR) and how do NVIDIA G-Sync, AMD FreeSync, and VESA Adaptive-Sync work?", "answer": "VRR synchronizes display refresh rate dynamically to GPU frame dispatch rate, eliminating screen tearing and stutter."},
        {"question": "How does VRR eliminate screen tearing without introducing the input lag of traditional VSync?", "answer": "Traditional VSync forces the GPU to wait for fixed monitor refresh intervals, creating delay. VRR instructs the monitor to refresh immediately when a frame is ready."},
        {"question": "What is the VRR refresh rate range (e.g., 48Hz–240Hz) and Low Framerate Compensation (LFC)?", "answer": "VRR operates within a specified Hz range. When FPS drops below minimum VRR range, LFC duplicates frames (e.g. 35 FPS displayed at 70Hz) to maintain tear-free sync."},
        {"question": "What causes VRR brightness flickering (gamma flicker) on OLED panels during frame rate fluctuations?", "answer": "OLED subpixel gamma curves are tuned for fixed refresh rates. Rapid FPS fluctuations alter panel Vcom charging time, causing subtle brightness flickering in dark scenes."},
        {"question": "How do microsecond inter-frame pacing deltas quantify frame delivery jitter in games?", "answer": "Inter-frame deltas measure microsecond variance in frame presentation. Stable frame pacing produces low jitter (σ < 0.5ms) and ultra-smooth motion."},
        {"question": "What is the difference between G-Sync Compatible, G-Sync Ultimate (hardware module), and FreeSync Premium Pro?", "answer": "G-Sync Compatible uses open VESA Adaptive-Sync. G-Sync Ultimate incorporates a dedicated hardware module with full-range VRR and variable overdrive. FreeSync Premium Pro adds HDR certification."},
        {"question": "How do I enable VRR in Windows 11 graphics settings and GPU control panels?", "answer": "Enable 'Variable Refresh Rate' in Windows Display Settings, enable G-Sync / FreeSync in GPU control panel, and turn on VRR/Adaptive-Sync in monitor OSD."},
        {"question": "Why does FPS capping slightly below maximum refresh rate (e.g., 141 FPS on 144Hz) optimize VRR latency?", "answer": "Capping FPS 3 Hz below max refresh rate prevents GPU framerate from hitting VSync limiters, keeping the display continuously inside optimal VRR low-latency operation."},
        {"question": "Does VRR work in windowed web browsers and desktop application windows?", "answer": "Yes, enabling 'Windowed and Fullscreen' G-Sync mode allows VRR synchronization for desktop apps and browser-based test engines."},
        {"question": "How does VRR frame pacing affect motion clarity and camera panning smoothness in 540Hz+ displays?", "answer": "At 540Hz+, sub-millisecond frame delivery eliminates visual micro-stutter, rendering camera pans with perfect clarity."}
    ],

    "src/pages/white-screen/index.astro": [
        {"question": "What is the Fullscreen White Screen utility and how is it used for display inspection and fill lighting?", "answer": "The Fullscreen White Screen utility renders a pure #FFFFFF background in full-screen mode, ideal for dead pixel scanning, panel uniformity checks, screen cleaning, and webcam video call fill lighting."},
        {"question": "How does the Screen Wake Lock API keep the display active during screen cleaning and inspection?", "answer": "The Screen Wake Lock API prevents mobile devices, laptops, and monitors from dimming or activating sleep mode while inspecting or cleaning your display."},
        {"question": "How do I use color temperature sliders (2700K Warm to 6500K D65) for video call facial lighting?", "answer": "Adjust screen color temperature from 2700K (warm indoor glow) to 6500K (cool daylight) to provide balanced soft-box facial illumination during Zoom/Teams calls."},
        {"question": "How does the high-contrast Smudge & Dust Grid pattern help detect surface dirt and micro-scratches?", "answer": "The high-contrast grid overlay highlights surface dust particles, finger smudges, and physical anti-glare scratches for easy screen cleaning."},
        {"question": "What solid screen colors (Black, Green, Blue, Red, Yellow) are available for dead pixel scanning?", "answer": "Select from pure White, Black, Red, Green, Blue, Cyan, Magenta, Yellow, and custom hex colors to test all subpixel channels for defects."},
        {"question": "Can a white screen utility help condition or warm up display backlights prior to color calibration?", "answer": "Yes, displaying a white screen for 15-30 minutes warms up monitor backlights to stable thermal equilibrium prior to hardware color calibration."},
        {"question": "How do photographers use a full white screen as a soft light panel for macro product photography?", "answer": "Photographers position high-CRI white screens adjacent to small subjects as even soft light reflectors for shadowless product photos."},
        {"question": "Does keeping a white screen active at 100% brightness increase monitor power consumption?", "answer": "On LCD displays, power draw remains relatively flat. On OLED screens, displaying full 100% white triggers ABL and increases power consumption."},
        {"question": "How do I exit full screen mode (Press Esc or tap screen) on desktop and mobile browsers?", "answer": "Press the 'Esc' or 'F' key on desktop, or tap screen UI controls on mobile devices to toggle fullscreen mode."},
        {"question": "Is the White Screen utility 100% client-side, private, and ad-free?", "answer": "Yes! All canvas rendering runs 100% locally inside your web browser with zero ads, zero tracking scripts, and complete privacy."}
    ],

    "src/pages/white-screen/[color].astro": [
        {"question": "What is the Fullscreen Color Canvas utility and how does it test display subpixels?", "answer": "The Fullscreen Color Canvas utility renders solid full-screen colors (Black, White, Red, Green, Blue, Yellow, Cyan, Magenta) for inspecting subpixel defects, OLED 5% gray banding, and backlight bleed."},
        {"question": "How do solid primary background colors isolate dead vs stuck pixels?", "answer": "Solid Red, Green, and Blue backgrounds isolate individual subpixel channels. A dead subpixel shows up as a dark dot; a stuck subpixel glows against contrasting colors."},
        {"question": "How does Screen Wake Lock prevent display sleep during visual screen inspections?", "answer": "Screen Wake Lock API keeps your monitor active without dimming or entering standby while you inspect panel surface quality."},
        {"question": "Why is pure black background testing essential for OLED burn-in and backlight bleed evaluation?", "answer": "Pure black (#000000) turns off OLED pixels completely (0 nits), exposing edge backlight bleed on LCDs and image retention ghosts on OLEDs."},
        {"question": "How do I cycle between solid colors during fullscreen testing?", "answer": "Use Arrow Keys or click/tap the screen in fullscreen mode to cycle instantly through all primary test colors."},
        {"question": "Can solid color screens be used as custom background lighting for video calls?", "answer": "Yes, selecting warm yellow or daylight white screen colors turns your monitor into a soft-box video call fill light."},
        {"question": "What keyboard shortcuts control fullscreen color canvas navigation?", "answer": "Press 'F' or 'F11' for Fullscreen, 'Arrow Right / Space' to cycle colors, 'R' to reset to white, and 'Esc' to exit."},
        {"question": "How does subpixel layout (RGB vs BGR vs QD-OLED) look under solid color inspection?", "answer": "Solid color screens illuminate corresponding physical subpixel rows, revealing layout structures under macro lens inspection."},
        {"question": "Does displaying solid color screens damage computer monitors or TV panels?", "answer": "No. Displaying solid colors for visual inspection is completely safe for all LCD, Mini-LED, and OLED displays."},
        {"question": "Is the Fullscreen Color Canvas 100% private and browser-native?", "answer": "Yes, all color canvas rendering runs strictly in browser memory without external tracking or software downloads."}
    ]
}

# Add alias for duplicate / sub-routes
faq_data["src/pages/display-tests/dead-pixel-test/index.astro"] = faq_data["src/pages/display-tests/dead-pixel.astro"]
faq_data["src/pages/display-tests/dead-pixel-test/[slug].astro"] = faq_data["src/pages/display-tests/dead-pixel.astro"]
faq_data["src/pages/display-tests/electricity-cost/[slug].astro"] = faq_data["src/pages/display-tests/electricity-cost.astro"]
faq_data["src/pages/display-tests/tv-viewing-distance/[slug].astro"] = faq_data["src/pages/display-tests/tv-viewing-distance.astro"]

print(f"Total mapped files: {len(faq_data)}")

updated_count = 0

for rel_path, faqs in faq_data.items():
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"File not found: {rel_path}")
        continue
        
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Check if FAQSection is imported
    if "import FAQSection" not in content:
        # Add import FAQSection near top of frontmatter
        content = re.sub(
            r'(---[\s\S]*?import Layout from [^\n]+;\n)',
            r'\1import FAQSection from \'../../components/ui/FAQSection.astro\';\n',
            content,
            count=1
        )
        if "import FAQSection" not in content:
            # backup strategy: insert right after first ---
            content = content.replace("---\n", "---\nimport FAQSection from '../../components/ui/FAQSection.astro';\n", 1)

    # Convert faqs array to string format
    faq_code = "const faqs = [\n"
    for item in faqs:
        q_esc = item["question"].replace('"', '\\"')
        a_esc = item["answer"].replace('"', '\\"')
        faq_code += f'  {{\n    question: "{q_esc}",\n    answer: "{a_esc}"\n  }},\n'
    faq_code = faq_code.rstrip(",\n") + "\n];\n"

    # Replace existing faqs or structuredFaqs definition if present, else insert before ---
    if re.search(r'const (faqs|structuredFaqs)\s*=\s*\[[\s\S]*?\];', content):
        content = re.sub(r'const (faqs|structuredFaqs)\s*=\s*\[[\s\S]*?\];', faq_code.strip(), content, count=1)
    else:
        # Insert before ending frontmatter ---
        content = content.replace("\n---", f"\n{faq_code.strip()}\n---", 1)

    # Ensure <Layout ... faqs={faqs}>
    if "faqs={" not in content:
        content = re.sub(r'<Layout(\s+[^>]*?)>', r'<Layout\1 faqs={faqs}>', content, count=1)

    # Remove any static placeholder details/summary FAQ blocks
    content = re.sub(r'<!-- 10 Structured FAQs -->[\s\S]*?</section>', '', content)
    content = re.sub(r'<!-- FAQ Section -->\s*<section class="space-y-6 bg-\[#121215\][\s\S]*?</section>', '', content)

    # Render <FAQSection faqs={faqs} /> right before </Layout> or bottom container if not present
    if "<FAQSection" not in content:
        if "</div>\n</Layout>" in content:
            content = content.replace("</div>\n</Layout>", "    <FAQSection faqs={faqs} />\n  </div>\n</Layout>")
        elif "</Layout>" in content:
            content = content.replace("</Layout>", "  <FAQSection faqs={faqs} />\n</Layout>")

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    updated_count += 1

print(f"Successfully updated {updated_count} files.")
