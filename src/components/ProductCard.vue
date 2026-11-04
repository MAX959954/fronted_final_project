<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  product: { type: Object, required: true },
  eager: { type: Boolean, default: false },
})

const { t, price } = useI18n()
const cart = useCartStore()
const favs = useFavoritesStore()
const app = useAppStore()
const justAdded = ref(false)

function addToCart() {
  cart.add(props.product.id)
  app.addNotification({ message: t('toast.added', { name: props.product.name }), image: props.product.image })
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1200)
}

function toggleFav() {
  const added = favs.toggle(props.product.id)
  app.addNotification({ message: t(added ? 'toast.favAdded' : 'toast.favRemoved', { name: props.product.name }) })
}
</script>

<template>
  <article class="card">
    <RouterLink :to="`/product/${product.id}`" class="frame" :aria-label="product.name">
      <img
        :src="product.image"
        :alt="product.name"
        width="800"
        height="1000"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
      />
    </RouterLink>

    <button
      type="button"
      class="icon-btn fav"
      :aria-pressed="favs.has(product.id)"
      :aria-label="favs.has(product.id) ? t('product.unfav') : t('product.fav')"
      @click="toggleFav"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
          :fill="favs.has(product.id) ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="info">
      <p class="sub muted">{{ t(`cats.${product.sub}`) }}</p>
      <h3 class="name">
        <RouterLink :to="`/product/${product.id}`" class="link">{{ product.name }}</RouterLink>
      </h3>
      <div class="buy">
        <p class="price">{{ price(product.price) }}</p>
        <button type="button" class="btn btn--small add" :class="{ done: justAdded }" @click="addToCart">
          <span class="add-label">{{ t('product.add') }}</span>
          <svg class="tick" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.2" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
}

.frame {
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--surface);
}

.frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 900ms var(--ease-out),
    filter 600ms ease;
  filter: saturate(0.92);
}

.card:hover .frame img,
.frame:focus-visible img {
  transform: scale(1.06);
  filter: saturate(1.05);
}

.fav {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--bg);
}

.info {
  display: grid;
  gap: 6px;
  padding-top: 14px;
}

.sub {
  font-size: var(--step-small);
}

.name {
  font-size: var(--step-lead);
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.buy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
}

.price {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.add {
  position: relative;
  overflow: hidden;
}

.add-label,
.tick {
  transition:
    transform var(--dur) var(--ease-out),
    opacity var(--dur-fast) ease;
}

.tick {
  position: absolute;
  inset: 0;
  margin: auto;
  opacity: 0;
  transform: translateY(100%);
}

.add.done .add-label {
  opacity: 0;
  transform: translateY(-100%);
}

.add.done .tick {
  opacity: 1;
  transform: none;
}
</style>
