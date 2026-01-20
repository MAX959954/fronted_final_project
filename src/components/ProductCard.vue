<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'product' // product, experience, service, apartment
  },
  location: {
    type: String,
    default: ''
  }
})

const cartStore = useCartStore()
const appStore = useAppStore()

const priceNumber = computed(() => {
  return parseFloat(props.price.replace(/[^0-9.]/g, ''))
})

function handleAddToCart() {
  cartStore.addItem({
    id: props.id,
    title: props.title,
    price: props.price,
    image: props.image,
    type: props.type
  })
  appStore.addNotification({
    message: `${props.title} added to cart!`,
    type: 'success'
  })
}
</script>

<template>
  <div class="card shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-200" style="background-color: #181818;">
    <div class="relative overflow-hidden" style="height: 200px;">
      <img 
        :src="image" 
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
      <div v-if="rating" class="absolute top-2 right-2 px-2 py-1 rounded-md text-sm font-semibold" style="background-color: #282828; color: #fff;">
        {{ rating }}
      </div>
    </div>
    
    <div class="card-body p-4">
      <h5 class="card-title font-bold text-lg mb-2 line-clamp-1">{{ title }}</h5>
      
      <p v-if="description" class="text-gray-600 text-sm mb-2 line-clamp-2">
        {{ description }}
      </p>
      
      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span v-if="location" class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ location }}
        </span>
        <span v-if="duration" class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ duration }}
        </span>
      </div>
      
      <div class="flex items-center justify-between mt-auto">
        <span class="text-lg font-bold text-blue-600">{{ price }}</span>
        <button 
          @click="handleAddToCart"
          class="btn btn-primary btn-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #181818;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
