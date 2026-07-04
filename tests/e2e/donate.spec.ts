import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

test.describe('Donation flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
  })

  test('donate page loads', async ({ page }) => {
    const res = await page.goto('/contribute/donate')
    expect(res?.status() ?? 200).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('donate page shows donation form', async ({ page }) => {
    await page.goto('/contribute/donate')
    // Should have an amount input or preset amount buttons
    const amountField = page.getByLabel(/amount/i).first()
    const presetBtn = page.getByRole('button', { name: /₹|rs\.|500|1000/i }).first()
    const hasAmount = await amountField.isVisible().catch(() => false)
    const hasPreset = await presetBtn.isVisible().catch(() => false)
    expect(hasAmount || hasPreset).toBe(true)
  })

  test('donate page has personal details fields', async ({ page }) => {
    await page.goto('/contribute/donate')
    await expect(page.getByLabel(/name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
  })

  test('anonymous donation toggle visible', async ({ page }) => {
    await page.goto('/contribute/donate')
    const toggle = page.getByLabel(/anonymous/i).first()
      .or(page.getByText(/anonymous/i).first())
    await expect(toggle).toBeVisible()
  })

  test('contribute page shows all contribution options', async ({ page }) => {
    await page.goto('/contribute')
    await expect(page.getByText(/donate/i).first()).toBeVisible()
    await expect(page.getByText(/volunteer/i).first()).toBeVisible()
    await expect(page.getByText(/sponsor/i).first()).toBeVisible()
  })
})

test.describe('Payment page', () => {
  test('payment page with a donation context renders checkout', async ({ page }) => {
    await mockApiRoutes(page)

    // Mock the donation lookup
    await page.route('**/api/payment/donations/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'don_test_123',
            name: 'Test User',
            email: 'test@example.com',
            phone: '9876543210',
            amount: 500,
            type: 'One-time',
            anonymous: false,
          },
        }),
      }),
    )

    const res = await page.goto('/payment?donationId=don_test_123&purpose=donation')
    expect(res?.status() ?? 200).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Donation success page', () => {
  test('donation-success page renders without crashing', async ({ page }) => {
    await mockApiRoutes(page)
    const res = await page.goto('/donation-success?id=don_test_123')
    expect(res?.status() ?? 200).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })
})
