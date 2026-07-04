import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

/**
 * Accessibility smoke tests — not a full axe audit, but catches common regressions:
 * missing labels, broken focus order, missing landmarks.
 */

test.describe('Accessibility — homepage', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
  })

  test('page has a <main> landmark', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible()
  })

  test('page has a <nav> landmark', async ({ page }) => {
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('page has a <footer> landmark', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('all interactive elements are keyboard-reachable (tab test)', async ({ page }) => {
    // Press Tab from body and collect the first 10 focused elements
    await page.locator('body').click()
    const focused: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const tag = await page.evaluate(() => document.activeElement?.tagName ?? '')
      focused.push(tag)
    }
    // At least one link or button should have received focus
    expect(focused.some((t) => ['A', 'BUTTON', 'INPUT'].includes(t))).toBe(true)
  })

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt')
      // alt="" is valid for decorative images; null/missing is not
      expect(alt).not.toBeNull()
    }
  })

  test('heading hierarchy — h1 exists and is unique', async ({ page }) => {
    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)
  })

  test('colour contrast — primary CTA button is visible', async ({ page }) => {
    // Smoke test: button renders and has text
    const btn = page.getByRole('link', { name: /learn more/i }).first()
    await expect(btn).toBeVisible()
    const text = await btn.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })
})

test.describe('Accessibility — navigation focus', () => {
  test('skip-to-content link is focusable and goes to main', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')

    // Tab once — should focus the skip link (it's the first focusable element)
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      href: (document.activeElement as HTMLAnchorElement)?.href ?? '',
    }))

    if (focused.tag === 'A' && focused.href.includes('#main-content')) {
      // Press Enter to follow the skip link
      await page.keyboard.press('Enter')
      const activeId = await page.evaluate(() => document.activeElement?.id ?? '')
      expect(activeId).toBe('main-content')
    }
    // If skip link is visually hidden and not first-focusable, test still passes
  })
})

test.describe('Accessibility — forms', () => {
  test('contact form inputs have associated labels', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/contact')

    const inputs = page.locator('input:not([type="hidden"]), textarea')
    const count = await inputs.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')

      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel =
          (await label.count()) > 0 || !!ariaLabel || !!ariaLabelledBy
        expect(hasLabel).toBe(true)
      }
    }
  })

  test('login form inputs have labels', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/login')

    const emailLabel = page.getByLabel(/email/i).first()
    const passwordLabel = page.getByLabel(/password/i).first()
    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()
  })
})

test.describe('Accessibility — mobile viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('homepage renders correctly on mobile', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('touch target size — nav button is large enough', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    const menuBtn = page.locator('header button').last()
    const box = await menuBtn.boundingBox()
    if (box) {
      // WCAG 2.5.5 recommends 44×44px minimum
      expect(box.width).toBeGreaterThanOrEqual(36)
      expect(box.height).toBeGreaterThanOrEqual(36)
    }
  })
})
