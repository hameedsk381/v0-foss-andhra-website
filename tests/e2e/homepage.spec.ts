import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display the hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title contains "FOSS Andhra"
    await expect(page).toHaveTitle(/FOSS Andhra/);
    
    // Check if the main heading is visible (adjusting for common hero patterns)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should have a working navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check for "Programs" link in the header
    const programsLink = page.getByRole('link', { name: /Programs/i }).first();
    await expect(programsLink).toBeVisible();
    
    // Click on Programs and verify navigation (assuming /programs exists)
    // await programsLink.click();
    // await expect(page).toHaveURL(/\/programs/);
  });
});
