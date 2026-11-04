import { describe, it, expect, beforeEach, vi } from 'vitest'

// A deliberately incomplete German dictionary, so the English fallback can be observed.
vi.mock('@/i18n/locales/de', () => ({ default: { nav: { cart: 'Warenkorb' } } }))

const { t, tm, setLocale, locale } = await import('@/i18n')

describe('t()', () => {
  beforeEach(() => setLocale('en'))

  it('reads nested keys', () => {
    expect(t('nav.cart')).toBe('Cart')
  })

  it('substitutes {params} and leaves unknown ones untouched', () => {
    expect(t('toast.added', { name: 'Surf S-Type' })).toBe('“Surf S-Type” is in your cart')
    expect(t('toast.added', {})).toBe('“{name}” is in your cart')
  })

  it('falls back to English when the current locale lacks a key', async () => {
    await setLocale('de')
    expect(t('nav.cart')).toBe('Warenkorb')
    expect(t('nav.catalog')).toBe('Catalogue')
  })

  it('returns the key itself when no locale has it, or when the entry is not a string', () => {
    expect(t('does.not.exist')).toBe('does.not.exist')
    expect(t('faq.items')).toBe('faq.items')
  })

  it('returns structured entries through tm()', () => {
    const items = tm('faq.items')
    expect(Array.isArray(items)).toBe(true)
    expect(items[0]).toEqual({ q: expect.any(String), a: expect.any(String) })
  })

  it('ignores unknown locale codes', async () => {
    await setLocale('xx')
    expect(locale.value).toBe('en')
  })
})

describe('setLocale()', () => {
  it('downloads a dictionary on demand and switches only once it is in', async () => {
    await setLocale('en')
    const switching = setLocale('fr')
    // Until the French chunk has arrived the page keeps speaking English.
    expect(locale.value).toBe('en')
    await switching
    expect(locale.value).toBe('fr')
    expect(t('nav.cart')).toBe('Panier')
  })

  it('remembers the choice for the next visit', async () => {
    await setLocale('fr')
    await Promise.resolve() // watchEffect runs after the change
    expect(JSON.parse(localStorage.getItem('backline:locale'))).toBe('fr')
    expect(document.documentElement.lang).toBe('fr')
  })
})
