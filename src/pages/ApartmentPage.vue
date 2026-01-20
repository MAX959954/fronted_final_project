<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import DataTable from '@/components/DataTable.vue'
import { computed } from 'vue'
import bratislavaImg from '@/img/Bratislava.JPG'
import hotelImg from '@/img/hotel.jpg'
import hotelBbImg from '@/img/hotel_bb.jpg'
import hotelKosiImg from '@/img/hotel_kosi.webp'
import hotelLmImg from '@/img/hotel_lm.jpg'
import apartmentsImg from '@/img/apartments.jpg'
import villasImg from '@/img/villas.jpg'

const apartments = ref([
  {
    id: 1,
    title: 'Modern Apartment in Bratislava Center',
    description: 'Beautiful 2-bedroom apartment with city views in the heart of Bratislava',
    price: '€89/night',
    image: bratislavaImg,
    rating: '★★★★★ (234 reviews)',
    location: 'Bratislava, Slovakia'
  },
  {
    id: 2,
    title: 'Luxury Hotel Suite',
    description: 'Spacious suite with modern amenities and excellent service',
    price: '€120/night',
    image: hotelImg,
    rating: '★★★★☆ (189 reviews)',
    location: 'Bratislava, Slovakia'
  },
  {
    id: 3,
    title: 'Cozy Apartment in Košice',
    description: 'Charming apartment in historic Košice, perfect for couples',
    price: '€65/night',
    image: hotelBbImg,
    rating: '★★★★★ (156 reviews)',
    location: 'Košice, Slovakia'
  },
  {
    id: 4,
    title: 'Mountain View Apartment',
    description: 'Stunning views of High Tatras from this modern apartment',
    price: '€95/night',
    image: hotelKosiImg,
    rating: '★★★★☆ (203 reviews)',
    location: 'High Tatras, Slovakia'
  },
  {
    id: 5,
    title: 'City Center Loft',
    description: 'Stylish loft apartment in the historic center',
    price: '€110/night',
    image: hotelLmImg,
    rating: '★★★★★ (278 reviews)',
    location: 'Bratislava, Slovakia'
  },
  {
    id: 6,
    title: 'Family-Friendly Apartment',
    description: 'Large 3-bedroom apartment perfect for families',
    price: '€130/night',
    image: apartmentsImg,
    rating: '★★★★☆ (167 reviews)',
    location: 'Bratislava, Slovakia'
  },
  {
    id: 7,
    title: 'Luxury Villa',
    description: 'Exclusive villa with private pool and garden',
    price: '€250/night',
    image: villasImg,
    rating: '★★★★★ (89 reviews)',
    location: 'Small Carpathians, Slovakia'
  }
])

const tableColumns = [
  { key: 'title', label: 'Apartment' },
  { key: 'location', label: 'Location' },
  { key: 'price', label: 'Price per Night' },
  { key: 'rating', label: 'Rating' }
]

const tableData = computed(() => {
  return apartments.value.map(apt => ({
    title: apt.title,
    location: apt.location,
    price: apt.price,
    rating: apt.rating
  }))
})
</script>

<template>
  <div class="apartment-page mx-auto px-4 py-8 bg-[#181818] text-white max-w-[1990px]">
  <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Apartments & Accommodations</h1>
      <p class="text-lg text-gray-400">
        Find the perfect place to stay in Slovakia
      </p>
    </div>

    <!-- Grid view -->
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
    >
      <ProductCard
          v-for="apt in apartments"
          :key="apt.id"
          :id="apt.id"
          :title="apt.title"
          :description="apt.description"
          :price="apt.price"
          :image="apt.image"
          :rating="apt.rating"
          :location="apt.location"
          type="apartment"
      />
    </div>

    <!-- Table view -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Apartment Summary</h2>

      <!-- Dark wrapper -->
      <div class="rounded-xl overflow-hidden border border-gray-700">
        <DataTable
            :data="tableData"
            :columns="tableColumns"
            :striped="true"
            :hover="true"
        />
      </div>
    </div>
  </div>
</template>

<style>
.apartment-page {
  width: 1900px;
}

table {
  width: 100%;
  background-color: #181818 !important;
  color: #ffffff;
  border-collapse: collapse;
}

thead {
  background-color: #181818 !important;
}

th {
  padding: 12px 16px;
  color: #b3b3b3 !important;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #333;
}

td {
  padding: 12px 16px;
  background-color: #181818 !important;
  border-bottom: 1px solid #333;
}

tbody tr:nth-child(even) td {
  background-color: #1f1f1f !important;
}

tbody tr:hover td {
  background-color: #242424 !important;
}

/* Optional */
.apartment-page {
  max-width: 1190px;
}

/* ===== Force white text in DataTable ===== */
table,
thead,
tbody,
tr,
th,
td {
  color: gray;
}

th {
  color: #b3b3b3 !important; /* header */
}

td {
  color: #ffffff !important; /* rows */
}

</style>
