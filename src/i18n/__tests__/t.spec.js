import { describe, it, expect, beforeEach, vi } from 'vitest'

// A deliberately incomplete German dictionary, so the English fallback can be observed.
vi.mock('@/i18n/locales/de', () => ({ default: { nav: { cart: 'Warenkorb' } } }))

const { t, setLocale, locale } = await import('@/i18n')

describe('t()', () => {
  beforeEach(() => setLocale('en'))

  it('reads nested keys', () => {
    expect(t('nav.cart')).toBe('Cart')
  })

  it('substitutes {params} and leaves unknown ones untouched', () => {
    expect(t('toast.added', { name: 'Surf S-Type' })).toBe('“Surf S-Type” is in your cart')
    expect(t('toast.added', {})).toBe('“{name}” is in your cart')
  })

  it('falls back to English when the current locale lacks a key', () => {
    setLocale('de')
    expect(t('nav.cart')).toBe('Warenkorb')
    expect(t('nav.catalog')).toBe('Catalogue')
  })

  it('returns the key itself when no locale has it', () => {
    expect(t('does.not.exist')).toBe('does.not.exist')
  })

  it('ignores unknown locale codes', () => {
    setLocale('xx')
    expect(locale.value).toBe('en')
  })
})
