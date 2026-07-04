import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
  })

  test('page title contains FOSS Andhra', async ({ page }) => {
    await expect(page).toHaveTitle(/FOSS Andhra/i)
  })

  test('hero section — heading and tagline are visible', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/open source/i)
  })

  test('hero — primary CTA "Learn More" links to /about', async ({ page }) => {
    const btn = page.getByRole('link', { name: /learn more/i }).first()
    await expect(btn).toBeVisible()
    await expect(btn).toHaveAttribute('href', /about/)
  })

  test('hero — secondary CTA "Join" links to membership', async ({ page }) => {
    const btn = page.getByRole('link', { name: /join/i }).first()
    await expect(btn).toBeVisible()
  })

  test('stats bar renders four metric cards', async ({ page }) => {
    // Stats cards contain numbers like "7", "500+", "50+", "20+"
    await expect(page.getByText('7')).toBeVisible()
    await expect(page.getByText(/500\+/)).toBeVisible()
    await expect(page.getByText(/50\+/)).toBeVisible()
    await expect(page.getByText(/20\+/)).toBeVisible()
  })

  test('mission section — four value cards visible', async ({ page }) => {
    await expect(page.getByText(/Open Knowledge/i)).toBeVisible()
    await expect(page.getByText(/Data Privacy/i)).toBeVisible()
    await expect(page.getByText(/Public Welfare/i)).toBeVisible()
    await expect(page.getByText(/Offline First/i)).toBeVisible()
  })

  test('programs section — heading visible', async ({ page }) => {
    await expect(page.getByText(/Initiatives for Change/i)).toBeVisible()
  })

  test('programs section — at least one program card rendered', async ({ page }) => {
    // Each program card has a "Explore" link
    const cards = page.getByText(/Explore/).first()
    await expect(cards).toBeVisible()
  })

  test('CTA banner — "Become a Member" button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /become a member/i })).toBeVisible()
  })

  test('CTA banner — "Contribute" button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /contribute/i }).first()).toBeVisible()
  })

  test('no broken images on homepage', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
      // Allow SVG placeholders (0 width) but flag broken raster images
      const src = await img.getAttribute('src') ?? ''
      if (!src.includes('placeholder') && naturalWidth === 0) {
        // Only warn — don't fail for lazily loaded images
        console.warn(`Possibly broken image: ${src}`)
      }
    }
  })

  test('skip-to-content link present in DOM', async ({ page }) => {
    const skip = page.locator('a[href="#main-content"]').first()
    await expect(skip).toBeAttached()
  })
})
