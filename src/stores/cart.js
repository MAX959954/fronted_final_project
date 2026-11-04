import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { productById } from '@/data/products'
import { load, save } from './persist'

export const FREE_SHIPPING_FROM = 300
export const COURIER_FEE = 15
const MAX_QTY = 20

export const useCartStore = defineStore('cart', () => {
  // Stored as { id, qty } only, so prices always come from the catalogue.
  const items = ref(load('cart', []).filter((i) => productById(i.id) && i.qty > 0))

  watch(items, (value) => save('cart', value), { deep: true })

  const lines = computed(() =>
    items.value.map((i) => {
      const product = productById(i.id)
      return { ...i, product, total: product.price * i.qty }
    }),
  )

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))
  const subtotal = computed(() => lines.value.reduce((sum, l) => sum + l.total, 0))
  const leftForFreeShipping = computed(() => Math.max(0, FREE_SHIPPING_FROM - subtotal.value))

  function shipping(method = 'courier') {
    if (method === 'pickup' || subtotal.value === 0 || subtotal.value >= FREE_SHIPPING_FROM) return 0
    return COURIER_FEE
  }

  const qtyOf = (id) => items.value.find((i) => i.id === id)?.qty || 0

  function add(id, qty = 1) {
    const line = items.value.find((i) => i.id === id)
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty)
    else items.value.push({ id, qty: Math.min(MAX_QTY, qty) })
  }

  function setQty(id, qty) {
    if (qty <= 0) return remove(id)
    const line = items.value.find((i) => i.id === id)
    if (line) line.qty = Math.min(MAX_QTY, qty)
  }

  function remove(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  // No payment backend: the order is kept in this browser and the cart is emptied.
  function placeOrder({ customer, delivery, payment, comment }) {
    const order = {
      id: `BL-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: lines.value.map((l) => ({ id: l.id, qty: l.qty, price: l.product.price })),
      customer,
      delivery,
      payment,
      comment,
      subtotal: subtotal.value,
      shipping: shipping(delivery),
    }
    order.total = order.subtotal + order.shipping
    save('orders', [order, ...load('orders', [])].slice(0, 20))
    clear()
    return order
  }

  const findOrder = (id) => load('orders', []).find((o) => o.id === id)

  return {
    items,
    lines,
    totalItems,
    subtotal,
    leftForFreeShipping,
    shipping,
    qtyOf,
    add,
    setQty,
    remove,
    clear,
    placeOrder,
    findOrder,
  }
})
