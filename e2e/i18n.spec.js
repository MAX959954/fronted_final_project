import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'

const germanDescriptions = JSON.parse(readFileSync('public/api/descriptions/de.json', 'utf8'))
const isGermanChunk = (url) => url.includes('/assets/de-') && url.endsWith('.js')

// Desktop has a language dropdown in the header; phones pick the language inside the menu sheet.
async function chooseGerman(page, isMobile) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.getByRole('group', { name: 'Language' }).getByRole('button', { name: 'Deutsch' }).click()
  } else {
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByRole('menuitemradio', { name: 'Deutsch' }).click()
  }
}

test('a language is downloaded only when chosen, and the choice survives a reload', async ({ page, isMobile }) => {
  const requested = []
  page.on('request', (request) => requested.push(request.url()))

  await page.goto('product/surf-s')
  await expect(page.getByRole('heading', { level: 1, name: 'Surf S-Type' })).toBeVisible()
  // English is the visitor's language here, so no other dictionary has been fetched.
  expect(requested.filter(isGermanChunk)).toEqual([])

  const germanChunk = page.waitForResponse((response) => isGermanChunk(response.url()))
  await chooseGerman(page, isMobile)
  await germanChunk

  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.getByRole('button', { name: 'In den Warenkorb' }).first()).toBeVisible()
  // The product description comes from the German descriptions endpoint.
  await expect(page.getByText(germanDescriptions['surf-s'])).toBeVisible()

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.getByText(germanDescriptions['surf-s'])).toBeVisible()
})
