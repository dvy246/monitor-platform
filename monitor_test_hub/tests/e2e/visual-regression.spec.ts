import { test, expect } from '@playwright/test';

interface DiagnosticRoute {
  name: string;
  path: string;
}

interface DiagnosticCategory {
  category: string;
  routes: DiagnosticRoute[];
}

const diagnosticCategories: DiagnosticCategory[] = [
  {
    category: 'Visual Display',
    routes: [
      { name: 'Refresh Rate Test', path: '/refresh-rate-test' },
      { name: 'Monitor Color Calibration', path: '/monitor-color-calibration' },
      { name: 'White Screen Utility', path: '/white-screen' },
      { name: 'Dead Pixel Inspector', path: '/display-tests/dead-pixel' },
      { name: 'Sub-Pixel Layout Inspector', path: '/display-tests/sub-pixel' },
      { name: 'VRR Stutter & Tearing Sweep', path: '/display-tests/vrr' },
      { name: 'HDR PQ EOTF Test', path: '/display-tests/hdr-test' },
      { name: 'PPI Acuity Calculator', path: '/display-tests/ppi-calculator' },
      { name: 'Color Gamut Visualizer', path: '/display-tests/color-gamut' },
    ],
  },
  {
    category: 'Touch',
    routes: [
      { name: 'Touch Dead-Zone Matrix', path: '/touch-tests/dead-zone' },
      { name: 'Multi-Touch Counter', path: '/touch-tests/multi-touch' },
      { name: 'Vector Precision RMS Noise', path: '/touch-tests/vector-precision' },
      { name: 'Touch Input Lag Reflex', path: '/touch-tests/input-lag' },
      { name: 'Touch Matrix Hub', path: '/touch-matrix' },
    ],
  },
  {
    category: 'Input',
    routes: [
      { name: 'Mouse Diagnostic Suite', path: '/mouse-test' },
      { name: 'Gamepad Controller Diagnostic', path: '/controller-test' },
      { name: 'Keyboard Switch Chatter Tester', path: '/keyboard-tester' },
    ],
  },
  {
    category: 'Audio',
    routes: [
      { name: 'Universal Sound Test Hub', path: '/sound-test' },
      { name: 'Speaker & L/R Balance Test', path: '/sound-test/speaker-test' },
      { name: 'Logarithmic Tone Generator', path: '/sound-test/tone-generator' },
    ],
  },
  {
    category: 'Utility & Arcade',
    routes: [
      { name: 'PC Bottleneck Estimator', path: '/benchmarks/pc-bottleneck' },
      { name: 'Electrical Wire Gauge Calculator', path: '/benchmarks/wire-gauge-calculator' },
      { name: '3D Printer Filament Cost Estimator', path: '/benchmarks/3d-print-cost' },
      { name: 'Appliance Electricity Cost Calculator', path: '/display-tests/electricity-cost' },
      { name: 'Ghosting Invaders Arcade', path: '/arcade/ghosting-invaders' },
      { name: 'Per-Model Telemetry Hub', path: '/models' },
      { name: 'Display Comparison Engine', path: '/compare' },
    ],
  },
];

test.describe('Visual Regression Baseline Suite', () => {
  for (const group of diagnosticCategories) {
    test.describe(group.category, () => {
      for (const route of group.routes) {
        test(`Desktop 1280x800 layout for ${route.name} (${route.path})`, async ({ page }) => {
          await page.setViewportSize({ width: 1280, height: 800 });
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(500);
          await expect(page).toHaveScreenshot({
            fullPage: false,
            animations: 'disabled',
            maxDiffPixelRatio: 0.05,
          });
        });

        test(`Mobile 375x812 layout for ${route.name} (${route.path})`, async ({ page }) => {
          await page.setViewportSize({ width: 375, height: 812 });
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(500);
          await expect(page).toHaveScreenshot({
            fullPage: false,
            animations: 'disabled',
            maxDiffPixelRatio: 0.05,
          });
        });
      }
    });
  }
});
