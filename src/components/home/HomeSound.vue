<script setup>
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import { useCatalogStore } from '@/stores/catalog'
import { photo } from '@/data/images'
import { useScrollFrame } from '@/composables/useScroll'

const { t, price } = useI18n()
const catalog = useCatalogStore()

const rows = [
  { sub: 'electric', image: photo('g-surf'), to: '/catalog?cat=guitars&sub=electric' },
  { sub: 'acoustic', image: photo('g-canary'), to: '/catalog?cat=guitars&sub=acoustic' },
  { sub: 'kits', image: photo('d-electronic'), to: '/catalog?cat=drums&sub=kits' },
  { sub: 'snares', image: photo('d-snare'), to: '/catalog?cat=drums&sub=snares' },
  { sub: 'cymbals', image: photo('c-hihat'), to: '/catalog?cat=drums&sub=cymbals' },
  { sub: 'amps', image: photo('a-stagecombo'), to: '/catalog?cat=accessories&sub=amps' },
  { sub: 'pedals', image: photo('a-pedalboard'), to: '/catalog?cat=accessories&sub=pedals' },
  {
    sub: 'extras',
    image: photo('a-picks'),
    to: '/catalog?cat=accessories',
    // "Extras" starts at the cheaper of these two.
    priceFrom: ['picks', 'strings'],
  },
]
const activeRow = ref(0)
const rowEls = ref([])
const rowName = (row) => (row.sub === 'extras' ? t('sound.extrasName') : t(`cats.${row.sub}`))
const rowFrom = (row) => {
  if (catalog.status !== 'ready') return ''
  const subs = row.priceFrom ?? [row.sub]
  return t('sound.from', { price: price(Math.min(...subs.map(catalog.fromPrice))) })
}

// While the pointer is over the list it picks the row; otherwise the row nearest the middle of the screen does.
let hovering = false
function hoverRow(i) {
  hovering = true
  activeRow.value = i
}
function leaveRows() {
  hovering = false
}

useScrollFrame((vh) => {
  if (!rowEls.value.length || hovering) return
  const mid = vh * 0.5
  let best = activeRow.value
  let bestDist = Infinity
  rowEls.value.forEach((el, i) => {
    const r = el.getBoundingClientRect()
    const d = Math.abs(r.top + 29 - mid)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  })
  const list = rowEls.value[0].parentElement.getBoundingClientRect()
  if (list.top < mid && list.bottom > mid) activeRow.value = best
})
</script>

<template>
  <section v-reveal class="sound wrap" aria-labelledby="sound-h">
    <h2 id="sound-h" class="sound-h" data-r>{{ t('sound.heading') }}</h2>
    <div class="sound-photo" aria-hidden="true">
      <img
        v-for="(row, i) in rows"
        :key="row.sub"
        :src="row.image.src"
        :srcset="row.image.srcset"
        sizes="(max-width: 900px) 100vw, 40vw"
        alt=""
        :class="{ on: i === activeRow }"
        width="800"
        height="1000"
        loading="lazy"
      />
    </div>

    <div class="sound-list">
      <ul data-r @mouseleave="leaveRows">
        <li
          v-for="(row, i) in rows"
          :key="row.sub"
          ref="rowEls"
          :class="{ active: i === activeRow }"
          @mouseenter="hoverRow(i)"
          @focusin="hoverRow(i)"
        >
          <RouterLink :to="row.to" class="row-link">
            <span class="row-name">{{ rowName(row) }}</span>
            <span class="row-from">{{ rowFrom(row) }}</span>
          </RouterLink>
          <div class="row-desc">
            <div>
              <p>{{ t(`sound.rows.${row.sub}`) }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* ---------- choose your sound ---------- */
.sound {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  padding-top: var(--section-gap);
}

.sound-h {
  grid-column: 7 / span 6;
  grid-row: 1;
  font-size: var(--step-head);
  padding-top: 4vh;
  margin-bottom: 48px;
}

.sound-photo {
  grid-column: 1 / span 5;
  grid-row: 1 / span 2;
  position: sticky;
  top: calc(var(--header-h) + 6vh);
  align-self: start;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--surface);
}

.sound-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition:
    opacity 420ms ease,
    transform 1200ms var(--ease-out);
}

.sound-photo img.on {
  opacity: 1;
  transform: scale(1);
}

.sound-list {
  grid-column: 7 / span 6;
  grid-row: 2;
  padding-bottom: 12vh;
}

.sound-list li {
  color: var(--muted);
  transition: color var(--dur) ease;
}

.sound-list li.active {
  color: var(--ink);
}

.row-link {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  min-height: 58px;
  padding-block: 14px;
}

.row-name {
  font-size: var(--step-lead);
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: transform var(--dur) var(--ease-out);
}

.active .row-name {
  transform: translateX(10px);
}

.row-from {
  font-size: var(--step-small);
  white-space: nowrap;
}

.active .row-from {
  color: var(--accent);
}

.row-desc {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 420ms var(--ease-out);
}

.row-desc > div {
  overflow: hidden;
}

.row-desc p {
  max-width: 40ch;
  padding: 0 0 18px 10px;
  color: var(--ink);
}

.active .row-desc {
  grid-template-rows: 1fr;
}

@media (max-width: 900px) {
  .sound {
    display: block;
  }

  .sound-photo {
    position: sticky;
    top: var(--header-h);
    z-index: 2;
    aspect-ratio: auto;
    height: 38svh;
    margin-inline: calc(-1 * var(--gutter));
  }

  .sound-h {
    padding-top: 0;
    margin-bottom: 24px;
  }

  .sound-list {
    padding-top: 32px;
  }

  .row-link {
    min-height: 56px;
  }
}
</style>
