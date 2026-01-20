<script setup>
import { ref } from 'vue'
import Article from '@/components/Article.vue'
import bratislavaImg from '@/img/Bratislava.JPG'
import milaDevaImg from '@/img/mila_deva.jpg'
import mountainImg from '@/img/mountain-7978816_1920.jpg'
import paragliderImg from '@/img/paraglider-4806383_1920.jpg'
import kosiceImg from '@/img/kosice.jpg'

const articles = ref([
  {
    id: 1,
    title: 'Top 10 Hidden Gems in Slovakia',
    content: 'Discover the most beautiful and lesser-known places in Slovakia that will take your breath away. From ancient castles to pristine nature, Slovakia has it all.',
    excerpt: 'Discover the most beautiful and lesser-known places in Slovakia...',
    author: 'Travel Guide',
    date: '2025-01-15',
    image: bratislavaImg,
    category: 'Travel',
    readTime: 5,
    tags: ['travel', 'slovakia', 'destinations']
  },
  {
    id: 2,
    title: 'Traditional Slovak Cuisine: A Food Lover\'s Guide',
    content: 'Explore the rich culinary traditions of Slovakia. Learn about bryndzové halušky, kapustnica, and other traditional dishes that make Slovak cuisine unique.',
    excerpt: 'Explore the rich culinary traditions of Slovakia...',
    author: 'Food Enthusiast',
    date: '2025-01-10',
    image: milaDevaImg,
    category: 'Food',
    readTime: 7,
    tags: ['food', 'cuisine', 'traditional']
  },
  {
    id: 3,
    title: 'Best Time to Visit Slovakia: Seasonal Guide',
    content: 'Plan your perfect trip to Slovakia by understanding the best times to visit. Each season offers unique experiences from skiing in winter to hiking in summer.',
    excerpt: 'Plan your perfect trip to Slovakia by understanding the best times...',
    author: 'Travel Expert',
    date: '2025-01-05',
    image: mountainImg,
    category: 'Travel Tips',
    readTime: 6,
    tags: ['travel', 'seasons', 'planning']
  },
  {
    id: 4,
    title: 'Adventure Activities in High Tatras',
    content: 'Get your adrenaline pumping with the best adventure activities in the High Tatras. From hiking and climbing to paragliding and skiing.',
    excerpt: 'Get your adrenaline pumping with the best adventure activities...',
    author: 'Adventure Guide',
    date: '2024-12-28',
    image: paragliderImg,
    category: 'Adventure',
    readTime: 8,
    tags: ['adventure', 'mountains', 'outdoors']
  },
  {
    id: 5,
    title: 'Slovak Culture and Traditions',
    content: 'Immerse yourself in Slovak culture and learn about traditional customs, festivals, and the warm hospitality of the Slovak people.',
    excerpt: 'Immerse yourself in Slovak culture and learn about traditional customs...',
    author: 'Cultural Expert',
    date: '2024-12-20',
    image: kosiceImg,
    category: 'Culture',
    readTime: 9,
    tags: ['culture', 'traditions', 'heritage']
  }
])
</script>

<template>
  <div class="blog-page container mx-auto px-4 py-8">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-4">Travel Blog</h1>
      <p class="text-lg text-gray-600">Stories, guides, and insights about Slovakia</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Article
        v-for="article in articles"
        :key="article.id"
        :id="article.id"
        :title="article.title"
        :content="article.content"
        :excerpt="article.excerpt"
        :author="article.author"
        :date="article.date"
        :image="article.image"
        :category="article.category"
        :read-time="article.readTime"
        :tags="article.tags"
      >
        <template #actions>
          <button class="btn btn-outline-primary text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition-colors">
            Read More
          </button>
        </template>
      </Article>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  max-width: 1200px;
}
</style>
