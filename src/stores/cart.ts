import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { load, save } from './persist'
import { useCatalogStore } from './catalog'
import type { CartItem, CartLine, Customer, DeliveryMethod, Order, PaymentMethod } from '@/types'

export const FREE_SHIPPING_FROM = 300
export const COURIER_FEE = 15
export const MAX_QTY = 20

function isCartItem(v: unknown): v is CartItem {
  if (typeof v !== 'object' || v === null) return false
  const item = v as Partial<CartItem>
  return typeof item.id === 'string' && Number.isInteger(item.qty) && (item.qty ?? 0) > 0
}

function loadItems(): CartItem[] {
  const saved = load('cart', [])
  return Array.isArray(saved) ? saved.filter(isCartItem) : []
}

function loadOrders(): Order[] {
  const saved = load('orders', [])
  return Array.isArray(saved) ? (saved as Order[]) : []
}

export interface OrderInput {
  customer: Customer
  delivery: DeliveryMethod
  payment: PaymentMethod
  comment: string
}

export const useCartStore = defineStore('cart', () => {
  const catalog = useCatalogStore()

  // Stored as { id, qty } only, so prices always come from the catalogue.
  const items = ref<CartItem[]>(loadItems())
  watch(items, (value) => save('cart', value), { deep: true })

  // Once the catalogue has arrived, forget lines for products it no longer has.
  watch(
    () => catalog.status,
    (status) => {
      if (status === 'ready') items.value = items.value.filter((i) => catalog.productById(i.id))
    },
    { immediate: true },
  )

  const lines = computed<CartLine[]>(() =>
    items.value.flatMap((i) => {
      const product = catalog.productById(i.id)
      return product ? [{ ...i, product, total: product.price * i.qty }] : []
    }),
  )

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))
  const subtotal = computed(() => lines.value.reduce((sum, l) => sum + l.total, 0))
  const leftForFreeShipping = computed(() => Math.max(0, FREE_SHIPPING_FROM - subtotal.value))

  function shipping(method: DeliveryMethod = 'courier'): number {
    if (method === 'pickup' || subtotal.value === 0 || subtotal.value >= FREE_SHIPPING_FROM) return 0
    return COURIER_FEE
  }

  const qtyOf = (id: string): number => items.value.find((i) => i.id === id)?.qty ?? 0

  function add(id: string, qty = 1): void {
    const line = items.value.find((i) => i.id === id)
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty)
    else items.value.push({ id, qty: Math.min(MAX_QTY, qty) })
  }

  function setQty(id: string, qty: number): void {
    if (qty <= 0) return remove(id)
    const line = items.value.find((i) => i.id === id)
    if (line) line.qty = Math.min(MAX_QTY, qty)
  }

  function remove(id: string): void {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear(): void {
    items.value = []
  }

  // No payment backend: the order is kept in this browser and the cart is emptied.
  function placeOrder({ customer, delivery, payment, comment }: OrderInput): Order {
    const subtotalNow = subtotal.value
    const shippingNow = shipping(delivery)
    const order: Order = {
      id: `BL-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: lines.value.map((l) => ({ id: l.id, qty: l.qty, price: l.product.price })),
      customer,
      delivery,
      payment,
      comment,
      subtotal: subtotalNow,
      shipping: shippingNow,
      total: subtotalNow + shippingNow,
    }
    save('orders', [order, ...loadOrders()].slice(0, 20))
    clear()
    return order
  }

  const findOrder = (id: string): Order | undefined => loadOrders().find((o) => o.id === id)

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
