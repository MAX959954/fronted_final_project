<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  date: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
  category: {
    type: String,
    default: ''
  },
  readTime: {
    type: Number,
    default: 0
  }
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  const date = new Date(props.date)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const displayExcerpt = computed(() => {
  return props.excerpt || props.content.substring(0, 150) + '...'
})
</script>

<template>
  <article class="article-card bg-[#181818] rounded-lg shadow-md overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow duration-300">
    <div v-if="image" class="article-image relative overflow-hidden" style="height: 250px;">
      <img 
        :src="image" 
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
    
    <div class="article-content p-6">
      <div class="article-meta flex items-center justify-between text-sm text-gray-400 mb-3">
        <div class="flex items-center space-x-4">
          <span v-if="category" class="px-2 py-1 bg-blue-900 text-blue-100 rounded text-xs font-semibold">
            {{ category }}
          </span>
          <span v-if="author" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ author }}
          </span>
          <span v-if="date" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formattedDate }}
          </span>
        </div>
        <span v-if="readTime" class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ readTime }} min read
        </span>
      </div>
      
      <h2 class="article-title text-2xl font-bold mb-3 text-white hover:text-blue-400 transition-colors">
        {{ title }}
      </h2>
      
      <p class="article-excerpt text-gray-300 mb-4 leading-relaxed">
        {{ displayExcerpt }}
      </p>
      
      <div v-if="tags && tags.length > 0" class="article-tags flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in tags" 
          :key="tag"
          class="px-2 py-1 bg-gray-800 text-gray-200 rounded text-xs hover:bg-gray-700 transition-colors"
        >
          #{{ tag }}
        </span>
      </div>
      
      <slot name="actions">
        <button class="btn btn-outline-primary text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors">
          Read More
        </button>
      </slot>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
}

.article-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
