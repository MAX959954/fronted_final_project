<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n'
import { productById, products } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useAppStore } from '@/stores/app'
import ProductCard from '@/components/ProductCard.vue'
import QtyStepper from '@/components/QtyStepper.vue'
import SoundcheckButton from '@/components/SoundcheckButton.vue'

const { t, price, productText } = useI18n()
const route = useRoute()
const cart = useCartStore()
const favs = useFavoritesStore()
const app = useAppStore()

const product = computed(() => productById(route.params.id))
const qty = ref(1)
watch(product, () => (qty.value = 1))

// What a player usually needs next to this instrument.
const PAIRS = {
  electric: ['practice-15', 'red-drive', 'braided-cable', 'pick-sampler'],
  acoustic: ['acoustic-strings', 'pick-sampler', 'braided-cable', 'parlour-nat'],
  kits: ['hickory-5a', 'quick-hat', 'open-back', 'blue-snare'],
  snares: ['hickory-5a', 'quick-hat', 'stage-five'],
  cymbals: ['hickory-5a', 'dark-ride', 'quick-hat', 'bright-splash'],
  amps: ['braided-cable', 'red-drive', 'surf-s'],
  pedals: ['braided-cable', 'practice-15', 'board-seven', 'red-drive'],
}

const related = computed(() => {
  if (!product.value) return []
  const ids = PAIRS[product.value.sub] || products.filter((p) => p.sub === product.value.sub).map((p) => p.id)
  const picked = ids
    .filter((id) => id !== product.value.id)
    .map(productById)
    .filter(Boolean)
  for (const p of products) {
    if (picked.length >= 3) break
    if (p.cat === product.value.cat && p.id !== product.value.id && !picked.includes(p)) picked.push(p)
  }
  return picked.slice(0, 3)
})

const specs = computed(() => Object.entries(product.value?.specs || {}))
const isFav = computed(() => product.value && favs.has(product.value.id))

function addToCart() {
  cart.add(product.value.id, qty.value)
  app.addNotification({ message: t('toast.added', { name: product.value.name }), image: product.value.image })
}

function toggleFav() {
  const added = favs.toggle(product.value.id)
  app.addNotification({ message: t(added ? 'toast.favAdded' : 'toast.favRemoved', { name: product.value.name }) })
}
</script>

<template>
  <div v-if="product" class="page product">
    <div class="split wrap">
      <figure class="stage">
        <img
          :src="product.image.src"
          :srcset="product.image.srcset"
          sizes="(max-width: 860px) 100vw, 55vw"
          :alt="product.name"
          width="1000"
          height="1250"
          fetchpriority="high"
        />
      </figure>

      <div v-reveal class="buy">
        <RouterLink :to="`/catalog?cat=${product.cat}&sub=${product.sub}`" class="crumb link" data-r>
          ← {{ t(`cats.${product.sub}`) }}
        </RouterLink>
        <h1 data-r>{{ product.name }}</h1>
        <p class="price" data-r>{{ price(product.price) }}</p>
        <p class="desc" data-r>{{ productText(product) }}</p>

        <div class="actions" data-r>
          <QtyStepper v-model="qty" />
          <button type="button" class="btn add" @click="addToCart">{{ t('product.add') }}</button>
          <button
            type="button"
            class="icon-btn fav"
            :aria-pressed="isFav"
            :aria-label="isFav ? t('product.unfav') : t('product.fav')"
            @click="toggleFav"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
                :fill="isFav ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <p v-if="cart.qtyOf(product.id)" class="in-cart" data-r>
          <RouterLink to="/cart" class="link">{{ t('product.inCart', { n: cart.qtyOf(product.id) }) }}</RouterLink>
        </p>

        <div v-if="product.sound" class="sound" data-r>
          <SoundcheckButton :sound="product.sound" />
          <span class="muted">{{ t('product.soundHint') }}</span>
        </div>

        <ul class="promises" data-r>
          <li>{{ t('product.stock') }}</li>
          <li v-if="product.cat === 'guitars'">{{ t('product.setup') }}</li>
        </ul>

        <section class="specs" data-r aria-labelledby="specs-h">
          <h2 id="specs-h">{{ t('product.specs') }}</h2>
          <dl>
            <div v-for="[key, value] in specs" :key="key">
              <dt>{{ t(`specs.${key}`) }}</dt>
              <dd>{{ value }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>

    <section v-if="related.length" v-reveal class="related wrap" aria-labelledby="related-h">
      <h2 id="related-h" data-r>{{ t('product.related') }}</h2>
      <ul class="related-grid" data-r>
        <li v-for="p in related" :key="p.id"><ProductCard :product="p" /></li>
      </ul>
    </section>
  </div>

  <div v-else class="page wrap missing">
    <h1 class="page-title">{{ t('product.notFound') }}</h1>
    <RouterLink to="/catalog" class="btn">{{ t('product.back') }}</RouterLink>
  </div>
</template>

<style scoped>
.product {
  padding-top: 24px;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 96px);
  align-items: start;
}

.stage {
  position: sticky;
  top: calc(var(--header-h) + 16px);
  width: 100%;
  height: min(calc(100svh - var(--header-h) - 32px), 125vw);
  overflow: hidden;
  background: var(--surface);
}

.stage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: stage-in 1.1s var(--ease-out) both;
}

@keyframes stage-in {
  from {
    opacity: 0;
    transform: scale(1.08);
  }
}

.buy {
  display: grid;
  gap: 24px;
  padding-top: clamp(8px, 4vw, 56px);
}

.crumb {
  width: fit-content;
  font-size: var(--step-small);
  color: var(--muted);
}

h1 {
  font-size: var(--step-head);
}

.price {
  font-size: var(--step-lead);
  font-weight: 500;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.desc {
  max-width: 48ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.add {
  flex: 1 1 200px;
}

.fav {
  width: 52px;
  height: 52px;
}

.sound {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  font-size: var(--step-small);
}

.promises {
  display: grid;
  gap: 6px;
  font-size: var(--step-small);
}

.promises li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.promises li::before {
  content: '';
  flex: none;
  width: 8px;
  height: 8px;
  background: var(--accent);
}

.specs {
  padding-top: 16px;
}

.specs h2 {
  font-size: var(--step-lead);
  margin-bottom: 12px;
}

.specs dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
}

.specs dl div:nth-child(odd) {
  background: var(--surface);
}

.specs dt {
  color: var(--muted);
}

.specs dd {
  font-weight: 500;
  text-align: right;
}

.related {
  padding-top: var(--section-gap);
}

.related h2 {
  font-size: var(--step-head);
  margin-bottom: 40px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gutter);
}

.missing {
  display: grid;
  justify-items: start;
}

@media (max-width: 860px) {
  .split {
    grid-template-columns: 1fr;
  }

  .stage {
    position: relative;
    top: 0;
    width: auto;
    margin-inline: calc(-1 * var(--gutter));
    height: 70svh;
  }

  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 12px;
  }

  .related-grid li:nth-child(3) {
    display: none;
  }
}
</style>
