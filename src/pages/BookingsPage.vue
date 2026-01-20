<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import BookingCard from '@/components/BookingCard.vue'
import DataTable from '@/components/DataTable.vue'
import bratislavaImg from '@/img/Bratislava.JPG'
import mountainImg from '@/img/mountain-7978816_1920.jpg'
import hikingImg from '@/img/ashim-d-silva-UjxL9x0nwQ8-unsplash.jpg'

const cartStore = useCartStore()

// Create mock bookings from cart items
const bookings = ref([
  {
    id: 1,
    title: 'Luxury Apartment in Bratislava',
    description: 'Beautiful 2-bedroom apartment in city center',
    image: bratislavaImg,
    checkIn: '2025-03-15',
    checkOut: '2025-03-20',
    guests: 2,
    price: '€450',
    status: 'confirmed',
    location: 'Bratislava, Slovakia'
  },
  {
    id: 2,
    title: 'Wine Tasting Experience',
    description: 'Sample award-winning wines from family vineyards',
    image: mountainImg,
    checkIn: '2025-03-22',
    checkOut: '2025-03-22',
    guests: 4,
    price: '€180',
    status: 'pending',
    location: 'Small Carpathians, Slovakia'
  },
  {
    id: 3,
    title: 'Guided Hiking Tour',
    description: 'Explore breathtaking mountain trails',
    image: hikingImg,
    checkIn: '2025-03-25',
    checkOut: '2025-03-25',
    guests: 2,
    price: '€70',
    status: 'completed',
    location: 'High Tatras, Slovakia'
  }
])

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Booking' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'checkOut', label: 'Check-out' },
  { key: 'guests', label: 'Guests' },
  { key: 'price', label: 'Price' },
  { key: 'status', label: 'Status' }
]

const tableData = computed(() => {
  return bookings.value.map(booking => ({
    id: booking.id,
    title: booking.title,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    price: booking.price,
    status: booking.status
  }))
})

function handleCancel(booking) {
  const index = bookings.value.findIndex(b => b.id === booking.id)
  if (index > -1) {
    bookings.value[index].status = 'cancelled'
  }
}

function handleModify(booking) {
  console.log('Modify booking:', booking)
}

function handleView(booking) {
  console.log('View booking:', booking)
}
</script>

<template>
  <div class="bookings-page container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">My Bookings</h1>
      <p class="text-lg text-gray-600">Manage your reservations and bookings</p>
    </div>

    <!-- Booking Cards -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">Recent Bookings</h2>
      <div class="space-y-4">
        <BookingCard
          v-for="booking in bookings"
          :key="booking.id"
          :booking="booking"
          @cancel="handleCancel"
          @modify="handleModify"
          @view="handleView"
        />
      </div>
    </div>

    <!-- Bookings Table -->
    <div>
      <h2 class="text-2xl font-bold mb-6">Booking Summary</h2>
      <DataTable 
        :data="tableData" 
        :columns="tableColumns" 
        :striped="true" 
        :hover="true"
        :responsive="true"
      >
        <template #cell-status="{ value }">
          <span 
            :class="{
              'bg-green-100 text-green-800': value === 'confirmed',
              'bg-yellow-100 text-yellow-800': value === 'pending',
              'bg-red-100 text-red-800': value === 'cancelled',
              'bg-blue-100 text-blue-800': value === 'completed'
            }"
            class="px-2 py-1 rounded-full text-xs font-semibold uppercase"
          >
            {{ value }}
          </span>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.bookings-page {
  max-width: 1200px;
}
</style>
