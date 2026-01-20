<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const props = defineProps({
  booking: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['cancel', 'modify', 'view'])

const cartStore = useCartStore()
const appStore = useAppStore()
const router = useRouter()

const statusColor = computed(() => {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-blue-100 text-blue-800'
  }
  return statusColors[props.booking.status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
})

function handleCancel() {
  emit('cancel', props.booking)
  appStore.addNotification({
    message: `Booking #${props.booking.id} cancelled`,
    type: 'info'
  })
}

function handleModify() {
  emit('modify', props.booking)
}

function handleView() {
  if (props.booking.id) {
    router.push(`/booking/${props.booking.id}`)
  }
  emit('view', props.booking)
}
</script>

<template>
  <div class="booking-card rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300" style="background-color: #181818;">
    <div class="flex flex-col md:flex-row gap-4">
      <div v-if="booking.image" class="booking-image flex-shrink-0" style="width: 200px; height: 150px;">
        <img 
          :src="booking.image" 
          :alt="booking.title || 'Booking image'"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div class="booking-details flex-1">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">
              {{ booking.title || `Booking #${booking.id}` }}
            </h3>
            <p v-if="booking.description" class="text-gray-600 text-sm">
              {{ booking.description }}
            </p>
          </div>
          <span 
            v-if="booking.status"
            :class="statusColor"
            class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
          >
            {{ booking.status }}
          </span>
        </div>
        
        <div class="booking-info grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div v-if="booking.checkIn" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Check-in: {{ booking.checkIn }}
          </div>
          
          <div v-if="booking.checkOut" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Check-out: {{ booking.checkOut }}
          </div>
          
          <div v-if="booking.guests" class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ booking.guests }} guest{{ booking.guests > 1 ? 's' : '' }}
          </div>
          
          <div v-if="booking.price" class="flex items-center text-sm font-semibold text-blue-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ booking.price }}
          </div>
        </div>
        
        <div v-if="booking.location" class="mb-3">
          <span class="text-sm text-gray-600 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ booking.location }}
          </span>
        </div>
        
        <div v-if="showActions" class="booking-actions flex gap-2 mt-4">
          <button 
            @click="handleView"
            class="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            View Details
          </button>
          <button 
            @click="handleModify"
            class="btn btn-outline px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
          >
            Modify
          </button>
          <button 
            v-if="booking.status !== 'cancelled'"
            @click="handleCancel"
            class="btn btn-outline-danger px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-card {
  margin-bottom: 1rem;
}
</style>
