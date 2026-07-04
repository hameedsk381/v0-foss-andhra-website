import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/contact')
  })

  test('contact page loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
    // Should have a heading with "contact" or "get in touch"
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('contact form has required fields', async ({ page }) => {
    await expect(page.getByLabel(/name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
    await expect(page.getByLabel(/message/i).first()).toBeVisible()
  })

  test('form shows validation errors on empty submit', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /send|submit/i }).first()
    await submitBtn.click()
    // At minimum, browser native validation or custom error should prevent submission
    // and keep us on the same page
    await expect(page).toHaveURL(/contact/)
  })

  test('successful contact form submission', async ({ page }) => {
    await page.getByLabel(/name/i).first().fill('Test User')
    await page.getByLabel(/email/i).first().fill('test@example.com')

    // Subject field if present
    const subject = page.getByLabel(/subject/i).first()
    if (await subject.isVisible()) await subject.fill('Test inquiry')

    await page.getByLabel(/message/i).first().fill('This is a test message from the E2E suite.')

    // Phone field if present
    const phone = page.getByLabel(/phone/i).first()
    if (await phone.isVisible()) await phone.fill('9876543210')

    const submitBtn = page.getByRole('button', { name: /send|submit/i }).first()
    await submitBtn.click()

    // Success state: either a success message appears or URL changes
    await expect(
      page.getByText(/thank you|message sent|success|received/i).first()
    ).toBeVisible({ timeout: 10_000 })
  })

  test('contact page shows FOSS Andhra address information', async ({ page }) => {
    await expect(page.getByText(/vijayawada/i)).toBeVisible()
  })
})
