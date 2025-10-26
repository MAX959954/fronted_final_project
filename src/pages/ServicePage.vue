<script setup>
import { ref, onMounted } from 'vue'  // Added ref for activeTab
import { useServices, useServicesTraining } from '@/composables/useServices.js'
import "@/styles/service_page.css"

const { services, titles } = useServices()
const { servicesTraining, titlesTraining } = useServicesTraining()

// Reactive state for tab switching
const activeTab = ref('chefs')  // Default to 'chefs'

const switchTab = (tab) => {
  activeTab.value = tab
}

onMounted(() => {
  console.log("Services loaded")
})
</script>

<template>
  <!---
  <div class="tabs">
    <button
        class="tab-button"
        :class="{ active: activeTab === 'chefs' }"
        @click="switchTab('chefs')"
    >
      Chefs
    </button>
    <button
        class="tab-button"
        :class="{ active: activeTab === 'training' }"
        @click="switchTab('training')"
    >
      Training
    </button>
  </div>

  -->
  <div id = "seections">


    <div
        id="chefs-section"
        class="category-section"
        :class="{ 'active-section': activeTab === 'chefs', 'inactive-section': activeTab !== 'chefs' }"
    >
      <h2 class="category-title">Chefs</h2>
      <div class="experiences-scroll">
        <div v-for="exp in services" :key="exp.id" class="experience-card">
          <img :src="exp.img" :alt="exp.title" />
          <div class="heart-overlay">
            <svg viewBox="0 0 24 24">
              <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81
               4.5 2.09C13.09 3.81 14.76 3
               16.5 3 19.58 3 22 5.42 22
               8.5c0 3.78-3.4 6.86-8.55
               11.54L12 21.35z"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ exp.title }}</h3>
            <p class="card-desc">{{ exp.description }}</p>
            <p class="card-price">
              {{ exp.price }}
              <span class="card-rating">{{ exp.rating }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>


    <!-- Training Section -->
    <div
        id="training-section"
        class="category-section"
        :class="{ 'active-section': activeTab === 'training', 'inactive-section': activeTab !== 'training' }"
    >
      <h2 class="category-title">Training</h2>
      <div class="experiences-scroll">
        <div v-for="exp in servicesTraining" :key="exp.id" class="experience-card">
          <img :src="exp.img" :alt="exp.title" />
          <div class="heart-overlay">
            <svg viewBox="0 0 24 24">
              <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36
               2 12.28 2 8.5 2 5.42 4.42 3
               7.5 3c1.74 0 3.41.81 4.5
               2.09C13.09 3.81 14.76 3
               16.5 3 19.58 3 22 5.42
               22 8.5c0 3.78-3.4 6.86-8.55
               11.54L12 21.35z"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ exp.title }}</h3>
            <p class="card-desc">{{ exp.description }}</p>
            <p class="card-price">
              {{ exp.price }}
              <span class="card-rating">{{ exp.rating }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>


  </div>



</template>

<style scoped>
/* If not in service_page.css, add these basics */
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