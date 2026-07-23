import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', err => {
    errors.push(`PageError: ${err.message}`);
    console.error(`PageError: ${err.message}`);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`ConsoleError: ${msg.text()}`);
      console.error(`ConsoleError: ${msg.text()}`);
    }
  });

  console.log('Navigating to http://localhost:4321...');
  try {
    await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  } catch (err) {
    console.error('Failed to navigate:', err);
  }

  console.log('Errors caught:', errors.length);
  
  // Let's get the bounding boxes of some key elements
  const elementsToInspect = ['header', 'main', '#hero-title', 'footer', '#smart-hero-cta'];
  const layoutInfo = {};
  
  for (const selector of elementsToInspect) {
    const el = await page.$(selector);
    if (el) {
      const box = await el.boundingBox();
      const display = await el.evaluate(node => window.getComputedStyle(node).display);
      layoutInfo[selector] = { box, display };
    } else {
      layoutInfo[selector] = 'Not Found';
    }
  }
  
  console.log(JSON.stringify(layoutInfo, null, 2));

  await browser.close();
})();
