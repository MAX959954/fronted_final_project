<script setup>
import CatalogGate from '@/components/CatalogGate.vue'
import { useI18n } from '@/i18n'
import { useFavoritesStore } from '@/stores/favorites'
import ProductCard from '@/components/ProductCard.vue'
import ProductCardSkeleton from '@/components/ProductCardSkeleton.vue'

const { t } = useI18n()
const favs = useFavoritesStore()
</script>

<template>
  <div class="page wrap">
    <h1 class="page-title">{{ t('fav.title') }}</h1>

    <CatalogGate>
      <template #loading>
        <ul class="grid">
          <li v-for="n in 4" :key="n"><ProductCardSkeleton /></li>
        </ul>
      </template>

      <TransitionGroup v-if="favs.items.length" tag="ul" name="grid" class="grid">
        <li v-for="p in favs.items" :key="p.id"><ProductCard :product="p" /></li>
      </TransitionGroup>

      <div v-else class="empty">
        <p>{{ t('fav.empty') }}</p>
        <RouterLink to="/catalog" class="btn">{{ t('cart.browse') }}</RouterLink>
      </div>
    </CatalogGate>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 48px var(--gutter);
}

.grid-leave-active {
  transition:
    opacity 250ms ease,
    transform 300ms var(--ease-out);
}

.grid-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

.grid-move {
  transition: transform 450ms var(--ease-out);
}

.empty {
  display: grid;
  justify-items: start;
  gap: 24px;
  font-size: var(--step-lead);
}

@media (max-width: 760px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 12px;
  }
}
</style>
