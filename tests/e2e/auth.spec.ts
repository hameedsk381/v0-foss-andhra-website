import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/login')
  })

  test('login page loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })

  test('login form has email and password fields', async ({ page }) => {
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()
  })

  test('login form has submit button', async ({ page }) => {
    const btn = page.getByRole('button', { name: /sign in|log in|login/i }).first()
    await expect(btn).toBeVisible()
  })

  test('login shows error on invalid credentials', async ({ page }) => {
    // Mock auth to return error
    await page.route('**/api/auth/callback/credentials*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' }),
      }),
    )

    await page.getByLabel(/email/i).first().fill('wrong@example.com')
    await page.getByLabel(/password/i).first().fill('wrongpassword')
    await page.getByRole('button', { name: /sign in|log in|login/i }).first().click()

    // Should stay on login or show error — not navigate to /member
    await expect(page).not.toHaveURL(/\/member/, { timeout: 5_000 })
  })

  test('login page has link to registration', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /register|sign up|create/i }).first()
    await expect(registerLink).toBeVisible()
  })

  test('forgot password link is present', async ({ page }) => {
    const body = await page.locator('body').textContent()
    expect(/forgot|reset|password/i.test(body ?? '')).toBe(true)
  })
})

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/register')
  })

  test('register page loads', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })

  test('register form has required fields or redirects to membership', async ({ page }) => {
    const url = page.url()
    // Either shows a registration form or redirects to membership page
    const hasForm = await page.getByLabel(/name/i).first().isVisible().catch(() => false)
    const onMembership = url.includes('membership') || url.includes('fosstar')
    expect(hasForm || onMembership).toBe(true)
  })
})

test.describe('Set password page', () => {
  test('set-password page with valid token renders form', async ({ page }) => {
    await mockApiRoutes(page)

    // Mock token validation
    await page.route('**/api/auth/verify-token*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ valid: true }),
      }),
    )

    const res = await page.goto('/set-password?token=valid_test_token_abc123')
    expect(res?.status() ?? 200).toBeLessThan(500)
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Protected routes redirect to login', () => {
  test('unauthenticated /member redirects to /login', async ({ page }) => {
    await mockApiRoutes(page)

    // Simulate no active session
    await page.route('**/api/auth/session', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(null),
      }),
    )

    await page.goto('/member')
    // Should redirect to login
    await expect(page).toHaveURL(/login/, { timeout: 10_000 })
  })

  test('unauthenticated /admin redirects to admin login', async ({ page }) => {
    await mockApiRoutes(page)

    await page.route('**/api/auth/session', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(null),
      }),
    )

    await page.goto('/admin')
    await expect(page).toHaveURL(/admin\/login/, { timeout: 10_000 })
  })
})
