export interface GuideSection {
  id: string;
  title: string;
  content: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: 'Display Technology' | 'OLED & Panel Health' | 'Touch & Mobile' | 'Gaming & Latency' | 'Color & Calibration' | 'Standards & Buyers Guide';
  readTime: string;
  date: string;
  author: string;
  keywords: string[];
  toolCta: {
    title: string;
    description: string;
    url: string;
  };
  sections: GuideSection[];
}

export const guidesData: Guide[] = [
  {
    slug: 'dead-pixel-vs-stuck-pixel',
    title: 'Dead Pixel vs. Stuck Pixel: How to Identify and Fix Screen Defect Types',
    description: 'Learn the technical differences between dead pixels, stuck sub-pixels, and hot pixels. Step-by-step diagnostic guide mapped to ISO 9241-307 standards.',
    category: 'Display Technology',
    readTime: '6 min read',
    date: '2026-07-20',
    author: 'Display Test Online Engineering Team',
    keywords: ['dead pixel test', 'stuck pixel fixer', 'dead pixel vs stuck pixel', 'ISO 9241-307', 'subpixel defects'],
    toolCta: {
      title: 'Run Dead Pixel Diagnostic Test',
      description: 'Cycle full-screen solid RGB colors to detect dead or stuck sub-pixels immediately.',
      url: '/display-tests'
    },
    sections: [
      {
        id: 'overview',
        title: 'Understanding Pixel Defects',
        content: 'Pixel defects occur when individual sub-pixels (Red, Green, or Blue) in an LCD or OLED panel fail to respond to electrical signals. A dead pixel is permanently unpowered and appears black against all light backgrounds. A stuck pixel occurs when a transistor fails in an open state, locking a single sub-pixel on at full brightness.'
      },
      {
        id: 'iso-standards',
        title: 'ISO 9241-307 Defect Classes',
        content: 'The International Organization for Standardization (ISO 9241-307) classifies display defect severity into four standard classes. Class I displays allow zero dead pixels, while Class II (the standard for consumer monitors) allows up to 2 permanently bright or dark pixels per million pixels.'
      },
      {
        id: 'diagnostic-steps',
        title: 'Step-by-Step Diagnostic Method',
        content: '1. Clean your screen with a micro-fiber cloth to remove dust particles.\n2. Open the full-screen Solid Color Cycler at 100% native resolution.\n3. Cycle through Pure White, Red, Green, Blue, and Black backgrounds.\n4. Inspect at a distance of 12–18 inches without scaling applied.'
      }
    ]
  },
  {
    slug: 'oled-burn-in-prevention-guide',
    title: 'Ultimate OLED Burn-In Prevention Guide: QD-OLED vs. WOLED Degradation',
    description: 'Understand permanent image retention in OLED monitors. Learn how static UI elements degrade organic sub-pixels and how to prevent burn-in.',
    category: 'OLED & Panel Health',
    readTime: '8 min read',
    date: '2026-07-19',
    author: 'Display Test Online Engineering Team',
    keywords: ['oled burn in test', 'qd-oled burn in', 'woled image retention', 'prevent oled burn in'],
    toolCta: {
      title: 'OLED Burn-In Risk Calculator',
      description: 'Evaluate your panel susceptibility with 5% & 10% near-black gray uniformity patterns.',
      url: '/display-tests/oled-burn-in'
    },
    sections: [
      {
        id: 'burn-in-physics',
        title: 'The Physics of OLED Degradation',
        content: 'OLED (Organic Light Emitting Diode) displays use self-emissive organic compounds to generate light. When static elements like taskbars, browser headers, or game HUDs are displayed at high luminance for thousands of hours, the organic blue, red, and green emitters in those regions degrade faster than surrounding pixels, resulting in uneven luminance memory.'
      },
      {
        id: 'qdoled-vs-woled',
        title: 'QD-OLED vs. WOLED Resistance',
        content: 'QD-OLED (Quantum Dot OLED) uses blue self-emissive OLEDs with quantum dot color converters, providing wider color volume. WOLED adds a white sub-pixel to boost luminance. Both technologies include built-in pixel refresh cycles and auto-luminance limiting (ABL) to mitigate degradation.'
      },
      {
        id: 'best-practices',
        title: 'Practical Prevention Rules',
        content: '• Auto-hide Windows Taskbar or macOS Dock.\n• Keep sustained SDR brightness under 60% (approx 120–150 nits).\n• Use a dark mode theme and dynamic desktop wallpaper.\n• Never unplug the monitor from power immediately after use, allowing background pixel refresh cycles to complete.'
      }
    ]
  },
  {
    slug: 'vrr-freesync-gsync-explained',
    title: 'VRR, FreeSync, and G-Sync Explained: How to Fix Stuttering & Tearing',
    description: 'A comprehensive guide to Variable Refresh Rate (VRR) technologies. Learn how AMD FreeSync, NVIDIA G-Sync, and VESA AdaptiveSync eliminate tear-bars.',
    category: 'Gaming & Latency',
    readTime: '7 min read',
    date: '2026-07-18',
    author: 'Display Test Online Engineering Team',
    keywords: ['vrr stutter test', 'freesync vs gsync', 'screen tearing fix', '540hz monitor test'],
    toolCta: {
      title: 'VRR Stutter & Tearing Sweep Engine',
      description: 'Test target frequency sweeps up to 540Hz+ to verify smooth frame-pacing.',
      url: '/display-tests/vrr'
    },
    sections: [
      {
        id: 'vrr-mechanics',
        title: 'How Variable Refresh Rate Works',
        content: 'Traditional displays refresh at a fixed frequency (e.g. 60Hz or 144Hz). When GPU frame render times fluctuate, traditional V-Sync forces repeated frames (stutter) or turning V-Sync off causes split frames (tearing). VRR dynamically synchronizes the display pixel scanout to the exact microsecond a GPU finishes rendering a frame.'
      },
      {
        id: 'gsync-vs-freesync',
        title: 'G-Sync Compatible vs. FreeSync Premium Pro',
        content: 'Hardware G-Sync uses a dedicated FPGA module inside the monitor for full variable range down to 1Hz. FreeSync and G-Sync Compatible utilize VESA DisplayPort Adaptive-Sync protocols with Low Framerate Compensation (LFC) to double frames when FPS drops below the VRR floor.'
      }
    ]
  },
  {
    slug: 'monitor-refresh-rate-60hz-vs-144hz-vs-240hz-vs-540hz',
    title: 'Monitor Refresh Rate Comparison: 60Hz vs 144Hz vs 240Hz vs 540Hz',
    description: 'Explore motion clarity, frame intervals, and motion picture response time (MPRT) improvements across modern high-refresh gaming displays.',
    category: 'Gaming & Latency',
    readTime: '6 min read',
    date: '2026-07-17',
    author: 'Display Test Online Engineering Team',
    keywords: ['60hz vs 144hz', '240hz vs 540hz', 'refresh rate comparison', 'frame interval ms'],
    toolCta: {
      title: 'High-Refresh Telemetry Inspector',
      description: 'Measure your monitor active refresh rate and frame stability in real-time.',
      url: '/vrr-stutter-test'
    },
    sections: [
      {
        id: 'frame-time-math',
        title: 'The Math of Frame Intervals',
        content: 'A 60Hz display renders one frame every 16.67 milliseconds. Upgrading to 144Hz drops frame intervals to 6.94ms. At 240Hz, interval drops to 4.17ms, and at 540Hz, frame time shrinks to just 1.85ms per frame. Diminishing returns occur visually, but latency benefits scale linearly for competitive esports.'
      }
    ]
  },
  {
    slug: 'hdr10-vs-dolby-vision-tone-mapping',
    title: 'HDR10 vs Dolby Vision Tone Mapping: Understanding Peak Luminance & ABL',
    description: 'Demystifying High Dynamic Range (HDR). Learn how ST.2084 PQ EOTF tone curves, dynamic metadata, and Auto Brightness Limiting (ABL) work.',
    category: 'Display Technology',
    readTime: '9 min read',
    date: '2026-07-16',
    author: 'Display Test Online Engineering Team',
    keywords: ['hdr tone mapping', 'pq eotf test', 'abl window size', 'hdr10 vs dolby vision'],
    toolCta: {
      title: 'HDR 10-Bit Tone Mapping Evaluator',
      description: 'Render WebGL 10-bit PQ EOTF luminance curves and test peak clipping.',
      url: '/display-tests/hdr-test'
    },
    sections: [
      {
        id: 'pq-eotf',
        title: 'The ST.2084 Perceptual Quantizer (PQ)',
        content: 'Unlike SDR gamma curves, the Perceptual Quantizer (PQ EOTF) is an absolute luminance curve mapped from 0 to 10,000 nits. Displays with lower peak capability (e.g. 600 nits) must apply mathematical tone mapping to compress highlights without crushing shadow detail.'
      }
    ]
  },
  {
    slug: 'understanding-input-lag-and-response-time',
    title: 'Input Lag vs Response Time vs Mouse Polling Rate: What Matters Most?',
    description: 'Clarifying display latency metrics. Differentiate signal processing lag, GtG pixel transition speed, and USB mouse polling bottlenecks.',
    category: 'Gaming & Latency',
    readTime: '7 min read',
    date: '2026-07-15',
    author: 'Display Test Online Engineering Team',
    keywords: ['input lag vs response time', 'mouse polling rate bottleneck', '8000hz mouse test', 'reflex latency'],
    toolCta: {
      title: 'Reflex Input Lag Sniper',
      description: 'Test click-to-flash reaction speed and analyze hardware polling bottlenecks.',
      url: '/touch-tests/input-lag'
    },
    sections: [
      {
        id: 'latency-components',
        title: 'Deconstructing Total End-to-End System Latency',
        content: 'Total latency equals USB peripheral polling delay + OS render queue time + GPU frame generation time + display scaler processing time + panel GtG pixel response time.'
      }
    ]
  },
  {
    slug: 'subpixel-geometry-rgb-vs-bgr-vs-qdoled',
    title: 'Sub-Pixel Layouts Explained: RGB, BGR, QD-OLED, and WOLED Text Clarity',
    description: 'How sub-pixel layouts affect font rendering in Windows ClearType and macOS. Understand RGB, BGR, triangular QD-OLED, and RWBG sub-pixel structures.',
    category: 'Display Technology',
    readTime: '8 min read',
    date: '2026-07-14',
    author: 'Display Test Online Engineering Team',
    keywords: ['subpixel layout inspector', 'rgb vs bgr text fringe', 'qd-oled text clarity', 'cleartype subpixel'],
    toolCta: {
      title: 'Sub-Pixel Geometry Inspector',
      description: 'Inspect RGB, BGR, QD-OLED, and WOLED sub-pixel geometry under high magnification.',
      url: '/display-tests/sub-pixel'
    },
    sections: [
      {
        id: 'cleartype-rendering',
        title: 'Why Sub-Pixel Order Distorts Text',
        content: 'Operating systems use sub-pixel anti-aliasing (such as Microsoft ClearType) assuming a standard left-to-right Red-Green-Blue (RGB) sub-pixel arrangement. Displays with BGR or triangular QD-OLED layouts cause color fringing on font edges unless sub-pixel rendering is adjusted.'
      }
    ]
  },
  {
    slug: 'touchscreen-digitizer-dead-zones-diagnosis',
    title: 'How to Diagnose Smartphone and Tablet Touchscreen Digitizer Dead-Zones',
    description: 'A step-by-step guide to detecting unresponsive touch zones, ghost touches, and digitizer calibration issues on mobile devices.',
    category: 'Touch & Mobile',
    readTime: '5 min read',
    date: '2026-07-13',
    author: 'Display Test Online Engineering Team',
    keywords: ['touchscreen test online', 'touchscreen dead zone', 'digitizer test mobile', 'multi touch counter'],
    toolCta: {
      title: 'Mobile Touch Matrix Suite',
      description: 'Open 100dvh sandboxed digitizer grid matrix to detect dead-zones and test multi-touch.',
      url: '/touch-matrix'
    },
    sections: [
      {
        id: 'digitizer-physics',
        title: 'Capacitive Touchscreen Anatomy',
        content: 'Capacitive digitizers contain a grid of transparent indium tin oxide (ITO) electrodes. Physical drops or moisture can sever micro-traces, creating entire dead rows or columns on the touchscreen.'
      }
    ]
  },
  {
    slug: 'color-gamut-srgb-dcip3-rec2020',
    title: 'Color Gamut Guide: sRGB, DCI-P3, Adobe RGB, and Rec. 2020 Comparison',
    description: 'Learn color spaces, chromaticity coordinates, and spectral coverage for photo editing, cinema grading, and gaming displays.',
    category: 'Color & Calibration',
    readTime: '8 min read',
    date: '2026-07-12',
    author: 'Display Test Online Engineering Team',
    keywords: ['srgb vs dci-p3', 'color gamut calculator', 'cie 1931 chromaticity', 'rec 2020 coverage'],
    toolCta: {
      title: 'Color Gamut & CIE 1931 Map',
      description: 'Visualize sRGB, DCI-P3, and Rec. 2020 chromaticity coverage interactively.',
      url: '/display-tests/color-gamut'
    },
    sections: [
      {
        id: 'color-space-overview',
        title: 'Comparing Standard Color Volumes',
        content: 'sRGB is the web standard (100% sRGB). DCI-P3 expands green and red primaries by ~25% for cinema. Rec. 2020 covers 75.8% of all visible human color space, designed for ultra-high-definition HDR content.'
      }
    ]
  },
  {
    slug: 'how-to-calibrate-monitor-for-gaming-and-editing',
    title: 'How to Calibrate Your Monitor for Gaming and Photo Editing Without Hardware Probes',
    description: 'Calibrate contrast, gamma 2.2, brightness (nits), and white balance (6500K) using browser-based visual patterns.',
    category: 'Color & Calibration',
    readTime: '10 min read',
    date: '2026-07-11',
    author: 'Display Test Online Engineering Team',
    keywords: ['calibrate monitor online', 'gamma 2.2 test', 'white balance 6500k', 'monitor contrast test'],
    toolCta: {
      title: 'Display Calibration & Pattern Deck',
      description: 'Adjust contrast, shadow detail, and gamma alignment with visual calibration patterns.',
      url: '/display-tests'
    },
    sections: [
      {
        id: 'calibration-fundamentals',
        title: 'Core Calibration Variables',
        content: 'Setting correct brightness (120 nits for office, 200+ nits for gaming), gamma 2.2 linear transfer response, and D65 (6500K) white balance ensures accurate image representation without hardware colorimeters.'
      }
    ]
  },
  {
    slug: 'understanding-icc-profiles-and-color-management',
    title: 'What is an ICC Profile? How to Install and Export Custom Color Profiles',
    description: 'Learn how International Color Consortium (ICC v4.3) profiles manage display color transforms across Windows and macOS.',
    category: 'Color & Calibration',
    readTime: '6 min read',
    date: '2026-07-10',
    author: 'Display Test Online Engineering Team',
    keywords: ['icc profile generator', 'install icc profile windows', 'icc v4.3 exporter', 'littlecms wasm'],
    toolCta: {
      title: 'WebAssembly Binary ICC Exporter',
      description: 'Generate and download binary ICC v4.3 color profiles compiled directly in your browser.',
      url: '/display-tests/color-gamut'
    },
    sections: [
      {
        id: 'icc-architecture',
        title: 'Inside an ICC Profile',
        content: 'An ICC profile contains binary tags specifying chromatic adaptation matrices, TRC (Tone Response Curves), and RGB primaries to translate device color spaces into Profile Connection Space (PCS).'
      }
    ]
  },
  {
    slug: 'ips-glow-vs-backlight-bleed-vs-va-smearing',
    title: 'IPS Glow vs. Backlight Bleed vs. VA Gamma Shift: Identifying LCD Panel Flaws',
    description: 'Diagnose common LCD panel defects. Understand IPS glow, edge backlight bleed, and VA dark-level response smearing.',
    category: 'Display Technology',
    readTime: '7 min read',
    date: '2026-07-09',
    author: 'Display Test Online Engineering Team',
    keywords: ['ips glow test', 'backlight bleed test', 'va black smearing', 'lcd panel defects'],
    toolCta: {
      title: 'Uniformity & Backlight Bleed Inspector',
      description: 'Audit dark-level uniformity and IPS glow across 9-zone screen regions.',
      url: '/display-tests/uniformity'
    },
    sections: [
      {
        id: 'lcd-defect-types',
        title: 'Characterizing LCD Weaknesses',
        content: 'IPS Glow changes luminance dynamically based on viewing angle. Backlight bleed is fixed optical leakage along panel bezel edges. VA smearing occurs when slow dark-to-light GtG transitions cause trailing shadows in dark scenes.'
      }
    ]
  },
  {
    slug: 'miniled-local-dimming-blooming-explained',
    title: 'Mini-LED Local Dimming and Blooming: How Zone Counts Impact Contrast',
    description: 'Understand full-array local dimming (FALD) in Mini-LED displays. Evaluate local dimming blooming artifacts and zone transition speeds.',
    category: 'Display Technology',
    readTime: '7 min read',
    date: '2026-07-08',
    author: 'Display Test Online Engineering Team',
    keywords: ['miniled local dimming test', 'fald blooming test', 'zone count monitor', 'mini-led vs oled'],
    toolCta: {
      title: 'Mini-LED Blooming & Zone Isolator',
      description: 'Isolate local dimming zones and measure halo blooming artifacts.',
      url: '/display-tests/hdr-test'
    },
    sections: [
      {
        id: 'fald-mechanics',
        title: 'Full-Array Local Dimming (FALD)',
        content: 'Mini-LED displays use thousands of tiny LED backlights grouped into hundreds or thousands of dimming zones. Higher zone density reduces haloing blooming around small bright objects against dark backgrounds.'
      }
    ]
  },
  {
    slug: 'pixel-density-ppi-and-retina-acuity-distance',
    title: 'Pixel Density (PPI) & Retina Visual Acuity: How Far Should You Sit?',
    description: 'Calculate Pixels Per Inch (PPI), arcminute visual resolution limits, and optimal viewing distances for 1080p, 1440p, 4K, and 8K displays.',
    category: 'Standards & Buyers Guide',
    readTime: '6 min read',
    date: '2026-07-07',
    author: 'Display Test Online Engineering Team',
    keywords: ['ppi calculator monitor', 'retina viewing distance', 'arcminute acuity calculator', '1440p vs 4k ppi'],
    toolCta: {
      title: 'PPI & Acuity Distance Calculator',
      description: 'Calculate display pixel density and 1-arcminute visual acuity distance instantly.',
      url: '/display-tests/ppi-calculator'
    },
    sections: [
      {
        id: 'acuity-math',
        title: 'Human Visual Resolution Limits',
        content: 'Human vision with 20/20 acuity can resolve details down to approximately 1 arcminute (1/60th of a degree). At 24 inches, a 110 PPI display (e.g. 27-inch 1440p) hits the perceptual threshold.'
      }
    ]
  },
  {
    slug: 'motion-blur-mprt-vs-gtg-response-time',
    title: 'Motion Blur Uncovered: MPRT vs. GtG Response Time and Backlight Strobing',
    description: 'Understand Motion Picture Response Time (MPRT) vs Gray-to-Gray (GtG) transition speeds. Learn how black frame insertion (BFI) reduces motion blur.',
    category: 'Gaming & Latency',
    readTime: '8 min read',
    date: '2026-07-06',
    author: 'Display Test Online Engineering Team',
    keywords: ['mprt vs gtg', 'backlight strobing bfi', 'ghosting test online', 'pursuit camera test'],
    toolCta: {
      title: 'Ghosting Invaders Arcade Game',
      description: 'Shoot moving targets to test your display GtG response and eye-tracking pursuit blur.',
      url: '/arcade/ghosting-invaders'
    },
    sections: [
      {
        id: 'mprt-explanation',
        title: 'Sample-and-Hold Motion Blur',
        content: 'Even with instantaneous GtG pixel transitions (like OLEDs), modern displays exhibit sample-and-hold motion blur caused by human eye smooth pursuit movements. Backlight strobing (BFI / ULMB) pulses light to eliminate blur.'
      }
    ]
  },
  {
    slug: 'multi-monitor-calibration-and-sync-guide',
    title: 'Multi-Monitor Setup & Color Matching Guide: Achieving Dual-Screen Harmony',
    description: 'How to color-match dual or triple monitor setups across different panel types using native browser BroadcastChannel peer synchronization.',
    category: 'Color & Calibration',
    readTime: '6 min read',
    date: '2026-07-05',
    author: 'Display Test Online Engineering Team',
    keywords: ['dual monitor color match', 'broadcastchannel sync deck', 'multi display calibration'],
    toolCta: {
      title: 'Multi-Display Broadcast Sync Deck',
      description: 'Sync test patterns across dual monitors simultaneously with zero network delay.',
      url: '/display-tests'
    },
    sections: [
      {
        id: 'sync-deck',
        title: 'Peer-to-Peer Browser Sync',
        content: 'Using native HTML5 BroadcastChannel API, Display Test Online locks test color cycles across multi-monitor browser windows without needing server relays or extensions.'
      }
    ]
  },
  {
    slug: 'smartphone-multi-touch-gesture-precision',
    title: 'Mobile Digitizer Testing: Multi-Touch Limits, Swipe Velocity, and Vector Precision',
    description: 'Evaluate mobile touch digitizer performance. Measure maximum touch point counts, swipe tracking velocity, and vector draw deviation.',
    category: 'Touch & Mobile',
    readTime: '7 min read',
    date: '2026-07-04',
    author: 'Display Test Online Engineering Team',
    keywords: ['mobile touch test', 'swipe velocity test', 'vector draw precision', 'multi touch point test'],
    toolCta: {
      title: 'Vector Precision & Touch Suite',
      description: 'Measure digitizer draw line RMS deviation and gesture tracking velocity.',
      url: '/touch-tests/vector-precision'
    },
    sections: [
      {
        id: 'vector-precision-formula',
        title: 'Calculating RMS Vector Draw Deviation',
        content: 'Vector draw precision is evaluated using Root Mean Square (RMS) deviation formulas comparing touched coordinates to target linear vectors.'
      }
    ]
  },
  {
    slug: 'understanding-display-interfaces-hdmi-21-vs-displayport-21',
    title: 'HDMI 2.1 vs DisplayPort 2.1: Bandwidth, DSC, and Refresh Rate Limits',
    description: 'Compare display interface bandwidth capacities (FRL 48Gbps vs UHBR20 80Gbps), Display Stream Compression (DSC), and uncompressed refresh rate ceilings.',
    category: 'Standards & Buyers Guide',
    readTime: '8 min read',
    date: '2026-07-03',
    author: 'Display Test Online Engineering Team',
    keywords: ['hdmi 2.1 vs displayport 2.1', 'display stream compression dsc', '4k 240hz cable bandwidth'],
    toolCta: {
      title: 'Hardware Telemetry Inspector',
      description: 'Verify current resolution, refresh rate, and browser color depth capabilities.',
      url: '/'
    },
    sections: [
      {
        id: 'bandwidth-comparison',
        title: 'Interface Bandwidth Ceilings',
        content: 'HDMI 2.1 supports up to 48 Gbps (FRL5/6). DisplayPort 2.1 (UHBR20) reaches up to 80 Gbps, enabling uncompressed 4K 240Hz and 8K 60Hz 10-bit HDR output.'
      }
    ]
  },
  {
    slug: 'eye-strain-blue-light-flicker-free-monitors',
    title: 'Preventing Eye Strain: PWM Flicker, Blue Light, and Ergonomics (20-20-20 Rule)',
    description: 'Reduce visual fatigue with science-backed display habits. Learn about PWM backlight flicker, spectral blue light peaks, and ergonomic screen positioning.',
    category: 'Standards & Buyers Guide',
    readTime: '6 min read',
    date: '2026-07-02',
    author: 'Display Test Online Engineering Team',
    keywords: ['pwm flicker test', 'eye strain monitor', '20 20 20 rule', 'flicker free display'],
    toolCta: {
      title: 'Ergonomics Notice & Safety Guide',
      description: 'Review formal 20-20-20 rule ergonomic notices and non-flashing photosensitive safe modes.',
      url: '/about'
    },
    sections: [
      {
        id: 'ergonomic-rules',
        title: 'The 20-20-20 Rule & PWM Flicker',
        content: 'Every 20 minutes, focus on an object 20 feet away for 20 seconds. Ensure your monitor uses DC dimming or high-frequency PWM (>2000Hz) to prevent stroboscopic eyestrain.'
      }
    ]
  },
  {
    slug: 'used-monitor-buying-checklist-and-hardware-passport',
    title: 'Used Monitor & Smartphone Buying Checklist: How to Verify Screen Health',
    description: 'A complete hardware audit checklist for buying pre-owned screens. Generate an unalterable SHA-256 Hardware Passport receipt before purchasing.',
    category: 'Standards & Buyers Guide',
    readTime: '7 min read',
    date: '2026-07-01',
    author: 'Display Test Online Engineering Team',
    keywords: ['used monitor checklist', 'used phone screen test', 'sha-256 hardware passport', 'screen health index'],
    toolCta: {
      title: 'Generate SHA-256 Hardware Passport',
      description: 'Create a cryptographically signed PNG diagnostic receipt certifying display condition.',
      url: '/faq'
    },
    sections: [
      {
        id: 'buying-checklist',
        title: 'Essential Pre-Owned Screen Audit Steps',
        content: '1. Test for dead pixels across RGB background colors.\n2. Verify 5% near-black OLED gray uniformity.\n3. Test all multi-touch digitizer cells.\n4. Export a signed Hardware Passport receipt.'
      }
    ]
  },
  {
    slug: 'delta-e-color-accuracy-explained',
    title: 'Understanding Delta E (ΔE00): What Color Difference Values Mean',
    description: 'Learn how CIEDE2000 (ΔE00) measures human perception of color differences. Benchmark calibration tolerances for pro print and gaming.',
    category: 'Color & Calibration',
    readTime: '6 min read',
    date: '2026-06-30',
    author: 'Display Test Online Engineering Team',
    keywords: ['delta e color accuracy', 'delta e 00 formula', 'color match alchemist', 'ciede2000'],
    toolCta: {
      title: 'Color Match Alchemist Arcade Game',
      description: 'Test your visual color discrimination capability against target Delta E00 thresholds.',
      url: '/arcade/color-match-alchemist'
    },
    sections: [
      {
        id: 'delta-e-scale',
        title: 'The Delta E Scale',
        content: '• ΔE < 1.0: Imperceptible difference to human vision.\n• ΔE 1.0–2.0: Professional photo editing calibration target.\n• ΔE > 3.0: Noticeable color shift to untrained eyes.'
      }
    ]
  },
  {
    slug: 'aspect-ratio-and-resolution-scaling-guide',
    title: 'Aspect Ratio Scaling: 16:9, 21:9 Ultrawide, and 32:9 Super Ultrawide Comparison',
    description: 'Compare standard widescreen (16:9), ultrawide (21:9), and super ultrawide (32:9) monitors for productivity, gaming FOV, and window snapping.',
    category: 'Standards & Buyers Guide',
    readTime: '7 min read',
    date: '2026-06-29',
    author: 'Display Test Online Engineering Team',
    keywords: ['ultrawide vs 16 9', '32 9 super ultrawide', 'monitor aspect ratio comparison', 'field of view fov'],
    toolCta: {
      title: 'PPI & Aspect Ratio Calculator',
      description: 'Calculate physical dimensions, aspect ratios, and pixel densities for any display.',
      url: '/display-tests/ppi-calculator'
    },
    sections: [
      {
        id: 'aspect-ratios',
        title: 'Choosing the Right Aspect Ratio',
        content: '16:9 (2560x1440, 3840x2160) offers universal game compatibility. 21:9 (3440x1440) provides 33% extra horizontal space. 32:9 (5120x1440) replaces dual-monitor setups seamlessly.'
      }
    ]
  }
];
