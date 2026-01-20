<script setup>
import { useExperiences } from '@/composables/useExperiences.js'
import ProductCard from '@/components/ProductCard.vue'
import DataTable from '@/components/DataTable.vue'
import { computed } from 'vue'
import "@/styles/experience_page.css"

const { experiences } = useExperiences()

const tableColumns = [
  { key: 'title', label: 'Experience' },
  { key: 'price', label: 'Price' },
  { key: 'duration', label: 'Duration' },
  { key: 'rating', label: 'Rating' }
]

const tableData = computed(() => {
  return experiences.value.map(exp => ({
    title: exp.title,
    price: exp.price,
    duration: exp.duration,
    rating: exp.rating
  }))
})
</script>

<template>
  <div class="experiences-section container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Unique Experiences in Slovakia</h1>
      <p class="text-lg text-gray-600">Discover local adventures, workshops, and activities hosted by passionate locals.</p>
    </div>
    
    <!-- Grid view with ProductCard component -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      <ProductCard
        v-for="exp in experiences"
        :key="exp.id"
        :id="exp.id"
        :title="exp.title"
        :description="exp.description"
        :price="exp.price"
        :image="exp.image"
        :rating="exp.rating"
        :duration="exp.duration"
        type="experience"
      />
    </div>

    <!-- Table view with DataTable component -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Experience Summary</h2>
      <DataTable :data="tableData" :columns="tableColumns" :striped="true" :hover="true" />
    </div>
  </div>
</template>

<style scoped>
.experiences-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

</style>