import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

test.describe('Membership info page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/membership')
  })

  test('membership page loads without error', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })

  test('membership page shows membership types', async ({ page }) => {
    // Should show at least one of the known membership types
    const text = await page.locator('body').textContent()
    const hasMembershipContent =
      /FOSStar|annual|lifetime|student|professional/i.test(text ?? '')
    expect(hasMembershipContent).toBe(true)
  })

  test('membership page has a CTA to join', async ({ page }) => {
    const cta = page.getByRole('link', { name: /join|become|register|sign up/i }).first()
    await expect(cta).toBeVisible()
  })
})

test.describe('FOSStar program membership section', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/programs/fosstar')
  })

  test('fosstar page loads', async ({ page }) => {
    await expect(page.getByText(/FOSStar/i).first()).toBeVisible()
  })

  test('membership section exists on fosstar page', async ({ page }) => {
    const body = await page.locator('body').textContent()
    expect(/member|join|register/i.test(body ?? '')).toBe(true)
  })
})

test.describe('Membership registration form', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)

    // Mock the server action endpoint
    await page.route('**/api/member*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      }),
    )
  })

  test('membership success page renders without crashing', async ({ page }) => {
    const res = await page.goto('/membership-success?membershipId=FOSS12345678')
    expect(res?.status() ?? 200).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('membership success page shows confirmation content', async ({ page }) => {
    await page.goto('/membership-success?membershipId=FOSS12345678')
    const body = await page.locator('body').textContent()
    // Should show success message, membership ID, or welcome text
    expect(
      /welcome|success|activated|membership|FOSS/i.test(body ?? '')
    ).toBe(true)
  })
})
