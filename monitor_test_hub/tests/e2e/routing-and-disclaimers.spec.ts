import { test, expect } from '@playwright/test';

test.describe('Monitor Test Hub Core Verification', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home - Unified Display & Touch Diagnostics/);

    // Verify presence of Medical Bounce Neutralizer banner
    const routingBanner = page.locator('#ymyl-routing-banner');
    await expect(routingBanner).toBeVisible();
    await expect(routingBanner).toContainText('Looking for Medical or Toxicology Screening?');
  });

  test('should render the semantic disambiguation glossary', async ({ page }) => {
    await page.goto('/screen-test-meaning');
    await expect(page).toHaveTitle(/What is a Screen Test?/);
    await expect(page.locator('h1')).toContainText('WHAT IS A "SCREEN TEST"?');

    // Verify sections exist
    await expect(page.locator('#tech-heading')).toBeVisible();
    await expect(page.locator('#medical-heading')).toBeVisible();
    await expect(page.locator('#acting-heading')).toBeVisible();
  });
});
