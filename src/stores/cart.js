import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return sum + (price * item.quantity)
    }, 0)
  })

  function addItem(item) {
    const existingItem = items.value.find(i => i.id === item.id && i.type === item.type)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
  }

  function removeItem(itemId, itemType) {
    const index = items.value.findIndex(i => i.id === itemId && i.type === itemType)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(itemId, itemType, quantity) {
    const item = items.value.find(i => i.id === itemId && i.type === itemType)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId, itemType)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
