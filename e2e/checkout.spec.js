import { test, expect } from '@playwright/test'

const PRODUCT = 'Surf S-Type'
const EMAIL = 'buyer@example.com'

test('a visitor finds a guitar, buys it and sees the order confirmation', async ({ page }) => {
  // Catalogue: narrow the list with search, then open the product.
  await page.goto('catalog')
  await page.getByRole('searchbox', { name: 'Search' }).fill('surf')
  await expect(page).toHaveURL(/q=surf/)
  await page.getByRole('link', { name: PRODUCT }).first().click()

  // Product page: add it to the cart.
  await expect(page.getByRole('heading', { level: 1, name: PRODUCT })).toBeVisible()
  // Related-product cards further down have their own "Add to cart"; the product's own button comes first.
  await page.getByRole('button', { name: 'Add to cart' }).first().click()
  await expect(page.getByText(`“${PRODUCT}” is in your cart`)).toBeVisible()

  // Cart.
  await page.goto('cart')
  await expect(page.getByRole('heading', { level: 1, name: 'Cart' })).toBeVisible()
  await expect(page.getByText(PRODUCT).first()).toBeVisible()
  await page.getByRole('link', { name: 'Check out' }).click()

  // Checkout: an empty submit is rejected and focus jumps to the first broken field.
  await expect(page.getByRole('heading', { level: 1, name: 'Checkout' })).toBeVisible()
  await page.getByRole('button', { name: 'Place order' }).click()
  await expect(page.getByLabel('Full name')).toBeFocused()
  await expect(page.getByText('Please fill in this field').first()).toBeVisible()

  await page.getByLabel('Full name').fill('Test Buyer')
  await page.getByLabel('Email').fill(EMAIL)
  await page.getByLabel('Phone').fill('+49 30 1234567')
  await page.getByLabel('Country').fill('Germany')
  await page.getByLabel('City').fill('Berlin')
  await page.getByLabel('Street and number').fill('Musterstraße 1')
  await page.getByLabel('Postcode').fill('10115')
  await page.getByRole('button', { name: 'Place order' }).click()

  // Confirmation.
  await expect(page).toHaveURL(/\/order\/BL-\d+$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Order received' })).toBeVisible()
  await expect(page.getByText(EMAIL)).toBeVisible()
  await expect(page.getByText(PRODUCT)).toBeVisible()

  // The order survives a reload (it is kept in localStorage), and the cart is now empty.
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Order received' })).toBeVisible()
  await page.goto('cart')
  await expect(page.getByText('Your cart is empty.')).toBeVisible()
})
