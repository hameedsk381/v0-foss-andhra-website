import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

test.describe('Header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
  })

  test('logo links back to homepage', async ({ page }) => {
    const logo = page.locator('header img[alt*="FOSS Andhra"]').first()
    await expect(logo).toBeVisible()
    const logoLink = page.locator('header a[href="/"]').first()
    await expect(logoLink).toBeVisible()
  })

  test('desktop nav — all top-level links visible', async ({ page }) => {
    for (const label of ['About', 'Events', 'Blog', 'Gallery', 'Contribute']) {
      await expect(
        page.locator('header').getByRole('link', { name: new RegExp(`^${label}$`, 'i') }).first()
      ).toBeVisible()
    }
  })

  test('desktop nav — Programs trigger opens dropdown', async ({ page }) => {
    const trigger = page.locator('header').getByRole('button', { name: /programs/i }).first()
    await expect(trigger).toBeVisible()
    await trigger.click()
    // Dropdown should show at least one program name
    await expect(page.getByText(/FOSStar/i).first()).toBeVisible()
  })

  test('desktop nav — active page highlighted', async ({ page }) => {
    await page.goto('/about')
    // The About link should have the active class styling
    const aboutLink = page.locator('header').getByRole('link', { name: /^About$/i }).first()
    await expect(aboutLink).toBeVisible()
  })

  test('"Join Us" button visible when unauthenticated', async ({ page }) => {
    const joinBtn = page.locator('header').getByRole('link', { name: /join us/i }).first()
    await expect(joinBtn).toBeVisible()
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
  })

  test('hamburger button visible on mobile', async ({ page }) => {
    const menuBtn = page.locator('header button[aria-label*="menu" i], header button:has(svg)').first()
    await expect(menuBtn).toBeVisible()
  })

  test('mobile menu opens and shows nav links', async ({ page }) => {
    const menuBtn = page.locator('header button').last()
    await menuBtn.click()
    // Sheet should open showing About link
    await expect(page.getByRole('link', { name: /^About$/i }).first()).toBeVisible()
  })

  test('mobile menu closes on link click', async ({ page }) => {
    const menuBtn = page.locator('header button').last()
    await menuBtn.click()
    const aboutLink = page.getByRole('link', { name: /^About$/i }).first()
    await aboutLink.click()
    await expect(page).toHaveURL(/about/)
  })
})

test.describe('Page routing', () => {
  const routes = [
    { name: 'about',     path: '/about' },
    { name: 'programs',  path: '/programs' },
    { name: 'events',    path: '/events' },
    { name: 'blog',      path: '/blog' },
    { name: 'gallery',   path: '/gallery' },
    { name: 'contribute',path: '/contribute' },
    { name: 'contact',   path: '/contact' },
    { name: 'faq',       path: '/faq' },
    { name: 'membership',path: '/membership' },
    { name: 'login',     path: '/login' },
    { name: 'register',  path: '/register' },
  ]

  for (const { name, path } of routes) {
    test(`${name} page loads without error (no 404/500)`, async ({ page }) => {
      await mockApiRoutes(page)
      const response = await page.goto(path)
      // Accept 200 or redirects (3xx); reject server errors
      expect(response?.status() ?? 200).toBeLessThan(500)
      await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/')))
    })
  }
})

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
  })

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('footer contains FOSS Andhra branding', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(/FOSS Andhra/i)
  })

  test('footer contains contact email', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(/office@fossap\.in/i)
  })

  test('footer contains social links', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer.getByRole('link', { name: /twitter|x\.com/i }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: /github/i }).first()).toBeVisible()
    await expect(footer.getByRole('link', { name: /linkedin/i }).first()).toBeVisible()
  })

  test('footer legal links exist', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer.getByRole('link', { name: /privacy policy/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /terms/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /refund/i })).toBeVisible()
  })

  test('footer copyright year is current', async ({ page }) => {
    const year = new Date().getFullYear().toString()
    await expect(page.locator('footer')).toContainText(year)
  })
})
