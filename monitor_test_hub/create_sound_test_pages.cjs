const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const componentsDir = path.join(srcDir, 'components', 'diagnostics');

// Ensure directory exists
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. Create AudioTesterCanvas.astro
const audioTesterContent = `---
// AudioTesterCanvas.astro
---
<div class="audio-tester-container p-6 bg-bg-surface border border-border-hairline rounded-xl">
  <canvas id="audio-visualizer" class="w-full h-64 bg-black rounded-lg"></canvas>
  <div class="mt-4 flex justify-between gap-4">
    <button class="bg-primary-500 hover:bg-primary-400 text-white px-6 py-2 rounded font-medium transition-colors">Play Test Tone</button>
    <button class="bg-bg-elevated hover:bg-bg-surface text-text-primary px-6 py-2 rounded font-medium transition-colors border border-border-hairline">Sweep</button>
  </div>
</div>
`;

ensureDirSync(componentsDir);
fs.writeFileSync(path.join(componentsDir, 'AudioTesterCanvas.astro'), audioTesterContent);

const pagesToCreate = [
  { pathName: 'sound-test.astro', title: 'Sound Test' },
  { pathName: 'sound-test/speaker-test.astro', title: 'Speaker Test' },
  { pathName: 'sound-test/headphone-test.astro', title: 'Headphone Test' },
  { pathName: 'sound-test/bass-test.astro', title: 'Bass Test' },
  { pathName: 'sound-test/microphone-test.astro', title: 'Microphone Test' },
  { pathName: 'sound-test/tone-generator.astro', title: 'Tone Generator' },
  { pathName: 'sound-test/surround-sound.astro', title: 'Surround Sound Test' },
  { pathName: 'sound-test/audio-latency.astro', title: 'Audio Latency Test' }
];

const locales = ['', 'es', 'de', 'fr'];

const faqs = JSON.stringify([
  { q: "What is the AES17 audio standard?", a: "AES17 is a standard by the Audio Engineering Society that defines methods for measuring digital audio equipment. It sets guidelines for test signals, sweeps, and filters to ensure accurate evaluation of digital-to-analog converters and amplifiers." },
  { q: "How do I test my Left/Right channel balance?", a: "Our stereo balance test plays an isolated tone or white noise exclusively on the left, then the right channel. If the perceived center shifts or one side sounds louder, you may need to adjust your OS balance settings or check your cable connections." },
  { q: "What is a 20Hz to 20kHz frequency sweep?", a: "This sweep covers the generally accepted limits of human hearing. Starting at deep sub-bass (20Hz) and rising to ultra-high treble (20kHz), it helps identify dead zones in your speaker's crossover or limitations in your headphones' driver response." },
  { q: "Why does my microphone have a high noise floor?", a: "A high noise floor (constant hissing or humming) can be caused by unshielded cables, ground loops, poor preamp quality, or excessive digital gain. Our noise floor inspector visualizes this ambient noise level in decibels (dB)." },
  { q: "How do I detect Bluetooth audio latency?", a: "Our lip-sync and audio latency test plays a visual flash synchronized precisely with an audio ping. By observing the delay between the visual cue and the sound, you can estimate the latency introduced by codecs like SBC, AAC, aptX, or LDAC." },
  { q: "What is speaker phase alignment?", a: "Phase alignment refers to both speakers pushing out air at the same time. If one is wired backwards (out of phase), soundwaves will cancel out, especially low frequencies, resulting in a hollow, bass-less sound with a confusing stereo image." },
  { q: "How do I test my subwoofer crossover?", a: "Our bass sweep transitions from mid-bass down to sub-audible frequencies (e.g., 100Hz down to 10Hz). You can listen for the point where your main speakers hand off to the subwoofer and ensure the transition is smooth without volume dips." },
  { q: "Can I test 5.1 and 7.1 surround sound in the browser?", a: "Yes, using the modern Web Audio API's multichannel capabilities. Our tool routes distinct channel signals (Center, LFE, Surround L/R, Rear L/R) allowing you to verify physical speaker placement and OS audio configuration." },
  { q: "Why use a Web Audio tone generator?", a: "A web-based tone generator creates pure sine, square, triangle, or sawtooth waves using perfect mathematical algorithms directly in your browser. This eliminates the compression artifacts found in YouTube audio test videos." },
  { q: "Does sample rate affect these tests?", a: "Yes, standard audio tests run at 44.1kHz or 48kHz, which is sufficient for reproducing up to 20kHz or 24kHz (Nyquist frequency). High-res audio systems at 96kHz or 192kHz allow for higher frequency testing, though beyond human hearing limits." }
], null, 2);

const getBoilerplate = (title, relativePrefix) => `---
import Layout from '${relativePrefix}layouts/Layout.astro';
import AudioTesterCanvas from '${relativePrefix}components/diagnostics/AudioTesterCanvas.astro';
import FAQSection from '${relativePrefix}components/ui/FAQSection.astro';
import Breadcrumbs from '${relativePrefix}components/ui/Breadcrumbs.astro';
import SEOHead from '${relativePrefix}components/seo/SEOHead.astro';

const title = "${title}";
const description = "Professional web-native audio diagnostic suite for testing speakers, headphones, microphones, and latency.";

const faqs = ${faqs};

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Sound Test', href: '/sound-test' },
  { label: title, href: '#' }
];
---
<Layout title={title} description={description} faqs={faqs}>
  <SEOHead slot="head" title={title} description={description} />
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <Breadcrumbs items={breadcrumbs} />
    
    <header class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-text-primary tracking-tight mb-4">{title}</h1>
      <p class="text-xl text-text-secondary max-w-3xl mx-auto">High-fidelity web audio diagnostic instruments for precision calibration.</p>
    </header>

    <div class="mb-16">
      <AudioTesterCanvas />
    </div>

    <article class="prose prose-invert max-w-4xl mx-auto mb-16 space-y-6 text-text-secondary leading-relaxed">
      <h2 class="text-2xl font-semibold text-text-primary">Comprehensive Audio Diagnostics & Engineering Standards</h2>
      <p>
        Welcome to the definitive web-based audio testing suite. Ensuring high-fidelity audio reproduction requires more than just listening to your favorite track. It demands clinical, uncompressed test signals generated by precision mathematical algorithms. Our suite leverages the modern Web Audio API to bypass typical browser compression, delivering pure sine waves, white noise, and exact channel routing directly to your DAC (Digital-to-Analog Converter).
      </p>
      
      <h3 class="text-xl font-semibold text-text-primary mt-8">Left/Right Channel Balance & Phase Alignment</h3>
      <p>
        Accurate stereo imaging is the foundation of high-quality audio. Our L/R separation tests ensure that no crosstalk bleeds between your channels, vital for competitive gaming audio queues and spatial mixing. Furthermore, phase alignment testing identifies reversed wiring polarity. Out-of-phase speakers suffer from destructive interference, completely nullifying bass response and collapsing the soundstage into a diffuse, disorienting mess.
      </p>

      <h3 class="text-xl font-semibold text-text-primary mt-8">AES17 Sweeps & 20Hz-20kHz Frequency Response</h3>
      <p>
        The AES17 standard defines strict protocols for evaluating digital audio equipment. By utilizing continuous logarithmic sweeps from 20Hz (the threshold of human sub-bass perception) to 20kHz (the absolute ceiling of human hearing), you can map the frequency response curve of your headphones or studio monitors. Listen for resonant peaks, nulls in your room acoustics, or driver distortion at crossover points.
      </p>

      <h3 class="text-xl font-semibold text-text-primary mt-8">Microphone Noise Floor & Preamp Gain Staging</h3>
      <p>
        A silent room shouldn't register on your microphone. If your input signal shows constant activity, you are dealing with a high noise floor. This can stem from cheap motherboard audio isolation, USB ground loops, or over-cranked digital gain compensation. Our real-time visualizer helps you establish proper gain staging, maximizing your Signal-to-Noise Ratio (SNR) for crystal-clear voice comms and podcast recording.
      </p>
      
      <h3 class="text-xl font-semibold text-text-primary mt-8">Bluetooth Audio Latency: AAC, aptX, and LDAC</h3>
      <p>
        Wireless convenience often comes at the cost of latency. While wired setups typically exhibit &lt;20ms of delay, standard Bluetooth SBC or AAC codecs can introduce 150ms to 250ms of audio lag, resulting in noticeable lip-sync issues in movies and severe disadvantages in gaming. Advanced codecs like aptX Low Latency or LDAC reduce this overhead. Our audio-visual synchronization test provides empirical telemetry to quantify exactly how many milliseconds your wireless connection is lagging behind the video frame.
      </p>
      <p>
        By combining these robust tools into a single, zero-install web application, enthusiasts and professionals alike can instantly verify their audio hardware, troubleshoot setup configurations, and calibrate equalizers for a perfectly flat, neutral response curve.
      </p>
    </article>

    <div class="mt-20">
      <h2 class="text-3xl font-bold text-center text-text-primary mb-10">Frequently Asked Questions</h2>
      <FAQSection faqs={faqs} />
    </div>
  </main>
</Layout>
`;

for (const locale of locales) {
  for (const page of pagesToCreate) {
    let fullPathName;
    let relativePrefix;
    if (locale === '') {
      fullPathName = page.pathName;
      // if page is 'sound-test.astro', prefix is '../'
      // if 'sound-test/speaker-test.astro', prefix is '../../'
      const depth = page.pathName.split('/').length - 1;
      relativePrefix = depth === 0 ? '../' : '../../';
    } else {
      fullPathName = `${locale}/${page.pathName}`;
      const depth = fullPathName.split('/').length - 1;
      relativePrefix = '../'.repeat(depth + 1);
    }

    const absPath = path.join(pagesDir, fullPathName);
    ensureDirSync(path.dirname(absPath));

    const content = getBoilerplate(page.title, relativePrefix);
    fs.writeFileSync(absPath, content);
    console.log(`Created ${absPath}`);
  }
}
console.log("All pages generated successfully.");
