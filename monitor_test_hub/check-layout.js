import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });
  
  const layoutInfo = await page.evaluate(() => {
    const main = document.querySelector('main');
    const sections = Array.from(main.children);
    return sections.map((s, i) => ({
      tag: s.tagName,
      className: s.className,
      height: s.getBoundingClientRect().height,
      display: window.getComputedStyle(s).display,
      padding: window.getComputedStyle(s).padding,
      position: window.getComputedStyle(s).position
    }));
  });
  
  console.log(JSON.stringify(layoutInfo, null, 2));
  await browser.close();
})();
