import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore, FREE_SHIPPING_FROM, COURIER_FEE, MAX_QTY } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'
import { servePublicApi } from '@/test-utils/serve-public-api'

const GUITAR = 'ember-lp' // above the free-shipping threshold on its own
const PICKS = 'pick-sampler' // cheap enough to stay below it

let catalog
const priceOf = (id) => catalog.productById(id).price

describe('cart store', () => {
  beforeEach(async () => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.stubGlobal('fetch', servePublicApi())
    catalog = useCatalogStore()
    await catalog.load()
  })

  afterEach(() => vi.unstubAllGlobals())

  it('adds products and merges repeated adds into one line', () => {
    const cart = useCartStore()
    cart.add(PICKS)
    cart.add(PICKS, 2)

    expect(cart.items).toEqual([{ id: PICKS, qty: 3 }])
    expect(cart.totalItems).toBe(3)
    expect(cart.subtotal).toBe(priceOf(PICKS) * 3)
    expect(cart.lines[0].product.name).toBe('Pick Sampler ×26')
  })

  it(`never lets a line go above ${MAX_QTY} pieces`, () => {
    const cart = useCartStore()
    cart.add(PICKS, 50)
    expect(cart.qtyOf(PICKS)).toBe(MAX_QTY)

    cart.add(PICKS, 5)
    expect(cart.qtyOf(PICKS)).toBe(MAX_QTY)

    cart.setQty(PICKS, 99)
    expect(cart.qtyOf(PICKS)).toBe(MAX_QTY)
  })

  it('removes the line when quantity is set to zero', () => {
    const cart = useCartStore()
    cart.add(PICKS, 2)
    cart.setQty(PICKS, 0)
    expect(cart.items).toEqual([])
  })

  describe('shipping', () => {
    it('is free for an empty cart', () => {
      expect(useCartStore().shipping('courier')).toBe(0)
    })

    it('charges the courier fee below the threshold', () => {
      const cart = useCartStore()
      cart.add(PICKS)
      expect(cart.subtotal).toBeLessThan(FREE_SHIPPING_FROM)
      expect(cart.shipping('courier')).toBe(COURIER_FEE)
      expect(cart.leftForFreeShipping).toBe(FREE_SHIPPING_FROM - cart.subtotal)
    })

    it('is free from the threshold up', () => {
      const cart = useCartStore()
      cart.add(GUITAR)
      expect(cart.subtotal).toBeGreaterThanOrEqual(FREE_SHIPPING_FROM)
      expect(cart.shipping('courier')).toBe(0)
      expect(cart.leftForFreeShipping).toBe(0)
    })

    it('is always free for pickup', () => {
      const cart = useCartStore()
      cart.add(PICKS)
      expect(cart.shipping('pickup')).toBe(0)
    })
  })

  it('places an order: totals are frozen, the cart is emptied and the order can be found again', () => {
    const cart = useCartStore()
    cart.add(PICKS, 2)
    const expectedSubtotal = priceOf(PICKS) * 2

    const order = cart.placeOrder({
      customer: { name: 'Test Buyer', email: 'buyer@example.com' },
      delivery: 'courier',
      payment: 'cod',
      comment: '',
    })

    expect(order.id).toMatch(/^BL-/)
    expect(order.items).toEqual([{ id: PICKS, qty: 2, price: priceOf(PICKS) }])
    expect(order.subtotal).toBe(expectedSubtotal)
    expect(order.shipping).toBe(COURIER_FEE)
    expect(order.total).toBe(expectedSubtotal + COURIER_FEE)
    expect(cart.items).toEqual([])
    expect(cart.findOrder(order.id)).toEqual(order)
  })

  it('persists the cart to localStorage', async () => {
    const cart = useCartStore()
    cart.add(PICKS, 4)
    await nextTick()
    expect(JSON.parse(localStorage.getItem('backline:cart'))).toEqual([{ id: PICKS, qty: 4 }])
  })

  it('ignores malformed saved data', () => {
    localStorage.setItem('backline:cart', JSON.stringify([{ id: PICKS, qty: 'two' }, null, 'junk', { qty: 1 }]))
    expect(useCartStore().items).toEqual([])

    setActivePinia(createPinia())
    localStorage.setItem('backline:cart', '{not json')
    expect(useCartStore().items).toEqual([])
  })
})

describe('cart store before the catalogue arrives', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  afterEach(() => vi.unstubAllGlobals())

  it('keeps saved lines while loading, then drops the ones the catalogue no longer has', async () => {
    localStorage.setItem(
      'backline:cart',
      JSON.stringify([
        { id: PICKS, qty: 1 },
        { id: 'discontinued-item', qty: 2 },
      ]),
    )
    vi.stubGlobal('fetch', servePublicApi())
    const cart = useCartStore()

    // Nothing is thrown away just because the catalogue is still on its way.
    expect(cart.items).toHaveLength(2)
    expect(cart.lines).toEqual([])

    await useCatalogStore().load()
    expect(cart.items).toEqual([{ id: PICKS, qty: 1 }])
    expect(cart.lines).toHaveLength(1)
  })
})
