<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import { products, CATEGORIES } from '@/data/products'
import ProductCard from '@/components/ProductCard.vue'

const { t, price, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const TOP_PRICE = Math.max(...products.map((p) => p.price))
const STEP = 10
const CEILING = Math.ceil(TOP_PRICE / STEP) * STEP

// Every filter lives in the URL, so a filtered view can be shared or bookmarked.
const cat = computed(() => (CATEGORIES[route.query.cat] ? route.query.cat : ''))
const sub = computed(() => (cat.value && CATEGORIES[cat.value].includes(route.query.sub) ? route.query.sub : ''))
const q = computed(() => String(route.query.q || ''))
const sort = computed(() => (['pop', 'low', 'high', 'name'].includes(route.query.sort) ? route.query.sort : 'pop'))
const max = computed(() => {
  const n = Number(route.query.max)
  return Number.isFinite(n) && n > 0 ? Math.min(n, CEILING) : CEILING
})

function setQuery(patch) {
  const next = { ...route.query, ...patch }
  for (const key of Object.keys(next)) {
    if (next[key] === '' || next[key] == null) delete next[key]
  }
  if (next.sort === 'pop') delete next.sort
  if (Number(next.max) >= CEILING) delete next.max
  router.replace({ query: next })
}

const selectCat = (value) => setQuery({ cat: value, sub: '' })
const selectSub = (value) => setQuery({ sub: sub.value === value ? '' : value })

const results = computed(() => {
  const needle = q.value.trim().toLowerCase()
  const list = products.filter((p) => {
    if (cat.value && p.cat !== cat.value) return false
    if (sub.value && p.sub !== sub.value) return false
    if (p.price > max.value) return false
    if (!needle) return true
    const haystack = [p.name, t(`cats.${p.sub}`), p.text[locale.value] || p.text.en].join(' ').toLowerCase()
    return haystack.includes(needle)
  })
  if (sort.value === 'low') return [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'high') return [...list].sort((a, b) => b.price - a.price)
  if (sort.value === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name))
  return list
})

const title = computed(() =>
  sub.value ? t(`cats.${sub.value}`) : cat.value ? t(`cats.${cat.value}`) : t('catalog.title'),
)
const filtered = computed(() => cat.value || sub.value || q.value || max.value < CEILING)
</script>

<template>
  <div class="page wrap catalog">
    <header class="head">
      <h1 class="page-title">{{ title }}</h1>
      <p class="count muted" aria-live="polite">{{ t('catalog.count', { n: results.length }) }}</p>
    </header>

    <div class="controls">
      <div class="depts" role="group" :aria-label="t('catalog.department')">
        <button type="button" class="chip" :aria-pressed="!cat" @click="selectCat('')">{{ t('cats.all') }}</button>
        <button
          v-for="key in Object.keys(CATEGORIES)"
          :key="key"
          type="button"
          class="chip"
          :aria-pressed="cat === key"
          @click="selectCat(key)"
        >
          {{ t(`cats.${key}`) }}
        </button>
      </div>

      <Transition name="subs">
        <div v-if="cat" :key="cat" class="subs" role="group" :aria-label="t(`cats.${cat}`)">
          <button
            v-for="key in CATEGORIES[cat]"
            :key="key"
            type="button"
            class="chip chip--sub"
            :aria-pressed="sub === key"
            @click="selectSub(key)"
          >
            {{ t(`cats.${key}`) }}
          </button>
        </div>
      </Transition>

      <div class="tools">
        <div class="field search">
          <label for="q" class="visually-hidden">{{ t('catalog.search') }}</label>
          <input
            id="q"
            type="search"
            :value="q"
            :placeholder="t('catalog.search')"
            autocomplete="off"
            @input="setQuery({ q: $event.target.value })"
          />
        </div>
        <div class="field">
          <label for="sort" class="visually-hidden">{{ t('catalog.sort') }}</label>
          <select id="sort" :value="sort" @change="setQuery({ sort: $event.target.value })">
            <option value="pop">{{ t('catalog.sortPop') }}</option>
            <option value="low">{{ t('catalog.sortLow') }}</option>
            <option value="high">{{ t('catalog.sortHigh') }}</option>
            <option value="name">{{ t('catalog.sortName') }}</option>
          </select>
        </div>
        <div class="range">
          <label for="max">{{ t('catalog.maxPrice', { price: price(max) }) }}</label>
          <input
            id="max"
            type="range"
            min="10"
            :max="CEILING"
            :step="STEP"
            :value="max"
            @input="setQuery({ max: $event.target.value })"
          />
        </div>
      </div>
    </div>

    <TransitionGroup v-if="results.length" tag="ul" name="grid" class="grid">
      <li v-for="(p, i) in results" :key="p.id" :style="{ '--i': Math.min(i, 8) }">
        <ProductCard :product="p" :eager="i < 4" />
      </li>
    </TransitionGroup>

    <div v-else class="empty">
      <p>{{ t('catalog.empty') }}</p>
      <button type="button" class="btn" @click="router.replace({ query: {} })">{{ t('catalog.reset') }}</button>
    </div>

    <p v-if="filtered && results.length" class="reset-line">
      <button type="button" class="link" @click="router.replace({ query: {} })">{{ t('catalog.reset') }}</button>
    </p>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
  flex-wrap: wrap;
}

.count {
  font-variant-numeric: tabular-nums;
}

.controls {
  display: grid;
  gap: 16px;
  margin-bottom: 40px;
}

.depts,
.subs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  min-height: 44px;
  padding: 0 18px;
  background: var(--surface-2);
  font-weight: 500;
  transition:
    background-color var(--dur-fast) ease,
    color var(--dur-fast) ease,
    transform var(--dur-fast) var(--ease-out);
}

.chip:hover {
  background: var(--ink);
  color: var(--bg);
}

.chip:active {
  transform: scale(0.96);
}

.chip[aria-pressed='true'] {
  background: var(--accent);
  color: var(--accent-ink);
}

.chip--sub {
  min-height: 38px;
  padding: 0 14px;
  font-size: var(--step-small);
  background: var(--surface);
}

.subs-enter-active {
  transition:
    opacity var(--dur) ease,
    transform var(--dur) var(--ease-out);
}

.subs-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.tools {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 16px;
  align-items: end;
}

.range {
  display: grid;
  gap: 8px;
  font-size: var(--step-small);
  color: var(--muted);
}

.range input {
  width: 100%;
  accent-color: var(--accent);
  height: 28px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 48px var(--gutter);
}

.grid-enter-active {
  transition:
    opacity 500ms ease,
    transform 600ms var(--ease-out);
  transition-delay: calc(var(--i) * 45ms);
}

.grid-leave-active {
  transition: opacity 200ms ease;
  position: absolute;
  visibility: hidden;
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.grid-leave-to {
  opacity: 0;
}

.grid-move {
  transition: transform 500ms var(--ease-out);
}

.empty {
  display: grid;
  justify-items: start;
  gap: 24px;
  padding-block: 64px;
  font-size: var(--step-lead);
}

.reset-line {
  margin-top: 48px;
}

@media (max-width: 760px) {
  .tools {
    grid-template-columns: 1fr 1fr;
  }

  .search {
    grid-column: 1 / -1;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 12px;
  }
}
</style>
