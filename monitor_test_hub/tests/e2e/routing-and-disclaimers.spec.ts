import { test, expect } from '@playwright/test';

test.describe('Monitor Test Hub Core Verification', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Free Online Monitor Test/);

    // Verify presence of Medical Bounce Neutralizer banner
    const routingBanner = page.locator('#ymyl-routing-banner');
    await expect(routingBanner).toBeVisible();
    await expect(routingBanner).toContainText('Looking for Medical or Toxicology Screening?');
  });

  test('should render the semantic disambiguation glossary', async ({ page }) => {
    await page.goto('/screen-test-meaning');
    await expect(page).toHaveTitle(/Display & Diagnostic Screen Test Glossary/);
    await expect(page.locator('main h1')).toContainText('Display Diagnostics & Semantic Glossary');

    // Verify sections exist
    await expect(page.locator('#hardware-terms')).toBeVisible();
    await expect(page.locator('#clinical-medical')).toBeVisible();
    await expect(page.locator('#cinema-auditions')).toBeVisible();
  });
});
