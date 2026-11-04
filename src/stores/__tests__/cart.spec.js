import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore, FREE_SHIPPING_FROM, COURIER_FEE } from '@/stores/cart'
import { productById } from '@/data/products'

const GUITAR = 'ember-lp' // above the free-shipping threshold on its own
const PICKS = 'pick-sampler' // cheap enough to stay below it

describe('cart store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds products and merges repeated adds into one line', () => {
    const cart = useCartStore()
    cart.add(PICKS)
    cart.add(PICKS, 2)

    expect(cart.items).toEqual([{ id: PICKS, qty: 3 }])
    expect(cart.totalItems).toBe(3)
    expect(cart.subtotal).toBe(productById(PICKS).price * 3)
  })

  it('never lets a line go above 20 pieces', () => {
    const cart = useCartStore()
    cart.add(PICKS, 50)
    expect(cart.qtyOf(PICKS)).toBe(20)

    cart.add(PICKS, 5)
    expect(cart.qtyOf(PICKS)).toBe(20)

    cart.setQty(PICKS, 99)
    expect(cart.qtyOf(PICKS)).toBe(20)
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
    const expectedSubtotal = productById(PICKS).price * 2

    const order = cart.placeOrder({
      customer: { name: 'Test Buyer', email: 'buyer@example.com' },
      delivery: 'courier',
      payment: 'cod',
      comment: '',
    })

    expect(order.id).toMatch(/^BL-/)
    expect(order.items).toEqual([{ id: PICKS, qty: 2, price: productById(PICKS).price }])
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

  it('drops unknown products and empty lines when restoring a saved cart', () => {
    localStorage.setItem(
      'backline:cart',
      JSON.stringify([
        { id: PICKS, qty: 1 },
        { id: 'discontinued-item', qty: 2 },
        { id: GUITAR, qty: 0 },
      ]),
    )
    expect(useCartStore().items).toEqual([{ id: PICKS, qty: 1 }])
  })
})
