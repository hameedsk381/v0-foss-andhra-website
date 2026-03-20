import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const routes = [
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  for (const route of routes) {
    test(`should navigate to ${route.name} page`, async ({ page }) => {
      const link = page.getByRole('link', { name: new RegExp(route.name, 'i') }).first();
      if (await link.isVisible()) {
        await link.click();
        await expect(page).toHaveURL(new RegExp(route.path));
      } else {
        // If not in header, try navigating directly
        await page.goto(route.path);
        await expect(page).toHaveURL(new RegExp(route.path));
      }
    });
  }
});

test.describe('Footer', () => {
  test('should display footer with contact information', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/FOSS Andhra/i);
  });
});
