<script setup>
import { useExperiences } from '@/composables/useExperiences.js'
import "@/styles/experience_page.css"

const { experiences } = useExperiences()

</script>

<template>
  <div class="experiences-section">
    <h1>Unique Experiences in Slovakia</h1>
    <p>Discover local adventures, workshops, and activities hosted by passionate locals.</p>
    <div class="experiences-grid">
      <div v-for="exp in experiences" :key="exp.id" class="experience-card">
        <img :src="exp.image" :alt="exp.title">
        <div class="card-content">
          <h3>{{ exp.title }}</h3>
          <p>{{ exp.description }}</p>
          <div class="card-footer">
            <span class="price">{{ exp.price }}</span>
            <span class="duration">{{ exp.duration }}</span>
            <div class="rating">{{ exp.rating }}</div>
          </div>
        </div>
      </div>
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