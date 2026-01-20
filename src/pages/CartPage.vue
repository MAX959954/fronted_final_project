<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter, RouterLink } from 'vue-router'
import DataTable from '@/components/DataTable.vue'
import ProductCard from '@/components/ProductCard.vue'

const cartStore = useCartStore()
const router = useRouter()

const tableColumns = [
  { key: 'title', label: 'Item' },
  { key: 'type', label: 'Type' },
  { key: 'price', label: 'Price' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'total', label: 'Total' }
]

const tableData = computed(() => {
  return cartStore.items.map(item => {
    const priceNumber = parseFloat(item.price.replace(/[^0-9.]/g, ''))
    return {
      id: item.id,
      title: item.title,
      type: item.type,
      price: item.price,
      quantity: item.quantity,
      total: `€${(priceNumber * item.quantity).toFixed(2)}`
    }
  })
})

function handleCheckout() {
  if (cartStore.items.length === 0) {
    alert('Your cart is empty!')
    return
  }
  alert('Proceeding to checkout...')
  // In a real app, navigate to checkout page
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}
</script>

<template>
  <div class="cart-page container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Shopping Cart</h1>
      <p class="text-lg text-gray-600">Review your selected items</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-500 mb-4">Your cart is empty</p>
      <RouterLink to="/experience" class="btn btn-primary px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
        Browse Experiences
      </RouterLink>
    </div>

    <div v-else>
      <!-- Cart Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="item in cartStore.items" 
          :key="`${item.id}-${item.type}`"
          class="relative"
        >
          <ProductCard
            :id="item.id"
            :title="item.title"
            :price="item.price"
            :image="item.image"
            :type="item.type"
            class="h-full"
          />
          <div class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors" @click="cartStore.removeItem(item.id, item.type)">
            ×
          </div>
        </div>
      </div>

      <!-- Cart Summary Table -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Cart Summary</h2>
        <DataTable 
          :data="tableData" 
          :columns="tableColumns" 
          :striped="true" 
          :hover="true"
        />
      </div>

      <!-- Cart Total and Actions -->
      <div class="bg-gray-50 rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <span class="text-xl font-semibold">Total Items:</span>
          <span class="text-xl font-bold">{{ cartStore.totalItems }}</span>
        </div>
        <div class="flex justify-between items-center mb-6">
          <span class="text-2xl font-bold">Total Price:</span>
          <span class="text-3xl font-bold text-blue-600">€{{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="flex gap-4">
          <button 
            @click="handleCheckout"
            class="btn btn-primary flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
          >
            Proceed to Checkout
          </button>
          <button 
            @click="clearCart"
            class="btn btn-outline-danger px-6 py-3 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
}
</style>
