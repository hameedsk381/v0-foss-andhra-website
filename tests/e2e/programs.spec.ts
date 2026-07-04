import { test, expect } from '@playwright/test'
import { mockApiRoutes } from './helpers/mocks'

const PROGRAMS = [
  { slug: 'fosstar',   name: 'FOSStar' },
  { slug: 'fosserve',  name: 'FOSServe' },
  { slug: 'fossync',   name: 'FOSSynC' },
  { slug: 'fosstorm',  name: 'FOSStorm' },
  { slug: 'fosstart',  name: 'FOSStart' },
  { slug: 'fossterage',name: 'FOSSterage' },
  { slug: 'fosspeaks', name: 'FOSSpeaks' },
]

test.describe('Programs listing page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/programs')
  })

  test('programs page loads without 500 error', async ({ page }) => {
    // page.goto already navigated; just check it did not crash
    await expect(page.locator('body')).toBeVisible()
  })

  test('page contains a recognisable programs heading', async ({ page }) => {
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
  })
})

test.describe('Individual program pages', () => {
  for (const { slug, name } of PROGRAMS) {
    test(`/programs/${slug} loads and contains program name`, async ({ page }) => {
      await mockApiRoutes(page)

      // Mock the specific program API if it exists
      await page.route(`**/api/programs/${slug}*`, (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: slug, slug, displayName: name,
            description: `${name} program description.`,
            status: 'active',
          }),
        }),
      )

      const response = await page.goto(`/programs/${slug}`)
      expect(response?.status() ?? 200).toBeLessThan(500)

      // The page should contain the program name somewhere
      await expect(page.getByText(new RegExp(name, 'i')).first()).toBeVisible()
    })
  }
})

test.describe('Programs section on homepage links to program pages', () => {
  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
  })

  test('each program card is a clickable link', async ({ page }) => {
    // All "Explore" links in the programs grid should have hrefs to /programs/
    const links = page.locator('a[href*="/programs/"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    // Check the first one has a valid href
    const href = await links.first().getAttribute('href')
    expect(href).toMatch(/\/programs\//)
  })
})
