<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import { photo } from '@/data/images'

const { t, tm } = useI18n()

const serviceImages = [photo('s-fretboard'), photo('s-room'), photo('s-acoustic'), photo('s-player')]
const blocks = computed(() => tm('service.blocks'))
</script>

<template>
  <section class="service" aria-labelledby="service-h">
    <div class="service-grid wrap">
      <h2 id="service-h" class="service-head">{{ t('service.heading') }}</h2>
      <div class="service-blocks">
        <article v-for="(b, i) in blocks" :key="b.title" v-reveal class="block" :class="{ flip: i % 2 }">
          <h3 data-r>{{ b.title }}</h3>
          <div class="block-row">
            <img
              :src="serviceImages[i].src"
              :srcset="serviceImages[i].srcset"
              sizes="(max-width: 720px) 50vw, 200px"
              alt=""
              width="420"
              height="560"
              loading="lazy"
              data-r
            />
            <ul data-r>
              <li v-for="line in b.lines" :key="line">{{ line }}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- service ---------- */
.service {
  background: var(--curtain);
  margin-top: var(--section-gap);
  padding-block: clamp(80px, 10vw, 160px);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
}

.service-head {
  grid-column: 1 / span 5;
  align-self: start;
  position: sticky;
  top: calc(var(--header-h) + 32px);
  font-size: var(--step-head);
  font-weight: 600;
}

.service-blocks {
  grid-column: 7 / span 6;
  display: grid;
  gap: 88px;
}

.block h3 {
  font-size: var(--step-lead);
  letter-spacing: -0.025em;
  margin-bottom: 24px;
}

.block-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  align-items: start;
}

.block.flip .block-row {
  grid-template-columns: 1fr 200px;
}

.block.flip img {
  order: 2;
}

.block img {
  width: 200px;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.block ul {
  display: grid;
  gap: 14px;
}

@media (max-width: 900px) {
  .service-grid {
    display: block;
  }

  .service-head {
    top: var(--header-h);
    z-index: 2;
    background: var(--curtain);
    padding-block: 12px;
    font-size: 9vw;
    margin-bottom: 32px;
  }

  .service-blocks {
    gap: 72px;
  }

  .block-row,
  .block.flip .block-row {
    grid-template-columns: 1fr;
  }

  .block.flip img {
    order: 0;
  }

  .block img {
    width: 100%;
    aspect-ratio: 4 / 3;
  }
}
</style>
