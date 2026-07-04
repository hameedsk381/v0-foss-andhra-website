import type { Page } from '@playwright/test'

/** Mock all DB-dependent API routes so tests run without a live database. */
export async function mockApiRoutes(page: Page) {
  // Blog listing
  await page.route('**/api/blog*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        posts: [
          {
            id: '1', slug: 'intro-to-foss', title: 'Introduction to FOSS',
            excerpt: 'Learn about free and open source software.',
            author: 'FOSS Andhra', publishedAt: '2024-01-15T00:00:00Z',
            category: 'Education', tags: ['foss', 'linux'],
          },
          {
            id: '2', slug: 'foss-in-education', title: 'FOSS in Education',
            excerpt: 'How open source transforms classrooms.',
            author: 'FOSS Andhra', publishedAt: '2024-02-10T00:00:00Z',
            category: 'Education', tags: ['education'],
          },
        ],
        total: 2, page: 1, pageSize: 10,
      }),
    }),
  )

  // Events listing
  await page.route('**/api/events*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        events: [
          {
            id: 'evt1', title: 'FOSS Workshop 2024', date: '2024-12-01T09:00:00Z',
            location: 'Vijayawada', type: 'Workshop', status: 'upcoming',
            description: 'Annual FOSS workshop for students.',
          },
        ],
        total: 1,
      }),
    }),
  )

  // Programs listing
  await page.route('**/api/programs*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ programs: [] }),
    }),
  )

  // Gallery
  await page.route('**/api/gallery*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0 }),
    }),
  )

  // Contact form submission
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Message received.' }),
    }),
  )

  // Session (unauthenticated by default)
  await page.route('**/api/auth/session', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(null),
    }),
  )

  // Newsletter subscription
  await page.route('**/api/newsletter*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    }),
  )

  // FAQ / static content
  await page.route('**/api/faq*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ faqs: [] }),
    }),
  )

  // Push subscription
  await page.route('**/api/push*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  )

  // Notifications
  await page.route('**/api/notifications*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"notifications":[]}' }),
  )
}

/** Mock a successful donation creation. */
export async function mockDonationCreate(page: Page, donationId = 'don_test_123') {
  await page.route('**/api/donation*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, donationId }),
    }),
  )
}

/** Mock a successful Razorpay order creation (server action response). */
export async function mockPaymentOrder(page: Page) {
  await page.route('**/api/payment*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        order: { id: 'order_test', amount: 30000, currency: 'INR' },
        keyId: 'rzp_test_key',
        amount: 300,
        paymentPurpose: 'membership',
      }),
    }),
  )
}
