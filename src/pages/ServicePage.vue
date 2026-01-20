<script setup>
import { ref, onMounted } from 'vue'
import { useServices, useServicesTraining } from '@/composables/useServices.js'
import ProductCard from '@/components/ProductCard.vue'
import "@/styles/service_page.css"

const { services } = useServices()
const { servicesTraining } = useServicesTraining()

onMounted(() => {
  console.log("Services loaded")
})
</script>

<template>
  <!-- BEST CAFÉS SECTION -->
  <div id="cafes-section" class="services-wrapper">
    <h1>Best Cafés in Slovakia</h1>
    <p>Discover local cafés, restaurants, and enjoy traditional Slovak cuisine.</p>

    <div class="experiences-grid">
      <ProductCard
        v-for="chef in services"
        :key="chef.id"
        :id="chef.id"
        :title="chef.title"
        :description="chef.description"
        :price="chef.price"
        :image="chef.img"
        :rating="chef.rating"
        type="service"
      />
    </div>
  </div>

  <!-- FITNESS & WELLNESS SECTION -->
  <div id="training-section">
    <h1>Fitness & Wellness Services</h1>
    <p>Discover fitness classes, personal training, and wellness activities hosted by passionate locals.</p>

    <div class="experiences-grid">
      <ProductCard
        v-for="train in servicesTraining"
        :key="train.id"
        :id="train.id"
        :title="train.title"
        :description="train.description"
        :price="train.price"
        :image="train.img"
        :rating="train.rating"
        type="training"
      />
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.tab-button {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: 600;
  color: #222;
  cursor: pointer;
  padding: 10px 0;
}

.tab-button.active {
  color: #ff385c;
}
</style>