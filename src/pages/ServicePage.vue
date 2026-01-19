<script setup>
import { ref, onMounted } from 'vue'  // Added ref for activeTab
import { useServices, useServicesTraining } from '@/composables/useServices.js'
import "@/styles/service_page.css"

const { services } = useServices()
const { servicesTraining} = useServicesTraining()

onMounted(() => {
  console.log("Services loaded")
})
</script>

<template>
    <div class="services-wrapper">
      <h1>Best Cafés in Slovakia</h1>
      <p>Discover local cafés, restaurants, and enjoy traditional Slovak cuisine.</p>

      <div class="experiences-grid">
        <div v-for="chef in services" :key="chef.id" class="chef-card">
          <img :src="chef.img" :alt="chef.title" />

          <div class="card-content">
            <h3>{{ chef.title }}</h3>
            <p>{{ chef.description }}</p>

            <div class="card-footer">
              <span class="price">{{ chef.price }}</span>
              <span class="rating">{{ chef.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- TRAINING SECTION -->
  <div id="training-section">
    <h1>Unique Experiences in Slovakia</h1>
    <p>Discover adventures, workshops, and activities hosted by passionate locals.</p>

    <div class="experiences-grid">
      <div
          v-for="train in servicesTraining" :key="train.id" class="experience-card">
        <img :src="train.img" :alt="train.title" />

        <div class="card-content">
          <h3>{{ train.title }}</h3>
          <p>{{ train.description }}</p>

          <div class="card-footer">
            <span class="price">{{ train.price }}</span>
            <span class="rating">{{ train.rating }}</span>
          </div>
        </div>
      </div>
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