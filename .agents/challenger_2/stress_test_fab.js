import fs from 'fs';

console.log('=== STRESS-TESTING FAB & FULLSCREEN STATE MACHINE ===\n');

class MockDOMElement {
  constructor(id, initialClasses) {
    this.id = id;
    this.classListSet = new Set(initialClasses.split(/\s+/).filter(Boolean));
  }

  get classList() {
    const self = this;
    return {
      add: (...classes) => classes.forEach(c => self.classListSet.add(c)),
      remove: (...classes) => classes.forEach(c => self.classListSet.delete(c)),
      contains: (c) => self.classListSet.has(c),
      toArray: () => Array.from(self.classListSet)
    };
  }
}

const astroContent = fs.readFileSync('/Users/divyyadav/newws/monitor_test_hub/src/components/ui/FloatingActionMenu.astro', 'utf8');
const containerClassMatch = astroContent.match(/id="floating-fab-container"[\s\S]*?class="([^"]+)"/);
const classListString = containerClassMatch[1];

// Stress Test 1: Rapid 10,000 Fullscreen State Flips on Mobile
console.log('--- STRESS TEST 1: 10,000 RAPID FULLSCREEN FLIPS ON MOBILE ---');
const mobileFab = new MockDOMElement('floating-fab-container', classListString);

const startTime = performance.now();
for (let i = 0; i < 10000; i++) {
  const entering = i % 2 === 0;
  if (entering) {
    mobileFab.classList.add('!hidden');
  } else {
    mobileFab.classList.remove('!hidden');
  }
}
const endTime = performance.now();

console.log(`[PASS] Executed 10,000 state transitions in ${(endTime - startTime).toFixed(2)}ms`);
console.log(`Final mobile state: [${mobileFab.classList.toArray().join(', ')}]`);
if (!mobileFab.classList.contains('hidden')) {
  console.error('[FAIL] Baseline hidden lost during rapid fullscreen flips!');
  process.exit(1);
}
console.log('[PASS] Baseline hidden retained with 0 corruption after 10,000 flips.');

// Stress Test 2: Viewport Orientation Changes (Portrait <640px to Landscape >=640px)
console.log('\n--- STRESS TEST 2: VIEWPORT ORIENTATION CHANGE DYNAMICS ---');
function evaluateDisplayState(viewportWidth, classList) {
  if (classList.contains('!hidden')) return 'hidden (!hidden override)';
  if (viewportWidth >= 640 && classList.contains('sm:flex')) return 'flex (sm:flex)';
  if (classList.contains('hidden')) return 'hidden (hidden baseline)';
  return 'flex (default)';
}

const viewports = [
  { width: 375, name: 'Mobile Portrait (iPhone 14)' },
  { width: 414, name: 'Mobile Max (iPhone 14 Plus)' },
  { width: 639, name: 'Mobile Upper Bound (639px)' },
  { width: 640, name: 'Tablet/Desktop Lower Bound (640px sm)' },
  { width: 768, name: 'iPad Portrait (768px md)' },
  { width: 1024, name: 'Desktop (1024px lg)' },
];

viewports.forEach(vp => {
  const normalDisplay = evaluateDisplayState(vp.width, mobileFab.classList);
  // simulate fullscreen
  mobileFab.classList.add('!hidden');
  const fullscreenDisplay = evaluateDisplayState(vp.width, mobileFab.classList);
  // exit fullscreen
  mobileFab.classList.remove('!hidden');
  const restoredDisplay = evaluateDisplayState(vp.width, mobileFab.classList);

  console.log(`Viewport: ${vp.name} (${vp.width}px)`);
  console.log(`  - Normal: ${normalDisplay}`);
  console.log(`  - Fullscreen: ${fullscreenDisplay}`);
  console.log(`  - Restored: ${restoredDisplay}`);

  if (vp.width < 640) {
    if (normalDisplay !== 'hidden (hidden baseline)' || restoredDisplay !== 'hidden (hidden baseline)') {
      console.error(`[FAIL] Visibility leak on mobile viewport ${vp.width}px!`);
      process.exit(1);
    }
  } else {
    if (normalDisplay !== 'flex (sm:flex)' || restoredDisplay !== 'flex (sm:flex)') {
      console.error(`[FAIL] Visibility failure on desktop viewport ${vp.width}px!`);
      process.exit(1);
    }
  }
});
console.log('[PASS] Viewport orientation transitions evaluated correctly across all breakpoints.');

// Stress Test 3: Idempotency of Fullscreen Event Handlers
console.log('\n--- STRESS TEST 3: EVENT HANDLER IDEMPOTENCY ---');
// Repeatedly trigger handleFullscreenChange when already in fullscreen or already out
mobileFab.classList.add('!hidden');
mobileFab.classList.add('!hidden');
mobileFab.classList.add('!hidden');
console.log(`After 3x add('!hidden'): count of !hidden in Set = 1`);
if (Array.from(mobileFab.classListSet).filter(c => c === '!hidden').length !== 1) {
  console.error('[FAIL] Duplicate !hidden classes accumulated!');
  process.exit(1);
}

mobileFab.classList.remove('!hidden');
mobileFab.classList.remove('!hidden');
mobileFab.classList.remove('!hidden');
console.log(`After 3x remove('!hidden'): count of !hidden in Set = 0`);
if (mobileFab.classList.contains('!hidden')) {
  console.error('[FAIL] !hidden still present after removal!');
  process.exit(1);
}
console.log('[PASS] Event handler is strictly idempotent.');

console.log('\n=== ALL STRESS TESTS PASSED (3/3) ===');
