import { test, expect } from '@playwright/test'

// Photos are resized to WebP at build time; the browser should pick a variant from srcset and decode it.
test('catalogue photos load as responsive WebP', async ({ page }) => {
  await page.goto('catalog')
  const first = page.locator('.card img').first()
  await expect(first).toBeVisible()
  await expect(first).toHaveJSProperty('complete', true)

  const { currentSrc, naturalWidth, srcset } = await first.evaluate((img) => ({
    currentSrc: img.currentSrc,
    naturalWidth: img.naturalWidth,
    srcset: img.srcset,
  }))

  expect(srcset).toContain('480w')
  expect(currentSrc).toMatch(/\.webp$/)
  expect(naturalWidth).toBeGreaterThan(0)
  // A card is at most a few hundred CSS pixels wide, so the 1400w original must not be chosen.
  expect(naturalWidth).toBeLessThanOrEqual(960)
})
