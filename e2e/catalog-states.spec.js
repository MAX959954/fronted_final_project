import { test, expect } from '@playwright/test'

const CATALOGUE = '**/api/products.json'

test('shows skeleton cards while the catalogue is loading', async ({ page }) => {
  let release
  const held = new Promise((resolve) => (release = resolve))
  await page.route(CATALOGUE, async (route) => {
    await held
    await route.continue()
  })

  await page.goto('catalog')
  const busy = page.locator('[aria-busy="true"]')
  await expect(busy).toBeVisible()
  // The toast region is a status too, so pick the loading announcement by its text.
  await expect(page.getByRole('status').filter({ hasText: 'Loading…' })).toBeAttached()
  await expect(page.locator('.card-skeleton')).toHaveCount(8)

  release()
  await expect(page.locator('.card').first()).toBeVisible()
  await expect(busy).toHaveCount(0)
})

test('shows an error with a working retry when the catalogue cannot be loaded', async ({ page }) => {
  let fail = true
  await page.route(CATALOGUE, (route) => (fail ? route.fulfill({ status: 500, body: 'down' }) : route.continue()))

  await page.goto('catalog')
  await expect(page.getByRole('alert')).toContainText('could not be loaded')
  await expect(page.locator('.card')).toHaveCount(0)

  fail = false
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Surf S-Type' }).first()).toBeVisible()
})

test('a product page opened directly waits for the catalogue instead of saying it does not exist', async ({ page }) => {
  let release
  const held = new Promise((resolve) => (release = resolve))
  await page.route(CATALOGUE, async (route) => {
    await held
    await route.continue()
  })

  await page.goto('product/surf-s')
  await expect(page.locator('[aria-busy="true"]')).toBeVisible()
  await expect(page.getByText('This product does not exist')).toHaveCount(0)

  release()
  await expect(page.getByRole('heading', { level: 1, name: 'Surf S-Type' })).toBeVisible()
})
